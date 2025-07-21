'use client';

import React from 'react';
import { Layout } from './Layout';
import { Heading, AppText } from '../ui';
import { cn } from '@/utils';
/**
 * Base page component interface for consistent page structure
 */
export interface BasePageProps {
  readonly children: React.ReactNode;
  readonly title?: string;
  readonly subtitle?: string;
  readonly actions?: React.ReactNode;
  readonly className?: string;
}

/**
 * Base page component that provides consistent layout and structure for all pages
 * Ensures no raw HTML elements are used in pages and maintains design system compliance
 * @param props - Base page component properties
 * @returns JSX.Element
 */
export const BasePage = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
}: BasePageProps): JSX.Element => {
  return (
    <Layout>
      <div className={`space-y-12 ${className}`}>
        {/* Page Header */}
        {(title || subtitle || actions) && (
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-3">
              {title && (
                <Heading level={1} className="text-foreground">
                  {title}
                </Heading>
              )}
              {subtitle && (
                <AppText variant="large" className="text-muted-foreground max-w-3xl">
                  {subtitle}
                </AppText>
              )}
            </div>
            {actions && <div className="flex items-center space-x-4">{actions}</div>}
          </div>
        )}

        {/* Page Content */}
        <div className="space-y-8">{children}</div>
      </div>
    </Layout>
  );
};
