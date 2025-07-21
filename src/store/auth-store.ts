import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AuthState, AuthUser, LoginCredentials } from '@/types';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  immer((set, get) => ({
    user: null,
    isLoading: false,
    error: null,

    login: async (credentials: LoginCredentials): Promise<void> => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock successful login
        const mockUser: AuthUser = {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1`,
        };

        set((state) => {
          state.user = mockUser;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Login failed';
          state.isLoading = false;
        });
      }
    },

    logout: (): void => {
      set((state) => {
        state.user = null;
        state.error = null;
      });
    },

    setUser: (user: AuthUser | null): void => {
      set((state) => {
        state.user = user;
      });
    },

    setLoading: (loading: boolean): void => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setError: (error: string | null): void => {
      set((state) => {
        state.error = error;
      });
    },

    clearError: (): void => {
      set((state) => {
        state.error = null;
      });
    },
  })),
);
