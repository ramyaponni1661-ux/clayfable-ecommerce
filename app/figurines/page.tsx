"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Crown, Bird, Trees, Flower2, Users, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"

export default function FigurinesPage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const figurineProducts = [
    {
      id: 1,
      name: "Majestic Elephant Family Sculpture",
      price: 3299,
      originalPrice: 3899,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "18\" length",
      rating: 4.9,
      reviews: 187,
      badge: "Symbol of Prosperity",
      features: ["Hand-Painted Details", "Weather Resistant", "Cultural Significance", "Statement Piece"],
      description: "Bring good fortune to your home with this magnificent elephant family sculpture, symbolizing wisdom, strength, and prosperity in Indian tradition"
    },
    {
      id: 2,
      name: "Dancing Ganesha Idol",
      price: 1899,
      originalPrice: 2299,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "10\" height",
      rating: 4.8,
      reviews: 342,
      badge: "Sacred Design",
      features: ["Festival Ready", "Hand-Crafted", "Blessing Energy", "Traditional"],
      description: "Celebrate festivals and daily worship with this beautiful dancing Ganesha idol, meticulously crafted to bring blessings and remove obstacles"
    },
    {
      id: 3,
      name: "Peacock Couple Garden Sculpture",
      price: 2799,
      originalPrice: 3199,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "16\" height",
      rating: 4.7,
      reviews: 156,
      badge: "Symbol of Love",
      features: ["Vibrant Colors", "Weather Resistant", "Garden Accent", "Artistic Design"],
      description: "Add elegance to your garden with this stunning peacock couple, representing beauty, grace, and eternal love in vibrant hand-painted colors"
    },
    {
      id: 4,
      name: "Village Life Miniature Set",
      price: 4599,
      originalPrice: 5499,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "Complete scene",
      rating: 4.8,
      reviews: 89,
      badge: "Cultural Heritage",
      features: ["Detailed Miniatures", "Complete Scene", "Storytelling Art", "Folk Tradition"],
      description: "Experience rural India with this intricate miniature village set, featuring farmers, animals, and daily life scenes that tell the story of traditional Indian villages"
    },
    {
      id: 5,
      name: "Lotus Buddha Meditation Statue",
      price: 2299,
      originalPrice: 2699,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "12\" height",
      rating: 4.9,
      reviews: 234,
      badge: "Peaceful Expression",
      features: ["Meditation Focus", "Zen Garden Perfect", "Calming Presence", "Spiritual"],
      description: "Create a peaceful meditation space with this serene Buddha statue seated on a lotus, designed to promote tranquility and mindfulness"
    },
    {
      id: 6,
      name: "Mother and Child Sculpture",
      price: 1799,
      originalPrice: 2099,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "14\" height",
      rating: 4.6,
      reviews: 167,
      badge: "Emotional Expression",
      features: ["Modern Art", "Gift Perfect", "Home Decor", "Family Bond"],
      description: "Celebrate the bond of love with this touching mother and child sculpture, perfect for home decor or as a meaningful gift for new parents"
    }
  ]

  const capacityOptions = [
    { value: "all", label: "All Figurines" },
    { value: "small", label: "Small (Under 12\")" },
    { value: "medium", label: "Medium (12-16\")" },
    { value: "large", label: "Large (16\"+ or Sets)" }
  ]

  const filteredProducts = selectedCapacity === "all"
    ? figurineProducts
    : figurineProducts.filter(product => {
        const size = parseInt(product.capacity)
        if (selectedCapacity === "small") return size < 12
        if (selectedCapacity === "medium") return size >= 12 && size <= 16
        if (selectedCapacity === "large") return size > 16 || product.capacity.includes("scene") || product.capacity.includes("length")
        return true
      })

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-purple-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-pink-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200 text-sm px-4 py-2">
                Figurines & Sculptures Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Traditional <span className="text-purple-600">Figurines</span> & Sculptures
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Discover our exquisite collection of handcrafted terracotta figurines and sculptures.
                From spiritual idols to contemporary art pieces, each creation tells a story and brings meaning to your space with cultural significance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                  Shop Figurines
                </Button>
                <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-50 text-lg px-8 py-3">
                  Cultural Guide
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
                  <Crown className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Spiritual Significance</h3>
                <p className="text-gray-600">Blessed with positive energy and traditional cultural meanings</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Bird className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Artistic Excellence</h3>
                <p className="text-gray-600">Museum-quality craftsmanship with intricate hand-painted details</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Trees className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cultural Heritage</h3>
                <p className="text-gray-600">Preserving ancient traditions and storytelling through terracotta art</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Flower2 className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Emotional Connection</h3>
                <p className="text-gray-600">Stories and symbols that touch the heart and inspire the soul</p>
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
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Size Category</label>
                        <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                          <SelectTrigger className="border-purple-100 focus:border-purple-300">
                            <SelectValue placeholder="Select size category" />
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
                            <input type="checkbox" className="rounded border-purple-200 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-600">Hand-Painted</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-purple-200 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-600">Religious/Spiritual</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-purple-200 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-600">Weather Resistant</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Figurines & Sculptures</h2>
                    <p className="text-gray-600">{filteredProducts.length} products available</p>
                  </div>
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
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                            <Crown className="h-16 w-16 text-purple-400" />
                          </div>
                          {product.badge && (
                            <Badge className="absolute top-3 left-3 bg-purple-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-purple-600">
                            {product.capacity}
                          </Badge>
                          <button className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                            <Heart className="h-4 w-4 text-gray-600" />
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
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

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
                            <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
                              Quick View
                            </Button>
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
        <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">15,000+ Spiritual Homes</h3>
                <p className="text-gray-600">Trusted by families for bringing positive energy and cultural richness</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Blessed Craftsmanship</h3>
                <p className="text-gray-600">Each piece is crafted with devotion and blessed for positive energy</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sacred Delivery</h3>
                <p className="text-gray-600">Special care and reverence in packaging and delivering sacred items</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}