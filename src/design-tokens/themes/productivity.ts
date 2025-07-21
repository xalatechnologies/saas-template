import type { ThemeVariant, ColorScale } from '../types';
import { baseColors, successScale, warningScale, errorScale, infoScale } from '../base/colors';
import { typography } from '../base/typography';
import { spacing, borderRadius, shadows } from '../base/spacing';

// Productivity sector - Energizing green and yellow
const productivityPrimary: ColorScale = {
  50: '#f7fee7',
  100: '#ecfccb',
  200: '#d9f99d',
  300: '#bef264',
  400: '#a3e635',
  500: '#84cc16',
  600: '#65a30d',
  700: '#4d7c0f',
  800: '#3f6212',
  900: '#365314',
  950: '#1a2e05',
};

const productivitySecondary: ColorScale = {
  50: '#fefce8',
  100: '#fef9c3',
  200: '#fef08a',
  300: '#fde047',
  400: '#facc15',
  500: '#eab308',
  600: '#ca8a04',
  700: '#a16207',
  800: '#854d0e',
  900: '#713f12',
  950: '#422006',
};

const productivityAccent: ColorScale = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  950: '#052e16',
};

export const productivityTheme: ThemeVariant = {
  light: {
    id: 'productivity-light',
    name: 'Productivity Light',
    sector: 'productivity',
    description: 'Energizing theme for productivity applications',
    tokens: {
      colors: {
        base: baseColors,
        brand: {
          primary: productivityPrimary,
          secondary: productivitySecondary,
          accent: productivityAccent,
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
    id: 'productivity-dark',
    name: 'Productivity Dark',
    sector: 'productivity',
    description: 'Energizing dark theme for productivity applications',
    tokens: {
      colors: {
        base: {
          ...baseColors,
          gray: {
            50: '#1a2e05',
            100: '#365314',
            200: '#3f6212',
            300: '#4d7c0f',
            400: '#65a30d',
            500: '#84cc16',
            600: '#a3e635',
            700: '#bef264',
            800: '#d9f99d',
            900: '#ecfccb',
            950: '#f7fee7',
          },
        },
        brand: {
          primary: productivityPrimary,
          secondary: productivitySecondary,
          accent: productivityAccent,
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