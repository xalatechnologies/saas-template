import React from 'react';
import type { Metadata } from 'next';
import { NotFoundContent } from '@/components';

/**
 * Metadata for the not-found page
 */
export const metadata: Metadata = {
  title: '404 - Side ikke funnet',
  description: 'Vi kunne ikke finne siden du leter etter',
};

/**
 * Custom 404 Not Found page component
 * @returns React element with not found message and navigation options
 */
export default function NotFound(): React.ReactElement {
  return <NotFoundContent />;
}
