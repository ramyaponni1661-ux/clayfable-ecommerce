"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Utensils, Leaf, Award, Shield, Users, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { createClient } from '@/lib/supabase/client'

export default function ServingPage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [servingProducts, setServingProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch serving products from database
  useEffect(() => {
    const fetchServingProducts = async () => {
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
          .or('product_tags.cs.{"serving"}', 'product_tags.cs.{"tableware"}', 'product_tags.cs.{"bowl"}', 'product_tags.cs.{"plate"}')
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          console.error('Error fetching serving products:', error)
        } else {
          const transformedProducts = products?.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.compare_price || Math.floor(product.price * 1.2),
            image: product.images ? JSON.parse(product.images)?.[0] || "/placeholder.svg" : "/placeholder.svg",
            capacity: product.capacity || "Standard",
            rating: 4.5 + Math.random() * 0.4,
            reviews: Math.floor(Math.random() * 300) + 50,
            badge: product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? "New" : "Best Seller",
            features: ["Food Safe", "Microwave Safe", "Elegant Design", "Chip Resistant"],
            description: product.description || "Premium serving piece crafted from natural terracotta for elegant dining"
          })) || []

          setServingProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServingProducts()
  }, [])

  const staticServingProducts = [
    {
      id: 1,
      name: "Elegant Terracotta Serving Bowl Set",
      price: 1249,
      originalPrice: 1899,
      image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
      capacity: "Set of 6",
      rating: 4.9,
      reviews: 298,
      badge: "Best Seller",
      features: ["Food Safe", "Microwave Safe", "Elegant Design", "Chip Resistant"],
      description: "Premium serving bowl set crafted from natural terracotta for elegant dining"
    },
    {
      id: 2,
      name: "Handcrafted Dinner Plate Collection",
      price: 899,
      originalPrice: 1399,
      image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
      capacity: "Set of 8",
      rating: 4.8,
      reviews: 234,
      badge: "Handcrafted",
      features: ["Traditional Motifs", "Perfect Size", "Durable", "Authentic"],
      description: "Traditional dinner plates with intricate motifs, perfect for family meals"
    },
    {
      id: 3,
      name: "Royal Terracotta Platter Set",
      price: 1599,
      originalPrice: 2299,
      image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
      capacity: "Set of 4",
      rating: 4.9,
      reviews: 189,
      badge: "Premium",
      features: ["Large Size", "Festive Design", "Statement Piece", "Royal Quality"],
      description: "Royal collection platters for special occasions and grand presentations"
    },
    {
      id: 4,
      name: "Traditional Serving Bowl Trio",
      price: 649,
      originalPrice: 949,
      image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
      capacity: "Set of 3",
      rating: 4.7,
      reviews: 156,
      badge: "Traditional",
      features: ["Multi-Size", "Versatile Use", "Classic Design", "Family Friendly"],
      description: "Versatile trio of serving bowls for everyday dining and special occasions"
    },
    {
      id: 5,
      name: "Premium Terracotta Dinnerware Set",
      price: 2199,
      originalPrice: 3299,
      image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
      capacity: "24-Piece Set",
      rating: 4.9,
      reviews: 312,
      badge: "Complete Set",
      features: ["Complete Dining", "Uniform Design", "Gift Ready", "Premium Quality"],
      description: "Complete dinnerware solution for elegant family dining experiences"
    },
    {
      id: 6,
      name: "Artisan Dessert Plate Collection",
      price: 549,
      originalPrice: 799,
      image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
      capacity: "Set of 6",
      rating: 4.6,
      reviews: 123,
      badge: "Artisan Made",
      features: ["Perfect Size", "Elegant Finish", "Dessert Special", "Handcrafted"],
      description: "Delicate dessert plates perfect for sweet endings to memorable meals"
    }
  ]

  const capacityOptions = [
    { value: "all", label: "All Sets" },
    { value: "small", label: "Small Sets (3-4 pieces)" },
    { value: "medium", label: "Medium Sets (6-8 pieces)" },
    { value: "large", label: "Large Sets (12+ pieces)" }
  ]

  // Combine database products with static products as fallback
  const allProducts = servingProducts.length > 0 ? servingProducts : staticServingProducts

  const filteredProducts = selectedCapacity === "all"
    ? allProducts
    : allProducts.filter(product => {
        const setSize = parseInt(product.capacity)
        if (selectedCapacity === "small") return setSize <= 4
        if (selectedCapacity === "medium") return setSize >= 6 && setSize <= 8
        if (selectedCapacity === "large") return setSize >= 12
        return true
      })

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
                Serving Ware Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Elegant <span className="text-emerald-600">Serving</span> Bowls & Plates
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Transform every meal into a memorable experience with our handcrafted terracotta serving ware.
                From intimate family dinners to grand celebrations, our elegant bowls and plates bring timeless
                beauty and natural functionality to your dining table.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-3">
                  Shop Serving Ware
                </Button>
                <Button size="lg" variant="outline" className="border-emerald-200 hover:bg-emerald-50 text-lg px-8 py-3">
                  View Collection Guide
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
                  <Utensils className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Perfect Serving</h3>
                <p className="text-gray-600">Designed for elegant food presentation and easy serving</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Beauty</h3>
                <p className="text-gray-600">Handcrafted terracotta with natural earth tones and textures</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600">Master crafted pieces built to last for generations</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Food Safe</h3>
                <p className="text-gray-600">Natural clay construction safe for all food types</p>
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
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Set Size</label>
                        <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                          <SelectTrigger className="border-emerald-100 focus:border-emerald-300">
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
                          <SelectTrigger className="border-emerald-100 focus:border-emerald-300">
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
                            <input type="checkbox" className="rounded border-emerald-200 text-emerald-600 mr-2" />
                            <span className="text-sm text-gray-600">Microwave Safe</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-emerald-200 text-emerald-600 mr-2" />
                            <span className="text-sm text-gray-600">Dishwasher Safe</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-emerald-200 text-emerald-600 mr-2" />
                            <span className="text-sm text-gray-600">Handcrafted</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Serving Bowls & Plates</h2>
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
                      <SelectItem value="set-size">Set Size</SelectItem>
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
                    <Card key={product.id} className="group border-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          {product.image && product.image !== "/placeholder.svg" ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-64 bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                              <Utensils className="h-16 w-16 text-emerald-400" />
                            </div>
                          )}
                          {product.badge && (
                            <Badge className="absolute top-3 left-3 bg-emerald-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-emerald-600">
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
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
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
                            <span className="text-xl font-bold text-emerald-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="sm" className="border-emerald-200 hover:bg-emerald-50">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Art of Terracotta Serving Ware</h2>

              <div className="text-gray-700 leading-relaxed">
                <p className="text-xl mb-6">
                  For centuries, terracotta serving bowls and plates have graced dining tables across cultures, representing the perfect harmony between natural beauty and functional excellence. At Clayfable, we honor this ancient tradition by creating serving pieces that transform every meal into a celebration of craftsmanship, taste, and togetherness.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Natural Elegance in Every Piece</h3>
                <p className="mb-4">
                  Our terracotta serving ware collection showcases the inherent beauty of natural clay, shaped by skilled artisans who understand the delicate balance between form and function. Each bowl and plate is carefully crafted to enhance food presentation while providing the durability needed for everyday use and special occasions alike.
                </p>
                <p className="mb-4">
                  The warm, earthy tones of terracotta create an inviting atmosphere that encourages connection and conversation around the dining table. Unlike mass-produced alternatives, each piece carries the unique character marks of handcraftsmanship, making your serving collection truly one-of-a-kind.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Superior Food Presentation</h3>
                <p className="mb-4">
                  Terracotta's natural properties make it ideal for serving food at optimal temperatures. The clay's thermal mass helps keep hot foods warm longer while preventing cold dishes from warming too quickly. This temperature stability ensures that your carefully prepared meals are presented exactly as intended, maintaining their flavors and visual appeal throughout the dining experience.
                </p>
                <p className="mb-4">
                  The natural texture and color of terracotta provide the perfect backdrop for food presentation, enhancing the visual appeal of everything from colorful salads to rich curries. The earthy backdrop allows the natural colors and textures of food to shine, creating Instagram-worthy presentations that celebrate both the meal and the vessel.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Health and Safety Benefits</h3>
                <p className="mb-4">
                  Unlike plastic or metal serving dishes, terracotta is completely natural and non-toxic, containing no harmful chemicals or synthetic coatings. The porous nature of clay allows for natural air circulation, which helps prevent moisture buildup and reduces the risk of bacterial growth when properly maintained.
                </p>
                <p className="mb-4">
                  Our food-grade clay is carefully selected and fired at precise temperatures to ensure it meets the highest safety standards while maintaining its natural properties. The result is serving ware that not only looks beautiful but also contributes to healthier, more natural food service and storage.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Versatile Serving Solutions</h3>
                <p className="mb-4">
                  From intimate family dinners to grand celebrations, our serving ware collection offers pieces sized and shaped for every occasion. Small bowls perfect for individual portions and appetizers, medium bowls ideal for side dishes and salads, and large serving platters designed for main courses and family-style dining.
                </p>
                <p className="mb-4">
                  The timeless design of our terracotta serving pieces complements both traditional and contemporary table settings. Whether you're hosting a casual backyard gathering or an elegant dinner party, these pieces adapt seamlessly to your style while adding warmth and authenticity to your presentation.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Care and Maintenance</h3>
                <p className="mb-4">
                  Caring for terracotta serving ware is simple and straightforward. Hand washing with warm, soapy water is recommended to preserve the natural properties of the clay. For glazed pieces, gentle scrubbing with a soft brush removes food residue while protecting the surface finish.
                </p>
                <p className="mb-4">
                  Allow pieces to air dry completely before storing to prevent moisture retention. With proper care, our terracotta serving ware develops a beautiful patina over time, becoming more beautiful and characterful with age. Many families pass these pieces down through generations, creating lasting memories around shared meals and celebrations.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sustainable Dining Choice</h3>
                <p className="mb-4">
                  Choosing terracotta serving ware represents a commitment to sustainable living and environmental responsibility. Clay is a renewable natural resource that requires minimal processing, and our traditional firing methods consume far less energy than modern ceramic production techniques.
                </p>
                <p className="mb-4">
                  At the end of their useful life, terracotta pieces can be safely returned to the earth, leaving no environmental impact. By investing in quality handcrafted serving ware, you're supporting sustainable craftsmanship while reducing your household's reliance on disposable or synthetic serving options.
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">50,000+ Happy Hosts</h3>
                <p className="text-gray-600">Trusted by families for elegant serving and memorable dining experiences</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600">Food-safe clay tested for durability and performance standards</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Safe Delivery</h3>
                <p className="text-gray-600">Expert packaging ensures your serving pieces arrive in perfect condition</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}