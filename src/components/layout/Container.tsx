import React from 'react';
import { FlexLayout } from './GridLayout';

interface ContainerProps {
  readonly children: React.ReactNode;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  readonly className?: string;
}

/**
 * Container component that provides consistent max-width and padding
 * Uses design tokens for sizing and spacing
 * @returns JSX.Element
 */
export const Container = ({ 
  children, 
  size = 'xl',
  className 
}: ContainerProps): JSX.Element => {
  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md', 
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full'
  };

  return (
    <FlexLayout 
      direction="column" 
      className={`${sizeClasses[size]} mx-auto px-[var(--spacing-lg)] py-[var(--spacing-lg)] ${className || ''}`}
    >
      {children}
    </FlexLayout>
  );
};