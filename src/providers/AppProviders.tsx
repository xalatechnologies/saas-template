'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AccessibilityProvider } from '../components/accessibility/AccessibilityProvider';
import { GDPRBanner } from '../components/gdpr/GDPRBanner';
import { ThemeProvider } from './ThemeProvider';
import { I18nProvider } from './I18nProvider';
import { LayoutProvider } from './LayoutProvider';

// Create query client outside of component to avoid recreating on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error instanceof Error && 'status' in error) {
          const errorWithStatus = error as Error & { status?: number };
          if (errorWithStatus.status === 401 || errorWithStatus.status === 403) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
  },
});

interface AppProvidersProps {
  readonly children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps): React.ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <ThemeProvider>
          <I18nProvider>
            <LayoutProvider>
              {children}
            </LayoutProvider>
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
