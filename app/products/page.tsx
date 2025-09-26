"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Grid, List, Search, Heart, ShoppingCart, Eye, Filter, X, ChevronDown, ChevronUp, Zap, Clock, TrendingUp, ArrowUp, ArrowDown, RotateCcw, Bell, AlertCircle, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Footer from "@/components/footer"
import NotificationSystem from "@/components/notification-system"
import { UserProfile } from "@/components/user-profile"
import TrustBanner from "@/components/trust-banner"
import MobileHeader from "@/components/mobile-header"

// This will be replaced with API data
const mockProducts = [
  {
    id: 1,
    name: "Traditional Clay Cooking Pot",
    category: "Cooking",
    price: 149,
    originalPrice: 799,
    rating: 4.8,
    reviews: 124,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
    tags: ["Best Seller", "Traditional"],
    inStock: true,
    stockCount: 15,
    description: "Authentic clay cooking pot perfect for slow cooking and enhancing flavors",
    material: "Terracotta",
    size: "Medium",
    color: "Natural Brown",
    brand: "Clayfable",
    isNew: false,
    trending: true,
    eco_friendly: true,
    handmade: true,
  },
  {
    id: 2,
    name: "Handcrafted Serving Bowl Set",
    category: "Serving",
    price: 149,
    originalPrice: 1199,
    rating: 4.9,
    reviews: 89,
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
    tags: ["Premium", "Set of 4"],
    inStock: true,
    stockCount: 8,
    description: "Beautiful set of 4 serving bowls for elegant dining",
    material: "Terracotta",
    size: "Large",
    color: "Glazed Brown",
    brand: "Clayfable",
    isNew: false,
    trending: false,
    eco_friendly: true,
    handmade: true,
  },
  {
    id: 3,
    name: "Decorative Terracotta Vase",
    category: "Decor",
    price: 149,
    originalPrice: 449,
    rating: 4.7,
    reviews: 67,
    image: "/decorative-terracotta-vases-and-planters.jpg",
    tags: ["New", "Handmade"],
    inStock: true,
    stockCount: 23,
    description: "Elegant decorative vase perfect for home decor",
    material: "Terracotta",
    size: "Small",
    color: "Natural Red",
    brand: "Clayfable",
    isNew: true,
    trending: false,
    eco_friendly: true,
    handmade: true,
  },
  {
    id: 4,
    name: "Clay Water Storage Pot",
    category: "Cooking",
    price: 149,
    originalPrice: 1599,
    rating: 4.9,
    reviews: 156,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
    tags: ["Large", "Traditional"],
    inStock: true,
    stockCount: 5,
    description: "Large capacity water storage pot with natural cooling properties",
    material: "Terracotta",
    size: "Extra Large",
    color: "Natural Brown",
    brand: "Clayfable",
    isNew: false,
    trending: true,
    eco_friendly: true,
    handmade: true,
  },
  {
    id: 5,
    name: "Artisan Dinner Plate Set",
    category: "Serving",
    price: 149,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 203,
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
    tags: ["Premium", "Set of 6"],
    inStock: false,
    stockCount: 0,
    description: "Premium dinner plate set for special occasions",
    material: "Terracotta",
    size: "Medium",
    color: "Glazed Black",
    brand: "Clayfable",
    isNew: false,
    trending: false,
    eco_friendly: true,
    handmade: true,
  },
  {
    id: 6,
    name: "Garden Planter Collection",
    category: "Decor",
    price: 149,
    originalPrice: 999,
    rating: 4.6,
    reviews: 45,
    image: "/decorative-terracotta-vases-and-planters.jpg",
    tags: ["Garden", "Set of 3"],
    inStock: true,
    stockCount: 12,
    description: "Beautiful planters perfect for your garden or balcony",
    material: "Terracotta",
    size: "Medium",
    color: "Natural Brown",
    brand: "Clayfable",
    isNew: false,
    trending: false,
    eco_friendly: true,
    handmade: true,
  },
]

const categories = ["All", "Cooking", "Serving", "Decor"]
const priceRanges = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹1500", min: 1000, max: 1500 },
  { label: "Above ₹1500", min: 1500, max: Number.POSITIVE_INFINITY },
]

const materials = ["All", "Terracotta", "Clay", "Ceramic"]
const sizes = ["All", "Small", "Medium", "Large", "Extra Large"]
const colors = ["All", "Natural Brown", "Natural Red", "Glazed Brown", "Glazed Black"]
const specialFeatures = [
  { key: "eco_friendly", label: "Eco-Friendly" },
  { key: "handmade", label: "Handmade" },
  { key: "trending", label: "Trending" },
  { key: "isNew", label: "New Arrivals" }
]

export default function ProductsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices")
  const [selectedMaterial, setSelectedMaterial] = useState("All")
  const [selectedSize, setSelectedSize] = useState("All")
  const [selectedColor, setSelectedColor] = useState("All")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [compareItems, setCompareItems] = useState<number[]>([])
  const [wishlistItems, setWishlistItems] = useState<number[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([])
  const [showQuickView, setShowQuickView] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [cartItems, setCartItems] = useState<{[key: number]: number}>({})
  const [addToCartLoading, setAddToCartLoading] = useState<number | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load persisted data from localStorage
    const storedCompareItems = localStorage.getItem("compareItems")
    if (storedCompareItems) {
      setCompareItems(JSON.parse(storedCompareItems))
    }

    const storedWishlistItems = localStorage.getItem("wishlistItems")
    if (storedWishlistItems) {
      setWishlistItems(JSON.parse(storedWishlistItems))
    }

    const storedRecentlyViewed = localStorage.getItem("recentlyViewed")
    if (storedRecentlyViewed) {
      setRecentlyViewed(JSON.parse(storedRecentlyViewed))
    }

    const storedCartItems = localStorage.getItem("cartItems")
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems))
    }

    // Fetch products from API
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      if (data.success && data.data) {
        setProducts(data.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products. Please try again.')
      // Fallback to mock data
      setProducts(mockProducts)
    } finally {
      setLoading(false)
    }
  }

  const toggleCompare = (productId: number) => {
    let updated: number[]
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

  const toggleWishlist = (productId: number) => {
    let updated: number[]
    if (wishlistItems.includes(productId)) {
      updated = wishlistItems.filter((id) => id !== productId)
    } else {
      updated = [...wishlistItems, productId]
    }
    setWishlistItems(updated)
    localStorage.setItem("wishlistItems", JSON.stringify(updated))
  }

  const addToRecentlyViewed = (productId: number) => {
    let updated = recentlyViewed.filter((id) => id !== productId)
    updated = [productId, ...updated].slice(0, 10) // Keep only last 10 items
    setRecentlyViewed(updated)
    localStorage.setItem("recentlyViewed", JSON.stringify(updated))
  }

  const addToCart = async (productId: number) => {
    setAddToCartLoading(productId)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const updatedCart = { ...cartItems }
    updatedCart[productId] = (updatedCart[productId] || 0) + 1
    setCartItems(updatedCart)
    localStorage.setItem("cartItems", JSON.stringify(updatedCart))

    setAddToCartLoading(null)

    // Show success notification (you can implement a toast here)
    const product = products.find(p => p.id === productId)
    if (product) {
      alert(`${product.name} added to cart!`)
    }
  }

  const handleProductClick = (productId: number) => {
    addToRecentlyViewed(productId)
    router.push(`/products/${productId}`)
  }

  const handleQuickView = (product: any) => {
    setQuickViewProduct(product)
    setShowQuickView(true)
    addToRecentlyViewed(product.id)
  }

  const handleFeatureToggle = (feature: string) => {
    const updated = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature]
    setSelectedFeatures(updated)
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedPriceRange("All Prices")
    setSelectedMaterial("All")
    setSelectedSize("All")
    setSelectedColor("All")
    setSelectedFeatures([])
    setInStockOnly(false)
  }

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Category filter
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false
      }

      // Price range filter
      if (selectedPriceRange !== "All Prices") {
        const range = priceRanges.find((r) => r.label === selectedPriceRange)
        if (range && (product.price < range.min || product.price > range.max)) {
          return false
        }
      }

      // Material filter
      if (selectedMaterial !== "All" && product.material !== selectedMaterial) {
        return false
      }

      // Size filter
      if (selectedSize !== "All" && product.size !== selectedSize) {
        return false
      }

      // Color filter
      if (selectedColor !== "All" && product.color !== selectedColor) {
        return false
      }

      // Special features filter
      for (const feature of selectedFeatures) {
        if (!product[feature as keyof typeof product]) {
          return false
        }
      }

      // Stock filter
      if (inStockOnly && !product.inStock) {
        return false
      }

      return true
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        // Keep original order for "featured"
        break
    }

    return filtered
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedMaterial, selectedSize, selectedColor, selectedFeatures, sortBy, inStockOnly])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Trust Banner */}
      <TrustBanner />

      {/* Header */}
      <MobileHeader cartCount={Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0)} />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-orange-200 focus:border-orange-400"
                />
              </div>

              {/* Basic Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 border-orange-200">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger className="w-48 border-orange-200">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Prices">All Prices</SelectItem>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.label} value={range.label}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 border-orange-200">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
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
                  <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="Material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((material) => (
                        <SelectItem key={material} value={material}>
                          {material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={inStockOnly}
                      onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                    />
                    <label htmlFor="inStock" className="text-sm text-gray-700">
                      In Stock Only
                    </label>
                  </div>
                </div>

                {/* Special Features */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Special Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {specialFeatures.map((feature) => (
                      <Button
                        key={feature.key}
                        variant={selectedFeatures.includes(feature.key) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFeatureToggle(feature.key)}
                        className={selectedFeatures.includes(feature.key) ? "bg-orange-600 hover:bg-orange-700" : "border-orange-200 hover:bg-orange-50"}
                      >
                        {feature.key === "eco_friendly" && <Zap className="h-3 w-3 mr-1" />}
                        {feature.key === "trending" && <TrendingUp className="h-3 w-3 mr-1" />}
                        {feature.key === "isNew" && <Clock className="h-3 w-3 mr-1" />}
                        {feature.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {(searchQuery || selectedCategory !== "All" || selectedPriceRange !== "All Prices" || selectedMaterial !== "All" || selectedSize !== "All" || selectedColor !== "All" || selectedFeatures.length > 0 || inStockOnly) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="border-orange-200 hover:bg-orange-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-64 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Products</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchProducts} className="bg-orange-600 hover:bg-orange-700">
              Try Again
            </Button>
          </div>
        )}

        {/* Products Grid/List */}
        {!loading && !error && viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-orange-100"
                onClick={() => handleProductClick(product.id)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className={
                            tag === "Best Seller"
                              ? "bg-orange-600 text-white"
                              : tag === "New"
                                ? "bg-green-600 text-white"
                                : tag === "Premium"
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-600 text-white"
                          }
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
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
                      <Button
                        size="sm"
                        variant={compareItems.includes(product.id) ? "default" : "secondary"}
                        className={`rounded-full w-10 h-10 p-0 shadow-lg ${compareItems.includes(product.id) ? "bg-orange-600 hover:bg-orange-700" : "bg-white/90 hover:bg-white"}`}
                        onClick={(e) => {
                          e.preventDefault()
                          toggleCompare(product.id)
                        }}
                      >
                        <span className="text-xs font-bold">⚖</span>
                      </Button>
                    </div>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg px-4 py-2">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-3 text-sm">{product.description}</p>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      {product.originalPrice > product.price && (
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Stock and features info */}
                    <div className="flex items-center justify-between mb-4 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        {product.trending && <Badge className="bg-blue-100 text-blue-800 text-xs">🔥 Trending</Badge>}
                        {product.isNew && <Badge className="bg-green-100 text-green-800 text-xs">✨ New</Badge>}
                        {product.eco_friendly && <Badge className="bg-emerald-100 text-emerald-800 text-xs">🌱 Eco</Badge>}
                      </div>
                      <div className="flex items-center gap-1">
                        {product.inStock ? (
                          <span className="text-green-600">
                            {product.stockCount} left
                          </span>
                        ) : (
                          <span className="text-red-600">Out of stock</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                        disabled={!product.inStock || addToCartLoading === product.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product.id)
                        }}
                      >
                        {addToCartLoading === product.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-200 hover:bg-orange-50 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/products/${product.id}`)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-orange-100"
                onClick={() => handleProductClick(product.id)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-48 h-48 flex-shrink-0">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex gap-2 mb-2">
                            {product.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                className={
                                  tag === "Best Seller"
                                    ? "bg-orange-600 text-white"
                                    : tag === "New"
                                      ? "bg-green-600 text-white"
                                      : tag === "Premium"
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-600 text-white"
                                }
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={wishlistItems.includes(product.id) ? "default" : "outline"}
                            className={`rounded-full w-10 h-10 p-0 ${wishlistItems.includes(product.id) ? "bg-red-500 hover:bg-red-600 text-white" : "bg-transparent"}`}
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
                            className="rounded-full w-10 h-10 p-0 bg-transparent"
                            onClick={(e) => {
                              e.preventDefault()
                              handleQuickView(product)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={compareItems.includes(product.id) ? "default" : "outline"}
                            className={`rounded-full w-10 h-10 p-0 ${compareItems.includes(product.id) ? "bg-orange-600 hover:bg-orange-700" : "bg-transparent"}`}
                            onClick={(e) => {
                              e.preventDefault()
                              toggleCompare(product.id)
                            }}
                          >
                            <span className="text-xs font-bold">⚖</span>
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{product.description}</p>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-3xl font-bold text-orange-600">₹{product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                            )}
                          </div>
                          {product.originalPrice > product.price && (
                            <Badge variant="destructive" className="bg-red-100 text-red-800">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="border-orange-200 hover:bg-orange-50 bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/products/${product.id}`)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            className="bg-orange-600 hover:bg-orange-700"
                            disabled={!product.inStock || addToCartLoading === product.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              addToCart(product.id)
                            }}
                          >
                            {addToCartLoading === product.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Adding...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-300 mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={clearAllFilters}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Clear All Filters
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
                <h2 className="text-2xl font-bold text-gray-900">Quick View</h2>
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
                    src={quickViewProduct.image || "/placeholder.svg"}
                    alt={quickViewProduct.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {quickViewProduct.tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        className={
                          tag === "Best Seller"
                            ? "bg-orange-600 text-white"
                            : tag === "New"
                              ? "bg-green-600 text-white"
                              : tag === "Premium"
                                ? "bg-purple-600 text-white"
                                : "bg-gray-600 text-white"
                        }
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{quickViewProduct.name}</h3>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(quickViewProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {quickViewProduct.rating} ({quickViewProduct.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-orange-600">₹{quickViewProduct.price}</span>
                    {quickViewProduct.originalPrice > quickViewProduct.price && (
                      <span className="text-xl text-gray-500 line-through">₹{quickViewProduct.originalPrice}</span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-6">{quickViewProduct.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Material:</span>
                      <span className="ml-2">{quickViewProduct.material}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Size:</span>
                      <span className="ml-2">{quickViewProduct.size}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Color:</span>
                      <span className="ml-2">{quickViewProduct.color}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Stock:</span>
                      <span className={`ml-2 ${quickViewProduct.inStock ? "text-green-600" : "text-red-600"}`}>
                        {quickViewProduct.inStock ? `${quickViewProduct.stockCount} available` : "Out of stock"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      disabled={!quickViewProduct.inStock || addToCartLoading === quickViewProduct.id}
                      onClick={() => addToCart(quickViewProduct.id)}
                    >
                      {addToCartLoading === quickViewProduct.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                    <Button
                      variant={wishlistItems.includes(quickViewProduct.id) ? "default" : "outline"}
                      className={wishlistItems.includes(quickViewProduct.id) ? "bg-red-500 hover:bg-red-600" : "border-orange-200"}
                      onClick={() => toggleWishlist(quickViewProduct.id)}
                    >
                      <Heart className={`h-4 w-4 ${wishlistItems.includes(quickViewProduct.id) ? "fill-white" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-orange-200"
                      onClick={() => {
                        setShowQuickView(false)
                        router.push(`/products/${quickViewProduct.id}`)
                      }}
                    >
                      Full Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
