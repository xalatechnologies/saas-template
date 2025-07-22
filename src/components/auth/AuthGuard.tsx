'use client';

import React, { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Auth guard component that protects routes requiring authentication
 * Redirects unauthenticated users to login page
 */
export const AuthGuard = ({ children, fallback }: AuthGuardProps): JSX.Element => {
  const router = useRouter();
  const { user, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from stored data
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Redirect to login if not authenticated (after loading is complete)
    if (!isLoading && !user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}` as any);
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show loading state while redirecting
  if (!user) {
    return fallback || (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default AuthGuard;