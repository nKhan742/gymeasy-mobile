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
    await login(email, password);
  };

  const googleLoginUser = async (idToken: string) => {
    await googleLogin(idToken);
  };

  const registerUser = async (email: string, password: string, name: string, gymName?: string) => {
    await register(email, password, name, gymName);
  };

  const logoutUser = async () => {
    await logout();
  };

  const refreshUserAuth = async () => {
    await refreshAuth();
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
