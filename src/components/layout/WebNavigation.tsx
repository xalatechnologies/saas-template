'use client';

import Link from 'next/link';
import { Button, LanguageSelector } from '../ui';
import { FlexLayout } from './GridLayout';
import { useUI } from '@/hooks';

/**
 * Desktop navigation actions
 */
const DesktopActions = (): JSX.Element => {
  const { t } = useUI();
  
  return (
    <FlexLayout direction="row" align="center" gap="lg" className="hidden desktop:flex">
      <LanguageSelector />
      <Link href="/login">
        <Button variant="outline">
          {t('auth.login')}
        </Button>
      </Link>
      <Link href="/signup">
        <Button>
          {t('auth.signup')}
        </Button>
      </Link>
    </FlexLayout>
  );
};

/**
 * Mobile navigation actions
 */
const MobileActions = (): JSX.Element => {
  const { t } = useUI();
  
  return (
    <>
      {/* Mobile language selector */}
      <FlexLayout direction="row" justify="center" className="desktop:hidden">
        <LanguageSelector />
      </FlexLayout>
      
      {/* Mobile auth buttons */}
      <FlexLayout direction="column" gap="md" className="desktop:hidden">
        <Link href="/login">
          <Button variant="outline" className="w-full">
            {t('auth.login')}
          </Button>
        </Link>
        <Link href="/signup">
          <Button className="w-full">
            {t('auth.signup')}
          </Button>
        </Link>
      </FlexLayout>
    </>
  );
};

/**
 * Web navigation component that provides navigation items and actions
 * Used within Header component for web layout
 */
export const WebNavigation = (): JSX.Element => {
  return (
    <>
      <DesktopActions />
      <MobileActions />
    </>
  );
};

/**
 * Navigation items for web layout
 */
export const getWebNavItems = (t: (key: string) => string) => [
  { href: '/', label: t('navigation.home') },
  { href: '#features', label: t('navigation.features') },
  { href: '#pricing', label: t('navigation.pricing') },
  { href: '/about', label: t('navigation.about') },
  { href: '/contact', label: t('navigation.contact') },
];