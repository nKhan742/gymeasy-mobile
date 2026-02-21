import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import Header from "@/components/layout/Header";
import GlassCard from "@/components/ui/GlassCard";
import { getDiagnosticMemberFees } from "@/services/diagnostic.service";
import { TEXT_PRIMARY, TEXT_SECONDARY } from "@/constants/colors";

export default function DiagnosticScreen() {
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkDiagnostic = async () => {
    try {
      setLoading(true);
      const data = await getDiagnosticMemberFees();
      setDiagnostic(data);
    } catch (error) {
      console.error("Failed to get diagnostic:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkDiagnostic();
    }, [])
  );

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Diagnostic" />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={checkDiagnostic}
          >
            <Text style={styles.refreshButtonText}>Refresh Diagnostic</Text>
          </TouchableOpacity>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          ) : diagnostic ? (
            <>
              <GlassCard>
                <Text style={styles.sectionTitle}>Database Information</Text>

                <View style={styles.row}>
                  <Text style={styles.label}>Total Records in DB</Text>
                  <Text style={styles.value}>
                    {diagnostic.totalRecordsInDatabase}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                  <Text style={styles.label}>Records for Your Gym</Text>
                  <Text style={styles.value}>
                    {diagnostic.totalRecordsForGym}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                  <Text style={styles.label}>Paid Records for Your Gym</Text>
                  <Text style={[styles.value, { color: "#22c55e" }]}>
                    {diagnostic.paidRecordsForGym}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                  <Text style={styles.label}>Your Gym ID</Text>
                  <Text style={[styles.value, { fontSize: 12 }]}>
                    {diagnostic.gymId}
                  </Text>
                </View>
              </GlassCard>

              {diagnostic.sampleRecords && diagnostic.sampleRecords.length > 0 && (
                <GlassCard>
                  <Text style={styles.sectionTitle}>Sample Records</Text>

                  {diagnostic.sampleRecords.map((record: any, idx: number) => (
                    <View key={idx}>
                      <View style={styles.recordBox}>
                        <View style={styles.recordHeader}>
                          <Text style={styles.recordLabel}>Record {idx + 1}</Text>
                          <Text style={[
                            styles.recordStatus,
                            record.feesPaid ? { color: "#22c55e" } : { color: "#ef4444" }
                          ]}>
                            {record.feesPaid ? "✓ Paid" : "✗ Unpaid"}
                          </Text>
                        </View>

                        <Text style={styles.recordDetail}>
                          Month: {record.month}
                        </Text>
                        <Text style={styles.recordDetail}>
                          Amount: ₹{record.amount?.toLocaleString("en-IN") || "N/A"}
                        </Text>
                        <Text style={styles.recordDetail}>
                          Member: {record.memberId?.name || record.memberId}
                        </Text>
                        <Text style={[styles.recordDetail, { fontSize: 10 }]}>
                          ID: {record._id}
                        </Text>
                      </View>
                      {idx < diagnostic.sampleRecords.length - 1 && (
                        <View style={styles.divider} />
                      )}
                    </View>
                  ))}
                </GlassCard>
              )}

              {diagnostic.totalRecordsForGym === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>⚠️ No MemberFee Records Found</Text>
                  <Text style={styles.emptySubText}>
                    Mark a member's fees as paid in the app to create records
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.center}>
              <Text style={styles.emptyText}>Tap "Refresh" to check database</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    paddingTop: 16,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },

  refreshButton: {
    backgroundColor: "rgba(96,165,250,0.2)",
    borderColor: "rgba(96,165,250,0.4)",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
  },

  refreshButtonText: {
    color: "#60a5fa",
    fontWeight: "600",
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  label: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  recordBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },

  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  recordLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },

  recordStatus: {
    fontSize: 12,
    fontWeight: "600",
  },

  recordDetail: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 4,
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
  },

  emptySubText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
