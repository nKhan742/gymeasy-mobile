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
import React, { useEffect, useState } from "react";
import {
  FlatList,
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
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
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

    fetchMembers();
  }, []);

  const isExpiringSoon = (expiry: string) => {
    const today = new Date();
    const exp = new Date(expiry);
    const diffDays =
      (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    return diffDays <= 7 && diffDays >= 0;
  };

  const filteredMembers = (members || []).filter((m) => {
    let computedStatus = m.status;

    if (m.status === "Active" && isExpiringSoon(m.expiry)) {
      computedStatus = "Expiring Soon";
    }

    if (activeFilter !== "All" && computedStatus !== activeFilter)
      return false;

    if (
      search &&
      !m.name.toLowerCase().includes(search.toLowerCase())
    )
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
          renderItem={({ item }) => {
            const displayStatus =
              item.status === "Active" && isExpiringSoon(item.expiry)
                ? "Expiring Soon"
                : item.status;

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
});
