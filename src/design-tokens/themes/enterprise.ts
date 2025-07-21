import type { ThemeVariant, ColorScale } from '../types';
import { baseColors, successScale, warningScale, errorScale, infoScale } from '../base/colors';
import { typography } from '../base/typography';
import { spacing, borderRadius, shadows } from '../base/spacing';

// Enterprise sector - Professional navy and gold
const enterprisePrimary: ColorScale = {
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

const enterpriseSecondary: ColorScale = {
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

const enterpriseAccent: ColorScale = {
  50: '#f7f8f9',
  100: '#ebedef',
  200: '#d2d6db',
  300: '#b4bac1',
  400: '#8e969f',
  500: '#6c7481',
  600: '#5d6470',
  700: '#4e545f',
  800: '#44484f',
  900: '#3c3f44',
  950: '#26282c',
};

export const enterpriseTheme: ThemeVariant = {
  light: {
    id: 'enterprise-light',
    name: 'Enterprise Light',
    sector: 'enterprise',
    description: 'Professional theme for enterprise applications',
    tokens: {
      colors: {
        base: baseColors,
        brand: {
          primary: enterprisePrimary,
          secondary: enterpriseSecondary,
          accent: enterpriseAccent,
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
    id: 'enterprise-dark',
    name: 'Enterprise Dark',
    sector: 'enterprise',
    description: 'Professional dark theme for enterprise applications',
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
          primary: enterprisePrimary,
          secondary: enterpriseSecondary,
          accent: enterpriseAccent,
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