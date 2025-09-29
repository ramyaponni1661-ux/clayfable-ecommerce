"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Grid, List, Search, Heart, ShoppingCart, Eye, Filter, X, ChevronDown, ChevronUp, Zap, Clock, TrendingUp, RotateCcw, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ProductFooter from "@/components/product-footer"
import ProductHeader from "@/components/product-header"
import CanonicalLink from "@/components/seo/canonical-link"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  sku: string
  price: number
  compare_price: number | null
  images: Array<{ url: string; alt: string }>
  material: string | null
  color: string | null
  is_featured: boolean
  inventory_quantity: number
  track_inventory: boolean
  created_at: string
  categories: {
    id: string
    name: string
    slug: string
  } | null
}

interface Category {
  id: string
  name: string
  slug: string
  productCount?: number
}

interface FilterState {
  search: string
  category: string
  minPrice: string
  maxPrice: string
  material: string
  inStock: boolean
  featured: boolean
  sort: string
}

const priceRanges = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹1500", min: 1000, max: 1500 },
  { label: "Above ₹1500", min: 1500, max: 999999 },
]

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    minPrice: "",
    maxPrice: "",
    material: "all",
    inStock: false,
    featured: false,
    sort: "featured"
  })

  // Cart and interaction states
  const [compareItems, setCompareItems] = useState<string[]>([])
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({})
  const [addToCartLoading, setAddToCartLoading] = useState<string | null>(null)
  const [showQuickView, setShowQuickView] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  // Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false
  })

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories?include_product_count=true')
        const data = await response.json()

        if (data.success) {
          setCategories([
            { id: 'all', name: 'All Categories', slug: 'all' },
            ...data.data
          ])
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }

    loadCategories()
  }, [])

  // Load products
  const loadProducts = async (resetPagination = true) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (filters.search) params.append('search', filters.search)
      if (filters.category !== 'all') params.append('category', filters.category)
      if (filters.minPrice) params.append('min_price', filters.minPrice)
      if (filters.maxPrice) params.append('max_price', filters.maxPrice)
      if (filters.material !== 'all') params.append('material', filters.material)
      if (filters.inStock) params.append('in_stock', 'true')
      if (filters.featured) params.append('featured', 'true')
      if (filters.sort) params.append('sort', filters.sort)

      params.append('limit', pagination.limit.toString())
      params.append('offset', resetPagination ? '0' : pagination.offset.toString())

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()

      if (data.success) {
        if (resetPagination) {
          setProducts(data.data)
          setPagination(data.pagination)
        } else {
          setProducts(prev => [...prev, ...data.data])
          setPagination(data.pagination)
        }
      } else {
        setError('Failed to load products')
      }
    } catch (error) {
      console.error('Failed to load products:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Load products when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadProducts(true)
    }, filters.search ? 500 : 0) // Debounce search

    return () => clearTimeout(debounceTimer)
  }, [filters])

  // Load persisted data from localStorage
  useEffect(() => {
    const storedCompareItems = localStorage.getItem("compareItems")
    if (storedCompareItems) {
      setCompareItems(JSON.parse(storedCompareItems))
    }

    const storedWishlistItems = localStorage.getItem("wishlistItems")
    if (storedWishlistItems) {
      setWishlistItems(JSON.parse(storedWishlistItems))
    }

    const storedCartItems = localStorage.getItem("cartItems")
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems))
    }
  }, [])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
      material: "all",
      inStock: false,
      featured: false,
      sort: "featured"
    })
  }

  const toggleCompare = (productId: string) => {
    let updated: string[]
    if (compareItems.includes(productId)) {
      updated = compareItems.filter((id) => id !== productId)
    } else {
      if (compareItems.length >= 4) {
        alert("You can compare up to 4 products at a time")
        return
      }
      updated = [...compareItems, productId]
    }
    setCompareItems(updated)
    localStorage.setItem("compareItems", JSON.stringify(updated))
  }

  const toggleWishlist = (productId: string) => {
    let updated: string[]
    if (wishlistItems.includes(productId)) {
      updated = wishlistItems.filter((id) => id !== productId)
    } else {
      updated = [...wishlistItems, productId]
    }
    setWishlistItems(updated)
    localStorage.setItem("wishlistItems", JSON.stringify(updated))
  }

  const addToCart = async (productId: string) => {
    setAddToCartLoading(productId)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))

      const updatedCart = { ...cartItems }
      updatedCart[productId] = (updatedCart[productId] || 0) + 1
      setCartItems(updatedCart)
      localStorage.setItem("cartItems", JSON.stringify(updatedCart))

      const product = products.find(p => p.id === productId)
      if (product) {
        // You can implement a toast notification here
        alert(`${product.name} added to cart!`)
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add product to cart')
    } finally {
      setAddToCartLoading(null)
    }
  }

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.slug}`)
  }

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product)
    setShowQuickView(true)
  }

  const loadMoreProducts = () => {
    if (pagination.hasMore && !loading) {
      const newOffset = pagination.offset + pagination.limit
      setPagination(prev => ({ ...prev, offset: newOffset }))
      loadProducts(false)
    }
  }

  const getStockStatus = (product: Product) => {
    if (!product.track_inventory) {
      return { status: 'in_stock', message: 'In Stock', color: 'text-green-600' }
    }

    if (product.inventory_quantity <= 0) {
      return { status: 'out_of_stock', message: 'Out of Stock', color: 'text-red-600' }
    }

    if (product.inventory_quantity <= 10) {
      return {
        status: 'low_stock',
        message: `Only ${product.inventory_quantity} left`,
        color: 'text-yellow-600'
      }
    }

    return {
      status: 'in_stock',
      message: `${product.inventory_quantity} in stock`,
      color: 'text-green-600'
    }
  }

  const calculateDiscount = (price: number, comparePrice: number | null) => {
    if (!comparePrice || comparePrice <= price) return null
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <ProductHeader cartCount={Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0)} />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl text-gray-300 mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to Load Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => loadProducts(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Try Again
          </Button>
        </div>
        <ProductFooter />
      </div>
    )
  }

  return (
    <>
      <CanonicalLink />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <ProductHeader cartCount={Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0)} />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="clayfable-heading text-4xl font-bold mb-4">OUR PRODUCTS</h1>
          <p className="text-xl text-gray-600">Discover our complete collection of authentic terracotta products</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Main Search and Basic Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pl-10 border-orange-200 focus:border-orange-400"
                />
              </div>

              {/* Basic Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                  <SelectTrigger className="w-48 border-orange-200">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                        {category.productCount !== undefined && ` (${category.productCount})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.sort} onValueChange={(value) => updateFilter('sort', value)}>
                  <SelectTrigger className="w-48 border-orange-200">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="name_asc">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="border-orange-200 hover:bg-orange-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                  {showAdvancedFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                </Button>

                <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-orange-600 hover:bg-orange-700" : ""}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-orange-600 hover:bg-orange-700" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Min Price (₹)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                      className="border-orange-200"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Max Price (₹)</label>
                    <Input
                      type="number"
                      placeholder="No limit"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                      className="border-orange-200"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={filters.inStock}
                      onCheckedChange={(checked) => updateFilter('inStock', checked)}
                    />
                    <label htmlFor="inStock" className="text-sm text-gray-700">
                      In Stock Only
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={filters.featured}
                      onCheckedChange={(checked) => updateFilter('featured', checked)}
                    />
                    <label htmlFor="featured" className="text-sm text-gray-700">
                      Featured Products
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count and Clear Filters */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Showing ${products.length} of ${pagination.total} products`}
          </p>

          <div className="flex gap-2">
            {(filters.search || filters.category !== 'all' || filters.minPrice || filters.maxPrice || filters.inStock || filters.featured) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="border-orange-200 hover:bg-orange-50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && products.length === 0 && (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Products Grid/List */}
        {products.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product)
                  const discount = calculateDiscount(product.price, product.compare_price)

                  return (
                    <Card
                      key={product.id}
                      className="catchy-collection-card group cursor-pointer rounded-xl"
                      onClick={() => handleProductClick(product)}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-xl">
                          <img
                            src={product.images?.[0]?.url || "/placeholder.svg"}
                            alt={product.images?.[0]?.alt || product.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.is_featured && (
                              <Badge className="bg-orange-600 text-white">Featured</Badge>
                            )}
                            {discount && (
                              <Badge className="bg-red-600 text-white">{discount}% OFF</Badge>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant={wishlistItems.includes(product.id) ? "default" : "secondary"}
                              className={`rounded-full w-10 h-10 p-0 ${wishlistItems.includes(product.id) ? "bg-red-500 hover:bg-red-600" : "bg-white/90 hover:bg-white"} shadow-lg`}
                              onClick={(e) => {
                                e.preventDefault()
                                toggleWishlist(product.id)
                              }}
                            >
                              <Heart className={`h-4 w-4 ${wishlistItems.includes(product.id) ? "fill-white text-white" : ""}`} />
                            </Button>

                            <Button
                              size="sm"
                              variant="secondary"
                              className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
                              onClick={(e) => {
                                e.preventDefault()
                                handleQuickView(product)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>

                          {stockStatus.status === 'out_of_stock' && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <Badge variant="destructive" className="text-lg px-4 py-2">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <div className="mb-2">
                            {product.categories && (
                              <Badge variant="outline" className="text-xs">
                                {product.categories.name}
                              </Badge>
                            )}
                          </div>

                          <h3 className="collection-title text-xl font-bold mb-2 transition-colors duration-300 uppercase tracking-wide">
                            {product.name}
                          </h3>

                          <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                            {product.short_description || product.description}
                          </p>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                              {product.compare_price && product.compare_price > product.price && (
                                <span className="text-lg text-gray-500 line-through">₹{product.compare_price}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4 text-xs">
                            <span className={stockStatus.color}>{stockStatus.message}</span>
                            <span className="text-gray-500">SKU: {product.sku}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="catchy-button flex-1"
                              disabled={stockStatus.status === 'out_of_stock' || addToCartLoading === product.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                addToCart(product.id)
                              }}
                            >
                              {addToCartLoading === product.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Adding...
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  ADD TO CART
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product)
                  const discount = calculateDiscount(product.price, product.compare_price)

                  return (
                    <Card
                      key={product.id}
                      className="catchy-collection-card group cursor-pointer rounded-xl"
                      onClick={() => handleProductClick(product)}
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="relative w-48 h-48 flex-shrink-0">
                            <img
                              src={product.images?.[0]?.url || "/placeholder.svg"}
                              alt={product.images?.[0]?.alt || product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            {stockStatus.status === 'out_of_stock' && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                <Badge variant="destructive">Out of Stock</Badge>
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  {product.categories && (
                                    <Badge variant="outline" className="text-xs">
                                      {product.categories.name}
                                    </Badge>
                                  )}
                                  {product.is_featured && (
                                    <Badge className="bg-orange-600 text-white text-xs">Featured</Badge>
                                  )}
                                  {discount && (
                                    <Badge className="bg-red-600 text-white text-xs">{discount}% OFF</Badge>
                                  )}
                                </div>

                                <h3 className="collection-title text-2xl font-bold mb-2 transition-colors duration-300 uppercase tracking-wide">
                                  {product.name}
                                </h3>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant={wishlistItems.includes(product.id) ? "default" : "outline"}
                                  className={`rounded-full w-10 h-10 p-0 ${wishlistItems.includes(product.id) ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    toggleWishlist(product.id)
                                  }}
                                >
                                  <Heart className={`h-4 w-4 ${wishlistItems.includes(product.id) ? "fill-white" : ""}`} />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-full w-10 h-10 p-0"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleQuickView(product)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-4">{product.short_description || product.description}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-3xl font-bold text-orange-600">₹{product.price}</span>
                                  {product.compare_price && product.compare_price > product.price && (
                                    <span className="text-xl text-gray-500 line-through">₹{product.compare_price}</span>
                                  )}
                                </div>
                                <span className={`text-sm ${stockStatus.color}`}>{stockStatus.message}</span>
                              </div>

                              <div className="flex gap-3">
                                <Button
                                  variant="outline"
                                  className="catchy-button-outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleProductClick(product)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  VIEW DETAILS
                                </Button>

                                <Button
                                  className="catchy-button"
                                  disabled={stockStatus.status === 'out_of_stock' || addToCartLoading === product.id}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    addToCart(product.id)
                                  }}
                                >
                                  {addToCartLoading === product.id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Adding...
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingCart className="h-4 w-4 mr-2" />
                                      ADD TO CART
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Load More Button */}
            {pagination.hasMore && (
              <div className="text-center mt-8">
                <Button
                  onClick={loadMoreProducts}
                  disabled={loading}
                  className="catchy-button-outline"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading More...
                    </>
                  ) : (
                    'LOAD MORE PRODUCTS'
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* No Products Found */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-300 mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={clearAllFilters}
              className="catchy-button"
            >
              CLEAR ALL FILTERS
            </Button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {showQuickView && quickViewProduct && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowQuickView(false)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="clayfable-heading text-2xl font-bold">QUICK VIEW</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQuickView(false)}
                  className="rounded-full w-8 h-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={quickViewProduct.images?.[0]?.url || "/placeholder.svg"}
                    alt={quickViewProduct.images?.[0]?.alt || quickViewProduct.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {quickViewProduct.categories && (
                      <Badge variant="outline">{quickViewProduct.categories.name}</Badge>
                    )}
                    {quickViewProduct.is_featured && (
                      <Badge className="bg-orange-600 text-white">Featured</Badge>
                    )}
                  </div>

                  <h3 className="collection-title text-2xl font-bold mb-4 uppercase tracking-wide">
                    {quickViewProduct.name}
                  </h3>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-orange-600">₹{quickViewProduct.price}</span>
                    {quickViewProduct.compare_price && quickViewProduct.compare_price > quickViewProduct.price && (
                      <span className="text-xl text-gray-500 line-through">₹{quickViewProduct.compare_price}</span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-6">{quickViewProduct.short_description || quickViewProduct.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">SKU:</span>
                      <span className="ml-2">{quickViewProduct.sku}</span>
                    </div>
                    {quickViewProduct.material && (
                      <div>
                        <span className="font-medium text-gray-700">Material:</span>
                        <span className="ml-2">{quickViewProduct.material}</span>
                      </div>
                    )}
                    {quickViewProduct.color && (
                      <div>
                        <span className="font-medium text-gray-700">Color:</span>
                        <span className="ml-2">{quickViewProduct.color}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">Stock:</span>
                      <span className={`ml-2 ${getStockStatus(quickViewProduct).color}`}>
                        {getStockStatus(quickViewProduct).message}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="catchy-button flex-1"
                      disabled={getStockStatus(quickViewProduct).status === 'out_of_stock' || addToCartLoading === quickViewProduct.id}
                      onClick={() => addToCart(quickViewProduct.id)}
                    >
                      {addToCartLoading === quickViewProduct.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          ADD TO CART
                        </>
                      )}
                    </Button>
                    <Button
                      variant={wishlistItems.includes(quickViewProduct.id) ? "default" : "outline"}
                      className={wishlistItems.includes(quickViewProduct.id) ? "catchy-button" : "catchy-button-outline"}
                      onClick={() => toggleWishlist(quickViewProduct.id)}
                    >
                      <Heart className={`h-4 w-4 ${wishlistItems.includes(quickViewProduct.id) ? "fill-white" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      className="catchy-button-outline"
                      onClick={() => {
                        setShowQuickView(false)
                        handleProductClick(quickViewProduct)
                      }}
                    >
                      FULL DETAILS
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ProductFooter />
      </div>
    </>
  )
}