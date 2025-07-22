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
import { Button, Input, Badge, Select, Checkbox, Label } from '../ui';
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
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className={cn(
            'h-4 w-4 ml-2 transition-transform',
            isExpanded && 'rotate-180'
          )} />
        </Button>

        {isExpanded && (
          <div className="absolute top-full left-0 mt-2 w-96 bg-background border border-border rounded-xl shadow-2xl p-4 z-50">
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
    <div className={cn('bg-muted/30 rounded-xl p-4', className)}>
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
    <div className="space-y-4">
      {/* Search */}
      {showSearch && onSearchChange && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="pl-10 rounded-xl"
          />
        </div>
      )}

      {/* Saved Filters */}
      {savedFilters && savedFilters.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-2">Quick Filters</Label>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map((saved) => (
              <Button
                key={saved.id}
                variant="outline"
                size="sm"
                onClick={() => onChange(saved.filters)}
                className="rounded-lg"
              >
                {saved.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Basic Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {basicFilters.map((filter) => (
          <FilterDropdown
            key={filter.id}
            filter={filter}
            value={values[filter.id]}
            onChange={(value) => onChange({ ...values, [filter.id]: value })}
          />
        ))}
      </div>

      {/* Advanced Filters */}
      {advancedFilters.length > 0 && (
        <>
          {onToggleAdvanced && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleAdvanced}
              className="w-full rounded-lg"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
              <ChevronDown className={cn(
                'h-4 w-4 ml-2 transition-transform',
                showAdvanced && 'rotate-180'
              )} />
            </Button>
          )}

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border">
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
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="rounded-lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          {onSave && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const name = prompt('Save filter as:');
                if (name) onSave(name);
              }}
              className="rounded-lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
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
          <Label className="text-sm mb-1">{filter.label}</Label>
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
          <Label className="text-sm mb-1">{filter.label}</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto p-2 border border-border rounded-lg">
            {filter.options?.map((option) => {
              const isChecked = Array.isArray(value) && value.includes(option.value);
              
              return (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer"
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
                  <span className="text-sm">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      );

    case 'date':
      return (
        <div>
          <Label className="text-sm mb-1">{filter.label}</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>
        </div>
      );

    case 'toggle':
      return (
        <label className="flex items-center space-x-2 cursor-pointer">
          <Checkbox
            checked={value || false}
            onCheckedChange={onChange}
          />
          <span className="text-sm font-medium">{filter.label}</span>
        </label>
      );

    default:
      return (
        <div>
          <Label className="text-sm mb-1">{filter.label}</Label>
          <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
            <Input
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={filter.placeholder}
              className={cn('rounded-lg', Icon && 'pl-10')}
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
    <div className={cn('flex flex-wrap gap-2', className)}>
      {activeFilters.map((filter) => {
        const value = values[filter.id];
        const displayValue = Array.isArray(value) ? `${value.length} selected` : value;

        return (
          <Badge
            key={filter.id}
            variant="secondary"
            className="rounded-lg pl-3 pr-1 py-1"
          >
            <span className="text-xs">
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
              className="h-4 w-4 ml-1 rounded"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        );
      })}
    </div>
  );
};