import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AuthService from "../services/auth.service";
import { getMyGym } from "@/services/gym.service";
import { AuthState } from "../types/auth.types";

/* =========================================================
   STORE INTERFACE
========================================================= */
interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
    gymName?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  isHydrated: boolean;
  updateUser: (data: Partial<AuthState["user"]>) => void;
}

/* =========================================================
   STORE
========================================================= */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      isHydrated: false,

      /* ================= LOGIN ================= */
      login: async (email, password) => {
        try {
          set({ isLoading: true });
          console.log("🔑 LOGIN: Starting login...");

          const response = await AuthService.login({ email, password });
          
          console.log("✅ LOGIN response received:", {
            _id: response.user._id,
            name: response.user.name,
            email: response.user.email,
            gym: response.user.gym,
            gymType: typeof response.user.gym,
          });

          console.log("📝 LOGIN: Setting user to store...");
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          });

          const stateAfter = get();
          console.log("✅ LOGIN: User set in store:", {
            _id: stateAfter.user?._id,
            name: stateAfter.user?.name,
            gym: stateAfter.user?.gym,
          });

          console.log("🔄 LOGIN: Calling refreshAuth to hydrate gym");
          // 🔥 hydrate gym AFTER login
          await get().refreshAuth();

          const stateAfterRefresh = get();
          console.log("✅ LOGIN: After refreshAuth:", {
            _id: stateAfterRefresh.user?._id,
            gym: stateAfterRefresh.user?.gym,
            gymType: typeof stateAfterRefresh.user?.gym,
          });

          set({ isLoading: false });
        } catch (error) {
          console.error("❌ LOGIN ERROR:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      /* ================= GOOGLE LOGIN ================= */
      googleLogin: async (idToken) => {
        try {
          set({ isLoading: true });

          const response = await AuthService.googleLogin(idToken);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          });

          // 🔥 hydrate gym AFTER login
          await get().refreshAuth();

          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      /* ================= REGISTER ================= */
      register: async (email, password, name, phone, gymName) => {
        try {
          set({ isLoading: true });

          const response = await AuthService.register({
            email,
            password,
            name,
            phone,
            gymName,
          });

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          });

          // 🔥 hydrate gym AFTER register
          await get().refreshAuth();

          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      /* ================= REFRESH AUTH ================= */
      refreshAuth: async () => {
        const { user } = get();

        console.log("🔄 refreshAuth called", { userId: user?._id, gym: user?.gym });

        // ⛔ nothing to do if no user
        if (!user) {
          console.log("⏭️ No user, skipping gym fetch");
          set({ isHydrated: true });
          return;
        }

        // ✅ Check if gym is already a full object with _id
        if (user.gym && typeof user.gym === 'object' && '_id' in user.gym) {
          console.log("⏭️ Gym already loaded as full object", user.gym);
          set({ isHydrated: true });
          return;
        }

        // ⛔ user has no gym reference at all, skip fetch
        if (!user.gym) {
          console.log("⏭️ User has no gym reference (null/undefined)");
          set({ isHydrated: true });
          return;
        }

        try {
          console.log("📡 Fetching gym from backend...", { gymId: user.gym });

          const gymRes = await getMyGym();
          console.log("✅ getMyGym response:", gymRes);

          if (gymRes?.gym) {
            console.log("✅ Setting full gym data:", gymRes.gym);
            set((state) => ({
              user: state.user
                ? { ...state.user, gym: gymRes.gym }
                : state.user,
            }));
          } else {
            console.log("⚠️ No gym in response");
          }
        } catch (e) {
          console.log("❌ refreshAuth gym fetch failed", e);
        } finally {
          const finalUser = get().user;
          console.log("✅ refreshAuth complete", {
            userId: finalUser?._id,
            gym: finalUser?.gym,
            gymType: typeof finalUser?.gym,
          });
          set({ isHydrated: true });
        }
      },

      /* ================= LOGOUT ================= */
      logout: async () => {
        try {
          set({ isLoading: true });
          await AuthService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      /* ================= UPDATE USER ================= */
      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : state.user,
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => {
        const partialState = {
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        };
        console.log("💾 PERSIST: Saving to AsyncStorage:", {
          hasUser: !!partialState.user,
          userId: partialState.user?._id,
          hasToken: !!partialState.token,
          isAuthenticated: partialState.isAuthenticated,
        });
        return partialState;
      },

      onRehydrateStorage: () => (state) => {
        console.log("🔄 REHYDRATE: Loading from AsyncStorage", {
          isAuthenticated: state?.isAuthenticated,
          userId: state?.user?._id,
          hasGym: !!state?.user?.gym,
        });
        if (state) {
          state.isHydrated = true;
          state.isLoading = false;
          console.log("✅ REHYDRATE: Complete", {
            userId: state.user?._id,
            isAuthenticated: state.isAuthenticated,
          });
        }
      },
    }
  )
);
