'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useUI } from '@/hooks';
import type { Language } from '@/types';
import { cn } from '@/utils';

interface LanguageSelectorProps {
  readonly className?: string;
  readonly variant?: 'default' | 'ghost' | 'outline';
}

interface LanguageOption {
  readonly code: Language;
  readonly label: string;
  readonly flag: string;
}

/**
 * Language selector dropdown component
 * @returns JSX.Element
 */
export const LanguageSelector = ({ 
  className,
  variant = 'outline' 
}: LanguageSelectorProps): JSX.Element => {
  const { language, setLanguage, t } = useUI();

  const languages: LanguageOption[] = [
    { code: 'en', label: t('settings.english'), flag: '🇬🇧' },
    { code: 'no', label: t('settings.norwegian'), flag: '🇳🇴' },
    { code: 'fr', label: t('settings.french'), flag: '🇫🇷' },
    { code: 'ar', label: t('settings.arabic'), flag: '🇸🇦' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant}
          size="icon"
          className={cn('rounded-xl', className)}
          aria-label="Select language"
        >
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              'cursor-pointer',
              language === lang.code && 'bg-accent'
            )}
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};