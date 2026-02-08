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

/* === BUTTON GRADIENT (MATCHES EDIT PROFILE IMAGE) === */
const GRADIENT = {
  rim: ["#352039", "#897faa", "#352039"],
  fill: [ "#251736","#322754", "#251736"],
};

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
      {/* SHINY GLASS RIM */}
      <LinearGradient
        colors={GRADIENT.rim}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.rim}
      >
        {/* GLASS BODY */}
        <View style={styles.glass}>
          {/* BUTTON FILL */}
          <LinearGradient
            colors={GRADIENT.fill}
            start={{ x: 0.15, y: 0.2 }}
            end={{ x: 0.85, y: 0.8 }}
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

  /* Thin shiny outline */
  rim: {
    borderRadius: 20,
    padding: 1.5,
  },

  /* Frosted glass layer */
  glass: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
    shadowColor: "#b48cff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  /* Main gradient fill */
  fill: {
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
    letterSpacing: 0.4,
  },
});
