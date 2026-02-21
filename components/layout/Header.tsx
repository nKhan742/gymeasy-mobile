import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ERROR } from "../../constants/colors";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const { colors } = useThemeContext(); // kept for future use
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const displayTitle = title || user?.gymName || user?.name || "GymEasy";

  const handleLogout = () => {
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
  };

  return (
    <>
      {/* HEADER */}
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16) + 10,
            paddingBottom: 14,
          },
        ]}
      >
        {/* TITLE */}
        <Text style={styles.title} numberOfLines={1}>
          {displayTitle}
        </Text>

        {/* ICONS */}
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#FFFFFF"
            />
            <View style={styles.dot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/settings")}
          >
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* GLOWING DIVIDER */}
      <LinearGradient
        colors={[
          "transparent",
          "rgba(255,255,255,0.35)",
          "transparent",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.divider}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Inter-Bold",
    flex: 1,
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    position: "relative",
    marginLeft: 18,
  },

  dot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ERROR,
  },

  divider: {
    height: 1.5,
    marginHorizontal: 16,
    opacity: 1,
  },
});
