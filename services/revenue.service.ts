import api from "@/services/api";

/**
 * ================================
 * GET TOTAL REVENUE (ALL TIME)
 * ================================
 */
export const getTotalRevenue = async () => {
  try {
    console.log("📡 [API] Fetching total revenue...");
    const res = await api.get("/revenue/total");
    console.log("✅ [API] Total revenue fetched:", res.data);
    return res.data.data;
  } catch (error: any) {
    console.error("❌ [API] GET TOTAL REVENUE FAILED:", error);
    throw error;
  }
};

/**
 * ================================
 * GET MONTHLY REVENUE BREAKDOWN
 * ================================
 */
export const getMonthlyRevenue = async () => {
  try {
    console.log("📡 [API] Fetching monthly revenue...");
    const res = await api.get("/revenue/monthly");
    console.log("✅ [API] Monthly revenue fetched:", res.data);
    return res.data.data;
  } catch (error: any) {
    console.error("❌ [API] GET MONTHLY REVENUE FAILED:", error);
    throw error;
  }
};

/**
 * ================================
 * GET CURRENT MONTH REVENUE
 * ================================
 */
export const getCurrentMonthRevenue = async () => {
  try {
    console.log("📡 [API] Fetching current month revenue...");
    const res = await api.get("/revenue/current-month");
    console.log("✅ [API] Current month revenue fetched:", res.data);
    return res.data.data;
  } catch (error: any) {
    console.error("❌ [API] GET CURRENT MONTH REVENUE FAILED:", error);
    throw error;
  }
};

/**
 * ================================
 * GET REVENUE SUMMARY
 * ================================
 */
export const getRevenueSummary = async () => {
  try {
    console.log("📡 [API] Fetching revenue summary...");
    const res = await api.get("/revenue/summary");
    console.log("✅ [API] Revenue summary fetched:", res.data);
    return res.data.data;
  } catch (error: any) {
    console.error("❌ [API] GET REVENUE SUMMARY FAILED:", error);
    throw error;
  }
};
