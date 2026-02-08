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
import GlassInput from "@/components/ui/GlassInput";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (
      !ownerName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setError("");
      await register(
        email.trim(),
        password,
        ownerName.trim(),
        phone.trim()
      );

      setTimeout(() => {
        router.replace("/(tabs)/dashboard");
      }, 100);
    } catch (err: any) {
      console.log("REGISTER ERROR:", err.response?.data || err.message);

      const status = err.response?.status;
      let message = "Registration failed. Please try again.";

      if (status === 409) {
        message = "An account with this email already exists.";
      } else if (status === 400) {
        message = err.response?.data?.message || "Invalid registration details.";
      } else if (status >= 500) {
        message = "Server error. Please try again later.";
      }

      setError(message);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.centerWrapper}>
        <View style={styles.container}>

          {/* LOGO */}
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />

          {/* TITLE */}
          <Text style={styles.title}>Create Your Gym Account</Text>
          <Text style={styles.subtitle}>
            Register once. Manage everything effortlessly.
          </Text>

          {/* OWNER NAME */}
          <GlassInput>
            <TextInput
              placeholder="Name"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              value={ownerName}
              onChangeText={setOwnerName}
            />
          </GlassInput>

          <View style={styles.gap} />

          {/* PHONE */}
          <GlassInput>
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
            />
          </GlassInput>

          <View style={styles.gap} />

          {/* EMAIL */}
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

          {/* PASSWORD */}
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

          {/* CONFIRM PASSWORD */}
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

          {/* ERROR */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* REGISTER BUTTON */}
          <GlassButton
            title={isLoading ? "Creating Account..." : "Register"}
            onPress={handleRegister}
            disabled={isLoading}
            style={{ marginTop: 18 }}
          />

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text style={styles.login}> Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 16,
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
  input: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },
  gap: {
    height: 14,
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
  errorText: {
    color: "#ff6b6b",
    marginTop: 10,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
});
