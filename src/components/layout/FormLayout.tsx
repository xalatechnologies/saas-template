'use client';

import React from 'react';
import { cn } from '@/utils';

interface FormLayoutProps {
  readonly children: React.ReactNode;
  readonly title?: string;
  readonly description?: string;
  readonly variant?: 'default' | 'card' | 'inline' | 'split';
  readonly columns?: 1 | 2 | 3;
  readonly className?: string;
}

interface FormSectionProps {
  readonly children: React.ReactNode;
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
}

interface FormRowProps {
  readonly children: React.ReactNode;
  readonly columns?: 1 | 2 | 3 | 4;
  readonly className?: string;
}

interface FormFieldProps {
  readonly children: React.ReactNode;
  readonly label?: string;
  readonly description?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly className?: string;
}

/**
 * Form layout component for consistent form styling
 * @returns JSX.Element
 */
export const FormLayout = ({
  children,
  title,
  description,
  variant = 'default',
  columns = 1,
  className,
}: FormLayoutProps): JSX.Element => {
  const variants = {
    default: 'space-y-8',
    card: 'bg-card rounded-xl border border-border shadow-xl p-8 space-y-8',
    inline: 'space-y-6',
    split: 'grid lg:grid-cols-2 gap-12',
  };

  return (
    <div className={cn('w-full', className)}>
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div
        className={cn(
          variants[variant],
          columns > 1 && `grid grid-cols-1 md:grid-cols-${columns} gap-8`
        )}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Form section component for grouping related fields
 * @returns JSX.Element
 */
export const FormSection = ({
  children,
  title,
  description,
  className,
}: FormSectionProps): JSX.Element => {
  return (
    <div className={cn('space-y-6', className)}>
      {(title || description) && (
        <div className="border-b border-border pb-4">
          {title && (
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  );
};

/**
 * Form row component for horizontal field layouts
 * @returns JSX.Element
 */
export const FormRow = ({
  children,
  columns = 1,
  className,
}: FormRowProps): JSX.Element => {
  return (
    <div
      className={cn(
        'grid gap-6',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Form field wrapper component for consistent field styling
 * @returns JSX.Element
 */
export const FormField = ({
  children,
  label,
  description,
  error,
  required,
  className,
}: FormFieldProps): JSX.Element => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-semibold text-foreground flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <div>{children}</div>
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};