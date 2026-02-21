import api from "@/services/api";

// Mark attendance for a member on a specific date
export const markMemberAttendance = async (memberId: string, date: Date) => {
  // Format date as yyyy-mm-dd
  const formattedDate = date.toISOString().slice(0, 10);
  const res = await api.post("/attendance/punch", {
    memberId,
    date: formattedDate,
    method: "manual"
  });
  return res.data.data;
};
