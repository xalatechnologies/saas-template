'use client';

import React from 'react';
import { SettingsContent, AuthGuard } from '@/components';

/**
 * Settings page server component
 * Renders the SettingsContent client component
 * @returns React element for settings page
 */
export default function SettingsPage(): React.ReactElement {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
