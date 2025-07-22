import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store';

export const useAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, error, login, signup, logout, setUser, clearError, initializeAuth } = useAuthStore();

  const requireAuth = (): void => {
    if (!isLoading && !user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  };

  const redirectIfAuthenticated = (): void => {
    if (!isLoading && user) {
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl);
    }
  };

  const handleLoginSuccess = (): void => {
    const redirectUrl = searchParams.get('redirect') || '/dashboard';
    router.push(redirectUrl);
  };

  const handleLogout = (): void => {
    logout();
    router.push('/login');
  };

  return {
    user,
    isLoading,
    error,
    login,
    signup,
    logout: handleLogout,
    setUser,
    clearError,
    initializeAuth,
    requireAuth,
    redirectIfAuthenticated,
    handleLoginSuccess,
    isAuthenticated: !!user,
  };
};
