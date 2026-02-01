import Header from "@/components/layout/Header";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { useThemeContext } from "@/contexts/ThemeContext";
import { getMembers } from "@/services/member.service";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useFocusEffect } from "expo-router";
import { useCallback } from "react";


export default function WhatsAppScreen() {
  const { colors } = useThemeContext();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [message, setMessage] = useState("Hi! This is from GymEasy.");

  const TABS = ["All", "Expired", "Expiring Soon"];

  const messageTemplates = [
    { id: 1, label: "Gym Closed", text: "Our gym is closed today. We will be back tomorrow!" },
    { id: 2, label: "Fees Reminder", text: "Your membership fees are due soon. Please pay to continue your membership." },
    { id: 3, label: "Special Offer", text: "🎉 Special offer: Refer a friend and get 1 month free! Check your membership dashboard." },
    { id: 4, label: "New Class", text: "📢 New class launched! Check out our latest fitness classes and join us." },
    { id: 5, label: "Welcome", text: "Welcome to our gym! We're excited to have you. Start your fitness journey with us today! 💪" },
    { id: 6, label: "Renewal Notice", text: "Your membership is expiring soon. Renew now to continue uninterrupted access." },
    { id: 7, label: "Birthday Offer", text: "🎂 Happy Birthday! Here's a special birthday offer just for you. Come celebrate with us!" },
    { id: 8, label: "Equipment Update", text: "✨ Check out our new gym equipment! Come experience the upgrade." },
    { id: 9, label: "Seasonal Discount", text: "🏋️ Limited time seasonal discount available! Get up to 30% off on annual plans." },
    { id: 10, label: "Feedback Request", text: "We'd love to hear from you! Share your feedback and help us improve." },
  ];

const fetchMembers = async () => {
  try {
    setLoading(true);
    const data = await getMembers();
    setMembers(data || []);
  } catch (err) {
    console.log("FETCH MEMBERS ERROR:", err);
    setMembers([]);
  } finally {
    setLoading(false);
  }
};

useFocusEffect(
  useCallback(() => {
    fetchMembers();
  }, [])
);

const getMemberStatus = (member: any) => {
  if (!member.expiry) return "Active";

  const today = new Date();
  const expiry = new Date(member.expiry);

  if (isNaN(expiry.getTime())) return "Active";

  if (expiry < today) return "Expired";

  if (isExpiringSoon(member.expiry)) return "Expiring Soon";

  return "Active";
};

const isExpiringSoon = (expiry?: string) => {
  if (!expiry) return false;

  const today = new Date();
  const exp = new Date(expiry);

  if (isNaN(exp.getTime())) return false;

  const diffDays =
    (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  return diffDays > 0 && diffDays <= 7;
};




const filteredMembers = (members || [])
  .filter((m) => {
    const status = getMemberStatus(m);

    // TAB FILTER
    if (activeTab !== "All" && status !== activeTab) {
      return false;
    }

    // SEARCH FILTER
    if (search) {
      return (
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.phone?.includes(search)
      );
    }

    return true;
  })
  .sort((a, b) => {
    const order = { "Expired": 0, "Expiring Soon": 1, "Active": 2 };

    return (
      order[getMemberStatus(a)] - order[getMemberStatus(b)]
    );
  });



  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, "");
    
    // If it doesn't start with country code, add India's code
    if (!cleaned.startsWith("91") && cleaned.length === 10) {
      cleaned = "91" + cleaned;
    }
    
    return cleaned;
  };

  const openWhatsApp = async (memberName: string, memberPhone: string) => {
    try {
      const formattedPhone = formatPhoneNumber(memberPhone);
      const encodedMessage = encodeURIComponent(message);
      
      // WhatsApp URL scheme for app
      const whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
      
      // Check if WhatsApp is installed
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback to web URL
        const webUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.log("WHATSAPP ERROR:", error);
      Alert.alert("Error", "Unable to open WhatsApp. Please try again.");
    }
  };

  const renderMember = ({ item }: any) => (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity
        style={styles.whatsappBtn}
        onPress={() => openWhatsApp(item.name, item.phone)}
      >
        <Ionicons name="logo-whatsapp" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loader}>
            <Text style={{ color: "#fff" }}>Loading members...</Text>
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.safeArea}>
        <Header title="WhatsApp" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.container}>
          {/* MESSAGE INPUT WITH TEMPLATES */}
          <View style={styles.messageSection}>
          <Text style={styles.sectionLabel}>Message Template</Text>
          <View style={styles.messageBox}>
            <TextInput
              placeholder="Enter your message..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={1000}
            />
            <Text style={styles.charCount}>
              {message.length}/1000
            </Text>
            
            {/* Quick Templates - Horizontal Scrollable */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.templatesScroll}
              contentContainerStyle={styles.templatesContent}
            >
              {messageTemplates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={[styles.templateBtn, { borderColor: colors.primary, backgroundColor: `${colors.primary}26` }]}
                  onPress={() => setMessage(template.text)}
                >
                  <Text style={[styles.templateBtnText, { color: colors.primary }]}>{template.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && [styles.tabActive, { backgroundColor: colors.primary, borderColor: colors.primary }]
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#cfcfcf" />
          <TextInput
            placeholder="Search members..."
            placeholderTextColor="#cfcfcf"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* MEMBERS LIST */}
        {filteredMembers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#cfcfcf" />
            <Text style={styles.emptyText}>
              {search ? "No members found" : "No members available"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredMembers}
            renderItem={renderMember}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            contentContainerStyle={styles.membersList}
          />
        )}
        </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100,
  },

  templatesScroll: {
    marginTop: 12,
    marginHorizontal: -12,
    paddingHorizontal: 12,
  },

  templatesContent: {
    gap: 8,
    paddingRight: 12,
  },

  templateBtn: {
    backgroundColor: "rgba(66, 230, 149, 0.15)",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#42E695",
    minWidth: 100,
    alignItems: "center",
  },

  templateBtnText: {
    fontSize: 11,
    fontFamily: "Inter-Medium",
    color: "#42E695",
  },

  messageSection: {
    marginBottom: 16,
  },

  sectionLabel: {
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#cfcfcf",
    marginBottom: 8,
  },

  messageBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 12,
  },

  messageInput: {
    color: "#fff",
    fontFamily: "Inter-Regular",
    fontSize: 14,
    minHeight: 80,
    maxHeight: 120,
  },

  charCount: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontFamily: "Inter-Regular",
    marginTop: 8,
    marginBottom: 12,
    textAlign: "right",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    color: "#fff",
    fontFamily: "Inter-Regular",
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },

  tabsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: "#42E695",
    borderColor: "#42E695",
  },

  tabText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#cfcfcf",
  },

  tabTextActive: {
    color: "#000",
  },

  membersList: {
    paddingBottom: 20,
  },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },

  memberInfo: {
    flex: 1,
  },

  memberName: {
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    color: "#fff",
  },

  memberPhone: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#cfcfcf",
    marginTop: 4,
  },

  whatsappBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#cfcfcf",
    marginTop: 12,
  },
});
