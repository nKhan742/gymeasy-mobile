import { LinearGradient } from "expo-linear-gradient";
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
  return (
    <ScreenWrapper>
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
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* LOGIN BUTTON */}
        <TouchableOpacity style={{ width: "100%" }}>
        <View style={styles.loginOutline}>
            <LinearGradient
            colors={["#4F7CFF", "#42E695"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loginBtn}
            >
            <Text style={styles.loginText}>Login</Text>
            </LinearGradient>
        </View>
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New here?</Text>
          <Text style={styles.register}> Register</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
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
    letterSpacing: 0.2,
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
  loginOutline: {
    width: "100%",
    borderRadius: 14,
    padding: 1.2, // creates shiny edge
    backgroundColor: "rgba(255,255,255,0.35)",
    marginTop: 6,
    },

    loginBtn: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    },

    loginText: {
    fontSize: 17,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
    },

});


