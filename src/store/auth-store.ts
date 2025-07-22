import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AuthState, AuthUser, LoginCredentials } from '@/types';
import { setAuthToken, removeAuthToken, getStoredUser, mockApi } from '@/utils';

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  immer((set, get) => ({
    user: null,
    isLoading: true, // Start as true since we need to check auth on load
    error: null,

    initializeAuth: (): void => {
      // Initialize auth state from stored data on app load
      console.log('🔍 AuthStore: Starting initializeAuth...');
      const storedUser = getStoredUser();
      console.log('🔍 AuthStore: Stored user found:', !!storedUser);
      set((state) => {
        if (storedUser) {
          state.user = storedUser;
          console.log('🔍 AuthStore: User set from storage');
        }
        state.isLoading = false;
        console.log('🔍 AuthStore: Loading set to false');
      });
    },

    login: async (credentials: LoginCredentials): Promise<void> => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { user, token } = await mockApi.login(credentials.email, credentials.password);
        
        // Set auth token in cookies and localStorage
        setAuthToken(token, user);

        set((state) => {
          state.user = user;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Login failed';
          state.isLoading = false;
        });
      }
    },

    signup: async (credentials: SignupCredentials): Promise<void> => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { user, token } = await mockApi.signup(credentials.name, credentials.email, credentials.password);
        
        // Set auth token in cookies and localStorage
        setAuthToken(token, user);

        set((state) => {
          state.user = user;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Signup failed';
          state.isLoading = false;
        });
      }
    },

    logout: (): void => {
      // Remove auth token from cookies and localStorage
      removeAuthToken();
      
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
