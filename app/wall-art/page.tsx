"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Palette, Frame, Sparkles, Home, Award, Users, Shield, Truck, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"

export default function WallArtPage() {
  const [selectedStyle, setSelectedStyle] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [realProducts, setRealProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    fetchRealProducts()
  }, [])

  const fetchRealProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const supabase = createClient()

      const { data: products, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          price,
          compare_price,
          images,
          is_active,
          is_featured,
          inventory_quantity,
          created_at,
          tags
        `)
        .eq('is_active', true)
        .or('tags.like.%wall%,tags.like.%art%,tags.like.%decorative%')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      const transformedProducts = products?.map((product) => ({
        id: `db-${product.id}`,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.compare_price || product.price * 1.2,
        image: product.images && product.images.length > 0 ? product.images[0] : "/products/mandala-panel.jpg",
        style: "traditional",
        size: "Large",
        rating: 4.5 + (Math.random() * 0.5),
        reviews: Math.floor(Math.random() * 200) + 50,
        badge: product.is_featured ? "Featured" : "New Arrival",
        features: ["Hand-carved details", "Traditional motifs", "Weather resistant", "Easy mounting"],
        description: product.description || `Beautiful ${product.name} showcasing traditional craftsmanship`,
        inStock: (product.inventory_quantity || 0) > 0
      })) || []

      setRealProducts(transformedProducts)
    } catch (error) {
      console.error('Error in fetchRealProducts:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const staticWallArtProducts = [
    {
      id: 1,
      name: "Traditional Mandala Wall Panel - Heritage Collection",
      price: 4999,
      originalPrice: 6499,
      image: "/products/mandala-panel.jpg",
      style: "traditional",
      size: "Large",
      rating: 4.9,
      reviews: 187,
      badge: "Best Seller",
      features: ["Hand-carved details", "Traditional motifs", "Weather resistant", "Easy mounting"],
      description: "Intricate mandala design showcasing traditional Indian craftsmanship and spiritual symbolism"
    },
    {
      id: 2,
      name: "Contemporary Abstract Relief - Modern Art",
      price: 3499,
      originalPrice: 4299,
      image: "/products/abstract-relief.jpg",
      style: "contemporary",
      size: "Medium",
      rating: 4.7,
      reviews: 124,
      badge: "Modern Design",
      features: ["Abstract design", "Textured surface", "Museum quality", "Artist signed"],
      description: "Modern interpretation of clay art with bold geometric patterns and contemporary appeal"
    },
    {
      id: 3,
      name: "Ganesha Wall Sculpture - Spiritual Collection",
      price: 2799,
      originalPrice: 3599,
      image: "/products/ganesha-wall-sculpture.jpg",
      style: "spiritual",
      size: "Medium",
      rating: 4.9,
      reviews: 298,
      badge: "Spiritual",
      features: ["Religious motif", "Hand-painted details", "Blessed by artisan", "Gift packaging"],
      description: "Beautiful Ganesha sculpture bringing blessings and positive energy to your home"
    },
    {
      id: 4,
      name: "Peacock Feather Wall Art - Nature Series",
      price: 3999,
      originalPrice: 4999,
      image: "/products/peacock-feather-art.jpg",
      style: "nature",
      size: "Large",
      rating: 4.8,
      reviews: 156,
      badge: "Nature Inspired",
      features: ["Natural motifs", "Vibrant colors", "Handcrafted details", "Eco-friendly"],
      description: "Stunning peacock feather design celebrating the beauty of Indian national bird"
    },
    {
      id: 5,
      name: "Village Life Terracotta Mural - Rural Heritage",
      price: 5999,
      originalPrice: 7499,
      image: "/products/village-life-mural.jpg",
      style: "traditional",
      size: "Extra Large",
      rating: 4.9,
      reviews: 89,
      badge: "Heritage",
      features: ["Storytelling art", "Multiple panels", "Cultural significance", "Handcrafted"],
      description: "Multi-panel mural depicting traditional Indian village life with incredible detail"
    },
    {
      id: 6,
      name: "Minimalist Geometric Wall Tile Set - Modern Collection",
      price: 2299,
      originalPrice: 2899,
      image: "/products/geometric-tiles.jpg",
      style: "contemporary",
      size: "Small",
      rating: 4.6,
      reviews: 167,
      badge: "Set of 6",
      features: ["Geometric patterns", "Modular design", "Mix and match", "Contemporary style"],
      description: "Set of six geometric tiles that can be arranged in various patterns for modern walls"
    }
  ]

  const styleOptions = [
    { value: "all", label: "All Styles" },
    { value: "traditional", label: "Traditional" },
    { value: "contemporary", label: "Contemporary" },
    { value: "spiritual", label: "Spiritual" },
    { value: "nature", label: "Nature Inspired" }
  ]

  const sizeOptions = [
    { value: "all", label: "All Sizes" },
    { value: "Small", label: "Small" },
    { value: "Medium", label: "Medium" },
    { value: "Large", label: "Large" },
    { value: "Extra Large", label: "Extra Large" }
  ]

  // Use only real products from database
  const allProducts = realProducts

  const filteredProducts = selectedStyle === "all"
    ? allProducts
    : allProducts.filter(product => product.style === selectedStyle)

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-rose-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-pink-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-rose-100 text-rose-800 border-rose-200 text-sm px-4 py-2">
                Wall Art Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Terracotta <span className="text-rose-600">Wall Art</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Transform your walls into galleries of cultural heritage with our handcrafted terracotta wall art.
                From traditional motifs to contemporary designs, each piece tells a unique story through clay.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-lg px-8 py-3">
                  Explore Wall Art
                </Button>
                <Button size="lg" variant="outline" className="border-rose-200 hover:bg-rose-50 text-lg px-8 py-3">
                  Installation Guide
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
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Palette className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Artistic Heritage</h3>
                <p className="text-gray-600">Each piece celebrates India's rich artistic traditions and cultural stories</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Frame className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gallery Quality</h3>
                <p className="text-gray-600">Museum-quality craftsmanship suitable for homes and galleries</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Home className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Interior Design</h3>
                <p className="text-gray-600">Perfect statement pieces that elevate any interior space</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Durable Art</h3>
                <p className="text-gray-600">Weather-resistant pieces suitable for indoor and outdoor display</p>
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
                <Card className="border-rose-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-rose-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Art Style</label>
                        <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                          <SelectTrigger className="border-rose-100 focus:border-rose-300">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            {styleOptions.map(option => (
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
                          <SelectTrigger className="border-rose-100 focus:border-rose-300">
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
                          <SelectTrigger className="border-rose-100 focus:border-rose-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-3000">Under ₹3,000</SelectItem>
                            <SelectItem value="3000-5000">₹3,000 - ₹5,000</SelectItem>
                            <SelectItem value="above-5000">Above ₹5,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-rose-200 text-rose-600 mr-2" />
                            <span className="text-sm text-gray-600">Hand-carved</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-rose-200 text-rose-600 mr-2" />
                            <span className="text-sm text-gray-600">Hand-painted</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-rose-200 text-rose-600 mr-2" />
                            <span className="text-sm text-gray-600">Weather Resistant</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-rose-200 text-rose-600 mr-2" />
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
                    <h2 className="text-2xl font-bold text-gray-900">Wall Art Collection</h2>
                    <p className="text-gray-600">{filteredProducts.length} artworks available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-rose-100 focus:border-rose-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="size">By Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`}>
                      <Card className="group border-rose-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <div className="w-full h-64 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                            <Frame className="h-16 w-16 text-rose-400" />
                          </div>
                          {product.badge && (
                            <Badge className="absolute top-3 left-3 bg-rose-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-rose-600">
                            {product.size}
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
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">
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
                            <span className="text-xl font-bold text-rose-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-rose-600 hover:bg-rose-700" disabled={!product.inStock}>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Button variant="outline" size="sm" className="border-rose-200 hover:bg-rose-50">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      </Card>
                    </Link>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Heritage of Terracotta Wall Art</h2>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="text-xl mb-6">
                  Terracotta wall art represents one of humanity's oldest forms of architectural decoration and artistic expression. At Clayfable, we continue this ancient tradition by creating stunning wall pieces that transform living spaces into galleries of cultural heritage, bringing the warmth, texture, and storytelling power of clay art into modern homes.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Traditional Motifs and Cultural Stories</h3>
                <p className="mb-4">
                  Our traditional wall art collection celebrates India's rich iconographic heritage through carefully crafted reliefs and sculptures. Each piece tells stories passed down through generations - from intricate mandala designs that represent cosmic harmony to depictions of village life that preserve cultural memory. These works serve as windows into India's spiritual and social traditions, making them not just decorative pieces but cultural artifacts.
                </p>
                <p className="mb-4">
                  The craftsmanship involved in creating traditional terracotta wall art requires years of training and deep cultural understanding. Our artisans study classical texts and traditional patterns, ensuring that each motif is historically accurate and spiritually meaningful. Hand-carved details and traditional painting techniques using natural pigments bring these ancient stories to life with remarkable authenticity and beauty.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contemporary Interpretations</h3>
                <p className="mb-4">
                  While honoring traditional techniques, our contemporary wall art collection explores modern themes and abstract expressions through the timeless medium of clay. These pieces demonstrate that terracotta is not bound to the past but can be a dynamic medium for contemporary artistic expression. Geometric patterns, abstract forms, and minimalist designs showcase the versatility of clay in modern interior design.
                </p>
                <p className="mb-4">
                  Contemporary terracotta wall art offers unique advantages in modern spaces. The natural texture and warm tones of clay provide a organic contrast to clean architectural lines and synthetic materials. These pieces add depth and visual interest while maintaining the environmental benefits and authentic character that only natural clay can provide.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Spiritual and Religious Art</h3>
                <p className="mb-4">
                  Our spiritual wall art collection includes representations of deities, sacred symbols, and religious narratives that bring divine presence into homes and sacred spaces. These pieces are created with reverence and attention to traditional iconographic requirements, ensuring they are appropriate for worship and meditation while serving as beautiful focal points.
                </p>
                <p className="mb-4">
                  Each spiritual piece is blessed during the creation process, and many are created during auspicious times according to traditional practices. The natural clay is believed to enhance the spiritual energy of religious imagery, making these pieces particularly meaningful for devotional spaces and meditation areas.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Nature-Inspired Designs</h3>
                <p className="mb-4">
                  Drawing inspiration from India's rich natural heritage, our nature-themed wall art celebrates the country's diverse flora and fauna. Peacock feathers, lotus blooms, tree of life motifs, and landscape scenes bring the beauty of the outdoors inside. These pieces are particularly popular for creating serene, harmonious environments that connect inhabitants with nature.
                </p>
                <p className="mb-4">
                  The organic nature of clay makes it the perfect medium for representing natural forms. The subtle color variations and textural qualities achievable in terracotta closely mimic the complexity and beauty found in natural objects, creating wall art that feels alive and dynamic rather than static and artificial.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Installation and Display Considerations</h3>
                <p className="mb-4">
                  Proper installation is crucial for both safety and aesthetic impact of terracotta wall art. Each piece comes with appropriate mounting hardware designed for its weight and size. Wall anchors and brackets are selected based on wall type and artwork dimensions to ensure secure, long-lasting installation that showcases the piece to its best advantage.
                </p>
                <p className="mb-4">
                  Lighting plays a crucial role in displaying terracotta wall art effectively. The three-dimensional quality of relief work creates fascinating play of light and shadow that changes throughout the day. Strategic placement near windows or targeted lighting can dramatically enhance the visual impact and bring out subtle details in the carving and painting.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Weather Resistance and Durability</h3>
                <p className="mb-4">
                  Many pieces in our wall art collection are suitable for outdoor installation, bringing artistic beauty to gardens, patios, and architectural facades. Special firing techniques and protective treatments ensure these pieces can withstand weather exposure while maintaining their artistic integrity. The natural aging process of outdoor terracotta often enhances rather than diminishes the beauty of these pieces.
                </p>
                <p className="mb-4">
                  Indoor pieces are designed for long-term display with minimal maintenance requirements. The stable nature of properly fired terracotta means these artworks will maintain their beauty for generations, often becoming more valuable and meaningful as family heirlooms passed down through time.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Customization and Commissioning</h3>
                <p className="mb-4">
                  For those seeking truly unique wall art, we offer custom commissioning services where our master artisans create one-of-a-kind pieces based on your specifications, space requirements, and artistic preferences. This process involves detailed consultation to ensure the final piece perfectly complements your space while maintaining the artistic integrity that makes terracotta wall art so compelling.
                </p>
                <p className="mb-4">
                  Custom pieces can incorporate personal symbols, family crests, architectural elements, or entirely original designs while utilizing traditional terracotta techniques. This service allows for the creation of truly personalized art that reflects individual taste while celebrating the timeless beauty of handcrafted clay art.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Investment in Authentic Art</h3>
                <p className="mb-4">
                  Terracotta wall art represents an investment in authentic, handcrafted artistry that mass-produced decorative items cannot match. Each piece carries the mark of human hands and the wisdom of traditional techniques, making it a valuable addition to any art collection. The durability and timeless appeal of terracotta ensure these pieces maintain and often increase their value over time.
                </p>
                <p className="mb-4">
                  By choosing handcrafted terracotta wall art, you're not just decorating your space – you're preserving traditional crafts, supporting skilled artisans, and bringing authentic cultural heritage into your daily environment. These pieces serve as daily reminders of the beauty that emerges when human creativity meets natural materials through time-honored techniques.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">1,500+ Art Collectors</h3>
                <p className="text-gray-600">Trusted by art enthusiasts and interior designers across India</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Master Artisans</h3>
                <p className="text-gray-600">Created by award-winning artists with generations of expertise</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gallery-Grade Packaging</h3>
                <p className="text-gray-600">Museum-quality protection ensures artwork arrives in pristine condition</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}