// import { useNavigation } from "@react-navigation/native";
import GlassButton from "@/components/ui/GlassButton";
import { useRouter } from "expo-router";
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

import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";






export default function LoginScreen() {

  // const navigation = useNavigation<any>();
  const router = useRouter();

  const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", {
      email: "test@gmail.com", // replace with input state
      password: "123456",
    });

    const { token, user } = res.data;

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    router.replace("/(tabs)/dashboard");
  } catch (error: any) {
    console.log("LOGIN ERROR:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Login failed");
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
        <TouchableOpacity style={styles.googleBtn}>
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
          />
        </GlassInput>

        <View style={{ height: 14 }} />

        <GlassInput>
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.6)"
            secureTextEntry
            style={styles.input}
          />
        </GlassInput>

        {/* FORGOT */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/(auth)/forgot-password")}
        >
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* LOGIN BUTTON */}
        <GlassButton
  title="Login"
  onPress={handleLogin}
  style={{ marginTop: 18 }}
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




});


