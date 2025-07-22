'use client';

import { ReactNode, useState } from 'react';
import { animation } from '@/src/design-tokens/base/animations';
import { cn } from '@/utils';

export interface TransitionCardProps {
  /** Children to animate */
  children: ReactNode;
  /** Hover animation type */
  hoverAnimation?: 'lift' | 'scale' | 'glow' | 'none';
  /** Click animation type */
  clickAnimation?: 'scale' | 'press' | 'none';
  /** Animation duration */
  duration?: keyof typeof animation.durations;
  /** Animation easing */
  easing?: keyof typeof animation.easings;
  /** Custom className */
  className?: string;
  /** onClick handler */
  onClick?: () => void;
  /** onHover handler */
  onHover?: (isHovered: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * TransitionCard component with hover and click animations
 * @returns JSX.Element
 */
export const TransitionCard = ({
  children,
  hoverAnimation = 'lift',
  clickAnimation = 'scale',
  duration = 'fast',
  easing = 'easeOut',
  className,
  onClick,
  onHover,
  disabled = false,
}: TransitionCardProps): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setIsHovered(false);
    setIsPressed(false);
    onHover?.(false);
  };

  const handleMouseDown = () => {
    if (disabled) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (disabled) return;
    setIsPressed(false);
  };

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

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

  const getHoverClasses = () => {
    if (disabled || !isHovered) return '';
    
    switch (hoverAnimation) {
      case 'lift':
        return '-translate-y-2 shadow-xl';
      case 'scale':
        return 'scale-105';
      case 'glow':
        return 'shadow-2xl ring-2 ring-primary/20';
      case 'none':
      default:
        return '';
    }
  };

  const getClickClasses = () => {
    if (disabled || !isPressed) return '';
    
    switch (clickAnimation) {
      case 'scale':
        return 'scale-95';
      case 'press':
        return 'translate-y-0.5';
      case 'none':
      default:
        return '';
    }
  };

  return (
    <div
      className={cn(
        'transition-all',
        durationClasses[duration as keyof typeof durationClasses],
        easingClasses[easing as keyof typeof easingClasses],
        'rounded-xl bg-card shadow-lg',
        !disabled && onClick && 'cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        getHoverClasses(),
        getClickClasses(),
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default TransitionCard;