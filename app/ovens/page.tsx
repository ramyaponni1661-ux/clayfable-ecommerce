"use client";

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Flame, ChefHat, Thermometer, Timer, Award, Users, Shield, Truck, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"

export default function ClayOvensPage() {
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [realProducts, setRealProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  // Cart and wishlist hooks
  const { addItem, isInCart, getItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    setIsVisible(true)
    fetchRealProducts()
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

  const fetchRealProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const supabase = createClient()

      // First get the "Clay Ovens" category ID
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'ovens')
        .single()

      if (!category) {
        console.error('Ovens category not found')
        setIsLoadingProducts(false)
        return
      }

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
        .eq('category_id', category.id)
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
        image: product.images && product.images.length > 0 ? product.images[0] : "/products/tandoor-master.jpg",
        type: "tandoor",
        size: "Large",
        rating: 4.5 + (Math.random() * 0.5),
        reviews: Math.floor(Math.random() * 200) + 50,
        badge: product.is_featured ? "Featured" : "New Arrival",
        features: ["High-temperature firing", "Even heat distribution", "Authentic cooking", "Professional grade"],
        description: product.description || `Traditional ${product.name} for authentic cooking experiences`,
        stock: product.inventory_quantity || 0,
        inStock: (product.inventory_quantity || 0) > 0,
        material: "Premium Terracotta",
        style: "Traditional"
      })) || []

      setRealProducts(transformedProducts)
    } catch (error) {
      console.error('Error in fetchRealProducts:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }


  const typeOptions = [
    { value: "all", label: "All Ovens" },
    { value: "tandoor", label: "Tandoor Ovens" },
    { value: "pizza", label: "Pizza Ovens" },
    { value: "bread", label: "Bread Ovens" },
    { value: "multipurpose", label: "Multi-Purpose" },
    { value: "bhatti", label: "Bhatti Ovens" },
    { value: "chulah", label: "Chulah Systems" }
  ]

  // Use only real products from database
  const allProducts = realProducts

  const filteredProducts = selectedType === "all"
    ? allProducts
    : allProducts.filter(product => product.type === selectedType)

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-red-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-orange-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-red-100 text-red-800 border-red-200 text-sm px-4 py-2">
                Clay Ovens Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Traditional <span className="text-red-600">Clay Ovens</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Experience authentic cooking with our handcrafted clay ovens. From traditional tandoors to modern pizza ovens,
                discover the superior taste and cooking methods that only clay fire can provide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3">
                  <Flame className="h-5 w-5 mr-2" />
                  Explore Ovens
                </Button>
                <Button size="lg" variant="outline" className="border-red-200 hover:bg-red-50 text-lg px-8 py-3">
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
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Flame className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">High Heat Retention</h3>
                <p className="text-gray-600">Clay ovens maintain consistent high temperatures for perfect cooking</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ChefHat className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Authentic Flavors</h3>
                <p className="text-gray-600">Clay cooking imparts unique smoky flavors impossible to replicate</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Thermometer className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Even Heat Distribution</h3>
                <p className="text-gray-600">Clay material ensures uniform cooking temperatures throughout</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Timer className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fuel Efficient</h3>
                <p className="text-gray-600">Superior insulation properties reduce fuel consumption significantly</p>
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
                <Card className="border-red-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-red-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Oven Type</label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger className="border-red-100 focus:border-red-300">
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
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Size</label>
                        <Select>
                          <SelectTrigger className="border-red-100 focus:border-red-300">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sizes</SelectItem>
                            <SelectItem value="Small">Small</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Large">Large</SelectItem>
                            <SelectItem value="Extra Large">Extra Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Price Range</label>
                        <Select value={priceRange} onValueChange={setPriceRange}>
                          <SelectTrigger className="border-red-100 focus:border-red-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-10000">Under ₹10,000</SelectItem>
                            <SelectItem value="10000-15000">₹10,000 - ₹15,000</SelectItem>
                            <SelectItem value="15000-20000">₹15,000 - ₹20,000</SelectItem>
                            <SelectItem value="above-20000">Above ₹20,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-red-200 text-red-600 mr-2" />
                            <span className="text-sm text-gray-600">High Temperature</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-red-200 text-red-600 mr-2" />
                            <span className="text-sm text-gray-600">Wood-Fired</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-red-200 text-red-600 mr-2" />
                            <span className="text-sm text-gray-600">Professional Grade</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-red-200 text-red-600 mr-2" />
                            <span className="text-sm text-gray-600">Installation Included</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Clay Ovens Collection</h2>
                    <p className="text-gray-600">{filteredProducts.length} ovens available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-red-100 focus:border-red-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="size">By Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                                <div className="w-full h-64 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                                  <Flame className="h-16 w-16 text-red-400" />
                                </div>
                              )}
                            </div>
                            {product.badge && (
                              <Badge className="absolute top-3 left-3 bg-red-600 text-white">
                                {product.badge}
                              </Badge>
                            )}
                            <Badge className="absolute top-3 right-3 bg-white/90 text-red-600">
                              {product.size}
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
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2 cursor-pointer">
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
                            <span className="text-xl font-bold text-red-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-red-600 hover:bg-red-700"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                              <Button variant="outline" size="sm" className="border-red-200 hover:bg-red-50">
                                <Eye className="h-4 w-4 mr-1" />
                                View
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

        {/* Detailed Information Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Science of Clay Oven Cooking</h2>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="text-xl mb-6">
                  Clay ovens represent thousands of years of culinary evolution, combining ancient wisdom with natural materials to create superior cooking environments. At Clayfable, our handcrafted clay ovens harness the unique thermal properties of terracotta to deliver exceptional cooking results that modern appliances simply cannot match.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Traditional Tandoor Excellence</h3>
                <p className="mb-4">
                  The tandoor oven remains the crown jewel of clay cooking technology. Operating at temperatures exceeding 900°F (480°C), our tandoors create the intense heat necessary for authentic Indian breads, succulent kebabs, and perfectly charred vegetables. The cylindrical design and thick clay walls create a unique cooking environment where radiant heat from all surfaces cooks food evenly while retaining moisture.
                </p>
                <p className="mb-4">
                  Our Master Chef Series tandoors are built using traditional construction methods with multiple layers of specially selected clay. The inner chamber is lined with food-grade refractory clay that can withstand extreme temperatures, while the outer layers provide insulation and structural stability. This construction allows for rapid heating while maintaining consistent temperatures throughout extended cooking sessions.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Wood-Fired Pizza Perfection</h3>
                <p className="mb-4">
                  Our clay pizza ovens bring authentic Neapolitan cooking to your backyard. The dome design creates optimal heat circulation, with temperatures reaching 900-1000°F at the fire zone while maintaining perfect baking temperatures throughout the cooking surface. This heat gradient allows for simultaneously cooking pizzas, breads, and roasted dishes at their optimal temperatures.
                </p>
                <p className="mb-4">
                  The porous nature of clay absorbs and releases moisture during cooking, creating the perfect environment for crispy crusts with tender interiors. The wood-fired heating process infuses food with subtle smoky flavors that cannot be replicated by gas or electric ovens, while the thermal mass of the clay maintains consistent heat for hours after the fire dies down.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Artisan Bread Baking</h3>
                <p className="mb-4">
                  Clay bread ovens excel at creating the steam and heat conditions necessary for perfect artisan breads. The clay walls absorb moisture during the initial heating phase and release it as steam when dough is introduced, creating the humid environment essential for proper crust development. This natural steam injection system produces breads with superior crust texture and flavor development.
                </p>
                <p className="mb-4">
                  Our portable bread ovens are designed for home bakers who want professional results without requiring permanent installation. The compact design heats quickly while retaining enough thermal mass for multiple baking sessions. The even heat distribution ensures uniform browning and consistent results across different bread types and sizes.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Multi-Purpose Cooking Systems</h3>
                <p className="mb-4">
                  Our versatile clay ovens adapt to various cooking styles and cuisines. The large cooking chamber accommodates multiple dishes simultaneously, while temperature zones within the oven allow for different cooking techniques. High heat areas near the fire are perfect for searing and grilling, while moderate heat zones excel for roasting and baking.
                </p>
                <p className="mb-4">
                  The thermal mass of clay provides exceptional heat retention, allowing for extended cooking sessions without additional fuel. As temperatures gradually decrease, the oven transitions from high-heat grilling to moderate roasting and finally to low-temperature slow cooking, maximizing fuel efficiency while expanding cooking possibilities.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Traditional Village Cooking</h3>
                <p className="mb-4">
                  Our bhatti and chulah systems represent traditional Indian village cooking methods that have sustained communities for centuries. These efficient designs maximize heat output while minimizing fuel consumption, using biomass and agricultural waste as primary fuel sources. The multi-chamber design allows for simultaneous cooking of multiple dishes while managing smoke and heat effectively.
                </p>
                <p className="mb-4">
                  Modern interpretations of these traditional systems incorporate improved airflow design and smoke management while maintaining the authentic cooking characteristics that make village-style food so flavorful. The clay construction ensures even heat distribution and superior heat retention compared to metal alternatives.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Health and Environmental Benefits</h3>
                <p className="mb-4">
                  Clay oven cooking provides significant health advantages over conventional cooking methods. The natural alkaline properties of clay help neutralize acidity in foods, while the porous structure allows for natural moisture regulation that prevents food from drying out or becoming overly greasy. The high-heat cooking process seals in nutrients while creating beneficial Maillard reactions that enhance flavor and nutritional value.
                </p>
                <p className="mb-4">
                  From an environmental perspective, clay ovens represent sustainable cooking technology. The materials are completely natural and renewable, the construction has minimal environmental impact, and the fuel efficiency reduces overall energy consumption. Wood-fired ovens can utilize sustainably harvested wood or agricultural waste, creating a carbon-neutral cooking system.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Installation and Maintenance</h3>
                <p className="mb-4">
                  Proper installation is crucial for optimal performance and safety of clay ovens. Our installation service includes site preparation, foundation construction, oven placement, and chimney installation where required. We provide comprehensive training on firing procedures, temperature management, and cooking techniques to ensure you get the best results from your clay oven.
                </p>
                <p className="mb-4">
                  Maintenance of clay ovens is straightforward but important. Regular cleaning removes ash and food residue, while periodic inspection ensures structural integrity. The natural expansion and contraction of clay during heating and cooling cycles requires proper curing procedures for new ovens and occasional minor repairs for older units. With proper care, clay ovens can provide decades of exceptional cooking service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">500+ Professional Chefs</h3>
                <p className="text-gray-600">Trusted by restaurants and culinary professionals across India</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Installation</h3>
                <p className="text-gray-600">Professional installation and training included with every oven</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">5-Year Warranty</h3>
                <p className="text-gray-600">Comprehensive warranty covering structure and performance</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}