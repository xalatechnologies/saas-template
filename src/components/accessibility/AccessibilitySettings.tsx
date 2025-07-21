'use client';

import React from 'react';
import { Eye, MousePointer, Brain, Volume2, Monitor, Zap, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Switch, Button, Separator, Badge, PageSection, ContentGrid } from '@/components';
import { useAccessibility } from './AccessibilityProvider';

export const AccessibilitySettings = (): React.ReactElement => {
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


  return (
    <PageSection variant="transparent">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <Monitor aria-hidden="true" />
              Tilgjengelighetsinnstillinger
            </span>
          </CardTitle>
          <p>
            Tilpass applikasjonen for dine tilgjengelighetsbehov. Alle innstillinger følger WCAG
            2.2-retningslinjene for universell utforming.
          </p>
        </CardHeader>
        <CardContent>
          <PageSection variant="transparent" className="flex flex-wrap gap-3">
            <Button
              onClick={applySystemPreferences}
              variant="outline"
            >
              <Zap aria-hidden="true" />
              Bruk systeminnstillinger
            </Button>
            <Button onClick={resetToDefaults} variant="outline">
              <RefreshCw aria-hidden="true" />
              Tilbakestill til standardinnstillinger
            </Button>
          </PageSection>

          <PageSection variant="card">
            <PageSection variant="transparent" className="flex items-start gap-2">
              <Monitor aria-hidden="true" />
              <PageSection variant="transparent">
                <p>
                  Systeminnstillinger oppdaget
                </p>
                <p>
                  Vi har oppdaget tilgjengelighetsinnstillinger i nettleseren eller operativsystemet
                  ditt. Du kan velge å bruke disse automatisk ved å klikke på "Bruk
                  systeminnstillinger".
                </p>
              </PageSection>
            </PageSection>
          </PageSection>
        </CardContent>
      </Card>

      {/* Settings Categories */}
      {settingGroups.map((group, groupIndex) => {
        const Icon = group.icon;
        return (
          <Card key={groupIndex}>
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <Icon aria-hidden="true" />
                  {group.title}
                </span>
              </CardTitle>
              <p>{group.description}</p>
            </CardHeader>
            <CardContent>
              {group.settings.map((setting, index) => (
                <div key={setting.key}>
                  <PageSection variant="transparent" className="flex items-start justify-between gap-4">
                    <PageSection variant="transparent" className="flex-1">
                      <PageSection variant="transparent" className="flex items-center gap-2">
                        <label
                          htmlFor={`setting-${setting.key}`}
                        >
                          {setting.label}
                        </label>
                        
                        {setting.wcagLevel && (
                          <Badge
                            variant="outline"
                          >
                            WCAG {setting.wcagLevel}
                          </Badge>
                        )}
                      </PageSection>
                      <p>{setting.description}</p>
                    </PageSection>
                    <Switch
                      id={setting.key}
                      checked={settings[setting.key]}
                      onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                      aria-describedby={`${setting.key}-description`}
                    />
                  </PageSection>
                  {index < group.settings.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Active Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Aktive innstillinger</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentGrid columns={4} gap="md">
            {Object.entries(settings).map(([key, value]) => (
              <PageSection
                key={key}
                variant="transparent"
                className={`p-3 rounded-lg border ${
                  value ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <PageSection variant="transparent" className="flex justify-between items-start">
                  <span>
                    {key}
                  </span>
                  <Badge
                    variant={value ? 'default' : 'outline'}
                  >
                    {value ? 'På' : 'Av'}
                  </Badge>
                </PageSection>
              </PageSection>
            ))}
          </ContentGrid>
        </CardContent>
      </Card>
    </PageSection>
  );
};
