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
  Alert,
  ActivityIndicator,
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
import { registerGym, getMyGym } from "@/services/gym.service";
import { useAuthStore } from "@/store/auth.store";
console.log("📁 Loaded SettingsScreen.tsx");
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
              <TouchableOpacity disabled={isLoading} onPress={onSave}>
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
  const { isLoading } = useAuth();
  const updateUser = useAuthStore((s) => s.updateUser);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Wait for user to be loaded before rendering anything
  if (!user) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#42E695" />
          <Text style={{ color: '#fff', marginTop: 12 }}>Loading...</Text>
        </View>
      </ScreenWrapper>
    );
  }

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

  /* =========================================================
     🔥 FETCH GYM IF EXISTS (FIX)
  ========================================================= */
  useEffect(() => {
    const gymStatus = user?.gym 
      ? typeof user.gym === 'object' ? `object(${user.gym?.gymName})` : `string(${user.gym})`
      : 'none';
    console.log("👤 USER IN SETTINGS:", user?._id, "gym:", gymStatus);

    if (!user) {
      console.log("⏭️ No user yet");
      return;
    }

    // ✅ STOP LOOP: do not refetch if gym already exists
    if (user.gym && typeof user.gym === 'object' && '_id' in user.gym) {
      console.log("⏭️ Gym already loaded, skipping fetch:", user.gym.gymName);
      return;
    }

    const loadGym = async () => {
      try {
        console.log("📡 Settings: Calling /api/gym/me ...");

        const res = await getMyGym();

        console.log("✅ Settings: /api/gym/me RESPONSE:", res);

        if (res?.gym) {
          updateUser({ gym: res.gym });
          console.log("✅ Settings: Gym updated in store");
        } else if (res?.hasGym === false) {
          console.log("⚠️ Settings: User has no gym yet");
        }
      } catch (e) {
        console.log("❌ Settings: getMyGym ERROR:", e);
      }
    };

    // Always try to fetch gym, even if user._id is undefined
    // The token in the header will identify the user on the backend
    loadGym();
  }, [user?._id]);



  /* =========================================================
     SYNC USER → LOCAL STATE
  ========================================================= */
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
  }, [user]);

  /* =========================================================
     SAVE GYM
  ========================================================= */
  const saveGym = async () => {
    setLoading("gym");
    try {
      const savedGym = await registerGym(gym);

      updateUser({
        gym: savedGym,
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

  /* =========================================================
     SAVE PROFILE FIELD
  ========================================================= */
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
          <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Settings</Text>
              <View style={{ width: 22 }} />
            </View>

            {/* Hairline */}
            <View style={styles.headerDivider} />
          </View>

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
            <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
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
              onPress={() => {
                Alert.alert("Logout", "Are you sure you want to log out?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await logout();
                        // Give state update time to propagate before navigation
                        setTimeout(() => {
                          router.replace("/(auth)/login");
                        }, 300);
                      } catch (error) {
                        console.error('Logout error:', error);
                        Alert.alert("Error", "Failed to logout. Please try again.");
                      }
                    },
                  },
                ]);
              }}
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
