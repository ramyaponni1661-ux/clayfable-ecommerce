"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Palette, Home, Flower2, Sparkles, Award, Users, Shield, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { createClient } from '@/lib/supabase/client'

export default function DecorativePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [decorativeProducts, setDecorativeProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch decorative products from database
  useEffect(() => {
    const fetchDecorativeProducts = async () => {
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
          .or('product_tags.cs.{"decorative"}', 'product_tags.cs.{"decor"}', 'product_tags.cs.{"art"}', 'product_tags.cs.{"sculpture"}')
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          console.error('Error fetching decorative products:', error)
        } else {
          const transformedProducts = products?.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.compare_price || Math.floor(product.price * 1.2),
            image: product.images ? JSON.parse(product.images)?.[0] || "/placeholder.svg" : "/placeholder.svg",
            category: "decorative",
            rating: 4.5 + Math.random() * 0.4,
            reviews: Math.floor(Math.random() * 300) + 50,
            badge: product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? "New" : "Best Seller",
            features: ["Hand-crafted", "Natural clay", "Artistic design", "Home decor"],
            description: product.description || "Beautiful decorative piece crafted from natural terracotta"
          })) || []

          setDecorativeProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDecorativeProducts()
  }, [])

  const staticDecorativeProducts = [
    {
      id: 1,
      name: "Handcrafted Terracotta Vase - Classic Elegance",
      price: 2499,
      originalPrice: 3199,
      image: "/products/vase-classic.jpg",
      category: "vases",
      rating: 4.9,
      reviews: 248,
      badge: "Best Seller",
      features: ["Hand-thrown pottery", "Natural clay finish", "Drainage holes", "Food-safe glazing"],
      description: "Elegant handcrafted vase perfect for fresh flowers and dried arrangements"
    },
    {
      id: 2,
      name: "Traditional Wall Art Panel - Heritage Design",
      price: 4999,
      originalPrice: 6499,
      image: "/products/wall-art-heritage.jpg",
      category: "wall-art",
      rating: 4.8,
      reviews: 156,
      badge: "Artisan Choice",
      features: ["Hand-carved details", "Natural pigments", "Weather resistant", "Easy mounting"],
      description: "Stunning wall art showcasing traditional Indian motifs and craftsmanship"
    },
    {
      id: 3,
      name: "Garden Planter Set - Rustic Collection",
      price: 3799,
      originalPrice: 4999,
      image: "/products/garden-planter-set.jpg",
      category: "planters",
      rating: 4.7,
      reviews: 189,
      badge: "Eco-Friendly",
      features: ["Set of 3 planters", "Drainage system", "UV resistant", "Lightweight design"],
      description: "Beautiful set of planters perfect for herbs, flowers, and small plants"
    },
    {
      id: 4,
      name: "Decorative Figurine - Dancing Ganesha",
      price: 1899,
      originalPrice: 2499,
      image: "/products/figurine-ganesha.jpg",
      category: "figurines",
      rating: 4.9,
      reviews: 312,
      badge: "Spiritual",
      features: ["Hand-painted details", "Premium terracotta", "Auspicious design", "Gift packaging"],
      description: "Beautifully crafted Ganesha figurine bringing blessings to your home"
    },
    {
      id: 5,
      name: "Modern Geometric Vase - Contemporary Style",
      price: 3299,
      originalPrice: 4199,
      image: "/products/vase-modern.jpg",
      category: "vases",
      rating: 4.6,
      reviews: 124,
      badge: "New Arrival",
      features: ["Modern design", "Matte finish", "Large capacity", "Stable base"],
      description: "Contemporary geometric vase adding modern elegance to any space"
    },
    {
      id: 6,
      name: "Outdoor Garden Sculpture - Nature's Harmony",
      price: 6999,
      originalPrice: 8999,
      image: "/products/garden-sculpture.jpg",
      category: "garden-decor",
      rating: 4.8,
      reviews: 95,
      badge: "Premium",
      features: ["Weather resistant", "Artistic design", "Durable construction", "Natural aging"],
      description: "Stunning outdoor sculpture that harmonizes beautifully with garden landscapes"
    }
  ]

  const categories = [
    { value: "all", label: "All Decorative Items" },
    { value: "vases", label: "Vases & Planters" },
    { value: "wall-art", label: "Wall Art" },
    { value: "planters", label: "Garden Decor" },
    { value: "figurines", label: "Figurines" }
  ]

  // Use only database products
  const allProducts = decorativeProducts

  const filteredProducts = selectedCategory === "all"
    ? allProducts
    : allProducts.filter(product => product.category === selectedCategory)

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
                Decorative Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Decorative <span className="text-orange-600">Terracotta</span> Art
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Transform your space with our exquisite collection of handcrafted decorative terracotta pieces.
                From elegant vases to stunning wall art, each piece tells a story of traditional artistry and modern design.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3">
                  Explore Collection
                </Button>
                <Button size="lg" variant="outline" className="border-orange-200 hover:bg-orange-50 text-lg px-8 py-3">
                  View Catalog
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
                  <Palette className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Artistic Excellence</h3>
                <p className="text-gray-600">Hand-crafted pieces showcasing traditional artistry and contemporary design</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Home className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Home Decor</h3>
                <p className="text-gray-600">Perfect accent pieces that elevate any room's aesthetic appeal</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Flower2 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Beauty</h3>
                <p className="text-gray-600">Eco-friendly terracotta celebrating nature's inherent beauty</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600">Each piece is carefully inspected for superior quality and durability</p>
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
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="border-orange-100 focus:border-orange-300">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
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
                            <SelectItem value="under-2000">Under ₹2,000</SelectItem>
                            <SelectItem value="2000-5000">₹2,000 - ₹5,000</SelectItem>
                            <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                            <SelectItem value="above-10000">Above ₹10,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-orange-200 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">Handcrafted</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-orange-200 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">Weather Resistant</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-orange-200 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">Gift Packaging</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Decorative Collection</h2>
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
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                            <Sparkles className="h-16 w-16 text-orange-400" />
                          </div>
                          {product.badge && (
                            <Badge className="absolute top-3 left-3 bg-orange-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
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
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-orange-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Art of Decorative Terracotta</h2>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="text-xl mb-6">
                  Decorative terracotta has been an integral part of Indian artistic heritage for millennia. At Clayfable, we continue this rich tradition by creating stunning decorative pieces that seamlessly blend timeless craftsmanship with contemporary aesthetics, bringing the warmth and beauty of handcrafted clay art into modern homes.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Exquisite Vases & Planters</h3>
                <p className="mb-4">
                  Our vase collection represents the perfect marriage of form and function. Each piece is hand-thrown on the potter's wheel by skilled artisans who have inherited their craft through generations. From classical urns that evoke ancient Greek pottery to modern geometric designs that complement contemporary interiors, our vases serve as stunning focal points for any room.
                </p>
                <p className="mb-4">
                  The planters in our collection are designed not just as containers, but as artistic statements. Whether you're creating an indoor herb garden, showcasing succulents, or displaying seasonal flowers, our terracotta planters provide the perfect environment for plant growth while adding rustic elegance to your space.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Traditional Wall Art & Sculptures</h3>
                <p className="mb-4">
                  Our wall art collection celebrates India's rich artistic traditions through hand-carved terracotta panels and relief sculptures. Each piece tells a story - from ancient myths and legends depicted in intricate detail to abstract interpretations of natural forms. The warm, earthy tones of terracotta create depth and texture that photographs and prints simply cannot match.
                </p>
                <p className="mb-4">
                  The three-dimensional quality of terracotta wall art creates fascinating play of light and shadow throughout the day, making your walls come alive with movement and visual interest. These pieces serve as conversation starters and cultural bridges, connecting modern homes with ancient artistic traditions.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Spiritual & Cultural Figurines</h3>
                <p className="mb-4">
                  Our figurine collection spans from traditional deities like Ganesha and Buddha to contemporary abstract forms. Each piece is carefully crafted to capture not just the physical form but the spiritual essence of the subject. The hand-painted details, applied using natural pigments, bring these figures to life with vibrant colors that age gracefully over time.
                </p>
                <p className="mb-4">
                  These figurines serve multiple purposes - as objects of worship, meditation aids, decorative accents, or meaningful gifts. The porous nature of terracotta allows these pieces to develop a unique patina over time, making each figurine more beautiful and personal with age.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Garden Decor & Outdoor Art</h3>
                <p className="mb-4">
                  Terracotta's natural weather resistance makes it ideal for outdoor decoration. Our garden decor collection includes large sculptural pieces, decorative urns, water features, and architectural elements that transform ordinary gardens into artistic sanctuaries. The natural clay harmonizes beautifully with plants and flowers, creating cohesive outdoor spaces.
                </p>
                <p className="mb-4">
                  Weather and time only enhance the beauty of outdoor terracotta pieces. The natural aging process creates moss growth and color variations that add character and authenticity to garden sculptures. Unlike synthetic materials, terracotta becomes more beautiful with age, developing a natural patina that speaks of time and seasons passed.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Clayfable Difference</h3>
                <p className="mb-4">
                  What sets Clayfable's decorative pieces apart is our commitment to authentic craftsmanship combined with contemporary design sensibility. Each piece in our collection is:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Handcrafted by master artisans with decades of experience</li>
                  <li>Made from high-quality clay sourced from traditional pottery regions</li>
                  <li>Fired using traditional methods that ensure durability and longevity</li>
                  <li>Finished with food-safe, eco-friendly glazes where applicable</li>
                  <li>Quality-checked for structural integrity and aesthetic appeal</li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Caring for Your Decorative Terracotta</h3>
                <p className="mb-4">
                  Proper care ensures that your terracotta decorative pieces remain beautiful for generations. For indoor pieces, regular dusting with a soft brush maintains their appearance. Outdoor pieces benefit from occasional cleaning with mild soap and water. Avoid harsh chemicals or abrasive cleaners that might damage the natural finish.
                </p>
                <p className="mb-4">
                  In areas with harsh winters, we recommend bringing outdoor pieces indoors or covering them to prevent freeze-thaw damage. With proper care, your Clayfable decorative terracotta pieces will develop a beautiful patina over time, becoming more valuable and meaningful as family heirlooms.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sustainable Art for Modern Homes</h3>
                <p className="mb-4">
                  In an age of mass-produced home decor, our handcrafted terracotta pieces offer authenticity and sustainability. Clay is a renewable resource, and our traditional firing methods have minimal environmental impact. By choosing Clayfable decorative pieces, you're supporting traditional artisans and sustainable craftsmanship while bringing unique, meaningful art into your home.
                </p>
                <p className="mb-4">
                  Each piece in our decorative collection is unique, bearing the subtle marks of the human hands that shaped it. This individuality ensures that your home decor is truly one-of-a-kind, reflecting your appreciation for authentic craftsmanship and artistic heritage.
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">50,000+ Happy Customers</h3>
                <p className="text-gray-600">Trusted by families across India for quality decorative pottery</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Guaranteed</h3>
                <p className="text-gray-600">Every piece inspected for perfect craftsmanship and durability</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Safe Delivery</h3>
                <p className="text-gray-600">Special packaging ensures your decorative pieces arrive perfect</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}