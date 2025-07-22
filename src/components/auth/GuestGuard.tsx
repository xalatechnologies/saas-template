'use client';

import React, { useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store';

interface GuestGuardProps {
  children: ReactNode;
}

/**
 * Guest guard component that protects auth routes (login/signup)
 * Redirects authenticated users to dashboard or redirect URL
 */
export const GuestGuard = ({ children }: GuestGuardProps): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from stored data
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Redirect authenticated users
    if (user) {
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl as any);
    }
  }, [user, router, searchParams]);

  // Don't render children if user is authenticated (while redirecting)
  if (user) {
    return <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  // User is not authenticated, render auth form
  return <>{children}</>;
};

export default GuestGuard;