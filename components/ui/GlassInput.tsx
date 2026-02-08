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
            "rgba(132, 123, 164, 0.2)",
            "rgba(36, 22, 53, 0.17)",
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
    borderWidth: 2,
    borderColor: "rgba(132,123,164,0.25)",
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
