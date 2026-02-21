import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

import { AuthGuard } from "../components/AuthGuard";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter_18pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter_18pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),
  });

  useEffect(() => {
    // Handle unhandled promise rejections
    const unhandledRejectionHandler = (reason: any) => {
      console.error("❌ Unhandled Promise Rejection:", reason);
      // Silently handle token refresh errors to prevent app crashes
    };

    const listener = (event: any) => {
      unhandledRejectionHandler(event.reason);
    };

    // Note: Web-like event handling
    if (typeof window !== 'undefined') {
      window.addEventListener?.('unhandledrejection', listener);
      return () => window.removeEventListener?.('unhandledrejection', listener);
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthGuard>
            <StatusBar style="light" />

            <Stack
              screenOptions={{
                headerShown: false,
                animation: "fade",
                animationDuration: 260,
                gestureEnabled: true,
                contentStyle: {
                  backgroundColor: "#000000",
                },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="settings" />
            </Stack>

            {/* 🔔 GLOBAL TOAST (ADD HERE, ONCE) */}
            <Toast />
          </AuthGuard>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
