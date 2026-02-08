import { BlurView } from "expo-blur";
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
        "rgba(105,64,154,0.45)",
        "rgba(180,160,255,0.25)",
        "rgba(255,255,255,0.12)",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.outline, style]}
    >
      <View style={styles.wrapper}>
        <BlurView intensity={11} tint="dark" style={styles.blur}>
          <View style={styles.card}>{children}</View>
        </BlurView>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  /* Gradient outline */
  outline: {
    borderRadius: 14,     // slightly bigger than card
    padding: 1.6,         // outline thickness
  },

  wrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },

  blur: {
    borderRadius: 12,
  },

  card: {
    backgroundColor: "rgba(36, 22, 53, 0.38)",
    padding: 16,
    borderRadius: 12,
  },
});
