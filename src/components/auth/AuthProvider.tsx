'use client';

import React, { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth provider component that initializes authentication state
 * Should wrap the entire app to ensure auth state is available
 */
export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on app startup
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};

export default AuthProvider;