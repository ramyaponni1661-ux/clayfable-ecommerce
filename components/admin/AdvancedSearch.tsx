"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Calendar,
  Tag,
  DollarSign,
  Package,
  Star,
  Eye,
  RotateCcw,
  Download,
  Bookmark,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface SearchFilter {
  id: string;
  type: 'text' | 'select' | 'range' | 'date' | 'boolean' | 'multiselect';
  label: string;
  field: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

interface FilterValue {
  [key: string]: any;
}

interface SearchResult {
  id: string;
  name: string;
  sku: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_urls?: string[];
  tags?: string[];
  material?: string;
  color?: string;
  weight?: number;
  dimensions?: string;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: FilterValue;
  created_at: string;
  results_count?: number;
}

interface AdvancedSearchProps {
  onResults?: (results: SearchResult[]) => void;
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onResults, className = '' }) => {
  const [filters, setFilters] = useState<FilterValue>({});
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [stockRange, setStockRange] = useState<[number, number]>([0, 100]);
  const [resultCount, setResultCount] = useState(0);
  const [searchTime, setSearchTime] = useState(0);

  // Define search filters configuration
  const searchFilters: SearchFilter[] = [
    {
      id: 'search_text',
      type: 'text',
      label: 'Search Text',
      field: 'search',
      placeholder: 'Search products by name, SKU, description...'
    },
    {
      id: 'category',
      type: 'select',
      label: 'Category',
      field: 'category',
      placeholder: 'Select category'
    },
    {
      id: 'price_range',
      type: 'range',
      label: 'Price Range',
      field: 'price',
      min: 0,
      max: 1000,
      step: 1
    },
    {
      id: 'stock_range',
      type: 'range',
      label: 'Stock Quantity',
      field: 'stock_quantity',
      min: 0,
      max: 100,
      step: 1
    },
    {
      id: 'status',
      type: 'select',
      label: 'Status',
      field: 'is_active',
      options: [
        { value: 'active', label: 'Active Only' },
        { value: 'inactive', label: 'Inactive Only' },
        { value: 'all', label: 'All Products' }
      ]
    },
    {
      id: 'featured',
      type: 'select',
      label: 'Featured',
      field: 'is_featured',
      options: [
        { value: 'featured', label: 'Featured Only' },
        { value: 'not_featured', label: 'Not Featured' },
        { value: 'all', label: 'All Products' }
      ]
    },
    {
      id: 'material',
      type: 'text',
      label: 'Material',
      field: 'material',
      placeholder: 'e.g., Terracotta, Ceramic, Wood'
    },
    {
      id: 'color',
      type: 'text',
      label: 'Color',
      field: 'color',
      placeholder: 'e.g., Brown, White, Black'
    },
    {
      id: 'tags',
      type: 'text',
      label: 'Tags',
      field: 'tags',
      placeholder: 'Comma-separated tags'
    },
    {
      id: 'date_created',
      type: 'date',
      label: 'Created Date Range',
      field: 'created_at'
    },
    {
      id: 'has_images',
      type: 'boolean',
      label: 'Has Images',
      field: 'has_images'
    },
    {
      id: 'on_sale',
      type: 'boolean',
      label: 'On Sale',
      field: 'on_sale'
    }
  ];

  // Load categories and saved searches on mount
  useEffect(() => {
    fetchCategories();
    fetchSavedSearches();
  }, []);

  // Fetch available categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.map((cat: any) => cat.name));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Fetch saved searches
  const fetchSavedSearches = async () => {
    try {
      const response = await fetch('/api/admin/saved-searches');
      if (response.ok) {
        const data = await response.json();
        setSavedSearches(data);
      }
    } catch (error) {
      console.error('Failed to fetch saved searches:', error);
    }
  };

  // Update filter value
  const updateFilter = (filterId: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  // Remove filter
  const removeFilter = (filterId: string) => {
    setFilters(prev => {
      const updated = { ...prev };
      delete updated[filterId];
      return updated;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
    setPriceRange([0, 1000]);
    setStockRange([0, 100]);
    setSearchResults([]);
    setResultCount(0);
  };

  // Build search query from filters
  const buildSearchQuery = useCallback(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value != null && value !== '' && value !== 'all') {
        if (key === 'price_range' && Array.isArray(value)) {
          params.append('price_min', value[0].toString());
          params.append('price_max', value[1].toString());
        } else if (key === 'stock_range' && Array.isArray(value)) {
          params.append('stock_min', value[0].toString());
          params.append('stock_max', value[1].toString());
        } else if (key === 'date_created' && typeof value === 'object') {
          if (value.from) params.append('created_after', value.from);
          if (value.to) params.append('created_before', value.to);
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return params;
  }, [filters]);

  // Perform search
  const performSearch = async () => {
    setIsSearching(true);
    const startTime = Date.now();

    try {
      const params = buildSearchQuery();
      const response = await fetch(`/api/admin/products/search?${params}`);

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.products || []);
        setResultCount(data.total || data.products?.length || 0);
        setSearchTime(Date.now() - startTime);

        if (onResults) {
          onResults(data.products || []);
        }

        toast.success(`Found ${data.total || data.products?.length || 0} products`);
      } else {
        toast.error('Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed due to network error');
    } finally {
      setIsSearching(false);
    }
  };

  // Save current search
  const saveCurrentSearch = async () => {
    const name = prompt('Enter a name for this search:');
    if (!name) return;

    try {
      const response = await fetch('/api/admin/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, filters, results_count: resultCount })
      });

      if (response.ok) {
        toast.success('Search saved successfully');
        fetchSavedSearches();
      } else {
        toast.error('Failed to save search');
      }
    } catch (error) {
      console.error('Save search error:', error);
      toast.error('Failed to save search');
    }
  };

  // Load saved search
  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);

    // Update range sliders if they exist in the saved filters
    if (savedSearch.filters.price_range) {
      setPriceRange(savedSearch.filters.price_range);
    }
    if (savedSearch.filters.stock_range) {
      setStockRange(savedSearch.filters.stock_range);
    }

    toast.success(`Loaded search: ${savedSearch.name}`);
  };

  // Export search results
  const exportResults = async () => {
    try {
      const params = buildSearchQuery();
      const response = await fetch(`/api/admin/products/search-export?${params}`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `search-results-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success('Search results exported');
      } else {
        toast.error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    }
  };

  // Count active filters
  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key];
    return value != null && value !== '' && value !== 'all';
  }).length;

  // Render filter input based on type
  const renderFilterInput = (filter: SearchFilter) => {
    const value = filters[filter.id];

    switch (filter.type) {
      case 'text':
        return (
          <Input
            placeholder={filter.placeholder}
            value={value || ''}
            onChange={(e) => updateFilter(filter.id, e.target.value)}
          />
        );

      case 'select':
        const options = filter.field === 'category'
          ? categories.map(cat => ({ value: cat, label: cat }))
          : filter.options || [];

        return (
          <Select value={value || ''} onValueChange={(val) => updateFilter(filter.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'range':
        const rangeValue = filter.field === 'price' ? priceRange : stockRange;
        const setRangeValue = filter.field === 'price' ? setPriceRange : setStockRange;

        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{filter.field === 'price' ? '$' : ''}{rangeValue[0]}</span>
              <span>{filter.field === 'price' ? '$' : ''}{rangeValue[1]}</span>
            </div>
            <Slider
              value={rangeValue}
              onValueChange={(val) => {
                setRangeValue(val as [number, number]);
                updateFilter(filter.id, val);
              }}
              max={filter.max || 100}
              min={filter.min || 0}
              step={filter.step || 1}
              className="w-full"
            />
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!value}
              onCheckedChange={(checked) => updateFilter(filter.id, checked)}
            />
            <label className="text-sm">Yes</label>
          </div>
        );

      case 'date':
        return (
          <div className="grid grid-cols-2 gap-2">
            <DatePicker
              selected={value?.from ? new Date(value.from) : undefined}
              onSelect={(date) => updateFilter(filter.id, {
                ...value,
                from: date?.toISOString().split('T')[0]
              })}
              placeholderText="From date"
            />
            <DatePicker
              selected={value?.to ? new Date(value.to) : undefined}
              onSelect={(date) => updateFilter(filter.id, {
                ...value,
                to: date?.toISOString().split('T')[0]
              })}
              placeholderText="To date"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={`border-orange-200 ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            {Object.keys(filters).length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={clearAllFilters}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Quick search by name, SKU, or description..."
              value={filters.search_text || ''}
              onChange={(e) => updateFilter('search_text', e.target.value)}
              className="text-base"
            />
          </div>
          <Button
            onClick={performSearch}
            disabled={isSearching}
            className="gap-2"
          >
            {isSearching ? (
              <>
                <Search className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Advanced Filters</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchFilters.slice(1).map(filter => (
                <div key={filter.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {filter.label}
                    </label>
                    {filters[filter.id] && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFilter(filter.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  {renderFilterInput(filter)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700">Active Filters:</h5>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (value == null || value === '' || value === 'all') return null;

                const filter = searchFilters.find(f => f.id === key);
                const displayValue = typeof value === 'object'
                  ? (Array.isArray(value) ? `${value[0]} - ${value[1]}` : `${value.from || ''} to ${value.to || ''}`)
                  : value;

                return (
                  <Badge key={key} variant="outline" className="gap-2">
                    {filter?.label}: {displayValue}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFilter(key)}
                      className="h-4 w-4 p-0 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Results Summary */}
        {searchResults.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    {resultCount} products found
                  </span>
                </div>
                <div className="text-sm text-green-700">
                  Search completed in {searchTime}ms
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={saveCurrentSearch}
                  className="gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  Save Search
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportResults}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Results
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Saved Searches</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {savedSearches.map(savedSearch => (
                <Button
                  key={savedSearch.id}
                  variant="outline"
                  onClick={() => loadSavedSearch(savedSearch)}
                  className="justify-start gap-2 h-auto p-3"
                >
                  <div className="flex flex-col items-start">
                    <div className="font-medium">{savedSearch.name}</div>
                    <div className="text-xs text-gray-500">
                      {savedSearch.results_count} results • {new Date(savedSearch.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Preview */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Search Results Preview</h4>
            <div className="border rounded-lg max-h-64 overflow-y-auto">
              <div className="grid grid-cols-1 divide-y">
                {searchResults.slice(0, 5).map(product => (
                  <div key={product.id} className="p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          SKU: {product.sku} • {product.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="font-medium">
                            ${product.sale_price || product.price}
                            {product.sale_price && (
                              <span className="text-xs text-gray-500 line-through ml-1">
                                ${product.price}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Stock: {product.stock_quantity}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          {product.is_featured && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                          {!product.is_active && <Minus className="h-3 w-3 text-gray-400" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {searchResults.length > 5 && (
                <div className="p-3 text-center text-sm text-gray-500 border-t">
                  ... and {searchResults.length - 5} more products
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;