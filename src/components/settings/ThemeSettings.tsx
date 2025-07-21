'use client';

import React from 'react';
import { Sun, Moon, Palette, Monitor } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Badge,
  Separator
} from '../ui';
import { useThemeStore } from '@/design-tokens';
import { sectorThemes } from '@/design-tokens';
import { useUI } from '@/hooks';

/**
 * Theme settings component for customizing application appearance
 * @returns JSX.Element
 */
export const ThemeSettings = (): JSX.Element => {
  const { t } = useUI();
  const { 
    currentTheme, 
    isDarkMode, 
    setTheme, 
    toggleDarkMode, 
    getThemesBySector 
  } = useThemeStore();

  /**
   * Handles sector theme change
   * @param sector - The sector to switch to
   */
  const handleSectorChange = (sector: string): void => {
    const themeId = isDarkMode ? `${sector}-dark` : `${sector}-light`;
    setTheme(themeId);
  };

  /**
   * Gets sector display name
   * @param sector - The sector key
   * @returns Display name
   */
  const getSectorDisplayName = (sector: string): string => {
    const names: Record<string, string> = {
      public: 'Public Sector',
      health: 'Health & Wellness',
      education: 'Education',
      medical: 'Medical',
      productivity: 'Productivity',
      enterprise: 'Enterprise',
    };
    return names[sector] || sector;
  };

  /**
   * Gets sector description
   * @param sector - The sector key
   * @returns Description
   */
  const getSectorDescription = (sector: string): string => {
    const descriptions: Record<string, string> = {
      public: 'Professional blue theme for government applications',
      health: 'Calming teal and green for health applications',
      education: 'Inspiring purple and orange for learning platforms',
      medical: 'Clean blue and white for medical systems',
      productivity: 'Energizing green for productivity tools',
      enterprise: 'Professional navy and gold for business applications',
    };
    return descriptions[sector] || '';
  };

  /**
   * Gets primary color for sector preview
   * @param sector - The sector key
   * @returns Primary color hex
   */
  const getSectorPrimaryColor = (sector: string): string => {
    const sectorTheme = sectorThemes[sector];
    return sectorTheme?.light.tokens.colors.brand.primary[500] || '#3b82f6';
  };

  const sectors = Object.keys(sectorThemes);

  return (
    <div className="space-y-8">
      {/* Current Theme Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Current Theme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{currentTheme.name}</h3>
              <p className="text-sm text-muted-foreground">{currentTheme.description}</p>
            </div>
            <Badge variant="outline" className="capitalize">
              {currentTheme.sector}
            </Badge>
          </div>
          
          {/* Color Preview */}
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: currentTheme.tokens.colors.brand.primary[500] }}
            />
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: currentTheme.tokens.colors.brand.secondary[500] }}
            />
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: currentTheme.tokens.colors.brand.accent[500] }}
            />
            <span className="text-sm text-muted-foreground ml-2">Brand Colors</span>
          </div>
        </CardContent>
      </Card>

      {/* Theme Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={!isDarkMode ? 'default' : 'outline'}
              onClick={() => !isDarkMode || toggleDarkMode()}
              className="flex items-center justify-center space-x-2 h-16"
            >
              <Sun className="h-5 w-5" />
              <span>Light Mode</span>
            </Button>
            <Button
              variant={isDarkMode ? 'default' : 'outline'}
              onClick={() => isDarkMode || toggleDarkMode()}
              className="flex items-center justify-center space-x-2 h-16"
            >
              <Moon className="h-5 w-5" />
              <span>Dark Mode</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sector Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Themes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose a theme designed for your industry or use case. Click any theme to apply it instantly.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {sectors.map((sector) => {
              const isActive = currentTheme.sector === sector;
              const primaryColor = getSectorPrimaryColor(sector);
              
              return (
                <div
                  key={sector}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    isActive 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleSectorChange(sector)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <div>
                        <h3 className="font-semibold">{getSectorDisplayName(sector)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getSectorDescription(sector)}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <Badge variant="default">Active</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};