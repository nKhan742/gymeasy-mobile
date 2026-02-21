import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassCard from "@/components/ui/GlassCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMemberById, updateMember } from "@/services/member.service";
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
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

/* ================= PLAN → MONTHS ================= */
const getPlanMonths = (plan: string) => {
  const p = plan.toLowerCase();
  if (p.includes("year")) return 12;
  if (p.includes("half")) return 6;
  if (p.includes("quarter")) return 3;
  return 1;
};

const calculateExpiry = (joiningDate: Date, plan: string) => {
  const expiry = new Date(joiningDate);
  expiry.setMonth(expiry.getMonth() + getPlanMonths(plan));
  return expiry;
};

export default function EditMember() {
  const insets = useSafeAreaInsets();
  const { memberId } = useLocalSearchParams<{ memberId?: string }>();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!memberId) return;

    const fetchMember = async () => {
      try {
        const data = await getMemberById(memberId);

        const joiningDate = data.joiningDate
          ? new Date(data.joiningDate)
          : new Date();

        setForm({
          name: data.name,
          phone: String(data.phone),
          address: data.address || "",
          plan: data.plan,
          amount: String(data.amount),
          weight: String(data.weight || ""),
          height: String(data.height || ""),
          joiningDate,
          expiryDate: data.expiryDate
            ? new Date(data.expiryDate)
            : calculateExpiry(joiningDate, data.plan),
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
        joiningDate: form.joiningDate,
        expiryDate: form.expiryDate,
      });

      router.back();
    } catch {
      Alert.alert("Error", "Failed to update member");
    } finally {
      setSaving(false);
    }
  };

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
      {/* HEADER */}
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

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* BASIC */}
        <GlassCard>
          <Text style={styles.sectionTitle}>Basic Details</Text>

          <EditableRow
            label="Name"
            value={form.name}
            onChange={(v: string) => setForm({ ...form, name: v })}
          />
          <Divider />

          <EditableRow
            label="Phone"
            value={form.phone}
            keyboard="numeric"
            onChange={(v: string) => setForm({ ...form, phone: v })}
          />
          <Divider />

          <EditableRow
            label="Address"
            value={form.address}
            onChange={(v: string) => setForm({ ...form, address: v })}
          />
        </GlassCard>

        {/* MEMBERSHIP */}
        <GlassCard>
          <Text style={styles.sectionTitle}>Membership</Text>

          <EditableRow
            label="Plan"
            value={form.plan}
            onChange={(plan: string) =>
              setForm({
                ...form,
                plan,
                expiryDate: calculateExpiry(form.joiningDate, plan),
              })
            }
          />
          <Divider />

          <EditableRow
            label="Amount"
            value={form.amount}
            keyboard="numeric"
            onChange={(v: string) => setForm({ ...form, amount: v })}
          />
          <Divider />

          <TouchableOpacity
            style={styles.row}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.label}>Joining Date</Text>
            <Text style={styles.input}>
              {form.joiningDate.toDateString()}
            </Text>
          </TouchableOpacity>
          <Divider />

          <View style={styles.row}>
            <Text style={styles.label}>Expiry Date</Text>
            <Text style={styles.input}>
              {form.expiryDate.toDateString()}
            </Text>
          </View>
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

      {/* DATE PICKER (CORRECT USAGE) */}
      {showDatePicker && (
        <DateTimePicker
          value={form.joiningDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) {
              setForm({
                ...form,
                joiningDate: date,
                expiryDate: calculateExpiry(date, form.plan),
              });
            }
          }}
        />
      )}
    </ScreenWrapper>
  );
}

/* ================= SMALL COMPONENTS ================= */

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
      style={styles.input}
    />
  </View>
);

const Divider = () => <View style={styles.divider} />;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 120, gap: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerWrapper: { backgroundColor: "transparent" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  title: { color: "#fff", fontSize: 16, fontWeight: "600" },
  sectionTitle: { color: "#fff", fontSize: 14, marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    alignItems: "center",
  },
  label: { color: "#a8a8a8", fontSize: 13 },
  input: { color: "#fff", fontSize: 13, textAlign: "right" },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  bmiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bmiValue: { fontSize: 34, color: "#fff", fontWeight: "600" },
  bmiLabel: { fontSize: 12, color: "#cfcfcf" },
  bmiPlanBox: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  bmiPlanText: { color: "#fff", fontSize: 13 },
});
