'use client';

import React from 'react';
import { BasePage, PageSection, ThemeSettings, AccessibilitySettings } from '@/components';
import { useUI } from '@/hooks';

/**
 * Settings page client component with theme and accessibility settings
 * @returns React element with settings UI sections
 */
export function SettingsContent(): React.ReactElement {
  const { t } = useUI();

  return (
    <BasePage title={t('settings.title')} subtitle={t('settings.subtitle')}>
      <PageSection variant="card" title={t('settings.theme.title')}>
        <ThemeSettings />
      </PageSection>

      <PageSection variant="card" title={t('settings.accessibility.title')}>
        <AccessibilitySettings />
      </PageSection>
    </BasePage>
  );
}
