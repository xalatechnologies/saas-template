'use client';

import React, { useState, createContext, useContext } from 'react';
import { 
  Grid3x3, 
  List, 
  Table2, 
  Map, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Settings2
} from 'lucide-react';
import { Button, Select, Badge } from '@/components';
import { FlexLayout, Container } from '@/components/layout';
import { cn } from '@/utils';

export type ViewType = 'table' | 'grid' | 'list' | 'map' | 'calendar';

interface ViewOption {
  readonly id: ViewType;
  readonly label: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly disabled?: boolean;
}

interface ViewContainerProps {
  readonly children: React.ReactNode;
  readonly defaultView?: ViewType;
  readonly availableViews?: ViewType[];
  readonly onViewChange?: (view: ViewType) => void;
  readonly totalItems?: number;
  readonly selectedItems?: number;
  readonly onRefresh?: () => void;
  readonly onExport?: () => void;
  readonly showViewSwitcher?: boolean;
  readonly showItemCount?: boolean;
  readonly className?: string;
}

interface ViewContainerContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  availableViews: ViewType[];
}

const ViewContainerContext = createContext<ViewContainerContextType | null>(null);

export const useViewContainer = () => {
  const context = useContext(ViewContainerContext);
  if (!context) {
    throw new Error('useViewContainer must be used within ViewContainer');
  }
  return context;
};

const viewOptions: ViewOption[] = [
  { id: 'table', label: 'Table', icon: Table2 },
  { id: 'grid', label: 'Grid', icon: Grid3x3 },
  { id: 'list', label: 'List', icon: List },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
];

/**
 * View container component that manages different view types
 * @returns JSX.Element
 */
export const ViewContainer = ({
  children,
  defaultView = 'table',
  availableViews = ['table', 'grid', 'list'],
  onViewChange,
  totalItems = 0,
  selectedItems = 0,
  onRefresh,
  onExport,
  showViewSwitcher = true,
  showItemCount = true,
  className,
}: ViewContainerProps): JSX.Element => {
  const [currentView, setCurrentView] = useState<ViewType>(defaultView);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    onViewChange?.(view);
  };

  const contextValue: ViewContainerContextType = {
    currentView,
    setCurrentView: handleViewChange,
    availableViews,
  };

  const availableViewOptions = viewOptions.filter(option => 
    availableViews.includes(option.id)
  );

  return (
    <ViewContainerContext.Provider value={contextValue}>
      <FlexLayout direction="column" gap="lg" className={className}>
        {/* Header Bar */}
        <FlexLayout 
          direction="row" 
          align="center" 
          justify="between" 
          wrap
          gap="lg"
          className="pb-6 border-b border-border"
        >
          <FlexLayout direction="row" align="center" gap="lg">
            {/* View Switcher */}
            {showViewSwitcher && availableViewOptions.length > 1 && (
              <ViewSwitcher
                views={availableViewOptions}
                currentView={currentView}
                onChange={handleViewChange}
              />
            )}

            {/* Item Count */}
            {showItemCount && (
              <FlexLayout direction="row" align="center" gap="md" className="text-base text-muted-foreground">
                {selectedItems > 0 && (
                  <>
                    <Badge variant="secondary" className="rounded-2xl">
                      {selectedItems} selected
                    </Badge>
                    <span>of</span>
                  </>
                )}
                <span>{totalItems} items</span>
              </FlexLayout>
            )}
          </FlexLayout>

          {/* Actions */}
          <FlexLayout direction="row" align="center" gap="md">
            {onRefresh && (
              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                className="rounded-2xl h-12 w-12"
                aria-label="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            )}
            {onExport && (
              <Button
                variant="outline"
                size="icon"
                onClick={onExport}
                className="rounded-2xl h-12 w-12"
                aria-label="Export"
              >
                <Download className="h-5 w-5" />
              </Button>
            )}
          </FlexLayout>
        </FlexLayout>

        {/* View Content */}
        <div className="flex-1">
          {children}
        </div>
      </FlexLayout>
    </ViewContainerContext.Provider>
  );
};

/**
 * View switcher component
 */
interface ViewSwitcherProps {
  readonly views: ViewOption[];
  readonly currentView: ViewType;
  readonly onChange: (view: ViewType) => void;
}

const ViewSwitcher = ({ views, currentView, onChange }: ViewSwitcherProps): JSX.Element => {
  return (
    <FlexLayout 
      direction="row" 
      align="center" 
      gap="xs"
      className="rounded-2xl border border-border p-4"
    >
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = currentView === view.id;

        return (
          <Button
            key={view.id}
            variant={isActive ? 'default' : 'ghost'}
            size="default"
            onClick={() => onChange(view.id)}
            disabled={view.disabled}
            className={cn(
              'rounded-2xl px-6 h-12',
              isActive && 'shadow-lg'
            )}
            aria-label={`Switch to ${view.label} view`}
          >
            <Icon className="h-5 w-5" />
            <span className="ml-4 hidden sm:inline">{view.label}</span>
          </Button>
        );
      })}
    </FlexLayout>
  );
};

/**
 * View content wrapper that only renders when active
 */
interface ViewContentProps {
  readonly children: React.ReactNode;
  readonly viewType: ViewType;
  readonly className?: string;
}

export const ViewContent = ({ children, viewType, className }: ViewContentProps): JSX.Element | null => {
  const { currentView } = useViewContainer();

  if (currentView !== viewType) {
    return null;
  }

  return (
    <div className={cn('animate-in fade-in-0', className)}>
      {children}
    </div>
  );
};