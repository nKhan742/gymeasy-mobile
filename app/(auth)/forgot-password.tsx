import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import GlassButton from "@/components/ui/GlassButton";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import GlassInput from "../../components/ui/GlassInput";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, width: "100%" }}
      >
        <View style={styles.container}>

          {/* LOGO */}
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your phone or email to reset your password
          </Text>

          {/* INPUT */}
          <GlassInput>
            <TextInput
              placeholder="Phone or Email"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              keyboardType="email-address"
            />
          </GlassInput>

          {/* SUBMIT */}

          <GlassButton
            title="Send Reset Link"
            onPress={() => {
              console.log("RESET LINK REQUESTED");
            }}
            style={{ marginTop: 18 }}
          />


          {/* BACK TO LOGIN */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.replace("/(auth)/login")}

          >
            <Text style={styles.back}>Back to Login</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: "center",
  },

  logoWrapper: {
    marginBottom: 18,
  },

  logo: {
    width: 72,
    height: 72,
  },

  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#cfcfcf",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    color: "#ffffff",
    fontFamily: "Inter-Regular",
    fontSize: 15,
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
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },

  back: {
    marginTop: 22,
    color: "#cfcfcf",
    fontFamily: "Inter-Regular",
    fontSize: 13,
  },
});
