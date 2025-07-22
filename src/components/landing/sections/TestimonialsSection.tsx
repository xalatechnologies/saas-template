'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

// UI Components
import { Heading, Text, CardLayout, CardLayoutBody, Container, FlexLayout, GridLayout } from '@/components';

/**
 * Testimonial interface for consistent testimonial card structure
 */
interface Testimonial {
  readonly nameKey: string;
  readonly roleKey: string;
  readonly companyKey: string;
  readonly contentKey: string;
  readonly rating: number;
}

/**
 * TestimonialCard component for displaying individual testimonial
 * @param props Testimonial data
 * @returns React element for a single testimonial
 */
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }): React.ReactElement => {
  const { t } = useTranslation();
  
  return (
    <CardLayout variant="bordered">
      <CardLayoutBody>
        <FlexLayout direction="column" gap="sm">
          <FlexLayout direction="row" gap="xs">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star 
                key={i} 
                className="fill-primary text-primary h-[var(--icon-sm)] w-[var(--icon-sm)]" 
                aria-hidden="true"
              />
            ))}
            <Text className="sr-only">{testimonial.rating} out of 5 stars</Text>
          </FlexLayout>
          
          <Text variant="muted" className="italic">
            &ldquo;{t(testimonial.contentKey)}&rdquo;
          </Text>
          
          <FlexLayout direction="column" gap="xs">
            <Text variant="default" weight="semibold">
              {t(testimonial.nameKey)}
            </Text>
            <Text variant="muted" size="sm">
              {t(testimonial.roleKey)}, {t(testimonial.companyKey)}
            </Text>
          </FlexLayout>
        </FlexLayout>
      </CardLayoutBody>
    </CardLayout>
  );
};

/**
 * Testimonials section component for the landing page
 * Displays customer testimonials in a grid layout
 * @returns React element with testimonials section content
 */
export const TestimonialsSection = (): React.ReactElement => {
  const { t } = useTranslation();
  
  const testimonials: Testimonial[] = [
    {
      nameKey: 'landing.testimonials.testimonial1.name',
      roleKey: 'landing.testimonials.testimonial1.role',
      companyKey: 'landing.testimonials.testimonial1.company',
      contentKey: 'landing.testimonials.testimonial1.content',
      rating: 5,
    },
    {
      nameKey: 'landing.testimonials.testimonial2.name',
      roleKey: 'landing.testimonials.testimonial2.role',
      companyKey: 'landing.testimonials.testimonial2.company',
      contentKey: 'landing.testimonials.testimonial2.content',
      rating: 5,
    },
    {
      nameKey: 'landing.testimonials.testimonial3.name',
      roleKey: 'landing.testimonials.testimonial3.role',
      companyKey: 'landing.testimonials.testimonial3.company',
      contentKey: 'landing.testimonials.testimonial3.content',
      rating: 4,
    },
  ];

  return (
    <section className="py-[var(--spacing-5xl)]">
      <Container size="lg">
        <FlexLayout 
          direction="column" 
          align="center" 
          justify="center" 
          gap="lg"
          className="text-center mb-[var(--spacing-xl)]"
        >
          <Heading level={2} className="text-3xl lg:text-4xl mb-[var(--spacing-sm)]">
            {t('landing.testimonials.heading')}
          </Heading>
          <Text variant="muted" size="lg" className="max-w-2xl">
            {t('landing.testimonials.description')}
          </Text>
        </FlexLayout>
        
        <GridLayout columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </GridLayout>
      </Container>
    </section>
  );
};
