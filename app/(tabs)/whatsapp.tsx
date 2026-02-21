import Header from "@/components/layout/Header";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassCard from "@/components/ui/GlassCard";
import { getMembers } from "@/services/member.service";
import { useAuth } from "@/hooks/useAuth";
import { useExercisesStore } from "@/store/exercises.store";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useCallback, useState, useMemo } from "react";
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
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

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
  const { user } = useAuth();
  const gym = typeof user?.gym === 'object' ? user?.gym : null;
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [message, setMessage] = useState("Hi! This message is from GymEasy.");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [selectedMessageTemplate, setSelectedMessageTemplate] = useState<string | null>(null);
  const [showMessageDropdown, setShowMessageDropdown] = useState(false);
  const [selectedExerciseTemplate, setSelectedExerciseTemplate] = useState<string | null>(null);
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);
  
  const { selectedExercises } = useExercisesStore();
  const FILTER_OPTIONS = ["All", "Active", "Expired", "Expiring Soon"];

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getMembers();
      setMembers(data || []);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMembers();
    }, [])
  );

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
    const diff = (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 7;
  };

  const getMemberStatus = (m: any) => {
    const expiry = getExpiryDate(m);
    if (!expiry) return "Active";
    if (expiry < new Date()) return "Expired";
    if (isExpiringSoon(m)) return "Expiring Soon";
    return "Active";
  };

  const filteredMembers = members.filter((m) => {
    const status = getMemberStatus(m);
    if (activeTab !== "All") {
      if (activeTab === "Active" && status !== "Active") return false;
      if (activeTab === "Expired" && status !== "Expired") return false;
      if (activeTab === "Expiring Soon" && status !== "Expiring Soon") return false;
    }
    if (search && !m.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
            <View style={[styles.statusBadge, STATUS_COLORS[status]]}>
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
        <View style={styles.stickyContainer}>
          <GlassCard>
            {/* TWO DROPDOWNS SIDE BY SIDE */}
            <View style={styles.dropdownsContainer}>
              {/* MESSAGE TEMPLATE DROPDOWN */}
              <View style={styles.dropdownHalf}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => {
                    setShowMessageDropdown(!showMessageDropdown);
                    setShowExerciseDropdown(false);
                  }}
                >
                  <Ionicons name="chevron-down" size={16} color="#42E695" />
                  <Text style={styles.dropdownLabel}>
                    {selectedMessageTemplate || "Message"}
                  </Text>
                </TouchableOpacity>

                {/* MESSAGE DROPDOWN MENU */}
                {showMessageDropdown && (
                  <ScrollView style={styles.dropdownMenu} nestedScrollEnabled>
                    {MESSAGE_TEMPLATES.map((template) => (
                      <TouchableOpacity
                        key={template.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setMessage(template.text);
                          setSelectedMessageTemplate(template.label);
                          setSelectedExerciseTemplate(null);
                          setShowMessageDropdown(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            selectedMessageTemplate === template.label &&
                              styles.dropdownItemActive,
                          ]}
                        >
                          {template.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* EXERCISE TEMPLATE DROPDOWN */}
              {selectedExercises.length > 0 && (
                <View style={styles.dropdownHalf}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => {
                      setShowExerciseDropdown(!showExerciseDropdown);
                      setShowMessageDropdown(false);
                    }}
                  >
                    <Ionicons name="chevron-down" size={16} color="#42E695" />
                    <Text style={styles.dropdownLabel}>
                      {selectedExerciseTemplate || "Exercise"}
                    </Text>
                  </TouchableOpacity>

                  {/* EXERCISE DROPDOWN MENU */}
                  {showExerciseDropdown && (
                    <ScrollView style={styles.dropdownMenu} nestedScrollEnabled>
                      {selectedExercises.map((exercise: any, idx: number) => (
                        <TouchableOpacity
                          key={idx}
                          style={styles.dropdownItem}
                          onPress={() => {
                            const exerciseText = `💪 ${exercise.name}:\n${exercise.exercises
                              ?.map((ex: string) => `• ${ex}`)
                              .join("\n")}`;
                            setMessage(exerciseText);
                            setSelectedExerciseTemplate(exercise.name);
                            setSelectedMessageTemplate(null);
                            setShowExerciseDropdown(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              selectedExerciseTemplate === exercise.name &&
                                styles.dropdownItemActive,
                            ]}
                          >
                            {exercise.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>

            {/* MESSAGE INPUT */}
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type WhatsApp message..."
              placeholderTextColor="#ffffffaa"
              multiline
              style={styles.messageInput}
            />
          </GlassCard>
          <View style={styles.glassSearch}>
            <Ionicons name="search-outline" size={18} color="#ffffffcc" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search members..."
              placeholderTextColor="#ffffffaa"
              style={styles.glassInput}
            />
            <TouchableOpacity
              style={styles.filterFab}
              onPress={() => setShowFilterPopup(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="filter" size={26} color="#ffffffcc" style={{ alignSelf: 'center' }} />
            </TouchableOpacity>
          </View>

          {/* FILTER TAG DISPLAY */}
          <View style={styles.filterTagContainer}>
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>{activeTab}</Text>
            </View>
          </View>

          {/* Filter Popup */}
          {showFilterPopup && (
            <Modal visible transparent animationType="fade">
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowFilterPopup(false)}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Filter</Text>
                  {FILTER_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.planOption,
                        activeTab === option && styles.planOptionActive,
                      ]}
                      onPress={() => {
                        setActiveTab(option);
                        setShowFilterPopup(false);
                      }}
                    >
                      <Text style={[
                        styles.planOptionText,
                        activeTab === option && styles.planOptionTextActive,
                      ]}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </View>
        <FlatList
          data={filteredMembers}
          keyExtractor={(item, i) => item._id?.toString() ?? i.toString()}
          renderItem={renderMember}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  filterTagContainer: {
    marginBottom: 12,
    marginTop: 0,
  },
  filterTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(66,230,149,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(66,230,149,0.35)',
  },
  filterTagText: {
    color: '#42E695',
    fontSize: 12,
    fontWeight: '600',
  },
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
    marginTop: 16, // Added margin top
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
  filterFab: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 2,
    padding: 0,
    elevation: 0,
    alignSelf: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#231a36',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  planOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 10,
  },
  planOptionActive: {
    backgroundColor: 'rgba(66,230,149,0.2)',
    borderColor: '#42E695',
  },
  planOptionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  planOptionTextActive: {
    color: '#42E695',
  },
  dropdownsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  dropdownHalf: {
    flex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(66,230,149,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(66,230,149,0.3)',
    justifyContent: 'center',
    gap: 6,
  },
  dropdownLabel: {
    color: '#42E695',
    fontSize: 12,
    fontWeight: '600',
  },
  dropdownMenu: {
    maxHeight: 150,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginTop: 6,
    marginBottom: 12,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  dropdownItemText: {
    color: '#cfcfcf',
    fontSize: 13,
  },
  dropdownItemActive: {
    color: '#42E695',
    fontWeight: '600',
  },

});

