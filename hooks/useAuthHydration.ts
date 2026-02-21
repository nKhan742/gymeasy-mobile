import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useAuthStore } from '../store/auth.store';

/**
 * Hook that ensures gym data is loaded after auth rehydration
 * Should be called once in the app root (e.g., AuthGuard)
 */
export const useAuthHydration = () => {
  const { isAuthenticated, isHydrated, user, refreshAuth } = useAuth();
  const setLoading = useAuthStore((s) => s.setLoading);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    console.log("🔄 useAuthHydration effect running", {
      isHydrated,
      isAuthenticated,
      userId: user?._id,
      gymType: user?.gym ? typeof user.gym : 'undefined',
      hasHydrated: hasHydratedRef.current,
    });

    // Only run once after first rehydration when authenticated
    if (!isHydrated || !isAuthenticated || !user || hasHydratedRef.current) {
      console.log("⏭️ Skipping hydration");
      return;
    }

    hasHydratedRef.current = true;

    // Check if we need to fetch gym data (gym is a string ID, not full object)
    const needsGymFetch = user.gym && typeof user.gym === 'string';

    if (needsGymFetch) {
      console.log('🔄 Hydrating gym data after rehydration, setting loading...');
      setLoading(true);
      
      // Call refreshAuth and wait for it to complete
      refreshAuth().finally(() => {
        console.log('✅ Gym hydration complete, clearing loading state');
        setLoading(false);
      });
    } else {
      console.log("⏭️ No gym fetch needed", { gym: user.gym, type: typeof user.gym });
    }
  }, [isHydrated, isAuthenticated, user?._id, refreshAuth, setLoading]);
};
