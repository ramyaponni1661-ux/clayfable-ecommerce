"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Grid, List, Search, Heart, ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"

// Mock product data
const products = [
  {
    id: 1,
    name: "Traditional Clay Cooking Pot",
    category: "Cooking",
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 124,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
    tags: ["Best Seller", "Traditional"],
    inStock: true,
    description: "Authentic clay cooking pot perfect for slow cooking and enhancing flavors",
  },
  {
    id: 2,
    name: "Handcrafted Serving Bowl Set",
    category: "Serving",
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviews: 89,
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
    tags: ["Premium", "Set of 4"],
    inStock: true,
    description: "Beautiful set of 4 serving bowls for elegant dining",
  },
  {
    id: 3,
    name: "Decorative Terracotta Vase",
    category: "Decor",
    price: 349,
    originalPrice: 449,
    rating: 4.7,
    reviews: 67,
    image: "/decorative-terracotta-vases-and-planters.jpg",
    tags: ["New", "Handmade"],
    inStock: true,
    description: "Elegant decorative vase perfect for home decor",
  },
  {
    id: 4,
    name: "Clay Water Storage Pot",
    category: "Cooking",
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviews: 156,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
    tags: ["Large", "Traditional"],
    inStock: true,
    description: "Large capacity water storage pot with natural cooling properties",
  },
  {
    id: 5,
    name: "Artisan Dinner Plate Set",
    category: "Serving",
    price: 1199,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 203,
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
    tags: ["Premium", "Set of 6"],
    inStock: false,
    description: "Premium dinner plate set for special occasions",
  },
  {
    id: 6,
    name: "Garden Planter Collection",
    category: "Decor",
    price: 799,
    originalPrice: 999,
    rating: 4.6,
    reviews: 45,
    image: "/decorative-terracotta-vases-and-planters.jpg",
    tags: ["Garden", "Set of 3"],
    inStock: true,
    description: "Beautiful planters perfect for your garden or balcony",
  },
]

const categories = ["All", "Cooking", "Serving", "Decor"]
const priceRanges = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹1500", min: 1000, max: 1500 },
  { label: "Above ₹1500", min: 1500, max: Number.POSITIVE_INFINITY },
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [compareItems, setCompareItems] = useState<number[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("compareItems")
    if (stored) {
      setCompareItems(JSON.parse(stored))
    }
  }, [])

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
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy, inStockOnly])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clayfable</h1>
                <p className="text-xs text-orange-600 font-medium">EST. 1952</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-orange-600 font-medium">
                Products
              </Link>
              <Link href="/collections" className="text-gray-700 hover:text-orange-600 font-medium">
                Collections
              </Link>
              <Link href="/b2b" className="text-gray-700 hover:text-orange-600 font-medium">
                B2B Portal
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 font-medium">
                Our Story
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 font-medium">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {compareItems.length > 0 && (
                <Link href="/compare">
                  <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50 bg-transparent">
                    Compare ({compareItems.length})
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700" size="sm">
                Cart (0)
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-xl text-gray-600">Discover our complete collection of authentic terracotta products</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-8">
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

            {/* Filters */}
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
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {(searchQuery || selectedCategory !== "All" || selectedPriceRange !== "All Prices" || inStockOnly) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
                setSelectedPriceRange("All Prices")
                setInStockOnly(false)
              }}
              className="border-orange-200 hover:bg-orange-50"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Products Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-orange-100"
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
                      <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={compareItems.includes(product.id) ? "default" : "secondary"}
                        className={`rounded-full w-10 h-10 p-0 ${compareItems.includes(product.id) ? "bg-orange-600 hover:bg-orange-700" : ""}`}
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

                    <div className="flex items-center justify-between mb-4">
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

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700" disabled={!product.inStock}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Link href={`/products/${product.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-200 hover:bg-orange-50 bg-transparent"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-orange-100"
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
                          <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0 bg-transparent">
                            <Heart className="h-4 w-4" />
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
                          <Link href={`/products/${product.id}`}>
                            <Button variant="outline" className="border-orange-200 hover:bg-orange-50 bg-transparent">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                          <Button className="bg-orange-600 hover:bg-orange-700" disabled={!product.inStock}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-300 mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
                setSelectedPriceRange("All Prices")
                setInStockOnly(false)
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
