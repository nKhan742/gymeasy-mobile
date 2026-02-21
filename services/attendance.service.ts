import api from "@/services/api";

// Helper function to format local date as yyyy-mm-dd (without timezone conversion)
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Fetch attendance for a member with full details
export const getMemberAttendance = async (memberId: string) => {
  const res = await api.get(`/attendance/member/${memberId}`);
  return res.data.data;
};

// Fetch today's attendance for a member (utility)
export const getTodayAttendance = async (memberId: string) => {
  try {
    const records = await getMemberAttendance(memberId);
    console.log(`📋 Fetching attendance for member ${memberId}, records count:`, records?.length || 0);
    
    if (!records || records.length === 0) {
      console.log(`❌ No attendance records found for ${memberId}`);
      return false;
    }
    
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    
    console.log(`🗓️ Today's date: ${todayYear}-${String(todayMonth).padStart(2, '0')}-${String(todayDay).padStart(2, '0')}`);
    
    // Look for ANY record that matches today's date
    for (const rec of records) {
      if (!rec.date) continue;
      
      // Parse the date carefully
      let recDate: Date;
      
      if (rec.date instanceof Date) {
        recDate = rec.date;
      } else if (typeof rec.date === 'string') {
        recDate = new Date(rec.date);
      } else {
        continue;
      }
      
      const recYear = recDate.getFullYear();
      const recMonth = recDate.getMonth() + 1;
      const recDay = recDate.getDate();
      
      const recDateStr = `${recYear}-${String(recMonth).padStart(2, '0')}-${String(recDay).padStart(2, '0')}`;
      const todayStr = `${todayYear}-${String(todayMonth).padStart(2, '0')}-${String(todayDay).padStart(2, '0')}`;
      
      console.log(`  📍 Record date: ${recDateStr}, Present: ${rec.present}`);
      
      if (recDateStr === todayStr) {
        console.log(`✅ Found TODAY's attendance - Present: ${rec.present}`);
        return rec.present === true; // Return the actual present status
      }
    }
    
    console.log(`⚠️ Today's date not found in records`);
    return false;
  } catch (error) {
    console.error("❌ Error fetching today's attendance:", error);
    return false;
  }
};
