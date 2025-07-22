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
      
      {/* Sidebar - Fixed position */}
      <Sidebar />
      
      {/* Main Content Area - Offset by sidebar width */}
      <div className="flex flex-col min-h-screen lg:ml-80">
        {/* Header - Fixed at top */}
        <Header>
          <div className="flex items-center space-x-6">
            <LanguageSelector />
            <Button
              variant="outline"
              onClick={() => setDrawerOpen(true)}
              className="rounded-xl"
              aria-label="Open assistant"
            >
              <MessageSquare className="h-6 w-6 lg:mr-4" />
              <span className="hidden lg:inline">Assistant</span>
            </Button>
          </div>
        </Header>
        
        {/* Main Content - Scrollable area below header */}
        <main
          id="main-content"
          className="flex-1 bg-background"
          role="main"
          aria-label="Dashboard content"
        >
          <div className="w-full px-8 lg:px-12 py-8 lg:py-12">
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