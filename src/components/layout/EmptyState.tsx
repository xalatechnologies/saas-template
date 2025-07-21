'use client';

import React from 'react';
import { Card, CardContent, AppText, Heading } from '../ui';
import { cn } from '@/utils';

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
 * @returns JSX.Element
 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps): JSX.Element => {
  return (
    <Card className={className}>
      <CardContent className="text-center py-12">
        <div className="space-y-4">
          {icon && (
            <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              {icon}
            </div>
          )}
          <div className="space-y-2">
            <Heading level={3} className="text-foreground">
              {title}
            </Heading>
            {description && (
              <AppText variant="muted" className="text-muted-foreground">
                {description}
              </AppText>
            )}
          </div>
          {action && <div className="pt-2">{action}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
