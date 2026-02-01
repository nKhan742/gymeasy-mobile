import { BG_SECONDARY, BORDER_PRIMARY, PRIMARY } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onHide?: () => void;
}

export const Toast = ({
  visible,
  message,
  type = "info",
  duration = 3000,
  onHide,
}: ToastProps) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const insets = useSafeAreaInsets(); // 👈 SAFE AREA

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide?.());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "warning":
        return "warning";
      default:
        return "information-circle";
    }
  };

  const getColor = () => {
    switch (type) {
      case "success":
        return "#52c41a";
      case "error":
        return "#ff4d4f";
      case "warning":
        return "#faad14";
      default:
        return PRIMARY;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 8, // ✅ SAFE AREA OFFSET
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.toast, { borderLeftColor: getColor() }]}>
        <Ionicons name={getIcon()} size={20} color={getColor()} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const TOAST_BG = "#0f172a";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
  },

  toast: {
    backgroundColor: TOAST_BG,
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: BORDER_PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  message: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#fff",
  },
});
