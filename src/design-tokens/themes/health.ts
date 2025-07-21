import type { ThemeVariant, ColorScale } from '../types';
import { baseColors, successScale, warningScale, errorScale, infoScale } from '../base/colors';
import { typography } from '../base/typography';
import { spacing, borderRadius, shadows } from '../base/spacing';

// Health sector - More vibrant teal and green
const healthPrimary: ColorScale = {
  50: '#f0fdfa',
  100: '#ccfbf1',
  200: '#99f6e4',
  300: '#5eead4',
  400: '#2dd4bf',
  500: '#14b8a6', // Vibrant teal
  600: '#0d9488',
  700: '#0f766e',
  800: '#115e59',
  900: '#134e4a',
  950: '#042f2e',
};

const healthSecondary: ColorScale = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e', // Vibrant green
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  950: '#052e16',
};

const healthAccent: ColorScale = {
  50: '#ecfdf5',
  100: '#d1fae5',
  200: '#a7f3d0',
  300: '#6ee7b7',
  400: '#34d399',
  500: '#10b981', // Emerald green
  600: '#059669',
  700: '#047857',
  800: '#065f46',
  900: '#064e3b',
  950: '#022c22',
};

export const healthTheme: ThemeVariant = {
  light: {
    id: 'health-light',
    name: 'Health & Wellness Light',
    sector: 'health',
    description: 'Calming theme for health and wellness applications',
    tokens: {
      colors: {
        base: baseColors,
        brand: {
          primary: healthPrimary,
          secondary: healthSecondary,
          accent: healthAccent,
        },
        semantic: {
          success: successScale,
          warning: warningScale,
          error: errorScale,
          info: infoScale,
        },
      },
      typography,
      spacing,
      borderRadius,
      shadows,
    },
  },
  dark: {
    id: 'health-dark',
    name: 'Health & Wellness Dark',
    sector: 'health',
    description: 'Calming dark theme for health and wellness applications',
    tokens: {
      colors: {
        base: {
          ...baseColors,
          gray: {
            50: '#042f2e',
            100: '#134e4a',
            200: '#115e59',
            300: '#0f766e',
            400: '#0d9488',
            500: '#14b8a6',
            600: '#2dd4bf',
            700: '#5eead4',
            800: '#99f6e4',
            900: '#ccfbf1',
            950: '#f0fdfa',
          },
        },
        brand: {
          primary: healthPrimary,
          secondary: healthSecondary,
          accent: healthAccent,
        },
        semantic: {
          success: successScale,
          warning: warningScale,
          error: errorScale,
          info: infoScale,
        },
      },
      typography,
      spacing,
      borderRadius,
      shadows,
    },
  },
};