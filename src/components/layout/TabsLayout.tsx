'use client';

import React, { useState } from 'react';
import { cn } from '@/utils';

interface Tab {
  readonly id: string;
  readonly label: string;
  readonly icon?: React.ComponentType<{ className?: string }>;
  readonly badge?: string | number;
  readonly disabled?: boolean;
}

interface TabsLayoutProps {
  readonly children: React.ReactNode;
  readonly tabs: Tab[];
  readonly defaultTab?: string;
  readonly variant?: 'default' | 'pills' | 'underline' | 'vertical';
  readonly onChange?: (tabId: string) => void;
  readonly className?: string;
}

interface TabPanelProps {
  readonly children: React.ReactNode;
  readonly tabId: string;
  readonly className?: string;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

const useTabs = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within TabsLayout');
  }
  return context;
};

/**
 * Tabs layout component for organizing content in tabs
 * @returns JSX.Element
 */
export const TabsLayout = ({
  children,
  tabs,
  defaultTab,
  variant = 'default',
  onChange,
  className,
}: TabsLayoutProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const tabStyles = {
    default: {
      container: 'border-b border-border',
      list: 'flex space-x-8',
      tab: 'px-4 py-4 text-base font-medium transition-all duration-200 border-b-2 -mb-px',
      active: 'text-foreground border-primary',
      inactive: 'text-muted-foreground border-transparent hover:text-foreground hover:border-border',
    },
    pills: {
      container: 'bg-muted/30 p-2 rounded-xl',
      list: 'flex space-x-2',
      tab: 'px-6 py-4 text-base font-medium rounded-xl transition-all duration-200',
      active: 'bg-background text-foreground shadow-lg',
      inactive: 'text-muted-foreground hover:text-foreground hover:bg-background/50',
    },
    underline: {
      container: '',
      list: 'flex space-x-8',
      tab: 'px-4 py-4 text-base font-medium transition-all duration-200 relative',
      active: 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-primary',
      inactive: 'text-muted-foreground hover:text-foreground',
    },
    vertical: {
      container: 'flex space-x-12',
      list: 'flex flex-col space-y-4 w-80',
      tab: 'px-6 py-4 text-base font-medium rounded-xl transition-all duration-200 text-left',
      active: 'bg-primary/10 text-primary border-l-4 border-primary',
      inactive: 'text-muted-foreground hover:bg-accent hover:text-foreground',
    },
  };

  const styles = tabStyles[variant];
  const isVertical = variant === 'vertical';

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn('w-full', className)}>
        <div className={styles.container}>
          <div
            className={styles.list}
            role="tablist"
            aria-orientation={isVertical ? 'vertical' : 'horizontal'}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.id}`}
                  disabled={tab.disabled}
                  onClick={() => !tab.disabled && handleTabChange(tab.id)}
                  className={cn(
                    styles.tab,
                    isActive ? styles.active : styles.inactive,
                    tab.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <span className="flex items-center space-x-4">
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span
                        className={cn(
                          'ml-4 px-4 py-2 text-base font-semibold rounded-xl',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          {isVertical && <div className="flex-1">{children}</div>}
        </div>
        {!isVertical && <div className="mt-8">{children}</div>}
      </div>
    </TabsContext.Provider>
  );
};

/**
 * Tab panel component for tab content
 * @returns JSX.Element | null
 */
export const TabPanel = ({ children, tabId, className }: TabPanelProps): JSX.Element | null => {
  const { activeTab } = useTabs();

  if (activeTab !== tabId) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      className={cn('animate-in fade-in-0 slide-in-from-bottom-4', className)}
    >
      {children}
    </div>
  );
};

export { useTabs };