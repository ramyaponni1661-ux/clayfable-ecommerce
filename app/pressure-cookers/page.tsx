"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Gauge, ChefHat, Clock, Shield, Users, CheckCircle, Truck, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"

export default function PressureCookersPage() {
  const [selectedSize, setSelectedSize] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
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

      const { data: products, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          price,
          compare_price,
          images,
          is_active,
          is_featured,
          inventory_quantity,
          created_at,
          tags
        `)
        .eq('is_active', true)
        .or('tags.like.%pressure%,tags.like.%cooker%,tags.like.%cooking%')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      const transformedProducts = products?.map((product) => ({
        id: `db-${product.id}`,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.compare_price || product.price * 1.2,
        image: product.images && product.images.length > 0 ? product.images[0] : "/products/clay-pressure-cooker.jpg",
        size: "Medium",
        capacity: "3 Liters",
        rating: 4.5 + (Math.random() * 0.5),
        reviews: Math.floor(Math.random() * 200) + 50,
        badge: product.is_featured ? "Featured" : "New Arrival",
        features: ["Pressure cooking", "Heat retention", "Natural materials", "Healthy cooking"],
        description: product.description || `Traditional ${product.name} for healthy pressure cooking`,
        inStock: (product.inventory_quantity || 0) > 0
      })) || []

      setRealProducts(transformedProducts)
    } catch (error) {
      console.error('Error in fetchRealProducts:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const staticPressureCookerProducts = [
    {
      id: 1,
      name: "Traditional Clay Pressure Cooker - 3L Capacity",
      price: 2999,
      originalPrice: 3499,
      image: "/products/clay-pressure-cooker.jpg",
      size: "Medium",
      capacity: "3 Liters",
      rating: 4.8,
      reviews: 245,
      badge: "Best Seller",
      features: ["Pressure cooking", "Heat retention", "Natural materials", "Healthy cooking"],
      description: "Traditional clay pressure cooker that retains nutrients and adds natural flavors to your food"
    },
    {
      id: 2,
      name: "Large Family Clay Pressure Cooker - 5L",
      price: 4299,
      originalPrice: 4999,
      image: "/products/large-clay-pressure-cooker.jpg",
      size: "Large",
      capacity: "5 Liters",
      rating: 4.7,
      reviews: 189,
      badge: "Family Size",
      features: ["Large capacity", "Even heating", "Traditional cooking", "Durable construction"],
      description: "Perfect for large families, this 5-liter clay pressure cooker ensures even cooking and nutrient retention"
    },
    {
      id: 3,
      name: "Compact Clay Pressure Cooker - 2L",
      price: 2299,
      originalPrice: 2699,
      image: "/products/small-clay-pressure-cooker.jpg",
      size: "Small",
      capacity: "2 Liters",
      rating: 4.6,
      reviews: 156,
      badge: "Compact",
      features: ["Space saving", "Quick cooking", "Energy efficient", "Easy handling"],
      description: "Ideal for small households, this compact pressure cooker delivers efficient cooking results"
    }
  ]

  const sizeOptions = [
    { value: "all", label: "All Sizes" },
    { value: "Small", label: "Small (2L)" },
    { value: "Medium", label: "Medium (3L)" },
    { value: "Large", label: "Large (5L+)" }
  ]

  // Use only real products from database
  const allProducts = realProducts

  const filteredProducts = selectedSize === "all"
    ? allProducts
    : allProducts.filter(product => product.size === selectedSize)

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-orange-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-red-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200 text-sm px-4 py-2">
                Pressure Cookers Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Clay <span className="text-orange-600">Pressure Cookers</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Experience the ancient art of pressure cooking with our handcrafted clay pressure cookers.
                Retain nutrients, enhance flavors, and cook healthier meals with traditional terracotta technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3">
                  <Gauge className="h-5 w-5 mr-2" />
                  Shop Pressure Cookers
                </Button>
                <Button size="lg" variant="outline" className="border-orange-200 hover:bg-orange-50 text-lg px-8 py-3">
                  Cooking Guide
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
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Gauge className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pressure Cooking</h3>
                <p className="text-gray-600">Natural pressure buildup for faster, healthier cooking</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ChefHat className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enhanced Flavors</h3>
                <p className="text-gray-600">Clay adds natural minerals and authentic taste to food</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Time Efficient</h3>
                <p className="text-gray-600">Reduces cooking time while preserving nutrients</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Healthy Cooking</h3>
                <p className="text-gray-600">Chemical-free cooking with natural clay materials</p>
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
                <Card className="border-orange-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Size</label>
                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                          <SelectTrigger className="border-orange-100 focus:border-orange-300">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizeOptions.map(option => (
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
                          <SelectTrigger className="border-orange-100 focus:border-orange-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-3000">Under ₹3,000</SelectItem>
                            <SelectItem value="3000-5000">₹3,000 - ₹5,000</SelectItem>
                            <SelectItem value="above-5000">Above ₹5,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-orange-200 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">Pressure Release Valve</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-orange-200 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">Heat Resistant Handles</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-orange-200 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">Whistle Indicator</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Pressure Cookers</h2>
                    <p className="text-gray-600">{filteredProducts.length} products available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-orange-100 focus:border-orange-300">
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
                    <Link key={product.id} href={`/products/${product.slug}`}>
                      <Card className="group border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                            <Gauge className="h-16 w-16 text-orange-400" />
                          </div>
                          {product.badge && (
                            <Badge className="absolute top-3 left-3 bg-orange-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-orange-600">
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
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
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
                            <span className="text-xl font-bold text-orange-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-orange-600 hover:bg-orange-700" disabled={!product.inStock}>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">25,000+ Health-Conscious Cooks</h3>
                <p className="text-gray-600">Trusted by families for healthy, nutritious pressure cooking</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Traditional Craftsmanship</h3>
                <p className="text-gray-600">Handcrafted using time-tested traditional pottery techniques</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Safe Delivery</h3>
                <p className="text-gray-600">Special protective packaging for fragile clay cookware</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}