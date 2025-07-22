'use client';

import React from 'react';
import { Heading, AppText } from '../ui';
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
 * Base page component that provides consistent page structure without layout wrapping
 * Ensures no raw HTML elements are used in pages and maintains design system compliance
 * Layout wrapping is handled by LayoutProvider - this component only provides page content structure
 * @param props - Base page component properties
 * @returns React.ReactElement
 */
export const BasePage = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
}: BasePageProps): React.ReactElement => {
  return (
    <div className={`space-y-[var(--spacing-3xl)] ${className}`}>
      {/* Page Header */}
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-[var(--spacing-2xl)]">
          <div className="space-y-[var(--spacing-md)]">
            {title && (
              <Heading 
                level={1} 
                variant="default"
              >
                {title}
              </Heading>
            )}
            {subtitle && (
              <AppText variant="large" className="text-muted-foreground max-w-3xl">
                {subtitle}
              </AppText>
            )}
          </div>
          {actions && <div className="flex items-center space-x-[var(--spacing-md)]">{actions}</div>}
        </div>
      )}

      {/* Page Content */}
      <div className="space-y-[var(--spacing-2xl)]">{children}</div>
    </div>
  );
};
