'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DashboardLayout, WebLayout } from '@/components';

interface LayoutProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Layout provider that selects the appropriate layout based on the current route
 * @returns JSX.Element
 */
export const LayoutProvider = ({ children }: LayoutProviderProps): JSX.Element => {
  const pathname = usePathname();

  // Define which routes should use specific layouts
  const dashboardRoutes = ['/dashboard', '/tasks', '/settings', '/profile'];
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
  
  // Auth routes render their own layout (AuthLayout)
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return <>{children}</>;
  }
  
  // Dashboard routes use DashboardLayout
  if (dashboardRoutes.some(route => pathname.startsWith(route))) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // All other routes use WebLayout
  return <WebLayout>{children}</WebLayout>;
};