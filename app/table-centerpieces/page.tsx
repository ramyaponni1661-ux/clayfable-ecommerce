"use client";

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Flower2, Filter, Star, Award, Gift, Sparkles, Heart, ShoppingCart, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  slug?: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  badge?: string
  inStock?: boolean
  features?: string[]
  description?: string
}


export default function TableCenterpiecesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const supabase = createClient()

  // Cart and Wishlist contexts
  const { addToCart } = useCart()
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist()

  // Handler functions
  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      toast.error('Product is out of stock')
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug
    })
    toast.success(`${product.name} added to cart!`)
  }

  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = wishlistItems?.some(item => item.id === product.id) || false

    if (isInWishlist) {
      removeFromWishlist(product.id)
      toast.success(`${product.name} removed from wishlist`)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug
      })
      toast.success(`${product.name} added to wishlist!`)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // First get the "Table Centerpieces" category ID
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'table-centerpieces')
        .single()

      if (!category) {
        console.error('Table Centerpieces category not found')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('category_id', category.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      if (data && data.length > 0) {
        const transformedProducts: Product[] = data.map(item => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          price: parseFloat(item.price) || 0,
          originalPrice: item.compare_price ? parseFloat(item.compare_price) : item.price * 1.2,
          image: (() => {
            try {
              if (typeof item.images === 'string') {
                return JSON.parse(item.images)?.[0] || "/placeholder.svg"
              } else if (Array.isArray(item.images)) {
                return item.images[0] || "/placeholder.svg"
              }
              return "/placeholder.svg"
            } catch (e) {
              console.warn('Failed to parse product images:', e, item.images)
              return "/placeholder.svg"
            }
          })(),
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 100) + 20,
          badge: item.is_featured ? "Featured" : (Math.random() > 0.7 ? "New" : undefined),
          inStock: (item.inventory_quantity || 0) > 0,
          features: ["Handcrafted", "Premium Clay", "Food Safe", "Easy to Clean"],
          description: item.description || `Beautiful ${item.name} perfect for elegant table displays`
        }))
        setProducts(transformedProducts)
        setFilteredProducts(transformedProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...products]

    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-2000":
          filtered = filtered.filter(p => p.price < 2000)
          break
        case "2000-4000":
          filtered = filtered.filter(p => p.price >= 2000 && p.price <= 4000)
          break
        case "above-4000":
          filtered = filtered.filter(p => p.price > 4000)
          break
      }
    }

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
      default:
        break
    }

    setFilteredProducts(filtered)
  }, [products, sortBy, priceRange])

  return (
    <>
      <ProductHeader />
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-300 rounded-full opacity-15 animate-float-delay-1"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-rose-100 rounded-full opacity-25 animate-float-delay-2"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-pink-200 rounded-full opacity-20 animate-float-delay-3"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-rose-300 rounded-full opacity-15 animate-float"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-rose-100 text-rose-800 border-rose-200 text-sm px-4 py-2">
              Table Centerpieces Collection
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Elegant <span className="text-rose-600">Table</span> Centerpieces
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your dining experience with handcrafted clay centerpieces that bring natural elegance and timeless beauty to every meal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-rose-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-rose-100 rounded-2xl mb-6 mx-auto">
                <Flower2 className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Artistic Design</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Each centerpiece features unique artistic patterns and designs that serve as conversation starters
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-rose-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-rose-100 rounded-2xl mb-6 mx-auto">
                <Award className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Premium Quality</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Handcrafted from premium clay with attention to detail and quality finishing
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-rose-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-rose-100 rounded-2xl mb-6 mx-auto">
                <Gift className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Perfect Gift</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Ideal for housewarmings, weddings, and special occasions as memorable gifts
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-rose-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-rose-100 rounded-2xl mb-6 mx-auto">
                <Sparkles className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Versatile Use</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Perfect for flowers, fruits, decorative items, or as standalone art pieces
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-rose-100 sticky top-4">
                  <div className="flex items-center mb-6">
                    <Filter className="h-5 w-5 text-rose-600 mr-2" />
                    <h3 className="font-bold text-gray-900">Filters</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">Price Range</label>
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="under-2000">Under ₹2,000</SelectItem>
                          <SelectItem value="2000-4000">₹2,000 - ₹4,000</SelectItem>
                          <SelectItem value="above-4000">Above ₹4,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">Sort By</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full">
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

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setPriceRange("all")
                        setSortBy("featured")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>

              <div className="lg:w-3/4">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Table Centerpieces ({filteredProducts.length})
                  </h2>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-rose-100">
                        <div className="w-full h-64 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className="group border-rose-100 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.badge && (
                              <Badge className="absolute top-3 left-3 bg-rose-600 text-white border-0">
                                {product.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="p-6">
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(product.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                {product.originalPrice && (
                                  <span className="text-lg text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                )}
                              </div>
                              <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-3xl p-12 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">The Art of Table Decoration</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how our handcrafted centerpieces transform ordinary dining into extraordinary experiences
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flower2 className="h-8 w-8 text-rose-700" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Natural Beauty</h4>
                <p className="text-gray-600">
                  Earthy clay textures and organic forms bring nature's elegance to your dining space
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-rose-700" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Artisan Crafted</h4>
                <p className="text-gray-600">
                  Each piece is lovingly handcrafted by skilled artisans with generations of expertise
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-rose-700" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Timeless Appeal</h4>
                <p className="text-gray-600">
                  Classic designs that complement both traditional and contemporary dining settings
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-rose-100 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Styling Your Centerpiece</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Expert tips for creating stunning table displays with your clay centerpieces
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Seasonal Flowers</h4>
                <p className="text-gray-600 text-sm">
                  Use fresh seasonal blooms to create dynamic displays that change throughout the year
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Height Variation</h4>
                <p className="text-gray-600 text-sm">
                  Combine different sized pieces to create visual interest and depth on your table
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Natural Elements</h4>
                <p className="text-gray-600 text-sm">
                  Incorporate fruits, leaves, or stones for organic, textured arrangements
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Lighting Effects</h4>
                <p className="text-gray-600 text-sm">
                  Add candles or fairy lights to create warm, ambient lighting around your centerpiece
                </p>
              </div>
            </div>
          </div>

          {/* Internal Links Section */}
          <div className="mt-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-rose-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Explore More Categories</h3>
                <p className="text-gray-600">
                  Discover our complete collection of handcrafted terracotta pottery
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <a href="/cooking" className="group block p-4 rounded-xl border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                      Traditional Cooking Pots
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Clay cookware for healthy meals
                  </p>
                </a>

                <a href="/wind-chimes" className="group block p-4 rounded-xl border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                      Musical Wind Chimes
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Soothing terracotta sounds
                  </p>
                </a>

                <a href="/tea-sets" className="group block p-4 rounded-xl border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                      Clay Tea Sets
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Authentic chai experience
                  </p>
                </a>

                <a href="/spice-containers" className="group block p-4 rounded-xl border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                      Spice Storage Jars
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Keep spices fresh naturally
                  </p>
                </a>

                <a href="/decorative-lamps" className="group block p-4 rounded-xl border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                      Clay Lighting
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Traditional illumination
                  </p>
                </a>

                <a href="/all-pottery" className="group block p-4 rounded-xl border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                      All Pottery
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Browse complete collection
                  </p>
                </a>
              </div>

              <div className="text-center mt-8">
                <a href="/collections" className="inline-flex items-center px-6 py-3 bg-rose-600 text-white font-semibold rounded-full hover:bg-rose-700 transition-colors">
                  View Collections
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ProductFooter />
    </>
  )
}