import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { AuthGuard } from "../components/AuthGuard";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter_18pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter_18pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),
  });

  // Auth state is now properly managed by Zustand persist hydration
  // No need for manual loading state management

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthGuard>
      <Stack
        screenOptions={{
          headerShown: false,

          // 🔥 Smooth global transitions
          animation: "fade",
          animationDuration: 260,

          // Natural gesture handling
          gestureEnabled: true,
           // 🔴 THIS FIXES WHITE FLASH
      contentStyle: {
        backgroundColor: "#000000",
      },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthGuard>
  );
}
