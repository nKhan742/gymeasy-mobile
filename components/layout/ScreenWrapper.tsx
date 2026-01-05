import React from "react";
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    View,
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function ScreenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={styles.root}>
      <ImageBackground
        // source={require("../../assets/images/bg.jpg")}
        source={require("../../assets/images/app-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>{children}</View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
  },

  background: {
    width,
    height,
  },

  overlay: {
    flex: 1,
    // height: "100%",
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
});
