import { ScrollView, StyleSheet, View } from "react-native";
import StatCard from "./StatCard";

interface StatsCarouselProps {
  totalMembers: number;
  // activeMembers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  expiringCount: number;
}

export default function StatsCarousel({
  totalMembers,
  // activeMembers,
  totalRevenue,
  monthlyRevenue,
  expiringCount,
}: StatsCarouselProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* TOTAL MEMBERS */}
        <StatCard
          icon="people-outline"
          label="Total Members"
          value={String(totalMembers)}
          sub="All registered"
          gradient={["#8E2DE2", "#4A00E0"]}
        />

        {/* ACTIVE MEMBERS */}
        {/* <StatCard
          icon="checkmark-circle-outline"
          label="Active Members"
          value={String(activeMembers)}
          sub="Currently training"
          gradient={["#11998e", "#38ef7d"]}
        /> */}

        {/* EXPIRING MEMBERS */}
        <StatCard
          icon="warning-outline"
          label="Expiring Soon"
          value={String(expiringCount)}
          sub="Needs renewal"
          gradient={["#ff5f6d", "#ffc371"]}
        />

        {/* MONTHLY REVENUE */}
        <StatCard
          icon="trending-up-outline"
          label="This Month"
          value={`₹${monthlyRevenue.toLocaleString("en-IN")}`}
          sub="Monthly revenue"
          gradient={["#f7971e", "#ffd200"]}
        />

        {/* TOTAL REVENUE */}
        <StatCard
          icon="cash-outline"
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          sub="Overall collection"
          gradient={["#36d1dc", "#5b86e5"]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 6,
    marginBottom: 22,
  },

  scroll: {
    paddingLeft: 2,
    paddingRight: 16,
  },
});
