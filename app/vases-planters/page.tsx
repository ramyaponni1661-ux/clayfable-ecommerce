"use client";

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Flower2, Home, Palette, Sparkles, Award, Users, Shield, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { createClient } from '@/lib/supabase/client'
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"

export default function VasesPlantersPage() {
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [vasesAndPlanters, setVasesAndPlanters] = useState([])
  const [loading, setLoading] = useState(true)

  // Cart and Wishlist contexts
  const { addToCart } = useCart()
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist()

  // Handler functions
  const handleAddToCart = (product: any) => {
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

  const handleToggleWishlist = (product: any) => {
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

  // Fetch vases and planters products from database
  useEffect(() => {
    const fetchVasesAndPlantersProducts = async () => {
      try {
        const supabase = createClient()

        // First get the "Vases & Planters" category ID
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', 'vases-planters')
          .single()

        if (!category) {
          console.error('Vases & Planters category not found')
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
          console.error('Error fetching vases and planters products:', error)
        } else {
          const transformedProducts = products?.map(product => ({
            id: product.id,
            name: product.name,
            slug: product.slug, // Add missing slug property
            price: product.price,
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
            type: product.product_tags?.includes("vase") ? "vase" : "planter",
            size: product.capacity || "Medium",
            rating: 4.5 + Math.random() * 0.4,
            reviews: Math.floor(Math.random() * 300) + 50,
            badge: product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? "New" : "Best Seller",
            features: ["Hand-thrown", "Drainage system", "Weather resistant", "Eco-friendly"],
            description: product.description || "Beautiful terracotta piece perfect for home and garden decor",
            inStock: (product.inventory_quantity || 0) > 0
          })) || []

          setVasesAndPlanters(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVasesAndPlantersProducts()
  }, [])

  const staticVasesAndPlanters = [
    {
      id: 1,
      name: "Classic Terracotta Floor Vase - Large Statement Piece",
      price: 3999,
      originalPrice: 4999,
      image: "/products/floor-vase-classic.jpg",
      type: "vase",
      size: "Large",
      rating: 4.9,
      reviews: 234,
      badge: "Best Seller",
      features: ["Hand-thrown", "Floor standing", "Drainage hole", "Weather resistant"],
      description: "Elegant large floor vase perfect for dried arrangements and fresh flowers",
      inStock: true
    },
    {
      id: 2,
      name: "Handcrafted Garden Planter Set - Rustic Collection",
      price: 2799,
      originalPrice: 3599,
      image: "/products/garden-planter-set.jpg",
      type: "planter",
      size: "Medium",
      rating: 4.8,
      reviews: 189,
      badge: "Set of 3",
      features: ["Drainage holes", "UV resistant", "Stackable design", "Premium terracotta"],
      description: "Beautiful set of three planters perfect for herbs, flowers, and small plants",
      inStock: true
    },
    {
      id: 3,
      name: "Decorative Table Vase - Modern Minimalist",
      price: 1599,
      originalPrice: 2099,
      image: "/products/table-vase-modern.jpg",
      type: "vase",
      size: "Small",
      rating: 4.7,
      reviews: 156,
      badge: "Modern Design",
      features: ["Contemporary style", "Matte finish", "Perfect proportions", "Table centerpiece"],
      description: "Sleek modern vase ideal for contemporary home decor and small flower arrangements",
      inStock: true
    },
    {
      id: 4,
      name: "Traditional Surahi Vase - Heritage Design",
      price: 2299,
      originalPrice: 2899,
      image: "/products/surahi-heritage.jpg",
      type: "vase",
      size: "Medium",
      rating: 4.9,
      reviews: 278,
      badge: "Traditional",
      features: ["Cultural heritage", "Hand-painted details", "Narrow neck design", "Vintage appeal"],
      description: "Traditional surahi design with intricate hand-painted motifs celebrating Indian artistry",
      inStock: true
    },
    {
      id: 5,
      name: "Hanging Planter Collection - Space Saver",
      price: 1899,
      originalPrice: 2399,
      image: "/products/hanging-planters.jpg",
      type: "planter",
      size: "Small",
      rating: 4.6,
      reviews: 134,
      badge: "Space Saver",
      features: ["Hanging design", "Space efficient", "Drainage system", "Set of 2"],
      description: "Perfect for small spaces, these hanging planters add greenery without taking floor space",
      inStock: true
    },
    {
      id: 6,
      name: "Artistic Sculpture Vase - Contemporary Art",
      price: 4599,
      originalPrice: 5999,
      image: "/products/sculpture-vase-art.jpg",
      type: "vase",
      size: "Large",
      rating: 4.8,
      reviews: 92,
      badge: "Artistic",
      features: ["Unique sculpture design", "Conversation piece", "Artist signed", "Limited edition"],
      description: "One-of-a-kind artistic vase that doubles as a stunning sculpture and functional vessel",
      inStock: false
    }
  ]

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "vase", label: "Vases" },
    { value: "planter", label: "Planters" }
  ]

  const sizeOptions = [
    { value: "all", label: "All Sizes" },
    { value: "Small", label: "Small" },
    { value: "Medium", label: "Medium" },
    { value: "Large", label: "Large" }
  ]

  // Use only database products
  const allProducts = vasesAndPlanters

  const filteredProducts = selectedType === "all"
    ? allProducts
    : allProducts.filter(product => product.type === selectedType)

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-emerald-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-green-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 border-emerald-200 text-sm px-4 py-2">
                Vases & Planters Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Terracotta <span className="text-emerald-600">Vases & Planters</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Enhance your living spaces with our exquisite collection of handcrafted terracotta vases and planters.
                From elegant statement pieces to functional garden containers, each piece combines beauty with purpose.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-3">
                  Shop Collection
                </Button>
                <Button size="lg" variant="outline" className="border-emerald-200 hover:bg-emerald-50 text-lg px-8 py-3">
                  Care Guide
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
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Flower2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Plant Friendly</h3>
                <p className="text-gray-600">Natural clay promotes healthy root development and plant growth</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Home className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Home Decor</h3>
                <p className="text-gray-600">Versatile designs complement any interior or garden aesthetic</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Palette className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Artistic Design</h3>
                <p className="text-gray-600">Each piece is individually crafted with artistic attention to detail</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Weather Resistant</h3>
                <p className="text-gray-600">Durable construction suitable for both indoor and outdoor use</p>
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
                <Card className="border-emerald-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-emerald-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Type</label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger className="border-emerald-100 focus:border-emerald-300">
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
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Size</label>
                        <Select>
                          <SelectTrigger className="border-emerald-100 focus:border-emerald-300">
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
                          <SelectTrigger className="border-emerald-100 focus:border-emerald-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-2000">Under ₹2,000</SelectItem>
                            <SelectItem value="2000-3000">₹2,000 - ₹3,000</SelectItem>
                            <SelectItem value="3000-5000">₹3,000 - ₹5,000</SelectItem>
                            <SelectItem value="above-5000">Above ₹5,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-emerald-200 text-emerald-600 mr-2" />
                            <span className="text-sm text-gray-600">Handcrafted</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-emerald-200 text-emerald-600 mr-2" />
                            <span className="text-sm text-gray-600">Drainage Holes</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-emerald-200 text-emerald-600 mr-2" />
                            <span className="text-sm text-gray-600">Weather Resistant</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-emerald-200 text-emerald-600 mr-2" />
                            <span className="text-sm text-gray-600">Hand Painted</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Vases & Planters</h2>
                    <p className="text-gray-600">{filteredProducts.length} products available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-emerald-100 focus:border-emerald-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="size">Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group border-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                        <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                          <div className="relative w-full h-64">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          {product.badge && (
                            <Badge className="absolute top-3 left-3 bg-emerald-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-emerald-600">
                            {product.size}
                          </Badge>
                          <button
                            className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                            onClick={(e) => {
                              e.preventDefault()
                              handleToggleWishlist(product)
                            }}
                          >
                            <Heart className={`h-4 w-4 ${wishlistItems?.some(item => item.id === product.id) || false ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
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
                            <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                          </div>
                          <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 cursor-pointer">
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
                            <span className="text-xl font-bold text-emerald-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                              <Button variant="outline" size="sm" className="border-emerald-200 hover:bg-emerald-50">
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

        {/* Detailed Information Sections */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Art of Terracotta Vases & Planters</h2>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="text-xl mb-6">
                  Terracotta vases and planters represent the perfect fusion of functionality and artistry. At Clayfable, our collection celebrates both the practical benefits of clay containers and their inherent beauty as decorative objects. Each piece is thoughtfully designed to enhance your living spaces while providing optimal conditions for your plants and floral arrangements.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Handcrafted Vases for Every Occasion</h3>
                <p className="mb-4">
                  Our vase collection spans from intimate table centerpieces to commanding floor-standing statement pieces. Each vase is individually shaped by skilled artisans who understand the delicate balance between form and function. The natural porosity of terracotta helps extend the life of fresh flowers by allowing stems to breathe, while the earthy aesthetic complements both fresh and dried arrangements.
                </p>
                <p className="mb-4">
                  Traditional designs like our heritage surahis showcase centuries-old pottery techniques passed down through generations. These vessels feature the classic narrow-neck design that not only looks elegant but also reduces water evaporation and helps maintain flower freshness longer. Hand-painted details using natural pigments add cultural richness and make each piece a unique work of art.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Superior Planters for Healthy Plants</h3>
                <p className="mb-4">
                  Terracotta planters offer unmatched benefits for plant health and growth. The porous nature of clay allows air and moisture to move freely through the walls, preventing root rot and promoting healthy root development. This natural breathability creates an ideal microenvironment that helps plants thrive, especially those that prefer well-drained conditions.
                </p>
                <p className="mb-4">
                  Our planter collection includes various sizes and styles to suit different gardening needs. From compact herb planters perfect for kitchen windowsills to large garden containers suitable for small trees, each planter is designed with proper drainage systems. The natural clay composition helps regulate soil temperature, keeping roots cooler in summer and providing insulation in cooler weather.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Indoor and Outdoor Versatility</h3>
                <p className="mb-4">
                  One of the greatest advantages of our terracotta collection is its versatility. Indoor vases bring warmth and natural texture to living spaces, while outdoor planters weather beautifully, developing attractive patina over time. The earthy tones of terracotta complement any color scheme, from modern minimalist interiors to rustic garden settings.
                </p>
                <p className="mb-4">
                  For outdoor use, our weather-resistant finishes protect against freeze-thaw cycles and UV exposure while maintaining the natural clay appearance. Hanging planters maximize growing space in small gardens or balconies, while floor planters create striking focal points for patios and courtyards.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Artistic Design Philosophy</h3>
                <p className="mb-4">
                  Every piece in our collection reflects our commitment to artistic excellence. Our designers study traditional pottery forms while incorporating contemporary aesthetics to create pieces that honor heritage while meeting modern needs. Proportions are carefully calculated to achieve visual harmony, whether the piece holds a single stem or a full bouquet.
                </p>
                <p className="mb-4">
                  Sculptural vases in our collection double as art pieces, commanding attention even when empty. These conversation-starter pieces feature bold forms, interesting textures, and innovative glazing techniques that showcase the versatility of terracotta as an artistic medium. Many are signed by the creating artisan, making them collectible as well as functional.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sustainable Gardening Choice</h3>
                <p className="mb-4">
                  Choosing terracotta planters supports sustainable gardening practices. Unlike plastic containers that contribute to environmental pollution, clay planters are completely biodegradable and can be returned to the earth at the end of their useful life. The natural material contains no harmful chemicals that could leach into soil or affect plant health.
                </p>
                <p className="mb-4">
                  Our production process also emphasizes sustainability. Clay is sourced from renewable deposits, and our traditional firing methods use minimal energy compared to industrial manufacturing processes. By choosing our terracotta planters, you're supporting both traditional craftsmanship and environmental responsibility.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Care and Maintenance</h3>
                <p className="mb-4">
                  Caring for terracotta vases and planters is simple and straightforward. Regular cleaning with water and a soft brush maintains their appearance and prevents mineral buildup. For planters, allowing them to dry completely between uses helps prevent algae growth and maintains the porous properties of the clay.
                </p>
                <p className="mb-4">
                  In regions with harsh winters, bringing outdoor planters indoors or providing protection from freezing prevents cracking. The natural aging process of terracotta is part of its charm – the development of patina and subtle color changes over time add character and authenticity to each piece.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Choosing the Perfect Piece</h3>
                <p className="mb-4">
                  Selecting the right vase or planter involves considering both practical needs and aesthetic preferences. For fresh flower arrangements, choose vases with wider openings and sufficient water capacity. For plant containers, ensure adequate drainage and size for root development. Consider the scale of your space – large floor pieces make bold statements, while smaller pieces work well in groupings.
                </p>
                <p className="mb-4">
                  Our diverse collection ensures there's a perfect piece for every need and style preference. Whether you're creating a serene meditation garden, brightening a modern apartment, or designing an elegant dining room centerpiece, our terracotta vases and planters provide the perfect foundation for bringing natural beauty into your life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">25,000+ Garden Lovers</h3>
                <p className="text-gray-600">Trusted by gardening enthusiasts and interior designers nationwide</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Artisan Crafted</h3>
                <p className="text-gray-600">Each piece individually shaped by master pottery artisans</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Safe Shipping</h3>
                <p className="text-gray-600">Special protective packaging ensures delicate items arrive perfect</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}