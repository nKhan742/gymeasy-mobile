import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassButton from "@/components/ui/GlassButton";
import GlassCard from "@/components/ui/GlassCard";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Platform } from "react-native";

import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Permissions() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const requestAllPermissions = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // CAMERA permission (only required one)
      if (Platform.OS !== "web") {
        const camera = await Camera.requestCameraPermissionsAsync();

        if (camera.status !== "granted") {
          Alert.alert(
            "Camera Required",
            "Camera permission is required to scan Aadhaar."
          );
          setIsLoading(false);
          return;
        }
      }

      await AsyncStorage.setItem("permissions_done", "true");
      router.replace("/(auth)/login");

    } catch (error) {
      console.log("Permission error:", error);
      Alert.alert("Error", "Permission request failed");
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        <Text style={styles.title}>Permissions</Text>
        <Text style={styles.subtitle}>
          Permissions help automate your gym operations.
        </Text>

        {/* Camera */}
        <GlassCard style={styles.card}>
          <PermissionRow
            icon={<Ionicons name="camera" size={22} color="#fff" />}
            title="Camera"
            subtitle="Aadhaar scan"
          />
        </GlassCard>

        {/* Notifications */}
        <GlassCard style={styles.card}>
          <PermissionRow
            icon={<Ionicons name="notifications" size={22} color="#fff" />}
            title="Notifications"
            subtitle="Membership alerts & reminders"
          />
        </GlassCard>

        {/* Storage */}
        <GlassCard style={styles.card}>
          <PermissionRow
            icon={<MaterialCommunityIcons name="folder" size={22} color="#fff" />}
            title="Storage"
            subtitle="Member data & reports"
          />
        </GlassCard>

        <GlassButton
          title={isLoading ? "Allowing..." : "Allow & Continue"}
          onPress={requestAllPermissions}
          disabled={isLoading}
          style={{ marginTop: 20 }}
        />
      </View>
    </ScreenWrapper>
  );
}

/* ---------- Small helper component ---------- */

function PermissionRow({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>{icon}</View>

      <View>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
  },

  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  card: {
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  rowTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },

  rowSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
});
