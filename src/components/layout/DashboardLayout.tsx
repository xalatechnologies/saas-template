'use client';

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { BaseLayout } from './BaseLayout';
import { FlexLayout } from './GridLayout';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { Container } from './Container';
import { RightDrawer } from './RightDrawer';
import { Button, LanguageSelector } from '../ui';
import { useUI } from '@/hooks';

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * Dashboard layout with sidebar navigation using BaseLayout composition
 * Features full-width header with global search
 * @returns JSX.Element
 */
export const DashboardLayout = ({ children }: DashboardLayoutProps): JSX.Element => {
  const { t } = useUI();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <BaseLayout
      variant="dashboard"
      sidebar={<Sidebar />}
      header={
        <Header variant="full" showSearch>
          <FlexLayout direction="row" align="center" gap="xl">
            <LanguageSelector />
            <Button
              variant="outline"
              onClick={() => setDrawerOpen(true)}
              className="rounded-xl"
              aria-label={t('ui.openAssistant')}
            >
              <MessageSquare className="h-6 w-6 lg:mr-4" />
              <span className="hidden lg:inline">{t('ui.assistant')}</span>
            </Button>
          </FlexLayout>
        </Header>
      }
      rightDrawer={
        <RightDrawer 
          isOpen={drawerOpen} 
          onClose={() => setDrawerOpen(false)}
          title={t('ui.aiAssistant')}
        >
          {/* Chatbot content will go here */}
        </RightDrawer>
      }
    >
      <MainContent variant="dashboard" className="bg-background">
        <Container size="full" className="px-8 lg:px-12 py-8 lg:py-12">
          {children}
        </Container>
      </MainContent>
    </BaseLayout>
  );
};