"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Leaf, TreePine, Flower, Sprout, Users, CheckCircle, Truck, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { createClient } from '@/lib/supabase/client'
import CanonicalLink from "@/components/seo/canonical-link"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  slug?: string
  price: number
  originalPrice: number
  image: string
  capacity: string
  rating: number
  reviews: number
  badge?: string
  inStock?: boolean
  features: string[]
  description: string
}

export default function GardenDecorPage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [gardenProducts, setGardenProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

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
    setIsVisible(true)
  }, [])

  // Fetch garden decor products from database
  useEffect(() => {
    const fetchGardenProducts = async () => {
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
          .or('product_tags.cs.{"garden"}', 'product_tags.cs.{"planter"}', 'product_tags.cs.{"decor"}', 'product_tags.cs.{"outdoor"}')
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          console.error('Error fetching garden products:', error)
        } else {
          const transformedProducts: Product[] = products?.map(product => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: parseFloat(product.price) || 0,
            originalPrice: product.compare_price ? parseFloat(product.compare_price) : Math.floor(product.price * 1.2),
            image: product.images ? JSON.parse(product.images)?.[0] || "/placeholder.svg" : "/placeholder.svg",
            capacity: product.capacity || "Standard",
            rating: 4.5 + Math.random() * 0.4,
            reviews: Math.floor(Math.random() * 200) + 50,
            badge: product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? "New" : "Weather Resistant",
            inStock: (product.inventory_quantity || 0) > 0,
            features: ["Weather Resistant", "Drainage System", "Handcrafted", "Natural Cooling"],
            description: product.description || "Transform your garden with this beautiful terracotta piece"
          })) || []

          setGardenProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGardenProducts()
  }, [])

  const staticGardenProducts = [
    {
      id: 1,
      name: "Majestic Terracotta Garden Planter Set",
      price: 2299,
      originalPrice: 2899,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "Set of 3 planters",
      rating: 4.8,
      reviews: 156,
      badge: "Weather Resistant",
      features: ["Weather Resistant", "Drainage System", "Handcrafted", "Natural Cooling"],
      description: "Transform your garden with our stunning terracotta planter set, featuring three graduated sizes perfect for creating layered displays"
    },
    {
      id: 2,
      name: "Vintage Garden Fountain Bowl",
      price: 3899,
      originalPrice: 4499,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "24\" diameter",
      rating: 4.9,
      reviews: 89,
      badge: "Best Seller",
      features: ["Handcrafted Design", "Weather Resistant", "Easy Assembly", "Peaceful Ambiance"],
      description: "Create a tranquil oasis with this beautifully crafted terracotta fountain bowl, perfect for attracting birds and adding serenity"
    },
    {
      id: 3,
      name: "Decorative Garden Statue - Dancing Peacock",
      price: 1899,
      originalPrice: 2299,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "20\" height",
      rating: 4.7,
      reviews: 124,
      badge: "Hand-Painted",
      features: ["Artistic Design", "Weather Resistant", "Hand-Painted Details", "Garden Accent"],
      description: "Add elegance to your garden with this magnificent dancing peacock sculpture, meticulously crafted and hand-painted by master artisans"
    },
    {
      id: 4,
      name: "Rustic Herb Garden Planter Trio",
      price: 1599,
      originalPrice: 1899,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "Set of 3 herb pots",
      rating: 4.6,
      reviews: 203,
      badge: "Kitchen Garden",
      features: ["Perfect for Herbs", "Compact Design", "Drainage System", "Kitchen Garden Ready"],
      description: "Perfect for growing fresh herbs, this compact trio fits beautifully on windowsills, patios, or kitchen counters"
    },
    {
      id: 5,
      name: "Grand Terracotta Garden Urn",
      price: 4299,
      originalPrice: 5199,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "28\" height",
      rating: 4.8,
      reviews: 67,
      badge: "Statement Piece",
      features: ["Statement Piece", "Classical Design", "Weather Resistant", "Large Capacity"],
      description: "Make a bold statement with this grand garden urn, inspired by classical Greek amphoras and perfect for large plants"
    },
    {
      id: 6,
      name: "Zen Garden Meditation Set",
      price: 2799,
      originalPrice: 3299,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "Complete set",
      rating: 4.9,
      reviews: 45,
      badge: "Meditation",
      features: ["Meditation Focus", "Minimalist Design", "Complete Set", "Peaceful Ambiance"],
      description: "Create your personal meditation space with this zen garden set, including planters, stones, and a small water bowl for ultimate tranquility"
    }
  ]

  const capacityOptions = [
    { value: "all", label: "All Sizes" },
    { value: "small", label: "Small Items" },
    { value: "medium", label: "Medium Items" },
    { value: "large", label: "Large Items" }
  ]

  // Use only database products
  const allProducts = gardenProducts

  const filteredProducts = selectedCapacity === "all"
    ? allProducts
    : allProducts.filter(product => {
        if (selectedCapacity === "small") return product.price < 2000
        if (selectedCapacity === "medium") return product.price >= 2000 && product.price < 4000
        if (selectedCapacity === "large") return product.price >= 4000
        return true
      })

  return (
    <>
      <CanonicalLink />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-green-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-emerald-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-100 text-green-800 border-green-200 text-sm px-4 py-2">
                Garden Decor Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your <span className="text-green-600">Outdoor</span> Space
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Create a beautiful sanctuary with our handcrafted terracotta garden decor.
                Each piece combines artistic beauty with functional design, bringing nature and traditional craftsmanship together in perfect harmony.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                  Shop Garden Decor
                </Button>
                <Button size="lg" variant="outline" className="border-green-200 hover:bg-green-50 text-lg px-8 py-3">
                  Garden Design Guide
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
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Weather Resistant</h3>
                <p className="text-gray-600">Built to withstand all seasons and outdoor conditions beautifully</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TreePine className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Plant Friendly</h3>
                <p className="text-gray-600">Natural drainage and breathability promote healthy plant growth</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Flower className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Artistic Design</h3>
                <p className="text-gray-600">Unique handcrafted pieces that serve as stunning garden focal points</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Sprout className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Aging</h3>
                <p className="text-gray-600">Develops beautiful patina over time, enhancing character and charm</p>
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
                <Card className="border-green-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Item Size</label>
                        <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                          <SelectTrigger className="border-green-100 focus:border-green-300">
                            <SelectValue placeholder="Select item size" />
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
                          <SelectTrigger className="border-green-100 focus:border-green-300">
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
                            <input type="checkbox" className="rounded border-green-200 text-green-600 mr-2" />
                            <span className="text-sm text-gray-600">Weather Resistant</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-green-200 text-green-600 mr-2" />
                            <span className="text-sm text-gray-600">Drainage Holes</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-green-200 text-green-600 mr-2" />
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
                    <h2 className="text-2xl font-bold text-gray-900">Garden Decor</h2>
                    <p className="text-gray-600">{filteredProducts.length} products available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-green-100 focus:border-green-300">
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
                    <Card key={product.id} className="group border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                          <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                            {product.image && product.image !== "/placeholder.svg" ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={400}
                                height={300}
                                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-64 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                                <Leaf className="h-16 w-16 text-green-400" />
                              </div>
                            )}
                            {product.badge && (
                              <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                                {product.badge}
                              </Badge>
                            )}
                            <Badge className="absolute top-3 right-3 bg-white/90 text-green-600">
                              {product.capacity}
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
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2 cursor-pointer">
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
                            <span className="text-xl font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            )}
                            {product.originalPrice && (
                              <Badge variant="secondary" className="text-xs">
                                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                              </Badge>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                              <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
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
        <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">30,000+ Garden Transformations</h3>
                <p className="text-gray-600">Trusted by gardeners and landscapers for beautiful outdoor spaces</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Weather Tested</h3>
                <p className="text-gray-600">Each piece is tested to withstand harsh outdoor conditions year-round</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Careful Delivery</h3>
                <p className="text-gray-600">Expert packaging and handling for safe delivery to your garden</p>
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