'use client';

import React from 'react';
import Link from 'next/link';
import { BasePage, PageSection, Button, EmptyState } from '@/components';
import { AlertTriangle } from 'lucide-react';
import { useUI } from '@/hooks';

/**
 * Not found content client component
 * Provides localized content for the not found page
 * @returns React element with not found message and navigation options
 */
export function NotFoundContent(): React.ReactElement {
  const { t } = useUI();

  return (
    <BasePage title={t('errors.notFound.title')} subtitle={t('errors.notFound.subtitle')}>
      <PageSection variant="transparent">
        <EmptyState
          icon={<AlertTriangle aria-hidden="true" />}
          title={t('errors.notFound.heading')}
          description={t('errors.notFound.message')}
          action={
            <>
              <Button asChild variant="default">
                <Link href="/">{t('common.navigation.home')}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/tasks">{t('common.navigation.tasks')}</Link>
              </Button>
            </>
          }
        />
      </PageSection>
    </BasePage>
  );
}
