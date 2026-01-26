import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AuthService from '../services/auth.service';
import { AuthState } from '../types/auth.types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  register: (email: string, password: string, name: string, gymName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  isHydrated: boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true to prevent premature redirects
      isHydrated: false, // Add hydration tracking

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await AuthService.login({ email, password });
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      googleLogin: async (idToken: string) => {
        try {
          set({ isLoading: true });
          const response = await AuthService.googleLogin(idToken);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string, gymName?: string) => {
        try {
          set({ isLoading: true });
          const response = await AuthService.register({ email, password, name, gymName });
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
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

      refreshAuth: async () => {
        try {
          set({ isLoading: true });
          const newToken = await AuthService.refreshToken();
          if (newToken) {
            set({ token: newToken, isLoading: false });
          } else {
            // If refresh failed, logout
            await get().logout();
          }
        } catch (error) {
          await get().logout();
          throw error;
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
          state.isLoading = false;
        }
      },
    }
  )
);
