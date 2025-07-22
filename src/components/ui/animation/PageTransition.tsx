'use client';

import { ReactNode } from 'react';
import { animation } from '@/src/design-tokens/base/animations';
import { cn } from '@/utils';

export interface PageTransitionProps {
  /** Children to animate */
  children: ReactNode;
  /** Transition type */
  type?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale';
  /** Animation duration */
  duration?: keyof typeof animation.durations;
  /** Animation easing */
  easing?: keyof typeof animation.easings;
  /** Animation delay */
  delay?: keyof typeof animation.delay;
  /** Custom className */
  className?: string;
  /** Whether to animate in or out */
  show?: boolean;
}

/**
 * Page transition component using Tailwind animations
 * @returns JSX.Element
 */
export const PageTransition = ({
  children,
  type = 'fade',
  duration = 'normal',
  easing = 'easeOut', 
  delay = 'none',
  className,
  show = true,
}: PageTransitionProps): JSX.Element => {
  const durationClasses = {
    xfast: 'duration-100',
    fast: 'duration-200',
    normal: 'duration-300',
    medium: 'duration-400', 
    slow: 'duration-500',
    xslow: 'duration-800',
    xxslow: 'duration-1200'
  };

  const easingClasses = {
    linear: 'ease-linear',
    standard: 'ease-out',
    easeOut: 'ease-out',
    emphasizedDecelerate: 'ease-out',
    easeIn: 'ease-in',
    emphasizedAccelerate: 'ease-in',
    easeInOut: 'ease-in-out',
    spring: 'ease-out'
  };

  const delayClasses = {
    none: 'delay-0',
    short: 'delay-75',
    medium: 'delay-100', 
    long: 'delay-200'
  };

  const transitionTypes = {
    fade: show ? 'animate-in fade-in' : 'animate-out fade-out',
    slideUp: show ? 'animate-in slide-in-from-bottom-4' : 'animate-out slide-out-to-bottom-4',
    slideDown: show ? 'animate-in slide-in-from-top-4' : 'animate-out slide-out-to-top-4', 
    slideLeft: show ? 'animate-in slide-in-from-right-4' : 'animate-out slide-out-to-right-4',
    slideRight: show ? 'animate-in slide-in-from-left-4' : 'animate-out slide-out-to-left-4',
    scale: show ? 'animate-in zoom-in-95' : 'animate-out zoom-out-95'
  };

  return (
    <div
      className={cn(
        'w-full',
        transitionTypes[type],
        durationClasses[duration as keyof typeof durationClasses],
        easingClasses[easing as keyof typeof easingClasses],
        delayClasses[delay as keyof typeof delayClasses],
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageTransition;