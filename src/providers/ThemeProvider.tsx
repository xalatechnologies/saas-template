'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useThemeStore } from '@/design-tokens';
import type { ThemeConfig } from '@/design-tokens';

interface ThemeContextType {
  readonly currentTheme: ThemeConfig;
  readonly isDarkMode: boolean;
  readonly setTheme: (themeId: string) => void;
  readonly toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  readonly children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps): React.ReactElement => {
  const { currentTheme, isDarkMode, setTheme, toggleDarkMode } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount to avoid hydration mismatch
  }, [currentTheme, isDarkMode]);

  const contextValue: ThemeContextType = {
    currentTheme,
    isDarkMode,
    setTheme,
    toggleDarkMode,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
