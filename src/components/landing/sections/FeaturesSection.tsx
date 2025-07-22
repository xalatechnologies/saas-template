'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Clock, Globe, Users } from 'lucide-react';

// UI Components
import { Heading, Text, CardLayout, CardLayoutHeader, Container, FlexLayout, GridLayout } from '@/components';

/**
 * Feature interface for consistent feature card structure
 */
interface Feature {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly titleKey: string;
  readonly descriptionKey: string;
}

/**
 * FeatureCard component for displaying individual feature
 * @param props Feature data and display options
 * @returns React element for a single feature card
 */
const FeatureCard = ({ feature }: { feature: Feature }): React.ReactElement => {
  const { t } = useTranslation();
  const Icon = feature.icon;
  
  return (
    <CardLayout variant="elevated" className="hover:-translate-y-1 transition-transform">
      <CardLayoutHeader>
        <FlexLayout direction="row" align="start" gap="lg">
          <FlexLayout 
            align="center" 
            justify="center" 
            className="relative bg-secondary/10 rounded-[var(--radius-xl)] p-[var(--spacing-lg)] h-[var(--size-3xl)] w-[var(--size-3xl)]"
          >
            <Icon className="text-primary h-[var(--size-xl)] w-[var(--size-xl)]" />
          </FlexLayout>
          <FlexLayout direction="column" gap="sm">
            <Heading level={3} variant="default" size="h3">
              {t(feature.titleKey)}
            </Heading>
            <Text variant="muted">
              {t(feature.descriptionKey)}
            </Text>
          </FlexLayout>
        </FlexLayout>
      </CardLayoutHeader>
    </CardLayout>
  );
};

/**
 * Features section component for the landing page
 * Displays key product features in a responsive grid layout
 * @returns React element with features section content
 */
export const FeaturesSection = (): React.ReactElement => {
  const { t } = useTranslation();
  
  const features: Feature[] = [
    {
      icon: Users,
      titleKey: 'landing.features.collaboration.title',
      descriptionKey: 'landing.features.collaboration.description',
    },
    {
      icon: BarChart3,
      titleKey: 'landing.features.analytics.title',
      descriptionKey: 'landing.features.analytics.description',
    },
    {
      icon: Clock,
      titleKey: 'landing.features.automation.title',
      descriptionKey: 'landing.features.automation.description',
    },
    {
      icon: Globe,
      titleKey: 'landing.features.global.title',
      descriptionKey: 'landing.features.global.description',
    },
  ];

  return (
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
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </GridLayout>
      </Container>
    </section>
  );
};
