'use client';

import React from 'react';
import { Menu, Sun, Moon, Globe, Bell, Settings, LogOut } from 'lucide-react';
import { Button, Avatar } from '../ui';
import { useAuth, useUI } from '@/hooks';

/**
 * Application header component with navigation and user controls
 * @returns JSX.Element
 */
export const Header = (): JSX.Element => {
  const { user, logout } = useAuth();
  const { toggleSidebar, toggleTheme, theme, isDarkMode, t } = useUI();

  /**
   * Handles user logout action
   */
  const handleLogout = (): void => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-xl">
      <div className="container flex h-24 items-center space-x-8 px-8">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="default"
          className="lg:hidden h-12 w-12"
          onClick={toggleSidebar}
          aria-label={t('navigation.menu')}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Logo */}
        <div className="flex items-center space-x-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl ring-2 ring-primary/20">
            <span className="text-xl font-black text-primary-foreground">TM</span>
          </div>
          <h1 className="text-2xl font-black text-foreground">
            {t('dashboard.title')}
          </h1>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="default"
            className="h-12 w-12"
            onClick={toggleTheme}
            aria-label={!isDarkMode ? t('settings.darkTheme') : t('settings.lightTheme')}
          >
            {!isDarkMode ? (
              <Moon className="h-6 w-6" />
            ) : (
              <Sun className="h-6 w-6" />
            )}
          </Button>

          {/* Language selector */}
          <Button variant="ghost" size="default" className="h-12 w-12" aria-label={t('settings.language')}>
            <Globe className="h-6 w-6" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="default" className="h-12 w-12" aria-label={t('common.notifications')}>
            <Bell className="h-6 w-6" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="default" className="h-12 w-12" aria-label={t('navigation.settings')}>
            <Settings className="h-6 w-6" />
          </Button>

          {/* User menu */}
          {user && (
            <div className="flex items-center space-x-6 pl-4">
              <Avatar
                src={user.avatar}
                alt={user.name}
                fallback={user.name.charAt(0).toUpperCase()}
                size="lg"
              />
              <div className="hidden md:block">
                <div className="text-lg font-bold text-foreground">{user.name}</div>
                <div className="text-base text-muted-foreground">{user.email}</div>
              </div>
              <Button
                variant="ghost"
                size="default"
                className="h-12 w-12"
                onClick={handleLogout}
                aria-label={t('auth.logout')}
              >
                <LogOut className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};