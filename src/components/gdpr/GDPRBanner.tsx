'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Cookie, Settings, X, Check, AlertTriangle } from 'lucide-react';
import { Button, Card, CardContent, Switch, Separator } from '../ui';
import { FlexLayout } from '../layout';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CookieConsent {
  readonly necessary: boolean;
  readonly functional: boolean;
  readonly analytics: boolean;
  readonly marketing: boolean;
  readonly timestamp: number;
  readonly version: string;
}

interface GDPRStore {
  readonly consent: CookieConsent | null;
  readonly bannerDismissed: boolean;
  readonly showPreferences: boolean;

  // Actions
  readonly setConsent: (consent: Partial<CookieConsent>) => void;
  readonly dismissBanner: () => void;
  readonly showPreferencesModal: () => void;
  readonly hidePreferencesModal: () => void;
  readonly acceptAll: () => void;
  readonly rejectAll: () => void;
  readonly resetConsent: () => void;
}

const CONSENT_VERSION = '1.0';

export const useGDPRStore = create<GDPRStore>()(
  persist(
    (set, get) => ({
      consent: null,
      bannerDismissed: false,
      showPreferences: false,

      setConsent: (newConsent) => {
        const current = get().consent || {
          necessary: true,
          functional: false,
          analytics: false,
          marketing: false,
          timestamp: Date.now(),
          version: CONSENT_VERSION,
        };

        set({
          consent: {
            ...current,
            ...newConsent,
            timestamp: Date.now(),
            version: CONSENT_VERSION,
          },
          bannerDismissed: true,
          showPreferences: false,
        });
      },

      dismissBanner: () => set({ bannerDismissed: true }),
      showPreferencesModal: () => set({ showPreferences: true }),
      hidePreferencesModal: () => set({ showPreferences: false }),

      acceptAll: () => {
        get().setConsent({
          necessary: true,
          functional: true,
          analytics: true,
          marketing: true,
        });
      },

      rejectAll: () => {
        get().setConsent({
          necessary: true,
          functional: false,
          analytics: false,
          marketing: false,
        });
      },

      resetConsent: () => {
        set({
          consent: null,
          bannerDismissed: false,
          showPreferences: false,
        });
      },
    }),
    {
      name: 'gdpr-consent',
      version: 1,
    },
  ),
);

export const GDPRBanner = (): React.ReactElement => {
  const { consent, bannerDismissed, showPreferences, acceptAll, rejectAll, showPreferencesModal } =
    useGDPRStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || bannerDismissed || consent) {
    return <></>;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-8 bg-background/95 backdrop-blur-sm border-t border-border">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <FlexLayout direction="row" align="start" gap="lg">
              <div className="flex-shrink-0">
                <Cookie className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Vi respekterer ditt personvern
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Vi bruker informasjonskapsler og lignende teknologier for å forbedre din
                    opplevelse, analysere nettstedstrafikk og for markedsføringsformål. Du kan velge
                    hvilke kategorier du vil tillate. Nødvendige informasjonskapsler kan ikke
                    deaktiveres da de er essensielle for nettstedets funksjonalitet.
                  </p>
                </div>

                <FlexLayout direction="row" wrap gap="md">
                  <Button onClick={acceptAll} className="bg-primary text-primary-foreground">
                    <Check className="h-4 w-4 mr-2" />
                    Godta alle
                  </Button>
                  <Button onClick={rejectAll} variant="outline">
                    Kun nødvendige
                  </Button>
                  <Button onClick={showPreferencesModal} variant="ghost">
                    <Settings className="h-4 w-4 mr-2" />
                    Tilpass innstillinger
                  </Button>
                </FlexLayout>
              </div>
            </FlexLayout>
          </CardContent>
        </Card>
      </div>

      {showPreferences && <GDPRPreferences />}
    </>
  );
};

const GDPRPreferences = (): React.ReactElement => {
  const { consent, setConsent, hidePreferencesModal } = useGDPRStore();
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: consent?.functional || false,
    analytics: consent?.analytics || false,
    marketing: consent?.marketing || false,
  });

  const handleSave = (): void => {
    setConsent(preferences);
  };

  const cookieCategories = [
    {
      key: 'necessary' as const,
      title: 'Nødvendige informasjonskapsler',
      description:
        'Disse informasjonskapslene er essensielle for at nettstedet skal fungere og kan ikke deaktiveres.',
      required: true,
      examples: 'Autentisering, sikkerhet, språkinnstillinger',
    },
    {
      key: 'functional' as const,
      title: 'Funksjonelle informasjonskapsler',
      description:
        'Disse informasjonskapslene gjør det mulig for nettstedet å gi forbedret funksjonalitet og personalisering.',
      required: false,
      examples: 'Brukerinnstillinger, tema, tilgjengelighetsinnstillinger',
    },
    {
      key: 'analytics' as const,
      title: 'Analytiske informasjonskapsler',
      description:
        'Disse informasjonskapslene hjelper oss å forstå hvordan besøkende samhandler med nettstedet.',
      required: false,
      examples: 'Google Analytics, bruksstatistikk, ytelsesmålinger',
    },
    {
      key: 'marketing' as const,
      title: 'Markedsførings informasjonskapsler',
      description:
        'Disse informasjonskapslene brukes til å levere annonser som er mer relevante for deg.',
      required: false,
      examples: 'Målrettede annonser, sosiale medier, konverteringssporing',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Personverninnstillinger</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={hidePreferencesModal} aria-label="Lukk">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              <p className="mb-4">
                Vi respekterer ditt personvern og gir deg full kontroll over hvilke
                informasjonskapsler som brukes på vårt nettsted. Du kan når som helst endre disse
                innstillingene.
              </p>
              <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg border border-primary">
                <AlertTriangle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-primary-foreground text-xs">
                  <strong>GDPR-kompatibel:</strong> Denne løsningen følger EU&apos;s
                  personvernforordning og gir deg full kontroll over dine data.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {cookieCategories.map((category, index) => (
                <div key={category.key}>
                  <div className="flex items-start justify-between gap-4 p-4 border border-border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{category.title}</h3>
                        {category.required && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Påkrevd
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Eksempler:</strong> {category.examples}
                      </p>
                    </div>
                    <Switch
                      checked={preferences[category.key]}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, [category.key]: checked }))
                      }
                      disabled={category.required}
                      aria-label={`Toggle ${category.title}`}
                    />
                  </div>
                  {index < cookieCategories.length - 1 && <Separator />}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={hidePreferencesModal}>
                Avbryt
              </Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                <Check className="h-4 w-4 mr-2" />
                Lagre innstillinger
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// GDPR Data Request Component
export const GDPRDataRequest = (): React.ReactElement => {
  const [requestType, setRequestType] = useState<'access' | 'delete' | 'portability' | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    // Here you would typically send the request to your backend
    // Here you would typically send the request to your backend
    // Example: await submitGDPRRequest({ type: requestType, email });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Check className="h-12 w-12 text-success mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Forespørsel sendt</h3>
          <p className="text-sm text-muted-foreground">
            Vi har mottatt din forespørsel og vil behandle den innen 30 dager som påkrevd av GDPR.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">GDPR-forespørsel</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Type forespørsel</label>
            <div className="space-y-2">
              {[
                {
                  value: 'access',
                  label: 'Tilgang til mine data',
                  desc: 'Se hvilke personopplysninger vi har om deg',
                },
                {
                  value: 'delete',
                  label: 'Slett mine data',
                  desc: 'Be om sletting av dine personopplysninger',
                },
                {
                  value: 'portability',
                  label: 'Dataportabilitet',
                  desc: 'Få dine data i et maskinlesbart format',
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent"
                >
                  <input
                    type="radio"
                    name="requestType"
                    value={option.value}
                    checked={requestType === option.value}
                    onChange={(e) => setRequestType(e.target.value as 'access' | 'delete' | 'portability')}
                    className="mt-1"
                    required
                  />
                  <div>
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium mb-2 block">
              E-postadresse
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md"
              placeholder="din@epost.no"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Send forespørsel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
