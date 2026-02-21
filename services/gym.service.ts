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

export const getMyGym = async () => {
  const res = await api.get("/gym/me");
  return res.data; 
  // expected: { hasGym: boolean, gym: {...} | null }
};
