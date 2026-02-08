import Header from "@/components/layout/Header";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassCard from "@/components/ui/GlassCard";
import { getMembers } from "@/services/member.service";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const TABS = ["All", "Active", "Expired", "Expiring Soon"];

/* 🔥 FULL TEMPLATE LIST */
const MESSAGE_TEMPLATES = [
  { id: 1, label: "Gym Closed", text: "Our gym is closed today. We will reopen tomorrow." },
  { id: 2, label: "Fees Reminder", text: "Hi 👋 Your gym membership fees are due. Please renew to continue 💪" },
  { id: 3, label: "Expired", text: "Hi! Your gym membership has expired. Renew today to stay consistent 💪" },
  { id: 4, label: "Expiring Soon", text: "Hi! Your gym membership is expiring soon. Renew early to avoid interruption 🏋️‍♂️" },
  { id: 5, label: "Special Offer", text: "🎉 Special gym offer running now! Contact us for details." },
  { id: 6, label: "Welcome", text: "Welcome to our gym! We're excited to have you on this fitness journey 💪" },
  { id: 7, label: "New Class", text: "📢 New fitness class launched! Ask us for timings." },
  { id: 8, label: "Birthday Wish", text: "🎂 Happy Birthday! Wishing you a strong and healthy year ahead 💪" },
  { id: 9, label: "Feedback", text: "We’d love your feedback! Let us know how we can improve." },
  { id: 10, label: "Season Offer", text: "🔥 Seasonal discounts available. Limited time only!" },
];

const STATUS_COLORS: any = {
  Active: {
    backgroundColor: "rgba(34,197,94,0.18)",
    borderColor: "rgba(34,197,94,0.45)",
  },
  Expired: {
    backgroundColor: "rgba(239,68,68,0.18)",
    borderColor: "rgba(239,68,68,0.45)",
  },
  "Expiring Soon": {
    backgroundColor: "rgba(234,179,8,0.18)",
    borderColor: "rgba(234,179,8,0.45)",
  },
};

export default function WhatsAppScreen() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [message, setMessage] = useState("Hi! This message is from GymEasy.");

  /* ================= FETCH ================= */

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getMembers();
      setMembers(data || []);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchMembers();
  }, []));

  /* ================= STATUS LOGIC (SAME AS MEMBERS) ================= */

  const getExpiryDate = (m: any): Date | null => {
    const raw =
      m.expiryDate ||
      m.expiry ||
      m.expiresAt ||
      m.membershipExpiry;

    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  };

  const isExpiringSoon = (m: any) => {
    const expiry = getExpiryDate(m);
    if (!expiry) return false;

    const diff =
      (expiry.getTime() - Date.now()) /
      (1000 * 60 * 60 * 24);

    return diff > 0 && diff <= 7;
  };

  const getMemberStatus = (m: any) => {
    const expiry = getExpiryDate(m);
    if (!expiry) return "Active";
    if (expiry < new Date()) return "Expired";
    if (isExpiringSoon(m)) return "Expiring Soon";
    return "Active";
  };

  /* ================= FILTER ================= */

  const filteredMembers = members.filter((m) => {
    const status = getMemberStatus(m);
    if (activeTab !== "All" && status !== activeTab) return false;

    if (
      search &&
      !m.name?.toLowerCase().includes(search.toLowerCase()) &&
      !m.phone?.includes(search)
    )
      return false;

    return true;
  });

  /* ================= WHATSAPP ================= */

  const formatPhone = (phone: string) => {
    let cleaned = phone.replace(/\D/g, "");
    if (!cleaned.startsWith("91") && cleaned.length === 10)
      cleaned = "91" + cleaned;
    return cleaned;
  };

  const openWhatsApp = async (phone: string) => {
    try {
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

  /* ================= UI ================= */

  const renderMember = ({ item }: any) => {
    const status = getMemberStatus(item);

    return (
      <GlassCard style={styles.memberCard}>
        <View style={styles.memberRow}>
          <View>
            <Text style={styles.memberName}>{item.name}</Text>
            <Text style={styles.memberPhone}>+91 {item.phone}</Text>
            <Text style={styles.memberMeta}>
              {item.plan || "Standard"} • ₹{item.amount}
            </Text>
          </View>

          <View style={styles.rightActions}>
            <View
              style={[
                styles.statusBadge,
                STATUS_COLORS[status],
              ]}
            >
              <Text style={styles.statusText}>{status}</Text>
            </View>

            <TouchableOpacity
              style={styles.whatsappGlassBtn}
              onPress={() => openWhatsApp(item.phone)}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="WhatsApp" />

        {/* 🔒 STICKY TOP */}
        <View style={styles.stickyContainer}>
          <GlassCard>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type WhatsApp message..."
              placeholderTextColor="#ffffffaa"
              multiline
              style={styles.messageInput}
            />

            {/* 🔥 SCROLLABLE TEMPLATES */}
            <FlatList
              data={MESSAGE_TEMPLATES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(i) => i.id.toString()}
              contentContainerStyle={{ gap: 8, paddingTop: 8 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.templateChip}
                  onPress={() => setMessage(item.text)}
                >
                  <Text style={styles.templateText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </GlassCard>

          {/* TABS */}
          <View style={styles.tabsRow}>
            {TABS.map((t) => {
              const active = activeTab === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.tab,
                    active && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab(t)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      active && styles.tabTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SEARCH */}
          <View style={styles.glassSearch}>
            <Ionicons name="search-outline" size={18} color="#ffffffcc" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search members..."
              placeholderTextColor="#ffffffaa"
              style={styles.glassInput}
            />
          </View>
        </View>

        {/* 📜 ONLY LIST SCROLLS */}
        <FlatList
          data={filteredMembers}
          keyExtractor={(item, i) =>
            item._id?.toString() ?? i.toString()
          }
          renderItem={renderMember}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  stickyContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  messageInput: {
    color: "#fff",
    minHeight: 70,
  },

  templateChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },

  templateText: {
    color: "#fff",
    fontSize: 12,
  },

  tabsRow: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 14,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: "rgba(255,255,255,0.28)",
    borderColor: "rgba(255,255,255,0.45)",
  },

  tabText: {
    fontSize: 12,
    color: "#cfcfcf",
  },

  tabTextActive: {
    color: "#fff",
    fontWeight: "500",
  },

  glassSearch: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },

  glassInput: {
    flex: 1,
    marginLeft: 10,
    color: "#fff",
    fontSize: 14,
  },

  memberCard: {
    marginHorizontal: 16,
    marginBottom: 14,
  },

  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  memberName: {
    fontSize: 15,
    color: "#fff",
  },

  memberPhone: {
    fontSize: 13,
    color: "#cfcfcf",
    marginTop: 2,
  },

  memberMeta: {
    fontSize: 12,
    color: "#a8a8a8",
    marginTop: 3,
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#fff",
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
});
