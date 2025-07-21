import type { Spacing, BorderRadius, Shadows } from '../types';

export const spacing: Spacing = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px - increased from 1.5rem
  7: '1.875rem',     // 30px - increased spacing
  8: '2.25rem',      // 36px - more generous
  9: '2.5rem',       // 40px - better visual breathing
  10: '2.75rem',     // 44px - improved hierarchy
  11: '3rem',        // 48px - more spacious
  12: '3.5rem',      // 56px - generous spacing
  14: '4rem',        // 64px - large spacing
  16: '4.5rem',      // 72px - extra large
  20: '5.5rem',      // 88px - very spacious
  24: '6.5rem',      // 104px - section spacing
  28: '7.5rem',      // 120px - large sections
  32: '8.5rem',      // 136px - hero spacing
  36: '9.5rem',      // 152px - extra large sections
  40: '10.5rem',     // 168px - massive spacing
  44: '11.5rem',     // 184px
  48: '12.5rem',     // 200px
  52: '13.5rem',     // 216px
  56: '14.5rem',     // 232px
  60: '15.5rem',     // 248px
  64: '16.5rem',     // 264px
  72: '18.5rem',     // 296px
  80: '20.5rem',     // 328px
  96: '24.5rem',     // 392px
};

export const borderRadius: BorderRadius = {
  none: '0px',
  sm: '0.25rem',     // 4px - slightly more rounded
  base: '0.375rem',  // 6px - modern rounded corners
  md: '0.5rem',      // 8px - comfortable rounding
  lg: '0.75rem',     // 12px - more pronounced
  xl: '1rem',        // 16px - strong rounding
  '2xl': '1.25rem',  // 20px - very rounded
  '3xl': '1.75rem',  // 28px - highly rounded
  full: '9999px',
};

export const shadows: Shadows = {
  xs: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
  sm: '0 2px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
  base: '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 4px 8px -2px rgb(0 0 0 / 0.06)',
  md: '0 8px 24px -4px rgb(0 0 0 / 0.12), 0 6px 16px -6px rgb(0 0 0 / 0.08)',
  lg: '0 16px 40px -8px rgb(0 0 0 / 0.14), 0 8px 24px -8px rgb(0 0 0 / 0.1)',
  xl: '0 24px 64px -12px rgb(0 0 0 / 0.18), 0 16px 40px -16px rgb(0 0 0 / 0.12)',
  '2xl': '0 32px 80px -16px rgb(0 0 0 / 0.22), 0 24px 64px -24px rgb(0 0 0 / 0.16)',
  inner: 'inset 0 2px 6px 0 rgb(0 0 0 / 0.08)',
  none: '0 0 #0000',
};