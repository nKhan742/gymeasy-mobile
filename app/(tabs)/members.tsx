import Header from "@/components/layout/Header";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import {
  STATUS_ACTIVE,
  STATUS_EXPIRED,
  STATUS_EXPIRING,
  STATUS_YEARLY
} from "@/constants/colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { getMembers } from "@/services/member.service";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
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
} from "react-native";

const FILTERS = ["All", "Active", "Expired", "Expiring Soon"];

export default function MembersScreen() {
  const { colors } = useThemeContext();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      console.log("🔵 fetchMembers called");
      const data = await getMembers();
      console.log("✅ Members data received:", data);
      console.log("📊 Members count:", data?.length || 0);
      setMembers(data || []);
    } catch (err) {
      console.log("❌ FETCH MEMBERS ERROR:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchMembers();
  }, []);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 Members screen focused - refetching data");
      fetchMembers();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getMembers();
      setMembers(data || []);
    } catch (err) {
      console.log("❌ REFRESH ERROR:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const isExpiringSoon = (expiry: string) => {
    const today = new Date();
    const exp = new Date(expiry);
    const diffDays =
      (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    return diffDays <= 7 && diffDays >= 0;
  };

  const getMemberStatus = (member: any) => {
    // If member has a status field, use it
    if (member.status) {
      if (member.status === "Active" && isExpiringSoon(member.expiry)) {
        return "Expiring Soon";
      }
      return member.status;
    }

    // Otherwise calculate from expiry date
    if (!member.expiry) {
      return "Active";
    }

    const today = new Date();
    const expiry = new Date(member.expiry);

    if (expiry < today) {
      return "Expired";
    } else if (isExpiringSoon(member.expiry)) {
      return "Expiring Soon";
    } else {
      return "Active";
    }
  };

  const filteredMembers = (members || []).filter((m) => {
    const computedStatus = getMemberStatus(m);
    console.log(`Member: ${m.name}, Status: ${computedStatus}, Filter: ${activeFilter}`);

    if (activeFilter !== "All" && computedStatus !== activeFilter) {
      return false;
    }

    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    return true;
  });

  console.log("📊 Members screen render:", {
    total: members.length,
    filtered: filteredMembers.length,
    activeFilter,
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

        {/* FILTERS */}
        <View style={styles.filtersRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                activeFilter === f && [styles.filterActive, { backgroundColor: colors.primary, borderColor: colors.primary }],
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LIST */}
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item._id}
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
            const displayStatus = getMemberStatus(item);

            return (
              <View style={styles.memberRow}>
                <View>
                  <Text style={styles.memberName}>{item.name}</Text>
                  <Text style={styles.memberPhone}>
                    +91 {item.phone}
                  </Text>
                </View>

                <View style={styles.rightActions}>
                  <View
                    style={[
                      styles.statusBadge,
                      STATUS_COLORS[displayStatus],
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {displayStatus}
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.whatsappBtn}>
                    <Ionicons
                      name="logo-whatsapp"
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const STATUS_COLORS: any = {
  Active: { backgroundColor: STATUS_ACTIVE },
  Expired: { backgroundColor: STATUS_EXPIRED },
  "Expiring Soon": { backgroundColor: STATUS_EXPIRING },
  Yearly: { backgroundColor: STATUS_YEARLY },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter-SemiBold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 18,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#fff",
    fontFamily: "Inter-Regular",
  },

  filtersRow: {
    flexDirection: "row",
    marginBottom: 18,
    flexWrap: "wrap",
    gap: 10,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  filterActive: {
    backgroundColor: "#3b82f6",
  },

  filterText: {
    color: "#cfcfcf",
    fontSize: 13,
    fontFamily: "Inter-Medium",
  },

  filterTextActive: {
    color: "#fff",
  },

  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  memberName: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
    color: "#fff",
  },

  memberPhone: {
    fontSize: 13,
    color: "#cfcfcf",
    marginTop: 2,
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },

  statusText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Inter-Medium",
  },

  whatsappBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },

  emptyText: {
    color: "#cfcfcf",
    fontSize: 16,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
});
