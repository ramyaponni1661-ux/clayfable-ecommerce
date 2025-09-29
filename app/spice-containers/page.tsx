"use client";

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Container, Leaf, Award, Shield, Users, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { createClient } from '@/lib/supabase/client'
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  slug?: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  badges?: string[]
  inStock?: boolean
  features?: string[]
  description?: string
  capacity?: string
}

export default function SpiceContainersPage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [spiceContainersProducts, setSpiceContainersProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist()

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
    setIsVisible(true)
  }, [])

  // Fetch spice containers products from database
  useEffect(() => {
    const fetchSpiceContainersProducts = async () => {
      try {
        const supabase = createClient()
        // First get the "Spice Containers" category ID
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', 'spice-containers')
          .single()

        if (!category) {
          console.error('Spice Containers category not found')
          setLoading(false)
          return
        }

        const { data: products, error } = await supabase
          .from('products')
          .select(`
            id, name, slug, description, price, compare_price, images,
            is_active, inventory_quantity, created_at, capacity,
            material_details, usage_instructions, care_instructions,
            product_tags, categories (id, name, slug)
          `)
          .eq('is_active', true)
          .eq('category_id', category.id)
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          console.error('Error fetching spice containers products:', error)
        } else {
          const transformedProducts = products?.map(product => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: parseFloat(product.price) || 0,
            originalPrice: product.compare_price || Math.floor(product.price * 1.2),
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
            rating: 4.5 + Math.random() * 0.4,
            reviewCount: Math.floor(Math.random() * 300) + 50,
            badges: ["Handcrafted"],
            inStock: (product.inventory_quantity || 0) > 0,
            description: product.description || "Generated description based on product name",
            capacity: product.capacity || "500ml",
            features: ["Airtight Seal", "Freshness Lock", "Natural Storage"],
            material: product.material_details || "Traditional Terracotta",
            usageInstructions: product.usage_instructions,
            careInstructions: product.care_instructions
          })) || []

          setSpiceContainersProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSpiceContainersProducts()
  }, [])

  const capacityOptions = [
    { value: "all", label: "All Sizes" },
    { value: "small", label: "Small (100-250ml)" },
    { value: "medium", label: "Medium (500-750ml)" },
    { value: "large", label: "Large (1L+)" }
  ]

  // Use only database products
  const allProducts = spiceContainersProducts

  const filteredProducts = selectedCapacity === "all"
    ? allProducts
    : allProducts.filter(product => {
        const capacity = product.capacity?.toLowerCase()
        if (selectedCapacity === "small") return capacity?.includes("100") || capacity?.includes("250")
        if (selectedCapacity === "medium") return capacity?.includes("500") || capacity?.includes("750")
        if (selectedCapacity === "large") return capacity?.includes("1l") || capacity?.includes("litr")
        return true
      })

  return (
    <>
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
                Spice Containers Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Natural <span className="text-orange-600">Spice</span> Storage
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Preserve the freshness and potency of your spices with our handcrafted terracotta containers. Natural clay
                properties maintain optimal humidity while protecting spices from light and air exposure for maximum flavor retention.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3">
                  Shop Spice Containers
                </Button>
                <Button size="lg" variant="outline" className="border-orange-200 hover:bg-orange-50 text-lg px-8 py-3">
                  Storage Tips
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
                  <Container className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Perfect Storage</h3>
                <p className="text-gray-600">Natural humidity control keeps spices fresh and potent</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Leaf className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Flavor Preservation</h3>
                <p className="text-gray-600">Clay naturally preserves essential oils and aromatics</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Traditional Craft</h3>
                <p className="text-gray-600">Handcrafted using time-tested pottery techniques</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Chemical Free</h3>
                <p className="text-gray-600">Pure clay construction without harmful chemicals or glazes</p>
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
                        <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                          <SelectTrigger className="border-orange-100 focus:border-orange-300">
                            <SelectValue placeholder="Select size" />
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
                          <SelectTrigger className="border-orange-100 focus:border-orange-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-500">Under ₹500</SelectItem>
                            <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                            <SelectItem value="above-1000">Above ₹1,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-orange-200 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">Airtight Lid</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-orange-200 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">Moisture Control</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-orange-200 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">Set Available</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Spice Containers</h2>
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
                      <SelectItem value="size">Size</SelectItem>
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
                    <Card key={product.id} className="group border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Link href={`/products/${product.slug || product.id}`}>
                            {product.image && product.image !== "/placeholder.svg" ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={400}
                                height={256}
                                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                                <Container className="h-16 w-16 text-orange-400" />
                              </div>
                            )}
                          </Link>
                          {product.badges && product.badges.length > 0 && (
                            <Badge className="absolute top-3 left-3 bg-orange-600 text-white">
                              {product.badges[0]}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-orange-600">
                            {product.capacity}
                          </Badge>
                          <button
                            onClick={() => handleToggleWishlist(product)}
                            className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <Heart className={`h-4 w-4 ${wishlistItems?.some(item => item.id === product.id) || false ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
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
                          <Link href={`/products/${product.slug || product.id}`}>
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 cursor-pointer">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">Natural clay container for optimal spice storage</p>

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
                            <Button
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 bg-orange-600 hover:bg-orange-700"
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Link href={`/products/${product.slug || product.id}`}>
                              <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
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

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">30,000+ Home Cooks</h3>
                <p className="text-gray-600">Trusted by families for preserving spice freshness and flavor</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Preservation</h3>
                <p className="text-gray-600">Clay naturally maintains optimal humidity for spice storage</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Safe Packaging</h3>
                <p className="text-gray-600">Carefully packed to ensure containers arrive in perfect condition</p>
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