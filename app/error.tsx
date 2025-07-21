'use client';

import React from 'react';
import { ErrorContent } from '@/components';

interface ErrorBoundaryProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

/**
 * Global error boundary component for handling runtime errors
 * @param props - Error information and reset function
 * @returns React element with error message and reset option
 */
export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps): React.ReactElement {
  return <ErrorContent error={error} reset={reset} />;
}
