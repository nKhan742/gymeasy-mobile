import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GlassCard from "@/components/ui/GlassCard";

interface RevenueCardProps {
  label: string;
  value: number;
  subLabel?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function RevenueCard({
  label,
  value,
  subLabel,
  backgroundColor = "rgba(34,197,94,0.15)",
  textColor = "#22c55e",
}: RevenueCardProps) {
  const formattedValue = value.toLocaleString("en-IN");

  return (
    <View
      style={[
        styles.card,
        { backgroundColor },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: textColor }]}>₹{formattedValue}</Text>
      </View>
      {subLabel && (
        <Text style={styles.subLabel}>{subLabel}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 0,
  },
  label: {
    fontSize: 13,
    color: "#a8a8a8",
    marginBottom: 8,
  },
  valueContainer: {
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
  },
  subLabel: {
    fontSize: 12,
    color: "#737373",
  },
});
