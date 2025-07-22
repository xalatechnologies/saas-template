'use client';

import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils';

const headingVariants = cva('font-heading tracking-tight', {
  variants: {
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      white: 'text-white',
    },
    size: {
      h1: 'text-4xl font-bold lg:text-5xl',
      h2: 'text-3xl font-bold',
      h3: 'text-2xl font-semibold',
      h4: 'text-xl font-semibold',
      h5: 'text-lg font-medium',
      h6: 'text-base font-medium',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'h2',
    align: 'left',
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Heading component for consistent heading styles using design tokens
 * Maps level prop to the appropriate h1-h6 HTML element
 */
const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, variant, size, align, ...props }, ref) => {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    
    // Map level to size if size isn't explicitly set
    const mappedSize = size || `h${level}` as any;

    return (
      <Tag
        ref={ref}
        className={cn(headingVariants({ variant, size: mappedSize, align }), className)}
        {...props}
      />
    );
  }
);

Heading.displayName = 'Heading';

export { Heading, headingVariants };
