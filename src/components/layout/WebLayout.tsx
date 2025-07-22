'use client';

import React, { useState } from 'react';
import { BaseLayout } from './BaseLayout';
import { Header } from './Header';
import { Footer } from './Footer';
import { MainContent } from './MainContent';
import { RightDrawer } from './RightDrawer';
import { WebNavigation, getWebNavItems } from './WebNavigation';
import { useUI } from '@/hooks';

interface WebLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * Web layout for public pages using BaseLayout composition
 * Features boxed header and footer with marketing navigation
 * @returns JSX.Element
 */
export const WebLayout = ({ children }: WebLayoutProps): JSX.Element => {
  const { t } = useUI();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <BaseLayout
      variant="web"
      header={
        <Header showLogo navigation={getWebNavItems(t)} variant="boxed">
          <WebNavigation />
        </Header>
      }
      footer={<Footer />}
      rightDrawer={
        <RightDrawer 
          isOpen={drawerOpen} 
          onClose={() => setDrawerOpen(false)}
          title={t('ui.assistant')}
        >
          {/* Chatbot content will go here */}
        </RightDrawer>
      }
    >
      <MainContent variant="web">
        {children}
      </MainContent>
    </BaseLayout>
  );
};