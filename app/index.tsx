import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenWrapper from "../components/layout/ScreenWrapper";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const boot = async () => {
      const permissionsDone = await AsyncStorage.getItem("permissions_done");

      setTimeout(() => {
        if (!permissionsDone) {
          router.replace("/(onboarding)/permissions");
        } else {
          router.replace("/(auth)/login");
        }
      }, 2200);
    };

    boot();
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.centerWrapper}>
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>GymEasy</Text>
        <Text style={styles.subtitle}>Smart Gym Management App</Text>

        <ActivityIndicator
          size="small"
          color="#ffffff"
          style={{ marginTop: 28 }}
        />
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

  logo: {
    width: 110,
    height: 110,
    marginBottom: -5,
  },

  title: {
  fontSize: 30,
  fontFamily: "Inter-Bold",
  color: "#ffffff",
  letterSpacing: 0.3,

},

subtitle: {
  marginTop: 6,
  fontSize: 14,
  fontFamily: "Inter-Regular",
  color: "#cfcfcf9d",
  letterSpacing: 1.4 // very premium look

},
  
  logoWrapper: {
  borderRadius: 20,

  // iOS — soft bottom drop shadow (like screenshot)
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 20 },
  shadowOpacity: 1,
  shadowRadius: 18,

  // Android — equivalent depth
  elevation: 10,

  marginBottom: 24,
},

});
