import Header from "@/components/layout/Header";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassButton from "@/components/ui/GlassButton";
import GlassInput from "@/components/ui/GlassInput";
import { addMember } from "@/services/member.service";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

console.log("🔥 ADD MEMBER SCREEN FILE LOADED 🔥");

export default function AddMemberScreen() {
  console.log("🔥 ADD MEMBER SCREEN RENDER 🔥");

  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    plan: "",
    amount: "",
    feesPaid: false,
  });

  const plans = [
    { label: "Monthly", value: "Monthly", amount: 1500 },
    { label: "Quarterly", value: "Quarterly", amount: 3000 },
    { label: "Yearly", value: "Yearly", amount: 10000 },
  ];

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handlePlanSelect = (plan: string, amount: number) => {
    setForm(prev => ({
      ...prev,
      plan,
      amount: String(amount),
    }));
    setShowPlanModal(false);
  };

  // 📷 Aadhaar Scan
  const scanAadhaar = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access needed");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      Alert.alert("Scan captured", "OCR integration coming soon");
    }
  };

const saveMember = async () => {
  const parsedAmount = Number(form.amount);

  if (!form.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
    Alert.alert("Error", "Please enter a valid amount");
    return;
  }

  if (!form.name.trim() || !form.phone.trim()) {
    Alert.alert("Error", "Name and phone are required");
    return;
  }

  if (!form.plan) {
    Alert.alert("Error", "Please select a membership plan");
    return;
  }

  const payload = {
    name: form.name.trim(),
    phone: form.phone.trim(),
    address: form.address.trim() || undefined,
    plan: form.plan,
    amount: parsedAmount,
    feesPaid: form.feesPaid,
    joiningDate: new Date().toISOString(),
  };

  console.log("📦 FINAL PAYLOAD:", payload);

  try {
    setIsLoading(true);
    await addMember(payload);

    Alert.alert("Success", "Member added successfully", [
      {
        text: "OK",
        onPress: () => router.replace("/(tabs)/members"),
      },
    ]);
  } catch (error: any) {
    console.log("❌ ADD MEMBER ERROR:", error?.response?.data || error.message);
    Alert.alert(
      "Error",
      error?.response?.data?.error || "Failed to add member"
    );
  } finally {
    setIsLoading(false);
  }
};





  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Add Member" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.centerWrapper}>
            <TouchableOpacity style={styles.scanCard} onPress={scanAadhaar}>
              <Ionicons name="camera-outline" size={26} color="#fff" />
              <Text style={styles.scanText}>Scan Aadhaar Card</Text>
            </TouchableOpacity>

            <Text style={styles.or}>OR</Text>

            <GlassInput>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
                value={form.name}
                onChangeText={(v) => handleChange("name", v)}
              />
            </GlassInput>

            <View style={styles.gap} />

            <GlassInput>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="phone-pad"
                style={styles.input}
                value={form.phone}
                onChangeText={(v) => handleChange("phone", v)}
              />
            </GlassInput>

            <View style={styles.gap} />

            <GlassInput>
              <TextInput
                placeholder="Address"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
                value={form.address}
                onChangeText={(v) => handleChange("address", v)}
              />
            </GlassInput>

            <View style={styles.gap} />

            <TouchableOpacity
              style={styles.planButton}
              onPress={() => setShowPlanModal(true)}
            >
              <Text
                style={[
                  styles.planButtonText,
                  !form.plan && styles.planButtonPlaceholder,
                ]}
              >
                {form.plan || "Select Plan"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>

            <Modal
              visible={showPlanModal}
              transparent
              animationType="fade"
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowPlanModal(false)}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Plan</Text>
                  {plans.map((p) => (
                    <TouchableOpacity
                      key={p.value}
                      style={[
                        styles.planOption,
                        form.plan === p.value && styles.planOptionActive,
                      ]}
                      onPress={() => handlePlanSelect(p.value, p.amount)}
                    >
                      <Text
                        style={[
                          styles.planOptionText,
                          form.plan === p.value && styles.planOptionTextActive,
                        ]}
                      >
                        {p.label} - ₹{p.amount}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            <View style={styles.gap} />

            <GlassInput>
              <TextInput
                placeholder="Amount Paid"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="numeric"
                style={styles.input}
                value={form.amount}
                onChangeText={(v) => handleChange("amount", v)}
              />
            </GlassInput>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => handleChange("feesPaid", !form.feesPaid)}
            >
              <View style={styles.checkbox}>
                {form.feesPaid && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxText}>Fees Paid</Text>
            </TouchableOpacity>

            <GlassButton
              title={isLoading ? "Adding..." : "Save Member"}
              onPress={saveMember}
              style={{ marginTop: 28 }}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    padding: 20,
    paddingBottom: 60,
  },

  scanCard: {
    height: 120,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  scanText: {
    color: "#fff",
    marginTop: 10,
    fontFamily: "Inter-Medium",
  },

  or: {
    color: "#cfcfcf",
    textAlign: "center",
    marginBottom: 18,
  },

  input: {
    color: "#fff",
    fontFamily: "Inter-Regular",
    fontSize: 15,
  },

  gap: {
    height: 14,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  checkboxText: {
    color: "#fff",
    fontFamily: "Inter-Medium",
  },

  planButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    marginBottom: 0,
  },

  planButtonText: {
    color: "#fff",
    fontFamily: "Inter-Regular",
    fontSize: 15,
    flex: 1,
  },

  planButtonPlaceholder: {
    color: "rgba(255,255,255,0.6)",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#1a1a2e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },

  planOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  planOptionActive: {
    backgroundColor: "rgba(66, 230, 149, 0.2)",
    borderColor: "#42E695",
  },

  planOptionText: {
    color: "#fff",
    fontFamily: "Inter-Medium",
    fontSize: 15,
  },

  planOptionTextActive: {
    color: "#42E695",
  },
});
