import React from 'react';
import type { Metadata } from 'next';
import { DashboardContent } from '@/components';

/**
 * Metadata for the dashboard page
 */
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Oversikt over oppgaver og prosjekter',
};

/**
 * Dashboard page server component - main application entry point
 * @returns React element with dashboard content
 */
export default function DashboardPage(): React.ReactElement {
  return <DashboardContent />;
}