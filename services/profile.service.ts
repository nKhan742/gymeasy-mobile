import api from "@/services/api";

export const updateProfileField = async (
  field: string,
  value: string
) => {
  const payload = {
    [field]: value, // 🔥 IMPORTANT
  };

  console.log("🟢 UPDATE PROFILE PAYLOAD →", payload);

  return api.put("/api/auth/update-profile", payload);
};
