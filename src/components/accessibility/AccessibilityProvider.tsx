'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccessibilitySettings {
  // Visual accessibility
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  focusIndicators: boolean;
  
  // Motor accessibility
  stickyKeys: boolean;
  slowKeys: boolean;
  mouseKeys: boolean;
  
  // Cognitive accessibility
  simplifiedUI: boolean;
  readingGuide: boolean;
  autoplay: boolean;
  
  // Screen reader
  screenReaderOptimized: boolean;
  skipLinks: boolean;
  landmarkNavigation: boolean;
}

interface AccessibilityStore extends AccessibilitySettings {
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetToDefaults: () => void;
  applySystemPreferences: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  focusIndicators: true,
  stickyKeys: false,
  slowKeys: false,
  mouseKeys: false,
  simplifiedUI: false,
  readingGuide: false,
  autoplay: false,
  screenReaderOptimized: false,
  skipLinks: true,
  landmarkNavigation: true,
};

export const useAccessibilityStore = create<AccessibilityStore>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      updateSetting: (key, value) => {
        set({ [key]: value });
        applyAccessibilitySettings(get());
      },
      
      resetToDefaults: () => {
        set(defaultSettings);
        applyAccessibilitySettings(defaultSettings);
      },
      
      applySystemPreferences: () => {
        const settings = { ...get() };
        
        // Check for system preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          settings.reducedMotion = true;
        }
        
        if (window.matchMedia('(prefers-contrast: high)').matches) {
          settings.highContrast = true;
        }
        
        set(settings);
        applyAccessibilitySettings(settings);
      },
    }),
    {
      name: 'accessibility-settings',
    }
  )
);

const applyAccessibilitySettings = (settings: AccessibilitySettings): void => {
  const root = document.documentElement;
  
  // High contrast
  root.classList.toggle('high-contrast', settings.highContrast);
  
  // Reduced motion
  root.classList.toggle('reduce-motion', settings.reducedMotion);
  
  // Large text
  root.classList.toggle('large-text', settings.largeText);
  
  // Focus indicators
  root.classList.toggle('enhanced-focus', settings.focusIndicators);
  
  // Simplified UI
  root.classList.toggle('simplified-ui', settings.simplifiedUI);
  
  // Reading guide
  root.classList.toggle('reading-guide', settings.readingGuide);
  
  // Screen reader optimized
  root.classList.toggle('screen-reader-optimized', settings.screenReaderOptimized);
  
  // Update CSS custom properties
  root.style.setProperty('--animation-duration', settings.reducedMotion ? '0ms' : '300ms');
  root.style.setProperty('--font-size-multiplier', settings.largeText ? '1.25' : '1');
  root.style.setProperty('--focus-ring-width', settings.focusIndicators ? '3px' : '2px');
};

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: AccessibilityStore['updateSetting'];
  resetToDefaults: () => void;
  applySystemPreferences: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  readonly children: React.ReactNode;
}

export const AccessibilityProvider = ({ children }: AccessibilityProviderProps): JSX.Element => {
  const store = useAccessibilityStore();

  useEffect(() => {
    // Apply settings on mount
    applyAccessibilitySettings(store);
    
    // Listen for system preference changes
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
    ];
    
    const handleChange = (): void => {
      store.applySystemPreferences();
    };
    
    mediaQueries.forEach(mq => mq.addEventListener('change', handleChange));
    
    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', handleChange));
    };
  }, [store]);

  const contextValue: AccessibilityContextType = {
    settings: store,
    updateSetting: store.updateSetting,
    resetToDefaults: store.resetToDefaults,
    applySystemPreferences: store.applySystemPreferences,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Skip Links Component
export const SkipLinks = (): JSX.Element => {
  const { settings } = useAccessibility();
  
  if (!settings.skipLinks) return <></>;
  
  return (
    <div className="skip-links">
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className="skip-link"
        aria-label="Skip to navigation"
      >
        Skip to navigation
      </a>
      <a 
        href="#footer" 
        className="skip-link"
        aria-label="Skip to footer"
      >
        Skip to footer
      </a>
    </div>
  );
};

// Focus Trap Component
interface FocusTrapProps {
  readonly children: React.ReactNode;
  readonly active: boolean;
}

export const FocusTrap = ({ children, active }: FocusTrapProps): JSX.Element => {
  const trapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !trapRef.current) return;

    const trap = trapRef.current;
    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    trap.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      trap.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);

  return (
    <div ref={trapRef} className={active ? 'focus-trap-active' : ''}>
      {children}
    </div>
  );
};