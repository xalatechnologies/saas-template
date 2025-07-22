import { useEffect, useState, useRef, ReactElement } from 'react';
import { animation } from '@/design-tokens/base/airbnb-animation';
import { styled } from '@/styles';
import { css, keyframes } from 'styled-components';

// ============================
// Animation Keyframes
// ============================

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

// ============================
// Animation Mixins
// ============================

export const transitionMixin = (
  properties: string = 'all',
  duration: keyof typeof animation.durations = 'normal',
  easing: keyof typeof animation.easings = 'easeOut',
  delay: keyof typeof animation.delay = 'none'
) => css`
  transition: ${properties} ${animation.durations[duration]} ${animation.easings[easing]} ${animation.delay[delay]};
`;

export const animationMixin = (
  animationName: any,
  duration: keyof typeof animation.durations = 'normal',
  easing: keyof typeof animation.easings = 'easeOut',
  delay: keyof typeof animation.delay = 'none',
  fillMode: string = 'forwards'
) => css`
  animation: ${animationName} ${animation.durations[duration]} ${animation.easings[easing]} ${animation.delay[delay]} ${fillMode};
`;

export const hoverScaleMixin = (scale: string = '1.03') => css`
  ${transitionMixin('transform', 'fast', 'spring')}
  &:hover {
    transform: scale(${scale});
  }
`;

export const cardHoverMixin = () => css`
  ${transitionMixin('transform, box-shadow', 'fast', 'spring')}
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const buttonPressMixin = () => css`
  ${transitionMixin('transform, box-shadow', 'xfast', 'spring')}
  &:active {
    transform: scale(0.98);
  }
`;

// ============================
// Animation Components
// ============================

interface FadeProps {
  children: ReactElement;
  duration?: keyof typeof animation.durations;
  easing?: keyof typeof animation.easings;
  delay?: keyof typeof animation.delay;
  direction?: 'up' | 'down' | 'none';
  show?: boolean;
}

export const Fade = ({
  children,
  duration = 'normal',
  easing = 'easeOut',
  delay = 'none',
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

  let animationToUse = fadeIn;
  if (direction === 'up') animationToUse = fadeInUp;
  if (direction === 'down') animationToUse = fadeInDown;

  return (
    <div
      style={{
        animation: `${animationToUse} ${animation.durations[duration]} ${animation.easings[easing]} ${animation.delay[delay]}`,
        opacity: show ? 1 : 0,
      }}
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
  animation = 'fadeIn',
}: StaggeredListProps) => {
  return (
    <>
      {children.map((child, index) => {
        const calculatedDelay = `${parseInt(animation.delay[initialDelay] || '0') + parseInt(animation.stagger[staggerDelay] || '0') * index}ms`;
        
        return (
          <div
            key={index}
            style={{
              animation: `${fadeIn} ${animation.presets[animation].duration} ${animation.presets[animation].easing}`,
              animationDelay: calculatedDelay,
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

// Styled components using animation mixins

export const HoverCard = styled.div`
  ${cardHoverMixin()}
  border-radius: 8px;
  overflow: hidden;
`;

export const PressableButton = styled.button`
  ${buttonPressMixin()}
  border: none;
  background: none;
  cursor: pointer;
`;

export const ZoomImage = styled.img`
  ${hoverScaleMixin('1.05')}
  border-radius: 8px;
  overflow: hidden;
`;

// Loading components

export const SkeletonLoader = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  ${animationMixin(shimmer, 'xslow', 'linear')}
  animation-iteration-count: infinite;
  border-radius: 4px;
`;

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
    animation = 'fadeIn',
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

  const animationStyle = isInView
    ? {
        opacity: 1,
        transform: 'translateY(0)',
        transition: `opacity ${animation.presets[animation].duration} ${animation.presets[animation].easing}, transform ${animation.presets[animation].duration} ${animation.presets[animation].easing}`,
      }
    : {
        opacity: 0,
        transform: 'translateY(20px)',
        transition: 'none',
      };

  return { ref, isInView, animationStyle };
};
