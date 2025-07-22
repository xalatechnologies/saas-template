'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// UI Components
import { Button, Heading, Text, Container, FlexLayout } from '@/components';

/**
 * Call to Action section component for the landing page
 * Displays a prominent CTA with buttons for signing up or contacting sales
 * @returns React element with CTA section content
 */
export const CallToActionSection = (): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
      <Container size="lg">
        <FlexLayout 
          direction="column" 
          align="center" 
          justify="center" 
          gap="lg"
          className="text-center"
        >
          <Heading level={2} variant="white" className="text-3xl lg:text-4xl mb-[var(--spacing-sm)]">
            {t('landing.cta.heading')}
          </Heading>
          
          <Text 
            variant="white" 
            size="lg" 
            className="opacity-90 mb-[var(--spacing-2xl)] max-w-2xl"
          >
            {t('landing.cta.subtitle')}
          </Text>
          
          <FlexLayout direction="row" align="center" justify="center" gap="lg" wrap>
            <Link href="/signup">
              <Button 
                size="lg" 
                variant="secondary"
                aria-label={t('landing.cta.freeTrialButton')}
                className="min-w-[200px] shadow-xl"
              >
                {t('landing.cta.freeTrialButton')}
                <ArrowRight 
                  className="ml-[var(--spacing-xs)] h-[var(--icon-sm)] w-[var(--icon-sm)]" 
                  aria-hidden="true"
                />
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline"
                aria-label={t('landing.cta.contactSalesButton')}
                className="min-w-[200px] bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {t('landing.cta.contactSalesButton')}
              </Button>
            </Link>
          </FlexLayout>
        </FlexLayout>
      </Container>
    </section>
  );
};
