'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Settings, X } from 'lucide-react';
import { useUI } from '@/hooks';
import { cn } from '@/utils';
import { Button } from '../ui';

/**
 * Navigation item interface
 */
interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

/**
 * Application sidebar component with navigation menu
 * @returns React.ReactElement
 */
export const Sidebar = (): React.ReactElement => {
  const { t, sidebarOpen, setSidebarOpen } = useUI();
  const pathname = usePathname();

  /**
   * Navigation items configuration
   */
  const navItems: NavItem[] = [
    {
      href: '/dashboard',
      label: t('navigation.dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: '/tasks',
      label: t('navigation.tasks'),
      icon: CheckSquare,
    },
    {
      href: '/settings',
      label: t('navigation.settings'),
      icon: Settings,
    },
  ];

  /**
   * Closes the sidebar (mobile)
   */
  const closeSidebar = (): void => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-80 transform border-r-2 border-border bg-card shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col bg-gradient-to-b from-card to-card/95">
          {/* Header */}
          <div className="flex h-24 items-center justify-between border-b-2 border-border px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg ring-2 ring-primary/20">
                <span className="text-lg font-black text-primary-foreground">TM</span>
              </div>
              <span className="text-xl font-bold text-foreground">Task Management</span>
            </div>

            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="default"
              onClick={closeSidebar}
              className="lg:hidden h-10 w-10"
              aria-label={t('common.close')}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-3 p-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-4 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:-translate-y-0.5',
                    isActive
                      ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={closeSidebar}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t-2 border-border p-8">
            <div className="text-sm text-muted-foreground font-medium">Task Management v1.0</div>
          </div>
        </div>
      </aside>
    </>
  );
};
