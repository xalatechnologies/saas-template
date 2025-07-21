import type { ThemeVariant, ColorScale } from '../types';
import { baseColors, successScale, warningScale, errorScale, infoScale } from '../base/colors';
import { typography } from '../base/typography';
import { spacing, borderRadius, shadows } from '../base/spacing';

// Education sector - More vibrant purple and orange
const educationPrimary: ColorScale = {
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7', // Main purple - more vibrant
  600: '#9333ea',
  700: '#7c3aed',
  800: '#6b21a8',
  900: '#581c87',
  950: '#3b0764',
};

const educationSecondary: ColorScale = {
  50: '#fff7ed',
  100: '#ffedd5',
  200: '#fed7aa',
  300: '#fdba74',
  400: '#fb923c',
  500: '#f97316', // Vibrant orange
  600: '#ea580c',
  700: '#c2410c',
  800: '#9a3412',
  900: '#7c2d12',
  950: '#431407',
};

const educationAccent: ColorScale = {
  50: '#fefce8',
  100: '#fef9c3',
  200: '#fef08a',
  300: '#fde047',
  400: '#facc15',
  500: '#eab308', // Bright yellow
  600: '#ca8a04',
  700: '#a16207',
  800: '#854d0e',
  900: '#713f12',
  950: '#422006',
};

export const educationTheme: ThemeVariant = {
  light: {
    id: 'education-light',
    name: 'Education Light',
    sector: 'education',
    description: 'Inspiring theme for educational applications',
    tokens: {
      colors: {
        base: baseColors,
        brand: {
          primary: educationPrimary,
          secondary: educationSecondary,
          accent: educationAccent,
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
    id: 'education-dark',
    name: 'Education Dark',
    sector: 'education',
    description: 'Inspiring dark theme for educational applications',
    tokens: {
      colors: {
        base: {
          ...baseColors,
          gray: {
            50: '#3b0764',
            100: '#581c87',
            200: '#6b21a8',
            300: '#7c3aed',
            400: '#9333ea',
            500: '#a855f7',
            600: '#c084fc',
            700: '#d8b4fe',
            800: '#e9d5ff',
            900: '#f3e8ff',
            950: '#faf5ff',
          },
        },
        brand: {
          primary: educationPrimary,
          secondary: educationSecondary,
          accent: educationAccent,
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
