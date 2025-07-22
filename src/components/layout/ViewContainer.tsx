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
import { Button, Select, Badge } from '../ui';
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
      <div className={cn('flex flex-col space-y-4', className)}>
        {/* Header Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-border">
          <div className="flex items-center space-x-4">
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
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {selectedItems > 0 && (
                  <>
                    <Badge variant="secondary" className="rounded-lg">
                      {selectedItems} selected
                    </Badge>
                    <span>of</span>
                  </>
                )}
                <span>{totalItems} items</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                className="rounded-xl"
                aria-label="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            {onExport && (
              <Button
                variant="outline"
                size="icon"
                onClick={onExport}
                className="rounded-xl"
                aria-label="Export"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
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
    <div className="flex items-center rounded-xl border border-border p-1">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = currentView === view.id;

        return (
          <Button
            key={view.id}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange(view.id)}
            disabled={view.disabled}
            className={cn(
              'rounded-lg px-3',
              isActive && 'shadow-md'
            )}
            aria-label={`Switch to ${view.label} view`}
          >
            <Icon className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">{view.label}</span>
          </Button>
        );
      })}
    </div>
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