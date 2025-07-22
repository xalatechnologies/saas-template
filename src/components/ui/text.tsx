'use client';

import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils';

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      default: '',
      muted: 'text-muted-foreground',
      success: 'text-success',
      error: 'text-destructive',
      warning: 'text-warning',
      white: 'text-white',
      primary: 'text-primary',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    truncate: {
      true: 'truncate',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'base',
    weight: 'normal',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  readonly as?: React.ElementType;
}

/**
 * Text component for rendering consistent typography with design tokens
 * Supports various variants, sizes, weights, and alignments
 */
const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, as: Component = 'p', variant, size, weight, align, truncate, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ variant, size, weight, align, truncate }), className)}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text, textVariants };
