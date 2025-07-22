import React from 'react';
import { cn } from '@/utils';

interface MainContentProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly variant?: 'web' | 'dashboard' | 'auth' | 'fullscreen';
}

/**
 * Semantic main content component for consistent layout structure
 * Provides proper flex growth and semantic HTML for different layout types
 * @returns JSX.Element
 */
export const MainContent = ({ 
  children, 
  className,
  variant = 'web' 
}: MainContentProps): JSX.Element => {
  const variantClasses = {
    web: 'flex-1',
    dashboard: 'flex-1 overflow-hidden',
    auth: 'flex-1 flex items-center justify-center',
    fullscreen: 'flex-1 h-full w-full'
  };

  return (
    <main 
      id="main-content" 
      role="main"
      className={cn(variantClasses[variant], className)}
    >
      {children}
    </main>
  );
};