'use client';

import React from 'react';
import { cn } from '@/utils';

interface GridLayoutProps {
  readonly children: React.ReactNode;
  readonly columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3 | 4;
    desktop?: 3 | 4 | 5 | 6;
    wide?: 4 | 5 | 6 | 8;
  };
  readonly gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  readonly variant?: 'default' | 'masonry' | 'auto-fit' | 'auto-fill';
  readonly className?: string;
}

interface GridItemProps {
  readonly children: React.ReactNode;
  readonly span?: {
    mobile?: 1 | 2;
    tablet?: 1 | 2 | 3 | 4;
    desktop?: 1 | 2 | 3 | 4 | 5 | 6;
  };
  readonly order?: number;
  readonly className?: string;
}

interface FlexLayoutProps {
  readonly children: React.ReactNode;
  readonly direction?: 'row' | 'column';
  readonly wrap?: boolean;
  readonly gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  readonly align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  readonly justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  readonly className?: string;
}

interface SplitLayoutProps {
  readonly children: React.ReactNode;
  readonly split?: '50/50' | '60/40' | '70/30' | '30/70' | '40/60';
  readonly gap?: 'sm' | 'md' | 'lg' | 'xl';
  readonly stackAt?: 'sm' | 'md' | 'lg';
  readonly className?: string;
}

/**
 * Grid layout component for responsive grid layouts
 * @returns JSX.Element
 */
export const GridLayout = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
  gap = 'md',
  variant = 'default',
  className,
}: GridLayoutProps): JSX.Element => {
  const gaps = {
    xs: 'gap-[var(--spacing-xs)]',
    sm: 'gap-[var(--spacing-sm)]',
    md: 'gap-[var(--spacing-md)]',
    lg: 'gap-[var(--spacing-lg)]',
    xl: 'gap-[var(--spacing-xl)]',
  };

  const getGridClass = () => {
    if (variant === 'auto-fit') {
      return 'grid-cols-[repeat(auto-fit,minmax(300px,1fr))]';
    }
    if (variant === 'auto-fill') {
      return 'grid-cols-[repeat(auto-fill,minmax(300px,1fr))]';
    }

    // Default responsive columns
    const cols = [];
    if (columns.mobile) cols.push(`grid-cols-${columns.mobile}`);
    if (columns.tablet) cols.push(`sm:grid-cols-${columns.tablet}`);
    if (columns.desktop) cols.push(`lg:grid-cols-${columns.desktop}`);
    if (columns.wide) cols.push(`xl:grid-cols-${columns.wide}`);

    return cols.join(' ');
  };

  return (
    <div
      className={cn(
        'grid',
        gaps[gap],
        getGridClass(),
        variant === 'masonry' && 'auto-rows-[minmax(0,1fr)]',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Grid item component for spanning multiple columns
 * @returns JSX.Element
 */
export const GridItem = ({
  children,
  span = { mobile: 1 },
  order,
  className,
}: GridItemProps): JSX.Element => {
  const spans = [];
  if (span.mobile) spans.push(`col-span-${span.mobile}`);
  if (span.tablet) spans.push(`sm:col-span-${span.tablet}`);
  if (span.desktop) spans.push(`lg:col-span-${span.desktop}`);

  return (
    <div
      className={cn(
        spans.join(' '),
        order && `order-${order}`,
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Flex layout component for flexible layouts
 * @returns JSX.Element
 */
export const FlexLayout = ({
  children,
  direction = 'row',
  wrap = false,
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  className,
}: FlexLayoutProps): JSX.Element => {
  const gaps = {
    xs: 'gap-[var(--spacing-xs)]',
    sm: 'gap-[var(--spacing-sm)]',
    md: 'gap-[var(--spacing-md)]',
    lg: 'gap-[var(--spacing-lg)]',
    xl: 'gap-[var(--spacing-xl)]',
  };

  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifications = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  return (
    <div
      className={cn(
        'flex',
        direction === 'column' ? 'flex-col' : 'flex-row',
        wrap && 'flex-wrap',
        gaps[gap],
        alignments[align],
        justifications[justify],
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Split layout component for two-column layouts
 * @returns JSX.Element
 */
export const SplitLayout = ({
  children,
  split = '50/50',
  gap = 'md',
  stackAt = 'md',
  className,
}: SplitLayoutProps): JSX.Element => {
  const childArray = React.Children.toArray(children);
  
  if (childArray.length !== 2) {
    console.warn('SplitLayout expects exactly 2 children');
  }

  const gaps = {
    sm: 'gap-[var(--spacing-sm)]',
    md: 'gap-[var(--spacing-md)]',
    lg: 'gap-[var(--spacing-lg)]',
    xl: 'gap-[var(--spacing-xl)]',
  };

  const splits = {
    '50/50': ['lg:w-1/2', 'lg:w-1/2'],
    '60/40': ['lg:w-3/5', 'lg:w-2/5'],
    '70/30': ['lg:w-[70%]', 'lg:w-[30%]'],
    '30/70': ['lg:w-[30%]', 'lg:w-[70%]'],
    '40/60': ['lg:w-2/5', 'lg:w-3/5'],
  };

  const stackBreakpoints = {
    sm: 'sm:flex-row',
    md: 'md:flex-row',
    lg: 'lg:flex-row',
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        stackBreakpoints[stackAt],
        gaps[gap],
        className
      )}
    >
      {childArray.map((child, index) => (
        <div key={index} className={cn('w-full', splits[split][index])}>
          {child}
        </div>
      ))}
    </div>
  );
};

// Container component has been moved to its own file
// See Container.tsx for the implementation