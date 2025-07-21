'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui';
import { cn } from '@/utils';

/**
 * Page section component interface for consistent content sections
 */
export interface PageSectionProps {
  readonly children: React.ReactNode;
  readonly title?: string;
  readonly actions?: React.ReactNode;
  readonly variant?: 'default' | 'card' | 'transparent';
  readonly className?: string;
}

/**
 * Page section component for organizing content within pages
 * Provides consistent spacing and structure without raw HTML elements
 * @param props - Page section component properties
 * @returns JSX.Element
 */
export const PageSection = ({ 
  children, 
  title, 
  actions, 
  variant = 'default',
  className = '' 
}: PageSectionProps): JSX.Element => {
  if (variant === 'card') {
    return (
      <Card className={className}>
        {(title || actions) && (
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            {title && <CardTitle className="text-foreground">{title}</CardTitle>}
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </CardHeader>
        )}
        <CardContent className={title || actions ? 'pt-0' : ''}>
          {children}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'transparent') {
    return (
      <div className={cn('space-y-4', className)}>
        {(title || actions) && (
          <div className="flex items-center justify-between">
            {title && (
              <div className="text-lg font-semibold text-foreground">{title}</div>
            )}
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>
        )}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('space-y-6', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-border pb-4">
          {title && (
            <div className="text-xl font-semibold text-foreground">{title}</div>
          )}
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};