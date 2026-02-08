import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassButton from "@/components/ui/GlassButton";
import GlassCard from "@/components/ui/GlassCard";
import {
  BORDER_PRIMARY,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

/* =========================================================
   PASSWORD ROW (OUTSIDE SCREEN — FIXES FOCUS)
========================================================= */
const PasswordRow = React.memo(
  ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => {
    return (
      <>
        <View style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            secureTextEntry
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        </View>

        <View style={styles.divider} />
      </>
    );
  }
);

/* =========================================================
   SCREEN
========================================================= */
export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const submit = async () => {
    if (!form.current || !form.next || !form.confirm) {
      return Toast.show({
        type: "error",
        text1: "All fields are required",
      });
    }

    if (form.next !== form.confirm) {
      return Toast.show({
        type: "error",
        text1: "Passwords do not match",
      });
    }

    if (form.next.length < 8) {
      return Toast.show({
        type: "error",
        text1: "Password must be at least 8 characters",
      });
    }

    try {
      setLoading(true);

      // 🔗 BACKEND
      // await api.post("/auth/change-password", form);

      Toast.show({
        type: "success",
        text1: "Password changed successfully",
      });

      router.back();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* ===== HEADER ===== */}
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <Ionicons
              name="chevron-back"
              size={26}
              color="#fff"
              onPress={() => router.back()}
            />
            <Text style={styles.headerTitle}>Change Password</Text>
            <View style={{ width: 26 }} />
          </View>

          <View style={styles.separator} />

          <View style={styles.container}>
            {/* ===== CARD ===== */}
            <GlassCard style={styles.card}>
              <PasswordRow
                label="CURRENT PASSWORD"
                value={form.current}
                onChange={(v) =>
                  setForm((f) => ({ ...f, current: v }))
                }
              />
              <PasswordRow
                label="NEW PASSWORD"
                value={form.next}
                onChange={(v) =>
                  setForm((f) => ({ ...f, next: v }))
                }
              />
              <PasswordRow
                label="CONFIRM PASSWORD"
                value={form.confirm}
                onChange={(v) =>
                  setForm((f) => ({ ...f, confirm: v }))
                }
              />
            </GlassCard>

            <GlassButton
              title="Update Password"
              loading={loading}
              onPress={submit}
              style={{ marginTop: 24 }}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

/* ================= STYLES (UNCHANGED UI) ================= */

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#fff",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  container: {
    padding: 16,
  },
  card: {
    padding: 2,
    borderRadius: 20,
  },
  row: {
    paddingVertical: 14,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1,
    fontFamily: "Inter-Medium",
    color: TEXT_SECONDARY,
    marginBottom: 6,
  },
  input: {
    fontSize: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    fontFamily: "Inter-Regular",
    color: TEXT_PRIMARY,
    padding: 10,
    minHeight: 24, // prevents layout flicker
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER_PRIMARY,
  },
});
