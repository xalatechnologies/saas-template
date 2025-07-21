'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/localization';
import { useUIStore } from '@/store';
import type { Language } from '@/types';

interface I18nContextType {
  readonly language: Language;
  readonly setLanguage: (language: Language) => void;
  readonly t: (key: string, options?: any) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  readonly children: React.ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps): JSX.Element => {
  const { language, setLanguage } = useUIStore();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && ['no', 'en', 'fr', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      // Default to Norwegian
      setLanguage('no');
      i18n.changeLanguage('no');
    }
  }, [setLanguage]);

  useEffect(() => {
    i18n.changeLanguage(language);
    
    // Update document direction for RTL languages
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const contextValue: I18nContextType = {
    language,
    setLanguage,
    t: (key: string, options?: any) => i18n.t(key, options) as string,
  };

  return (
    <I18nextProvider i18n={i18n}>
      <I18nContext.Provider value={contextValue}>
        {children}
      </I18nContext.Provider>
    </I18nextProvider>
  );
};