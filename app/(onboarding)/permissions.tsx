import ScreenWrapper from "@/components/layout/ScreenWrapper";
import PermissionCard from "@/components/ui/PermissionCard";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Permissions() {

  
  const router = useRouter();

 const requestAllPermissions = async () => {
  try {
    console.log("Permission flow started");

    // CAMERA (only real required permission)
    if (Platform.OS !== "web") {
      const camera = await Camera.requestCameraPermissionsAsync();

      if (camera.status !== "granted") {
        Alert.alert(
          "Camera Required",
          "Camera permission is required to scan Aadhaar."
        );
        return;
      }
    }

    // Save flag
    await AsyncStorage.setItem("permissions_done", "true");

    console.log("Permissions OK → navigating");
    router.replace("/(auth)/login");

  } catch (error) {
    console.log("Permission error:", error);
    Alert.alert("Error", "Permission request failed");
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

        <PermissionCard
          icon={<Ionicons name="camera" size={22} color="#fff" />}
          iconBg={["#5b8cff", "#3f5efb"]}
          title="Camera"
          subtitle="Aadhaar scan"
        />

        <PermissionCard
  icon={<Ionicons name="chatbubbles" size={22} color="#fff" />}
  iconBg={["#3be17b", "#1db954"]}
  title="WhatsApp Access"
  subtitle="Send reminders via WhatsApp"
 />

        <PermissionCard
          icon={<Ionicons name="notifications" size={22} color="#fff" />}
          iconBg={["#9a7dff", "#6c4cff"]}
          title="Notifications"
        />

        <PermissionCard
          icon={<MaterialCommunityIcons name="folder" size={22} color="#fff" />}
          iconBg={["#f1ff65", "#c7d900"]}
          title="Storage"
        />

        {/* SAME BUTTON STYLE AS OTHER SCREENS */}
        <TouchableOpacity activeOpacity={0.9} onPress={requestAllPermissions}>
          <LinearGradient
            colors={["#4f6bff", "#5dffb2"]}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Allow & Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}



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
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  cardTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },

  cardSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },

  button: {
    marginTop: 30,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

