'use client';

import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '@/utils';

interface CardLayoutProps {
  readonly children: React.ReactNode;
  readonly variant?: 'default' | 'bordered' | 'elevated' | 'gradient';
  readonly padding?: 'none' | 'sm' | 'md' | 'lg';
  readonly className?: string;
}

interface CardHeaderProps {
  readonly children?: React.ReactNode;
  readonly title?: string;
  readonly subtitle?: string;
  readonly action?: React.ReactNode;
  readonly icon?: React.ComponentType<{ className?: string }>;
  readonly className?: string;
}

interface CardBodyProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

interface CardFooterProps {
  readonly children: React.ReactNode;
  readonly variant?: 'default' | 'actions' | 'centered';
  readonly className?: string;
}

interface CardGridProps {
  readonly children: React.ReactNode;
  readonly columns?: 1 | 2 | 3 | 4 | 5 | 6;
  readonly gap?: 'sm' | 'md' | 'lg';
  readonly className?: string;
}

/**
 * Card layout component for consistent card styling
 * @returns JSX.Element
 */
export const CardLayout = ({
  children,
  variant = 'default',
  padding = 'md',
  className,
}: CardLayoutProps): JSX.Element => {
  const variants = {
    default: 'bg-card border border-border',
    bordered: 'bg-card border-2 border-border',
    elevated: 'bg-card shadow-xl hover:shadow-2xl transition-shadow duration-300',
    gradient: 'bg-gradient-to-br from-card via-card to-accent/5 border border-border',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        variants[variant],
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Card header component
 * @returns JSX.Element
 */
export const CardLayoutHeader = ({
  children,
  title,
  subtitle,
  action,
  icon: Icon,
  className,
}: CardHeaderProps): JSX.Element => {
  // If children are provided, render them directly
  if (children) {
    return (
      <div className={cn('pb-4 border-b border-border mb-4', className)}>
        {children}
      </div>
    );
  }

  // Otherwise, render the structured header
  return (
    <div className={cn('flex items-start justify-between pb-4 border-b border-border mb-4', className)}>
      <div className="flex items-start space-x-4">
        {Icon && (
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

/**
 * Card body component
 * @returns JSX.Element
 */
export const CardLayoutBody = ({ children, className }: CardBodyProps): JSX.Element => {
  return <div className={cn('', className)}>{children}</div>;
};

/**
 * Card footer component
 * @returns JSX.Element
 */
export const CardLayoutFooter = ({
  children,
  variant = 'default',
  className,
}: CardFooterProps): JSX.Element => {
  const variants = {
    default: 'pt-4 border-t border-border mt-4',
    actions: 'pt-4 border-t border-border mt-4 flex items-center justify-end space-x-4',
    centered: 'pt-4 border-t border-border mt-4 text-center',
  };

  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  );
};

/**
 * Card grid component for laying out multiple cards
 * @returns JSX.Element
 */
export const CardGrid = ({
  children,
  columns = 3,
  gap = 'md',
  className,
}: CardGridProps): JSX.Element => {
  const gaps = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div
      className={cn(
        'grid',
        gaps[gap],
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        columns === 5 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
        columns === 6 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Stats card component for displaying metrics
 */
interface StatsCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  readonly icon?: React.ComponentType<{ className?: string }>;
  readonly description?: string;
  readonly className?: string;
}

export const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
}: StatsCardProps): JSX.Element => {
  return (
    <CardLayout variant="elevated" className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  'text-sm font-medium',
                  change.type === 'increase' ? 'text-success' : 'text-destructive'
                )}
              >
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-sm text-muted-foreground ml-2">from last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
    </CardLayout>
  );
};