import React from 'react';
import type { Metadata } from 'next';
import { LandingContent } from '@/components';

/**
 * Metadata for the home page
 */
export const metadata: Metadata = {
  title: 'TaskManager - Professional Task Management Solution',
  description: 'Streamline your workflow with our powerful task management platform. Built for teams and individuals who want to get things done.',
  keywords: ['task management', 'productivity', 'team collaboration', 'project management'],
};

/**
 * Home page component - shows landing page
 * @returns React element with landing content
 */
export default function HomePage(): React.ReactElement {
  return <LandingContent />;
}