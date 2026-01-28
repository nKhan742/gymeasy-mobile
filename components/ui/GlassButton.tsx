import { useThemeContext } from "@/contexts/ThemeContext";
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

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

export default function GlassButton({
  title,
  onPress,
  style,
  disabled = false,
}: GlassButtonProps) {
  const { colors } = useThemeContext();
  
  // Create rgba versions for rim and fill
  const rimColor1 = hexToRgba(colors.gradient[0], 0.9);
  const rimColor2 = hexToRgba(colors.gradient[1], 0.9);
  const fillColor1 = hexToRgba(colors.gradient[0], 0.85);
  const fillColor2 = hexToRgba(colors.gradient[1], 0.85);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled}
      style={[styles.wrapper, style, disabled && { opacity: 0.6 }]}
    >
      {/* SHINY GRADIENT RIM */}
      <LinearGradient
        colors={[rimColor1, rimColor2, rimColor1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.rim}
      >
        {/* GLASS BODY */}
        <View style={styles.glass}>
          {/* BUTTON FILL */}
          <LinearGradient
            colors={[fillColor1, fillColor2]}
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

