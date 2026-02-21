import { Gym } from "./gym";


export interface User {
  _id: string;
  email: string;
  name: string;
  role?: string;
  phone?: string;

  gym?: string | Gym | null;      // gym ID from DB or full gym object after hydration
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  gymName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  refreshToken?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
