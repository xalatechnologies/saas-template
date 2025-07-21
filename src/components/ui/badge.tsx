import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-md',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-md',
        outline: 'text-foreground border-2 hover:bg-accent',
        success: 'border-transparent bg-green-500 text-white hover:bg-green-600 shadow-md',
        warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600 shadow-md',
        info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600 shadow-md',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  readonly children: React.ReactNode;
}

export const Badge = ({ className, variant, children, ...props }: BadgeProps): React.ReactElement => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
};