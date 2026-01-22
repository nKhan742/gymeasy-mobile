import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabButton({ icon, label, focused, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.tabItem}
    >
      <Ionicons
        name={icon}
        size={22}
        color={focused ? "#42E695" : "#b7b9d6"}
        style={focused && styles.activeIcon}
      />
      <Text
        style={[
          styles.tabLabel,
          focused && styles.activeLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* FLOATING FAB */}
      <View
        pointerEvents="box-none"
        style={[
          styles.fabWrapper,
          { bottom: insets.bottom + 28 },
        ]}
      >
        <LinearGradient
          colors={["#42E695", "#3BB2B8"]}
          style={styles.fab}
        >
          <Ionicons name="add" size={34} color="#fff" />
        </LinearGradient>
      </View>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            { paddingBottom: insets.bottom },
          ],
          tabBarBackground: () => (
            <BlurView
              intensity={55}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            tabBarButton: (props) => (
              <TabButton {...props} icon="home" label="Dashboard" />
            ),
          }}
        />

        <Tabs.Screen
          name="members"
          options={{
            tabBarButton: (props) => (
              <TabButton {...props} icon="people" label="Members" />
            ),
          }}
        />

        {/* Dummy route for spacing only */}
        <Tabs.Screen
          name="add"
          options={{
            tabBarButton: () => <View style={{ width: 70 }} />,
          }}
          listeners={{
            tabPress: (e) => e.preventDefault(),
          }}
        />

        <Tabs.Screen
          name="payments"
          options={{
            tabBarButton: (props) => (
              <TabButton {...props} icon="card" label="Payments" />
            ),
          }}
        />

        <Tabs.Screen
          name="whatsapp"
          options={{
            tabBarButton: (props) => (
              <TabButton
                {...props}
                icon="logo-whatsapp"
                label="WhatsApp"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
    overflow: "visible", // 🔥 CRITICAL
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },

  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    color: "#b7b9d6",
    fontFamily: "Inter-Medium",
  },

  activeLabel: {
    color: "#42E695",
  },

  activeIcon: {
    textShadowColor: "#42E695",
    textShadowRadius: 10,
  },

  fabWrapper: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 100,
  },

  fab: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#42E695",
    shadowOpacity: 0.7,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
});
