import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  sub?: string;
  isClickable?: boolean;
};

export default function StatCard({
  icon,
  label,
  value,
  sub,
  isClickable,
}: Props) {
  return (
    <View style={styles.wrapper}>
      {/* BLUR */}
      <BlurView
        intensity={24}
        tint="light"
        style={StyleSheet.absoluteFill}
      />

      {/* GLASS FILL */}
      <View style={styles.glass}>
        {/* TOP SHINE */}
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255,255,255,0.7)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topLine}
        />

        {/* LEFT SHINE */}
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.6)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.leftLine}
        />

        {/* CONTENT */}
        <View style={styles.row}>
          <Ionicons name={icon} size={22} color="#fff" />
          <Text style={styles.value}>{value}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{label}</Text>
            {sub && <Text style={styles.sub}>{sub}</Text>}
          </View>
          {isClickable && (
            <View style={styles.clickIndicator}>
              <Ionicons name="arrow-forward" size={16} color="#60a5fa" />
            </View>
          )}
        </View>
      </View>

      {/* CLICKABLE BADGE */}
      {isClickable && (
        <View style={styles.clickBadge}>
          <Text style={styles.clickBadgeText}>Tap</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    width: 190,
    borderRadius: 16,
    padding: 0,
    marginRight: 12,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 10,
  },

  glass: {
    padding: 14,
    backgroundColor: "rgba(52,40,84,0.35)",
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
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter-Medium",
  },

  sub: {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    fontFamily: "Inter-Regular",
  },

  topLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },

  leftLine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 1,
    bottom: 0,
  },

  clickIndicator: {
    paddingLeft: 8,
    justifyContent: "center",
  },

  clickBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(96,165,250,0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,1)",
  },

  clickBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
