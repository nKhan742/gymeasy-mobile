import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,

        // Smooth transition
        animation: "fade_from_bottom",

        // Extra polish
        animationDuration: 280,

        gestureEnabled: true,
      }}
    />
  );
}
