'use client';

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SkipLinks } from '@/components';
import { cn } from '@/utils';

interface LayoutProps {
  readonly children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div
      className="min-h-screen bg-background"
      role="application"
      aria-label="Task Management Application"
    >
      <SkipLinks />
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main
          id="main-content"
          className="flex-1 min-h-screen bg-gradient-to-br from-background via-background to-accent/5"
          role="main"
          aria-label="Main content"
        >
          <div className="container mx-auto px-6 py-12">{children}</div>
        </main>
      </div>
    </div>
  );
};
