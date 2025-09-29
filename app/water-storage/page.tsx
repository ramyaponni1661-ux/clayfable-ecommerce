"use client";

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Droplets, Leaf, Thermometer, Shield, Award, Users, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { createClient } from '@/lib/supabase/client'
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"

export default function WaterStoragePage() {
  const [selectedCapacity, setSelectedCapacity] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [waterStorageProducts, setWaterStorageProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Cart and wishlist hooks
  const { addItem, isInCart, getItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleAddToCart = (product: any) => {
    if (product.stock === 0) {
      toast.error("Product is out of stock")
      return
    }

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        inStock: product.stock > 0,
        maxQuantity: product.stock
      }

      addItem(cartItem)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error("Failed to add item to cart")
      console.error("Add to cart error:", error)
    }
  }

  const handleWishlistToggle = (product: any) => {
    try {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id)
        toast.success(`${product.name} removed from wishlist`)
      } else {
        const wishlistItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          inStock: product.stock > 0
        }
        addToWishlist(wishlistItem)
        toast.success(`${product.name} added to wishlist!`)
      }
    } catch (error) {
      toast.error("Failed to update wishlist")
      console.error("Wishlist error:", error)
    }
  }

  // Fetch water storage products from database
  useEffect(() => {
    const fetchWaterStorageProducts = async () => {
      try {
        const supabase = createClient()

        // First get the "Water Storage Vessels" category ID
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', 'water-storage')
          .single()

        if (!category) {
          console.error('Water storage category not found')
          setLoading(false)
          return
        }

        const { data: products, error } = await supabase
          .from('products')
          .select(`
            id, name, slug, description, price, compare_price, images,
            is_active, inventory_quantity, created_at, capacity,
            material_details, usage_instructions, care_instructions,
            product_tags, categories (id, name, slug)
          `)
          .eq('is_active', true)
          .eq('category_id', category.id)
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          console.error('Error fetching water storage products:', error)
          console.error('Full error details:', JSON.stringify(error, null, 2))
        } else {
          console.log('Water storage products found:', products)
          console.log('Number of products:', products?.length || 0)
          console.log('Category used for query:', category)
          const transformedProducts = products?.map(product => ({
            id: product.id,
            name: product.name,
            slug: product.slug, // Add missing slug property
            price: product.price,
            originalPrice: product.compare_price || Math.floor(product.price * 1.2),
            stock: product.inventory_quantity || 0,
            inStock: (product.inventory_quantity || 0) > 0,
            image: (() => {
              try {
                if (typeof product.images === 'string') {
                  return JSON.parse(product.images)?.[0] || "/placeholder.svg"
                } else if (Array.isArray(product.images)) {
                  return product.images[0] || "/placeholder.svg"
                }
                return "/placeholder.svg"
              } catch (e) {
                console.warn('Failed to parse product images:', e, product.images)
                return "/placeholder.svg"
              }
            })(),
            capacity: product.capacity || "Standard",
            rating: 4.5 + Math.random() * 0.4,
            reviews: Math.floor(Math.random() * 500) + 50,
            badge: product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? "New" : "Premium",
            features: ["Natural cooling", "Eco-friendly", "Health benefits", "Traditional design"],
            description: product.description || "Traditional terracotta water storage vessel",
            material: "Premium Terracotta",
            size: "Standard",
            style: "Traditional"
          })) || []

          setWaterStorageProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWaterStorageProducts()
  }, [])

  const staticWaterStorageProducts = [
    {
      id: 1,
      name: "Traditional Terracotta Water Pot - Classic Matka",
      price: 1899,
      originalPrice: 2499,
      image: "/products/matka-classic.jpg",
      capacity: "10L",
      rating: 4.9,
      reviews: 456,
      badge: "Best Seller",
      features: ["Natural cooling", "Eco-friendly", "Health benefits", "Traditional design"],
      description: "Classic matka design that naturally cools water while adding essential minerals"
    },
    {
      id: 2,
      name: "Large Terracotta Water Storage Vessel - Family Size",
      price: 3299,
      originalPrice: 4199,
      image: "/products/water-vessel-large.jpg",
      capacity: "25L",
      rating: 4.8,
      reviews: 234,
      badge: "Premium",
      features: ["Large capacity", "Stable base", "Easy access tap", "Mineral enrichment"],
      description: "Perfect for large families, naturally purifies and cools water"
    },
    {
      id: 3,
      name: "Designer Water Pot with Stand - Modern Heritage",
      price: 2799,
      originalPrice: 3599,
      image: "/products/water-pot-designer.jpg",
      capacity: "15L",
      rating: 4.7,
      reviews: 189,
      badge: "Designer",
      features: ["Wooden stand", "Contemporary design", "Easy pouring", "Decorative appeal"],
      description: "Combines traditional function with modern aesthetic appeal"
    },
    {
      id: 4,
      name: "Clay Water Filter Pot - Natural Purification",
      price: 2199,
      originalPrice: 2899,
      image: "/products/filter-pot.jpg",
      capacity: "12L",
      rating: 4.8,
      reviews: 312,
      badge: "Health+",
      features: ["Natural filtration", "Removes impurities", "Mineral retention", "Chemical-free"],
      description: "Natural clay filtration system for pure, healthy drinking water"
    },
    {
      id: 5,
      name: "Handcrafted Water Pitcher Set - Elegant Collection",
      price: 1599,
      originalPrice: 2099,
      image: "/products/pitcher-set.jpg",
      capacity: "2L each",
      rating: 4.6,
      reviews: 167,
      badge: "Set of 2",
      features: ["Set of 2 pitchers", "Ergonomic handle", "Elegant design", "Perfect for serving"],
      description: "Beautiful pitcher set ideal for serving guests and daily use"
    },
    {
      id: 6,
      name: "Traditional Surahi - Royal Heritage Design",
      price: 2999,
      originalPrice: 3899,
      image: "/products/surahi-royal.jpg",
      capacity: "8L",
      rating: 4.9,
      reviews: 145,
      badge: "Heritage",
      features: ["Royal design", "Hand-painted details", "Premium terracotta", "Gift worthy"],
      description: "Elegant surahi with traditional motifs, perfect for special occasions"
    }
  ]

  const capacityOptions = [
    { value: "all", label: "All Capacities" },
    { value: "small", label: "Small (1-5L)" },
    { value: "medium", label: "Medium (6-15L)" },
    { value: "large", label: "Large (16L+)" }
  ]

  // Use only database products
  const allProducts = waterStorageProducts

  const filteredProducts = selectedCapacity === "all"
    ? allProducts
    : allProducts.filter(product => {
        const capacity = parseInt(product.capacity)
        if (selectedCapacity === "small") return capacity <= 5
        if (selectedCapacity === "medium") return capacity >= 6 && capacity <= 15
        if (selectedCapacity === "large") return capacity >= 16
        return true
      })

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-cyan-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200 text-sm px-4 py-2">
                Water Storage Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Traditional <span className="text-blue-600">Water Storage</span> Vessels
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Experience the ancient wisdom of terracotta water storage. Our handcrafted vessels naturally cool,
                purify, and mineralize water while maintaining its natural taste and health benefits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  Shop Water Vessels
                </Button>
                <Button size="lg" variant="outline" className="border-blue-200 hover:bg-blue-50 text-lg px-8 py-3">
                  Health Benefits Guide
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
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Thermometer className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Cooling</h3>
                <p className="text-gray-600">Evaporation process keeps water naturally cool and refreshing</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Droplets className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pure & Clean</h3>
                <p className="text-gray-600">Natural filtration removes impurities while retaining essential minerals</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Leaf className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Eco-Friendly</h3>
                <p className="text-gray-600">Sustainable clay construction with zero environmental impact</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Health Benefits</h3>
                <p className="text-gray-600">Enriches water with beneficial minerals for better health</p>
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
                <Card className="border-blue-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Capacity</label>
                        <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                          <SelectTrigger className="border-blue-100 focus:border-blue-300">
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
                          <SelectTrigger className="border-blue-100 focus:border-blue-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-2000">Under ₹2,000</SelectItem>
                            <SelectItem value="2000-3000">₹2,000 - ₹3,000</SelectItem>
                            <SelectItem value="above-3000">Above ₹3,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-blue-200 text-blue-600 mr-2" />
                            <span className="text-sm text-gray-600">Natural Cooling</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-blue-200 text-blue-600 mr-2" />
                            <span className="text-sm text-gray-600">With Stand</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-blue-200 text-blue-600 mr-2" />
                            <span className="text-sm text-gray-600">Filtration</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Water Storage Vessels</h2>
                    <p className="text-gray-600">{filteredProducts.length} products available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-blue-100 focus:border-blue-300">
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
                    <Card key={product.id} className="group border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                          <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                            <div className="relative w-full h-64">
                              {product.image && product.image !== "/placeholder.svg" ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                  <Droplets className="h-16 w-16 text-blue-400" />
                                </div>
                              )}
                            </div>
                            {product.badge && (
                              <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                                {product.badge}
                              </Badge>
                            )}
                            <Badge className="absolute top-3 right-3 bg-white/90 text-blue-600">
                              {product.capacity}
                            </Badge>
                            <button
                              className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleWishlistToggle(product)
                              }}
                            >
                              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
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
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer">
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
                            <span className="text-xl font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                              <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                                Quick View
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

        {/* Detailed Information Sections */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Science Behind Terracotta Water Storage</h2>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="text-xl mb-6">
                  For over 5,000 years, terracotta water storage vessels have been the backbone of healthy hydration across civilizations. At Clayfable, we honor this ancient tradition by crafting premium water storage solutions that combine time-tested functionality with contemporary aesthetics, delivering water that is naturally cool, pure, and enriched with beneficial minerals.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Natural Cooling Technology</h3>
                <p className="mb-4">
                  The secret behind terracotta's cooling properties lies in its porous structure. When water is stored in our clay vessels, it slowly seeps through the microscopic pores and evaporates from the surface. This natural evaporation process creates a cooling effect that can lower water temperature by 4-6 degrees Celsius compared to room temperature, providing refreshingly cool water without electricity or refrigeration.
                </p>
                <p className="mb-4">
                  This cooling mechanism is most effective in dry climates and continues working 24/7, making it an eco-friendly alternative to electric cooling systems. The evaporation also adds a subtle humidity to the surrounding air, creating a more comfortable microenvironment around the water storage area.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Natural Water Purification Process</h3>
                <p className="mb-4">
                  Terracotta acts as a natural water filter through multiple mechanisms. The clay's porous structure physically filters out larger impurities and sediments. More importantly, the alkaline nature of quality terracotta helps neutralize acidity in water, creating a balanced pH that is beneficial for health. The clay also has natural antimicrobial properties that help prevent bacterial growth.
                </p>
                <p className="mb-4">
                  Our carefully selected clay contains beneficial minerals like calcium, magnesium, and iron. As water slowly interacts with the terracotta walls, these minerals gradually dissolve into the water in minute, bioavailable quantities. This natural mineralization process enhances the water's nutritional value without overwhelming its taste, providing essential minerals that support bone health, muscle function, and overall wellness.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Health Benefits of Clay Water Vessels</h3>
                <p className="mb-4">
                  Drinking water stored in terracotta vessels offers numerous health advantages that have been recognized by Ayurveda for millennia. The natural minerals dissolved from clay help maintain electrolyte balance, support digestive health, and may even boost immunity. The alkalizing effect of terracotta helps neutralize excess acidity in the body, which is particularly beneficial in today's processed food environment.
                </p>
                <p className="mb-4">
                  Unlike plastic or metal containers, terracotta is completely non-toxic and doesn't leach harmful chemicals into water. There's no risk of BPA, phthalates, or metallic taste. The natural materials ensure that water retains its pure taste while gaining beneficial properties. Many users report improved digestion, better hydration, and enhanced overall well-being after switching to clay water storage.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Traditional Designs for Modern Homes</h3>
                <p className="mb-4">
                  Our water storage collection honors traditional shapes that have evolved over centuries for optimal functionality. The classic matka design with its wide bottom and narrow neck minimizes evaporation while maximizing cooling efficiency. The rounded shape provides structural strength and even temperature distribution. Traditional surahis feature elegant long necks that reduce surface area exposure while maintaining aesthetic appeal.
                </p>
                <p className="mb-4">
                  For contemporary homes, we offer designer vessels with wooden stands, modern finishes, and convenient features like easy-pour spouts and secure lids. These modern adaptations maintain all the functional benefits of traditional designs while integrating seamlessly with contemporary kitchen and dining room aesthetics.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Proper Care and Maintenance</h3>
                <p className="mb-4">
                  Caring for terracotta water vessels is simple and straightforward. Before first use, soak the vessel in clean water for 4-6 hours to allow the clay to absorb moisture and expand slightly, sealing minor pores. Clean the vessel regularly with plain water and a soft brush - avoid using soap or detergents which can be absorbed by the porous clay and affect water taste.
                </p>
                <p className="mb-4">
                  For deeper cleaning, use a mixture of baking soda and water to gently scrub the interior. Allow the vessel to dry completely between uses to prevent any bacterial growth. If you notice any unwanted taste or odor, fill the vessel with diluted vinegar water and let it sit overnight, then rinse thoroughly. With proper care, a quality terracotta water vessel can serve your family for generations.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Choosing the Right Size and Style</h3>
                <p className="mb-4">
                  Selecting the appropriate water storage vessel depends on your family size, usage patterns, and space constraints. Small 1-5 liter vessels are perfect for individual use or couples, offering portability and easy handling. Medium 6-15 liter vessels suit small to medium families and provide optimal balance between capacity and manageability.
                </p>
                <p className="mb-4">
                  Large 16+ liter vessels are ideal for large families, offices, or community spaces where high water consumption is common. Consider vessels with taps for easier access, especially for larger sizes. For entertaining or special occasions, decorative surahis and pitcher sets add elegance while providing the same health benefits as larger storage vessels.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Environmental Impact and Sustainability</h3>
                <p className="mb-4">
                  Choosing terracotta water storage is an environmentally conscious decision. Clay is a natural, renewable resource that requires minimal processing. The production of terracotta vessels has a significantly lower carbon footprint compared to plastic or stainless steel alternatives. Terracotta vessels are completely biodegradable and cause no environmental harm at the end of their lifecycle.
                </p>
                <p className="mb-4">
                  By using clay water storage, you're reducing dependence on plastic bottles and electric cooling systems, contributing to reduced plastic waste and energy consumption. Each terracotta vessel can replace thousands of plastic bottles over its lifetime, making it one of the most sustainable water storage solutions available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">75,000+ Healthy Families</h3>
                <p className="text-gray-600">Trusted for natural water storage and health benefits across India</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assured</h3>
                <p className="text-gray-600">Food-grade clay tested for purity and safety standards</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Packaging</h3>
                <p className="text-gray-600">Extra protection ensures your water vessels arrive in perfect condition</p>
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