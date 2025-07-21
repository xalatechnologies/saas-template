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
  Separator,
  PageSection,
  ContentGrid,
} from '@/components';
import { useThemeStore } from '@/design-tokens';
import { sectorThemes } from '@/design-tokens';
import { useUI } from '@/hooks';

/**
 * Theme settings component for customizing application appearance
 * @returns JSX.Element
 */
export const ThemeSettings = (): JSX.Element => {
  const { t } = useUI();
  const { currentTheme, isDarkMode, setTheme, toggleDarkMode, getThemesBySector } = useThemeStore();

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
    <PageSection variant="transparent">
      {/* Current Theme Info */}
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <Palette aria-hidden="true" />
              Current Theme
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PageSection variant="transparent" className="flex items-center justify-between">
            <PageSection variant="transparent">
              <h3>{currentTheme.name}</h3>
              <p>{currentTheme.description}</p>
            </PageSection>
            <Badge variant="outline">{currentTheme.sector}</Badge>
          </PageSection>

          {/* Color Preview */}
          <PageSection variant="transparent" className="flex items-center gap-2">
            <span
              className="inline-block w-8 h-8 rounded-full border-2"
              style={{ backgroundColor: currentTheme.tokens.colors.brand.primary[500] }}
              role="img"
              aria-label="Primary brand color"
            />
            <span
              className="inline-block w-8 h-8 rounded-full border-2"
              style={{ backgroundColor: currentTheme.tokens.colors.brand.secondary[500] }}
              role="img"
              aria-label="Secondary brand color"
            />
            <span
              className="inline-block w-8 h-8 rounded-full border-2"
              style={{ backgroundColor: currentTheme.tokens.colors.brand.accent[500] }}
              role="img"
              aria-label="Accent brand color"
            />
            <span>Brand Colors</span>
          </PageSection>
        </CardContent>
      </Card>

      {/* Theme Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ContentGrid columns={2} gap="md">
            <Button
              variant={!isDarkMode ? 'default' : 'outline'}
              onClick={() => !isDarkMode || toggleDarkMode()}
            >
              <Sun aria-hidden="true" />
              <span>Light Mode</span>
            </Button>
            <Button
              variant={isDarkMode ? 'default' : 'outline'}
              onClick={() => isDarkMode || toggleDarkMode()}
            >
              <Moon aria-hidden="true" />
              <span>Dark Mode</span>
            </Button>
          </ContentGrid>
        </CardContent>
      </Card>

      {/* Sector Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Themes</CardTitle>
          <p>
            Choose a theme designed for your industry or use case. Click any theme to apply it
            instantly.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <ContentGrid columns={1} gap="md">
            {sectors.map((sector) => {
              const isActive = currentTheme.sector === sector;
              const primaryColor = getSectorPrimaryColor(sector);

              return (
                <Card
                  key={sector}
                  className={`p-4 rounded-lg border-2 cursor-pointer ${
                    isActive ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => handleSectorChange(sector)}
                >
                  <PageSection variant="transparent" className="flex items-center justify-between">
                    <PageSection variant="transparent" className="flex items-center gap-3">
                      <span
                        className="inline-block w-10 h-10 rounded-full border-2"
                        style={{ backgroundColor: primaryColor }}
                        role="img"
                        aria-label={`${sector} theme color`}
                      />
                      <PageSection variant="transparent">
                        <h3>{getSectorDisplayName(sector)}</h3>
                        <p>{getSectorDescription(sector)}</p>
                      </PageSection>
                    </PageSection>
                    {isActive && <Badge variant="default">Active</Badge>}
                  </PageSection>
                </Card>
              );
            })}
          </ContentGrid>
        </CardContent>
      </Card>
    </PageSection>
  );
};
