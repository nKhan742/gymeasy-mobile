import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import GlassButton from "@/components/ui/GlassButton";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import GlassInput from "../../components/ui/GlassInput";

export default function RegisterScreen() {
  const router = useRouter();

  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    console.log({
      ownerName,
      phone,
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.centerWrapper}>
        <View style={styles.container}>

          {/* LOGO */}
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>Create Your Gym Account</Text>
          <Text style={styles.subtitle}>
            Register once. Manage everything effortlessly.
          </Text>

          {/* INPUTS */}
          <GlassInput>
            <TextInput
              placeholder="Gym Owner Name"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              value={ownerName}
              onChangeText={setOwnerName}
            />
          </GlassInput>

          <View style={styles.gap} />

          <GlassInput>
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="phone-pad"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
            />
          </GlassInput>

          <View style={styles.gap} />

          <GlassInput>
            <TextInput
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </GlassInput>

          <View style={styles.gap} />

          <GlassInput>
            <TextInput
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.6)"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </GlassInput>

          <View style={styles.gap} />

          <GlassInput>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="rgba(255,255,255,0.6)"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </GlassInput>

          {/* REGISTER BUTTON */}

          <GlassButton
            title="Register"
            onPress={() => {
              // handle login
            }}
            style={{ marginTop: 18 }}
          />

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text style={styles.login}> Login</Text>
            </TouchableOpacity>
          </View>

        </View></View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },

  container: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  logoWrapper: {
    marginBottom: 16,
  },

  logo: {
    width: 72,
    height: 72,
  },

  title: {
    fontSize: 26,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginTop: 8,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#cfcfcf",
    marginTop: 6,
    marginBottom: 28,
    textAlign: "center",
  },

  input: {
    color: "#ffffff",
    fontFamily: "Inter-Regular",
    fontSize: 15,
    letterSpacing: 0.2,
  },

  gap: {
    height: 14,
  },

  buttonOutline: {
    width: "100%",
    borderRadius: 14,
    padding: 1.2,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  button: {
    width: "100%",
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

  footer: {
    flexDirection: "row",
    marginTop: 24,
  },

  footerText: {
    color: "#cfcfcf",
    fontFamily: "Inter-Regular",
  },

  login: {
    color: "#ffffff",
    fontFamily: "Inter-SemiBold",
  },
});
