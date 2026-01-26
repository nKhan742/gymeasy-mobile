// import { useNavigation } from "@react-navigation/native";
import GlassButton from "@/components/ui/GlassButton";
import { useAuth } from "@/hooks/useAuth";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import GlassInput from "../../components/ui/GlassInput";

export default function LoginScreen() {
  const router = useRouter();
  const { login, googleLogin, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Configure WebBrowser for auth session
  React.useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  // Google Auth configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID", // Replace with your actual client ID
    iosClientId: "YOUR_IOS_CLIENT_ID", // Replace with your actual client ID
    webClientId: "YOUR_WEB_CLIENT_ID", // Replace with your actual client ID
  });

  // Handle Google auth response
  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleLogin(authentication?.accessToken);
    }
  }, [response]);

  const handleGoogleLogin = async (accessToken: string | undefined) => {
    if (!accessToken) {
      setError("Google authentication failed");
      return;
    }

    try {
      setError("");
      // Get user info from Google
      const userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await userInfoResponse.json();

      // For now, we'll use the access token as the idToken
      // In a real app, you'd exchange the access token for an ID token
      await googleLogin(accessToken);

      // Small delay to ensure state is settled before navigation
      setTimeout(() => {
        router.replace('/(tabs)/dashboard');
      }, 100);
    } catch (error: any) {
      console.log("GOOGLE LOGIN ERROR:", error);
      setError("Google login failed. Please try again.");
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      await login(email.trim(), password);
      // Small delay to ensure state is settled before navigation
      setTimeout(() => {
        router.replace('/(tabs)/dashboard');
      }, 100);
    } catch (error: any) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);
      const statusCode = error.response?.status;
      let errorMessage = "Login failed. Please try again.";

      if (statusCode === 401) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (statusCode === 400) {
        errorMessage = error.response?.data?.message || "Invalid login details.";
      } else if (statusCode >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
    }
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Login to manage your gym effortlessly
        </Text>

        {/* GOOGLE BUTTON */}
        <TouchableOpacity 
          style={styles.googleBtn}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Image
            source={require("../../assets/images/google.png")}
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* OR */}
        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* INPUTS */}
        <GlassInput>
          <TextInput
            placeholder="Phone or Email"
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </GlassInput>

        <View style={{ height: 14 }} />

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

        {/* ERROR MESSAGE */}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {/* FORGOT */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/(auth)/forgot-password")}
        >
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* LOGIN BUTTON */}
        <GlassButton
  title={isLoading ? "Logging in..." : "Login"}
  onPress={handleLogin}
  style={{ marginTop: 18 }}
  disabled={isLoading}
/>




        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New here?</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.register}> Register</Text>
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
    marginBottom: 24,
    textAlign: "center",
  },

  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    height: 50,
    borderRadius: 14,
    width: "100%",
    justifyContent: "center",
    marginBottom: 22,
  },

  googleIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },

  googleText: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
    color: "#000",
  },

  orRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  orText: {
    marginHorizontal: 12,
    color: "#cfcfcf",
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },

 input: {
  color: "#ffffff",
  fontFamily: "Inter-Regular",
  fontSize: 15,
  letterSpacing: 0.3,
  paddingVertical: 0,
},
  forgot: {
    alignSelf: "flex-end",
    color: "#cfcfcf",
    fontSize: 13,
    marginTop: 10,
    marginBottom: 22,
    fontFamily: "Inter-Regular",
  },

  footer: {
    flexDirection: "row",
    marginTop: 22,
  },

  footerText: {
    color: "#cfcfcf",
    fontFamily: "Inter-Regular",
  },

  register: {
    color: "#ffffff",
    fontFamily: "Inter-SemiBold",
  },
  loginRim: {
  width: "100%",
  borderRadius: 34,
  padding: 2, // shiny rim thickness
  marginTop: 18,

  // shiny glass edge
  backgroundColor: "rgba(255,255,255,0.45)",
},

loginGlass: {
  borderRadius: 32,
  overflow: "hidden",

  // frosted inner plate
  backgroundColor: "rgba(255,255,255,0.10)",
},

loginGradient: {
  height: 56,
  borderRadius: 32,
  justifyContent: "center",
  alignItems: "center",

  // softens gradient so it looks glassy
  opacity: 0.92,
},

loginText: {
  fontSize: 16,
  fontFamily: "Inter-SemiBold",
  color: "#ffffff",
  letterSpacing: 0.3,
},

errorText: {
  color: "#ff6b6b",
  fontSize: 14,
  fontFamily: "Inter-Regular",
  marginTop: 8,
  textAlign: "center",
},

});


