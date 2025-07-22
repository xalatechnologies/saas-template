'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { animation } from '@/src/design-tokens/base/animations';
import { cn } from '@/utils';

export interface RevealSectionProps {
  /** Children to animate */
  children: ReactNode;
  /** Animation type */
  animation?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale';
  /** Animation duration */
  duration?: keyof typeof animation.durations;
  /** Animation easing */
  easing?: keyof typeof animation.easings;
  /** Animation delay */
  delay?: keyof typeof animation.delay;
  /** Threshold for triggering animation (0-1) */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Whether to trigger animation only once */
  triggerOnce?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * RevealSection component that animates when entering viewport
 * @returns JSX.Element
 */
export const RevealSection = ({
  children,
  animation: animationType = 'slideUp',
  duration = 'normal',
  easing = 'easeOut',
  delay = 'none',
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  className,
}: RevealSectionProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

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

  const animationClasses = {
    fade: isVisible ? 'opacity-100' : 'opacity-0',
    slideUp: isVisible 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-8',
    slideDown: isVisible 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 -translate-y-8',
    slideLeft: isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 translate-x-8',
    slideRight: isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 -translate-x-8',
    scale: isVisible 
      ? 'opacity-100 scale-100' 
      : 'opacity-0 scale-95'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all',
        durationClasses[duration as keyof typeof durationClasses],
        easingClasses[easing as keyof typeof easingClasses],
        delayClasses[delay as keyof typeof delayClasses],
        animationClasses[animationType],
        className
      )}
    >
      {children}
    </div>
  );
};

export default RevealSection;