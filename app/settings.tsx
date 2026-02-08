import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassButton from "@/components/ui/GlassButton";
import GlassCard from "@/components/ui/GlassCard";
import {
  BORDER_PRIMARY,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { updateProfileField } from "@/services/profile.service";
import { registerGym } from "@/services/gym.service";
import { useAuthStore } from "@/store/auth.store";

/* =========================================================
   SETTINGS ROW
========================================================= */
const SettingsRow = React.memo(
  ({
    label,
    value,
    isEditing,
    isLoading,
    onChange,
    onEdit,
    onSave,
  }: {
    label: string;
    value: string;
    isEditing: boolean;
    isLoading: boolean;
    onChange: (t: string) => void;
    onEdit: () => void;
    onSave: () => void;
  }) => {
    return (
      <>
        <View style={styles.row}>
          <Text style={styles.label}>{label}</Text>

          <View
            style={[
              styles.rowContent,
              isEditing && styles.rowActive,
            ]}
          >
            <TextInput
              value={value}
              editable={isEditing}
              style={styles.input}
              onChangeText={onChange}
              multiline
            />

            {isEditing ? (
              <TouchableOpacity
                disabled={isLoading}
                onPress={onSave}
              >
                <Ionicons
                  name={isLoading ? "time-outline" : "save-outline"}
                  size={18}
                  color="#fff"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onEdit}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color="rgba(255,255,255,0.85)"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.divider} />
      </>
    );
  }
);

/* =========================================================
   SETTINGS SCREEN
========================================================= */
export default function SettingsScreen() {

  const { user, logout } = useAuth();
  const updateUser = useAuthStore((s) => s.updateUser);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  
  const [gym, setGym] = useState({
    gymName: "",
    address: "",
    phone: "",
  });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  useEffect(() => {
  console.log("👤 AUTH USER OBJECT:", user);
  console.log("🏋️ USER.GYM FROM DB:", user?.gym);
}, [user]);
  /* ===== SYNC USER ===== */
  useEffect(() => {
    if (!user) return;

    setGym({
      gymName: user.gym?.gymName ?? "",
      address: user.gym?.address ?? "",
      phone: user.gym?.phone ?? "",
    });

    setProfile({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
    });
  }, [user?._id]);

  /* ===== SAVE GYM ===== */
  const saveGym = async () => {
  setLoading("gym");
  try {
    const savedGym = await registerGym(gym); // 👈 REAL GYM

    updateUser({
      gym: savedGym, // 🔥 FULL OBJECT WITH _id
    });

    Toast.show({
      type: "success",
      text1: "Gym updated",
    });
    setEditing(null);
  } catch (err) {
    Toast.show({
      type: "error",
      text1: "Gym update failed",
    });
  } finally {
    setLoading(null);
  }
};


  /* ===== SAVE PROFILE FIELD ===== */
  const saveProfileField = async (
    field: keyof typeof profile
  ) => {
    setLoading(field);
    try {
      await updateProfileField(field, profile[field]);

      updateUser({
        [field]: profile[field],
      });

      Toast.show({
        type: "success",
        text1: "Profile updated",
      });
      setEditing(null);
    } catch {
      Toast.show({
        type: "error",
        text1: "Update failed",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* HEADER */}
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={{ width: 26 }} />
          </View>

          <View style={styles.separator} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
          >
            {/* ================= GYM DETAILS ================= */}
            <Text style={styles.sectionTitle}>GYM DETAILS</Text>
            <GlassCard style={styles.card}>
              <SettingsRow
                label="GYM NAME"
                value={gym.gymName}
                isEditing={editing === "gym"}
                isLoading={loading === "gym"}
                onEdit={() => setEditing("gym")}
                onChange={(t) =>
                  setGym((v) => ({ ...v, gymName: t }))
                }
                onSave={saveGym}
              />

              <SettingsRow
                label="ADDRESS"
                value={gym.address}
                isEditing={editing === "gym"}
                isLoading={loading === "gym"}
                onEdit={() => setEditing("gym")}
                onChange={(t) =>
                  setGym((v) => ({ ...v, address: t }))
                }
                onSave={saveGym}
              />

              <SettingsRow
                label="GYM PHONE"
                value={gym.phone}
                isEditing={editing === "gym"}
                isLoading={loading === "gym"}
                onEdit={() => setEditing("gym")}
                onChange={(t) =>
                  setGym((v) => ({ ...v, phone: t }))
                }
                onSave={saveGym}
              />
            </GlassCard>

            {/* ================= PERSONAL DETAILS ================= */}
            <Text style={styles.sectionTitle}>
              PERSONAL DETAILS
            </Text>
            <GlassCard style={styles.card}>
              <SettingsRow
                label="NAME"
                value={profile.name}
                isEditing={editing === "name"}
                isLoading={loading === "name"}
                onEdit={() => setEditing("name")}
                onChange={(t) =>
                  setProfile((v) => ({ ...v, name: t }))
                }
                onSave={() => saveProfileField("name")}
              />

              <SettingsRow
                label="EMAIL"
                value={profile.email}
                isEditing={editing === "email"}
                isLoading={loading === "email"}
                onEdit={() => setEditing("email")}
                onChange={(t) =>
                  setProfile((v) => ({ ...v, email: t }))
                }
                onSave={() => saveProfileField("email")}
              />

              <SettingsRow
                label="PHONE"
                value={profile.phone}
                isEditing={editing === "phone"}
                isLoading={loading === "phone"}
                onEdit={() => setEditing("phone")}
                onChange={(t) =>
                  setProfile((v) => ({ ...v, phone: t }))
                }
                onSave={() => saveProfileField("phone")}
              />

              <TouchableOpacity
                style={styles.passwordRow}
                onPress={() => router.push("/change-password")}
              >
                <View style={styles.passwordLeft}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={16}
                    color="rgba(255,255,255,0.8)"
                  />
                  <Text style={styles.passwordText}>
                    Change Password
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="rgba(255,255,255,0.6)"
                />
              </TouchableOpacity>
            </GlassCard>

            <GlassButton
              title="Logout"
              icon="log-out-outline"
              onPress={logout}
              style={{ marginTop: 32 }}
            />
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

/* =========================================================
   STYLES
========================================================= */
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    paddingBottom: 120,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: "Inter-SemiBold",
    color: TEXT_SECONDARY,
  },
  card: {
    padding: 2,
    borderRadius: 20,
  },
  row: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1,
    fontFamily: "Inter-Medium",
    color: TEXT_SECONDARY,
    marginBottom: 6,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rowActive: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 0.6,
    borderColor: "rgba(255,255,255,0.25)",
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: TEXT_PRIMARY,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 15,
    paddingVertical: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    minHeight: 24,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER_PRIMARY,
    marginVertical: 6,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  passwordLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  passwordText: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: TEXT_PRIMARY,
  },
});
