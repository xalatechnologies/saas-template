'use client';

import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Palette, 
  User, 
  X, 
  ChevronRight,
  Moon,
  Sun,
  Globe,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Accessibility,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button, Switch, Badge, Separator } from '../ui';
import { cn } from '@/utils';
import { useUI, useAuth } from '@/hooks';
import { useAccessibility } from '../accessibility/AccessibilityProvider';
import { useThemeStore, sectorThemes } from '@/design-tokens';
import type { Language } from '@/types';

interface DevModeProps {
  readonly className?: string;
}

interface CollapsibleSectionProps {
  readonly title: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly children: React.ReactNode;
  readonly defaultOpen?: boolean;
}

const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = true }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-3 border rounded-xl p-4 bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2 text-sm font-medium">
          <Icon className="h-4 w-4" />
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="space-y-3 pt-3 border-t">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Development mode panel with comprehensive settings
 * Only visible in development environment
 * @returns JSX.Element | null
 */
export const DevMode = ({ className }: DevModeProps): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { language, setLanguage } = useUI();
  const { setUser } = useAuth();
  const { currentTheme, isDarkMode, setTheme, toggleDarkMode } = useThemeStore();
  const { settings: accessibilitySettings, updateSetting, resetToDefaults } = useAccessibility();

  // Only show in development mode
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    setIsVisible(isDev);

    // Load dev mode state from localStorage
    if (isDev && typeof window !== 'undefined') {
      const savedState = localStorage.getItem('devModeOpen');
      if (savedState !== null) {
        setIsOpen(savedState === 'true');
      } else {
        // Default to open in development
        setIsOpen(true);
      }
    }
  }, []);

  // Save dev mode state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devModeOpen', String(isOpen));
    }
  }, [isOpen]);

  // Keyboard shortcut to toggle dev mode (Ctrl/Cmd + Shift + D)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) return null;

  const languages: { value: Language; label: string; flag: string }[] = [
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'no', label: 'Norwegian', flag: '🇳🇴' },
    { value: 'fr', label: 'French', flag: '🇫🇷' },
    { value: 'ar', label: 'Arabic', flag: '🇸🇦' },
  ];

  const testUsers = [
    { id: '1', name: 'John Admin', email: 'admin@example.com', role: 'admin' },
    { id: '2', name: 'Jane User', email: 'user@example.com', role: 'user' },
    { id: '3', name: 'Test Manager', email: 'manager@example.com', role: 'manager' },
  ];

  const sectors = Object.keys(sectorThemes);

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

  const getSectorPrimaryColor = (sector: string): string => {
    const sectorTheme = sectorThemes[sector];
    return sectorTheme?.light.tokens.colors.brand.primary[500] || '#000';
  };

  const handleSectorChange = (sector: string): void => {
    const themeId = isDarkMode ? `${sector}-dark` : `${sector}-light`;
    setTheme(themeId);
  };

  const bypassLogin = (user: typeof testUsers[0]) => {
    setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      preferences: {
        theme: 'system',
        language: 'en',
        emailNotifications: true,
        pushNotifications: false,
      },
    });
  };

  const accessibilityOptions = [
    { key: 'highContrast', label: 'High Contrast', description: 'Increase contrast for better readability' },
    { key: 'largeText', label: 'Large Text', description: 'Increase text size by 25%' },
    { key: 'reducedMotion', label: 'Reduced Motion', description: 'Minimize animations and transitions' },
    { key: 'focusIndicators', label: 'Focus Indicators', description: 'Enhanced focus indicators' },
    { key: 'screenReaderOptimized', label: 'Screen Reader', description: 'Optimize for screen readers' },
  ];

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-4 right-4 z-50 rounded-xl shadow-xl',
          'bg-background/80 backdrop-blur-sm border-primary/20',
          'hover:border-primary/40 transition-all duration-200',
          isOpen && 'opacity-0 pointer-events-none',
          className
        )}
        aria-label="Toggle development mode"
      >
        <Code2 className="h-5 w-5 text-primary" />
      </Button>

      {/* Dev Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-96 bg-background border-l border-border',
          'shadow-2xl z-50 transition-transform duration-300 ease-in-out',
          'overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Dev Mode</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="rounded-xl"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Theme Section */}
          <CollapsibleSection title="Theme & Appearance" icon={Palette}>
            {/* Light/Dark Mode */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Mode</div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={!isDarkMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => !isDarkMode || toggleDarkMode()}
                  className="rounded-xl"
                >
                  <Sun className="h-4 w-4 mr-1" />
                  Light
                </Button>
                <Button
                  variant={isDarkMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => isDarkMode || toggleDarkMode()}
                  className="rounded-xl"
                >
                  <Moon className="h-4 w-4 mr-1" />
                  Dark
                </Button>
              </div>
            </div>

            <Separator />

            {/* Sector Themes */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Sector Theme</div>
              <div className="space-y-2">
                {sectors.map((sector) => {
                  const isActive = currentTheme.sector === sector;
                  const primaryColor = getSectorPrimaryColor(sector);
                  
                  return (
                    <button
                      key={sector}
                      onClick={() => handleSectorChange(sector)}
                      className={cn(
                        'w-full p-3 rounded-xl border-2 transition-all',
                        'flex items-center space-x-3 text-left',
                        isActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-border/80'
                      )}
                    >
                      <div
                        className="h-8 w-8 rounded-lg border-2"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{getSectorDisplayName(sector)}</div>
                        {isActive && (
                          <Badge variant="default" className="mt-1 text-xs">Active</Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </CollapsibleSection>

          {/* Language Section */}
          <CollapsibleSection title="Language" icon={Globe}>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.value}
                  variant={language === lang.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage(lang.value)}
                  className="rounded-xl"
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.label}
                </Button>
              ))}
            </div>
          </CollapsibleSection>

          {/* Accessibility Section */}
          <CollapsibleSection title="Accessibility" icon={Accessibility}>
            <div className="space-y-3">
              {accessibilityOptions.map((option) => (
                <div key={option.key} className="flex items-start justify-between space-x-3">
                  <div>
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                  <Switch
                    checked={accessibilitySettings[option.key as keyof typeof accessibilitySettings] || false}
                    onCheckedChange={(checked) => updateSetting(option.key as any, checked)}
                    className="mt-1"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                className="w-full rounded-xl"
              >
                Reset to Defaults
              </Button>
            </div>
          </CollapsibleSection>

          {/* Quick Login Section */}
          <CollapsibleSection title="Quick Login" icon={KeyRound}>
            <div className="space-y-2">
              {testUsers.map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  size="sm"
                  onClick={() => bypassLogin(user)}
                  className="rounded-xl w-full justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.role}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CollapsibleSection>

          {/* Debug Info */}
          <CollapsibleSection title="Debug Info" icon={Eye} defaultOpen={false}>
            <div className="rounded-xl bg-muted p-3 text-xs font-mono space-y-1">
              <div>Theme: {currentTheme.name}</div>
              <div>Sector: {currentTheme.sector}</div>
              <div>Mode: {isDarkMode ? 'Dark' : 'Light'}</div>
              <div>Language: {language}</div>
              <div>Env: {process.env.NODE_ENV}</div>
              <div className="pt-2 border-t mt-2">
                <div className="font-semibold mb-1">Accessibility:</div>
                {Object.entries(accessibilitySettings).map(([key, value]) => (
                  <div key={key}>
                    {key}: {value ? 'On' : 'Off'}
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Keyboard Shortcut */}
          <div className="text-xs text-muted-foreground text-center pt-2">
            Press <kbd className="px-2 py-1 bg-muted rounded">Ctrl+Shift+D</kbd> to toggle
          </div>
        </div>
      </div>
    </>
  );
};