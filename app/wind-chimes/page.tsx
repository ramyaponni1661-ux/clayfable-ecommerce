"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Filter, Star, Award, Heart, Wind } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  badge?: string
}

const staticProducts: Product[] = [
  {
    id: "1",
    name: "Melodious Clay Wind Chime",
    price: 1200,
    originalPrice: 1500,
    image: "/api/placeholder/300/300",
    rating: 4.8,
    reviews: 42,
    badge: "Bestseller"
  },
  {
    id: "2",
    name: "Traditional Terracotta Bell Set",
    price: 950,
    image: "/api/placeholder/300/300",
    rating: 4.6,
    reviews: 38
  },
  {
    id: "3",
    name: "Handpainted Musical Ornament",
    price: 1800,
    originalPrice: 2200,
    image: "/api/placeholder/300/300",
    rating: 4.9,
    reviews: 56,
    badge: "Premium"
  },
  {
    id: "4",
    name: "Garden Clay Wind Bells",
    price: 750,
    image: "/api/placeholder/300/300",
    rating: 4.5,
    reviews: 29
  },
  {
    id: "5",
    name: "Artistic Sound Sculpture",
    price: 2500,
    originalPrice: 3000,
    image: "/api/placeholder/300/300",
    rating: 4.7,
    reviews: 64
  },
  {
    id: "6",
    name: "Rustic Hanging Bells",
    price: 650,
    image: "/api/placeholder/300/300",
    rating: 4.4,
    reviews: 31,
    badge: "New"
  }
]

export default function WindChimesPage() {
  const [products, setProducts] = useState<Product[]>(staticProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(staticProducts)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or('tags.cs.{wind chime},tags.cs.{bell},tags.cs.{musical},tags.cs.{ornament},tags.cs.{hanging},tags.cs.{garden decor}')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      if (data && data.length > 0) {
        const transformedProducts = data.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price) || 0,
          originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
          image: Array.isArray(item.images) && item.images.length > 0
            ? item.images[0]
            : item.image || '/api/placeholder/300/300',
          rating: 4.4 + Math.random() * 0.6,
          reviews: Math.floor(Math.random() * 80) + 20,
          badge: Math.random() > 0.7 ? (Math.random() > 0.5 ? "Bestseller" : "New") : undefined
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
        case "under-1000":
          filtered = filtered.filter(p => p.price < 1000)
          break
        case "1000-2000":
          filtered = filtered.filter(p => p.price >= 1000 && p.price <= 2000)
          break
        case "above-2000":
          filtered = filtered.filter(p => p.price > 2000)
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300 rounded-full opacity-15 animate-float-delay-1"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-sky-100 rounded-full opacity-25 animate-float-delay-2"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-blue-200 rounded-full opacity-20 animate-float-delay-3"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-sky-300 rounded-full opacity-15 animate-float"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky-100 text-sky-800 border-sky-200 text-sm px-4 py-2">
              Wind Chimes Collection
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Musical <span className="text-sky-600">Wind</span> Chimes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Fill your space with gentle melodies and soothing sounds from our handcrafted terracotta wind chimes and musical ornaments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-6 mx-auto">
                <Music className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Melodious Sounds</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Create soothing melodies with natural clay tones that harmonize with the breeze
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-6 mx-auto">
                <Wind className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Weather Resistant</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Designed to withstand outdoor elements while maintaining their beautiful sound
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-6 mx-auto">
                <Award className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Handcrafted Art</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Each piece is uniquely crafted with artistic patterns and traditional techniques
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-6 mx-auto">
                <Heart className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Peaceful Ambiance</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Transform any space into a tranquil retreat with gentle, calming sounds
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sky-100 sticky top-4">
                  <div className="flex items-center mb-6">
                    <Filter className="h-5 w-5 text-sky-600 mr-2" />
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
                          <SelectItem value="under-1000">Under ₹1,000</SelectItem>
                          <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                          <SelectItem value="above-2000">Above ₹2,000</SelectItem>
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
                    Wind Chimes ({filteredProducts.length})
                  </h2>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100">
                        <div className="w-full h-64 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className="group border-sky-100 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.badge && (
                              <Badge className="absolute top-3 left-3 bg-sky-600 text-white border-0">
                                {product.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="p-6">
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
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
                              <Button className="bg-sky-600 hover:bg-sky-700 text-white">
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

          <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-3xl p-12 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">The Music of Clay</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the unique acoustic properties of terracotta that create beautiful, natural tones
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="h-8 w-8 text-sky-700" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Natural Resonance</h4>
                <p className="text-gray-600">
                  Clay's unique density creates warm, earthy tones that metal chimes cannot replicate
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wind className="h-8 w-8 text-sky-700" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Wind Sensitivity</h4>
                <p className="text-gray-600">
                  Carefully balanced to respond to gentle breezes, creating music even in light winds
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-sky-700" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Therapeutic Sounds</h4>
                <p className="text-gray-600">
                  Natural frequencies that promote relaxation and reduce stress through sound therapy
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-sky-100">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Placement & Care</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tips for optimal placement and maintenance to enjoy your wind chimes for years
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Ideal Locations</h4>
                <p className="text-gray-600 text-sm">
                  Hang in areas with gentle air circulation like patios, balconies, or near windows
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Height Matters</h4>
                <p className="text-gray-600 text-sm">
                  Position at shoulder height or higher for optimal sound projection and aesthetics
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Seasonal Care</h4>
                <p className="text-gray-600 text-sm">
                  During extreme weather, bring indoors to preserve the clay and extend lifespan
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Gentle Cleaning</h4>
                <p className="text-gray-600 text-sm">
                  Clean with soft cloth and mild soap; avoid harsh chemicals that could damage the clay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}