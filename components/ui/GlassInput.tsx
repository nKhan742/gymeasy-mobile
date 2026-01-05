import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";

export default function GlassInput({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={35} tint="dark" style={styles.blur}>
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 12,

    // shiny outline
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",

    // subtle glow
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    elevation: 4, // Android subtle glow
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  blur: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});
