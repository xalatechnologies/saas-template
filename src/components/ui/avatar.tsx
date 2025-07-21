import React from 'react';
import Image from 'next/image';
import { cn } from '@/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly src?: string;
  readonly alt?: string;
  readonly fallback?: string;
  readonly size?: 'sm' | 'md' | 'lg';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref): JSX.Element => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
    };

    const textSizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full',
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt || 'Avatar'}
            fill
            className="aspect-square object-cover"
            onError={(e) => {
              // Hide image on error and show fallback
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : null}
        {fallback && (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center rounded-full bg-muted',
              textSizes[size],
            )}
          >
            {fallback}
          </div>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
