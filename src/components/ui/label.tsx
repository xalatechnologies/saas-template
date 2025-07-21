import React from 'react';
import { cn } from '@/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  readonly children: React.ReactNode;
  readonly required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-base font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block',
          className,
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
    );
  },
);

Label.displayName = 'Label';
