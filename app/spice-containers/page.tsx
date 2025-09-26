"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Archive, Leaf, Shield, Award, Users, CheckCircle, Truck, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"

export default function SpiceContainersPage() {
  const [selectedType, setSelectedType] = useState("all")
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
        .or('tags.like.%spice%,tags.like.%container%,tags.like.%jar%,tags.like.%storage%')
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
        image: product.images && product.images.length > 0 ? product.images[0] : "/products/spice-containers.jpg",
        type: "jar",
        capacity: "250ml",
        rating: 4.5 + (Math.random() * 0.5),
        reviews: Math.floor(Math.random() * 200) + 50,
        badge: product.is_featured ? "Featured" : "New Arrival",
        features: ["Airtight seal", "Natural preservation", "Moisture control", "Traditional design"],
        description: product.description || `Traditional ${product.name} for keeping spices fresh and flavorful`,
        inStock: (product.inventory_quantity || 0) > 0
      })) || []

      setRealProducts(transformedProducts)
    } catch (error) {
      console.error('Error in fetchRealProducts:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const staticSpiceContainerProducts = [
    {
      id: 1,
      name: "Traditional Spice Jar Set - 12 Containers",
      price: 2299,
      originalPrice: 2799,
      image: "/products/spice-containers.jpg",
      type: "set",
      capacity: "Set of 12",
      rating: 4.8,
      reviews: 312,
      badge: "Best Value",
      features: ["Airtight seal", "Natural preservation", "Moisture control", "Traditional design"],
      description: "Complete set of 12 traditional clay spice containers with tight-fitting lids to keep spices fresh"
    },
    {
      id: 2,
      name: "Large Masala Storage Pot - 1Kg Capacity",
      price: 899,
      originalPrice: 1199,
      image: "/products/large-spice-pot.jpg",
      type: "pot",
      capacity: "1 Kg",
      rating: 4.7,
      reviews: 198,
      badge: "Large Size",
      features: ["Large capacity", "Tight lid", "Moisture resistant", "Easy access"],
      description: "Large traditional pot perfect for storing bulk spices, rice, or lentils with excellent preservation"
    },
    {
      id: 3,
      name: "Spice Rack with 8 Clay Jars",
      price: 1899,
      originalPrice: 2399,
      image: "/products/spice-rack-clay.jpg",
      type: "rack",
      capacity: "8 jars + rack",
      rating: 4.9,
      reviews: 245,
      badge: "Organized",
      features: ["Wooden rack", "8 clay jars", "Space efficient", "Kitchen organization"],
      description: "Beautiful wooden rack with 8 traditional clay spice jars for organized and accessible spice storage"
    }
  ]

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "jar", label: "Individual Jars" },
    { value: "set", label: "Jar Sets" },
    { value: "pot", label: "Storage Pots" },
    { value: "rack", label: "Spice Racks" }
  ]

  // Use only real products from database
  const allProducts = realProducts

  const filteredProducts = selectedType === "all"
    ? allProducts
    : allProducts.filter(product => product.type === selectedType)

  return (
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
                Spice Containers Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Traditional <span className="text-green-600">Spice Containers</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Keep your spices fresh and flavorful with our traditional clay storage containers.
                Natural preservation, moisture control, and authentic taste enhancement for your kitchen essentials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                  <Archive className="h-5 w-5 mr-2" />
                  Shop Spice Containers
                </Button>
                <Button size="lg" variant="outline" className="border-green-200 hover:bg-green-50 text-lg px-8 py-3">
                  Storage Guide
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
                  <Archive className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Preservation</h3>
                <p className="text-gray-600">Clay naturally regulates humidity to keep spices fresh longer</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Leaf className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Flavor Enhancement</h3>
                <p className="text-gray-600">Porous clay allows spices to breathe while maintaining potency</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Moisture Control</h3>
                <p className="text-gray-600">Prevents moisture damage and maintains spice quality</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Traditional Design</h3>
                <p className="text-gray-600">Authentic pottery craftsmanship meets modern functionality</p>
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
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Type</label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger className="border-green-100 focus:border-green-300">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeOptions.map(option => (
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
                            <SelectItem value="under-1000">Under ₹1,000</SelectItem>
                            <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                            <SelectItem value="2000-3000">₹2,000 - ₹3,000</SelectItem>
                            <SelectItem value="above-3000">Above ₹3,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-green-200 text-green-600 mr-2" />
                            <span className="text-sm text-gray-600">Airtight Lid</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-green-200 text-green-600 mr-2" />
                            <span className="text-sm text-gray-600">Set of Multiple</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-green-200 text-green-600 mr-2" />
                            <span className="text-sm text-gray-600">Large Capacity</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Spice Containers</h2>
                    <p className="text-gray-600">{filteredProducts.length} storage solutions available</p>
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
                  {filteredProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`}>
                      <Card className="group border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <div className="w-full h-64 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                            <Archive className="h-16 w-16 text-green-400" />
                          </div>
                          {product.badge && (
                            <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-green-600">
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
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
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
                            <span className="text-xl font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700" disabled={!product.inStock}>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
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

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">35,000+ Home Cooks</h3>
                <p className="text-gray-600">Trusted for keeping spices fresh in Indian kitchens</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Preservation</h3>
                <p className="text-gray-600">Chemical-free storage that maintains spice quality naturally</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Packaging</h3>
                <p className="text-gray-600">Careful packaging to prevent breakage during shipping</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}