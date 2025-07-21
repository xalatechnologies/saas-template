'use client';

import React from 'react';
import type { Metadata } from 'next';
import { BasePage, PageSection, ThemeSettings, AccessibilitySettings } from '@/components';

export default function SettingsPage(): JSX.Element {
  return (
    <BasePage
      title="Innstillinger"
      subtitle="Tilpass applikasjonen etter dine behov og preferanser"
    >
      <PageSection variant="card" title="Tema-innstillinger">
        <ThemeSettings />
      </PageSection>
      
      <PageSection variant="card" title="Tilgjengelighet">
        <AccessibilitySettings />
      </PageSection>
    </BasePage>
  );
}