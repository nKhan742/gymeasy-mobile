import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

// const API_BASE_URL = "http://10.0.2.2:5000/api";
const API_BASE_URL = "https://gymeasy-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token");

    console.log("=================================");
    console.log("➡️ API REQUEST");
    console.log("➡️ URL:", `${config.baseURL ?? ""}${config.url ?? ""}`);
    console.log("➡️ METHOD:", config.method);
    console.log("➡️ DATA:", config.data);
    console.log("🔐 AUTH TOKEN:", token);
    console.log("=================================");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const newToken = refreshResponse.data.token;
          await AsyncStorage.setItem('auth_token', newToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear auth data if refresh fails
        await AsyncStorage.multiRemove(['auth_token', 'auth_user', 'refresh_token']);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
