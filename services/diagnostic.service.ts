import api from "@/services/api";

/**
 * ================================
 * DIAGNOSTIC: Get MemberFee Status
 * ================================
 */
export const getDiagnosticMemberFees = async () => {
  try {
    console.log("🔍 [DIAGNOSTIC] Calling /revenue/diagnostic endpoint...");
    const res = await api.get("/revenue/diagnostic");
    console.log("🔍 [DIAGNOSTIC] Response:", JSON.stringify(res.data, null, 2));
    return res.data.data;
  } catch (error: any) {
    console.error("❌ [DIAGNOSTIC] Failed:", error.response?.data || error.message);
    throw error;
  }
};
