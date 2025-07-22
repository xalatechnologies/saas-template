'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Search, 
  X, 
  Loader2,
  FileText,
  Hash,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Button, Input, Badge } from '../ui';
import { FlexLayout } from './';
import { cn } from '@/utils';
import { useUI } from '@/hooks';

interface SearchResult {
  readonly id: string;
  readonly type: 'page' | 'user' | 'task' | 'file' | 'action';
  readonly title: string;
  readonly subtitle?: string;
  readonly icon?: React.ComponentType<{ className?: string }>;
  readonly url?: string;
  readonly action?: () => void;
  readonly metadata?: Record<string, any>;
}

interface SearchCategory {
  readonly id: string;
  readonly label: string;
  readonly icon?: React.ComponentType<{ className?: string }>;
  readonly count?: number;
}

interface GlobalSearchProps {
  readonly onSearch: (query: string, filters?: SearchFilters) => Promise<SearchResult[]>;
  readonly placeholder?: string;
  readonly recentSearches?: string[];
  readonly trendingSearches?: string[];
  readonly categories?: SearchCategory[];
  readonly className?: string;
  readonly variant?: 'inline' | 'modal' | 'dropdown';
  readonly showFilters?: boolean;
  readonly showShortcut?: boolean;
}

interface SearchFilters {
  readonly category?: string;
  readonly dateRange?: 'today' | 'week' | 'month' | 'year' | 'all';
  readonly type?: string[];
}

interface SearchModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSearch: (query: string, filters?: SearchFilters) => Promise<SearchResult[]>;
  readonly recentSearches?: string[];
  readonly trendingSearches?: string[];
  readonly categories?: SearchCategory[];
}

/**
 * Global search component for header
 * @returns JSX.Element
 */
export const GlobalSearch = ({
  onSearch,
  placeholder,
  recentSearches = [],
  trendingSearches = [],
  categories = [],
  className,
  variant = 'inline',
  showFilters = true,
  showShortcut = true,
}: GlobalSearchProps): JSX.Element => {
  const { t } = useUI();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search
  const handleSearch = useCallback(async (searchQuery: string, searchFilters?: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await onSearch(searchQuery, searchFilters || filters);
      setResults(searchResults);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [onSearch, filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : -1
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > -1 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setQuery('');
        setResults([]);
        break;
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (result.action) {
      result.action();
    } else if (result.url) {
      window.location.href = result.url;
    }
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (variant === 'modal') {
          setIsOpen(true);
        } else {
          inputRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [variant]);

  if (variant === 'modal') {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className={cn('rounded-2xl', className)}
        >
          <Search style={{ height: 'var(--icon-sm)', width: 'var(--icon-sm)', marginRight: 'var(--spacing-sm)' }} />
          Search
          {showShortcut && (
            <kbd className="text-base bg-muted rounded-2xl" style={{ marginLeft: 'var(--spacing-sm)', paddingLeft: 'var(--spacing-sm)', paddingRight: 'var(--spacing-sm)', paddingTop: 'var(--spacing-xs)', paddingBottom: 'var(--spacing-xs)' }}>⌘K</kbd>
          )}
        </Button>
        <SearchModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSearch={onSearch}
          recentSearches={recentSearches}
          trendingSearches={trendingSearches}
          categories={categories}
        />
      </>
    );
  }

  return (
    <div ref={searchRef} className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute top-1/2 -translate-y-1/2 text-muted-foreground" style={{ left: 'var(--spacing-sm)', height: 'var(--icon-sm)', width: 'var(--icon-sm)' }} />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('search.placeholder')}
          className={cn(
            'border-border',
            variant === 'dropdown' ? 'w-full' : 'w-full'
          )}
          style={{ paddingLeft: 'var(--spacing-3xl)', paddingRight: 'var(--spacing-3xl)', height: 'var(--input-lg)' }}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute top-1/2 -translate-y-1/2 rounded-2xl" style={{ right: 'var(--spacing-xs)', height: 'var(--button-md)', width: 'var(--button-md)' }}"
          >
            <X style={{ height: 'var(--icon-sm)', width: 'var(--icon-sm)' }} />
          </Button>
        )}
        {showShortcut && !query && (
          <kbd className="absolute top-1/2 -translate-y-1/2 text-base bg-muted rounded-2xl" style={{ right: 'var(--spacing-sm)', paddingLeft: 'var(--spacing-sm)', paddingRight: 'var(--spacing-sm)', paddingTop: 'var(--spacing-xs)', paddingBottom: 'var(--spacing-xs)' }}>
            ⌘K
          </kbd>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[600px] overflow-y-auto" style={{ marginTop: 'var(--spacing-sm)' }}>
          {/* Filters */}
          {showFilters && categories.length > 0 && (
            <div className="border-b border-border" style={{ padding: 'var(--spacing-lg)' }}>
              <FlexLayout direction="row" align="center" justify="between" style={{ marginBottom: 'var(--spacing-sm)' }}>
                <span className="text-base font-semibold">{t('search.filters')}</span>
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => setFilters({})}
                  className="text-base"
                >
                  {t('search.clearFilters')}
                </Button>
              </FlexLayout>
              <FlexLayout direction="row" wrap gap="lg">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = filters.category === category.id;
                  
                  return (
                    <Button
                      key={category.id}
                      variant={isActive ? 'default' : 'outline'}
                      size="default"
                      onClick={() => setFilters({
                        ...filters,
                        category: isActive ? undefined : category.id
                      })}
                      className="rounded-2xl"
                    >
                      {Icon && <Icon style={{ height: 'var(--icon-size-sm)', width: 'var(--icon-size-sm)', marginRight: 'var(--spacing-xs)' }} />}
                      {category.label}
                      {category.count !== undefined && (
                        <Badge variant="secondary" className="text-base" style={{ marginLeft: 'var(--spacing-xs)' }}>
                          {category.count}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </FlexLayout>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center" style={{ padding: 'var(--spacing-xl)' }}>
              <Loader2 className="animate-spin mx-auto text-muted-foreground" style={{ height: 'var(--icon-size-md)', width: 'var(--icon-size-md)', marginBottom: 'var(--spacing-sm)' }} />
              <p className="text-base text-muted-foreground">{t('common.loading')}</p>
            </div>
          )}

          {/* Results */}
          {!isLoading && query && results.length > 0 && (
            <div style={{ paddingTop: 'var(--spacing-sm)', paddingBottom: 'var(--spacing-sm)' }}>
              {results.map((result, index) => {
                const Icon = result.icon || FileText;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      'w-full hover:bg-accent transition-colors',
                      isSelected && 'bg-accent'
                    )}
                    style={{ padding: 'var(--spacing-lg)' }}
                  >
                    <FlexLayout direction="row" align="center" gap="lg">
                      <div className="bg-primary/10 flex items-center justify-center flex-shrink-0 rounded-2xl" style={{ height: 'var(--size-md)', width: 'var(--size-md)' }}>
                        <Icon className="text-primary" style={{ height: 'var(--icon-size-sm)', width: 'var(--icon-size-sm)' }} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-base text-muted-foreground">{result.subtitle}</p>
                        )}
                      </div>
                      <ArrowRight className="text-muted-foreground" style={{ height: 'var(--icon-size-sm)', width: 'var(--icon-size-sm)' }} />
                    </FlexLayout>
                  </button>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {!isLoading && query && results.length === 0 && (
            <div className="text-center" style={{ padding: 'var(--spacing-xl)' }}>
              <Search className="text-muted-foreground mx-auto" style={{ height: 'var(--icon-size-lg)', width: 'var(--icon-size-lg)', marginBottom: 'var(--spacing-sm)' }} />
              <p className="font-medium text-foreground" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('search.noResults')}</p>
              <p className="text-base text-muted-foreground">
                {t('search.tryDifferentKeywords')}
              </p>
            </div>
          )}

          {/* Initial State */}
          {!query && (
            <div style={{ padding: 'var(--spacing-lg)' }}>
              <FlexLayout direction="column" gap="xl">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <FlexLayout direction="row" align="center" gap="sm" style={{ marginBottom: 'var(--spacing-sm)' }}>
                    <Clock style={{ height: 'var(--icon-size-sm)', width: 'var(--icon-size-sm)' }} />
                    <h3 className="text-base font-semibold text-muted-foreground">{t('search.recentSearches')}</h3>
                  </FlexLayout>
                  <FlexLayout direction="column" gap="sm">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="w-full text-left hover:bg-accent text-base rounded-2xl"
                        style={{ padding: 'var(--spacing-md)' }}
                      >
                        {search}
                      </button>
                    ))}
                  </FlexLayout>
                </div>
              )}

              {/* Trending Searches */}
              {trendingSearches.length > 0 && (
                <div>
                  <FlexLayout direction="row" align="center" gap="sm" style={{ marginBottom: 'var(--spacing-sm)' }}>
                    <TrendingUp style={{ height: 'var(--icon-size-sm)', width: 'var(--icon-size-sm)' }} />
                    <h3 className="text-base font-semibold text-muted-foreground">{t('search.trending')}</h3>
                  </FlexLayout>
                  <FlexLayout direction="row" wrap gap="lg">
                    {trendingSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="default"
                        onClick={() => setQuery(search)}
                        className="rounded-2xl"
                      >
                        <Hash style={{ height: 'var(--icon-size-sm)', width: 'var(--icon-size-sm)', marginRight: 'var(--spacing-xs)' }} />
                        {search}
                      </Button>
                    ))}
                  </FlexLayout>
                </div>
              )}
              </FlexLayout>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Search modal component for full-screen search
 */
const SearchModal = ({
  isOpen,
  onClose,
  onSearch,
  recentSearches,
  trendingSearches,
  categories,
}: SearchModalProps): JSX.Element | null => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex items-start justify-center" style={{ paddingTop: 'var(--spacing-2xl)' }}>
        <div className="w-full max-w-2xl bg-background rounded-2xl shadow-2xl">
          <GlobalSearch
            onSearch={onSearch}
            recentSearches={recentSearches}
            trendingSearches={trendingSearches}
            categories={categories}
            variant="inline"
            style={{ padding: 'var(--spacing-lg)' }}
          />
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute inset-0 -z-10"
        aria-label="Close search"
      />
    </div>
  );
};

export type { SearchResult, SearchCategory, SearchFilters };