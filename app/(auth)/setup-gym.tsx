import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import ScreenWrapper from "../../components/layout/ScreenWrapper";
import GlassInput from "../../components/ui/GlassInput";

export default function SetupGymScreen() {
  const router = useRouter();

  const [gymName, setGymName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [fee, setFee] = useState("");
  const [openingDate] = useState("15/05/2024");

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>

            {/* TITLE */}
            <Text style={styles.title}>Set Up Your Gym</Text>
            <Text style={styles.subtitle}>
              Enter your gym details to get started.
            </Text>

            {/* INPUTS */}
            <View style={styles.inputWrapper}>
              <GlassInput>
                <TextInput
                  placeholder="Gym Name"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  style={styles.input}
                  value={gymName}
                  onChangeText={setGymName}
                />
              </GlassInput>
            </View>

            <View style={styles.gap} />

            <View style={styles.inputWrapper}>
              <GlassInput>
                <TextInput
                  placeholder="Address"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                />
              </GlassInput>
            </View>

            <View style={styles.gap} />

            <View style={styles.inputWrapper}>
              <GlassInput>
                <TextInput
                  placeholder="City"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                />
              </GlassInput>
            </View>

            <View style={styles.gap} />

            <View style={styles.inputWrapper}>
              <GlassInput>
                <TextInput
                  placeholder="+91  Phone (Gym)"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="phone-pad"
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                />
              </GlassInput>
            </View>

            <View style={styles.gap} />

            <View style={styles.inputWrapper}>
              <GlassInput>
                <TextInput
                  placeholder="₹  Monthly Default Fee"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="numeric"
                  style={styles.input}
                  value={fee}
                  onChangeText={setFee}
                />
              </GlassInput>
            </View>

            <View style={styles.gap} />

            <View style={styles.inputWrapper}>
              <GlassInput>
                <TextInput
                  placeholder="Opening Date"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  style={styles.input}
                  value={openingDate}
                  editable={false}
                />
              </GlassInput>
            </View>

            {/* CTA */}
            <TouchableOpacity style={styles.ctaWrapper}>
              <View style={styles.buttonOutline}>
                <LinearGradient
                  colors={["#4F7CFF", "#42E695"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Save & Continue</Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>

            {/* GOOGLE */}
            <TouchableOpacity style={styles.googleRow} activeOpacity={0.7}>
              <Image
                source={require("../../assets/images/google.png")}
                style={styles.googleIcon}
                resizeMode="contain"
              />
              <Text style={styles.googleText}>Sign Up with Google</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#cfcfcf",
    marginTop: 6,
    marginBottom: 28,
    textAlign: "center",
  },

  inputWrapper: {
    width: "100%",
  },

  input: {
    color: "#ffffff",
    fontFamily: "Inter-Regular",
    fontSize: 15,
  },

  gap: {
    height: 14,
  },

  ctaWrapper: {
    width: "100%",
    marginTop: 26,
  },

  buttonOutline: {
    width: "100%",
    borderRadius: 14,
    padding: 1.2,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  button: {
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 17,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },

  googleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
  },

  googleIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },

  googleText: {
    color: "#ffffff",
    fontFamily: "Inter-Medium",
  },
});
