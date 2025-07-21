import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ThemeConfig } from './types';
import { sectorThemes } from './themes';

interface ThemeState {
  currentTheme: ThemeConfig;
  availableThemes: Record<string, ThemeConfig>;
  isDarkMode: boolean;

  // Actions
  setTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
  applyTheme: (theme: ThemeConfig) => void;
  getThemesBySector: (sector: string) => ThemeConfig[];
}

// Flatten all themes into a single object
const getAllThemes = (): Record<string, ThemeConfig> => {
  const themes: Record<string, ThemeConfig> = {};

  Object.values(sectorThemes).forEach((sectorTheme) => {
    themes[sectorTheme.light.id] = sectorTheme.light;
    themes[sectorTheme.dark.id] = sectorTheme.dark;
  });

  return themes;
};

// Convert hex to HSL for Tailwind CSS variables
const hexToHsl = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// Apply theme to CSS variables
const applyThemeToCSS = (theme: ThemeConfig): void => {
  const root = document.documentElement;
  const { colors } = theme.tokens;
  const isDark = theme.id.includes('-dark');

  // Apply Tailwind CSS variables with proper HSL values
  if (isDark) {
    // Dark theme colors
    root.style.setProperty('--background', hexToHsl(colors.base.gray[900]));
    root.style.setProperty('--foreground', hexToHsl(colors.base.gray[50]));
    root.style.setProperty('--card', hexToHsl(colors.base.gray[800]));
    root.style.setProperty('--card-foreground', hexToHsl(colors.base.gray[50]));
    root.style.setProperty('--popover', hexToHsl(colors.base.gray[800]));
    root.style.setProperty('--popover-foreground', hexToHsl(colors.base.gray[50]));
    root.style.setProperty('--muted', hexToHsl(colors.base.gray[800]));
    root.style.setProperty('--muted-foreground', hexToHsl(colors.base.gray[400]));
    root.style.setProperty('--accent', hexToHsl(colors.base.gray[700]));
    root.style.setProperty('--accent-foreground', hexToHsl(colors.base.gray[50]));
    root.style.setProperty('--border', hexToHsl(colors.base.gray[700]));
    root.style.setProperty('--input', hexToHsl(colors.base.gray[700]));
    root.style.setProperty('--secondary', hexToHsl(colors.brand.secondary[800]));
    root.style.setProperty('--secondary-foreground', hexToHsl(colors.brand.secondary[100]));
  } else {
    // Light theme colors
    root.style.setProperty('--background', hexToHsl(colors.base.white));
    root.style.setProperty('--foreground', hexToHsl(colors.base.gray[900]));
    root.style.setProperty('--card', hexToHsl(colors.base.white));
    root.style.setProperty('--card-foreground', hexToHsl(colors.base.gray[900]));
    root.style.setProperty('--popover', hexToHsl(colors.base.white));
    root.style.setProperty('--popover-foreground', hexToHsl(colors.base.gray[900]));
    root.style.setProperty('--muted', hexToHsl(colors.base.gray[100]));
    root.style.setProperty('--muted-foreground', hexToHsl(colors.base.gray[500]));
    root.style.setProperty('--accent', hexToHsl(colors.base.gray[100]));
    root.style.setProperty('--accent-foreground', hexToHsl(colors.base.gray[900]));
    root.style.setProperty('--border', hexToHsl(colors.base.gray[200]));
    root.style.setProperty('--input', hexToHsl(colors.base.gray[200]));
    root.style.setProperty('--secondary', hexToHsl(colors.brand.secondary[100]));
    root.style.setProperty('--secondary-foreground', hexToHsl(colors.brand.secondary[900]));
  }

  // Primary colors (always vibrant)
  root.style.setProperty('--primary', hexToHsl(colors.brand.primary[500]));
  root.style.setProperty('--primary-foreground', hexToHsl(colors.base.white));

  // Semantic colors
  root.style.setProperty('--destructive', hexToHsl(colors.semantic.error[500]));
  root.style.setProperty('--destructive-foreground', hexToHsl(colors.base.white));

  // Ring color for focus states
  root.style.setProperty('--ring', hexToHsl(colors.brand.primary[500]));

  // Chart colors
  root.style.setProperty('--chart-1', hexToHsl(colors.brand.primary[500]));
  root.style.setProperty('--chart-2', hexToHsl(colors.brand.secondary[500]));
  root.style.setProperty('--chart-3', hexToHsl(colors.brand.accent[500]));
  root.style.setProperty('--chart-4', hexToHsl(colors.semantic.warning[500]));
  root.style.setProperty('--chart-5', hexToHsl(colors.semantic.success[500]));

  // Update document class for dark mode
  root.classList.toggle('dark', isDark);

};

export const useThemeStore = create<ThemeState>()(
  persist(
    immer((set, get) => {
      const allThemes = getAllThemes();
      const defaultTheme = allThemes['public-light'];

      return {
        currentTheme: defaultTheme,
        availableThemes: allThemes,
        isDarkMode: false,

        setTheme: (themeId: string): void => {
          const theme = get().availableThemes[themeId];
          if (theme) {
            set((state) => {
              state.currentTheme = theme;
              state.isDarkMode = themeId.includes('-dark');
            });
            applyThemeToCSS(theme);
          }
        },

        toggleDarkMode: (): void => {
          const currentTheme = get().currentTheme;
          const isDark = get().isDarkMode;
          const sector = currentTheme.sector;

          const newThemeId = isDark ? `${sector}-light` : `${sector}-dark`;

          get().setTheme(newThemeId);
        },

        applyTheme: (theme: ThemeConfig): void => {
          set((state) => {
            state.currentTheme = theme;
            state.isDarkMode = theme.id.includes('-dark');
          });
          applyThemeToCSS(theme);
        },

        getThemesBySector: (sector: string): ThemeConfig[] => {
          const themes = get().availableThemes;
          return Object.values(themes).filter((theme) => theme.sector === sector);
        },
      };
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        isDarkMode: state.isDarkMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.currentTheme) {
          // Apply theme after a short delay to ensure DOM is ready
          setTimeout(() => {
            applyThemeToCSS(state.currentTheme);
          }, 100);
        }
      },
    },
  ),
);
