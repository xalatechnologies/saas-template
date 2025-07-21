import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

export const useAuth = () => {
  const router = useRouter();
  const { user, isLoading, error, login, logout, setUser, clearError } = useAuthStore();

  const requireAuth = (): void => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  };

  const redirectIfAuthenticated = (): void => {
    if (!isLoading && user) {
      router.push('/');
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    setUser,
    clearError,
    requireAuth,
    redirectIfAuthenticated,
    isAuthenticated: !!user,
  };
};
