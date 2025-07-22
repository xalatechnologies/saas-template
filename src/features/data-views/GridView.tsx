'use client';

import React, { useState } from 'react';
import { MoreVertical, Grid2x2, Grid3x3, Square } from 'lucide-react';
import { Button, Checkbox, GridLayout, FlexLayout, Container } from '@/components';
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


  const densityPadding = {
    compact: 'p-8',
    normal: 'p-12',
    comfortable: 'p-16',
  };

  if (loading) {
    return (
      <Container size="sm" centered>
        <FlexLayout direction="column" align="center" justify="center" gap="lg" className="py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading items...</p>
        </FlexLayout>
      </Container>
    );
  }

  if (data.length === 0) {
    return (
      <Container size="sm" centered>
        <FlexLayout direction="column" align="center" justify="center" gap="lg" className="py-24">
          <Grid3x3 className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </FlexLayout>
      </Container>
    );
  }

  return (
    <FlexLayout direction="column" gap="lg" className={cn('w-full', className)}>
      {/* Density Control */}
      {showDensityControl && (
        <FlexLayout direction="row" justify="end">
          <div className="bg-muted rounded-2xl p-2">
            <FlexLayout direction="row" align="center" gap="sm">
              <Button
                variant={density === 'compact' ? 'default' : 'ghost'}
                size="md"
                onClick={() => setDensity('compact')}
                className="h-12 px-6 rounded-xl"
              >
                <Grid3x3 className="h-5 w-5" />
              </Button>
              <Button
                variant={density === 'normal' ? 'default' : 'ghost'}
                size="md"
                onClick={() => setDensity('normal')}
                className="h-12 px-6 rounded-xl"
              >
                <Grid2x2 className="h-5 w-5" />
              </Button>
              <Button
                variant={density === 'comfortable' ? 'default' : 'ghost'}
                size="md"
                onClick={() => setDensity('comfortable')}
                className="h-12 px-6 rounded-xl"
              >
                <Square className="h-5 w-5" />
              </Button>
            </FlexLayout>
          </div>
        </FlexLayout>
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
    </FlexLayout>
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
        'relative group bg-card border border-border rounded-2xl overflow-hidden transition-all duration-200',
        onClick && 'cursor-pointer hover:border-primary hover:shadow-xl',
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
        className="h-12 w-12 rounded-2xl bg-background/80 backdrop-blur-sm"
      >
        <MoreVertical className="h-5 w-5" />
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
          <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
            <FlexLayout direction="column" gap="none">
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
                      'w-full px-6 py-4 text-sm text-left hover:bg-accent transition-colors',
                      action.variant === 'destructive' && 'text-destructive hover:bg-destructive/10'
                    )}
                  >
                    <FlexLayout direction="row" align="center" gap="md">
                      {Icon && <Icon className="h-5 w-5" />}
                      <span>{action.label}</span>
                    </FlexLayout>
                  </button>
                );
              })}
            </FlexLayout>
          </div>
        </>
      )}
    </div>
  );
}