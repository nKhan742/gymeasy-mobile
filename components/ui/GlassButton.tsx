import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface GlassButtonProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function GlassButton({
  title,
  onPress,
  style,
  disabled = false,
}: GlassButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled}
      style={[styles.wrapper, style, disabled && { opacity: 0.6 }]}
    >
      {/* SHINY GRADIENT RIM */}
      <LinearGradient
        colors={[
          "rgba(120,160,255,0.9)",
          "rgba(90,230,190,0.9)",
          "rgba(120,160,255,0.9)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.rim}
      >
        {/* GLASS BODY */}
        <View style={styles.glass}>
          {/* BUTTON FILL */}
          <LinearGradient
            colors={[
              "rgba(70,120,255,0.85)",
              "rgba(70,200,170,0.85)",
            ]}
            start={{ x: 0.1, y: 0.2 }}
            end={{ x: 0.9, y: 0.8 }}
            style={styles.fill}
          >
            <Text style={styles.text}>{title}</Text>
          </LinearGradient>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },

  rim: {
    borderRadius: 20,
    padding: 1.5, // thickness of shiny rim
  },

  glass: {
    borderRadius: 17,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.12)", // frosted plate
  },

  fill: {
    height: 56,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.95,
  },

  text: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
});

