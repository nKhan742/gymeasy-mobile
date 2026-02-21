import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassCard from "@/components/ui/GlassCard";
import {
  PRIMARY,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/colors";
import { getMembers } from "@/services/member.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  UIManager,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";

const DISMISSED_KEY = "dismissed_notifications";

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔥 ENABLE ANDROID LAYOUT ANIMATION */
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  /* ---------------- LOAD DISMISSED ---------------- */
  useEffect(() => {
    AsyncStorage.getItem(DISMISSED_KEY).then((v) => {
      if (v) setDismissed(JSON.parse(v));
    });
  }, []);

  const persistDismissed = async (ids: string[]) => {
    setDismissed(ids);
    await AsyncStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
  };

  /* ---------------- FETCH ---------------- */
  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        try {
          setLoading(true);
          const members = await getMembers();
          const today = new Date();
          const list: any[] = [];

          (members || []).forEach((m: any) => {
            if (!m.expiry) return;

            const diffDays = Math.ceil(
              (new Date(m.expiry).getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            if (diffDays <= 0) {
              list.push({
                id: `expired-${m._id}`,
                type: "expired",
                title: "Membership Expired",
                message: `${m.name}'s membership has expired`,
                time: new Date(),
              });
            } else if (diffDays <= 7) {
              list.push({
                id: `expiry-${m._id}`,
                type: "expiry",
                title: "Membership Expiring Soon",
                message: `${m.name}'s membership expires in ${diffDays} day${diffDays > 1 ? "s" : ""}`,
                time: new Date(),
              });
            }

            if (m.createdAt) {
              const hrs =
                (today.getTime() - new Date(m.createdAt).getTime()) /
                (1000 * 60 * 60);
              if (hrs <= 24) {
                list.push({
                  id: `new-${m._id}`,
                  type: "new",
                  title: "New Member Added",
                  message: `${m.name} has joined the gym`,
                  time: new Date(m.createdAt),
                });
              }
            }
          });

          setNotifications(
            list.filter((n) => !dismissed.includes(n.id))
          );
        } catch (e) {
          console.log("NOTIFICATION ERROR:", e);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }, [dismissed])
  );

  /* ---------------- DISMISS ---------------- */
  const dismiss = async (id: string) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );
    const updated = [...dismissed, id];
    await persistDismissed(updated);
    setNotifications((p) => p.filter((n) => n.id !== id));
  };

  const clearAll = async () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );
    const ids = notifications.map((n) => n.id);
    await persistDismissed([...dismissed, ...ids]);
    setNotifications([]);
  };

  /* ---------------- UI HELPERS ---------------- */
  const icon = (t: string) =>
    t === "expired" ? "close-circle" : t === "expiry" ? "warning" : "person-add";

  const color = (t: string) =>
    t === "expired" ? "#ef4444" : t === "expiry" ? "#f59e0b" : "#22c55e";

  const timeAgo = (d: Date) => {
    const m = Math.floor((Date.now() - +new Date(d)) / 60000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    return `${Math.floor(m / 60)}h ago`;
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>Notifications</Text>

            {notifications.length > 0 ? (
              <TouchableOpacity onPress={clearAll}>
                <Text style={styles.clear}>Clear all</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 60 }} />
            )}
          </View>

          {/* Hairline */}
          <View style={styles.headerDivider} />
        </View>

        {/* BODY */}
        {loading ? (
          <View style={styles.center}>
            <Text style={{ color: TEXT_SECONDARY }}>Loading…</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.center}>
            <Ionicons
              name="notifications-off"
              size={48}
              color={TEXT_SECONDARY}
            />
            <Text style={styles.empty}>No notifications</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {notifications.map((n) => (
              <View key={n.id} style={styles.rowWrapper}>
                <Swipeable
                  renderRightActions={() => (
                    <View style={styles.swipeDelete}>
                      <Ionicons name="trash" size={20} color="#fff" />
                    </View>
                  )}
                  onSwipeableOpen={() => dismiss(n.id)}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      dismiss(n.id);
                      router.push("/(tabs)/members");
                    }}
                  >
                    <GlassCard>
  <View style={styles.cardRow}>
    <View
      style={[
        styles.iconBox,
        { backgroundColor: `${color(n.type)}33` },
      ]}
    >
      <Ionicons
        name={icon(n.type)}
        size={20}
        color={color(n.type)}
      />
    </View>

    <View style={styles.cardContent}>
      <Text style={styles.title}>{n.title}</Text>
      <Text style={styles.msg}>{n.message}</Text>
      <Text style={styles.time}>{timeAgo(n.time)}</Text>
    </View>

    <TouchableOpacity
      onPress={() => dismiss(n.id)}
      style={styles.close}
    >
      <Ionicons
        name="close"
        size={16}
        color={TEXT_SECONDARY}
      />
    </TouchableOpacity>
  </View>
</GlassCard>

                  </TouchableOpacity>
                </Swipeable>
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "transparent",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  headerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  clear: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter-Medium",
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  rowWrapper: {
    marginBottom: 14, // ✅ FIXED SPACING
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    marginTop: 12,
    color: TEXT_PRIMARY,
    fontFamily: "Inter-SemiBold",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    minHeight: 84,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  title: {
    color: TEXT_PRIMARY,
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
  },
  msg: {
    color: TEXT_SECONDARY,
    fontSize: 12,
    marginVertical: 4,
  },
  time: {
    color: `${TEXT_SECONDARY}99`,
    fontSize: 11,
  },
  swipeDelete: {
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    width: 72,
    borderRadius: 12,
  },
  cardRow: {
  flexDirection: "row",
  alignItems: "center",
},

cardContent: {
  flex: 1,
},

close: {
  position: "absolute",
  top: 0,
  right: 0,
},

});
