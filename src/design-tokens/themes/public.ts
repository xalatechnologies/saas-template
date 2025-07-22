import type { ThemeVariant, ColorScale } from '../types';
import { baseColors, successScale, warningScale, errorScale } from '../base/colors';
import { typography } from '../base/typography';
import { spacing, borderRadius, shadows } from '../base/spacing';

// Public sector - Professional blue inspired by digdir/nsm.no
const publicPrimary: ColorScale = {
  50: '#f0f7ff',
  100: '#e0efff',
  200: '#c7e2ff',
  300: '#a5cfff',
  400: '#70b3ff',
  500: '#0062ff', // Professional blue
  600: '#0052e6',
  700: '#0045cc',
  800: '#003ba3',
  900: '#002f80',
  950: '#001f5c',
};

const publicSecondary: ColorScale = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
};

const publicAccent: ColorScale = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9', // Bright cyan
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49',
};

export const publicTheme: ThemeVariant = {
  light: {
    id: 'public-light',
    name: 'Public Sector Light',
    sector: 'public',
    description: 'Professional theme for government and public sector applications',
    tokens: {
      colors: {
        base: baseColors,
        brand: {
          primary: publicPrimary,
          secondary: publicSecondary,
          accent: publicAccent,
        },
        semantic: {
          success: successScale,
          warning: warningScale,
          error: errorScale,
          info: publicPrimary,
        },
      },
      typography,
      spacing,
      borderRadius,
      shadows,
    },
  },
  dark: {
    id: 'public-dark',
    name: 'Public Sector Dark',
    sector: 'public',
    description: 'Professional dark theme for government and public sector applications',
    tokens: {
      colors: {
        base: {
          ...baseColors,
          gray: {
            50: '#020617',
            100: '#0f172a',
            200: '#1e293b',
            300: '#334155',
            400: '#475569',
            500: '#64748b',
            600: '#94a3b8',
            700: '#cbd5e1',
            800: '#e2e8f0',
            900: '#f1f5f9',
            950: '#f8fafc',
          },
        },
        brand: {
          primary: publicPrimary,
          secondary: publicSecondary,
          accent: publicAccent,
        },
        semantic: {
          success: successScale,
          warning: warningScale,
          error: errorScale,
          info: publicPrimary,
        },
      },
      typography,
      spacing,
      borderRadius,
      shadows,
    },
  },
};
