import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassCard from "@/components/ui/GlassCard";
import { getRevenueSummary, getMonthlyRevenue } from "@/services/revenue.service";
import { TEXT_PRIMARY, TEXT_SECONDARY } from "@/constants/colors";
import { RevenueSummary, MonthlyRevenueData } from "@/types/revenue.types";

export default function RevenueComponent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyRevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      const [summaryData, monthlyBreakdown] = await Promise.all([
        getRevenueSummary(),
        getMonthlyRevenue(),
      ]);
      setSummary(summaryData);
      setMonthlyData(monthlyBreakdown);
    } catch (error) {
      console.error("Failed to load revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRevenueData();
    }, [])
  );

  const getMonthName = (monthStr: string | undefined) => {
    if (!monthStr) return "Unknown";
    try {
      // Expected format: "YYYY-MM" (e.g., "2026-02")
      const parts = monthStr.trim().split("-");
      if (parts.length !== 2) return monthStr;
      
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      
      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return monthStr;
      }
      
      // Create date with day 1 of the month
      const date = new Date(year, month - 1, 1);
      return date.toLocaleString("en-US", { month: "long", year: "numeric" });
    } catch (error) {
      console.warn("⚠️ Failed to parse month:", monthStr, error);
      return monthStr;
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Revenue</Text>
              <View style={{ width: 60 }} />
            </View>
            <View style={styles.headerDivider} />
          </View>
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Revenue</Text>
            <View style={{ width: 60 }} />
          </View>
          <View style={styles.headerDivider} />
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* KEY METRICS - HORIZONTAL SCROLL */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.metricsScroll}
            >
              {/* TOTAL REVENUE */}
              <GlassCard style={styles.metricCard}>
                <View style={styles.metricIcon}>
                  <Ionicons name="cash-outline" size={20} color="#22c55e" />
                </View>
                <Text style={styles.metricLabel}>Total Revenue</Text>
                <Text style={[styles.metricValue, { color: "#22c55e" }]}>
                  ₹{(summary?.totalRevenue || 0).toLocaleString("en-IN")}
                </Text>
                <Text style={styles.metricSub}>{summary?.totalPaidFees || 0} transactions</Text>
              </GlassCard>

              {/* THIS MONTH */}
              <GlassCard style={styles.metricCard}>
                <View style={styles.metricIcon}>
                  <Ionicons name="calendar-outline" size={20} color="#60a5fa" />
                </View>
                <Text style={styles.metricLabel}>This Month</Text>
                <Text style={[styles.metricValue, { color: "#60a5fa" }]}>
                  ₹{(summary?.monthlyRevenue || 0).toLocaleString("en-IN")}
                </Text>
                <Text style={styles.metricSub}>{summary?.monthlyPaidFees || 0} payments</Text>
              </GlassCard>

              {/* PENDING */}
              <GlassCard style={styles.metricCard}>
                <View style={styles.metricIcon}>
                  <Ionicons name="hourglass-outline" size={20} color="#f97316" />
                </View>
                <Text style={styles.metricLabel}>Pending</Text>
                <Text style={[styles.metricValue, { color: "#f97316" }]}>
                  ₹{(summary?.pendingRevenue || 0).toLocaleString("en-IN")}
                </Text>
                <Text style={styles.metricSub}>{summary?.pendingFeeCount || 0} unpaid fees</Text>
              </GlassCard>
            </ScrollView>
          </View>

          {/* SUMMARY CARD */}
          <GlassCard style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.label}>Current Month</Text>
              <Text style={styles.value}>{summary?.currentMonth}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.label}>Monthly Revenue</Text>
              <Text style={[styles.value, { color: "#60a5fa" }]}>
                ₹{(summary?.monthlyRevenue || 0).toLocaleString("en-IN")}
              </Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.label}>Total Revenue (All Time)</Text>
              <Text style={[styles.value, { color: "#22c55e" }]}>
                ₹{(summary?.totalRevenue || 0).toLocaleString("en-IN")}
              </Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.label}>Average per Month</Text>
              <Text style={[styles.value, { color: "#d4af37" }]}>
                ₹{monthlyData.length > 0 
                  ? Math.round((summary?.totalRevenue || 0) / monthlyData.length).toLocaleString("en-IN")
                  : 0
                }
              </Text>
            </View>
          </GlassCard>

          {/* MONTHLY BREAKDOWN TABLE */}
          {monthlyData.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
              <View style={styles.tableWrapper}>
                {/* TABLE HEADER */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Month</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "center" }]}>Payments</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: "right" }]}>Revenue</Text>
                </View>

                {/* TABLE BODY */}
                <View style={styles.tableBody}>
                  <FlatList
                    data={monthlyData || []}
                    scrollEnabled={false}
                    keyExtractor={(item, idx) => `${item?._id || idx}-${idx}`}
                    renderItem={({ item, index }) => (
                      <View>
                        <View style={styles.tableBodyRow}>
                          <Text style={[styles.monthName, { flex: 2 }]}>
                            {item?._id ? getMonthName(item._id) : "Unknown"}
                          </Text>
                          <View style={[styles.paymentBadgeCompact, { flex: 1 }]}>
                            <Text style={styles.paymentTextCompact}>{item?.count || 0}</Text>
                          </View>
                          <Text style={[styles.revenueAmountCompact, { flex: 1.2, textAlign: "right" }]}>
                            ₹{(item?.revenue || 0).toLocaleString("en-IN")}
                          </Text>
                        </View>
                        {index < (monthlyData?.length || 0) - 1 && (
                          <View style={styles.tableBodyRowDivider} />
                        )}
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>
          )}

          {/* NO DATA */}
          {monthlyData.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={TEXT_SECONDARY} />
              <Text style={styles.emptyText}>No revenue data yet</Text>
              <Text style={styles.emptySubText}>
                Start marking member fees as paid to see revenue tracking
              </Text>
            </View>
          )}
        </ScrollView>
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

  container: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  section: {
    marginTop: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },

  /* METRICS CARDS */
  metricsScroll: {
    paddingRight: 16,
    gap: 12,
  },

  metricCard: {
    minWidth: 140,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
  },

  metricIcon: {
    marginBottom: 6,
    alignItems: "flex-start",
  },

  metricLabel: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginBottom: 4,
  },

  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  metricSub: {
    fontSize: 11,
    color: TEXT_SECONDARY,
  },

  /* SUMMARY CARD */
  summaryCard: {
    marginBottom: 4,
  },

  label: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  /* TABLE STYLES */
  tableWrapper: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    overflow: "hidden",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "rgba(96,165,250,0.15)",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(96,165,250,0.4)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },

  tableHeaderCell: {
    fontSize: 12,
    fontWeight: "600",
    color: "#60a5fa",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  tableBody: {
    backgroundColor: "transparent",
  },

  tableBodyRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },

  tableBodyRowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 16,
  },

  monthName: {
    fontSize: 14,
    fontWeight: "500",
    color: TEXT_PRIMARY,
  },

  paymentBadgeCompact: {
    justifyContent: "center",
    alignItems: "center",
  },

  paymentTextCompact: {
    fontSize: 14,
    fontWeight: "600",
    color: "#60a5fa",
  },

  revenueAmountCompact: {
    fontSize: 14,
    fontWeight: "600",
    color: "#22c55e",
  },

  emptyState: {
    marginTop: 60,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    marginBottom: 8,
    marginTop: 16,
  },

  emptySubText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
