import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth.types';
import api from './api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const REFRESH_TOKEN_KEY = 'refresh_token';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      console.log("📡 AuthService.login() raw response.data:", JSON.stringify(response.data, null, 2));
      
      const { token, user, refreshToken } = response.data;

      console.log("📡 AuthService.login() after destructuring:", {
        token: token ? "✅" : "❌",
        userId: user?._id,
        userName: user?.name,
        userEmail: user?.email,
        userGym: user?.gym,
        refreshToken: refreshToken ? "✅" : "❌",
        userKeys: user ? Object.keys(user) : "null",
      });

      await this.setToken(token);
      await this.setUser(user);
      if (refreshToken) {
        await this.setRefreshToken(refreshToken);
      }

      console.log("✅ AuthService.login() saved to AsyncStorage");
      return response.data;
    } catch (error) {
      console.error("❌ AuthService.login() error:", error);
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      const { token, user, refreshToken } = response.data;

      console.log("📡 AuthService.register() received response:", {
        token: token ? "✅" : "❌",
        userId: user?._id,
        userName: user?.name,
      });

      await this.setToken(token);
      await this.setUser(user);
      if (refreshToken) {
        await this.setRefreshToken(refreshToken);
      }

      return response.data;
    } catch (error) {
      console.error("❌ AuthService.register() error:", error);
      throw error;
    }
  }

  async googleLogin(idToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/google', { idToken });
      const { token, user, refreshToken } = response.data;

      await this.setToken(token);
      await this.setUser(user);
      if (refreshToken) {
        await this.setRefreshToken(refreshToken);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to notify backend
      await api.post('/auth/logout');
    } catch (error) {
      // Logout from backend failed, but still clear local data
      console.log('Logout API call failed, clearing local data anyway:', error);
    } finally {
      // Always clear local storage regardless of API call success
      await this.clearAuthData();
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<{ token: string }>('/auth/refresh', {
        refreshToken,
      });

      const newToken = response.data.token;
      await this.setToken(newToken);
      return newToken;
    } catch (error) {
      // If refresh fails, clear auth data
      await this.clearAuthData();
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem(USER_KEY);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user:', error);
      throw error;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  async setRefreshToken(refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Error setting refresh token:', error);
      throw error;
    }
  }

  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      const user = await this.getUser();
      return !!(token && user);
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();
