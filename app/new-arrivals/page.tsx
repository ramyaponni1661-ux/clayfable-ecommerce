"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Star, Heart, ShoppingCart, Filter, Search, Zap, TrendingUp, Clock, Sparkles, Users, CheckCircle, Truck, Bell } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"

export default function NewArrivalsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [realProducts, setRealProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    fetchRealProducts()
  }, [])

  const fetchRealProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const supabase = createClient()

      // Fetch the most recent products (new arrivals)
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          price,
          compare_at_price,
          images,
          is_active,
          is_featured,
          inventory_quantity,
          created_at,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      // Transform database products to match your existing format
      const transformedProducts = products.map((product, index) => ({
        id: `db-${product.id}`,
        name: product.name,
        price: product.price,
        originalPrice: product.compare_at_price || product.price * 1.2, // Add some markup if no compare price
        image: Array.isArray(product.images) ? product.images[0] : product.images || "/elegant-wedding-terracotta-collection.jpg",
        category: product.categories?.name || "General",
        rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5.0
        reviews: Math.floor(Math.random() * 50) + 1, // Random reviews 1-50
        badge: "New Arrival",
        features: ["Handcrafted", "Authentic", "Premium Quality", "Latest Design"],
        description: product.description || `Beautiful ${product.name.toLowerCase()} crafted with traditional techniques`,
        isNew: true,
        arrivedDate: product.created_at,
        trending: index < 3, // First 3 products are trending
        stockStatus: product.inventory_quantity > 0 ? (product.inventory_quantity > 10 ? "In Stock" : "Limited Stock") : "Out of Stock",
        estimatedDelivery: "3-5 days"
      }))

      setRealProducts(transformedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const newArrivalsProducts = [
    {
      id: 1,
      name: "Contemporary Fusion Dinner Set",
      price: 8999,
      originalPrice: 11999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Dinnerware",
      rating: 4.9,
      reviews: 23,
      badge: "Just Arrived",
      features: ["Modern Design", "36-piece set", "Contemporary Style", "Limited Edition"],
      description: "Experience the perfect blend of traditional craftsmanship and modern aesthetics in this stunning contemporary dinner set",
      isNew: true,
      arrivedDate: "2024-09-25",
      trending: true,
      stockStatus: "In Stock",
      estimatedDelivery: "3-5 days"
    },
    {
      id: 2,
      name: "Artisan Painted Garden Collection",
      price: 4599,
      originalPrice: 5999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Garden Decor",
      rating: 4.8,
      reviews: 15,
      badge: "Artist Edition",
      features: ["Hand-Painted", "Weather Resistant", "Unique Patterns", "Set of 5"],
      description: "Transform your garden with these uniquely hand-painted terracotta pieces, each telling its own artistic story",
      isNew: true,
      arrivedDate: "2024-09-24",
      trending: false,
      stockStatus: "Limited Stock",
      estimatedDelivery: "5-7 days"
    },
    {
      id: 3,
      name: "Sacred Ritual Vessel Series",
      price: 3299,
      originalPrice: 3999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Spiritual",
      rating: 4.9,
      reviews: 31,
      badge: "Blessed Creation",
      features: ["Sacred Geometry", "Ritual Ready", "Blessed by Artisans", "Complete Set"],
      description: "Elevate your spiritual practice with these specially crafted ritual vessels, designed according to ancient sacred geometry",
      isNew: true,
      arrivedDate: "2024-09-23",
      trending: true,
      stockStatus: "In Stock",
      estimatedDelivery: "2-4 days"
    },
    {
      id: 4,
      name: "Modern Minimalist Serving Collection",
      price: 2799,
      originalPrice: 3499,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Serving",
      rating: 4.7,
      reviews: 18,
      badge: "Design Award",
      features: ["Minimalist Design", "Clean Lines", "Stackable", "Multi-functional"],
      description: "Embrace simplicity with this award-winning minimalist serving collection that perfectly complements contemporary dining",
      isNew: true,
      arrivedDate: "2024-09-22",
      trending: false,
      stockStatus: "In Stock",
      estimatedDelivery: "3-5 days"
    },
    {
      id: 5,
      name: "Heritage Recipe Cooking Vessel Set",
      price: 5499,
      originalPrice: 6999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Cooking",
      rating: 4.8,
      reviews: 27,
      badge: "Traditional Recipe",
      features: ["Ancient Design", "Slow Cooking", "Flavor Enhancement", "Multi-size Set"],
      description: "Rediscover authentic flavors with these traditionally designed cooking vessels, perfected over generations of use",
      isNew: true,
      arrivedDate: "2024-09-21",
      trending: true,
      stockStatus: "In Stock",
      estimatedDelivery: "4-6 days"
    },
    {
      id: 6,
      name: "Wellness Water Storage System",
      price: 1899,
      originalPrice: 2399,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Water Storage",
      rating: 4.6,
      reviews: 12,
      badge: "Health Focused",
      features: ["Natural Cooling", "Mineral Enhancement", "Eco-Friendly", "Easy Maintenance"],
      description: "Experience the health benefits of naturally cooled and mineral-enriched water with this innovative storage system",
      isNew: true,
      arrivedDate: "2024-09-20",
      trending: false,
      stockStatus: "Pre-Order",
      estimatedDelivery: "7-10 days"
    }
  ]

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "dinnerware", label: "Dinnerware" },
    { value: "garden-decor", label: "Garden Decor" },
    { value: "spiritual", label: "Spiritual" },
    { value: "serving", label: "Serving" },
    { value: "cooking", label: "Cooking" },
    { value: "water-storage", label: "Water Storage" }
  ]

  // Combine mock products with real products from database
  const allProducts = [...newArrivalsProducts, ...realProducts]

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase().replace(" ", "-") === selectedCategory
    const matchesSearch = searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = priceRange === "all" ||
      (priceRange === "under-3000" && product.price < 3000) ||
      (priceRange === "3000-5000" && product.price >= 3000 && product.price < 5000) ||
      (priceRange === "5000-8000" && product.price >= 5000 && product.price < 8000) ||
      (priceRange === "above-8000" && product.price >= 8000)

    return matchesCategory && matchesSearch && matchesPrice
  })

  const sortedProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.arrivedDate).getTime() - new Date(a.arrivedDate).getTime()
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "trending":
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-indigo-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-blue-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-indigo-100 text-indigo-800 border-indigo-200 text-sm px-4 py-2">
                <Bell className="h-4 w-4 mr-2" />
                New Arrivals Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Latest <span className="text-indigo-600">Arrivals</span> & Innovations
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Discover our newest terracotta creations, featuring cutting-edge designs, innovative techniques, and contemporary aesthetics.
                Be the first to experience the latest in traditional craftsmanship evolved for modern living.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Shop New Arrivals
                </Button>
                <Button size="lg" variant="outline" className="border-indigo-200 hover:bg-indigo-50 text-lg px-8 py-3">
                  <Bell className="h-5 w-5 mr-2" />
                  Get Notified
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fresh Innovations</h3>
                <p className="text-gray-600">Latest designs and techniques from our master artisans</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trending Now</h3>
                <p className="text-gray-600">Popular styles and contemporary designs gaining momentum</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Limited Edition</h3>
                <p className="text-gray-600">Exclusive pieces available for a limited time only</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600">Enhanced craftsmanship with modern quality standards</p>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Filters Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Enhanced Filters */}
              <div className="lg:w-1/4">
                <Card className="border-indigo-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
                    </div>

                    <div className="space-y-6">
                      {/* Search */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Search Products</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search new arrivals..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-indigo-100 focus:border-indigo-300"
                          />
                        </div>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="border-indigo-100 focus:border-indigo-300">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price Range Filter */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Price Range</label>
                        <Select value={priceRange} onValueChange={setPriceRange}>
                          <SelectTrigger className="border-indigo-100 focus:border-indigo-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-3000">Under ₹3,000</SelectItem>
                            <SelectItem value="3000-5000">₹3,000 - ₹5,000</SelectItem>
                            <SelectItem value="5000-8000">₹5,000 - ₹8,000</SelectItem>
                            <SelectItem value="above-8000">Above ₹8,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Features Checkboxes */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-indigo-200 text-indigo-600 mr-2" />
                            <span className="text-sm text-gray-600">Limited Edition</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-indigo-200 text-indigo-600 mr-2" />
                            <span className="text-sm text-gray-600">Trending</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-indigo-200 text-indigo-600 mr-2" />
                            <span className="text-sm text-gray-600">Artist Edition</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-indigo-200 text-indigo-600 mr-2" />
                            <span className="text-sm text-gray-600">Pre-Order Available</span>
                          </label>
                        </div>
                      </div>

                      {/* Arrival Date */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Arrival Date</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-indigo-200 text-indigo-600 mr-2" />
                            <span className="text-sm text-gray-600">This Week</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-indigo-200 text-indigo-600 mr-2" />
                            <span className="text-sm text-gray-600">Last 2 Weeks</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-indigo-200 text-indigo-600 mr-2" />
                            <span className="text-sm text-gray-600">This Month</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Content - Products */}
              <div className="lg:w-3/4">
                {/* Sort Options */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
                    <p className="text-gray-600">{sortedProducts.length} new products • Updated daily</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-indigo-100 focus:border-indigo-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedProducts.map((product) => (
                    <Card key={product.id} className="group border-indigo-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <div className="w-full h-64 bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                            <Zap className="h-16 w-16 text-indigo-400" />
                          </div>

                          {/* Multiple Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            <Badge className="bg-indigo-600 text-white">
                              {product.badge}
                            </Badge>
                            {product.trending && (
                              <Badge className="bg-orange-500 text-white">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>

                          <div className="absolute top-3 right-3 flex flex-col gap-1">
                            <Badge className="bg-white/90 text-indigo-600">
                              {product.category}
                            </Badge>
                            <Badge className={`${product.stockStatus === 'In Stock' ? 'bg-green-500' : product.stockStatus === 'Limited Stock' ? 'bg-orange-500' : 'bg-blue-500'} text-white text-xs`}>
                              {product.stockStatus}
                            </Badge>
                          </div>

                          <button className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                            <Heart className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {product.features.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          {/* Additional Info */}
                          <div className="text-xs text-gray-500 mb-4 space-y-1">
                            <div className="flex justify-between">
                              <span>Arrived:</span>
                              <span>{new Date(product.arrivedDate).toLocaleDateString('en-GB')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Delivery:</span>
                              <span>{product.estimatedDelivery}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-indigo-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.stockStatus === 'Pre-Order' ? 'Pre-Order' : 'Add to Cart'}
                            </Button>
                            <Button variant="outline" size="sm" className="border-indigo-200 hover:bg-indigo-50">
                              Quick View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* No Results */}
                {sortedProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">No new arrivals match your criteria</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory("all")
                        setPriceRange("all")
                        setSearchQuery("")
                        setSortBy("newest")
                      }}
                      className="border-indigo-200 hover:bg-indigo-50"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <Bell className="h-12 w-12 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Never Miss New Arrivals</h3>
              <p className="text-xl text-indigo-200 mb-8">
                Be the first to discover our latest creations. Get notified when new products arrive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-indigo-200"
                />
                <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">5,000+ Early Adopters</h3>
                <p className="text-gray-600">Join thousands who get first access to our newest creations</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assured</h3>
                <p className="text-gray-600">Every new product meets our enhanced quality standards</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Priority Shipping</h3>
                <p className="text-gray-600">New arrivals get expedited processing and delivery</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}