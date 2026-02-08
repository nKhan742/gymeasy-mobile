import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GRADIENT = {
  rim: ["#352039", "#897faa", "#352039"],
  fill: ["#251736", "#322754", "#251736"],
};

interface GlassFabProps {
  onPress?: () => void;
}

export default function GlassFab({ onPress }: GlassFabProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      {/* RIM */}
      <LinearGradient
        colors={GRADIENT.rim}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.rim}
      >
        {/* GLASS */}
        <View style={styles.glass}>
          {/* FILL */}
          <LinearGradient
            colors={GRADIENT.fill}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 0.8, y: 0.8 }}
            style={styles.fill}
          >
            <Ionicons name="add" size={26} color="#fff" />
          </LinearGradient>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rim: {
    padding: 2,
    borderRadius: 40,
  },

  glass: {
    borderRadius: 38,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
    shadowColor: "#b48cff",
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 14,
  },

  fill: {
    width: 56,
    height: 56,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
  },
});
