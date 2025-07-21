import React from 'react';
import { cn } from '@/utils';

// Heading component
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  readonly children: React.ReactNode;
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
  readonly variant?: 'default' | 'muted';
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, level = 1, variant = 'default', ...props }, ref) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    
    const variants = {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
    };

    const sizes = {
      1: 'text-5xl font-black leading-tight',
      2: 'text-4xl font-bold leading-tight',
      3: 'text-3xl font-bold leading-snug',
      4: 'text-2xl font-semibold leading-snug',
      5: 'text-xl font-semibold leading-normal',
      6: 'text-lg font-semibold leading-normal',
    };

    return (
      <Tag
        ref={ref}
        className={cn(
          'tracking-tight',
          sizes[level],
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Heading.displayName = 'Heading';

// AppText component
export interface AppTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  readonly children: React.ReactNode;
  readonly variant?: 'default' | 'muted' | 'small' | 'large';
  readonly asChild?: boolean;
}

export const AppText = React.forwardRef<HTMLParagraphElement, AppTextProps>(
  ({ className, children, variant = 'default', asChild = false, ...props }, ref) => {
    const variants = {
      default: 'text-lg text-foreground leading-relaxed',
      muted: 'text-base text-muted-foreground leading-relaxed',
      small: 'text-base text-foreground leading-normal',
      large: 'text-xl text-foreground leading-relaxed',
    };

    const Component = asChild ? React.Fragment : 'p';

    if (asChild) {
      return <>{children}</>;
    }

    return (
      <p
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

AppText.displayName = 'AppText';