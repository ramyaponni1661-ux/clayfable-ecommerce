"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Circle,
  Star,
  Filter,
  Shield,
  Award,
  Heart,
  ShoppingCart,
  Users,
  CheckCircle,
  Truck,
  Utensils
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { createClient } from '@/lib/supabase/client'
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"

export default function TraditionalGriddlesPage() {
  const [selectedSize, setSelectedSize] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [griddleProducts, setGriddleProducts] = useState([])
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

  // Fetch griddle products from database
  useEffect(() => {
    const fetchGriddleProducts = async () => {
      try {
        const supabase = createClient()

        // First get the "Traditional Griddles" category ID
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', 'traditional-griddles')
          .single()

        if (!category) {
          console.error('Traditional Griddles category not found')
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
          console.error('Error fetching griddle products:', error)
        } else {
          const transformedProducts = products?.map(product => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.compare_price || Math.floor(product.price * 1.25),
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
            rating: 4.5 + Math.random() * 0.4, // Random rating between 4.5-4.9
            reviewCount: Math.floor(Math.random() * 180) + 40,
            badges: ["Handcrafted"],
            size: "Standard",
            features: ["Even Heating", "Non-Stick", "Traditional"],
            material: product.material_details || "Quality Terracotta",
            description: product.description || "Traditional clay griddle",
            style: "Traditional"
          })) || []

          setGriddleProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGriddleProducts()
  }, [])


  const sizeOptions = [
    { value: "all", label: "All Sizes" },
    { value: "small", label: "Small (8-9 inch)" },
    { value: "medium", label: "Medium (10-11 inch)" },
    { value: "large", label: "Large (12+ inch)" }
  ]

  // Use database products if available, otherwise use static
  const allProducts = griddleProducts

  const filteredProducts = selectedSize === "all"
    ? allProducts
    : allProducts.filter(product => {
        if (selectedSize === "small") return product.size?.toLowerCase().includes("small") || product.size?.includes("8") || product.size?.includes("9")
        if (selectedSize === "medium") return product.size?.toLowerCase().includes("medium") || product.size?.includes("10") || product.size?.includes("11")
        if (selectedSize === "large") return product.size?.toLowerCase().includes("large") || product.size?.includes("12") || product.size?.includes("14")
        return true
      })

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-orange-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200 text-sm px-4 py-2">
                Traditional Griddles Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Authentic <span className="text-yellow-600">Clay Griddles</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Clay tawa and cooking surfaces for authentic flatbreads, pancakes, and traditional cooking.
                Experience the perfect heat distribution and natural non-stick properties of traditional griddles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-lg px-8 py-3">
                  Shop Griddles
                </Button>
                <Button size="lg" variant="outline" className="border-yellow-200 hover:bg-yellow-50 text-lg px-8 py-3">
                  Cooking Tips
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
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Circle className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Even Heat Distribution</h3>
                <p className="text-gray-600">Clay ensures uniform heat for perfectly cooked flatbreads and pancakes</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Utensils className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Non-Stick</h3>
                <p className="text-gray-600">Develops natural non-stick properties with proper seasoning</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enhanced Flavor</h3>
                <p className="text-gray-600">Adds subtle earthy flavor to rotis, dosas, and traditional breads</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Traditional Craft</h3>
                <p className="text-gray-600">Handcrafted using time-tested techniques for authentic cooking</p>
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
                <Card className="border-yellow-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-yellow-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Size</label>
                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                          <SelectTrigger className="border-yellow-100 focus:border-yellow-300">
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
                          <SelectTrigger className="border-yellow-100 focus:border-yellow-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-500">Under ₹500</SelectItem>
                            <SelectItem value="500-800">₹500 - ₹800</SelectItem>
                            <SelectItem value="800-1200">₹800 - ₹1,200</SelectItem>
                            <SelectItem value="above-1200">Above ₹1,200</SelectItem>
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
                    Traditional Griddles ({filteredProducts.length})
                  </h2>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-yellow-100 focus:border-yellow-300">
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
                    <Card key={product.id} className="group border-yellow-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                                <div className="w-full h-64 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                                  <Circle className="h-16 w-16 text-yellow-400" />
                                </div>
                              )}
                            </div>
                            {product.badges.map((badge, idx) => (
                              <Badge key={idx} className={`absolute top-3 ${idx === 0 ? 'left-3' : 'right-3'} bg-yellow-600 text-white text-xs`}>
                                {badge}
                              </Badge>
                            ))}
                            <Badge className="absolute top-3 right-3 bg-white/90 text-yellow-600">
                              {product.size}
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
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2 cursor-pointer">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">Size: {product.size}</p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {product.features.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-yellow-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                              <Button variant="outline" size="sm" className="border-yellow-200 hover:bg-yellow-50">
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