import Header from "@/components/layout/Header";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassCard from "@/components/ui/GlassCard";
import { getMembers } from "@/services/member.service";
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
} from "react-native";

const FILTERS = ["All", "Active", "Expired", "Expiring Soon"];

export default function MembersScreen() {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchMembers = async () => {
  try {
    setLoading(true);
    const data = await getMembers();

    console.log("📦 MEMBERS FROM API:", data);
    console.log("📦 IS ARRAY:", Array.isArray(data));
    console.log("📦 LENGTH:", data?.length);

    setMembers(data || []);
  } finally {
    setLoading(false);
  }
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

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const diff =
      (new Date(expiryDate).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 7;
  };

  const getMemberStatus = (member: any) => {
    if (member.expiryDate && new Date(member.expiryDate) < new Date())
      return "Expired";
    if (isExpiringSoon(member.expiryDate)) return "Expiring Soon";
    return "Active";
  };

  const filteredMembers = members.filter((m) => {
    const status = getMemberStatus(m);
    if (activeFilter !== "All" && status !== activeFilter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()))
      return false;
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
          </View>

          {/* FILTERS */}
          <View style={styles.filtersRow}>
            {FILTERS.map((f) => {
              const isActive = activeFilter === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterChip,
                    isActive && styles.filterChipActive,
                  ]}
                  onPress={() => setActiveFilter(f)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.filterText,
                      isActive && styles.filterTextActive,
                    ]}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

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
              console.log("Member ID:", item._id);
              const status = getMemberStatus(item);
              return (
                <GlassCard style={styles.memberCard}>
                  <View style={styles.memberRow}>
                    <View>
                      <Text style={styles.memberName}>{item.name}</Text>
                      <Text style={styles.memberPhone}>
                        +91 {item.phone}
                      </Text>
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
                        style={styles.viewBtn}
                        onPress={() =>
                          router.push({
                            pathname: "/members/member-profile",
                            params: { memberId: item._id },
                          })
                        }
                      >
                        <Ionicons
                          name="eye-outline"
                          size={20}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </GlassCard>
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
});
