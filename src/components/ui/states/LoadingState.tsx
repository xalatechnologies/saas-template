'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { AppText } from '../typography';

/**
 * Loading state component interface for consistent loading states
 */
export interface LoadingStateProps {
  readonly message?: string;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly className?: string;
}

/**
 * Loading state component for consistent loading presentation
 * Eliminates need for raw HTML elements in loading scenarios
 * @param props - Loading state component properties
 * @returns React.ReactElement
 */
export const LoadingState = ({
  message = 'Loading...',
  size = 'md',
  className = '',
}: LoadingStateProps): React.ReactElement => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`flex min-h-screen items-center justify-center bg-background ${className}`}>
      <div className="text-center space-y-2">
        <Loader2 className={`${sizeClasses[size]} animate-spin mx-auto text-primary`} />
        <AppText variant="muted" className="text-muted-foreground">
          {message}
        </AppText>
      </div>
    </div>
  );
};
