import React from 'react';
import type { Metadata } from 'next';
import { SettingsContent } from '@/components';

/**
 * Metadata for the settings page
 */
export const metadata: Metadata = {
  title: 'Innstillinger',
  description: 'Tilpass applikasjonen etter dine behov og preferanser',
};

/**
 * Settings page server component
 * Renders the SettingsContent client component
 * @returns React element for settings page
 */
export default function SettingsPage(): React.ReactElement {
  return <SettingsContent />;
}
