'use client';

import React from 'react';
import { Card, CardContent, AppText, Heading, PageSection } from '@/components';

/**
 * Empty state component interface for consistent empty states
 */
export interface EmptyStateProps {
  readonly icon?: React.ReactNode;
  readonly title: string;
  readonly description?: string;
  readonly action?: React.ReactNode;
  readonly className?: string;
}

/**
 * Empty state component for consistent empty state presentation
 * Eliminates need for raw HTML elements in empty state scenarios
 * @param props - Empty state component properties
 * @returns React.ReactElement
 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps): React.ReactElement => {
  return (
    <Card className={className}>
      <CardContent className="text-center py-12">
        <PageSection variant="transparent">
          {icon && (
            <PageSection variant="transparent" className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              {icon}
            </PageSection>
          )}
          <PageSection variant="transparent">
            <Heading level={3}>
              {title}
            </Heading>
            {description && (
              <AppText variant="muted">
                {description}
              </AppText>
            )}
          </PageSection>
          {action && <PageSection variant="transparent">{action}</PageSection>}
        </PageSection>
      </CardContent>
    </Card>
  );
};
