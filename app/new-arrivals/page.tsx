"use client";

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
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"

export default function NewArrivalsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [realProducts, setRealProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  // Cart and wishlist hooks
  const { addItem, isInCart, getItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    setIsVisible(true)
    fetchRealProducts()
  }, [])

  const handleAddToCart = (product: any) => {
    if (product.stock === 0) {
      toast.error("Product is out of stock")
      return
    }

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        inStock: product.stock > 0,
        maxQuantity: product.stock
      }

      addItem(cartItem)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error("Failed to add item to cart")
      console.error("Add to cart error:", error)
    }
  }

  const handleWishlistToggle = (product: any) => {
    try {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id)
        toast.success(`${product.name} removed from wishlist`)
      } else {
        const wishlistItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          inStock: product.stock > 0
        }
        addToWishlist(wishlistItem)
        toast.success(`${product.name} added to wishlist!`)
      }
    } catch (error) {
      toast.error("Failed to update wishlist")
      console.error("Wishlist error:", error)
    }
  }

  const fetchRealProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const supabase = createClient()

      // Calculate date 30 days ago for "New Arrivals" (industry standard)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      // Fetch products created in the last 30 days (true "New Arrivals")
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, slug, price, images, compare_price, is_active, created_at, inventory_quantity')
        .eq('is_active', true)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('New Arrivals: Error fetching products:', error)
        return
      }

      // Transform database products
      const transformedProducts = products?.map((product, index) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.price) || 0,
        originalPrice: product.compare_price ? parseFloat(product.compare_price) : Math.round(product.price * 1.25),
        image: (() => {
          try {
            if (typeof product.images === 'string') {
              return JSON.parse(product.images)?.[0] || "/placeholder.svg"
            } else if (Array.isArray(product.images)) {
              return product.images[0] || "/placeholder.svg"
            }
            return "/placeholder.svg"
          } catch (e) {
            console.warn('Failed to parse product images:', e, product.images)
            return "/placeholder.svg"
          }
        })(),
        rating: 4 + Math.random(),
        reviewCount: Math.floor(Math.random() * 50) + 10,
        badges: [
          { type: 'new', text: 'New Arrival' }
        ],
        badge: index === 0 ? 'Latest' : 'New Arrival', // First product gets "Latest" badge
        stock: product.inventory_quantity || 10,
        category: "Pottery",
        description: `Beautiful ${product.name}`,
        features: ["Handcrafted", "Eco-friendly"],
        trending: index < 3,
        newArrival: true,
        discount: 25,
        urgency: product.inventory_quantity <= 5 ? "Only few left!" : "",
        estimatedDelivery: "3-5 days",
        inStock: (product.inventory_quantity || 0) > 0,
        stockStatus: (product.inventory_quantity || 0) > 10 ? "In Stock" :
                     (product.inventory_quantity || 0) > 0 ? "Limited Stock" : "Out of Stock"
      })) || []

      setRealProducts(transformedProducts)

    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Only use database products - no hardcoded data

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "dinnerware", label: "Dinnerware" },
    { value: "garden-decor", label: "Garden Decor" },
    { value: "spiritual", label: "Spiritual" },
    { value: "serving", label: "Serving" },
    { value: "cooking", label: "Cooking" },
    { value: "water-storage", label: "Water Storage" }
  ]

  // Use only real products from database
  const allProducts = realProducts

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
    <>
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
                          <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                            <div className="cursor-pointer">
                              {product.image !== "/placeholder.svg" ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={400}
                                  height={300}
                                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="w-full h-64 bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                                  <Zap className="h-16 w-16 text-indigo-400" />
                                </div>
                              )}
                            </div>
                          </Link>

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
                            <Badge className={`${
                              product.stockStatus === 'In Stock' ? 'bg-green-500' :
                              product.stockStatus === 'Limited Stock' ? 'bg-orange-500' :
                              'bg-red-500'
                            } text-white text-xs`}>
                              {product.stockStatus}
                            </Badge>
                          </div>

                          <button
                            className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleWishlistToggle(product)
                            }}
                          >
                            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
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
                          <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer">
                              {product.name}
                            </h3>
                          </Link>
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
                            <Button
                              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {!product.inStock ? 'Out of Stock' : isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                            </Button>
                            <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                              <Button variant="outline" size="sm" className="border-indigo-200 hover:bg-indigo-50">
                                Quick View
                              </Button>
                            </Link>
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
    </>
  )
}