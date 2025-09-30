"use client";

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Star, Heart, ShoppingCart, Filter, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"

export default function DecorativeItemsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [realProducts, setRealProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  // Cart and wishlist hooks
  const { addItem, isInCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    setIsVisible(true)
    fetchRealProducts()
  }, [])

  const handleAddToCart = (product: any) => {
    if (product.stock === 0 || !product.inStock) {
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
        inStock: product.inStock || product.stock > 0,
        maxQuantity: product.stock || 99
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
          inStock: product.inStock || product.stock > 0
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

      // First get the decorative-items category ID
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'decorative-items')
        .single()

      if (!categoryData) {
        console.error('Decorative items category not found')
        return
      }

      // Fetch products in decorative-items category
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, slug, price, images, compare_price, is_active, created_at, inventory_quantity')
        .eq('is_active', true)
        .eq('category_id', categoryData.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Decorative Items: Error fetching products:', error)
        return
      }

      // Transform database products
      const transformedProducts = products?.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.price) || 0,
        originalPrice: product.compare_price ? parseFloat(product.compare_price) : Math.round(product.price * 1.25),
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
        rating: 4 + Math.random(),
        reviewCount: Math.floor(Math.random() * 50) + 10,
        badge: 'Decorative',
        stock: product.inventory_quantity || 10,
        category: "Decorative Items",
        description: `Beautiful ${product.name}`,
        features: ["Handcrafted", "Eco-friendly"],
        discount: 25,
        inStock: (product.inventory_quantity || 0) > 0,
        stockStatus: (product.inventory_quantity || 0) > 10 ? "In Stock" :
                     (product.inventory_quantity || 0) > 0 ? "Limited Stock" : "Out of Stock"
      })) || []

      setRealProducts(transformedProducts)

    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "decorative-items", label: "Decorative Items" },
    { value: "garden-decor", label: "Garden Decor" },
    { value: "spiritual", label: "Spiritual" }
  ]

  const allProducts = realProducts

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase().replace(" ", "-") === selectedCategory
    const matchesSearch = searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = priceRange === "all" ||
      (priceRange === "under-3000" && product.price < 3000) ||
      (priceRange === "3000-5000" && product.price >= 3000 && product.price < 5000) ||
      (priceRange === "5000-8000" && product.price >= 5000 && product.price < 8000) ||
      (priceRange === "above-8000" && product.price >= 8000)

    return matchesCategory && matchesSearch && matchesPrice
  })

  const sortedProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return 0
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-amber-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-orange-300 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200 text-sm px-4 py-2">
                Handcrafted Excellence
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Beautiful <span className="text-orange-600">Decorative Items</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Discover our curated collection of handcrafted decorative pottery pieces, each telling a story of traditional craftsmanship and timeless beauty.
              </p>
            </div>
          </div>
        </section>

        {/* Advanced Filters Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Enhanced Filters */}
              <div className="lg:w-1/4">
                <Card className="border-orange-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      {/* Search */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Search Products</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search decorative items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-orange-100 focus:border-orange-300"
                          />
                        </div>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="border-orange-100 focus:border-orange-300">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price Range Filter */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Price Range</label>
                        <Select value={priceRange} onValueChange={setPriceRange}>
                          <SelectTrigger className="border-orange-100 focus:border-orange-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-3000">Under ₹3,000</SelectItem>
                            <SelectItem value="3000-5000">₹3,000 - ₹5,000</SelectItem>
                            <SelectItem value="5000-8000">₹5,000 - ₹8,000</SelectItem>
                            <SelectItem value="above-8000">Above ₹8,000</SelectItem>
                          </SelectContent>
                        </Select>
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
                    <h2 className="text-2xl font-bold text-gray-900">Decorative Items</h2>
                    <p className="text-gray-600">{sortedProducts.length} products</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-orange-100 focus:border-orange-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {isLoadingProducts ? (
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
                  ) : sortedProducts.map((product) => (
                    <Card key={product.id} className="group border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                            <div className="cursor-pointer">
                              {product.image !== "/placeholder.svg" ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={400}
                                  height={300}
                                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                                  <ShoppingCart className="h-16 w-16 text-orange-400" />
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Badges */}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-orange-600 text-white">
                              {product.badge}
                            </Badge>
                          </div>

                          <div className="absolute top-3 right-3">
                            <Badge className={`${
                              product.stockStatus === 'In Stock' ? 'bg-green-500' :
                              product.stockStatus === 'Limited Stock' ? 'bg-orange-500' :
                              'bg-red-500'
                            } text-white text-xs`}>
                              {product.stockStatus}
                            </Badge>
                          </div>

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
                          <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 cursor-pointer">
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
                            <span className="text-xl font-bold text-orange-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-orange-600 hover:bg-orange-700"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock && product.stock === 0}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {!product.inStock ? 'Out of Stock' : isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* No Results */}
                {sortedProducts.length === 0 && !isLoadingProducts && (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">No decorative items match your criteria</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory("all")
                        setPriceRange("all")
                        setSearchQuery("")
                        setSortBy("newest")
                      }}
                      className="border-orange-200 hover:bg-orange-50"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
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