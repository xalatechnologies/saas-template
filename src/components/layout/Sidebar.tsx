'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Settings, X } from 'lucide-react';
import { useUI } from '@/hooks';
import { cn } from '@/utils';
import { Button } from '../ui';
import { FlexLayout } from './';

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
          'fixed left-0 top-0 z-50 h-full w-80 transform border-r border-border bg-card transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="h-full bg-card">
          <FlexLayout direction="column" className="h-full">
          {/* Sidebar Brand - Aligned with main header */}
          <div className="h-20 px-8">
            <FlexLayout direction="row" align="center" justify="between" className="h-full">
            <FlexLayout direction="row" align="center" gap="lg">
              <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground shadow-lg">
                <FlexLayout direction="row" align="center" justify="center" className="h-full">
                  <span className="text-lg font-bold">TM</span>
                </FlexLayout>
              </div>
              <span className="text-xl font-semibold text-foreground">TaskManager</span>
            </FlexLayout>

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
            </FlexLayout>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={cn(
                    'flex items-center space-x-4 rounded-xl px-6 py-4 text-base font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
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
          <div className="border-t border-border p-8">
            <div className="text-base text-muted-foreground font-medium">Task Management v1.0</div>
          </div>
        </FlexLayout>
        </div>
      </aside>
    </>
  );
};
