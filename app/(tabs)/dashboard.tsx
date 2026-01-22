import { ScrollView, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
// import ExpiringSoonSection from "../../components/dashboard/ExpiringSoonSection";
// import RecentPaymentsSection from "../../components/dashboard/RecentPaymentsSection";
import StatsCarousel from "../../components/dashboard/StatsCarousel";

export default function DashboardScreen() {
  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader />

        <StatsCarousel />

        {/* <ExpiringSoonSection />

        <RecentPaymentsSection /> */}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100, // for tab bar
  },
});
