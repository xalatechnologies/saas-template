'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './ThemeProvider';
import { I18nProvider } from './I18nProvider';
import { AccessibilityProvider } from '../components/accessibility/AccessibilityProvider';
import { GDPRBanner } from '../components/gdpr/GDPRBanner';

// Create query client outside of component to avoid recreating on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

interface AppProvidersProps {
  readonly children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <ThemeProvider>
          <I18nProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />
            <GDPRBanner />
          </I18nProvider>
        </ThemeProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
};