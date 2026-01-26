import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ColorValue, StyleSheet, Text, View } from "react-native";

export default function PermissionCard({
  icon,
  iconBg,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  iconBg: readonly [ColorValue, ColorValue, ...ColorValue[]];
  title: string;
  subtitle?: string;
}) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.08)"]}
      style={styles.card}
    >
      <LinearGradient colors={iconBg} style={styles.iconCircle}>
        {icon}
      </LinearGradient>

      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.sub}>{subtitle}</Text>}
      </View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  title: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },

  sub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
});
