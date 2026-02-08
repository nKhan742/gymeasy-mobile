import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function GlassTabBarBackground() {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={26} tint="light" style={styles.blur}>
        {/* Glass fill */}
        <View style={styles.glass}>
          {/* TOP SHINE (::before) */}
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255,255,255,0.8)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topLine}
          />

          {/* LEFT SHINE (::after) */}
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.8)",
              "transparent",
              "rgba(255,255,255,0.3)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.leftLine}
          />
        </View>
      </BlurView>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },

  blur: {
    flex: 1,
  },

  glass: {
    flex: 1,
    backgroundColor: "rgba(52,40,84,0.4)",
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
});
