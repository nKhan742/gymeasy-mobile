import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    console.log('Logout button pressed');
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              setTimeout(() => {
                router.replace('/login');
              }, 100);
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    // Navigate to settings screen (to be implemented)
    console.log('Settings pressed');
  };

  const handleNotifications = () => {
    // Navigate to notifications screen (to be implemented)
    console.log('Notifications pressed');
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Gym Name */}
      <Text style={styles.title}>{user?.gymName || user?.name || 'GymX Fitness'}</Text>

      {/* Right Icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={styles.dot} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
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
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Inter-Bold",
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
    backgroundColor: "#ff4d4f",
  },
});
