"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Palette, Crown, Award, Gem, Users, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"

export default function ArtisanSpecialsPage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const artisanProducts = [
    {
      id: 1,
      name: "Master Craftsman's Signature Dinner Set",
      price: 24999,
      originalPrice: 32999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "36-piece masterwork",
      rating: 5.0,
      reviews: 45,
      badge: "Master Crafted",
      features: ["Unique Design", "Certificate of Authenticity", "Limited Edition", "Master Quality"],
      description: "A masterpiece created by our most skilled artisan, featuring 70+ years of accumulated expertise in every piece"
    },
    {
      id: 2,
      name: "Heritage Kalash Collection",
      price: 8999,
      originalPrice: 11999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "5 sacred vessels",
      rating: 4.9,
      reviews: 78,
      badge: "Sacred Art",
      features: ["Sacred Geometry", "Hand-Carved Motifs", "Blessed Creation", "Ceremonial Grade"],
      description: "Sacred kalash vessels handcrafted using ancient techniques, featuring intricate carvings and blessed by traditional rituals"
    },
    {
      id: 3,
      name: "Tribal Art Wall Installation",
      price: 15999,
      originalPrice: 19999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "120cm x 80cm",
      rating: 4.8,
      reviews: 34,
      badge: "Museum Quality",
      features: ["Tribal Motifs", "Large Scale", "Cultural Heritage", "Authentic Art"],
      description: "A stunning wall installation featuring authentic tribal motifs and stories, handcrafted by artists from indigenous pottery communities"
    },
    {
      id: 4,
      name: "Sculptor's Dream Figurine Series",
      price: 12999,
      originalPrice: 16999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "8 figurines set",
      rating: 4.9,
      reviews: 67,
      badge: "Artist Signed",
      features: ["Sculptural Art", "Emotional Expression", "Gallery Quality", "Unique Pieces"],
      description: "A collection of expressive figurines that capture human emotions and stories, each piece sculpted with artistic vision"
    },
    {
      id: 5,
      name: "Royal Palace Recreation Set",
      price: 34999,
      originalPrice: 44999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "48-piece royal",
      rating: 5.0,
      reviews: 12,
      badge: "Royal Heritage",
      features: ["Palace Replica", "Gold Inlay", "Historical Recreation", "Collector's Item"],
      description: "An exact recreation of pottery used in Mughal palaces, featuring gold inlay work and precious stone embellishments"
    },
    {
      id: 6,
      name: "Contemporary Fusion Platter Collection",
      price: 7999,
      originalPrice: 9999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      capacity: "6 contemporary",
      rating: 4.7,
      reviews: 156,
      badge: "Innovation",
      features: ["Modern Fusion", "Innovative Technique", "Contemporary Design", "Artistic Innovation"],
      description: "Where traditional pottery meets contemporary art - innovative platters that challenge conventional forms while honoring clay traditions"
    }
  ]

  const capacityOptions = [
    { value: "all", label: "All Collections" },
    { value: "small", label: "Small Collections (5-8 pieces)" },
    { value: "medium", label: "Medium Collections (36+ pieces)" },
    { value: "large", label: "Large Collections (48+ pieces)" }
  ]

  const filteredProducts = selectedCapacity === "all"
    ? artisanProducts
    : artisanProducts.filter(product => {
        const pieces = parseInt(product.capacity)
        if (selectedCapacity === "small") return pieces <= 8
        if (selectedCapacity === "medium") return pieces >= 36 && pieces < 48
        if (selectedCapacity === "large") return pieces >= 48
        return true
      })

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-amber-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-orange-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200 text-sm px-4 py-2">
                Artisan Specials Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Exclusive <span className="text-amber-600">Artisan</span> Crafts
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Discover masterpieces created by renowned artisans where generations of skill, cultural heritage,
                and artistic vision unite to create truly exceptional pottery that transcends ordinary craftsmanship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-3">
                  Shop Artisan Collection
                </Button>
                <Button size="lg" variant="outline" className="border-amber-200 hover:bg-amber-50 text-lg px-8 py-3">
                  Meet Our Artisans
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
                  <Palette className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Master Crafted</h3>
                <p className="text-gray-600">Created by renowned artisans with decades of expertise and skill</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Crown className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Museum Quality</h3>
                <p className="text-gray-600">Gallery-worthy pieces that represent the pinnacle of pottery artistry</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Limited Editions</h3>
                <p className="text-gray-600">Exclusive collections with limited production runs for discerning collectors</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Gem className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cultural Heritage</h3>
                <p className="text-gray-600">Preserving traditional techniques while inspiring contemporary innovation</p>
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
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Collection Size</label>
                        <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                          <SelectTrigger className="border-amber-100 focus:border-amber-300">
                            <SelectValue placeholder="Select collection size" />
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
                            <SelectItem value="under-10000">Under ₹10,000</SelectItem>
                            <SelectItem value="10000-20000">₹10,000 - ₹20,000</SelectItem>
                            <SelectItem value="20000-30000">₹20,000 - ₹30,000</SelectItem>
                            <SelectItem value="above-30000">Above ₹30,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
                            <span className="text-sm text-gray-600">Limited Edition</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
                            <span className="text-sm text-gray-600">Certificate Included</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
                            <span className="text-sm text-gray-600">Artist Signed</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Artisan Specials</h2>
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
                          <div className="w-full h-64 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                            <Palette className="h-16 w-16 text-amber-400" />
                          </div>
                          {product.badge && (
                            <Badge className="absolute top-3 left-3 bg-amber-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-amber-600">
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
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
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
                            <span className="text-xl font-bold text-amber-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Collection
                            </Button>
                            <Button variant="outline" size="sm" className="border-amber-200 hover:bg-amber-50">
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
        <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">50+ Master Artisans</h3>
                <p className="text-gray-600">Collaborating with the finest pottery masters across India</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Authenticity Guaranteed</h3>
                <p className="text-gray-600">Every piece comes with certificate of authenticity and artisan signature</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Shipping</h3>
                <p className="text-gray-600">Expert packaging and white-glove delivery for precious artworks</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}