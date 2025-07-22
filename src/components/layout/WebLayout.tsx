'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { Button, LanguageSelector } from '../ui';
import { FlexLayout, GridLayout } from './';
import { Header } from './Header';
import { RightDrawer } from './RightDrawer';
import { SkipLinks } from '@/components';
import { useUI } from '@/hooks';

interface WebLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * Web layout component with header, body, footer, and right drawer
 * @returns JSX.Element
 */
export const WebLayout = ({ children }: WebLayoutProps): JSX.Element => {
  const { t } = useUI();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { href: '/', label: t('navigation.home') },
    { href: '#features', label: t('navigation.features') },
    { href: '#pricing', label: t('navigation.pricing') },
    { href: '/about', label: t('navigation.about') },
    { href: '/contact', label: t('navigation.contact') },
  ];

  return (
    <FlexLayout direction="column" className="min-h-screen bg-background">
      <SkipLinks />
      
      {/* Header with web-specific navigation */}
      <Header showLogo navigation={navItems}>
        <>
          <FlexLayout direction="row" align="center" gap="lg" className="hidden lg:flex">
            <LanguageSelector />
            <Button
              variant="outline"
              onClick={() => setDrawerOpen(true)}
              className="rounded-xl"
              aria-label="Open assistant"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Assistant
            </Button>
            <Link href="/login">
              <Button variant="outline" className="rounded-xl">
                {t('auth.login')}
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-xl shadow-sm">
                {t('auth.signup')}
              </Button>
            </Link>
          </FlexLayout>
          
          {/* Mobile actions (only shown in mobile menu) */}
          <FlexLayout direction="row" justify="center" className="lg:hidden mb-3">
            <LanguageSelector />
          </FlexLayout>
          <Button
            variant="outline"
            onClick={() => {
              setDrawerOpen(true);
            }}
            className="rounded-xl w-full lg:hidden"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Assistant
          </Button>
          <Link href="/login" className="lg:hidden">
            <Button variant="outline" className="rounded-xl w-full">
              {t('auth.login')}
            </Button>
          </Link>
          <Link href="/signup" className="lg:hidden">
            <Button className="rounded-xl shadow-sm w-full">
              {t('auth.signup')}
            </Button>
          </Link>
        </>
      </Header>

      {/* Main Content */}
      <main id="main-content" className="flex-1" role="main">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-auto">
        <div className="container mx-auto px-6 py-12">
          <GridLayout columns={{ mobile: 1, tablet: 4 }} gap="lg">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">TaskManager</h3>
              <p className="text-muted-foreground mb-4">
                Professional task management solution for teams and individuals.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/gdpr" className="text-muted-foreground hover:text-foreground">
                    GDPR
                  </Link>
                </li>
              </ul>
            </div>
          </GridLayout>

          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 TaskManager. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Right Drawer */}
      <RightDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        title="AI Assistant"
      >
        {/* Chatbot content will go here */}
      </RightDrawer>
    </FlexLayout>
  );
};