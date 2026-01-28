import { Toast } from "@/components/Toast";
import { BG_SECONDARY, BORDER_PRIMARY, TEXT_PRIMARY, TEXT_SECONDARY } from "@/constants/colors";
import { getMembers } from "@/services/member.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../../components/layout/Header";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
// import ExpiringSoonSection from "../../components/dashboard/ExpiringSoonSection";
// import RecentPaymentsSection from "../../components/dashboard/RecentPaymentsSection";
import StatsCarousel from "../../components/dashboard/StatsCarousel";

export default function DashboardScreen() {
  const [members, setMembers] = useState<any[]>([]);
  const [expiringMembers, setExpiringMembers] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();
        setMembers(data || []);

        // Calculate expiring members (within 7 days)
        const today = new Date();
        const expiring = (data || []).filter((member: any) => {
          const expiryDate = new Date(member.expiry);
          const daysLeft = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
          return daysLeft <= 7 && daysLeft > 0;
        });
        setExpiringMembers(expiring);

        // Show toast if there are expiring members
        if (expiring.length > 0) {
          setToastMessage(
            `${expiring.length} member${expiring.length > 1 ? "s" : ""} expiring soon!`
          );
          setShowToast(true);
        }
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
          {/* EXPIRING MEMBERS NOTIFICATION */}
          {expiringMembers.length > 0 && (
            <View style={styles.notificationBanner}>
              <View style={styles.notificationIcon}>
                <Ionicons name="warning" size={20} color="#fff" />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Members Expiring Soon</Text>
                <Text style={styles.notificationText}>
                  {expiringMembers.length} member{expiringMembers.length > 1 ? "s" : ""} will expire within 7 days
                </Text>
              </View>
            </View>
          )}
          <StatsCarousel />

          {/* EXPIRING SOON SECTION */}
          {expiringMembers.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Members Expiring Soon</Text>
              </View>
              {expiringMembers.slice(0, 3).map((member) => {
                const expiryDate = new Date(member.expiry);
                const today = new Date();
                const daysLeft = Math.ceil(
                  (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <View key={member.id} style={styles.memberItem}>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberPlan}>{member.plan} Plan</Text>
                    </View>
                    <View style={[styles.daysBadge, { backgroundColor: `${daysLeft <= 3 ? "#ff4d4f" : "#faad14"}33` }]}>
                      <Text style={[styles.daysText, { color: daysLeft <= 3 ? "#ff4d4f" : "#faad14" }]}>
                        {daysLeft}d
                      </Text>
                    </View>
                  </View>
                );
              })}
              {expiringMembers.length > 3 && (
                <Text style={styles.viewMore}>+{expiringMembers.length - 3} more</Text>
              )}
            </View>
          )}

          {/* <RecentPaymentsSection /> */}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100, // for tab bar
  },

  notificationBanner: {
    flexDirection: "row",
    backgroundColor: BG_SECONDARY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(251, 113, 133, 0.3)",
    padding: 14,
    marginBottom: 20,
    alignItems: "center",
  },

  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(251, 113, 133, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  notificationContent: {
    flex: 1,
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

  section: {
    marginTop: 28,
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: TEXT_PRIMARY,
  },

  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: BG_SECONDARY,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },

  memberInfo: {
    flex: 1,
  },

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

  daysBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  daysText: {
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
  },

  viewMore: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: TEXT_SECONDARY,
    marginTop: 8,
  },
});
