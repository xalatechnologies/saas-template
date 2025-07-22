'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 px-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Something Went Wrong</h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto">
            An error occurred while processing your request. Please try again or contact support if the problem persists.
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="rounded-xl"
        >
          Go Home
        </Button>
        <Button
          onClick={reset}
          className="rounded-xl shadow-lg"
        >
          Try Again
        </Button>
      </div>
      
      {process.env.NODE_ENV === 'development' && error.message && (
        <div className="mt-8 max-w-2xl mx-auto p-6 bg-muted rounded-xl">
          <p className="text-base font-mono text-muted-foreground">{error.message}</p>
        </div>
      )}
    </div>
  );
}