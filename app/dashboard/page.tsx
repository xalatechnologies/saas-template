'use client';

import React from 'react';
import { DashboardContent, AuthGuard } from '@/components';

/**
 * Dashboard page server component - authenticated area
 * @returns React element with dashboard content
 */
export default function DashboardPage(): React.ReactElement {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}