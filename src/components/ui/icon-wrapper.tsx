'use client';

import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils';

const iconWrapperVariants = cva('inline-flex items-center justify-center', {
  variants: {
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      white: 'text-white',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-destructive',
    },
    size: {
      xs: 'size-3',
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-8',
      '2xl': 'size-10',
      '3xl': 'size-12',
    },
    background: {
      none: '',
      default: 'bg-foreground/5 rounded-full p-1',
      primary: 'bg-primary/10 rounded-full p-1',
      secondary: 'bg-secondary rounded-full p-1',
      muted: 'bg-muted rounded-full p-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    background: 'none',
  },
});

export interface IconWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconWrapperVariants> {
  readonly children: React.ReactNode;
}

/**
 * IconWrapper component for consistent icon styling with design tokens
 * Wraps SVG icons with appropriate sizing and color variants
 */
const IconWrapper = React.forwardRef<HTMLDivElement, IconWrapperProps>(
  ({ className, variant, size, background, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(iconWrapperVariants({ variant, size, background }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

IconWrapper.displayName = 'IconWrapper';

export { IconWrapper, iconWrapperVariants };
