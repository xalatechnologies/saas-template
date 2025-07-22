'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

// UI Components
import { Badge, Button, Heading, Text, Container, FlexLayout } from '@/components';
import Link from 'next/link';

/**
 * Hero section component for the landing page
 * Displays the main headline, description, and CTA buttons
 * @returns React element with the hero section content
 */
export const HeroSection = (): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background py-[var(--spacing-5xl)] lg:py-[var(--spacing-8xl)]">
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <Container size="lg" className="relative z-10">
        <FlexLayout
          direction="column"
          align="center"
          justify="center"
          gap="lg"
          className="mx-auto max-w-4xl text-center"
        >
          <Badge 
            variant="secondary" 
            className="mb-[var(--spacing-sm)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-full"
          >
            <Sparkles className="h-[var(--icon-xs)] w-[var(--icon-xs)] mr-[var(--spacing-xs)]" />
            {t('landing.hero.badge')}
          </Badge>
          
          <Heading level={1} className="mb-[var(--spacing-lg)] text-5xl lg:text-7xl">
            {t('landing.hero.heading.first')}
            <span className="block mt-[var(--spacing-xs)] text-primary">
              {t('landing.hero.heading.emphasis')}
            </span>
          </Heading>
          
          <Text 
            variant="muted" 
            size="xl" 
            className="leading-relaxed mb-[var(--spacing-lg)]"
          >
            {t('landing.hero.description')}
          </Text>
          
          <FlexLayout direction="row" align="center" justify="center" gap="lg" wrap>
            <Link href="/signup">
              <Button 
                size="lg" 
                aria-label={t('landing.hero.getStartedButton')}
                className="min-w-[200px]"
              >
                {t('landing.hero.getStartedButton')}
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg" 
                variant="outline" 
                aria-label={t('landing.hero.loginButton')}
                className="min-w-[200px]"
              >
                {t('landing.hero.loginButton')}
              </Button>
            </Link>
          </FlexLayout>
          
          <Text 
            variant="muted" 
            size="sm" 
            className="mt-[var(--spacing-sm)]"
          >
            {t('landing.hero.noCreditCard')}
          </Text>
        </FlexLayout>
      </Container>
    </section>
  );
};
