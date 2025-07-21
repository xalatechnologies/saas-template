import type { Typography } from '../types';

export const typography: Typography = {
  fontFamily: {
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'system-ui',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ],
    serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
    mono: [
      'ui-monospace',
      'JetBrains Mono',
      'SF Mono',
      'Menlo',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace',
    ],
  },
  fontSize: {
    xs: '0.8125rem', // 13px - slightly larger
    sm: '0.9375rem', // 15px - more readable
    base: '1.0625rem', // 17px - better readability
    lg: '1.1875rem', // 19px - improved hierarchy
    xl: '1.375rem', // 22px - stronger presence
    '2xl': '1.625rem', // 26px - better visual impact
    '3xl': '2rem', // 32px - more prominent
    '4xl': '2.5rem', // 40px - stronger headlines
    '5xl': '3.25rem', // 52px - impactful headers
    '6xl': '4rem', // 64px - hero typography
  },
  fontWeight: {
    thin: '100',
    light: '200',
    extralight: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: '1',
    tight: '1.2', // Tighter for headlines
    snug: '1.35', // Better for subheadings
    normal: '1.55', // Improved readability
    relaxed: '1.7', // More comfortable reading
    loose: '2.1', // Spacious for special cases
  },
};
