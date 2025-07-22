'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Shield, Zap, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Text, Heading, Card, IconWrapper } from '../ui';
import { Container, FlexLayout, GridLayout, SplitLayout } from './';
import { cn } from '@/utils';

interface AuthLayoutProps {
  readonly children: React.ReactNode;
  readonly title: string;
  readonly subtitle: string;
  readonly type: 'login' | 'signup' | 'forgot-password' | 'reset-password';
}

interface Feature {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly titleKey: string;
  readonly descriptionKey: string;
}

/**
 * Auth layout component with split-screen design
 * @returns React.ReactElement
 */
export const AuthLayout = ({ 
  children, 
  title, 
  subtitle,
  type 
}: AuthLayoutProps): React.ReactElement => {
  const { t } = useTranslation();

  const features: Feature[] = [
    {
      icon: Sparkles,
      titleKey: 'auth.features.ai.title',
      descriptionKey: 'auth.features.ai.description',
    },
    {
      icon: Shield,
      titleKey: 'auth.features.security.title',
      descriptionKey: 'auth.features.security.description',
    },
    {
      icon: Zap,
      titleKey: 'auth.features.performance.title',
      descriptionKey: 'auth.features.performance.description',
    },
    {
      icon: Users,
      titleKey: 'auth.features.collaboration.title',
      descriptionKey: 'auth.features.collaboration.description',
    },
  ];

  return (
    <SplitLayout
      className="min-h-screen"
      split="60/40"
    >
      <Container size="full" className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <FlexLayout direction="column" justify="between" className="h-full w-full">
            {/* Background Pattern */}
            <FlexLayout className="absolute inset-0 opacity-10">
              <Card className="absolute bg-card rounded-full blur-3xl" style={{ 
                top: 'calc(-1 * var(--spacing-6xl))', 
                left: 'calc(-1 * var(--spacing-6xl))', 
                width: 'var(--size-3xl)', 
                height: 'var(--size-3xl)' 
              }}>
                <div />
              </Card>
              <Card className="absolute bg-card rounded-full blur-3xl" style={{ 
                bottom: 'calc(-1 * var(--spacing-6xl))', 
                right: 'calc(-1 * var(--spacing-6xl))', 
                width: 'var(--size-3xl)', 
                height: 'var(--size-3xl)' 
              }}>
                <div />
              </Card>
              <Card className="absolute bg-card rounded-full blur-3xl" style={{ 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                width: 'var(--size-3xl)', 
                height: 'var(--size-3xl)' 
              }}>
                <div />
              </Card>
            </FlexLayout>

            {/* Content */}
            <FlexLayout direction="column" className="relative z-10">
              {/* Logo */}
              <Link href="/" className="inline-flex items-center gap-2">
                <FlexLayout 
                  align="center" 
                  justify="center" 
                  className="backdrop-blur-xl rounded-2xl shadow-2xl bg-primary-foreground/20 h-[var(--size-lg)] w-[var(--size-lg)]"
                >
                  <Text variant="white" size="xl" weight="bold">TM</Text>
                </FlexLayout>
                <Text variant="white" size="2xl" weight="bold">{t('company.name')}</Text>
              </Link>

              {/* Main Content */}
              <FlexLayout 
                direction="column" 
                className="max-w-xl mt-[var(--spacing-3xl)]"
              >
                <Heading 
                  level={1} 
                  variant="white" 
                  className="leading-tight text-[var(--font-size-5xl)] mb-[var(--spacing-md)]"
                >
                  {t('auth.hero.title')}
                </Heading>
                <Text 
                  variant="white" 
                  size="xl" 
                  className="leading-relaxed opacity-90 mb-[var(--spacing-2xl)]"
                >
                  {t('auth.hero.subtitle')}
                </Text>

                {/* Features Grid */}
                <GridLayout columns={{ mobile: 1, tablet: 2 }} gap="lg">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <Card
                        key={index}
                        className="bg-primary-foreground/10 backdrop-blur-xl rounded-2xl border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 p-[var(--spacing-md)]"
                      >
                        <IconWrapper 
                          variant="white" 
                          size="md" 
                          className="mb-[var(--spacing-xs)]">
                          <Icon className="h-full w-full" />
                        </IconWrapper>
                        <Heading 
                          level={3} 
                          variant="white" 
                          size="h3" 
                          className="mb-[var(--spacing-2xs)]">
                          {t(feature.titleKey)}
                        </Heading>
                        <Text 
                          variant="white" 
                          size="sm" 
                          className="opacity-80 leading-relaxed">
                          {t(feature.descriptionKey)}
                        </Text>
                      </Card>
                    );
                  })}
                </GridLayout>
              </FlexLayout>

          {/* Footer */}
          <FlexLayout className="relative z-10">
            <Text 
              variant="white" 
              size="sm"
              className="opacity-60"
            >
              © {new Date().getFullYear()} {t('company.name')}. {t('company.copyright')}
            </Text>
          </FlexLayout>
        </FlexLayout>
        </FlexLayout>
      </Container>

      <FlexLayout direction="column" className="w-full">
        {/* Top Navigation */}
        <Container size="full" className="border-b border-border">
          <FlexLayout direction="row" align="center" justify="between">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-[var(--radius-xl)]"
              >
                <IconWrapper 
                  size="xs" 
                  className="mr-[var(--spacing-2xs)]"
                >
                  <ArrowLeft className="h-full w-full" />
                </IconWrapper>
                {t('auth.backToHome')}
              </Button>
            </Link>
            
            <Text 
              size="sm" 
              variant="muted"
            >
              {type === 'login' ? (
                <>
                  {t('auth.noAccount')}{' '}
                  <Link 
                    href="/signup" 
                    className="font-semibold text-primary hover:underline"
                  >
                    {t('auth.signup')}
                  </Link>
                </>
              ) : type === 'signup' ? (
                <>
                  {t('auth.hasAccount')}{' '}
                  <Link 
                    href="/login"
                    className="font-semibold text-primary hover:underline"
                  >
                    {t('auth.login')}
                  </Link>
                </>
              ) : null}
            </Text>
          </FlexLayout>
        </Container>

          {/* Form Container */}
          <FlexLayout direction="column" align="center" justify="center" className="flex-1">
            <Container size="sm" className="w-full max-w-md">
              {/* Mobile Logo (shown only on mobile) */}
              <FlexLayout 
                align="center" 
                justify="center" 
                className="lg:hidden text-center mb-[var(--spacing-lg)]"
              >
                <Link href="/" className="inline-flex items-center gap-[var(--spacing-xs)]">
                  <FlexLayout 
                    align="center" 
                    justify="center" 
                    className="bg-primary text-primary-foreground rounded-[var(--radius-xl)] shadow-xl h-[var(--size-lg)] w-[var(--size-lg)]"
                  >
                    <Text 
                      variant="white" 
                      size="xl" 
                      weight="bold"
                    >TM</Text>
                  </FlexLayout>
                  <Text 
                    variant="primary" 
                    size="2xl" 
                    weight="bold"
                  >{t('company.name')}</Text>
                </Link>
              </FlexLayout>

              {/* Form Header */}
              <FlexLayout 
                direction="column" 
                className="mb-[var(--spacing-lg)]"
              >
                <Heading 
                  level={2} 
                  size="h2" 
                  variant="default" 
                  className="mb-[var(--spacing-xs)]"
                >
                  {title}
                </Heading>
                <Text variant="muted">{subtitle}</Text>
              </FlexLayout>

              {/* Form Content */}
              <FlexLayout direction="column" gap="lg">
                {children}
              </FlexLayout>

              {/* Social Login */}
              {(type === 'login' || type === 'signup') && (
                <>
                  <FlexLayout 
                    direction="column" 
                    className="relative my-[var(--spacing-lg)]"
                  >
                    <FlexLayout className="absolute inset-0 items-center">
                      <FlexLayout className="w-full border-t border-border"><div /></FlexLayout>
                    </FlexLayout>
                    <FlexLayout justify="center" className="relative">
                      <Text 
                        variant="muted" 
                        className="bg-background px-[var(--spacing-xs)]"
                      >
                        {t('auth.continueWith')}
                      </Text>
                    </FlexLayout>
                  </FlexLayout>

                  <GridLayout columns={{ mobile: 2 }} gap="md">
                    <Button
                      variant="outline"
                      className="rounded-[var(--radius-xl)] font-medium h-[var(--size-md)]"
                      type="button"
                    >
                      <IconWrapper 
                        size="sm" 
                        className="mr-[var(--spacing-2xs)]"
                      >
                        <svg viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      </IconWrapper>
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-[var(--radius-xl)] font-medium h-[var(--size-md)]"
                      type="button"
                    >
                      <IconWrapper 
                        size="sm" 
                        className="mr-[var(--spacing-2xs)]"
                      >
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </IconWrapper>
                      GitHub
                    </Button>
                  </GridLayout>
                </>
              )}

            {/* Terms */}
            {type === 'signup' && (
              <Text 
                variant="muted" 
                size="sm" 
                align="center"
                className="mt-[var(--spacing-lg)]"
              >
                {t('auth.termsAgreement')}{' '}
                <Link href={{ pathname: '/terms' }} className="font-medium text-primary hover:underline">
                  {t('auth.termsOfService')}
                </Link>{' '}
                {t('common.and')}{' '}
                <Link href={{ pathname: '/privacy' }} className="font-medium text-primary hover:underline">
                  {t('auth.privacyPolicy')}
                </Link>
              </Text>
            )}
          </Container>
        </FlexLayout>
      </FlexLayout>
    </SplitLayout>
  );
};

export default AuthLayout;