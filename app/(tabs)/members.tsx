import Header from "@/components/layout/Header";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassCard from "@/components/ui/GlassCard";
import { getMembers, toggleMemberFeesPaid } from "@/services/member.service";
import { Alert as RNAlert } from "react-native";
import { getTodayAttendance } from "@/services/attendance.service";
const showAlert = (title: string, message: string, actions?: any[]) => {
  if (typeof RNAlert !== "undefined" && RNAlert.alert) {
    RNAlert.alert(title, message, actions);
  } else if (typeof window !== 'undefined' && window.confirm) {
    if (window.confirm(`${title}\n${message}`)) {
      actions && actions[1]?.onPress && actions[1].onPress();
    }
  }
};
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

const FILTER_OPTIONS = ["All", "Active", "Expired", "Expiring Soon", "Present", "Absent"];

export default function MembersScreen() {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [attendanceMap, setAttendanceMap] = useState<{ [id: string]: boolean }>({});

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getMembers();
      setMembers(data || []);
      if (data && Array.isArray(data)) {
        fetchAttendanceForMembers(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceForMembers = async (membersList: any[]) => {
    const map: { [id: string]: boolean } = {};
    await Promise.all(
      membersList.map(async (m) => {
        try {
          const status = await getTodayAttendance(m._id);
          map[m._id] = status;
          console.log(`✅ Attendance for ${m.name}: ${status ? 'Present' : 'Absent'}`);
        } catch (error) {
          console.error(`❌ Failed to fetch attendance for ${m._id}:`, error);
          map[m._id] = false;
        }
      })
    );
    console.log('📊 Attendance Map:', map);
    setAttendanceMap(map);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMembers();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMembers();
    setRefreshing(false);
  };

  const isExpiringSoon = (expiry?: string) => {
    if (!expiry) return false;
    const diff =
      (new Date(expiry).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 7;
  };

  const getMemberStatus = (member: any) => {
    if (member.expiry && new Date(member.expiry) < new Date())
      return "Expired";
    if (isExpiringSoon(member.expiry)) return "Expiring Soon";
    return "Active";
  };

  const filteredMembers = members.filter((m) => {
    const status = getMemberStatus(m);
    const attendedToday = attendanceMap[m._id];
    // Filter logic for new filter options
    if (activeFilter !== "All") {
      if (activeFilter === "Active" && status !== "Active") return false;
      if (activeFilter === "Expired" && status !== "Expired") return false;
      if (activeFilter === "Expiring Soon" && status !== "Expiring Soon") return false;
      if (activeFilter === "Present" && !attendedToday) return false;
      if (activeFilter === "Absent" && attendedToday) return false;
    }
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
        <Header title="Members" />

        <View style={styles.container}>
          {/* GLASS SEARCH INPUT */}
          <View style={styles.glassSearch}>
            <Ionicons name="search-outline" size={18} color="#ffffffcc" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search members..."
              placeholderTextColor="#ffffffaa"
              style={styles.glassInput}
              autoCorrect={false}
              autoCapitalize="none"
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
              <Text style={styles.filterTagText}>{activeFilter}</Text>
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
                        activeFilter === option && styles.planOptionActive,
                      ]}
                      onPress={() => {
                        setActiveFilter(option);
                        setShowFilterPopup(false);
                      }}
                    >
                      <Text style={[
                        styles.planOptionText,
                        activeFilter === option && styles.planOptionTextActive,
                      ]}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          )}

          {/* Filter row removed. Will add filter button beside search bar. */}

          {/* MEMBER LIST */}
          <FlatList
            data={filteredMembers}
            keyExtractor={(item, index) => item._id?.toString() ?? index.toString()}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}   // ✅ scrollbar removed
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#fff"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {members.length === 0
                    ? "No members yet. Add one to get started!"
                    : "No members match your filters"}
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const status = getMemberStatus(item);
              const attendedToday = attendanceMap[item._id];
              return (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: "/members/member-profile",
                      params: { memberId: item._id },
                    })
                  }
                >
                  <GlassCard style={styles.memberCard}>
                    <View style={styles.memberRow}>
                      <View>
                        <Text style={styles.memberName}>{item.name}</Text>
                        <Text style={styles.memberPhone}>+91 {item.phone}</Text>
                        <Text style={styles.memberMeta}>
                          {item.plan || "Standard"} • ₹{item.amount}
                        </Text>
                      </View>

                      <View style={styles.attendanceBadgeContainer}>
                        <View style={[styles.attendanceBadge, attendedToday ? styles.present : styles.absent]}>
                          <Text style={styles.attendanceBadgeText}>{attendedToday ? 'Present' : 'Absent'}</Text>
                        </View>
                      </View>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

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

const styles = StyleSheet.create({
  filterFab: {
    marginLeft: 10,
    marginRight: 2,
    padding: 0,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
    alignSelf: 'center',
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
  filterPopupGlass: {
    width: 260,
    padding: 0,
    borderRadius: 18,
    overflow: 'hidden',
  },
  attendanceBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  filterButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  filterPopupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  filterPopup: {
    width: 260,
    backgroundColor: '#232323',
    borderRadius: 18,
    padding: 20,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  filterPopupTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterPopupOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  filterPopupOptionActive: {
    backgroundColor: 'rgba(34,197,94,0.18)',
  },
  filterPopupOptionText: {
    color: '#fff',
    fontSize: 15,
  },
  filterPopupOptionTextActive: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  filterPopupClose: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  filterPopupCloseText: {
    color: '#fff',
    fontSize: 14,
  },
  safeArea: { flex: 1 },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  /* GLASS SEARCH */
  glassSearch: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 14,
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

  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },

  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  filterChipActive: {
    backgroundColor: "rgba(255,255,255,0.28)",
    borderColor: "rgba(255,255,255,0.45)",
  },

  filterText: {
    color: "#cfcfcf",
    fontSize: 13,
  },

  filterTextActive: {
    color: "#ffffff",
    fontWeight: "500",
  },

  memberCard: {
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

  viewBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },

  emptyText: {
    color: "#cfcfcf",
    fontSize: 16,
    textAlign: "center",
  },

  attendanceBadge: {
    minWidth: 54,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  present: {
    backgroundColor: 'rgba(34,197,94,0.18)',
    borderColor: 'rgba(34,197,94,0.45)',
    borderWidth: 1,
  },
  absent: {
    backgroundColor: 'rgba(239,68,68,0.18)',
    borderColor: 'rgba(239,68,68,0.45)',
    borderWidth: 1,
  },
  attendanceBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  filterTagContainer: {
    marginBottom: 12,
    marginTop: -8,
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
});
