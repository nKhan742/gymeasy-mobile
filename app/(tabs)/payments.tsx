import Header from "@/components/layout/Header";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";

export default function PaymentsScreen() {
  const { colors } = useThemeContext();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 1500,
      period: "per month",
      description: "Everything you need to manage your gym",
      features: [
        "✓ Manage up to 100 members",
        "✓ Member tracking & expiry dates",
        "✓ Payment history",
        "✓ WhatsApp messaging (manual)",
        "✓ Member reports",
        "✓ Dashboard overview",
      ],
      badge: "Popular",
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: null,
      period: "coming soon",
      description: "Advanced features for growing gyms",
      features: [
        "✓ All Basic features",
        "✓ WhatsApp automation",
        "✓ Bulk messaging campaigns",
        "✓ Automated reminders",
        "✓ Member analytics",
        "✓ Priority support",
      ],
      badge: "Coming Soon",
      disabled: true,
    },
  ];

  const handleSelectPlan = (planId: string) => {
    if (planId === "premium") {
      Alert.alert("Coming Soon", "Premium plan with WhatsApp automation is coming soon!");
      return;
    }
    setSelectedPlan(selectedPlan === planId ? null : planId);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      Alert.alert("Select a Plan", "Please select a plan to continue");
      return;
    }

    // Integrate with payment gateway here (Razorpay, Stripe, etc.)
    Alert.alert("Payment", "Proceeding to payment gateway...\n\nIntegrate with Razorpay/Stripe");
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Subscription" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.container}>

          {/* PLANS */}
          <View style={styles.plansContainer}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && [styles.planCardSelected, { borderColor: colors.primary, backgroundColor: `${colors.primary}08` }],
                  plan.disabled && styles.planCardDisabled,
                ]}
                onPress={() => handleSelectPlan(plan.id)}
                disabled={plan.disabled}
              >
                {/* Badge */}
                <View
                  style={[
                    styles.badge,
                    plan.id === "basic"
                      ? [styles.badgePopular, { backgroundColor: colors.primary }]
                      : styles.badgeComingSoon,
                  ]}
                >
                  <Text style={styles.badgeText}>{plan.badge}</Text>
                </View>

                {/* Plan Name & Price */}
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceSection}>
                  {plan.price ? (
                    <>
                      <Text style={[styles.price, { color: colors.primary }]}>₹{plan.price}</Text>
                      <Text style={styles.period}>{plan.period}</Text>
                    </>
                  ) : (
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                  )}
                </View>

                <Text style={styles.description}>{plan.description}</Text>

                {/* Features List */}
                <View style={styles.featuresList}>
                  {plan.features.map((feature, index) => (
                    <Text key={index} style={styles.feature}>
                      {feature}
                    </Text>
                  ))}
                </View>

                {/* Selection Indicator */}
                {selectedPlan === plan.id && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* SUBSCRIBE BUTTON */}
          {selectedPlan && (
            <GlassButton
              title="Subscribe & Pay"
              onPress={handleSubscribe}
              style={{ marginTop: 24, marginBottom: 20 }}
            />
          )}

          {/* INFO BOX */}
          <View style={[styles.infoBox, { borderColor: colors.primary, backgroundColor: `${colors.primary}10` }]}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.primary }]}>
              Cancel your subscription anytime. No hidden charges.
            </Text>
          </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 140,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  headerSection: {
    marginBottom: 32,
    marginTop: 8,
  },

  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter-SemiBold",
    color: "#fff",
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#cfcfcf",
  },

  plansContainer: {
    gap: 16,
    marginBottom: 24,
  },

  planCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    position: "relative",
  },

  planCardSelected: {
    borderColor: "#42E695",
    backgroundColor: "rgba(66, 230, 149, 0.08)",
  },

  planCardDisabled: {
    opacity: 0.7,
  },

  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 12,
  },

  badgePopular: {
    // backgroundColor will be set dynamically with theme
  },

  badgeComingSoon: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  badgeText: {
    fontSize: 11,
    fontFamily: "Inter-SemiBold",
    color: "#fff",
  },

  planName: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#fff",
    marginBottom: 8,
  },

  priceSection: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },

  price: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
    color: "#42E695",
  },

  period: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#cfcfcf",
    marginLeft: 8,
  },

  comingSoonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#cfcfcf",
  },

  description: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#cfcfcf",
    marginBottom: 16,
  },

  featuresList: {
    gap: 10,
  },

  feature: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#fff",
  },

  selectedIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(66, 230, 149, 0.1)",
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#42E695",
  },
});
