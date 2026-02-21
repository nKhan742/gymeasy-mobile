import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMembers } from "@/services/member.service";

const DISMISSED_KEY = "dismissed_notifications";

export function useNotifications() {
  const [count, setCount] = useState(0);

  const calculate = useCallback(async () => {
    try {
      const dismissedRaw = await AsyncStorage.getItem(DISMISSED_KEY);
      const dismissed: string[] = dismissedRaw ? JSON.parse(dismissedRaw) : [];

      const members = await getMembers();
      const today = new Date();
      let total = 0;

      (members || []).forEach((m: any) => {
        if (!m._id) return;

        // 🆕 New member (24h)
        if (m.createdAt) {
          const hrs =
            (today.getTime() - new Date(m.createdAt).getTime()) /
            (1000 * 60 * 60);

          const id = `new-${m._id}`;
          if (hrs <= 24 && !dismissed.includes(id)) {
            total++;
          }
        }

        // ⏳ Expiry
        if (m.expiry) {
          const diffDays = Math.ceil(
            (new Date(m.expiry).getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          if (diffDays <= 7) {
            const id =
              diffDays <= 0
                ? `expired-${m._id}`
                : `expiry-${m._id}`;

            if (!dismissed.includes(id)) {
              total++;
            }
          }
        }
      });

      setCount(total);
    } catch (e) {
      console.log("NOTIFICATION COUNT ERROR:", e);
      setCount(0);
    }
  }, []);

  useEffect(() => {
    calculate();
  }, [calculate]);

  return { notificationCount: count, refreshNotifications: calculate };
}
