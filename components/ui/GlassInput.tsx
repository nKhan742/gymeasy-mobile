import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function GlassInput({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={35} tint="dark" style={styles.blur}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.18)",
            "rgba(255,255,255,0.06)",
          ]}
          style={styles.inner}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    marginBottom: 14,
  },

  blur: {
    width: "100%",
  },

  inner: {
    height: 52,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
});
