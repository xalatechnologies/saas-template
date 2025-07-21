'use client';

import React from 'react';
import { cn } from '@/utils';

/**
 * Content grid component interface for responsive layouts
 */
export interface ContentGridProps {
  readonly children: React.ReactNode;
  readonly columns?: 1 | 2 | 3 | 4 | 6;
  readonly gap?: 'sm' | 'md' | 'lg';
  readonly className?: string;
}

/**
 * Content grid component for responsive layouts without raw HTML elements
 * Provides consistent grid patterns across the application
 * @param props - Content grid component properties
 * @returns JSX.Element
 */
export const ContentGrid = ({ 
  children, 
  columns = 1, 
  gap = 'md',
  className = '' 
}: ContentGridProps): JSX.Element => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={cn(
      'grid',
      gridClasses[columns],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};