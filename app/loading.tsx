'use client';

import React from 'react';
import { LoadingState, PageSection } from '@/components';
import { useUI } from '@/hooks';

/**
 * Global loading component for Next.js App Router
 * Displayed during page transitions and data fetching
 * @returns React component with loading spinner
 */
export default function Loading(): React.ReactElement {
  const { t } = useUI();
  
  return (
    <PageSection variant="transparent" className="flex min-h-screen items-center justify-center">
      <LoadingState message={t('common.loading')} />
    </PageSection>
  );
}
