import api from "@/services/api";

export const getMembers = async () => {
  const res = await api.get("/members");
  return res.data.data;
};
