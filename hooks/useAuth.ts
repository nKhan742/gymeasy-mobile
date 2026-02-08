import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    isHydrated,
    login,
    googleLogin,
    register,
    logout,
    refreshAuth,
    setLoading,
  } = useAuthStore();

  const loginUser = async (email: string, password: string) => {
    return await login(email, password);
  };

  const googleLoginUser = async (idToken: string) => {
    return await googleLogin(idToken);
  };

  const registerUser = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    gymName?: string
  ) => {
    return await register(email, password, name, phone, gymName);
  };

  const logoutUser = async () => {
    return await logout();
  };

  const refreshUserAuth = async () => {
    return await refreshAuth();
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isHydrated,
    login: loginUser,
    googleLogin: googleLoginUser,
    register: registerUser,
    logout: logoutUser,
    refreshAuth: refreshUserAuth,
    setLoading,
  };
};
