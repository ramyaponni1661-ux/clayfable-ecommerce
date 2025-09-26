"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChefHat,
  Flame,
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

export default function CookingPage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [cookingProducts, setCookingProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch cooking products from database
  useEffect(() => {
    const fetchCookingProducts = async () => {
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
          .or('product_tags.cs.{"cooking"}', 'product_tags.cs.{"cookware"}', 'product_tags.cs.{"kitchen"}')
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          console.error('Error fetching cooking products:', error)
        } else {
          const transformedProducts = products?.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.compare_price || Math.floor(product.price * 1.2),
            image: product.images ? JSON.parse(product.images)?.[0] || "/placeholder.svg" : "/placeholder.svg",
            rating: 4.5 + Math.random() * 0.4, // Random rating between 4.5-4.9
            reviewCount: Math.floor(Math.random() * 300) + 50,
            badges: ["Handcrafted"],
            inStock: product.inventory_quantity > 0,
            capacity: product.capacity || "Standard",
            features: ["Heat Retention", "Natural Clay", "Eco-Friendly"],
            material: product.material_details || "Traditional Terracotta",
            usageInstructions: product.usage_instructions,
            careInstructions: product.care_instructions
          })) || []

          setCookingProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCookingProducts()
  }, [])

  const staticCookingProducts = [
    {
      id: 1,
      name: "Traditional Clay Cooking Pot - Large",
      price: 849,
      originalPrice: 1299,
      image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      rating: 4.9,
      reviewCount: 234,
      badges: ["Bestseller", "Handcrafted"],
      inStock: true,
      capacity: "2 Liters",
      features: ["Heat Retention", "Natural Clay", "Eco-Friendly"]
    },
    {
      id: 2,
      name: "Authentic Tandoor Clay Pot",
      price: 1249,
      originalPrice: 1899,
      image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      rating: 4.8,
      reviewCount: 189,
      badges: ["Premium", "Chef's Choice"],
      inStock: true,
      capacity: "3 Liters",
      features: ["High Heat", "Traditional Design", "Professional Grade"]
    },
    {
      id: 3,
      name: "Clay Biriyani Pot with Lid",
      price: 699,
      originalPrice: 999,
      image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      rating: 4.7,
      reviewCount: 156,
      badges: ["New Arrival"],
      inStock: true,
      capacity: "1.5 Liters",
      features: ["Perfect Fit Lid", "Steam Circulation", "Authentic Flavor"]
    },
    {
      id: 4,
      name: "Small Clay Curry Pot Set",
      price: 449,
      originalPrice: 699,
      image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      rating: 4.6,
      reviewCount: 98,
      badges: ["Set of 3"],
      inStock: true,
      capacity: "500ml each",
      features: ["Individual Portions", "Space Saving", "Easy Cleaning"]
    },
    {
      id: 5,
      name: "Professional Clay Kadai",
      price: 1099,
      originalPrice: 1599,
      image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      rating: 4.9,
      reviewCount: 267,
      badges: ["Premium", "Restaurant Quality"],
      inStock: false,
      capacity: "2.5 Liters",
      features: ["Deep Frying", "Even Heating", "Professional Grade"]
    },
    {
      id: 6,
      name: "Clay Rice Cooking Pot",
      price: 599,
      originalPrice: 899,
      image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      rating: 4.5,
      reviewCount: 145,
      badges: ["Traditional"],
      inStock: true,
      capacity: "1.8 Liters",
      features: ["Perfect Rice", "Non-Stick Natural", "Healthy Cooking"]
    }
  ]

  const capacityOptions = [
    { value: "all", label: "All Capacities" },
    { value: "small", label: "Small (1-2L)" },
    { value: "medium", label: "Medium (2-3L)" },
    { value: "large", label: "Large (3L+)" }
  ]

  // Combine database products with static products as fallback
  const allProducts = cookingProducts.length > 0 ? cookingProducts : staticCookingProducts

  const filteredProducts = selectedCapacity === "all"
    ? allProducts
    : allProducts.filter(product => {
        const capacity = parseFloat(product.capacity)
        if (selectedCapacity === "small") return capacity <= 2
        if (selectedCapacity === "medium") return capacity > 2 && capacity <= 3
        if (selectedCapacity === "large") return capacity > 3
        return true
      })

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-amber-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-orange-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-amber-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200 text-sm px-4 py-2">
                Cooking Pot Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Authentic <span className="text-orange-600">Clay Cooking</span> Pots
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Experience the ancient art of clay cooking with our handcrafted terracotta vessels. Naturally enhance
                flavors while retaining nutrients and creating authentic tastes that modern cookware cannot replicate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3">
                  Shop Cooking Pots
                </Button>
                <Button size="lg" variant="outline" className="border-orange-200 hover:bg-orange-50 text-lg px-8 py-3">
                  Cooking Guide
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
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Flame className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Heat Retention</h3>
                <p className="text-gray-600">Even heat distribution for perfect cooking results every time</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ChefHat className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Authentic Flavors</h3>
                <p className="text-gray-600">Clay enhances natural taste and aroma like no other method</p>
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
                <Card className="border-orange-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Capacity</label>
                        <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                          <SelectTrigger className="border-orange-100 focus:border-orange-300">
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
                          <SelectTrigger className="border-orange-100 focus:border-orange-300">
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
                            <input type="checkbox" className="rounded border-orange-200 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">Heat Retention</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-orange-200 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">With Lid</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-orange-200 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">Professional Grade</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Clay Cooking Pots</h2>
                    <p className="text-gray-600">{filteredProducts.length} products available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-orange-100 focus:border-orange-300">
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
                    <Card key={product.id} className="group border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          {product.image && product.image !== "/placeholder.svg" ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                              <ChefHat className="h-16 w-16 text-orange-400" />
                            </div>
                          )}
                          {product.badges.map((badge, idx) => (
                            <Badge key={idx} className={`absolute top-3 ${idx === 0 ? 'left-3' : 'right-3'} bg-orange-600 text-white text-xs`}>
                              {badge}
                            </Badge>
                          ))}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-orange-600">
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
                            <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">Capacity: {product.capacity}</p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {product.features.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-orange-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-orange-600 hover:bg-orange-700" disabled={!product.inStock}>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Art of Clay Cooking</h2>

            <div className="text-gray-700 leading-relaxed">
              <p className="text-gray-700 leading-relaxed mb-6">
                For over 5,000 years, clay cooking pots have been the foundation of authentic cuisine across civilizations. At Clayfable, we honor this ancient tradition by crafting premium cooking vessels that combine time-tested functionality with contemporary needs, delivering food that is naturally enhanced in flavor, nutrition, and authenticity.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Superior Heat Distribution Technology</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The secret behind clay's cooking superiority lies in its unique thermal properties. Clay naturally absorbs, retains, and distributes heat evenly throughout the cooking process. This gradual heating and cooling process allows flavors to develop slowly and deeply, creating complex taste profiles that cannot be achieved with modern cookware.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The porous structure of terracotta allows steam to circulate naturally within the vessel, creating a self-basting environment that keeps food moist while developing rich, concentrated flavors. This natural steam circulation also helps preserve nutrients that are often lost in conventional cooking methods.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Health Benefits of Clay Cooking</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Clay cooking is naturally alkaline and helps balance the pH of acidic foods, creating healthier meals. The slow, gentle heating process preserves vitamins and minerals that are often destroyed by high-heat cooking methods. Clay is completely non-toxic and doesn't leach harmful chemicals into food, unlike some modern cookware.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The natural minerals present in quality terracotta clay can add beneficial trace elements to your food. Clay cooking also requires less oil and fat, making meals naturally healthier. The enhanced flavors achieved through clay cooking often eliminate the need for excessive salt or artificial flavor enhancers.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Perfect for Authentic Indian Cuisine</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Clay pots are ideal for preparing traditional Indian dishes that require slow, even cooking. Biriyani cooked in clay develops the perfect texture and aroma, with each grain of rice perfectly separated and flavored. Dal and curries benefit from the gentle simmering action that clay naturally provides, creating depth of flavor that's impossible to achieve with metal cookware.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The thermal properties of clay make it perfect for dishes that benefit from gentle, sustained heat like slow-cooked stews, traditional porridges, and ceremonial foods. Many professional chefs prefer clay cookware for its ability to create authentic flavors and textures that define traditional cuisine.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Caring for Your Clay Cooking Pots</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Proper care ensures your clay cooking pots will serve you for generations. Before first use, soak the pot in clean water for 2-3 hours, then season it by cooking rice or milk to create a natural non-stick surface. Clean with warm water and a soft brush - avoid soap which can be absorbed by the porous clay.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Allow the pot to cool gradually after cooking and dry completely before storage. With proper care, clay pots develop a natural patina that improves their cooking performance over time. Store in a well-ventilated area and handle with care to prevent thermal shock from rapid temperature changes.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Choose Clayfable</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our cooking pots are handcrafted from carefully selected, food-grade clay by master potters who have inherited their skills through generations. Each piece is fired at optimal temperatures to ensure durability while maintaining the porous properties essential for superior cooking performance.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer a complete range from small individual serving pots to large family-size vessels, each designed for specific cooking needs. Our commitment to quality ensures that every pot meets strict standards for food safety, durability, and cooking performance.
              </p>

            </div>
          </div>
        </div>
      </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">50,000+ Happy Cooks</h3>
                <p className="text-gray-600">Trusted by home chefs and professionals across India</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assured</h3>
                <p className="text-gray-600">Food-grade clay tested for safety and cooking performance</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Safe Delivery</h3>
                <p className="text-gray-600">Secure packaging ensures your pots arrive in perfect condition</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}