import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassButton from "@/components/ui/GlassButton";
import GlassInput from "@/components/ui/GlassInput";
import { BG_SECONDARY, BORDER_PRIMARY, PRIMARY, TEXT_PRIMARY, TEXT_SECONDARY } from "@/constants/colors";
import { THEME_OPTIONS as THEME_COLORS, useThemeContext } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { currentTheme, setCurrentTheme, colors } = useThemeContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [editMode, setEditMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [gymDetails, setGymDetails] = useState({
    name: user?.gymName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleSaveDetails = () => {
    if (!gymDetails.name || !gymDetails.email) {
      Alert.alert("Validation", "Please fill in all required fields");
      return;
    }
    Alert.alert("Success", "Gym details updated successfully!");
    setEditMode(false);
  };

  const handleChangePassword = () => {
    // Validate fields
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert("Validation", "Please fill in all password fields");
      return;
    }

    // Validate password match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert("Validation", "New passwords do not match");
      return;
    }

    // Validate password strength (minimum 8 characters, at least one number)
    if (passwordData.newPassword.length < 8) {
      Alert.alert("Validation", "Password must be at least 8 characters long");
      return;
    }

    if (!/\d/.test(passwordData.newPassword)) {
      Alert.alert("Validation", "Password must contain at least one number");
      return;
    }

    // TODO: Call API to change password
    Alert.alert("Success", "Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowChangePassword(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
              <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.screenTitle}>Settings</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.container}>
              {/* GYM DETAILS SECTION */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="business" size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Gym Details</Text>
                </View>

                {editMode ? (
                  <View>
                    <GlassInput>
                      <TextInput
                        placeholder="Gym Name"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        style={styles.input}
                        value={gymDetails.name}
                        onChangeText={(text) =>
                          setGymDetails({ ...gymDetails, name: text })
                        }
                      />
                    </GlassInput>

                    <View style={styles.gap} />

                    <GlassInput>
                      <TextInput
                        placeholder="Email"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        style={styles.input}
                        value={gymDetails.email}
                        onChangeText={(text) =>
                          setGymDetails({ ...gymDetails, email: text })
                        }
                        keyboardType="email-address"
                      />
                    </GlassInput>

                    <View style={styles.gap} />

                    <GlassInput>
                      <TextInput
                        placeholder="Phone"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        style={styles.input}
                        value={gymDetails.phone}
                        onChangeText={(text) =>
                          setGymDetails({ ...gymDetails, phone: text })
                        }
                        keyboardType="phone-pad"
                      />
                    </GlassInput>

                    <View style={styles.gap} />

                    <GlassInput>
                      <TextInput
                        placeholder="Address"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        style={styles.input}
                        value={gymDetails.address}
                        onChangeText={(text) =>
                          setGymDetails({ ...gymDetails, address: text })
                        }
                        multiline
                        numberOfLines={3}
                      />
                    </GlassInput>

                    <View style={styles.gap} />

                    <GlassButton
                      title="Save Details"
                      onPress={handleSaveDetails}
                    />

                    <View style={styles.smallGap} />

                    <TouchableOpacity
                      style={[styles.button, { borderColor: TEXT_SECONDARY }]}
                      onPress={() => setEditMode(false)}
                    >
                      <Text style={[styles.buttonText, { color: TEXT_SECONDARY }]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Gym Name</Text>
                      <Text style={styles.detailValue}>{gymDetails.name}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Email</Text>
                      <Text style={styles.detailValue}>{gymDetails.email}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Phone</Text>
                      <Text style={styles.detailValue}>{gymDetails.phone}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Address</Text>
                      <Text style={styles.detailValue}>{gymDetails.address}</Text>
                    </View>

                    <GlassButton
                      title="Edit Details"
                      onPress={() => setEditMode(true)}
                      style={{ marginTop: 16 }}
                    />
                  </View>
                )}
              </View>

              {/* CHANGE PASSWORD SECTION */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="lock-closed" size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Security</Text>
                </View>

                {showChangePassword ? (
                  <View>
                    <GlassInput>
                      <TextInput
                        placeholder="Current Password"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        style={styles.input}
                        value={passwordData.currentPassword}
                        onChangeText={(text) =>
                          setPasswordData({ ...passwordData, currentPassword: text })
                        }
                        secureTextEntry
                      />
                    </GlassInput>

                    <View style={styles.gap} />

                    <GlassInput>
                      <TextInput
                        placeholder="New Password"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        style={styles.input}
                        value={passwordData.newPassword}
                        onChangeText={(text) =>
                          setPasswordData({ ...passwordData, newPassword: text })
                        }
                        secureTextEntry
                      />
                    </GlassInput>

                    <View style={styles.gap} />

                    <GlassInput>
                      <TextInput
                        placeholder="Confirm New Password"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        style={styles.input}
                        value={passwordData.confirmPassword}
                        onChangeText={(text) =>
                          setPasswordData({ ...passwordData, confirmPassword: text })
                        }
                        secureTextEntry
                      />
                    </GlassInput>

                    <View style={styles.gap} />

                    <Text style={styles.passwordHint}>
                      • Password must be at least 8 characters long
                    </Text>
                    <Text style={styles.passwordHint}>
                      • Password must contain at least one number
                    </Text>

                    <View style={styles.gap} />

                    <GlassButton
                      title="Update Password"
                      onPress={handleChangePassword}
                    />

                    <View style={styles.smallGap} />

                    <TouchableOpacity
                      style={[styles.button, { borderColor: TEXT_SECONDARY }]}
                      onPress={() => {
                        setShowChangePassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                    >
                      <Text style={[styles.buttonText, { color: TEXT_SECONDARY }]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <GlassButton
                    title="Change Password"
                    onPress={() => setShowChangePassword(true)}
                  />
                )}
              </View>

              {/* THEME SECTION */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="color-palette" size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Theme Color</Text>
                </View>

                <View style={styles.themeGrid}>
                  {Object.entries(THEME_COLORS).map(([key, theme]) => (
                    <TouchableOpacity
                      key={theme.id}
                      style={[
                        styles.themeOption,
                        currentTheme === theme.id && [styles.themeOptionSelected, { borderColor: colors.primary }],
                      ]}
                      onPress={() => {
                        setCurrentTheme(theme.id as any);
                        Alert.alert("Theme Updated", `Theme changed to ${theme.name}`);
                      }}
                    >
                      <LinearGradient
                        colors={theme.colors.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.themeSwatch}
                      />
                      <Text style={styles.themeName}>{theme.name}</Text>
                      {currentTheme === theme.id && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={colors.primary}
                          style={styles.themeCheck}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* MESSAGE TEMPLATES SECTION */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="chatbubble" size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>WhatsApp Templates</Text>
                </View>

                <Text style={styles.sectionDescription}>
                  Manage your WhatsApp message templates for quick messaging to members.
                </Text>

                <GlassButton
                  title="Manage Templates"
                  onPress={() => {
                    Alert.alert(
                      "Coming Soon",
                      "Template customization will be available soon!"
                    );
                  }}
                  style={{ marginTop: 12 }}
                />
              </View>

              {/* DANGER ZONE */}
              <View style={[styles.section, styles.dangerZone]}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="warning" size={20} color="#ff4d4f" />
                  <Text style={[styles.sectionTitle, { color: "#ff4d4f" }]}>
                    Danger Zone
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#fff" />
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  headerWrapper: {
    paddingHorizontal: 16,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },

  backText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    marginLeft: 4,
  },

  screenTitle: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100,
  },

  section: {
    marginBottom: 32,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: TEXT_PRIMARY,
  },

  sectionDescription: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: TEXT_SECONDARY,
    marginBottom: 12,
  },

  gap: {
    height: 12,
  },

  smallGap: {
    height: 8,
  },

  input: {
    color: TEXT_PRIMARY,
    fontFamily: "Inter-Regular",
    fontSize: 14,
  },

  detailRow: {
    backgroundColor: BG_SECONDARY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_PRIMARY,
    padding: 14,
    marginBottom: 12,
  },

  detailLabel: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: TEXT_SECONDARY,
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: TEXT_PRIMARY,
  },

  passwordHint: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: TEXT_SECONDARY,
    marginBottom: 6,
  },

  themeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  themeOption: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: BG_SECONDARY,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BORDER_PRIMARY,
    padding: 12,
    alignItems: "center",
    position: "relative",
  },

  themeOptionSelected: {
    borderColor: PRIMARY,
  },

  themeSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },

  themeName: {
    fontSize: 13,
    fontFamily: "Inter-SemiBold",
    color: TEXT_PRIMARY,
  },

  themeCheck: {
    position: "absolute",
    top: 8,
    right: 8,
  },

  button: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },

  dangerZone: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,77,79,0.3)",
    paddingTop: 24,
  },

  logoutButton: {
    backgroundColor: "#ff4d4f",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  logoutText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#fff",
  },
});
