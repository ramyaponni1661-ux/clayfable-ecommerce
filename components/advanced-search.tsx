"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Grid,
  List,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Tag
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SearchFilters {
  query: string
  category: string
  priceRange: [number, number]
  rating: number
  availability: 'all' | 'in-stock' | 'out-of-stock'
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popularity'
  tags: string[]
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void
  onViewModeChange: (mode: 'grid' | 'list') => void
  totalResults: number
  isLoading?: boolean
}

export default function AdvancedSearch({
  onFiltersChange,
  onViewModeChange,
  totalResults,
  isLoading = false
}: AdvancedSearchProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    priceRange: [0, 10000],
    rating: 0,
    availability: 'all',
    sortBy: 'relevance',
    tags: []
  })

  // Sample categories and tags
  const categories = [
    'All Categories',
    'Kulhads & Cups',
    'Dinner Sets',
    'Serving Bowls',
    'Water Pots',
    'Decorative Items',
    'Kitchen Essentials',
    'Gift Sets'
  ]

  const availableTags = [
    'Handmade',
    'GI Tagged',
    'Eco-Friendly',
    'Dishwasher Safe',
    'Microwave Safe',
    'Traditional',
    'Modern',
    'Wedding Collection',
    'Festival Special',
    'Limited Edition'
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Relevance', icon: TrendingUp },
    { value: 'price-low', label: 'Price: Low to High', icon: DollarSign },
    { value: 'price-high', label: 'Price: High to Low', icon: DollarSign },
    { value: 'rating', label: 'Highest Rated', icon: Star },
    { value: 'newest', label: 'Newest First', icon: Clock },
    { value: 'popularity', label: 'Most Popular', icon: TrendingUp }
  ]

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange(filters)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilter('tags', [...filters.tags, tag])
    }
  }

  const removeTag = (tag: string) => {
    updateFilter('tags', filters.tags.filter(t => t !== tag))
  }

  const clearAllFilters = () => {
    setFilters({
      query: '',
      category: '',
      priceRange: [0, 10000],
      rating: 0,
      availability: 'all',
      sortBy: 'relevance',
      tags: []
    })
  }

  const hasActiveFilters = useMemo(() => {
    return (
      filters.query ||
      filters.category ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 10000 ||
      filters.rating > 0 ||
      filters.availability !== 'all' ||
      filters.tags.length > 0
    )
  }, [filters])

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    onViewModeChange(mode)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for terracotta products..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="pl-10 border-orange-200 focus:border-orange-400"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="border-orange-200 hover:bg-orange-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge className="ml-2 bg-orange-500 text-white text-xs">
              {filters.tags.length + (filters.category ? 1 : 0) + (filters.rating > 0 ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Quick Search Tags */}
      <div className="flex flex-wrap gap-2">
        {['Kulhads', 'Dinner Sets', 'Handmade', 'Traditional', 'Modern'].map((tag) => (
          <Button
            key={tag}
            variant="outline"
            size="sm"
            onClick={() => updateFilter('query', tag)}
            className="border-orange-200 hover:bg-orange-50 text-xs"
          >
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </Button>
        ))}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="border-orange-100">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => updateFilter('category', value === 'All Categories' ? '' : value)}
                >
                  <SelectTrigger className="border-orange-200">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                  max={10000}
                  min={0}
                  step={100}
                  className="mt-2"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Minimum Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={filters.rating >= rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter('rating', rating === filters.rating ? 0 : rating)}
                      className="p-1 h-8 w-8"
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Availability</Label>
                <Select
                  value={filters.availability}
                  onValueChange={(value) => updateFilter('availability', value as any)}
                >
                  <SelectTrigger className="border-orange-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <Label className="text-sm font-medium mb-2 block">Product Tags</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {availableTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => filters.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                    className="text-xs border-orange-200"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600">Selected:</span>
                  {filters.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-orange-100 text-orange-800 border-orange-200"
                    >
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="ml-1 h-auto p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-orange-100">
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="border-orange-200 hover:bg-orange-50"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {isLoading ? 'Searching...' : `${totalResults.toLocaleString()} products found`}
          </span>
          {hasActiveFilters && (
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              Filtered
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Options */}
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilter('sortBy', value as any)}
          >
            <SelectTrigger className="w-48 border-orange-200">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border border-orange-200 rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
              className="rounded-r-none border-r border-orange-200"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}