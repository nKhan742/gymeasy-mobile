import api from "@/services/api";

export const getMembers = async () => {
  const res = await api.get("/members");
  return res.data.data;
};

export const addMember = async (memberData: {
  name: string;
  phone: string;
  address?: string;
  plan?: string;
  amount?: string;
  feesPaid: boolean;
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
