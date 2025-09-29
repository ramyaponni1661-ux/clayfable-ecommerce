"use client";

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Coffee, Thermometer, Droplets, Leaf, Users, CheckCircle, Truck, Eye } from "lucide-react"
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
  reviews: number
  badge?: string
  inStock?: boolean
  features?: string[]
  description?: string
  capacity?: string
}

export default function CupsMugsPage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [cupsAndMugsProducts, setCupsAndMugsProducts] = useState([])
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

  // Fetch cups and mugs products from database
  useEffect(() => {
    const fetchCupsAndMugsProducts = async () => {
      try {
        const supabase = createClient()

        // First get the "Cups & Mugs" category ID
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', 'cups-mugs')
          .single()

        if (!category) {
          console.error('Cups & Mugs category not found')
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
          console.error('Error fetching cups and mugs products:', error)
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
            capacity: product.capacity || "250ml",
            rating: 4.5 + Math.random() * 0.4,
            reviews: Math.floor(Math.random() * 300) + 50,
            badge: product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? "New" : "Best Seller",
            inStock: (product.inventory_quantity || 0) > 0,
            features: ["Authentic Taste", "Heat Retention", "Natural Clay", "Eco-Friendly"],
            description: product.description || "Handcrafted clay cup perfect for hot beverages"
          })) || []

          setCupsAndMugsProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCupsAndMugsProducts()
  }, [])

  const staticCupsAndMugsProducts = [
    {
      id: 1,
      name: "Traditional Kulhad Tea Cup Set",
      price: 899,
      originalPrice: 1199,
      image: "/api/placeholder/400/400",
      capacity: "150ml each",
      rating: 4.8,
      reviews: 432,
      badge: "Best Seller",
      features: ["Authentic Taste", "Eco-Friendly", "Natural Clay", "Traditional Design"],
      description: "Experience the authentic taste of Indian chai with these traditional kulhad cups"
    },
    {
      id: 2,
      name: "Artisan Coffee Mug Collection",
      price: 1599,
      originalPrice: 1899,
      image: "/api/placeholder/400/400",
      capacity: "300ml each",
      rating: 4.7,
      reviews: 287,
      badge: "Premium",
      features: ["Heat Retention", "Ergonomic Handle", "Glazed Finish", "Coffee Shop Style"],
      description: "Start your day right with these beautifully crafted coffee mugs"
    },
    {
      id: 3,
      name: "Elegant Ceramic Tea Set",
      price: 2899,
      originalPrice: 3499,
      image: "/api/placeholder/400/400",
      capacity: "800ml teapot",
      rating: 4.9,
      reviews: 156,
      badge: "Complete Set",
      features: ["Complete Set", "Premium Quality", "Gift Ready", "Elegant Design"],
      description: "Perfect for hosting tea parties, this elegant set includes teapot and cups"
    },
    {
      id: 4,
      name: "Handpainted Floral Mug Set",
      price: 1299,
      originalPrice: 1599,
      image: "/api/placeholder/400/400",
      capacity: "250ml each",
      rating: 4.6,
      reviews: 203,
      badge: "Handpainted",
      features: ["Hand-Painted", "Floral Design", "Unique Patterns", "Gift Perfect"],
      description: "Each mug features unique hand-painted floral patterns"
    },
    {
      id: 5,
      name: "Large Soup Bowl Mugs",
      price: 1799,
      originalPrice: 2199,
      image: "/api/placeholder/400/400",
      capacity: "450ml each",
      rating: 4.8,
      reviews: 134,
      badge: "Large Size",
      features: ["Large Capacity", "Dual Handle", "Heat Retention", "Versatile Use"],
      description: "Perfect for soups, hot beverages, or cereal with dual handles"
    },
    {
      id: 6,
      name: "Travel-Size Chai Cups",
      price: 799,
      originalPrice: 999,
      image: "/api/placeholder/400/400",
      capacity: "120ml each",
      rating: 4.5,
      reviews: 298,
      badge: "Travel Size",
      features: ["Compact Size", "Travel Friendly", "Natural Clay", "Quick Heat"],
      description: "Compact and travel-friendly chai cups perfect for authentic clay taste"
    }
  ]

  const capacityOptions = [
    { value: "all", label: "All Capacities" },
    { value: "small", label: "Small (120-200ml)" },
    { value: "medium", label: "Medium (250-350ml)" },
    { value: "large", label: "Large (400ml+)" }
  ]

  // Use only database products
  const allProducts = cupsAndMugsProducts

  const filteredProducts = selectedCapacity === "all"
    ? allProducts
    : allProducts.filter(product => {
        const capacity = parseInt(product.capacity)
        if (selectedCapacity === "small") return capacity <= 200
        if (selectedCapacity === "medium") return capacity >= 250 && capacity <= 350
        if (selectedCapacity === "large") return capacity >= 400
        return true
      })

  return (
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
                Cups & Mugs Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Handcrafted <span className="text-amber-600">Cups</span> & Mugs
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Discover the perfect harmony of flavor and tradition with our handcrafted terracotta cups and mugs.
                From traditional kulhads that enhance chai's authentic taste to elegant coffee mugs that keep your
                beverages perfectly warm, each piece brings natural beauty to your daily rituals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-3">
                  Shop Cups & Mugs
                </Button>
                <Button size="lg" variant="outline" className="border-amber-200 hover:bg-amber-50 text-lg px-8 py-3">
                  Brewing Guide
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
                  <Thermometer className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Heat Retention</h3>
                <p className="text-gray-600">Natural clay properties keep beverages at perfect temperature</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Droplets className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Cooling</h3>
                <p className="text-gray-600">Clay naturally cools water while adding essential minerals</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Eco-Friendly</h3>
                <p className="text-gray-600">100% natural materials with zero environmental impact</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Coffee className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enhanced Taste</h3>
                <p className="text-gray-600">Clay interaction enhances beverage flavors naturally</p>
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
                            <SelectItem value="under-1000">Under ₹1,000</SelectItem>
                            <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                            <SelectItem value="above-2000">Above ₹2,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
                            <span className="text-sm text-gray-600">Heat Retention</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
                            <span className="text-sm text-gray-600">Dishwasher Safe</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
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
                    <h2 className="text-2xl font-bold text-gray-900">Cups & Mugs</h2>
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
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group border-amber-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                            <Badge className="absolute top-3 left-3 bg-amber-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-amber-600">
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
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2 cursor-pointer">
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
                            <span className="text-xl font-bold text-amber-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                              className="flex-1 bg-amber-600 hover:bg-amber-700"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                              <Button variant="outline" size="sm" className="border-amber-200 hover:bg-amber-50">
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

        {/* Detailed Information Sections */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Science of Clay Cups & Mugs</h2>

              <div className="text-gray-700 leading-relaxed">
                <p className="text-xl mb-6">
                  For thousands of years, terracotta cups and mugs have enhanced the drinking experience across cultures, transforming simple beverages into moments of mindful enjoyment. At Clayfable, we continue this ancient tradition, crafting cups and mugs that don't just hold your beverages—they enhance them through the natural properties of carefully selected clay.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Enhanced Beverage Experience</h3>
                <p className="mb-4">
                  Terracotta cups and mugs aren't just beautiful—they scientifically enhance your drinking experience. The porous nature of clay allows for natural temperature regulation, keeping hot beverages warm and cold drinks refreshingly cool. The mineral content in clay also adds subtle earthy notes that complement both tea and coffee, creating a more complex and satisfying flavor profile.
                </p>
                <p className="mb-4">
                  Traditional kulhad cups have been used in India for centuries, particularly for serving chai. The clay reacts with the alkalinity of tea, balancing the pH and reducing acidity, making each sip smoother and more digestible. This natural interaction between clay and beverage is what makes terracotta cups irreplaceable for authentic taste experiences.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Natural Temperature Control</h3>
                <p className="mb-4">
                  The thermal properties of terracotta make it ideal for beverage service. Clay's natural insulation keeps hot drinks warmer for longer periods while preventing your hands from getting too hot. For cold beverages, the evaporation through clay pores creates a natural cooling effect, similar to traditional water storage vessels.
                </p>
                <p className="mb-4">
                  This temperature stability means your carefully brewed tea or coffee maintains its optimal serving temperature throughout your drinking experience. Unlike glass or metal containers that conduct heat rapidly, terracotta provides a gentle, consistent thermal environment that preserves the intended character of your beverage.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Health & Sustainability</h3>
                <p className="mb-4">
                  Unlike plastic or metal containers, terracotta doesn't leach harmful chemicals into your beverages. The natural clay is completely safe, non-toxic, and adds beneficial minerals to your drinks. Each cup is biodegradable, making them an environmentally conscious choice that supports sustainable living practices.
                </p>
                <p className="mb-4">
                  The manufacturing process of terracotta cups has a significantly lower carbon footprint compared to ceramic or glass alternatives. By choosing clay cups and mugs, you're supporting traditional craftsmanship while making an eco-friendly choice that benefits both your health and the environment.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Traditional Craftsmanship</h3>
                <p className="mb-4">
                  Each cup and mug in our collection is shaped by skilled artisans who understand the delicate balance between form and function. The thickness of walls, the curve of handles, and the lip design are all carefully considered to provide optimal drinking comfort while maintaining the structural integrity needed for daily use.
                </p>
                <p className="mb-4">
                  Hand-painted designs on select pieces showcase the artistic heritage of Indian pottery, with each pattern telling a story of cultural tradition. These decorative elements not only add visual appeal but also represent the personal touch of the artisan, making each piece unique and meaningful.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Care and Usage Tips</h3>
                <p className="mb-4">
                  Before first use, soak new terracotta cups in clean water for 2-3 hours to remove any clay dust and prepare the surface for optimal performance. For glazed pieces, normal washing with mild soap is acceptable, while unglazed kulhads should be rinsed with water only to maintain their natural flavor-enhancing properties.
                </p>
                <p className="mb-4">
                  Allow cups to air dry completely before storing to prevent mold growth. Avoid sudden temperature changes by letting cups adjust to room temperature before adding hot or cold liquids. With proper care, terracotta cups develop a beautiful patina over time, becoming more attractive and functional with age.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Perfect Pairings</h3>
                <p className="mb-4">
                  Different styles of clay cups are optimized for different beverages. Traditional kulhads are perfect for chai, enhancing the spices and reducing acidity. Coffee mugs with thicker walls provide excellent heat retention for espresso and latte. Tea sets with matching saucers create an elegant presentation for formal tea service.
                </p>
                <p className="mb-4">
                  The natural texture of unglazed clay provides a satisfying tactile experience that enhances mindful drinking practices. The earthy aroma and feel of clay cups encourage slower, more contemplative beverage consumption, transforming routine drinking into moments of relaxation and mindfulness.
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
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">60,000+ Tea & Coffee Lovers</h3>
                <p className="text-gray-600">Trusted by beverage enthusiasts for authentic taste enhancement</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Food Grade Certified</h3>
                <p className="text-gray-600">Natural clay tested for safety and beverage compatibility</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Packaging</h3>
                <p className="text-gray-600">Expert packaging ensures your cups arrive ready for first sip</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}