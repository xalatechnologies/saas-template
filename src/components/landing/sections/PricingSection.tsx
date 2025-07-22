'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';

// UI Components
import { Badge, Button, Heading, Text, CardLayout, CardLayoutBody, Container, FlexLayout, GridLayout } from '@/components';
import { cn } from '@/utils';

/**
 * PricingPlan interface for consistent pricing plan structure
 */
interface PricingPlan {
  readonly nameKey: string;
  readonly priceKey: string;
  readonly periodKey: string;
  readonly descriptionKey: string;
  readonly featureKeys: readonly string[];
  readonly highlighted?: boolean;
}

/**
 * PricingCard component for displaying individual pricing plan
 * @param props PricingPlan data and display options
 * @returns React element for a single pricing card
 */
const PricingCard = ({ plan }: { plan: PricingPlan }): React.ReactElement => {
  const { t } = useTranslation();
  
  return (
    <CardLayout
      variant={plan.highlighted ? 'gradient' : 'bordered'}
      className={cn(
        plan.highlighted && 'ring-2 ring-primary shadow-xl scale-105'
      )}
    >
      <CardLayoutBody className="p-[var(--spacing-2xl)]">
        {plan.highlighted && (
          <Badge className="rounded-full mb-[var(--spacing-sm)]">
            {t('landing.pricing.badge.mostPopular')}
          </Badge>
        )}
        
        <Heading level={3} className="text-2xl md:text-3xl mb-[var(--spacing-xs)]">
          {t(plan.nameKey)}
        </Heading>
        
        <FlexLayout direction="row" align="baseline" gap="xs" className="mb-[var(--spacing-sm)]">
          <Text variant="default" size="2xl" weight="bold" className="text-4xl">
            {t(plan.priceKey)}
          </Text>
          {plan.periodKey && (
            <Text variant="muted" className="text-muted-foreground">
              /{t(plan.periodKey)}
            </Text>
          )}
        </FlexLayout>
        
        <Text variant="muted" className="mb-[var(--spacing-lg)]">
          {t(plan.descriptionKey)}
        </Text>
        
        <FlexLayout direction="column" gap="sm" className="mb-[var(--spacing-lg)]">
          {plan.featureKeys.map((featureKey: string, i: number) => (
            <FlexLayout key={i} direction="row" align="start" gap="sm">
              <CheckCircle 
                className="text-primary flex-shrink-0 h-[var(--icon-sm)] w-[var(--icon-sm)] mt-0.5" 
                aria-hidden="true"
              />
              <Text variant="default">
                {t(featureKey)}
              </Text>
            </FlexLayout>
          ))}
        </FlexLayout>
        
        <Button
          size="lg"
          variant={plan.highlighted ? 'default' : 'outline'}
          className="w-full"
          aria-label={`${t('landing.pricing.getStarted')} ${t(plan.nameKey)}`}
        >
          {t('landing.pricing.getStarted')}
        </Button>
      </CardLayoutBody>
    </CardLayout>
  );
};

/**
 * Pricing section component for the landing page
 * Displays tiered pricing plans in a responsive grid layout
 * @returns React element with pricing section content
 */
export const PricingSection = (): React.ReactElement => {
  const { t } = useTranslation();
  
  const pricingPlans: readonly PricingPlan[] = [
    {
      nameKey: 'landing.pricing.free.name',
      priceKey: 'landing.pricing.free.price',
      periodKey: 'landing.pricing.free.period',
      descriptionKey: 'landing.pricing.free.description',
      featureKeys: [
        'landing.pricing.free.features.tasks',
        'landing.pricing.free.features.reminders',
        'landing.pricing.free.features.collaboration',
      ],
    },
    {
      nameKey: 'landing.pricing.pro.name',
      priceKey: 'landing.pricing.pro.price',
      periodKey: 'landing.pricing.pro.period',
      descriptionKey: 'landing.pricing.pro.description',
      highlighted: true,
      featureKeys: [
        'landing.pricing.pro.features.everything',
        'landing.pricing.pro.features.analytics',
        'landing.pricing.pro.features.api',
        'landing.pricing.pro.features.support',
      ],
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
    <section id="pricing" className="py-[var(--spacing-5xl)] bg-muted/30">
      <Container size="lg">
        <FlexLayout 
          direction="column" 
          align="center" 
          justify="center" 
          gap="lg"
          className="text-center mb-[var(--spacing-xl)]"
        >
          <Heading level={2} className="text-3xl lg:text-4xl mb-[var(--spacing-sm)]">
            {t('landing.pricing.heading')}
          </Heading>
          <Text variant="muted" size="lg" className="max-w-2xl">
            {t('landing.pricing.description')}
          </Text>
        </FlexLayout>
        
        <GridLayout 
          columns={{ mobile: 1, tablet: 3 }}
          gap="xl"
        >
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </GridLayout>
      </Container>
    </section>
  );
};
