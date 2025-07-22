'use client';

import React from 'react';
import { FlexLayout } from './GridLayout';
import { SkipLinks } from '@/components';
import { cn } from '@/utils';

export type LayoutVariant = 'web' | 'dashboard' | 'auth' | 'minimal';

interface BaseLayoutProps {
  readonly children: React.ReactNode;
  readonly variant?: LayoutVariant;
  readonly className?: string;
  readonly header?: React.ReactNode;
  readonly footer?: React.ReactNode;
  readonly sidebar?: React.ReactNode;
  readonly rightDrawer?: React.ReactNode;
  readonly skipLinks?: boolean;
}

/**
 * Base layout component that provides common structure for all layouts
 * Follows SOLID principles with composition-based architecture
 * @returns JSX.Element
 */
export const BaseLayout = ({
  children,
  variant = 'web',
  className,
  header,
  footer,
  sidebar,
  rightDrawer,
  skipLinks = true,
}: BaseLayoutProps): JSX.Element => {
  const layoutClasses = {
    web: 'min-h-screen bg-background',
    dashboard: 'min-h-screen bg-background',
    auth: 'min-h-screen bg-background',
    minimal: 'min-h-screen bg-background',
  };

  // Dashboard layout with sidebar
  if (variant === 'dashboard' && sidebar) {
    return (
      <FlexLayout direction="row" className={cn(layoutClasses[variant], className)}>
        {skipLinks && <SkipLinks />}
        {sidebar}
        <FlexLayout direction="column" className="flex-1 min-h-screen lg:ml-80">
          {header}
          {children}
          {footer}
        </FlexLayout>
        {rightDrawer}
      </FlexLayout>
    );
  }

  // Standard vertical layout
  return (
    <FlexLayout direction="column" className={cn(layoutClasses[variant], className)}>
      {skipLinks && <SkipLinks />}
      {header}
      {children}
      {footer}
      {rightDrawer}
    </FlexLayout>
  );
};