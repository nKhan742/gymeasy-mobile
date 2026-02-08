import { Toast } from "@/components/Toast";
import GlassCard from "@/components/ui/GlassCard";
import {
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/colors";
import { getMembers } from "@/services/member.service";
import AuthService from "@/services/auth.service";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Header from "@/components/layout/Header";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import StatsCarousel from "@/components/dashboard/StatsCarousel";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

export default function DashboardScreen() {
  const router = useRouter();

  const [gymName, setGymName] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [expiringMembers, setExpiringMembers] = useState<any[]>([]);
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  /* ================= WHATSAPP (SAME AS WhatsAppScreen) ================= */

  const formatPhone = (phone: string) => {
    let cleaned = phone.replace(/\D/g, "");
    if (!cleaned.startsWith("91") && cleaned.length === 10) {
      cleaned = "91" + cleaned;
    }
    return cleaned;
  };

  const openWhatsApp = async (phone: string, message: string) => {
    try {
      if (!phone) return;

      const formatted = formatPhone(phone);
      const encoded = encodeURIComponent(message);

      const appUrl = `whatsapp://send?phone=${formatted}&text=${encoded}`;
      const webUrl = `https://wa.me/${formatted}?text=${encoded}`;

      const canOpen = await Linking.canOpenURL(appUrl);
      await Linking.openURL(canOpen ? appUrl : webUrl);
    } catch {
      Alert.alert("Error", "Unable to open WhatsApp");
    }
  };

  const renewMessage = (name: string, expiry: string) =>
    `Hi ${name} 👋\n\nYour gym membership is expiring on ${expiry}.\nPlease renew your membership as soon as possible to avoid interruption 💪\n\n– ${gymName}`;

  const welcomeMessage = (name: string) =>
    `Welcome to ${gymName}, ${name}! 💪\n\nWe’re excited to have you with us.\nLet us know if you need any help getting started.\n\n– ${gymName}`;

  /* ================= LOAD DASHBOARD ================= */

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const me = await AuthService.getMe();
        setGymName(
          me?.gymName ||
          me?.gym?.gymName ||
          me?.user?.gym?.gymName ||
          ""
        );

        const allMembers = (await getMembers()) || [];
        setMembers(allMembers);

        const today = new Date();

        /* EXPIRING ≤ 7 DAYS */
        const expiring = allMembers.filter((m: any) => {
          const expiry = new Date(m.expiryDate ?? m.expiry);
          const diff =
            (expiry.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24);
          return diff > 0 && diff <= 7;
        });

        setExpiringMembers(expiring);

        if (expiring.length > 0) {
          setToastMessage(
            `${expiring.length} member${expiring.length > 1 ? "s" : ""} expiring soon`
          );
          setShowToast(true);
        }

        /* TOTAL REVENUE */
        setTotalRevenue(
          allMembers.reduce(
            (sum: number, m: any) => sum + (m.amount || 0),
            0
          )
        );

        /* MONTHLY REVENUE */
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();

        setMonthlyRevenue(
          allMembers.reduce((sum: number, m: any) => {
            if (!m.amount || !m.joiningDate) return sum;
            const d = new Date(m.joiningDate);
            return d.getMonth() === month && d.getFullYear() === year
              ? sum + m.amount
              : sum;
          }, 0)
        );

        /* RECENT ≤ 7 DAYS */
        setRecentMembers(
          allMembers.filter((m: any) => {
            const joined = new Date(m.joiningDate);
            const diff =
              (today.getTime() - joined.getTime()) /
              (1000 * 60 * 60 * 24);
            return diff <= 7;
          })
        );
      } catch (e) {
        console.log("DASHBOARD ERROR:", e);
      }
    };

    loadDashboard();
  }, []);

  const goToMember = (memberId: string) => {
    router.push({
      pathname: "/members/member-profile",
      params: { memberId },
    });
  };

  /* ================= UI ================= */

  return (
    <ScreenWrapper>
      <Toast
        visible={showToast}
        message={toastMessage}
        type="warning"
        duration={4000}
        onHide={() => setShowToast(false)}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <Header title={gymName || "Dashboard"} />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <StatsCarousel
            totalMembers={members.length}
            totalRevenue={totalRevenue}
            expiringCount={expiringMembers.length}
            monthlyRevenue={monthlyRevenue}
          />

          {/* EXPIRING MEMBERS */}
          {expiringMembers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Members Expiring Soon
              </Text>

              {expiringMembers.slice(0, 3).map((m) => (
                <TouchableOpacity
                  key={m._id}
                  onPress={() => goToMember(m._id)}
                >
                  <GlassCard style={styles.memberCard}>
                    <View style={styles.memberRow}>
                      <View>
                        <Text style={styles.memberName}>{m.name}</Text>
                        <Text style={styles.memberMeta}>
                          Expires on{" "}
                          {new Date(m.expiryDate ?? m.expiry).toDateString()}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.whatsappGlassBtn}
                        onPress={() =>
                          openWhatsApp(
                            m.phone,
                            renewMessage(
                              m.name,
                              new Date(m.expiryDate ?? m.expiry).toDateString()
                            )
                          )
                        }
                      >
                        <Ionicons
                          name="logo-whatsapp"
                          size={18}
                          color="#25D366"
                        />
                      </TouchableOpacity>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              ))}

              {expiringMembers.length > 3 && (
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/members")}
                >
                  <Text style={styles.viewMore}>
                    +{expiringMembers.length - 3} more
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* RECENT MEMBERS */}
          {recentMembers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Recently Added Members
              </Text>

              {recentMembers.slice(0, 3).map((m) => (
                <TouchableOpacity
                  key={m._id}
                  onPress={() => goToMember(m._id)}
                >
                  <GlassCard style={styles.memberCard}>
                    <View style={styles.memberRow}>
                      <View>
                        <Text style={styles.memberName}>{m.name}</Text>
                        <Text style={styles.memberMeta}>
                          Joined on{" "}
                          {new Date(m.joiningDate).toDateString()}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.whatsappGlassBtn}
                        onPress={() =>
                          openWhatsApp(
                            m.phone,
                            welcomeMessage(m.name)
                          )
                        }
                      >
                        <Ionicons
                          name="logo-whatsapp"
                          size={18}
                          color="#25D366"
                        />
                      </TouchableOpacity>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              ))}

              {recentMembers.length > 3 && (
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/members")}
                >
                  <Text style={styles.viewMore}>
                    +{recentMembers.length - 3} more
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: TEXT_PRIMARY,
    marginBottom: 14,
  },

  memberCard: {
    marginBottom: 10,
  },

  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  memberName: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: TEXT_PRIMARY,
  },

  memberMeta: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: TEXT_SECONDARY,
    marginTop: 4,
  },

  whatsappGlassBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  viewMore: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: TEXT_SECONDARY,
  },
});
