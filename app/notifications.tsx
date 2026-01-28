import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { BG_SECONDARY, BORDER_PRIMARY, PRIMARY, TEXT_PRIMARY, TEXT_SECONDARY } from "@/constants/colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { getMembers } from "@/services/member.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useThemeContext();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getMembers();
        const today = new Date();

        // Create notifications for expiring members
        const expiringNotifications = (data || [])
          .filter((member: any) => {
            const expiryDate = new Date(member.expiry);
            const daysLeft = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
            return daysLeft <= 7 && daysLeft > 0;
          })
          .map((member: any) => {
            const expiryDate = new Date(member.expiry);
            const daysLeft = Math.ceil(
              (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );
            return {
              id: `expiry-${member.id}`,
              type: "expiry",
              title: "Membership Expiring Soon",
              message: `${member.name}'s membership expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`,
              time: new Date(),
              member: member,
              daysLeft: daysLeft,
            };
          });

        setNotifications(expiringNotifications);
      } catch (err) {
        console.log("FETCH NOTIFICATIONS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "expiry":
        return "warning";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "expiry":
        return "#fb7185";
      default:
        return PRIMARY;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.primary }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 40 }} />
        </View>

        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={{ color: TEXT_SECONDARY }}>Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={48} color={TEXT_SECONDARY} />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>All caught up! No pending actions.</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={styles.notificationCard}
                onPress={() => {
                  router.push("/(tabs)/members");
                }}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: `${getNotificationColor(notification.type)}33` },
                  ]}
                >
                  <Ionicons
                    name={getNotificationIcon(notification.type)}
                    size={20}
                    color={getNotificationColor(notification.type)}
                  />
                </View>

                <View style={styles.contentBox}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>
                    {formatTime(notification.time)}
                  </Text>
                </View>

                <View style={styles.rightBox}>
                  {notification.type === "expiry" && (
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.badgeText}>
                        {notification.daysLeft}d
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_PRIMARY,
  },

  backButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: TEXT_PRIMARY,
  },

  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 80,
  },

  notificationCard: {
    flexDirection: "row",
    backgroundColor: BG_SECONDARY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_PRIMARY,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  contentBox: {
    flex: 1,
  },

  notificationTitle: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },

  notificationMessage: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: TEXT_SECONDARY,
    marginBottom: 6,
  },

  notificationTime: {
    fontSize: 11,
    fontFamily: "Inter-Regular",
    color: `${TEXT_SECONDARY}99`,
  },

  rightBox: {
    marginLeft: 12,
  },

  badge: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  badgeText: {
    fontSize: 11,
    fontFamily: "Inter-SemiBold",
    color: "#000",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: TEXT_SECONDARY,
    textAlign: "center",
  },
});
