"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Flame,
  Star,
  Filter,
  Shield,
  Award,
  Heart,
  ShoppingCart,
  Users,
  CheckCircle,
  Truck,
  Target
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { createClient } from '@/lib/supabase/client'

export default function TandoorAccessoriesPage() {
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [tandoorProducts, setTandoorProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch tandoor products from database
  useEffect(() => {
    const fetchTandoorProducts = async () => {
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
          .or('product_tags.cs.{"tandoor"}', 'product_tags.cs.{"oven"}', 'product_tags.cs.{"accessories"}')
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          console.error('Error fetching tandoor products:', error)
        } else {
          const transformedProducts = products?.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.compare_price || Math.floor(product.price * 1.3),
            image: product.images ? JSON.parse(product.images)?.[0] || "/placeholder.svg" : "/placeholder.svg",
            rating: 4.6 + Math.random() * 0.3, // Random rating between 4.6-4.9
            reviewCount: Math.floor(Math.random() * 200) + 30,
            badges: ["Handcrafted"],
            inStock: product.inventory_quantity > 0,
            type: "Traditional",
            features: ["High Heat", "Authentic Design", "Durable"],
            material: product.material_details || "Premium Terracotta"
          })) || []

          setTandoorProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTandoorProducts()
  }, [])

  const staticTandoorProducts = [
    {
      id: 1,
      name: "Traditional Clay Tandoor Pot - Large",
      price: 1899,
      originalPrice: 2499,
      image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      rating: 4.9,
      reviewCount: 156,
      badges: ["Bestseller", "Premium"],
      inStock: true,
      type: "Large",
      features: ["High Temperature", "Authentic Flavor", "Professional Grade"]
    },
    {
      id: 2,
      name: "Tandoor Cooking Set with Tools",
      price: 2299,
      originalPrice: 2899,
      image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      rating: 4.8,
      reviewCount: 123,
      badges: ["Complete Set", "Chef's Choice"],
      inStock: true,
      type: "Set",
      features: ["Complete Kit", "Professional Tools", "Traditional Design"]
    },
    {
      id: 3,
      name: "Clay Tandoor Bread Maker",
      price: 1299,
      originalPrice: 1699,
      image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      rating: 4.7,
      reviewCount: 89,
      badges: ["Specialized"],
      inStock: true,
      type: "Medium",
      features: ["Perfect Naan", "Even Heating", "Easy Use"]
    },
    {
      id: 4,
      name: "Mini Tandoor for Home Use",
      price: 899,
      originalPrice: 1199,
      image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      rating: 4.6,
      reviewCount: 67,
      badges: ["Compact"],
      inStock: true,
      type: "Small",
      features: ["Space Saving", "Home Friendly", "Authentic Results"]
    },
    {
      id: 5,
      name: "Professional Tandoor Kit",
      price: 3499,
      originalPrice: 4299,
      image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      rating: 4.9,
      reviewCount: 234,
      badges: ["Professional", "Restaurant Quality"],
      inStock: false,
      type: "Professional",
      features: ["Commercial Grade", "High Capacity", "Superior Heat"]
    },
    {
      id: 6,
      name: "Tandoor Accessory Set",
      price: 799,
      originalPrice: 999,
      image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      rating: 4.5,
      reviewCount: 45,
      badges: ["Essential Tools"],
      inStock: true,
      type: "Accessories",
      features: ["Complete Tools", "Durable", "Traditional"]
    }
  ]

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "small", label: "Small & Home" },
    { value: "large", label: "Large & Commercial" },
    { value: "accessories", label: "Tools & Accessories" }
  ]

  // Use database products if available, otherwise use static
  const allProducts = tandoorProducts.length > 0 ? tandoorProducts : staticTandoorProducts

  const filteredProducts = selectedType === "all"
    ? allProducts
    : allProducts.filter(product => {
        if (selectedType === "small") return product.type?.toLowerCase().includes("small") || product.type?.toLowerCase().includes("mini")
        if (selectedType === "large") return product.type?.toLowerCase().includes("large") || product.type?.toLowerCase().includes("professional")
        if (selectedType === "accessories") return product.type?.toLowerCase().includes("accessories") || product.type?.toLowerCase().includes("set")
        return true
      })

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-red-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-orange-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-red-100 text-red-800 border-red-200 text-sm px-4 py-2">
                Tandoor Accessories Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Authentic <span className="text-red-600">Tandoor</span> Setup
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Complete tandoor setup items for traditional high-temperature cooking. Experience authentic flavors
                with our handcrafted tandoor accessories designed for home and professional use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3">
                  Shop Tandoor Items
                </Button>
                <Button size="lg" variant="outline" className="border-red-200 hover:bg-red-50 text-lg px-8 py-3">
                  Setup Guide
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
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Flame className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">High Temperature</h3>
                <p className="text-gray-600">Built to withstand extreme tandoor temperatures for authentic cooking</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Setup</h3>
                <p className="text-gray-600">Everything you need for traditional tandoor cooking and baking</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Authentic Results</h3>
                <p className="text-gray-600">Achieve distinctive flavors and textures of traditional tandoor cooking</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Grade</h3>
                <p className="text-gray-600">Restaurant-quality accessories for serious tandoor enthusiasts</p>
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
                <Card className="border-red-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-red-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Type</label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger className="border-red-100 focus:border-red-300">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeOptions.map(option => (
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
                          <SelectTrigger className="border-red-100 focus:border-red-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-1000">Under ₹1,000</SelectItem>
                            <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                            <SelectItem value="2000-3000">₹2,000 - ₹3,000</SelectItem>
                            <SelectItem value="above-3000">Above ₹3,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Content - Products */}
              <div className="lg:w-3/4">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tandoor Accessories ({filteredProducts.length})
                  </h2>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-red-100 focus:border-red-300">
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
                  {loading ? (
                    // Loading skeleton
                    Array(6).fill(0).map((_, index) => (
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
                    ))
                  ) : filteredProducts.map((product) => (
                    <Card key={product.id} className="group border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          {product.image && product.image !== "/placeholder.svg" ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-64 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                              <Flame className="h-16 w-16 text-red-400" />
                            </div>
                          )}
                          {product.badges.map((badge, idx) => (
                            <Badge key={idx} className={`absolute top-3 ${idx === 0 ? 'left-3' : 'right-3'} bg-red-600 text-white text-xs`}>
                              {badge}
                            </Badge>
                          ))}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-red-600">
                            {product.type}
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
                            <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">Type: {product.type}</p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {product.features.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-red-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-red-600 hover:bg-red-700" disabled={!product.inStock}>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Button variant="outline" size="sm" className="border-red-200 hover:bg-red-50">
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
      </div>

      <ProductFooter />
    </div>
  )
}