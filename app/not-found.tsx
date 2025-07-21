'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BasePage, 
  PageSection, 
  Button, 
  Heading,
  AppText,
  EmptyState 
} from '@/components';
import { AlertTriangle } from 'lucide-react';
import { useUI } from '@/hooks';

/**
 * Custom 404 Not Found page component
 * @returns React element with not found message and navigation options
 */
export default function NotFound(): React.ReactElement {
  const { t } = useUI();
  
  return (
    <BasePage
      title={t('errors.notFound.title')}
      subtitle={t('errors.notFound.subtitle')}
    >
      <PageSection variant="transparent">
        <EmptyState
          icon={<AlertTriangle className="text-warning" />}
          title={t('errors.notFound.heading')}
          description={t('errors.notFound.message')}
          action={
            <>
              <Button asChild variant="default">
                <Link href="/">
                  {t('common.navigation.home')}
                </Link>
              </Button>
              <Button asChild variant="outline" className="ml-4">
                <Link href="/tasks">
                  {t('common.navigation.tasks')}
                </Link>
              </Button>
            </>
          }
        />
      </PageSection>
    </BasePage>
  );
}
