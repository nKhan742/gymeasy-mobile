import api from "@/services/api";

export const getMembers = async () => {
  try {
    console.log("🔵 Starting getMembers call...");
    const res = await api.get("/members");
    console.log("✅ API Response received:", res);
    console.log("📦 res.data type:", typeof res.data);
    console.log("📦 res.data is Array?:", Array.isArray(res.data));
    console.log("📦 res.data keys:", Object.keys(res.data || {}));
    
    // Handle both array response and wrapped response
    let data;
    if (Array.isArray(res.data)) {
      console.log("📌 Response is array directly");
      data = res.data;
    } else if (res.data && res.data.data) {
      console.log("📌 Response is wrapped, extracting res.data.data");
      data = res.data.data;
    } else {
      console.log("📌 Unknown response format, using res.data");
      data = res.data;
    }
    
    console.log("✅ Final data:", data);
    console.log("📊 Data length:", data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.log("❌ GET MEMBERS ERROR:", error);
    console.log("❌ Error response:", error.response);
    console.log("❌ Error message:", error.message);
    throw error;
  }
};

export const addMember = async (memberData: {
  gymId: string;
  name: string;
  phone: string;
  address?: string;
  plan: string;
  amount: number;
   feesPaid: boolean;
  joiningDate: string;
}) => {
  const res = await api.post("/members", memberData);
  return res.data.data || res.data;
};

export const updateMember = async (id: string, memberData: any) => {
  const res = await api.put(`/members/${id}`, memberData);
  return res.data.data || res.data;
};

export const deleteMember = async (id: string) => {
  const res = await api.delete(`/members/${id}`);
  return res.data;
}
