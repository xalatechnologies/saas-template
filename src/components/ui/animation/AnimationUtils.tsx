'use client';

import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { cn } from '@/utils';
import { animation } from '@/src/design-tokens/base/animations';

// ============================
// Animation CSS Classes
// ============================

export const animationClasses = {
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-250',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-400',
  slideDown: 'animate-in slide-in-from-top-4 duration-350',
  scaleIn: 'animate-in zoom-in-95 duration-400',
  scaleOut: 'animate-out zoom-out-95 duration-350',
  pulse: 'animate-pulse',
  shimmer: 'animate-pulse'
};

// ============================
// Animation Utilities
// ============================

export const getTransitionClasses = (
  duration: keyof typeof animation.durations = 'normal',
  easing: keyof typeof animation.easings = 'easeOut'
) => {
  const durationMap = {
    xfast: 'duration-100',
    fast: 'duration-200', 
    normal: 'duration-300',
    medium: 'duration-400',
    slow: 'duration-500',
    xslow: 'duration-800',
    xxslow: 'duration-1200'
  };
  
  const easingMap = {
    linear: 'ease-linear',
    standard: 'ease-out',
    easeOut: 'ease-out',
    emphasizedDecelerate: 'ease-out',
    easeIn: 'ease-in',
    emphasizedAccelerate: 'ease-in',
    easeInOut: 'ease-in-out',
    spring: 'ease-out'
  };
  
  return `transition-all ${durationMap[duration as keyof typeof durationMap]} ${easingMap[easing as keyof typeof easingMap]}`;
};

export const hoverScaleClasses = 'transition-transform duration-200 ease-out hover:scale-105';

export const cardHoverClasses = 'transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl';

export const buttonPressClasses = 'transition-transform duration-100 ease-out active:scale-98';

// ============================
// Animation Components
// ============================

interface FadeProps {
  children: ReactElement;
  duration?: keyof typeof animation.durations;
  easing?: keyof typeof animation.easings;
  direction?: 'up' | 'down' | 'none';
  show?: boolean;
}

export const Fade = ({
  children,
  duration = 'normal',
  easing = 'easeOut',
  direction = 'none',
  show = true,
}: FadeProps) => {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) setShouldRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setShouldRender(false);
  };

  if (!shouldRender) return null;

  let animationClass = animationClasses.fadeIn;
  if (direction === 'up') animationClass = animationClasses.slideUp;
  if (direction === 'down') animationClass = animationClasses.slideDown;

  return (
    <div
      className={cn(
        animationClass,
        getTransitionClasses(duration, easing),
        show ? 'opacity-100' : 'opacity-0'
      )}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
};

interface StaggeredListProps {
  children: ReactElement[];
  staggerDelay?: keyof typeof animation.stagger;
  initialDelay?: keyof typeof animation.delay;
  animation?: keyof typeof animation.presets;
}

export const StaggeredList = ({
  children,
  staggerDelay = 'small',
  initialDelay = 'none',
  animation: animationType = 'fadeIn',
}: StaggeredListProps) => {
  const delayMap = {
    none: 0,
    short: 50,
    medium: 100,
    long: 200
  };
  
  const staggerMap = {
    xxsmall: 10,
    xsmall: 20,
    small: 30,
    medium: 50,
    large: 80,
    xlarge: 100
  };

  return (
    <>
      {children.map((child, index) => {
        const calculatedDelay = delayMap[initialDelay as keyof typeof delayMap] + staggerMap[staggerDelay as keyof typeof staggerMap] * index;
        
        return (
          <div
            key={index}
            className={cn(animationClasses[animationType as keyof typeof animationClasses])}
            style={{
              animationDelay: `${calculatedDelay}ms`,
              animationFillMode: 'both',
            }}
          >
            {child}
          </div>
        );
      })}
    </>
  );
};

// Component classes using animation utilities

export const HoverCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(cardHoverClasses, 'rounded-xl overflow-hidden', className)}>
    {children}
  </div>
);

export const PressableButton = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button 
    onClick={onClick}
    className={cn(buttonPressClasses, 'border-none bg-transparent cursor-pointer', className)}
  >
    {children}
  </button>
);

export const ZoomImage = ({ src, alt, className = '' }: { src: string; alt: string; className?: string }) => (
  <img 
    src={src} 
    alt={alt}
    className={cn(hoverScaleClasses, 'rounded-xl overflow-hidden', className)}
  />
);

// Loading components

export const SkeletonLoader = ({ className = '' }: { className?: string }) => (
  <div className={cn('bg-muted animate-pulse rounded-lg', className)} />
);

// Custom hooks for animation

interface InViewAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  animation?: keyof typeof animation.presets;
}

export const useInViewAnimation = (options: InViewAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  const animationClasses = isInView
    ? cn('opacity-100 translate-y-0', getTransitionClasses('normal', 'easeOut'))
    : 'opacity-0 translate-y-5';

  return { ref, isInView, animationClasses };
};
