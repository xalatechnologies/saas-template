'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Download,
  CheckSquare,
  Square,
  Filter
} from 'lucide-react';
import { Button, Checkbox, Input, Badge } from '@/components';
import { FlexLayout, Container } from '@/components/layout';
import { cn } from '@/utils';

export interface Column<T> {
  readonly id: string;
  readonly header: string;
  readonly accessor: keyof T | ((item: T) => any);
  readonly sortable?: boolean;
  readonly filterable?: boolean;
  readonly width?: string;
  readonly minWidth?: string;
  readonly maxWidth?: string;
  readonly sticky?: 'left' | 'right';
  readonly align?: 'left' | 'center' | 'right';
  readonly render?: (value: any, item: T, index: number) => React.ReactNode;
}

export interface TableViewProps<T> {
  readonly data: T[];
  readonly columns: Column<T>[];
  readonly onSort?: (column: string, direction: 'asc' | 'desc') => void;
  readonly onFilter?: (column: string, value: string) => void;
  readonly onRowClick?: (item: T, index: number) => void;
  readonly onRowSelect?: (items: T[]) => void;
  readonly selectedRows?: T[];
  readonly actions?: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: (item: T) => void;
    variant?: 'default' | 'destructive';
  }>;
  readonly bulkActions?: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: (items: T[]) => void;
    variant?: 'default' | 'destructive';
  }>;
  readonly stickyHeader?: boolean;
  readonly striped?: boolean;
  readonly hover?: boolean;
  readonly compact?: boolean;
  readonly loading?: boolean;
  readonly emptyMessage?: string;
  readonly className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

/**
 * Table view component with advanced grid functionality
 * @returns JSX.Element
 */
export function TableView<T extends Record<string, any>>({
  data,
  columns,
  onSort,
  onFilter,
  onRowClick,
  onRowSelect,
  selectedRows = [],
  actions,
  bulkActions,
  stickyHeader = true,
  striped = true,
  hover = true,
  compact = false,
  loading = false,
  emptyMessage = 'No data available',
  className,
}: TableViewProps<T>): JSX.Element {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (!onSort) return;

    let newDirection: SortDirection = 'asc';
    
    if (sortColumn === columnId) {
      if (sortDirection === 'asc') newDirection = 'desc';
      else if (sortDirection === 'desc') newDirection = null;
    }

    setSortColumn(newDirection ? columnId : null);
    setSortDirection(newDirection);
    
    if (newDirection) {
      onSort(columnId, newDirection);
    }
  };

  // Handle filtering
  const handleFilter = (columnId: string, value: string) => {
    setColumnFilters({ ...columnFilters, [columnId]: value });
    onFilter?.(columnId, value);
  };

  // Handle row selection
  const handleRowSelect = (index: number, item: T) => {
    const newSelected = new Set(selectedRowIds);
    
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    
    setSelectedRowIds(newSelected);
    
    if (onRowSelect) {
      const selectedItems = data.filter((_, i) => newSelected.has(i));
      onRowSelect(selectedItems);
    }
  };

  const handleSelectAll = () => {
    if (selectedRowIds.size === data.length) {
      setSelectedRowIds(new Set());
      onRowSelect?.([]);
    } else {
      const allIds = new Set(data.map((_, i) => i));
      setSelectedRowIds(allIds);
      onRowSelect?.(data);
    }
  };

  // Get cell value
  const getCellValue = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor];
  };

  const hasActions = actions && actions.length > 0;
  const hasSelection = onRowSelect !== undefined;

  return (
    <div className={cn('w-full', className)}>
      {/* Bulk Actions Bar */}
      {bulkActions && selectedRowIds.size > 0 && (
        <div className="mb-6 p-6 bg-accent rounded-2xl">
          <FlexLayout direction="row" align="center" justify="between">
            <span className="text-base font-medium">
              {selectedRowIds.size} item{selectedRowIds.size !== 1 ? 's' : ''} selected
            </span>
            <FlexLayout direction="row" align="center" gap="md">
            {bulkActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant={action.variant || 'outline'}
                  size="default"
                  onClick={() => {
                    const selectedItems = data.filter((_, i) => selectedRowIds.has(i));
                    action.onClick(selectedItems);
                  }}
                  className="rounded-xl h-12"
                >
                  {Icon && <Icon className="h-5 w-5 mr-4" />}
                  {action.label}
                </Button>
              );
            })}
            </FlexLayout>
          </FlexLayout>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full">
          {/* Header */}
          <thead className={cn(
            'bg-muted/50',
            stickyHeader && 'sticky top-0 z-10'
          )}>
            <tr className="border-b border-border">
              {/* Selection Column */}
              {hasSelection && (
                <th className="w-16 px-6 py-4">
                  <Checkbox
                    checked={selectedRowIds.size === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </th>
              )}

              {/* Data Columns */}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    'px-8 py-4 text-left text-base font-semibold text-foreground',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sticky === 'left' && 'sticky left-0 bg-muted/50',
                    column.sticky === 'right' && 'sticky right-0 bg-muted/50',
                    compact && 'py-3'
                  )}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                  }}
                >
                  <FlexLayout direction="row" align="center" gap="md">
                    <span>{column.header}</span>
                    
                    {/* Sort Indicator */}
                    {column.sortable && onSort && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSort(column.id)}
                        className="h-12 w-12 rounded-xl"
                      >
                        {sortColumn === column.id ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    )}
                  </FlexLayout>

                  {/* Column Filter */}
                  {column.filterable && onFilter && (
                    <div className="mt-4">
                      <Input
                        value={columnFilters[column.id] || ''}
                        onChange={(e) => handleFilter(column.id, e.target.value)}
                        placeholder="Filter..."
                        className="h-16 text-base rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </th>
              ))}

              {/* Actions Column */}
              {hasActions && (
                <th className="w-24 px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (hasSelection ? 1 : 0) + (hasActions ? 1 : 0)}
                  className="px-8 py-16 text-center"
                >
                  <FlexLayout direction="column" align="center" justify="center" gap="lg">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-base text-muted-foreground">Loading...</p>
                  </FlexLayout>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasSelection ? 1 : 0) + (hasActions ? 1 : 0)}
                  className="px-8 py-16 text-center"
                >
                  <p className="text-muted-foreground">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isSelected = selectedRowIds.has(index);

                return (
                  <tr
                    key={index}
                    onClick={() => onRowClick?.(item, index)}
                    className={cn(
                      'border-b border-border transition-colors',
                      striped && index % 2 === 1 && 'bg-muted/30',
                      hover && 'hover:bg-accent',
                      isSelected && 'bg-accent',
                      onRowClick && 'cursor-pointer'
                    )}
                  >
                    {/* Selection Cell */}
                    {hasSelection && (
                      <td className="w-16 px-6 py-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleRowSelect(index, item)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}

                    {/* Data Cells */}
                    {columns.map((column) => {
                      const value = getCellValue(item, column);
                      const content = column.render
                        ? column.render(value, item, index)
                        : value?.toString() || '-';

                      return (
                        <td
                          key={column.id}
                          className={cn(
                            'px-8 py-4 text-base',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right',
                            column.sticky === 'left' && 'sticky left-0 bg-background',
                            column.sticky === 'right' && 'sticky right-0 bg-background',
                            compact && 'py-3'
                          )}
                        >
                          {content}
                        </td>
                      );
                    })}

                    {/* Actions Cell */}
                    {hasActions && (
                      <td className="w-24 px-6 py-4 text-right">
                        <RowActions actions={actions} item={item} />
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Row actions dropdown component
 */
interface RowActionsProps<T> {
  readonly actions: TableViewProps<T>['actions'];
  readonly item: T;
}

function RowActions<T>({ actions, item }: RowActionsProps<T>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  if (!actions || actions.length === 0) return <></>;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="h-12 w-12 rounded-xl"
      >
        <MoreHorizontal className="h-5 w-5" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-2xl shadow-xl z-50">
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
                    'w-full px-6 py-4 text-base text-left hover:bg-accent flex items-center gap-4',
                    action.variant === 'destructive' && 'text-destructive hover:bg-destructive/10'
                  )}
                >
                  {Icon && <Icon className="h-5 w-5" />}
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