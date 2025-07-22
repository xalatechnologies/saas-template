'use client';

// 1. React and Next.js
import React, { useEffect, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// 2. Internal packages (relative path format since they're within the project)
import { useAuthStore } from '../../store/auth-store';

// 3. Layout system components
import { FlexLayout } from '../layout';

interface AuthGuardProps {
  readonly children: ReactNode;
  readonly fallback?: React.ReactElement;
}

/**
 * AuthGuard - Protects routes from unauthenticated access
 * Ensures user authentication before displaying protected content
 * @param props - Component properties
 * @returns React.ReactElement - Protected content or loading/redirect state
 */
export const AuthGuard = ({ children, fallback }: AuthGuardProps): React.ReactElement => {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isLoading, initializeAuth } = useAuthStore();
  const [isClient, setIsClient] = useState<boolean>(false);
  
  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
    setIsClient(true);
  }, [initializeAuth]);
  
  // Redirect if not authenticated after loading
  useEffect(() => {
    if (isClient && !isLoading && !user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, isLoading, isClient, router]);

  // Show fallback or loading state while checking auth
  if (isLoading || !user) {
    return fallback || (
      <FlexLayout 
        direction="column" 
        align="center" 
        justify="center" 
        className="min-h-screen p-8"
      >
        <div className="text-primary text-xl">{t('auth.checkingAuth')}</div>
      </FlexLayout>
    );
  }
  
  // User is authenticated, show protected content
  return <>{children}</>;
};

export default AuthGuard;