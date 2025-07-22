/**
 * Animation token types for the design system
 */

export interface AnimationTokens {
  durations: {
    xfast: string;
    fast: string;
    normal: string;
    medium: string;
    slow: string;
    xslow: string;
    xxslow: string;
    [key: string]: string;
  };
  easings: {
    linear: string;
    standard: string;
    easeOut: string;
    emphasizedDecelerate: string;
    easeIn: string;
    emphasizedAccelerate: string;
    easeInOut: string;
    spring: string;
    softLanding?: string;
    [key: string]: string | undefined;
  };
  presets: {
    [key: string]: {
      duration: string;
      easing: string;
      properties: string;
    };
  };
  delay: {
    none: string;
    short: string;
    medium: string;
    long: string;
    [key: string]: string;
  };
  stagger: {
    xxsmall: string;
    xsmall: string;
    small: string;
    medium: string;
    large: string;
    xlarge: string;
    [key: string]: string;
  };
}
