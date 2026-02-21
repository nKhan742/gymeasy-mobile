import api from "@/services/api";

// Helper function to format local date as yyyy-mm-dd (without timezone conversion)
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Change attendance status for a member on a specific date
export const updateMemberAttendance = async (memberId: string, date: Date, present: boolean) => {
  // Format date as yyyy-mm-dd in local timezone
  const formattedDate = formatLocalDate(date);
  const res = await api.post("/attendance/mark", {
    memberId,
    date: formattedDate,
    present
  });
  return res.data.data;
};

// Mark attendance with note (for future use)
export const markAttendanceWithNote = async (memberId: string, date: Date, present: boolean, note?: string) => {
  const formattedDate = formatLocalDate(date);
  const res = await api.post("/attendance/mark", {
    memberId,
    date: formattedDate,
    present,
    note
  });
  return res.data.data;
};
