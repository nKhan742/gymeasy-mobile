import { Toast } from "@/components/Toast";
import {
  BG_SECONDARY,
  BORDER_PRIMARY,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/colors";
import { getMembers } from "@/services/member.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Header from "../../components/layout/Header";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import StatsCarousel from "../../components/dashboard/StatsCarousel";

export default function DashboardScreen() {
  const [members, setMembers] = useState<any[]>([]);
  const [expiringMembers, setExpiringMembers] = useState<any[]>([]);
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);


  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

useEffect(() => {
  const fetchMembers = async () => {
    try {
      const data = await getMembers();
      const allMembers = data || [];
      setMembers(allMembers);

      const today = new Date();

      /* EXPIRING MEMBERS (≤ 7 days) */
      const expiring = allMembers.filter((m: any) => {
        const expiry = new Date(m.expiry);
        const daysLeft =
          (expiry.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24);
        return daysLeft <= 7 && daysLeft > 0;
      });
      setExpiringMembers(expiring);

      if (expiring.length > 0) {
        setToastMessage(
          `${expiring.length} member${
            expiring.length > 1 ? "s" : ""
          } expiring soon`
        );
        setShowToast(true);
      }

      /* ACTIVE MEMBERS */
      const active = allMembers.filter(
        (m: any) => m.status === "active"
      );
      setActiveCount(active.length);

      /* TOTAL REVENUE */
      const revenue = allMembers.reduce(
        (sum: number, m: any) => sum + (m.amount || 0),
        0
      );
      setTotalRevenue(revenue);

      /* MONTHLY REVENUE */
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthly = allMembers.reduce((sum: number, m: any) => {
        if (!m.amount || !m.joiningDate) return sum;

        const paidDate = new Date(m.joiningDate);

        if (
          paidDate.getMonth() === currentMonth &&
          paidDate.getFullYear() === currentYear
        ) {
          return sum + m.amount;
        }

        return sum;
      }, 0);

      setMonthlyRevenue(monthly);

      /* RECENTLY ADDED MEMBERS (last 7 days) */
      const recent = allMembers.filter((m: any) => {
        const joinDate = new Date(m.joiningDate);
        const diff =
          (today.getTime() - joinDate.getTime()) /
          (1000 * 60 * 60 * 24);
        return diff <= 7;
      });
      setRecentMembers(recent);
    } catch (err) {
      console.log("FETCH MEMBERS ERROR:", err);
    }
  };

  fetchMembers();
}, []);


  return (
    <ScreenWrapper>

      <Toast
        visible={showToast}
        message={toastMessage}
        type="warning"
        duration={4000}
        onHide={() => setShowToast(false)}
      />
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* NOTIFICATION */}
          {expiringMembers.length > 0 && (
            <View style={styles.notificationBanner}>
              <View style={styles.notificationIcon}>
                <Ionicons name="warning" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notificationTitle}>
                  Memberships Expiring Soon
                </Text>
                <Text style={styles.notificationText}>
                  {expiringMembers.length} member(s) expiring within 7 days
                </Text>
              </View>
            </View>
          )}

          {/* STATS */}
          <StatsCarousel
            totalMembers={members.length}
            // activeMembers={activeCount}
            totalRevenue={totalRevenue}
            expiringCount={expiringMembers.length}
            monthlyRevenue={monthlyRevenue}
          />

          {/* EXPIRING MEMBERS LIST */}
          {expiringMembers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Members Expiring Soon
              </Text>

              {expiringMembers.slice(0, 3).map((member) => (
                <View key={member.id} style={styles.memberItem}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.name}
                    </Text>
                    <Text style={styles.memberPlan}>
                      Expires on{" "}
                      {new Date(member.expiry).toDateString()}
                    </Text>
                  </View>
                </View>
              ))}

              {expiringMembers.length > 3 && (
                <Text style={styles.viewMore}>
                  +{expiringMembers.length - 3} more
                </Text>
              )}
            </View>
          )}

          {/* RECENT MEMBERS */}
          {recentMembers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Recently Added Members
              </Text>

              {recentMembers.slice(0, 3).map((member) => (
                <View key={member.id} style={styles.memberItem}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.name}
                    </Text>
                    <Text style={styles.memberPlan}>
                      Joined on{" "}
                      {new Date(
                        member.joiningDate
                      ).toDateString()}
                    </Text>
                  </View>
                </View>
              ))}

              {recentMembers.length > 3 && (
                <Text style={styles.viewMore}>
                  +{recentMembers.length - 3} more
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },

  notificationBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG_SECONDARY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(251,113,133,0.3)",
    padding: 14,
    marginBottom: 20,
  },

  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(251,113,133,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  notificationTitle: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },

  notificationText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: TEXT_SECONDARY,
  },

  section: { marginTop: 28 },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: TEXT_PRIMARY,
    marginBottom: 14,
  },

  memberItem: {
    backgroundColor: BG_SECONDARY,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_PRIMARY,
    padding: 12,
    marginBottom: 10,
  },

  memberInfo: { flex: 1 },

  memberName: {
    fontSize: 13,
    fontFamily: "Inter-SemiBold",
    color: TEXT_PRIMARY,
    marginBottom: 3,
  },

  memberPlan: {
    fontSize: 11,
    fontFamily: "Inter-Regular",
    color: TEXT_SECONDARY,
  },

  viewMore: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: TEXT_SECONDARY,
    marginTop: 8,
  },
});
