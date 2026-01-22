import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DashboardHeader() {
  return (
    <View style={styles.container}>
      {/* Menu */}
      <TouchableOpacity>
        <Ionicons name="menu" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>GymX Fitness</Text>

      {/* Notification */}
      <TouchableOpacity style={styles.notification}>
        <Ionicons name="notifications-outline" size={24} color="#fff" />
        <View style={styles.dot} />
      </TouchableOpacity>
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
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
  },

  notification: {
    position: "relative",
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
