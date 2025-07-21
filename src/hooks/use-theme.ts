import { useThemeStore } from '@/design-tokens';
import type { ThemeConfig } from '@/design-tokens/types';

export const useTheme = () => {
  const {
    currentTheme,
    availableThemes,
    isDarkMode,
    setTheme,
    toggleDarkMode,
    applyTheme,
    getThemesBySector,
  } = useThemeStore();

  return {
    // Current state
    currentTheme,
    availableThemes,
    isDarkMode,
    
    // Actions
    setTheme,
    toggleDarkMode,
    applyTheme,
    getThemesBySector,
    
    // Computed values
    currentSector: currentTheme.sector,
    themeName: currentTheme.name,
    themeDescription: currentTheme.description,
    
    // Helper functions
    isThemeActive: (themeId: string): boolean => currentTheme.id === themeId,
    getSectorThemes: (sector: string): ThemeConfig[] => getThemesBySector(sector),
  };
};