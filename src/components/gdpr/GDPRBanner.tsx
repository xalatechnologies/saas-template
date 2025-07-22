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
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border" style={{ padding: 'var(--spacing-lg)' }}>
        <Card className="max-w-4xl mx-auto">
          <CardContent style={{ padding: 'var(--spacing-lg)' }}>
            <FlexLayout direction="row" align="start" gap="lg">
              <div className="flex-shrink-0">
                <Cookie className="text-primary" style={{ height: 'var(--icon-md)', width: 'var(--icon-md)' }} />
              </div>

              <div className="flex-1">
                <FlexLayout direction="column" gap="lg">
                <div>
                  <h3 className="text-lg font-semibold text-foreground" style={{ marginBottom: 'var(--spacing-xs)' }}>
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
                    <Check style={{ height: 'var(--icon-xs)', width: 'var(--icon-xs)', marginRight: 'var(--spacing-xs)' }} />
                    Godta alle
                  </Button>
                  <Button onClick={rejectAll} variant="outline">
                    Kun nødvendige
                  </Button>
                  <Button onClick={showPreferencesModal} variant="ghost">
                    <Settings style={{ height: 'var(--icon-xs)', width: 'var(--icon-xs)', marginRight: 'var(--spacing-xs)' }} />
                    Tilpass innstillinger
                  </Button>
                </FlexLayout>
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
    <FlexLayout align="center" justify="center" className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" style={{ padding: 'var(--spacing-sm)' }}>
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent style={{ padding: 'var(--spacing-lg)' }}>
          <FlexLayout direction="row" align="center" justify="between" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <FlexLayout direction="row" align="center" gap="sm">
              <Shield className="text-primary" style={{ height: 'var(--icon-md)', width: 'var(--icon-md)' }} />
              <h2 className="text-xl font-semibold text-foreground">Personverninnstillinger</h2>
            </FlexLayout>
            <Button variant="ghost" size="icon" onClick={hidePreferencesModal} aria-label="Lukk">
              <X style={{ height: 'var(--icon-xs)', width: 'var(--icon-xs)' }} />
            </Button>
          </FlexLayout>

          <FlexLayout direction="column" gap="lg">
            <div className="text-sm text-muted-foreground">
              <p style={{ marginBottom: 'var(--spacing-sm)' }}>
                Vi respekterer ditt personvern og gir deg full kontroll over hvilke
                informasjonskapsler som brukes på vårt nettsted. Du kan når som helst endre disse
                innstillingene.
              </p>
              <FlexLayout direction="row" align="start" gap="xs" className="bg-primary/10 rounded-2xl border border-primary" style={{ padding: 'var(--spacing-sm)' }}>
                <AlertTriangle className="text-primary flex-shrink-0" style={{ height: 'var(--icon-xs)', width: 'var(--icon-xs)', marginTop: '2px' }} />
                <p className="text-primary-foreground text-xs">
                  <strong>GDPR-kompatibel:</strong> Denne løsningen følger EU&apos;s
                  personvernforordning og gir deg full kontroll over dine data.
                </p>
              </FlexLayout>
            </div>

            <FlexLayout direction="column" gap="sm">
              {cookieCategories.map((category, index) => (
                <div key={category.key}>
                  <FlexLayout direction="row" align="start" justify="between" gap="sm" className="border border-border rounded-2xl" style={{ padding: 'var(--spacing-sm)' }}>
                    <div className="flex-1">
                      <FlexLayout direction="column" gap="xs">
                        <FlexLayout direction="row" align="center" gap="xs">
                        <h3 className="font-medium text-foreground">{category.title}</h3>
                        {category.required && (
                          <span className="text-xs bg-primary/10 text-primary rounded" style={{ paddingLeft: 'var(--spacing-xs)', paddingRight: 'var(--spacing-xs)', paddingTop: '2px', paddingBottom: '2px' }}>
                            Påkrevd
                          </span>
                        )}
                        </FlexLayout>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                        <p className="text-xs text-muted-foreground">
                          <strong>Eksempler:</strong> {category.examples}
                        </p>
                      </FlexLayout>
                    </div>
                    <Switch
                      checked={preferences[category.key]}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, [category.key]: checked }))
                      }
                      disabled={category.required}
                      aria-label={`Toggle ${category.title}`}
                    />
                  </FlexLayout>
                  {index < cookieCategories.length - 1 && <Separator />}
                </div>
              ))}
            </FlexLayout>

            <FlexLayout direction="row" justify="end" gap="sm" style={{ paddingTop: 'var(--spacing-lg)', borderTop: '1px solid hsl(var(--border))' }}>
              <Button variant="outline" onClick={hidePreferencesModal}>
                Avbryt
              </Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                <Check style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)', marginRight: 'var(--spacing-xs)' }} />
                Lagre innstillinger
              </Button>
            </FlexLayout>
          </FlexLayout>
        </CardContent>
      </Card>
    </FlexLayout>
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
        <CardContent className="text-center" style={{ padding: 'var(--spacing-xl)' }}>
          <Check className="text-success" style={{ width: 'var(--icon-xl)', height: 'var(--icon-xl)', margin: '0 auto var(--spacing-lg)' }} />
          <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--spacing-xs)' }}>Forespørsel sendt</h3>
          <p className="text-sm text-muted-foreground">
            Vi har mottatt din forespørsel og vil behandle den innen 30 dager som påkrevd av GDPR.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent style={{ padding: 'var(--spacing-xl)' }}>
        <FlexLayout direction="row" align="center" gap="sm" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Shield className="text-primary" style={{ width: 'var(--icon-lg)', height: 'var(--icon-lg)' }} />
          <h2 className="text-xl font-semibold">GDPR-forespørsel</h2>
        </FlexLayout>

        <FlexLayout direction="column" gap="lg" as="form" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium block" style={{ marginBottom: 'var(--spacing-xs)' }}>Type forespørsel</label>
            <FlexLayout direction="column" gap="xs">
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
                  className="border border-border rounded-2xl cursor-pointer hover:bg-accent" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)', padding: 'var(--spacing-sm)' }}
                >
                  <input
                    type="radio"
                    name="requestType"
                    value={option.value}
                    checked={requestType === option.value}
                    onChange={(e) => setRequestType(e.target.value as 'access' | 'delete' | 'portability')}
                    style={{ marginTop: 'var(--spacing-xs)' }}
                    required
                  />
                  <div>
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.desc}</div>
                  </div>
                </label>
              ))}
            </FlexLayout>
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium block" style={{ marginBottom: 'var(--spacing-xs)' }}>
              E-postadresse
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border rounded-2xl" style={{ padding: 'var(--spacing-sm) var(--spacing-sm)' }}
              placeholder="din@epost.no"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Send forespørsel
          </Button>
        </FlexLayout>
      </CardContent>
    </Card>
  );
};
