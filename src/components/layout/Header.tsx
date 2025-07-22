'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Bell, X, Search } from 'lucide-react';
import { useAuth, useUI } from '@/hooks';
import { Button, Avatar } from '../ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { GlobalSearch } from './GlobalSearch';
import { Container, FlexLayout } from '../layout';

interface HeaderProps {
  readonly children?: React.ReactNode;
  readonly showLogo?: boolean;
  readonly navigation?: readonly { href: string; label: string }[];
  readonly variant?: 'boxed' | 'full';
  readonly showSearch?: boolean;
}

/**
 * Application header component with navigation and user controls
 * Supports boxed layout for landing pages and full-width for dashboard
 * @returns React.ReactElement
 */
export const Header = ({ 
  children, 
  showLogo = false, 
  navigation,
  variant = 'full',
  showSearch = false
}: HeaderProps): React.ReactElement => {
  const { user, logout } = useAuth();
  const { toggleSidebar, t } = useUI();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Handles user logout action
   */
  const handleLogout = (): void => {
    logout();
  };

  const containerSize = variant === 'boxed' ? 'xl' : 'full';

  return (
    <header className="sticky top-0 z-40 h-20 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container size={containerSize} className="h-full">
        <FlexLayout 
          direction="row" 
          align="center" 
          justify="between"
          gap="lg"
          className="h-full"
        >
          {/* Left section */}
          <FlexLayout direction="row" align="center" gap="md">
            {/* Logo for WebLayout */}
            {showLogo && (
              <Link 
                href="/" 
                className="text-xl font-bold text-primary"
                aria-label={t('common.goToHome')}
              >
                <FlexLayout direction="row" align="center" gap="sm">
                  <span className="bg-primary text-primary-foreground rounded-xl px-3 py-2">TM</span>
                  <span className="hidden sm:block">TaskManager</span>
                </FlexLayout>
              </Link>
            )}
            
            {/* Mobile menu button */}
            {!showLogo ? (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={toggleSidebar}
                aria-label={t('common.openMenu')}
              >
                <Menu className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={t('common.toggleMenu')}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            )}

            {/* Navigation for WebLayout */}
            {showLogo && navigation && (
              <nav className="hidden lg:block">
                <FlexLayout direction="row" align="center" gap="xl">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href as any}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </FlexLayout>
              </nav>
            )}
          </FlexLayout>

          {/* Center - Global Search (only for dashboard) */}
          {user && showSearch && (
            <Container size="sm" className="flex-1 hidden md:block">
              <GlobalSearch
                onSearch={async (query, filters) => {
                  // TODO: Implement actual search functionality
                  console.log('Search:', query, filters);
                  // Mock search results for now
                  return [
                    {
                      id: '1',
                      type: 'task',
                      title: `Task containing "${query}"`,
                      subtitle: 'In progress • High priority',
                      url: '/tasks/1'
                    },
                    {
                      id: '2', 
                      type: 'page',
                      title: 'Dashboard',
                      subtitle: 'Main dashboard page',
                      url: '/dashboard'
                    }
                  ];
                }}
                placeholder={t('search.placeholder')}
                variant="dropdown"
                showShortcut
              />
            </Container>
          )}

          {/* Right section */}
          <FlexLayout direction="row" align="center" gap="sm">
            {/* Additional actions (e.g., Assistant button) */}
            {children}

            {/* Search button for mobile (only for dashboard) */}
            {user && showSearch && (
              <Button
                size="icon"
                variant="ghost"
                aria-label={t('search.openSearch')}
                className="md:hidden"
                onClick={() => {
                  // TODO: Open mobile search modal
                }}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Notifications */}
            <Button
              size="icon"
              variant="ghost"
              aria-label={t('common.notifications')}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Button>

            {/* User menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    aria-label={t('common.userMenu')}
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      fallback={user.name.charAt(0).toUpperCase()}
                      size="sm"
                      className="h-8 w-8"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <FlexLayout direction="column" gap="xs">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </FlexLayout>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={'/profile' as any} className="flex w-full">
                      {t('navigation.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={'/settings' as any} className="flex w-full">
                      {t('navigation.settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>{t('auth.logout')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </FlexLayout>
        </FlexLayout>
      </Container>

      {/* Mobile Menu - only for WebLayout */}
      {showLogo && mobileMenuOpen && navigation && (
        <Container size={containerSize} className="lg:hidden py-6 border-t border-border">
          <FlexLayout direction="column" gap="md">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href as any}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <FlexLayout direction="column" gap="sm">
                {/* LanguageSelector will be in children */}
                {/* Additional mobile actions will be rendered from children */}
                <FlexLayout direction="column" gap="xs">
                  {children}
                </FlexLayout>
              </FlexLayout>
            </div>
          </FlexLayout>
        </Container>
      )}
    </header>
  );
};