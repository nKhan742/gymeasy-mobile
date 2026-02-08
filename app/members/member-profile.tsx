import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassCard from "@/components/ui/GlassCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


import {
  getMemberById,
  deactivateMember,
} from "@/services/member.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MemberProfile() {
  const insets = useSafeAreaInsets();

  const { memberId } = useLocalSearchParams<{ memberId?: string }>();

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH MEMBER ================= */
  useFocusEffect(
  useCallback(() => {
    if (!memberId) return;

    let isActive = true;

    const fetchMember = async () => {
      try {
        setLoading(true);
        const data = await getMemberById(memberId);
        if (isActive) {
          setMember(data);
        }
      } catch {
        Alert.alert("Error", "Failed to load member");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchMember();

    return () => {
      isActive = false;
    };
  }, [memberId])
);


  /* ================= BMI ================= */
  const bmiData = useMemo(() => {
    if (!member?.weight || !member?.height) return null;

    const h = member.height / 100;
    const bmi = member.weight / (h * h);

    let plan = "Normal";
    if (bmi < 18.5) plan = "Underweight Plan";
    else if (bmi >= 25 && bmi < 30) plan = "Fat Loss Plan";
    else if (bmi >= 30) plan = "Obesity Control Plan";

    return { value: bmi.toFixed(1), plan };
  }, [member]);

  /* ================= DEACTIVATE ================= */
  const onDeactivate = () => {
    Alert.alert(
      "Deactivate Member",
      "This member will be hidden but not permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            await deactivateMember(member._id);
            router.back();
          },
        },
      ]
    );
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.center}>
          <ActivityIndicator size="large" color="#fff" />
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  if (!member) return null;

  return (
    <ScreenWrapper>
        {/* ================= HEADER (SAFE AREA) ================= */}
        <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={22} color="#fff" />
    </TouchableOpacity>

    <Text style={styles.title}>Member Profile</Text>

    <View style={styles.headerActions}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/members/edit-member",
            params: { memberId: member._id },
          })
        }
      >
        <Ionicons name="create-outline" size={22} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onDeactivate}>
        <Ionicons name="trash-outline" size={22} color="#ff5c5c" />
      </TouchableOpacity>
    </View>
  </View>

  {/* Hairline */}
  <View style={styles.headerDivider} />
</View>


        {/* ================= CONTENT ================= */}
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* BASIC DETAILS */}
          <GlassCard>
            <Text style={styles.sectionTitle}>Basic Details</Text>
            <Row label="Name" value={member.name} />
            <Divider />
            <Row label="Phone" value={`+91 ${member.phone}`} />
            <Divider />
            <Row label="Address" value={member.address || "-"} />
          </GlassCard>

          {/* MEMBERSHIP */}
          <GlassCard>
            <Text style={styles.sectionTitle}>Membership</Text>
            <Row label="Plan" value={member.plan} />
            <Divider />
            <Row label="Amount" value={`₹ ${member.amount}`} />
            <Divider />
            <Row
              label="Joining Date"
              value={member.joiningDate?.split("T")[0]}
            />
          </GlassCard>

          {/* BMI */}
          {bmiData && (
            <GlassCard>
              <Text style={styles.sectionTitle}>BMI</Text>

              <View style={styles.bmiRow}>
                <View>
                  <Text style={styles.bmiValue}>{bmiData.value}</Text>
                  <Text style={styles.bmiLabel}>BMI</Text>
                </View>

                <View style={styles.bmiPlanBox}>
                  <Text style={styles.bmiPlanText}>{bmiData.plan}</Text>
                </View>
              </View>
            </GlassCard>
          )}
        </ScrollView>
    </ScreenWrapper>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Row = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
    gap: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

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

  headerActions: {
    flexDirection: "row",
    gap: 16,
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

  sectionTitle: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  label: {
    color: "#a8a8a8",
    fontSize: 13,
  },

  value: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  bmiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bmiValue: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "600",
  },

  bmiLabel: {
    fontSize: 12,
    color: "#cfcfcf",
  },

  bmiPlanBox: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  bmiPlanText: {
    color: "#fff",
    fontSize: 13,
  },
});
