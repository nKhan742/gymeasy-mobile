import api from "@/services/api";

/* ================= MEMBERS ================= */

export const getMembers = async () => {
  const res = await api.get("/members");
  return res.data.data || [];
};

export const getMemberById = async (id: string) => {
  try {
    console.log("📡 [API] Fetching member with ID:", id);

    const res = await api.get(`/members/${id}`);

    console.log("✅ [API] Member fetch success:", res.data);

    return res.data.data;
  } catch (error: any) {
    console.log("❌ [API] GET MEMBER BY ID FAILED");

    if (error.response) {
      // Server responded with error status
      console.log("🔴 Status:", error.response.status);
      console.log("🔴 Data:", error.response.data);
      console.log("🔴 Headers:", error.response.headers);
    } else if (error.request) {
      // Request made but no response
      console.log("🟠 No response received:", error.request);
    } else {
      // Something else happened
      console.log("⚫ Error message:", error.message);
    }

    throw error;
  }
};


export const addMember = async (memberData: {
  name: string;
  phone: string;
  address?: string;
  plan: string;
  amount: number;
  feesPaid: boolean;
  joiningDate: string;
}) => {
  const res = await api.post("/members", memberData);
  return res.data.data;
};

export const updateMember = async (id: string, memberData: any) => {
  const res = await api.put(`/members/${id}`, memberData);
  return res.data.data;
};

export const deactivateMember = async (id: string) => {
  const res = await api.patch(`/members/${id}/deactivate`);
  return res.data;
};
