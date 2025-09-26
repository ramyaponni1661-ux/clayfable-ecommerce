"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Package, Crown, Gift, Utensils, Users, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { createClient } from '@/lib/supabase/client'

export default function ServingSetsPage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [servingSetsProducts, setServingSetsProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch serving sets products from database
  useEffect(() => {
    const fetchServingSetsProducts = async () => {
      try {
        const supabase = createClient()
        const { data: products, error } = await supabase
          .from('products')
          .select(`
            id, name, slug, description, price, compare_price, images,
            is_active, inventory_quantity, created_at, capacity,
            material_details, usage_instructions, care_instructions,
            product_tags, categories (id, name, slug)
          `)
          .eq('is_active', true)
          .or('product_tags.cs.{"set"}', 'product_tags.cs.{"serving-set"}', 'product_tags.cs.{"dinner-set"}', 'product_tags.cs.{"serving"}')
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          console.error('Error fetching serving sets products:', error)
        } else {
          const transformedProducts = products?.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.compare_price || Math.floor(product.price * 1.2),
            image: product.images ? JSON.parse(product.images)?.[0] || "/placeholder.svg" : "/placeholder.svg",
            capacity: product.capacity || "Standard Set",
            rating: 4.5 + Math.random() * 0.4,
            reviews: Math.floor(Math.random() * 300) + 50,
            badge: product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? "New" : "Best Seller",
            features: ["Complete Service", "Elegant Design", "Gift Ready", "Premium Quality"],
            description: product.description || "Beautiful serving set crafted from natural terracotta for elegant dining"
          })) || []

          setServingSetsProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServingSetsProducts()
  }, [])

  const staticServingSetsProducts = [
    {
      id: 1,
      name: "Royal Heritage Dinner Set",
      price: 8999,
      originalPrice: 11999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "32-piece set",
      rating: 4.9,
      reviews: 234,
      badge: "Best Seller",
      features: ["Complete Service", "Elegant Design", "Gift Ready", "Premium Quality"],
      description: "Experience royal dining with this exquisite 32-piece dinner set featuring traditional terracotta craftsmanship"
    },
    {
      id: 2,
      name: "Traditional Tea & Snack Set",
      price: 3299,
      originalPrice: 3899,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "15-piece set",
      rating: 4.8,
      reviews: 456,
      badge: "Premium",
      features: ["Complete Tea Service", "Traditional Design", "Authentic Taste", "Perfect Size"],
      description: "Perfect for afternoon tea, this traditional set includes teapot, cups, saucers, and snack plates"
    },
    {
      id: 3,
      name: "Festive Celebration Serving Set",
      price: 5999,
      originalPrice: 7499,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "18-piece set",
      rating: 4.7,
      reviews: 189,
      badge: "Handcrafted",
      features: ["Decorative Design", "Large Serving Bowls", "Cultural Motifs", "Celebration Ready"],
      description: "Celebrate in style with this festive serving set featuring traditional Indian motifs and large serving bowls"
    },
    {
      id: 4,
      name: "Modern Minimalist Dinner Set",
      price: 4599,
      originalPrice: 5499,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "24-piece set",
      rating: 4.6,
      reviews: 167,
      badge: "Modern",
      features: ["Clean Lines", "Contemporary Design", "Everyday Use", "Stackable"],
      description: "Sleek and modern, this minimalist dinner set combines contemporary design with traditional craftsmanship"
    },
    {
      id: 5,
      name: "Wedding Collection Serving Set",
      price: 12999,
      originalPrice: 15999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "42-piece set",
      rating: 4.9,
      reviews: 98,
      badge: "Luxury",
      features: ["Luxury Design", "Premium Quality", "Complete Service", "Gift Box"],
      description: "Perfect for newlyweds or special occasions, this luxury serving set combines elegance with functionality"
    },
    {
      id: 6,
      name: "Artisan Craft Serving Collection",
      price: 6799,
      originalPrice: 7999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "20-piece set",
      rating: 4.8,
      reviews: 145,
      badge: "Artisan",
      features: ["Hand-Crafted", "Unique Patterns", "Artisan Made", "Limited Edition"],
      description: "Each piece is uniquely crafted by master artisans, featuring individual character and artistic flair"
    }
  ]

  const capacityOptions = [
    { value: "all", label: "All Sets" },
    { value: "small", label: "Small Sets (15-20 pieces)" },
    { value: "medium", label: "Medium Sets (24-32 pieces)" },
    { value: "large", label: "Large Sets (42+ pieces)" }
  ]

  // Use only database products
  const allProducts = servingSetsProducts

  const filteredProducts = selectedCapacity === "all"
    ? allProducts
    : allProducts.filter(product => {
        const pieces = parseInt(product.capacity)
        if (selectedCapacity === "small") return pieces <= 20
        if (selectedCapacity === "medium") return pieces >= 24 && pieces <= 32
        if (selectedCapacity === "large") return pieces >= 42
        return true
      })

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-purple-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-pink-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200 text-sm px-4 py-2">
                Serving Sets Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Complete <span className="text-purple-600">Serving</span> Sets
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Transform every meal into a memorable dining experience with our thoughtfully curated serving sets.
                From intimate family dinners to grand celebrations, each complete set brings harmony and elegance to your table.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                  Shop Serving Sets
                </Button>
                <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-50 text-lg px-8 py-3">
                  Complete Set Guide
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
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Package className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Solutions</h3>
                <p className="text-gray-600">Everything you need for perfect table service in one coordinated set</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Crown className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Elegant Design</h3>
                <p className="text-gray-600">Harmoniously crafted pieces that create stunning table presentations</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Utensils className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Multiple Sizes</h3>
                <p className="text-gray-600">From intimate gatherings to large celebrations, sets for every occasion</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Gift className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gift Ready</h3>
                <p className="text-gray-600">Beautiful presentation packaging makes these perfect for gifting</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Filters */}
              <div className="lg:w-1/4">
                <Card className="border-purple-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Set Size</label>
                        <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                          <SelectTrigger className="border-purple-100 focus:border-purple-300">
                            <SelectValue placeholder="Select set size" />
                          </SelectTrigger>
                          <SelectContent>
                            {capacityOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Price Range</label>
                        <Select value={priceRange} onValueChange={setPriceRange}>
                          <SelectTrigger className="border-purple-100 focus:border-purple-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-5000">Under ₹5,000</SelectItem>
                            <SelectItem value="5000-8000">₹5,000 - ₹8,000</SelectItem>
                            <SelectItem value="8000-12000">₹8,000 - ₹12,000</SelectItem>
                            <SelectItem value="above-12000">Above ₹12,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-purple-200 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-600">Dishwasher Safe</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-purple-200 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-600">Gift Packaging</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-purple-200 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-600">Hand-Painted</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Serving Sets</h2>
                    <p className="text-gray-600">{filteredProducts.length} products available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-purple-100 focus:border-purple-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                            <Package className="h-16 w-16 text-purple-400" />
                          </div>
                          {product.badge && (
                            <Badge className="absolute top-3 left-3 bg-purple-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-purple-600">
                            {product.capacity}
                          </Badge>
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
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
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

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-purple-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
                              Quick View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">25,000+ Complete Sets Sold</h3>
                <p className="text-gray-600">Trusted by families for complete dining solutions</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Guaranteed</h3>
                <p className="text-gray-600">Each piece crafted for durability and everyday use</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Set Delivery</h3>
                <p className="text-gray-600">Expert packaging ensures all pieces arrive safely</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}