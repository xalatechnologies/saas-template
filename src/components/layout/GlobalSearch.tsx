'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Search, 
  X, 
  Loader2,
  FileText,
  User as UserIcon,
  Hash,
  Clock,
  TrendingUp,
  Command,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Button, Input, Badge } from '../ui';
import { cn } from '@/utils';

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
  placeholder = 'Search anything...',
  recentSearches = [],
  trendingSearches = [],
  categories = [],
  className,
  variant = 'inline',
  showFilters = true,
  showShortcut = true,
}: GlobalSearchProps): JSX.Element => {
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
          className={cn('rounded-xl', className)}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
          {showShortcut && (
            <kbd className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'pl-10 pr-10 rounded-xl h-12',
            variant === 'dropdown' ? 'w-64' : 'w-full'
          )}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {showShortcut && !query && (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-muted px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-50 max-h-[500px] overflow-y-auto">
          {/* Filters */}
          {showFilters && categories.length > 0 && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold">Filters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({})}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = filters.category === category.id;
                  
                  return (
                    <Button
                      key={category.id}
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilters({
                        ...filters,
                        category: isActive ? undefined : category.id
                      })}
                      className="rounded-lg"
                    >
                      {Icon && <Icon className="h-3 w-3 mr-1" />}
                      {category.label}
                      {category.count !== undefined && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {category.count}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Searching...</p>
            </div>
          )}

          {/* Results */}
          {!isLoading && query && results.length > 0 && (
            <div className="py-2">
              {results.map((result, index) => {
                const Icon = result.icon || FileText;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      'w-full px-4 py-3 flex items-center space-x-3 hover:bg-accent transition-colors',
                      isSelected && 'bg-accent'
                    )}
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {!isLoading && query && results.length === 0 && (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground mb-1">No results found</p>
              <p className="text-sm text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          )}

          {/* Initial State */}
          {!query && (
            <div className="p-4 space-y-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Recent Searches
                  </h3>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent text-sm"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              {trendingSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Trending
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery(search)}
                        className="rounded-lg"
                      >
                        <Hash className="h-3 w-3 mr-1" />
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
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
      <div className="flex items-start justify-center pt-20">
        <div className="w-full max-w-2xl bg-background rounded-xl shadow-2xl">
          <GlobalSearch
            onSearch={onSearch}
            recentSearches={recentSearches}
            trendingSearches={trendingSearches}
            categories={categories}
            variant="inline"
            className="p-4"
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