'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

// UI Components
import { Heading, Text, Container, FlexLayout, GridLayout } from '@/components';

/**
 * Stat item interface for consistent stat display
 */
interface StatItem {
  readonly countKey: string;
  readonly labelKey: string;
}

/**
 * StatDisplay component for showing individual statistic
 * @param props StatItem data
 * @returns React element for a single statistic
 */
const StatDisplay = ({ stat }: { stat: StatItem }): React.ReactElement => {
  const { t } = useTranslation();
  
  return (
    <FlexLayout direction="column" align="center" gap="xs">
      <Heading level={3} variant="white" className="text-4xl lg:text-5xl">
        {t(stat.countKey)}
      </Heading>
      <Text variant="white" className="opacity-80">
        {t(stat.labelKey)}
      </Text>
    </FlexLayout>
  );
};

/**
 * Stats section component for the landing page
 * Displays key metrics and achievements in a grid layout
 * @returns React element with stats section content
 */
export const StatsSection = (): React.ReactElement => {
  const stats: StatItem[] = [
    {
      countKey: 'landing.stats.users.count',
      labelKey: 'landing.stats.users.label',
    },
    {
      countKey: 'landing.stats.tasks.count',
      labelKey: 'landing.stats.tasks.label',
    },
    {
      countKey: 'landing.stats.uptime.count',
      labelKey: 'landing.stats.uptime.label',
    },
    {
      countKey: 'landing.stats.rating.count',
      labelKey: 'landing.stats.rating.label',
    },
  ];

  return (
    <section className="py-[var(--spacing-5xl)] bg-primary text-white">
      <Container size="lg">
        <GridLayout 
          columns={{ mobile: 2, desktop: 4 }}
          gap="xl"
          className="text-center"
        >
          {stats.map((stat, index) => (
            <StatDisplay key={index} stat={stat} />
          ))}
        </GridLayout>
      </Container>
    </section>
  );
};
