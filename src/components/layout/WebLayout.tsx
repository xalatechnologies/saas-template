'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MessageSquare } from 'lucide-react';
import { Button } from '../ui';
import { RightDrawer } from './RightDrawer';
import { SkipLinks } from '@/components';
import { cn } from '@/utils';
import { useUI } from '@/hooks';

interface WebLayoutProps {
  readonly children: React.ReactNode;
}

interface NavItem {
  readonly href: string;
  readonly label: string;
}

/**
 * Web layout component with header, body, footer, and right drawer
 * @returns JSX.Element
 */
export const WebLayout = ({ children }: WebLayoutProps): JSX.Element => {
  const { t } = useUI();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: '/', label: t('navigation.home') },
    { href: '/features', label: t('navigation.features') },
    { href: '/pricing', label: t('navigation.pricing') },
    { href: '/about', label: t('navigation.about') },
    { href: '/contact', label: t('navigation.contact') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SkipLinks />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between h-20" role="navigation">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-3 text-2xl font-bold text-primary"
              aria-label="Home"
            >
              <span className="bg-primary text-primary-foreground rounded-xl px-3 py-1">TM</span>
              <span>TaskManager</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
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
                <Button className="rounded-xl shadow-lg">
                  {t('auth.signup')}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-6 border-t border-border">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDrawerOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-xl w-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Assistant
                  </Button>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="rounded-xl w-full">
                      {t('auth.login')}
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="rounded-xl shadow-lg w-full">
                      {t('auth.signup')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1" role="main">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-auto">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
          </div>

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
    </div>
  );
};