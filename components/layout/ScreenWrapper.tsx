import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

export default function ScreenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={styles.root}>
      <ImageBackground
        source={require("../../assets/images/app-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },

  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "#00000091",
  },

  safe: {
    flex: 1,
  },
});
