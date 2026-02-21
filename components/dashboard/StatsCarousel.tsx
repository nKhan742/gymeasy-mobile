import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import StatCard from "./StatCard";

interface StatsCarouselProps {
  totalMembers: number;
  // activeMembers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  expiringCount: number;
  pendingRevenue: number;
  onRevenuePress?: () => void;
}

export default function StatsCarousel({
  totalMembers,
  // activeMembers,
  totalRevenue,
  monthlyRevenue,
  expiringCount,
  pendingRevenue,
  onRevenuePress,
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
        />

        {/* EXPIRING MEMBERS */}
        <StatCard
          icon="warning-outline"
          label="Expiring Soon"
          value={String(expiringCount)}
          sub="Needs renewal"
        />

        {/* MONTHLY REVENUE */}
        <StatCard
          icon="trending-up-outline"
          label="This Month"
          value={`₹${monthlyRevenue.toLocaleString("en-IN")}`}
          sub="Monthly revenue"
        />

        {/* TOTAL REVENUE - CLICKABLE */}
        <TouchableOpacity onPress={onRevenuePress} activeOpacity={0.85}>
          <StatCard
            icon="cash-outline"
            label="Total Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            sub="Overall collection"
            isClickable={true}
          />
        </TouchableOpacity>

        {/* PENDING REVENUE */}
        <StatCard
          icon="hourglass-outline"
          label="Pending"
          value={`₹${pendingRevenue.toLocaleString("en-IN")}`}
          sub="Awaiting payment"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    marginBottom: 22,
  },

  scroll: {
    paddingLeft: 2,
    paddingRight: 16,
  },
});
