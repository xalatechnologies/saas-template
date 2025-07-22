import React, { ReactElement, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@/styles';
import { animation } from '@/design-tokens/base/airbnb-animation';

/**
 * Props for the PageTransition component
 */
interface PageTransitionProps {
  /** Content to be animated */
  children: ReactElement;
  /** Unique identifier for this page/route */
  routeKey: string;
  /** Type of transition effect */
  transitionType?: 'fade' | 'slide-up' | 'slide-horizontal';
  /** Duration of animation */
  duration?: keyof typeof animation.durations;
  /** Custom classname */
  className?: string;
}

/**
 * Transition variants that match Airbnb's exact page transition animations
 */
const getTransitionVariants = (type: string, duration: string, easing: string) => {
  // Base variants for all transition types
  const baseVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: parseFloat(duration) / 1000, // Convert ms to seconds
        ease: easing,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: (parseFloat(duration) * 0.75) / 1000, // Exit slightly faster
        ease: animation.easings.easeIn,
      },
    },
  };

  // Add transform properties based on transition type
  switch (type) {
    case 'slide-up':
      return {
        initial: {
          ...baseVariants.initial,
          y: 20,
        },
        animate: {
          ...baseVariants.animate,
          y: 0,
        },
        exit: {
          ...baseVariants.exit,
          y: -20,
        },
      };
    case 'slide-horizontal':
      return {
        initial: {
          ...baseVariants.initial,
          x: 20,
        },
        animate: {
          ...baseVariants.animate,
          x: 0,
        },
        exit: {
          ...baseVariants.exit,
          x: -20,
        },
      };
    case 'fade':
    default:
      return baseVariants;
  }
};

/**
 * PageTransition component that provides smooth Airbnb-style transitions between routes/pages
 * Uses framer-motion for animation with carefully tuned parameters to match Airbnb's feel
 */
export const PageTransition = ({
  children,
  routeKey,
  transitionType = 'fade',
  duration = 'normal',
  className,
}: PageTransitionProps): ReactElement => {
  const prevScrollY = useRef<number>(0);

  // Save scroll position before animation starts
  useEffect(() => {
    prevScrollY.current = window.scrollY;
    return () => {
      // Store the scroll position when component unmounts
      prevScrollY.current = window.scrollY;
    };
  }, [routeKey]);

  // Convert animation.durations string to number (remove 'ms')
  const durationValue = animation.durations[duration];
  
  // Get the appropriate easing function based on transition type
  const easingValue = 
    transitionType === 'fade' 
      ? animation.easings.easeOut 
      : animation.easings.softLanding;
  
  const variants = getTransitionVariants(
    transitionType,
    durationValue,
    easingValue
  );

  return (
    <AnimatePresence mode="wait">
      <Container
        key={routeKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className={className}
      >
        {children}
      </Container>
    </AnimatePresence>
  );
};

const Container = styled(motion.div)`
  width: 100%;
  will-change: opacity, transform;
`;
