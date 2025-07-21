'use client';

import React, { useEffect } from 'react';
import { BasePage, Button, PageSection, EmptyState } from '@/components';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { useUI } from '@/hooks';

interface ErrorContentProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

/**
 * Error content component for displaying error information and reset option
 * @param props - Error information and reset function
 * @returns React element with error message and reset option
 */
export const ErrorContent = ({ error, reset }: ErrorContentProps): React.ReactElement => {
  const { t } = useUI();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <BasePage title={t('errors.unexpected.title')} subtitle={t('errors.unexpected.subtitle')}>
      <PageSection variant="transparent">
        <EmptyState
          icon={<AlertOctagon aria-hidden="true" />}
          title={t('errors.unexpected.heading')}
          description={t('errors.unexpected.message')}
          action={
            <Button onClick={reset} variant="default">
              <RefreshCw aria-hidden="true" />
              <span>{t('errors.tryAgain')}</span>
            </Button>
          }
        />
      </PageSection>
    </BasePage>
  );
};
