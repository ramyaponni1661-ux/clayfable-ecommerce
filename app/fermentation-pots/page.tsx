"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Beaker,
  Star,
  Filter,
  Shield,
  Award,
  Heart,
  ShoppingCart,
  Users,
  CheckCircle,
  Truck,
  FlaskConical
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { createClient } from '@/lib/supabase/client'
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"

export default function FermentationPotsPage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [fermentationProducts, setFermentationProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Cart and wishlist hooks
  const { addItem, isInCart, getItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    setIsVisible(true)
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

  // Fetch fermentation products from database
  useEffect(() => {
    const fetchFermentationProducts = async () => {
      try {
        const supabase = createClient()

        // First get the "Fermentation Pots" category ID
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', 'fermentation-pots')
          .single()

        if (!category) {
          console.error('Fermentation Pots category not found')
          setLoading(false)
          return
        }

        const { data: products, error } = await supabase
          .from('products')
          .select(`
            id, name, slug, description, price, compare_price, images,
            is_active, inventory_quantity, created_at, capacity,
            material_details, usage_instructions, care_instructions,
            product_tags,
            categories (id, name, slug)
          `)
          .eq('is_active', true)
          .eq('category_id', category.id)
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          console.error('Error fetching fermentation products:', error)
        } else {
          const transformedProducts = products?.map(product => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.compare_price || Math.floor(product.price * 1.35),
            stock: product.inventory_quantity || 0,
            inStock: (product.inventory_quantity || 0) > 0,
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
            rating: 4.4 + Math.random() * 0.5, // Random rating between 4.4-4.9
            reviewCount: Math.floor(Math.random() * 150) + 25,
            badges: ["Handcrafted"],
            capacity: product.capacity || "1L",
            features: ["Natural pH", "Breathable", "Chemical-Free"],
            material: product.material_details || "Food-Grade Terracotta",
            description: product.description || "Traditional fermentation pot",
            size: "Standard",
            style: "Traditional"
          })) || []

          setFermentationProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFermentationProducts()
  }, [])


  const capacityOptions = [
    { value: "all", label: "All Capacities" },
    { value: "small", label: "Small (0.5-1L)" },
    { value: "medium", label: "Medium (1-3L)" },
    { value: "large", label: "Large (3L+)" }
  ]

  // Use database products if available, otherwise use static
  const allProducts = fermentationProducts

  const filteredProducts = selectedCapacity === "all"
    ? allProducts
    : allProducts.filter(product => {
        const capacity = parseFloat(product.capacity) || 1
        if (selectedCapacity === "small") return capacity <= 1
        if (selectedCapacity === "medium") return capacity > 1 && capacity <= 3
        if (selectedCapacity === "large") return capacity > 3
        return true
      })

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-purple-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-indigo-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200 text-sm px-4 py-2">
                Fermentation Pots Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Traditional <span className="text-purple-600">Fermentation</span> Pots
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Traditional clay vessels for fermentation and food preparation - perfect for pickles, kimchi, yogurt,
                and more. Natural clay properties create the ideal environment for healthy fermentation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                  Shop Fermentation Pots
                </Button>
                <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-50 text-lg px-8 py-3">
                  Fermentation Guide
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
                  <Beaker className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Fermentation</h3>
                <p className="text-gray-600">Clay's natural properties create perfect environment for healthy fermentation</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FlaskConical className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">pH Balance</h3>
                <p className="text-gray-600">Natural alkaline properties help maintain optimal fermentation conditions</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Chemical-Free</h3>
                <p className="text-gray-600">No harmful chemicals or coatings that could affect fermented foods</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Traditional Methods</h3>
                <p className="text-gray-600">Time-tested designs used for generations in food preparation</p>
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
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Capacity</label>
                        <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                          <SelectTrigger className="border-purple-100 focus:border-purple-300">
                            <SelectValue placeholder="Select capacity" />
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
                            <SelectItem value="under-700">Under ₹700</SelectItem>
                            <SelectItem value="700-1200">₹700 - ₹1,200</SelectItem>
                            <SelectItem value="1200-2000">₹1,200 - ₹2,000</SelectItem>
                            <SelectItem value="above-2000">Above ₹2,000</SelectItem>
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
                    Fermentation Pots ({filteredProducts.length})
                  </h2>
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
                    <Card key={product.id} className="group border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                          <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                            <div className="relative w-full h-64">
                              {product.image && product.image !== "/placeholder.svg" ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                                  <Beaker className="h-16 w-16 text-purple-400" />
                                </div>
                              )}
                            </div>
                            {product.badges.map((badge, idx) => (
                              <Badge key={idx} className={`absolute top-3 ${idx === 0 ? 'left-3' : 'right-3'} bg-purple-600 text-white text-xs`}>
                                {badge}
                              </Badge>
                            ))}
                            <Badge className="absolute top-3 right-3 bg-white/90 text-purple-600">
                              {product.capacity}
                            </Badge>
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
                        </Link>
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
                          <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2 cursor-pointer">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">Capacity: {product.capacity}</p>

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
                            <Button
                              className="flex-1 bg-purple-600 hover:bg-purple-700"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                              <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
                                Quick View
                              </Button>
                            </Link>
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
    </>
  )
}