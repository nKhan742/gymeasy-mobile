import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ERROR } from "../../constants/colors";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const { colors } = useThemeContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const displayTitle = title || user?.gymName || user?.name || "GymEasy";

  const handleLogout = () => {
    console.log("Logout button pressed");
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              setTimeout(() => {
                router.replace("/(auth)/login");
              }, 100);
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleNotifications = () => {
    router.push("/notifications");
  };

  return (
    <View
  style={[
    styles.container,
    {
      paddingTop: Math.max(insets.top, 16) + 10,
      paddingBottom: 16,
       borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "rgba(255,255,255,0.1)",
    },
  ]}
>

      {/* Title */}
      <Text style={styles.title}>{displayTitle}</Text>

      {/* Right Icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
          <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          <View style={[styles.dot, { backgroundColor: ERROR }]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    paddingHorizontal: 16,
  },

  title: {
    color: "#fff",
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
    marginLeft: 16,
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
});
