import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

export default function GlassCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <LinearGradient
      colors={[
        "rgba(255,255,255,0.16)",
        "rgba(255,255,255,0.04)",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, style]}
    >
      {/* Inner glow layer */}
      <View style={styles.innerGlow} />

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    position: "relative",

    // Soft border
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",

    // Outer shadow (depth)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },

  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,

    // Subtle inner light
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  content: {
    zIndex: 1,
  },
});
