"use client";

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Utensils, Crown, Award, Shield, Users, CheckCircle, Truck, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"

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
  capacity?: string
}

export default function DinnerwarePage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [realProducts, setRealProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

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
    fetchRealProducts()
  }, [])

  const fetchRealProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const supabase = createClient()

      // First get the "Dinnerware" category ID
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'dinnerware')
        .single()

      if (!category) {
        console.error('Dinnerware category not found')
        setIsLoadingProducts(false)
        return
      }

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
          categories (id, name, slug)
        `)
        .eq('is_active', true)
        .eq('category_id', category.id)
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
        price: parseFloat(product.price) || 0,
        originalPrice: product.compare_price || product.price * 1.2,
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
        capacity: "32-piece set",
        rating: 4.5 + (Math.random() * 0.5),
        reviews: Math.floor(Math.random() * 200) + 50,
        badge: product.is_featured ? "Featured" : "New Arrival",
        features: ["Complete Service", "Classic Design", "Family Size", "Everyday Use"],
        description: product.description || `Complete ${product.name} for perfect dining experiences`,
        inStock: (product.inventory_quantity || 0) > 0
      })) || []

      setRealProducts(transformedProducts)
    } catch (error) {
      console.error('Error in fetchRealProducts:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const staticDinnerwareProducts = [
    {
      id: 1,
      name: "Classic Terracotta Dinner Set",
      price: 7999,
      originalPrice: 9999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "32-piece set",
      rating: 4.8,
      reviews: 342,
      badge: "Best Seller",
      features: ["Complete Service", "Classic Design", "Family Size", "Everyday Use"],
      description: "Perfect for everyday dining, this complete 32-piece dinner set combines classic terracotta beauty with modern functionality"
    },
    {
      id: 2,
      name: "Modern Square Dinnerware Collection",
      price: 5999,
      originalPrice: 7499,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "24-piece set",
      rating: 4.7,
      reviews: 278,
      badge: "Modern",
      features: ["Contemporary Design", "Square Plates", "Stackable", "Space Saving"],
      description: "Contemporary square-shaped dinnerware that maximizes table space while providing a modern aesthetic"
    },
    {
      id: 3,
      name: "Royal Heritage Fine Dining Set",
      price: 15999,
      originalPrice: 19999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "40-piece set",
      rating: 4.9,
      reviews: 156,
      badge: "Premium",
      features: ["Gold Accents", "Hand-Painted", "Premium Quality", "Luxury Design"],
      description: "Elevate your dining with this luxurious heritage collection featuring hand-painted details and gold accents"
    },
    {
      id: 4,
      name: "Rustic Farmhouse Dinner Collection",
      price: 4299,
      originalPrice: 5399,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "20-piece set",
      rating: 4.6,
      reviews: 234,
      badge: "Handcrafted",
      features: ["Rustic Charm", "Natural Texture", "Organic Shape", "Country Style"],
      description: "Bring countryside charm to your table with this rustic collection featuring natural textures and organic shapes"
    },
    {
      id: 5,
      name: "Artisan Crafted Bowl Set",
      price: 2799,
      originalPrice: 3499,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "12-piece set",
      rating: 4.8,
      reviews: 189,
      badge: "Artisan",
      features: ["Handcrafted", "Various Sizes", "Multipurpose", "Unique Shapes"],
      description: "A versatile collection of handcrafted bowls in various sizes, perfect for soups, salads, rice, and desserts"
    },
    {
      id: 6,
      name: "Elegant Oval Serving Platter Set",
      price: 3599,
      originalPrice: 4499,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "8-piece set",
      rating: 4.7,
      reviews: 167,
      badge: "Elegant",
      features: ["Elegant Oval Shape", "Large Serving Size", "Perfect for Parties", "Statement Pieces"],
      description: "Make a statement at your dinner parties with these elegant oval serving platters, perfect for presenting main courses"
    }
  ]

  const capacityOptions = [
    { value: "all", label: "All Sets" },
    { value: "small", label: "Small Sets (8-20 pieces)" },
    { value: "medium", label: "Medium Sets (24-32 pieces)" },
    { value: "large", label: "Large Sets (40+ pieces)" }
  ]

  // Use only real products from database
  const allProducts = realProducts

  const filteredProducts = selectedCapacity === "all"
    ? allProducts
    : allProducts.filter(product => {
        const pieces = parseInt(product.capacity)
        if (selectedCapacity === "small") return pieces <= 20
        if (selectedCapacity === "medium") return pieces >= 24 && pieces <= 32
        if (selectedCapacity === "large") return pieces >= 40
        return true
      })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-indigo-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200 text-sm px-4 py-2">
                Dinnerware Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Complete <span className="text-blue-600">Dinnerware</span> Sets
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Create unforgettable dining experiences with our comprehensive dinnerware collections.
                From everyday family meals to formal entertaining, each set combines durability with timeless elegance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  Shop Dinnerware
                </Button>
                <Button size="lg" variant="outline" className="border-blue-200 hover:bg-blue-50 text-lg px-8 py-3">
                  Dinnerware Guide
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
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Utensils className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Sets</h3>
                <p className="text-gray-600">Everything you need for perfect dining service in coordinated collections</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Crown className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600">Crafted with precision and attention to detail for lasting beauty</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Multiple Styles</h3>
                <p className="text-gray-600">From traditional to contemporary designs for every dining preference</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Durable Construction</h3>
                <p className="text-gray-600">Built to withstand daily use while maintaining their beauty</p>
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
                <Card className="border-blue-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Set Size</label>
                        <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                          <SelectTrigger className="border-blue-100 focus:border-blue-300">
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
                          <SelectTrigger className="border-blue-100 focus:border-blue-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-5000">Under ₹5,000</SelectItem>
                            <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                            <SelectItem value="10000-15000">₹10,000 - ₹15,000</SelectItem>
                            <SelectItem value="above-15000">Above ₹15,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-blue-200 text-blue-600 mr-2" />
                            <span className="text-sm text-gray-600">Dishwasher Safe</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-blue-200 text-blue-600 mr-2" />
                            <span className="text-sm text-gray-600">Microwave Safe</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-blue-200 text-blue-600 mr-2" />
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
                    <h2 className="text-2xl font-bold text-gray-900">Dinnerware Sets</h2>
                    <p className="text-gray-600">{filteredProducts.length} products available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-blue-100 focus:border-blue-300">
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
                    <Card key={product.id} className="group border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={400}
                              height={300}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          </Link>
                          {product.badge && (
                            <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-blue-600">
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
                            <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                          </div>
                          <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer">
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

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                              <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                                <Eye className="h-4 w-4" />
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
        <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">45,000+ Happy Families</h3>
                <p className="text-gray-600">Trusted for complete dining solutions across generations</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Craftsmanship</h3>
                <p className="text-gray-600">Every piece crafted with precision and attention to detail</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Safe Set Delivery</h3>
                <p className="text-gray-600">Professional packaging ensures every piece arrives intact</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}