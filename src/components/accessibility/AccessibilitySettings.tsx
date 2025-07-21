'use client';

import React from 'react';
import { Eye, MousePointer, Keyboard, Brain, Volume2, Monitor, Zap, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Switch, Button, Separator, Badge } from '../ui';
import { useAccessibility } from './AccessibilityProvider';

export const AccessibilitySettings = (): JSX.Element => {
  const { settings, updateSetting, resetToDefaults, applySystemPreferences } = useAccessibility();

  const settingGroups = [
    {
      title: 'Visuell tilgjengelighet',
      icon: Eye,
      description: 'Innstillinger for synshemmede og personer med synsvansker',
      settings: [
        {
          key: 'highContrast' as const,
          label: 'Høy kontrast',
          description: 'Øker kontrasten mellom tekst og bakgrunn for bedre lesbarhet',
          wcagLevel: 'AAA',
        },
        {
          key: 'largeText' as const,
          label: 'Stor tekst',
          description: 'Øker tekststørrelsen med 25% for bedre lesbarhet',
          wcagLevel: 'AA',
        },
        {
          key: 'focusIndicators' as const,
          label: 'Forbedrede fokusindikatorer',
          description: 'Tydeligere visuelle indikatorer når elementer har fokus',
          wcagLevel: 'AA',
        },
        {
          key: 'reducedMotion' as const,
          label: 'Redusert bevegelse',
          description: 'Minimerer animasjoner og overganger som kan forårsake ubehag',
          wcagLevel: 'AAA',
        },
      ],
    },
    {
      title: 'Motorisk tilgjengelighet',
      icon: MousePointer,
      description: 'Innstillinger for personer med motoriske utfordringer',
      settings: [
        {
          key: 'stickyKeys' as const,
          label: 'Sticky Keys',
          description: 'Lar deg bruke tastaturkombinasjoner uten å holde flere taster samtidig',
          wcagLevel: 'AA',
        },
        {
          key: 'slowKeys' as const,
          label: 'Slow Keys',
          description: 'Krever at taster holdes nede lenger før de registreres',
          wcagLevel: 'AA',
        },
        {
          key: 'mouseKeys' as const,
          label: 'Mouse Keys',
          description: 'Lar deg kontrollere musepekeren med numeriske taster',
          wcagLevel: 'AA',
        },
      ],
    },
    {
      title: 'Kognitiv tilgjengelighet',
      icon: Brain,
      description: 'Innstillinger for personer med kognitive utfordringer',
      settings: [
        {
          key: 'simplifiedUI' as const,
          label: 'Forenklet grensesnitt',
          description: 'Reduserer kompleksiteten i brukergrensesnittet',
          wcagLevel: 'AAA',
        },
        {
          key: 'readingGuide' as const,
          label: 'Leseguide',
          description: 'Fremhever gjeldende linje for å hjelpe med lesing',
          wcagLevel: 'AAA',
        },
        {
          key: 'autoplay' as const,
          label: 'Deaktiver autoavspilling',
          description: 'Forhindrer automatisk avspilling av video og lyd',
          wcagLevel: 'AA',
        },
      ],
    },
    {
      title: 'Skjermleser-optimalisering',
      icon: Volume2,
      description: 'Innstillinger for skjermleserbrukere',
      settings: [
        {
          key: 'screenReaderOptimized' as const,
          label: 'Skjermleser-optimalisert',
          description: 'Optimaliserer grensesnittet for skjermlesere',
          wcagLevel: 'AA',
        },
        {
          key: 'skipLinks' as const,
          label: 'Hopp over-lenker',
          description: 'Viser lenker for å hoppe til hovedinnhold',
          wcagLevel: 'AA',
        },
        {
          key: 'landmarkNavigation' as const,
          label: 'Landmark-navigasjon',
          description: 'Forbedrer navigasjon med ARIA-landmarks',
          wcagLevel: 'AA',
        },
      ],
    },
  ];

  const getWCAGBadgeColor = (level: string): string => {
    switch (level) {
      case 'AAA':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'AA':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Tilgjengelighetsinnstillinger
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tilpass applikasjonen for dine tilgjengelighetsbehov. Alle innstillinger følger WCAG
            2.2-retningslinjene for universell utforming.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={applySystemPreferences}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Bruk systeminnstillinger
            </Button>
            <Button onClick={resetToDefaults} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Tilbakestill til standard
            </Button>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  WCAG 2.2 AAA-kompatibel
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  Denne applikasjonen følger de høyeste standardene for universell utforming og
                  tilgjengelighet, inkludert WCAG 2.2 AAA-retningslinjer.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Groups */}
      {settingGroups.map((group) => {
        const Icon = group.icon;

        return (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                {group.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.settings.map((setting, index) => (
                <div key={setting.key}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor={setting.key}
                          className="font-medium text-foreground cursor-pointer"
                        >
                          {setting.label}
                        </label>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getWCAGBadgeColor(setting.wcagLevel)}`}
                        >
                          WCAG {setting.wcagLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch
                      id={setting.key}
                      checked={settings[setting.key]}
                      onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                      aria-describedby={`${setting.key}-description`}
                    />
                  </div>
                  {index < group.settings.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Gjeldende tilgjengelighetsstatus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(settings).map(([key, value]) => (
              <div
                key={key}
                className={`p-3 rounded-lg border ${
                  value
                    ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800'
                }`}
              >
                <div
                  className={`text-xs font-medium ${
                    value
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {key.replace(/([A-Z])/g, ' \$1').replace(/^./, (str) => str.toUpperCase())}
                </div>
                <div
                  className={`text-xs ${
                    value
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-500'
                  }`}
                >
                  {value ? 'Aktivert' : 'Deaktivert'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
