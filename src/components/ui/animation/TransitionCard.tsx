import React, { ReactElement } from 'react';
import { styled } from '@/styles';
import { animation } from '@/design-tokens/base/airbnb-animation';

/**
 * Props for TransitionCard component
 */
interface TransitionCardProps {
  /** Card content */
  children: ReactElement;
  /** Whether card is elevated on hover */
  elevated?: boolean;
  /** Scale factor when hovering (1.0 = no scale) */
  hoverScale?: number;
  /** Whether to animate when component mounts */
  animateEntry?: boolean;
  /** Custom CSS class name */
  className?: string;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * TransitionCard component that mimics Airbnb's card hover effects
 * Provides elevation, subtle scaling, and smooth shadow transitions
 */
export const TransitionCard = ({
  children,
  elevated = true,
  hoverScale = 1.02,
  animateEntry = false,
  className,
  onClick,
}: TransitionCardProps): ReactElement => {
  return (
    <StyledCard
      className={className}
      $elevated={elevated}
      $hoverScale={hoverScale}
      $animateEntry={animateEntry}
      onClick={onClick}
    >
      {children}
    </StyledCard>
  );
};

interface StyledCardProps {
  $elevated: boolean;
  $hoverScale: number;
  $animateEntry: boolean;
}

const StyledCard = styled.div<StyledCardProps>`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  
  /* Base shadow */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  
  /* Airbnb-style hover transition for transform and shadow */
  transition: 
    transform ${animation.durations.normal} ${animation.easings.spring},
    box-shadow ${animation.durations.normal} ${animation.easings.spring};
  
  /* Entry animation if enabled */
  ${({ $animateEntry }) => $animateEntry && `
    animation: cardEntry ${animation.durations.normal} ${animation.easings.softLanding} forwards;
    
    @keyframes cardEntry {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `}
  
  /* Interactive hover effects */
  ${({ $elevated, $hoverScale }) => $elevated && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px) scale(${$hoverScale});
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      transform: translateY(-2px) scale(${$hoverScale * 0.99});
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
  `}
`;
