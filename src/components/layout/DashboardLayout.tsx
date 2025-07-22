'use client';

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { RightDrawer } from './RightDrawer';
import { SkipLinks } from '@/components';
import { Button, LanguageSelector } from '../ui';

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * Dashboard layout component with header, sidebar, body, and right drawer
 * @returns JSX.Element
 */
export const DashboardLayout = ({ children }: DashboardLayoutProps): JSX.Element => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background" role="application">
      <SkipLinks />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Header with Language Selector and Assistant Button */}
        <Header>
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <Button
              variant="outline"
              onClick={() => setDrawerOpen(true)}
              className="rounded-xl"
              aria-label="Open assistant"
            >
              <MessageSquare className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Assistant</span>
            </Button>
          </div>
        </Header>
        
        {/* Main Content */}
        <main
          id="main-content"
          className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-background via-background to-accent/5"
          role="main"
          aria-label="Dashboard content"
        >
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Right Drawer */}
      <RightDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        title="AI Assistant"
      >
        {/* Chatbot content will go here */}
      </RightDrawer>
    </div>
  );
};