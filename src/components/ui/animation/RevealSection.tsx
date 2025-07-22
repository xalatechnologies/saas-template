import React, { ReactElement, useRef, useState, useEffect } from 'react';
import { styled } from '@/styles';
import { animation } from '@/design-tokens/base/airbnb-animation';

/**
 * Props for the RevealSection component
 */
interface RevealSectionProps {
  /** Child elements to be revealed */
  children: ReactElement | ReactElement[];
  /** Direction from which the section appears */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Distance in pixels for the reveal effect */
  distance?: number;
  /** Delay before starting animation in ms */
  delay?: keyof typeof animation.delay;
  /** Duration of the reveal animation */
  duration?: keyof typeof animation.durations;
  /** Easing function for the animation */
  easing?: keyof typeof animation.easings;
  /** Optional CSS class name */
  className?: string;
  /** Threshold for intersection observer (0-1) */
  threshold?: number;
}

/**
 * Reveals content with Airbnb-style animation when it enters the viewport
 * Uses intersection observer for performance and supports multiple reveal directions
 */
export const RevealSection = ({
  children,
  direction = 'up',
  distance = 30,
  delay = 'none',
  duration = 'normal',
  easing = 'easeOut',
  className,
  threshold = 0.15,
}: RevealSectionProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Get transform values based on direction
  const getInitialTransform = (): string => {
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
      default:
        return `translateY(${distance}px)`;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Mark as visible when the element enters the viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '10px',
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
  }, [threshold]);

  return (
    <Container
      ref={ref}
      className={className}
      $isVisible={isVisible}
      $initialTransform={getInitialTransform()}
      $duration={animation.durations[duration]}
      $delay={animation.delay[delay]}
      $easing={animation.easings[easing]}
    >
      {children}
    </Container>
  );
};

interface ContainerProps {
  $isVisible: boolean;
  $initialTransform: string;
  $duration: string;
  $delay: string;
  $easing: string;
}

const Container = styled.div<ContainerProps>`
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: ${({ $isVisible, $initialTransform }) => 
    $isVisible ? 'translate(0, 0)' : $initialTransform};
  transition: opacity ${({ $duration }) => $duration} ${({ $easing }) => $easing} ${({ $delay }) => $delay},
    transform ${({ $duration }) => $duration} ${({ $easing }) => $easing} ${({ $delay }) => $delay};
  will-change: opacity, transform;
`;
