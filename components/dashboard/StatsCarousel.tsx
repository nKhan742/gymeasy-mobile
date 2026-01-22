import { ScrollView, StyleSheet, View } from "react-native";
import StatCard from "./StatCard";

export default function StatsCarousel() {
  return (
   <View style={styles.wrapper}>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.scroll}
  >
        <StatCard
          icon="warning-outline"
          label="Expired Members"
          value="26"
          sub="Needs renewal"
          gradient={["#ff5f6d", "#ffc371"]}
        />

        <StatCard
          icon="cash-outline"
          label="Total Revenue"
          value="₹1,20,500"
          sub="+15% this month"
          gradient={["#36d1dc", "#5b86e5"]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 6,      // ⬅️ pulls cards up
    marginBottom: 22,
  },

  scroll: {
    paddingLeft: 2,   // subtle alignment
    paddingRight: 16,
  },
});

