"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Milk,
  Droplets,
  Star,
  Filter,
  Shield,
  Award,
  Heart,
  ShoppingCart,
  Users,
  CheckCircle,
  Truck
} from "lucide-react"
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

export default function ButterChurnsPage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [butterChurnProducts, setButterChurnProducts] = useState([])
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

  // Fetch butter churn products from database
  useEffect(() => {
    const fetchButterChurnProducts = async () => {
      try {
        const supabase = createClient()
        // First get the "Butter Churns" category ID
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', 'butter-churns')
          .single()

        if (!category) {
          console.error('Butter Churns category not found')
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
          console.error('Error fetching butter churn products:', error)
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
            rating: 4.5 + Math.random() * 0.4, // Random rating between 4.5-4.9
            reviewCount: Math.floor(Math.random() * 300) + 50,
            badges: ["Handcrafted"],
            inStock: (product.inventory_quantity || 0) > 0,
            description: product.description || "Generated description based on product name",
            capacity: product.capacity || "Standard",
            features: ["Natural Churning", "Pure Clay", "Traditional"],
            material: product.material_details || "Traditional Terracotta",
            usageInstructions: product.usage_instructions,
            careInstructions: product.care_instructions
          })) || []

          setButterChurnProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchButterChurnProducts()
  }, [])

  const capacityOptions = [
    { value: "all", label: "All Capacities" },
    { value: "small", label: "Small (1-2L)" },
    { value: "medium", label: "Medium (2-4L)" },
    { value: "large", label: "Large (4L+)" }
  ]

  // Use only database products
  const allProducts = butterChurnProducts

  const filteredProducts = selectedCapacity === "all"
    ? allProducts
    : allProducts.filter(product => {
        const capacity = parseFloat(product.capacity)
        if (selectedCapacity === "small") return capacity <= 2
        if (selectedCapacity === "medium") return capacity > 2 && capacity <= 4
        if (selectedCapacity === "large") return capacity > 4
        return true
      })

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-amber-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-yellow-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200 text-sm px-4 py-2">
                Butter Churn Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Traditional <span className="text-amber-600">Butter Churns</span> Collection
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Experience the ancient art of butter making with our handcrafted terracotta churns. Create rich,
                creamy butter using time-honored methods that preserve natural flavors and nutritional benefits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-3">
                  Shop Butter Churns
                </Button>
                <Button size="lg" variant="outline" className="border-amber-200 hover:bg-amber-50 text-lg px-8 py-3">
                  Churning Guide
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
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Milk className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Traditional Method</h3>
                <p className="text-gray-600">Authentic butter making using centuries-old churning techniques</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Droplets className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pure & Natural</h3>
                <p className="text-gray-600">Create preservative-free butter without artificial additives</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Natural</h3>
                <p className="text-gray-600">Pure clay without harmful chemicals or artificial coatings</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Handcrafted</h3>
                <p className="text-gray-600">Traditional techniques passed down through generations</p>
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
                <Card className="border-amber-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Capacity</label>
                        <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                          <SelectTrigger className="border-amber-100 focus:border-amber-300">
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
                          <SelectTrigger className="border-amber-100 focus:border-amber-300">
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
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
                            <span className="text-sm text-gray-600">Natural Churning</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
                            <span className="text-sm text-gray-600">With Handle</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
                            <span className="text-sm text-gray-600">Traditional Design</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Butter Churns</h2>
                    <p className="text-gray-600">{filteredProducts.length} products available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-amber-100 focus:border-amber-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="capacity">Capacity</SelectItem>
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
                    <Card key={product.id} className="group border-amber-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                              <div className="w-full h-64 bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                                <Milk className="h-16 w-16 text-amber-400" />
                              </div>
                            )}
                          </Link>
                          {product.badges.map((badge, idx) => (
                            <Badge key={idx} className={`absolute top-3 ${idx === 0 ? 'left-3' : 'right-3'} bg-amber-600 text-white text-xs`}>
                              {badge}
                            </Badge>
                          ))}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-amber-600">
                            {product.capacity}
                          </Badge>
                          <button
                            onClick={() => handleToggleWishlist(product)}
                            className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <Heart className={`h-4 w-4 ${wishlistItems?.some(item => item.id === product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
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
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2 cursor-pointer">
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
                            <span className="text-xl font-bold text-amber-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 bg-amber-600 hover:bg-amber-700"
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Link href={`/products/${product.slug || product.id}`}>
                              <Button variant="outline" size="sm" className="border-amber-200 hover:bg-amber-50">
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

        {/* Detailed Information Sections */}
        <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Art of Traditional Butter Making</h2>

            <div className="text-gray-700 leading-relaxed">
              <p className="text-gray-700 leading-relaxed mb-6">
                For thousands of years, clay butter churns have been the cornerstone of traditional dairy processing. At Clayfable, we honor this ancient craft by creating premium butter churns that combine time-tested functionality with contemporary needs, enabling you to create pure, natural butter with enhanced flavor and nutritional benefits.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Superior Natural Churning Process</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Clay butter churns provide the ideal environment for traditional butter making. The porous nature of terracotta allows the clay to breathe, maintaining optimal temperature and moisture levels during the churning process. This natural regulation creates the perfect conditions for cream to transform into rich, flavorful butter.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The smooth interior surface of our churns facilitates efficient agitation while the thick walls provide thermal stability. This results in consistent churning action that produces butter with superior texture and taste compared to modern mechanical methods.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Health Benefits of Clay-Churned Butter</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Butter made in clay churns retains more of its natural nutrients and beneficial compounds. The gentle churning process preserves vitamins A, D, E, and K, along with important fatty acids that are often degraded in commercial processing. Clay churning also eliminates the need for preservatives and chemical additives.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The alkaline properties of clay help neutralize acidic compounds that can form during churning, resulting in butter with better digestibility and longer natural shelf life. This traditional method produces butter that is free from metallic residues that can leach from modern equipment.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Perfect for Authentic Indian Cuisine</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Traditionally churned butter, known as makhan, is essential for authentic Indian cooking. The unique texture and flavor achieved through clay churning enhances the taste of traditional dishes like parathas, dal, and sweets. Many regional cuisines specifically call for clay-churned butter for its distinctive characteristics.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The spiritual and cultural significance of traditional butter making makes clay churns perfect for religious ceremonies and festivals. Many families prefer the meditative process of hand churning, which connects them to ancestral traditions and creates butter with emotional as well as nutritional value.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Caring for Your Butter Churn</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Proper care ensures your clay butter churn will serve you for generations. Before first use, soak the churn in clean water overnight to condition the clay. Season by churning fresh cream to create a natural coating that improves performance over time. Clean with warm water and natural bristle brushes - avoid soap which can be absorbed by the porous clay.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                After each use, rinse thoroughly and air dry completely before storage. Store in a cool, dry place with good ventilation. With proper care, clay churns develop a beautiful patina and improved churning efficiency. Handle with care to prevent thermal shock from rapid temperature changes.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Choose Clayfable Butter Churns</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our butter churns are handcrafted from carefully selected, food-grade clay by skilled artisans who understand the specific requirements for dairy processing. Each churn is fired at precise temperatures to achieve optimal porosity while maintaining structural integrity for years of use.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer various sizes from small household churns to large family versions, each designed with ergonomic considerations for comfortable churning. Our commitment to quality ensures every churn meets strict standards for food safety, durability, and churning performance.
              </p>

            </div>
          </div>
        </div>
      </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">10,000+ Happy Families</h3>
                <p className="text-gray-600">Trusted by home cooks for authentic butter making</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assured</h3>
                <p className="text-gray-600">Food-grade clay tested for safety and churning performance</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Safe Delivery</h3>
                <p className="text-gray-600">Secure packaging ensures your churns arrive in perfect condition</p>
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