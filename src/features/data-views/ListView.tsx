'use client';

import React, { useState, useMemo } from 'react';
import { ChevronRight, MoreHorizontal, Grip, List } from 'lucide-react';
import { Button, Checkbox } from '@/components';
import { FlexLayout, Container } from '@/components/layout';
import { cn } from '@/utils';

export interface ListViewProps<T> {
  readonly data: T[];
  readonly renderItem: (item: T, index: number) => {
    title: string;
    subtitle?: string;
    description?: string;
    avatar?: React.ReactNode;
    badges?: React.ReactNode[];
    metadata?: React.ReactNode;
  };
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
  readonly groupBy?: (item: T) => string;
  readonly sortable?: boolean;
  readonly onReorder?: (items: T[]) => void;
  readonly variant?: 'default' | 'compact' | 'comfortable';
  readonly loading?: boolean;
  readonly emptyMessage?: string;
  readonly className?: string;
}

/**
 * List view component for list displays
 * @returns JSX.Element
 */
export function ListView<T>({
  data,
  renderItem,
  onItemClick,
  onItemSelect,
  selectedItems = [],
  actions,
  groupBy,
  sortable = false,
  onReorder,
  variant = 'default',
  loading = false,
  emptyMessage = 'No items to display',
  className,
}: ListViewProps<T>): JSX.Element {
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  // Group items if groupBy is provided
  const groupedData = useMemo(() => {
    if (!groupBy) return null;

    const groups = new Map<string, { items: T[]; indexes: number[] }>();
    
    data.forEach((item, index) => {
      const group = groupBy(item);
      if (!groups.has(group)) {
        groups.set(group, { items: [], indexes: [] });
      }
      groups.get(group)!.items.push(item);
      groups.get(group)!.indexes.push(index);
    });

    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [data, groupBy]);

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newData = [...data];
    const [removed] = newData.splice(draggedIndex, 1);
    newData.splice(dropIndex, 0, removed);

    onReorder?.(newData);
    setDraggedIndex(null);
  };

  const padding = {
    default: 'p-6',
    compact: 'p-4',
    comfortable: 'p-8',
  };

  if (loading) {
    return (
      <Container size="lg" centered>
        <FlexLayout direction="column" align="center" justify="center" className="py-24">
          <FlexLayout direction="column" align="center" gap="lg">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading items...</p>
          </FlexLayout>
        </FlexLayout>
      </Container>
    );
  }

  if (data.length === 0) {
    return (
      <Container size="lg" centered>
        <FlexLayout direction="column" align="center" justify="center" className="py-24">
          <FlexLayout direction="column" align="center" gap="lg">
            <List className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </FlexLayout>
        </FlexLayout>
      </Container>
    );
  }

  const renderListItem = (item: T, index: number) => {
    const isSelected = selectedIndexes.has(index);
    const itemData = renderItem(item, index);

    return (
      <ListItem
        key={index}
        item={item}
        index={index}
        data={itemData}
        isSelected={isSelected}
        hasSelection={hasSelection}
        onSelect={() => handleItemSelect(index, item)}
        onClick={() => onItemClick?.(item, index)}
        actions={actions}
        sortable={sortable}
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
        isDragging={draggedIndex === index}
        className={padding[variant]}
      />
    );
  };

  return (
    <Container className={cn('w-full', className)}>
      {groupedData ? (
        // Grouped list
        groupedData.map(([groupName, { items, indexes }]) => (
          <FlexLayout key={groupName} direction="column" gap="md" className="mb-12">
            <h3 className="text-sm font-semibold text-muted-foreground px-6">
              {groupName}
            </h3>
            <FlexLayout direction="column" gap="xs">
              {items.map((item, i) => renderListItem(item, indexes[i]))}
            </FlexLayout>
          </FlexLayout>
        ))
      ) : (
        // Simple list
        <FlexLayout direction="column" gap="xs">
          {data.map((item, index) => renderListItem(item, index))}
        </FlexLayout>
      )}
    </Container>
  );
}

/**
 * List item component
 */
interface ListItemProps<T> {
  readonly item: T;
  readonly index: number;
  readonly data: ReturnType<ListViewProps<T>['renderItem']>;
  readonly isSelected: boolean;
  readonly hasSelection: boolean;
  readonly onSelect: () => void;
  readonly onClick?: () => void;
  readonly actions?: ListViewProps<T>['actions'];
  readonly sortable?: boolean;
  readonly onDragStart?: (e: React.DragEvent) => void;
  readonly onDragOver?: (e: React.DragEvent) => void;
  readonly onDrop?: (e: React.DragEvent) => void;
  readonly isDragging?: boolean;
  readonly className?: string;
}

function ListItem<T>({
  item,
  index,
  data,
  isSelected,
  hasSelection,
  onSelect,
  onClick,
  actions,
  sortable,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  className,
}: ListItemProps<T>): JSX.Element {
  const [showActions, setShowActions] = useState(false);

  return (
    <FlexLayout
      direction="row"
      align="center"
      className={cn(
        'group bg-card border border-border rounded-2xl transition-all duration-200',
        onClick && 'cursor-pointer hover:border-primary hover:shadow-md',
        isSelected && 'border-primary bg-accent',
        isDragging && 'opacity-50',
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      draggable={sortable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Drag Handle */}
      {sortable && (
        <FlexLayout className="px-4 cursor-move">
          <Grip className="h-6 w-6 text-muted-foreground" />
        </FlexLayout>
      )}

      {/* Selection */}
      {hasSelection && (
        <FlexLayout className="px-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select item ${index + 1}`}
          />
        </FlexLayout>
      )}

      {/* Avatar */}
      {data.avatar && (
        <FlexLayout className="flex-shrink-0 px-4">
          {data.avatar}
        </FlexLayout>
      )}

      {/* Content */}
      <FlexLayout direction="column" className="flex-1 min-w-0">
        <FlexLayout direction="row" justify="between" align="start">
          <FlexLayout direction="column" className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate">
              {data.title}
            </h4>
            {data.subtitle && (
              <p className="text-sm text-muted-foreground truncate">
                {data.subtitle}
              </p>
            )}
            {data.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {data.description}
              </p>
            )}
            {data.badges && data.badges.length > 0 && (
              <FlexLayout wrap gap="sm" className="mt-4">
                {data.badges}
              </FlexLayout>
            )}
          </FlexLayout>

          {/* Metadata */}
          {data.metadata && (
            <FlexLayout className="flex-shrink-0 ml-6">
              {data.metadata}
            </FlexLayout>
          )}
        </FlexLayout>
      </FlexLayout>

      {/* Actions */}
      <FlexLayout align="center" gap="sm" className="px-4">
        {actions && actions.length > 0 && (
          <FlexLayout className={cn(
            'transition-opacity',
            showActions || isSelected ? 'opacity-100' : 'opacity-0'
          )}>
            <ListItemActions actions={actions} item={item} />
          </FlexLayout>
        )}
        
        {onClick && (
          <ChevronRight className="h-6 w-6 text-muted-foreground" />
        )}
      </FlexLayout>
    </FlexLayout>
  );
}

/**
 * List item actions dropdown
 */
interface ListItemActionsProps<T> {
  readonly actions: NonNullable<ListViewProps<T>['actions']>;
  readonly item: T;
}

function ListItemActions<T>({ actions, item }: ListItemActionsProps<T>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FlexLayout className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="h-12 w-12 rounded-xl"
      >
        <MoreHorizontal className="h-6 w-6" />
      </Button>

      {isOpen && (
        <>
          <FlexLayout
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <FlexLayout 
            direction="column" 
            className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
          >
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
                  <FlexLayout direction="row" align="center" gap="sm">
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{action.label}</span>
                  </FlexLayout>
                </button>
              );
            })}
          </FlexLayout>
        </>
      )}
    </FlexLayout>
  );
}

