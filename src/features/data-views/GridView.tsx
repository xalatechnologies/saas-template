'use client';

import React, { useState } from 'react';
import { MoreVertical, Grid2x2, Grid3x3, Square } from 'lucide-react';
import { Button, Checkbox } from '../ui';
import { GridLayout, FlexLayout } from './';
import { cn } from '@/utils';

export interface GridViewProps<T> {
  readonly data: T[];
  readonly renderCard: (item: T, index: number) => React.ReactNode;
  readonly columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3 | 4;
    desktop?: 3 | 4 | 5 | 6;
  };
  readonly gap?: 'sm' | 'md' | 'lg';
  readonly onItemClick?: (item: T, index: number) => void;
  readonly onItemSelect?: (items: T[]) => void;
  readonly selectedItems?: T[];
  readonly actions?: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: (item: T) => void;
    variant?: 'default' | 'destructive';
  }>;
  readonly loading?: boolean;
  readonly emptyMessage?: string;
  readonly showDensityControl?: boolean;
  readonly className?: string;
}

type GridDensity = 'compact' | 'normal' | 'comfortable';

/**
 * Grid view component for card-based displays
 * @returns JSX.Element
 */
export function GridView<T>({
  data,
  renderCard,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  onItemClick,
  onItemSelect,
  selectedItems = [],
  actions,
  loading = false,
  emptyMessage = 'No items to display',
  showDensityControl = false,
  className,
}: GridViewProps<T>): JSX.Element {
  const [density, setDensity] = useState<GridDensity>('normal');
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());

  const hasSelection = onItemSelect !== undefined;

  const handleItemSelect = (index: number, item: T) => {
    const newSelected = new Set(selectedIndexes);
    
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    
    setSelectedIndexes(newSelected);
    
    if (onItemSelect) {
      const selectedData = data.filter((_, i) => newSelected.has(i));
      onItemSelect(selectedData);
    }
  };

  const gaps = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const getGridClass = () => {
    const cols = [];
    if (columns.mobile) cols.push(`grid-cols-${columns.mobile}`);
    if (columns.tablet) cols.push(`sm:grid-cols-${columns.tablet}`);
    if (columns.desktop) cols.push(`lg:grid-cols-${columns.desktop}`);
    return cols.join(' ');
  };

  const densityPadding = {
    compact: 'p-4',
    normal: 'p-6',
    comfortable: 'p-8',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading items...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Grid3x3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Density Control */}
      {showDensityControl && (
        <div className="mb-4 flex justify-end">
          <div className="bg-muted rounded-lg p-1">
            <FlexLayout direction="row" align="center" gap="xs">
            <Button
              variant={density === 'compact' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDensity('compact')}
              className="rounded px-3"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={density === 'normal' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDensity('normal')}
              className="rounded px-3"
            >
              <Grid2x2 className="h-4 w-4" />
            </Button>
            <Button
              variant={density === 'comfortable' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDensity('comfortable')}
              className="rounded px-3"
            >
              <Square className="h-4 w-4" />
            </Button>
            </FlexLayout>
          </div>
        </div>
      )}

      {/* Grid */}
      <GridLayout
        columns={{
          mobile: columns.mobile || 1,
          tablet: columns.tablet || 2,
          desktop: columns.desktop || 3
        }}
        gap={gap}
      >
        {data.map((item, index) => {
          const isSelected = selectedIndexes.has(index);

          return (
            <GridItem
              key={index}
              item={item}
              index={index}
              isSelected={isSelected}
              hasSelection={hasSelection}
              onSelect={() => handleItemSelect(index, item)}
              onClick={() => onItemClick?.(item, index)}
              actions={actions}
              className={densityPadding[density]}
            >
              {renderCard(item, index)}
            </GridItem>
          );
        })}
      </GridLayout>
    </div>
  );
}

/**
 * Grid item wrapper component
 */
interface GridItemProps<T> {
  readonly item: T;
  readonly index: number;
  readonly isSelected: boolean;
  readonly hasSelection: boolean;
  readonly onSelect: () => void;
  readonly onClick?: () => void;
  readonly actions?: GridViewProps<T>['actions'];
  readonly children: React.ReactNode;
  readonly className?: string;
}

function GridItem<T>({
  item,
  index,
  isSelected,
  hasSelection,
  onSelect,
  onClick,
  actions,
  children,
  className,
}: GridItemProps<T>): JSX.Element {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={cn(
        'relative group bg-card border border-border rounded-xl overflow-hidden transition-all duration-200',
        onClick && 'cursor-pointer hover:border-primary hover:shadow-lg',
        isSelected && 'ring-2 ring-primary border-primary',
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Selection Checkbox */}
      {hasSelection && (
        <div className="absolute top-4 left-4 z-20">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            className="bg-background/80 backdrop-blur-sm"
            aria-label={`Select item ${index + 1}`}
          />
        </div>
      )}

      {/* Actions Menu */}
      {actions && actions.length > 0 && (
        <div
          className={cn(
            'absolute top-4 right-4 z-20 transition-opacity',
            showActions || isSelected ? 'opacity-100' : 'opacity-0'
          )}
        >
          <GridItemActions actions={actions} item={item} />
        </div>
      )}

      {/* Content */}
      {children}
    </div>
  );
}

/**
 * Grid item actions dropdown
 */
interface GridItemActionsProps<T> {
  readonly actions: NonNullable<GridViewProps<T>['actions']>;
  readonly item: T;
}

function GridItemActions<T>({ actions, item }: GridItemActionsProps<T>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="h-8 w-8 rounded-lg bg-background/80 backdrop-blur-sm"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-background border border-border rounded-lg shadow-xl z-50">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(item);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full px-4 py-2 text-sm text-left hover:bg-accent flex items-center space-x-2',
                    action.variant === 'destructive' && 'text-destructive hover:bg-destructive/10'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}