'use client';

import React from 'react';

// Section Components
import { 
  HeroSection,
  FeaturesSection,
  StatsSection,
  TestimonialsSection,
  PricingSection,
  CallToActionSection
} from './sections';

/**
 * LandingContent component that orchestrates all landing page sections
 * Using SOLID principles: each section is a separate component with single responsibility
 * @returns React element containing the full landing page content
 */
export default function LandingContent(): React.ReactElement {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <CallToActionSection />
    </main>
  );
}
