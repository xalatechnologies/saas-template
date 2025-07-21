'use client';

import React, { useEffect } from 'react';
import { 
  BasePage, 
  Button, 
  PageSection,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  AppText,
  Heading
} from '@/components';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { useUI } from '@/hooks';

interface ErrorBoundaryProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

/**
 * Global error boundary component for handling runtime errors
 * @param props - Error information and reset function
 * @returns React element with error message and reset option
 */
export default function ErrorBoundary({ 
  error, 
  reset 
}: ErrorBoundaryProps): React.ReactElement {
  const { t } = useUI();
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <BasePage
      title={t('errors.unexpected.title')}
      subtitle={t('errors.unexpected.subtitle')}
    >
      <PageSection variant="transparent">
        <EmptyState
          icon={<AlertOctagon className="text-destructive" />}
          title={t('errors.unexpected.heading')}
          description={t('errors.unexpected.message')}
          action={
            <>
              {process.env.NODE_ENV === 'development' && (
                <Card className="mb-6 w-full max-w-md border-destructive/20">
                  <CardHeader>
                    <CardTitle>{t('errors.unexpected.details')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <AppText className="font-medium">
                      {error.message}
                    </AppText>
                    {error.digest && (
                      <AppText variant="small" className="text-muted-foreground">
                        {t('errors.unexpected.errorId')}: {error.digest}
                      </AppText>
                    )}
                  </CardContent>
                </Card>
              )}
              
              <Button 
                onClick={reset}
                variant="default" 
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t('errors.unexpected.tryAgain')}
              </Button>
            </>
          }
        />
      </PageSection>
    </BasePage>
  );
}
