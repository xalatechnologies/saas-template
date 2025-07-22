'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  Clock,
  ArrowRight,
  Star,
  Globe,
  Sparkles
} from 'lucide-react';
import { Badge, Button, Card, Heading, Text } from '../ui';
import { Container, GridLayout, FlexLayout, CardLayout, CardLayoutHeader, CardLayoutBody } from '../layout';
import { cn } from '@/utils';

interface Feature {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly titleKey: string;
  readonly descriptionKey: string;
}

interface Testimonial {
  readonly nameKey: string;
  readonly roleKey: string;
  readonly companyKey: string;
  readonly contentKey: string;
  readonly rating: number;
}

interface PricingPlan {
  readonly nameKey: string;
  readonly priceKey: string;
  readonly periodKey: string;
  readonly descriptionKey: string;
  readonly featureKeys: string[];
  readonly highlighted?: boolean;
}

/**
 * Landing page content component
 * @returns JSX.Element
 */
export const LandingContent = (): JSX.Element => {
  const { t } = useTranslation();
  const features: Feature[] = [
    {
      icon: CheckCircle,
      titleKey: 'landing.features.taskManagement.title',
      descriptionKey: 'landing.features.taskManagement.description',
    },
    {
      icon: Users,
      titleKey: 'landing.features.teamCollaboration.title',
      descriptionKey: 'landing.features.teamCollaboration.description',
    },
    {
      icon: BarChart3,
      titleKey: 'landing.features.analytics.title',
      descriptionKey: 'landing.features.analytics.description',
    },
    {
      icon: Shield,
      titleKey: 'landing.features.security.title',
      descriptionKey: 'landing.features.security.description',
    },
    {
      icon: Zap,
      titleKey: 'landing.features.performance.title',
      descriptionKey: 'landing.features.performance.description',
    },
    {
      icon: Globe,
      titleKey: 'landing.features.multilanguage.title',
      descriptionKey: 'landing.features.multilanguage.description',
    },
  ];

  const testimonials: Testimonial[] = [
    {
      nameKey: 'landing.testimonials.sarah.name',
      roleKey: 'landing.testimonials.sarah.role',
      companyKey: 'landing.testimonials.sarah.company',
      contentKey: 'landing.testimonials.sarah.content',
      rating: 5,
    },
    {
      nameKey: 'landing.testimonials.michael.name',
      roleKey: 'landing.testimonials.michael.role',
      companyKey: 'landing.testimonials.michael.company',
      contentKey: 'landing.testimonials.michael.content',
      rating: 5,
    },
    {
      nameKey: 'landing.testimonials.emma.name',
      roleKey: 'landing.testimonials.emma.role',
      companyKey: 'landing.testimonials.emma.company',
      contentKey: 'landing.testimonials.emma.content',
      rating: 5,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      nameKey: 'landing.pricing.starter.name',
      priceKey: 'landing.pricing.starter.price',
      periodKey: 'landing.pricing.starter.period',
      descriptionKey: 'landing.pricing.starter.description',
      featureKeys: [
        'landing.pricing.starter.features.tasks',
        'landing.pricing.starter.features.basic',
        'landing.pricing.starter.features.mobile',
        'landing.pricing.starter.features.email',
      ],
    },
    {
      nameKey: 'landing.pricing.professional.name',
      priceKey: 'landing.pricing.professional.price',
      periodKey: 'landing.pricing.professional.period',
      descriptionKey: 'landing.pricing.professional.description',
      featureKeys: [
        'landing.pricing.professional.features.unlimited',
        'landing.pricing.professional.features.analytics',
        'landing.pricing.professional.features.collaboration',
        'landing.pricing.professional.features.priority',
        'landing.pricing.professional.features.workflows',
        'landing.pricing.professional.features.api',
      ],
      highlighted: true,
    },
    {
      nameKey: 'landing.pricing.enterprise.name',
      priceKey: 'landing.pricing.enterprise.price',
      periodKey: 'landing.pricing.enterprise.period',
      descriptionKey: 'landing.pricing.enterprise.description',
      featureKeys: [
        'landing.pricing.enterprise.features.everything',
        'landing.pricing.enterprise.features.security',
        'landing.pricing.enterprise.features.integrations',
        'landing.pricing.enterprise.features.support',
        'landing.pricing.enterprise.features.sla',
        'landing.pricing.enterprise.features.onpremise',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background py-[var(--spacing-5xl)] lg:py-[var(--spacing-8xl)]">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <Container size="lg" className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="rounded-full mb-[var(--spacing-sm)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]">
              <Sparkles className="h-[var(--icon-xs)] w-[var(--icon-xs)] mr-[var(--spacing-xs)]" />
              {t('landing.hero.badge')}
            </Badge>
            <Heading level={1} className="text-5xl lg:text-7xl mb-[var(--spacing-lg)]">
              {t('landing.hero.heading.first')}
              <span className="text-primary block mt-[var(--spacing-xs)]">{t('landing.hero.heading.emphasis')}</span>
            </Heading>
            <Text variant="muted" size="xl" className="leading-relaxed mb-[var(--spacing-lg)]">
              {t('landing.hero.description')}
            </Text>
            <FlexLayout direction="row" align="center" justify="center" gap="lg" wrap>
              <Link href="/signup">
                <Button size="lg" className="rounded-[var(--radius-2xl)] shadow-xl min-w-[200px]">
                  {t('landing.hero.getStartedButton')}
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="rounded-[var(--radius-2xl)] min-w-[200px]">
                  {t('landing.hero.loginButton')}
                </Button>
              </Link>
            </FlexLayout>
            <Text variant="muted" size="sm" className="mt-[var(--spacing-sm)]">
              Sign up now and experience the difference. No credit card required for trial.
            </Text>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-[var(--spacing-5xl)] bg-muted/30">
        <Container size="lg">
          <Container size="lg" className="text-center mb-[var(--spacing-xl)]">
            <Heading level={2} className="text-3xl lg:text-4xl mb-[var(--spacing-sm)]">
              {t('landing.features.heading')}
            </Heading>
            <Text variant="muted" size="lg" className="max-w-2xl mx-auto">
              {t('landing.features.description')}
            </Text>
          </Container>
          <GridLayout columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <CardLayout key={index} variant="elevated" className="hover:-translate-y-1 transition-transform">
                  <CardLayoutHeader>
                    <FlexLayout direction="row" align="start" gap="lg">
                      <FlexLayout align="center" justify="center" className="relative bg-secondary/10 rounded-[var(--radius-xl)] p-[var(--spacing-lg)] h-[var(--size-3xl)] w-[var(--size-3xl)]">
                        <Icon className="text-primary h-[var(--size-xl)] w-[var(--size-xl)]" />
                      </FlexLayout>
                      <div>
                        <Heading level={3} variant="default" size="h3">{t(feature.titleKey)}</Heading>
                        <Text variant="muted">{t(feature.descriptionKey)}</Text>
                      </div>
                    </FlexLayout>
                  </CardLayoutHeader>
                </CardLayout>
              );
            })}
          </GridLayout>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-[var(--spacing-5xl)] bg-primary text-white">
        <Container size="lg">
          <GridLayout 
            columns={{ mobile: 2, desktop: 4 }}
            gap="xl"
            className="text-center"
          >
            <FlexLayout direction="column" align="center" gap="xs">
              <Heading level={3} variant="white" className="text-4xl lg:text-5xl">{t('landing.stats.users.count')}</Heading>
              <Text variant="white" className="opacity-80">{t('landing.stats.users.label')}</Text>
            </FlexLayout>
            <FlexLayout direction="column" align="center" gap="xs">
              <Heading level={3} variant="white" className="text-4xl lg:text-5xl">{t('landing.stats.tasks.count')}</Heading>
              <Text variant="white" className="opacity-80">{t('landing.stats.tasks.label')}</Text>
            </FlexLayout>
            <FlexLayout direction="column" align="center" gap="xs">
              <Heading level={3} variant="white" className="text-4xl lg:text-5xl">{t('landing.stats.uptime.count')}</Heading>
              <Text variant="white" className="opacity-80">{t('landing.stats.uptime.label')}</Text>
            </FlexLayout>
            <FlexLayout direction="column" align="center" gap="xs">
              <Heading level={3} variant="white" className="text-4xl lg:text-5xl">{t('landing.stats.rating.count')}</Heading>
              <Text variant="white" className="opacity-80">{t('landing.stats.rating.label')}</Text>
            </FlexLayout>
          </GridLayout>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-[var(--spacing-5xl)]">
        <Container size="lg">
          <Container size="lg" className="text-center mb-[var(--spacing-xl)]">
            <Heading level={2} className="text-3xl lg:text-4xl mb-[var(--spacing-sm)]">
              {t('landing.testimonials.heading')}
            </Heading>
            <Text variant="muted" size="lg" className="max-w-2xl mx-auto">
              {t('landing.testimonials.description')}
            </Text>
          </Container>
          <GridLayout columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {testimonials.map((testimonial, index) => (
              <CardLayout key={index} variant="bordered">
                <CardLayoutBody>
                  <FlexLayout direction="column" gap="sm">
                  <FlexLayout direction="row" gap="xs">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="fill-primary text-primary h-[var(--icon-sm)] w-[var(--icon-sm)]" />
                    ))}
                  </FlexLayout>
                  <Text variant="muted" className="italic">
                    "{t(testimonial.contentKey)}"
                  </Text>
                  <div>
                    <Text variant="default" weight="semibold">{t(testimonial.nameKey)}</Text>
                    <Text variant="muted" size="sm">
                      {t(testimonial.roleKey)}, {t(testimonial.companyKey)}
                    </Text>
                  </div>
                  </FlexLayout>
                </CardLayoutBody>
              </CardLayout>
            ))}
          </GridLayout>
        </Container>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-[var(--spacing-5xl)] bg-muted/30">
        <Container size="lg">
          <Container size="lg" className="text-center mb-[var(--spacing-xl)] mx-auto">
            <Heading level={2} className="text-3xl lg:text-4xl mb-[var(--spacing-sm)]">
              {t('landing.pricing.heading')}
            </Heading>
            <Text variant="muted" size="lg" className="max-w-2xl mx-auto">
              {t('landing.pricing.description')}
            </Text>
          </Container>
          <Container size="lg">
            <GridLayout 
              columns={{ mobile: 1, tablet: 3 }}
              gap="xl"
            >
            {pricingPlans.map((plan, index) => (
              <CardLayout
                key={index}
                variant={plan.highlighted ? 'gradient' : 'bordered'}
                className={cn(
                  plan.highlighted && 'ring-2 ring-primary shadow-xl scale-105'
                )}
              >
                <CardLayoutBody className="p-[var(--spacing-2xl)]">
                  {plan.highlighted && (
                    <Badge className="rounded-full mb-[var(--spacing-sm)]">{t('landing.pricing.badge.mostPopular')}</Badge>
                  )}
                  <Heading level={3} className="text-2xl md:text-3xl mb-[var(--spacing-xs)]">{t(plan.nameKey)}</Heading>
                  <div className="mb-[var(--spacing-sm)]">
                    <Text variant="default" size="2xl" weight="bold" className="text-4xl">{t(plan.priceKey)}</Text>
                    {plan.periodKey && (
                      <span className="text-muted-foreground ml-[var(--spacing-xs)]">/{t(plan.periodKey)}</span>
                    )}
                  </div>
                  <Text variant="muted" className="mb-[var(--spacing-lg)]">{t(plan.descriptionKey)}</Text>
                  <FlexLayout direction="column" gap="sm" className="mb-[var(--spacing-lg)]">
                    {plan.featureKeys.map((featureKey: string, i: number) => (
                      <FlexLayout key={i} direction="row" align="start" gap="sm">
                        <CheckCircle className="text-primary flex-shrink-0 h-[var(--icon-sm)] w-[var(--icon-sm)] mt-0.5" />
                        <Text variant="default">{t(featureKey)}</Text>
                      </FlexLayout>
                    ))}
                  </FlexLayout>
                  <Button
                    className="w-full rounded-2xl min-w-[200px]"
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </CardLayoutBody>
              </CardLayout>
            ))}
            </GridLayout>
          </Container>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <Container size="lg" className="text-center">
          <Heading level={2} variant="white" className="text-3xl lg:text-4xl mb-[var(--spacing-sm)]">
            {t('landing.cta.heading')}
          </Heading>
          <Text variant="white" size="lg" className="opacity-90 mb-[var(--spacing-2xl)] max-w-2xl mx-auto">
            {t('landing.cta.subtitle')}
          </Text>
          <FlexLayout direction="row" align="center" justify="center" gap="lg" wrap>
            <Link href="/signup">
              <Button 
                size="lg" 
                variant="secondary"
                className="rounded-[var(--radius-2xl)] shadow-xl min-w-[200px]"
              >
                {t('landing.cta.freeTrialButton')}
                <ArrowRight className="ml-[var(--spacing-xs)] h-[var(--icon-sm)] w-[var(--icon-sm)]" />
              </Button>
            </Link>
            <Link href={'/contact' as any}>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-[var(--radius-2xl)] bg-white/10 border-white/20 text-white hover:bg-white/20 min-w-[200px]"
              >
                {t('landing.cta.contactSalesButton')}
              </Button>
            </Link>
          </FlexLayout>
        </Container>
      </section>
    </div>
  );
};