'use client';

import React, { useState } from 'react';
import { ChevronRight, MoreHorizontal, Grip } from 'lucide-react';
import { Button, Checkbox, Avatar } from '../ui';
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
    default: 'p-4',
    compact: 'p-3',
    comfortable: 'p-6',
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
          <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
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
    <div className={cn('w-full', className)}>
      {groupedData ? (
        // Grouped list
        groupedData.map(([groupName, { items, indexes }]) => (
          <div key={groupName} className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-4">
              {groupName}
            </h3>
            <div className="space-y-1">
              {items.map((item, i) => renderListItem(item, indexes[i]))}
            </div>
          </div>
        ))
      ) : (
        // Simple list
        <div className="space-y-1">
          {data.map((item, index) => renderListItem(item, index))}
        </div>
      )}
    </div>
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
    <div
      className={cn(
        'group flex items-center bg-card border border-border rounded-xl transition-all duration-200',
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
        <div className="px-2 cursor-move">
          <Grip className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {/* Selection */}
      {hasSelection && (
        <div className="px-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select item ${index + 1}`}
          />
        </div>
      )}

      {/* Avatar */}
      {data.avatar && (
        <div className="flex-shrink-0 px-2">
          {data.avatar}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate">
              {data.title}
            </h4>
            {data.subtitle && (
              <p className="text-sm text-muted-foreground truncate">
                {data.subtitle}
              </p>
            )}
            {data.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {data.description}
              </p>
            )}
            {data.badges && data.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.badges}
              </div>
            )}
          </div>

          {/* Metadata */}
          {data.metadata && (
            <div className="flex-shrink-0 ml-4">
              {data.metadata}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center px-2 space-x-2">
        {actions && actions.length > 0 && (
          <div className={cn(
            'transition-opacity',
            showActions || isSelected ? 'opacity-100' : 'opacity-0'
          )}>
            <ListItemActions actions={actions} item={item} />
          </div>
        )}
        
        {onClick && (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
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
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="h-8 w-8 rounded-lg"
      >
        <MoreHorizontal className="h-4 w-4" />
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

// Add missing import
import { useMemo } from 'react';
import { List } from 'lucide-react';