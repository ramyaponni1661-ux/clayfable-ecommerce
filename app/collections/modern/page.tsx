"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Star,
  Filter,
  Zap,
  Palette,
  Sparkles,
  Award,
  ShoppingCart,
  Truck,
  Heart,
  Lightbulb,
  Layers,
  Users
} from "lucide-react"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  category: string
  features: string[]
  description: string
  inStock: boolean
  discount?: number
  isNew?: boolean
  isBestseller?: boolean
  size: string
  weight: string
  material: string
  finish: string
  style: string
  designer: string
  year: string
}

const modernFusionProducts: Product[] = [
  {
    id: "modern-001",
    name: "Contemporary Geometric Dinner Set",
    price: 6999,
    originalPrice: 8999,
    rating: 4.8,
    reviews: 234,
    image: "/api/placeholder/400/400",
    category: "Dinner Sets",
    features: ["Geometric Design", "Modern Aesthetic", "Stackable", "Contemporary"],
    description: "Where traditional terracotta meets contemporary design - this geometric dinner set features clean lines and modern sophistication.",
    inStock: true,
    discount: 22,
    isBestseller: true,
    size: "24-piece set",
    weight: "12kg",
    material: "Premium Terracotta",
    finish: "Matte Contemporary",
    style: "Modern Geometric",
    designer: "Studio Clayfable",
    year: "2024"
  },
  {
    id: "modern-002",
    name: "Minimalist Square Bowl Collection",
    price: 3499,
    originalPrice: 4299,
    rating: 4.7,
    reviews: 187,
    image: "/api/placeholder/400/400",
    category: "Bowl Sets",
    features: ["Minimalist Design", "Square Form", "Nesting Bowls", "Space Efficient"],
    description: "Clean, minimalist square bowls that nest perfectly together, combining traditional clay craftsmanship with modern functionality.",
    inStock: true,
    discount: 19,
    isNew: true,
    size: "Set of 6 nesting bowls",
    weight: "4kg",
    material: "Refined Terracotta",
    finish: "Smooth Matte",
    style: "Minimalist Modern",
    designer: "Design Lab",
    year: "2024"
  },
  {
    id: "modern-003",
    name: "Urban Fusion Platter Set",
    price: 4899,
    originalPrice: 5999,
    rating: 4.9,
    reviews: 156,
    image: "/api/placeholder/400/400",
    category: "Serving Platters",
    features: ["Urban Aesthetic", "Mixed Shapes", "Party Perfect", "Statement Pieces"],
    description: "Bold urban-inspired serving platters that make a statement at modern dinner parties while honoring traditional pottery techniques.",
    inStock: true,
    discount: 18,
    isBestseller: true,
    size: "Set of 4 mixed platters",
    weight: "6kg",
    material: "Contemporary Clay Blend",
    finish: "Urban Glaze",
    style: "Urban Fusion",
    designer: "City Studio",
    year: "2024"
  },
  {
    id: "modern-004",
    name: "Asymmetric Art Vase Collection",
    price: 2799,
    originalPrice: 3399,
    rating: 4.6,
    reviews: 123,
    image: "/api/placeholder/400/400",
    category: "Decorative Vases",
    features: ["Asymmetric Design", "Artistic Form", "Modern Art", "Conversation Starter"],
    description: "Sculptural vases with intentionally asymmetric forms that challenge traditional pottery aesthetics while celebrating clay's versatility.",
    inStock: true,
    discount: 18,
    isNew: true,
    size: "Set of 3 varied heights",
    weight: "5kg",
    material: "Artistic Terracotta",
    finish: "Contemporary Matte",
    style: "Asymmetric Modern",
    designer: "Art Collective",
    year: "2024"
  },
  {
    id: "modern-005",
    name: "Linear Coffee Set",
    price: 3999,
    originalPrice: 4799,
    rating: 4.8,
    reviews: 198,
    image: "/api/placeholder/400/400",
    category: "Coffee Sets",
    features: ["Linear Design", "Coffee Culture", "Modern Lifestyle", "Clean Lines"],
    description: "A coffee set designed for modern living - clean lines and contemporary forms perfect for today's coffee culture enthusiasts.",
    inStock: true,
    discount: 17,
    size: "Coffee service for 6",
    weight: "3kg",
    material: "Modern Ceramic Blend",
    finish: "Sleek Glaze",
    style: "Linear Modern",
    designer: "Modern Living Studio",
    year: "2024"
  },
  {
    id: "modern-006",
    name: "Modular Dining System",
    price: 8999,
    originalPrice: 11999,
    rating: 4.9,
    reviews: 89,
    image: "/api/placeholder/400/400",
    category: "Modular Sets",
    features: ["Modular Design", "Customizable", "Expandable", "Future-Forward"],
    description: "Revolutionary modular dining system that adapts to your lifestyle - mix, match, and expand as your needs change.",
    inStock: true,
    discount: 25,
    isBestseller: true,
    size: "32-piece modular system",
    weight: "15kg",
    material: "Advanced Terracotta",
    finish: "Modular Matte",
    style: "Modular Contemporary",
    designer: "Future Design Lab",
    year: "2024"
  }
]

export default function ModernFusionPage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const capacityOptions = [
    { value: "all", label: "All Categories" },
    { value: "dinner", label: "Dinner Sets" },
    { value: "bowl", label: "Bowl Sets" },
    { value: "decorative", label: "Decorative" }
  ]

  const filteredProducts = selectedCapacity === "all"
    ? modernFusionProducts
    : modernFusionProducts.filter(product => {
        if (selectedCapacity === "dinner") return product.category.includes("Dinner")
        if (selectedCapacity === "bowl") return product.category.includes("Bowl")
        if (selectedCapacity === "decorative") return product.category.includes("Decorative")
        return true
      })


  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-indigo-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-purple-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-indigo-100 text-indigo-800 border-indigo-200 text-sm px-4 py-2">
                Modern Fusion Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Contemporary <span className="text-indigo-600">Modern Fusion</span> Pottery
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Where tradition meets innovation. Our modern fusion collection combines 70+ years of pottery heritage
                with cutting-edge design, creating pieces that speak to contemporary lifestyles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3">
                  Shop Modern Collection
                </Button>
                <Button size="lg" variant="outline" className="border-indigo-200 hover:bg-indigo-50 text-lg px-8 py-3">
                  Design Philosophy
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
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">Cutting-edge design thinking meets traditional craft</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Contemporary</h3>
                <p className="text-gray-600">Modern living solutions with timeless appeal</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Heritage Fusion</h3>
                <p className="text-gray-600">Tradition meets innovation in every piece</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Palette className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Artistic Vision</h3>
                <p className="text-gray-600">Designer collaborations and artistic expressions</p>
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
                <Card className="border-indigo-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Category</label>
                        <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                          <SelectTrigger className="border-indigo-100 focus:border-indigo-300">
                            <SelectValue placeholder="Select category" />
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
                          <SelectTrigger className="border-indigo-100 focus:border-indigo-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-4000">Under ₹4,000</SelectItem>
                            <SelectItem value="4000-6000">₹4,000 - ₹6,000</SelectItem>
                            <SelectItem value="above-6000">Above ₹6,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-indigo-200 text-indigo-600 mr-2" />
                            <span className="text-sm text-gray-600">Designer Collection</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-indigo-200 text-indigo-600 mr-2" />
                            <span className="text-sm text-gray-600">Modern Design</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-indigo-200 text-indigo-600 mr-2" />
                            <span className="text-sm text-gray-600">Limited Edition</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Modern Fusion Collection</h2>
                    <p className="text-gray-600">{filteredProducts.length} products available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-indigo-100 focus:border-indigo-300">
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
                    <Card key={product.id} className="group border-indigo-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <div className="w-full h-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <Sparkles className="h-16 w-16 text-indigo-400" />
                          </div>
                          {product.isBestseller && (
                            <Badge className="absolute top-3 left-3 bg-indigo-600 text-white">
                              Bestseller
                            </Badge>
                          )}
                          {product.isNew && (
                            <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                              New
                            </Badge>
                          )}
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
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
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
                            <span className="text-xl font-bold text-indigo-600">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                              <>
                                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                </Badge>
                              </>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={!product.inStock}>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Button variant="outline" size="sm" className="border-indigo-200 hover:bg-indigo-50">
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

        {/* Detailed Information Sections */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Art of Modern Fusion Design</h2>

              <div className="text-gray-700 leading-relaxed">
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  For over 70 years, Clayfable has been perfecting the art of terracotta craftsmanship. Our Modern Fusion collection represents the next evolution of this ancient craft, where traditional techniques meet contemporary design sensibilities to create pieces that are both timeless and thoroughly modern.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contemporary Meets Traditional</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our Modern Fusion collection represents a bold evolution in pottery design. By combining 70+ years of traditional terracotta expertise with contemporary design principles, we've created pieces that speak to modern sensibilities while honoring our craft heritage. Each piece is thoughtfully designed to fit seamlessly into today's lifestyle.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These aren't just pottery pieces – they're design statements that reflect the intersection of tradition and innovation. From geometric forms to asymmetric sculptures, every piece challenges conventional pottery aesthetics while maintaining the soulful quality that only handcrafted terracotta can provide.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Designer Collaborations</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We've partnered with leading contemporary designers to create this exclusive collection. Each designer brings their unique vision while working within the possibilities and limitations of terracotta as a medium. The result is a collection that pushes boundaries while respecting the material's natural properties.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  From Studio Clayfable's geometric explorations to Future Design Lab's modular innovations, each collaboration represents months of experimentation, prototyping, and refinement. These pieces are limited editions that showcase what's possible when traditional craft meets modern design thinking.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Design Philosophy</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our design philosophy centers on the principle that form should follow function while honoring the material's natural properties. Every modern piece is designed with contemporary living in mind. Stackable forms save space, modular systems adapt to changing needs, and clean lines complement modern interiors.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Rather than hiding terracotta's natural qualities, our modern designs celebrate them. The clay's inherent warmth softens contemporary geometries, creating approachable modern pieces that feel both sophisticated and welcoming. We avoid trendy elements that quickly date, instead focusing on timeless modern principles that will feel fresh for decades.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Innovation in Clay</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Modern Fusion collection showcases innovative approaches to traditional pottery techniques. From new glazing methods to experimental forms, each piece represents a step forward in ceramic art. Our artisans experiment with geometric forms, modular designs, asymmetric expressions, and contemporary finishes.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Each piece serves as a bridge between traditional Indian pottery heritage and global contemporary design, making cultural craftsmanship relevant for modern international audiences. These limited edition pieces showcase what's possible when traditional craft meets cutting-edge design thinking.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sustainable Modern Living</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our modern pieces maintain all the sustainable benefits of traditional terracotta while meeting contemporary lifestyle needs. They're naturally biodegradable, require minimal energy to produce, and develop character over time rather than showing wear. These pieces represent a conscious choice for environmentally aware consumers who refuse to compromise on style.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By choosing our Modern Fusion collection, you're not just acquiring beautiful objects – you're supporting a sustainable craft tradition that has evolved to meet modern needs while maintaining its essential character and environmental benefits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">25,000+ Design Enthusiasts</h3>
                <p className="text-gray-600">Trusted by modern living enthusiasts and design professionals</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Designer Quality</h3>
                <p className="text-gray-600">Premium materials and contemporary design standards</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Shipping</h3>
                <p className="text-gray-600">Special packaging for delicate modern pieces</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}