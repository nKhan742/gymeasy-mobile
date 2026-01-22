import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  sub?: string;
  gradient: string[];
};

export default function StatCard({
  icon,
  label,
  value,
  sub,
  gradient,
}: Props) {
  return (
    <LinearGradient colors={gradient} style={styles.card}>
      <View style={styles.row}>
        <Ionicons name={icon} size={22} color="#fff" />
        <Text style={styles.value}>{value}</Text>
      </View>

      <Text style={styles.label}>{label}</Text>
      {sub && <Text style={styles.sub}>{sub}</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
  width: 190,
  borderRadius: 16,
  padding: 14,
  marginRight: 12,
},

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  value: {
    marginLeft: 10,
     fontSize: 22,
    color: "#fff",
    fontFamily: "Inter-Bold",
  },

  label: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Inter-Medium",
  },

  sub: {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
});
