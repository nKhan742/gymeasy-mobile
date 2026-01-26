import ScreenWrapper from "@/components/layout/ScreenWrapper";
import GlassButton from "@/components/ui/GlassButton";
import GlassInput from "@/components/ui/GlassInput";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddMemberScreen() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    plan: "",
    amount: "",
    feesPaid: false,
  });

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  // 📷 Aadhaar Scan
  const scanAadhaar = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access needed");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      Alert.alert(
        "Scan captured",
        "OCR integration will auto-fill data here"
      );
    }
  };

  const saveMember = () => {
    if (!form.name || !form.phone) {
      Alert.alert("Error", "Name and phone are required");
      return;
    }

    console.log("NEW MEMBER:", form);
    Alert.alert("Success", "Member added successfully");
  };

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.centerWrapper}>
          <Text style={styles.header}>Add Member</Text>

          {/* 📷 Aadhaar Scan */}
          <TouchableOpacity
            style={styles.scanCard}
            onPress={scanAadhaar}
          >
            <Ionicons name="camera-outline" size={26} color="#fff" />
            <Text style={styles.scanText}>Scan Aadhaar Card</Text>
          </TouchableOpacity>

          <Text style={styles.or}>OR</Text>

          {/* Manual Form */}
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

          <GlassInput>
            <TextInput
              placeholder="Plan (Monthly / Yearly)"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              value={form.plan}
              onChangeText={(v) => handleChange("plan", v)}
            />
          </GlassInput>

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

          {/* ✅ Fees Paid Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() =>
              handleChange("feesPaid", !form.feesPaid)
            }
            activeOpacity={0.8}
          >
            <View style={styles.checkbox}>
              {form.feesPaid && (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color="#fff"
                />
              )}
            </View>
            <Text style={styles.checkboxText}>
              Fees Paid
            </Text>
          </TouchableOpacity>

          <GlassButton
            title="Save Member"
            onPress={saveMember}
            style={{ marginTop: 28 }}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
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

  header: {
    fontSize: 22,
    color: "#fff",
    fontFamily: "Inter-SemiBold",
    textAlign: "center",
    marginBottom: 24,
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
});
