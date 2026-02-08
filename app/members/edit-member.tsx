import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassCard from "@/components/ui/GlassCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getMemberById,
  updateMember,
} from "@/services/member.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditMember() {
  const insets = useSafeAreaInsets();
  const { memberId } = useLocalSearchParams<{ memberId?: string }>();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!memberId) return;

    const fetchMember = async () => {
      try {
        const data = await getMemberById(memberId);
        setForm({
          name: data.name,
          phone: String(data.phone),
          address: data.address || "",
          plan: data.plan,
          amount: String(data.amount),
          weight: String(data.weight || ""),
          height: String(data.height || ""),
        });
      } catch {
        Alert.alert("Error", "Failed to load member");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  /* ================= BMI ================= */
  const bmiData = useMemo(() => {
    if (!form?.weight || !form?.height) return null;

    const h = Number(form.height) / 100;
    const bmi = Number(form.weight) / (h * h);

    let plan = "Normal";
    if (bmi < 18.5) plan = "Underweight Plan";
    else if (bmi >= 25 && bmi < 30) plan = "Fat Loss Plan";
    else if (bmi >= 30) plan = "Obesity Control Plan";

    return { value: bmi.toFixed(1), plan };
  }, [form]);

  /* ================= SAVE ================= */
  const onSave = async () => {
    try {
      setSaving(true);

      await updateMember(memberId!, {
        ...form,
        phone: Number(form.phone),
        amount: Number(form.amount),
        weight: Number(form.weight),
        height: Number(form.height),
      });

      router.back();
    } catch {
      Alert.alert("Error", "Failed to update member");
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      {/* ================= HEADER ================= */}
      <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>Edit Member</Text>

          <TouchableOpacity onPress={onSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="checkmark" size={24} color="#00e676" />
            )}
          </TouchableOpacity>
        </View>

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

          <EditableRow
            label="Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <Divider />

          <EditableRow
            label="Phone"
            value={form.phone}
            keyboard="numeric"
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <Divider />

          <EditableRow
            label="Address"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
          />
        </GlassCard>

        {/* MEMBERSHIP */}
        <GlassCard>
          <Text style={styles.sectionTitle}>Membership</Text>

          <EditableRow
            label="Plan"
            value={form.plan}
            onChange={(v) => setForm({ ...form, plan: v })}
          />
          <Divider />

          <EditableRow
            label="Amount"
            value={form.amount}
            keyboard="numeric"
            onChange={(v) => setForm({ ...form, amount: v })}
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

/* ================= EDITABLE ROW ================= */

const EditableRow = ({
  label,
  value,
  onChange,
  keyboard = "default",
}: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      keyboardType={keyboard}
      placeholder="-"
      placeholderTextColor="#666"
      style={styles.input}
    />
  </View>
);

const Divider = () => <View style={styles.divider} />;

/* ================= STYLES (MATCH PROFILE) ================= */

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
    alignItems: "center",
  },

  label: {
    color: "#a8a8a8",
    fontSize: 13,
  },

  input: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    padding: 0,
    textAlign: "right",
    minWidth: 120,
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
