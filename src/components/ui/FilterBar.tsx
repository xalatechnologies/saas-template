'use client';

import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  Search,
  Calendar,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  Save
} from 'lucide-react';
import { Button, Input, Badge, Select, Checkbox, Label } from './';
import { FlexLayout, GridLayout } from '../layout';
import { cn } from '@/utils';

export interface FilterOption {
  readonly id: string;
  readonly label: string;
  readonly type: 'select' | 'multiselect' | 'date' | 'daterange' | 'search' | 'toggle';
  readonly options?: Array<{ value: string; label: string }>;
  readonly placeholder?: string;
  readonly icon?: React.ComponentType<{ className?: string }>;
}

export interface FilterValue {
  [key: string]: any;
}

interface FilterBarProps {
  readonly filters: FilterOption[];
  readonly values: FilterValue;
  readonly onChange: (values: FilterValue) => void;
  readonly onReset?: () => void;
  readonly onSave?: (name: string) => void;
  readonly savedFilters?: Array<{ id: string; name: string; filters: FilterValue }>;
  readonly showSearch?: boolean;
  readonly searchValue?: string;
  readonly onSearchChange?: (value: string) => void;
  readonly variant?: 'inline' | 'dropdown' | 'sidebar';
  readonly className?: string;
}

interface FilterDropdownProps {
  readonly filter: FilterOption;
  readonly value: any;
  readonly onChange: (value: any) => void;
}

/**
 * Filter bar component for data filtering
 * @returns JSX.Element
 */
export const FilterBar = ({
  filters,
  values,
  onChange,
  onReset,
  onSave,
  savedFilters,
  showSearch = true,
  searchValue = '',
  onSearchChange,
  variant = 'inline',
  className,
}: FilterBarProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFiltersCount = Object.values(values).filter(v => 
    v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  const handleFilterChange = (filterId: string, value: any) => {
    onChange({
      ...values,
      [filterId]: value,
    });
  };

  const handleReset = () => {
    onChange({});
    onReset?.();
  };

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-xl"
        >
          <Filter style={{ height: 'var(--icon-sm)', width: 'var(--icon-sm)', marginRight: 'var(--spacing-sm)' }} />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" style={{ marginLeft: 'var(--spacing-sm)' }}>
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className={cn(
            'transition-transform',
            isExpanded && 'rotate-180'
          )} style={{ height: 'var(--icon-sm)', width: 'var(--icon-sm)', marginLeft: 'var(--spacing-sm)' }} />
        </Button>

        {isExpanded && (
          <div className="absolute top-full left-0 bg-background border border-border rounded-2xl shadow-2xl z-50" style={{ marginTop: 'var(--spacing-sm)', width: '384px', padding: 'var(--spacing-lg)' }}>
            <FilterContent
              filters={filters}
              values={values}
              onChange={onChange}
              onReset={handleReset}
              showSearch={showSearch}
              searchValue={searchValue}
              onSearchChange={onSearchChange}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('bg-muted/30 rounded-2xl', className)} style={{ padding: 'var(--spacing-lg)' }}>
      <FilterContent
        filters={filters}
        values={values}
        onChange={onChange}
        onReset={handleReset}
        onSave={onSave}
        savedFilters={savedFilters}
        showSearch={showSearch}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        showAdvanced={showAdvanced}
        onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
      />
    </div>
  );
};

/**
 * Filter content component
 */
interface FilterContentProps {
  readonly filters: FilterOption[];
  readonly values: FilterValue;
  readonly onChange: (values: FilterValue) => void;
  readonly onReset: () => void;
  readonly onSave?: (name: string) => void;
  readonly savedFilters?: Array<{ id: string; name: string; filters: FilterValue }>;
  readonly showSearch?: boolean;
  readonly searchValue?: string;
  readonly onSearchChange?: (value: string) => void;
  readonly showAdvanced?: boolean;
  readonly onToggleAdvanced?: () => void;
}

const FilterContent = ({
  filters,
  values,
  onChange,
  onReset,
  onSave,
  savedFilters,
  showSearch,
  searchValue,
  onSearchChange,
  showAdvanced,
  onToggleAdvanced,
}: FilterContentProps): JSX.Element => {
  const basicFilters = filters.slice(0, 3);
  const advancedFilters = filters.slice(3);

  return (
    <FlexLayout direction="column" gap="lg">
      {/* Search */}
      {showSearch && onSearchChange && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="rounded-2xl"
            style={{ paddingLeft: 'var(--spacing-3xl)' }}
          />
        </div>
      )}

      {/* Saved Filters */}
      {savedFilters && savedFilters.length > 0 && (
        <div>
          <Label className="text-base font-medium mb-4">Quick Filters</Label>
          <FlexLayout direction="row" wrap gap="lg">
            {savedFilters.map((saved) => (
              <Button
                key={saved.id}
                variant="outline"
                size="default"
                onClick={() => onChange(saved.filters)}
                className="rounded-xl"
              >
                {saved.name}
              </Button>
            ))}
          </FlexLayout>
        </div>
      )}

      {/* Basic Filters */}
      <GridLayout columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
        {basicFilters.map((filter) => (
          <FilterDropdown
            key={filter.id}
            filter={filter}
            value={values[filter.id]}
            onChange={(value) => onChange({ ...values, [filter.id]: value })}
          />
        ))}
      </GridLayout>

      {/* Advanced Filters */}
      {advancedFilters.length > 0 && (
        <>
          {onToggleAdvanced && (
            <Button
              variant="ghost"
              size="default"
              onClick={onToggleAdvanced}
              className="w-full rounded-xl"
            >
              <SlidersHorizontal className="h-5 w-5 mr-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
              <ChevronDown className={cn(
                'h-5 w-5 ml-4 transition-transform',
                showAdvanced && 'rotate-180'
              )} />
            </Button>
          )}

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-border">
              {advancedFilters.map((filter) => (
                <FilterDropdown
                  key={filter.id}
                  filter={filter}
                  value={values[filter.id]}
                  onChange={(value) => onChange({ ...values, [filter.id]: value })}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="default"
            onClick={onReset}
            className="rounded-xl"
          >
            <RotateCcw className="h-5 w-5 mr-4" />
            Reset
          </Button>
          {onSave && (
            <Button
              variant="ghost"
              size="default"
              onClick={() => {
                const name = prompt('Save filter as:');
                if (name) onSave(name);
              }}
              className="rounded-xl"
            >
              <Save className="h-5 w-5 mr-4" />
              Save
            </Button>
          )}
        </div>
        <div className="text-base text-muted-foreground">
          {Object.keys(values).length} filters active
        </div>
      </div>
    </div>
  );
};

/**
 * Filter dropdown component
 */
const FilterDropdown = ({ filter, value, onChange }: FilterDropdownProps): JSX.Element => {
  const Icon = filter.icon;

  switch (filter.type) {
    case 'select':
      return (
        <div>
          <Label className="text-base mb-2">{filter.label}</Label>
          <Select
            value={value || ''}
            onValueChange={onChange}
          >
            <option value="">{filter.placeholder || 'All'}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      );

    case 'multiselect':
      return (
        <div>
          <Label className="text-base mb-2">{filter.label}</Label>
          <div className="space-y-4 max-h-48 overflow-y-auto p-4 border border-border rounded-xl">
            {filter.options?.map((option) => {
              const isChecked = Array.isArray(value) && value.includes(option.value);
              
              return (
                <label
                  key={option.value}
                  className="flex items-center space-x-4 cursor-pointer"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (checked) {
                        onChange([...currentValues, option.value]);
                      } else {
                        onChange(currentValues.filter(v => v !== option.value));
                      }
                    }}
                  />
                  <span className="text-base">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      );

    case 'date':
      return (
        <div>
          <Label className="text-base mb-2">{filter.label}</Label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="date"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="pl-12 rounded-xl"
            />
          </div>
        </div>
      );

    case 'toggle':
      return (
        <label className="flex items-center space-x-4 cursor-pointer">
          <Checkbox
            checked={value || false}
            onCheckedChange={onChange}
          />
          <span className="text-base font-medium">{filter.label}</span>
        </label>
      );

    default:
      return (
        <div>
          <Label className="text-base mb-2">{filter.label}</Label>
          <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />}
            <Input
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={filter.placeholder}
              className={cn('rounded-xl', Icon && 'pl-12')}
            />
          </div>
        </div>
      );
  }
};

/**
 * Active filters display component
 */
interface ActiveFiltersProps {
  readonly filters: FilterOption[];
  readonly values: FilterValue;
  readonly onChange: (values: FilterValue) => void;
  readonly className?: string;
}

export const ActiveFilters = ({
  filters,
  values,
  onChange,
  className,
}: ActiveFiltersProps): JSX.Element | null => {
  const activeFilters = filters.filter(f => values[f.id] !== undefined && values[f.id] !== '');

  if (activeFilters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-4', className)}>
      {activeFilters.map((filter) => {
        const value = values[filter.id];
        const displayValue = Array.isArray(value) ? `${value.length} selected` : value;

        return (
          <Badge
            key={filter.id}
            variant="secondary"
            className="rounded-xl pl-4 pr-2 py-2"
          >
            <span className="text-base">
              {filter.label}: {displayValue}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const newValues = { ...values };
                delete newValues[filter.id];
                onChange(newValues);
              }}
              className="h-6 w-6 ml-2 rounded-xl"
            >
              <X className="h-4 w-4" />
            </Button>
          </Badge>
        );
      })}
    </div>
  );
};