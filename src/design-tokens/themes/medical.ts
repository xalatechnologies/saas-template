import type { ThemeVariant, ColorScale } from '../types';
import { baseColors, successScale, warningScale, errorScale, infoScale } from '../base/colors';
import { typography } from '../base/typography';
import { spacing, borderRadius, shadows } from '../base/spacing';

// Medical sector - Clean blue and white with red accents
const medicalPrimary: ColorScale = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49',
};

const medicalSecondary: ColorScale = {
  50: '#fefefe',
  100: '#fdfdfd',
  200: '#fafafa',
  300: '#f5f5f5',
  400: '#e5e5e5',
  500: '#d4d4d4',
  600: '#a3a3a3',
  700: '#737373',
  800: '#525252',
  900: '#404040',
  950: '#262626',
};

const medicalAccent: ColorScale = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
  950: '#450a0a',
};

export const medicalTheme: ThemeVariant = {
  light: {
    id: 'medical-light',
    name: 'Medical Light',
    sector: 'medical',
    description: 'Clean and sterile theme for medical applications',
    tokens: {
      colors: {
        base: baseColors,
        brand: {
          primary: medicalPrimary,
          secondary: medicalSecondary,
          accent: medicalAccent,
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
    id: 'medical-dark',
    name: 'Medical Dark',
    sector: 'medical',
    description: 'Clean dark theme for medical applications',
    tokens: {
      colors: {
        base: {
          ...baseColors,
          gray: {
            50: '#082f49',
            100: '#0c4a6e',
            200: '#075985',
            300: '#0369a1',
            400: '#0284c7',
            500: '#0ea5e9',
            600: '#38bdf8',
            700: '#7dd3fc',
            800: '#bae6fd',
            900: '#e0f2fe',
            950: '#f0f9ff',
          },
        },
        brand: {
          primary: medicalPrimary,
          secondary: medicalSecondary,
          accent: medicalAccent,
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