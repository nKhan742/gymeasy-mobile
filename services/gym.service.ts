// services/gym.service.ts
import api from "@/services/api";

export const registerGym = async (payload: {
  gymName: string;
  address: string;
  phone: string;
}) => {
  const res = await api.post("/gym/register", payload);
  return res.data.gym;
};
