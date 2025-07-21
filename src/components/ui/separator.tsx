import React from 'react';
import { cn } from '@/utils';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly orientation?: 'horizontal' | 'vertical';
  readonly decorative?: boolean;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref): JSX.Element => (
    <div
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      {...props}
    />
  ),
);

Separator.displayName = 'Separator';
