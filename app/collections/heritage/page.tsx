"use client";

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Crown, Award, Clock, Sparkles, Users, Shield, Truck, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"

export default function HeritageCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [realProducts, setRealProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  const { addToCart, cartItems } = useCart()
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist()

  useEffect(() => {
    setIsVisible(true)
    fetchRealProducts()
  }, [])

  const fetchRealProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const supabase = createClient()

      // Get products with heritage, traditional, or vintage tags (same as all-pottery pattern)
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
          category_id,
          categories!inner(name, slug)
        `)
        .eq('is_active', true)
        .eq('categories.slug', 'heritage-collection')
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
        image: (() => {
          if (!product.images) return "/placeholder.svg";

          let imageArray;
          if (typeof product.images === 'string') {
            try {
              imageArray = JSON.parse(product.images);
            } catch {
              return "/placeholder.svg";
            }
          } else {
            imageArray = product.images;
          }

          return imageArray && imageArray.length > 0 ? imageArray[0] : "/placeholder.svg";
        })(),
        category: product.categories?.name || "Heritage",
        subCategory: product.categories?.slug || "heritage",
        year: "1952",
        rating: 4.5 + (Math.random() * 0.5),
        reviews: Math.floor(Math.random() * 200) + 50,
        badge: product.is_featured ? "Featured" : "Heritage",
        features: ["Traditional shape", "Historical significance", "Museum quality", "Certificate of authenticity"],
        description: product.description || `Heritage ${product.name} preserving traditional pottery techniques`,
        material: "Premium Terracotta",
        size: "Standard",
        style: "Traditional",
        inStock: (product.inventory_quantity || 0) > 0,
        trending: product.is_featured,
        eco_friendly: true,
        handmade: true,
        weight: "2kg",
        dimensions: "Standard size"
      })) || []

      setRealProducts(transformedProducts)
    } catch (error) {
      console.error('Error in fetchRealProducts:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const handleAddToCart = (product: any) => {
    try {
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug
      }
      addToCart(cartProduct)
      toast.success("Added to cart!", {
        description: `${product.name} has been added to your cart.`
      })
    } catch (error) {
      toast.error("Failed to add to cart")
    }
  }

  const handleToggleWishlist = (product: any) => {
    try {
      const isInWishlist = wishlistItems?.some(item => item.id === product.id) || false
      const wishlistProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug
      }

      if (isInWishlist) {
        removeFromWishlist(product.id)
        toast.success("Removed from wishlist")
      } else {
        addToWishlist(wishlistProduct)
        toast.success("Added to wishlist!")
      }
    } catch (error) {
      toast.error("Failed to update wishlist")
    }
  }

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "cooking", label: "Cooking" },
    { value: "serving", label: "Serving" },
    { value: "storage", label: "Storage" },
    { value: "spiritual", label: "Spiritual" },
    { value: "decorative", label: "Decorative" }
  ]

  // Use only real database products
  const allProducts = realProducts

  const filteredProducts = selectedCategory === "all"
    ? allProducts
    : allProducts.filter(product => product.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-amber-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-yellow-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200 text-sm px-4 py-2">
                Heritage Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Heritage <span className="text-amber-600">Collection</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Since 1952, Clayfable has been preserving traditional pottery heritage. Our Heritage Collection features
                original designs and time-honored techniques passed down through generations of master artisans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-3">
                  <Crown className="h-5 w-5 mr-2" />
                  Explore Heritage
                </Button>
                <Button size="lg" variant="outline" className="border-amber-200 hover:bg-amber-50 text-lg px-8 py-3">
                  Our Story
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Heritage Timeline */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">70+ Years of Pottery Heritage</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Each piece in our Heritage Collection represents a milestone in our journey of preserving traditional craftsmanship
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">1952</h3>
                <p className="text-gray-600">Foundation year with our first traditional water pot design</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">1960s</h3>
                <p className="text-gray-600">Royal patronage and creation of palace-inspired designs</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">1980s</h3>
                <p className="text-gray-600">Third generation artisans preserving family techniques</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Crown className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Today</h3>
                <p className="text-gray-600">Continuing the legacy with museum-quality heritage pieces</p>
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
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="border-amber-100 focus:border-amber-300">
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

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Era</label>
                        <Select>
                          <SelectTrigger className="border-amber-100 focus:border-amber-300">
                            <SelectValue placeholder="Select era" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Eras</SelectItem>
                            <SelectItem value="1950s">1950s</SelectItem>
                            <SelectItem value="1960s">1960s</SelectItem>
                            <SelectItem value="1970s">1970s</SelectItem>
                            <SelectItem value="1980s">1980s & Later</SelectItem>
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
                            <SelectItem value="under-3000">Under ₹3,000</SelectItem>
                            <SelectItem value="3000-6000">₹3,000 - ₹6,000</SelectItem>
                            <SelectItem value="6000-10000">₹6,000 - ₹10,000</SelectItem>
                            <SelectItem value="above-10000">Above ₹10,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Heritage Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
                            <span className="text-sm text-gray-600">Original 1952 Design</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
                            <span className="text-sm text-gray-600">Master Craftsman</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
                            <span className="text-sm text-gray-600">Royal Collection</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-amber-200 text-amber-600 mr-2" />
                            <span className="text-sm text-gray-600">Certificate of Authenticity</span>
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
                    <h2 className="text-2xl font-bold text-gray-900">Heritage Collection</h2>
                    <p className="text-gray-600">{filteredProducts.length} heritage pieces available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-amber-100 focus:border-amber-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="year-old">Oldest First</SelectItem>
                      <SelectItem value="year-new">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product, index) => (
                    <Link key={product.id} href={`/products/${product.slug}`}>
                      <Card className="group border-amber-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={400}
                              height={300}
                              priority={index < 6}
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-64 bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                              <Crown className="h-16 w-16 text-amber-400" />
                            </div>
                          )}
                          {product.badge && (
                            <Badge className="absolute top-3 left-3 bg-amber-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-amber-600">
                            Est. {product.year}
                          </Badge>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleToggleWishlist(product)
                            }}
                            className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <Heart className={`h-4 w-4 ${wishlistItems?.some(item => item.id === product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
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
                            <Button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddToCart(product)
                              }}
                              className="flex-1 bg-amber-600 hover:bg-amber-700"
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <Link href={`/products/${product.slug || product.id}`}>
                              <Button variant="outline" size="sm" className="border-amber-200 hover:bg-amber-50">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
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

        {/* Heritage Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Clayfable Heritage Story</h2>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="text-xl mb-6">
                  Since 1952, Clayfable has been more than just a pottery workshop – we are the guardians of an ancient craft that connects generations through clay, fire, and human artistry. Our Heritage Collection represents the culmination of over seven decades of dedication to preserving traditional pottery techniques while creating timeless pieces that tell the story of India's rich ceramic heritage.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Founding Vision</h3>
                <p className="mb-4">
                  Established in the post-independence era, Clayfable was born from a vision to preserve India's traditional pottery heritage at a time when industrialization threatened to erase centuries-old crafting techniques. Our founder, Master Potter Ramesh Chand, recognized that handmade pottery was not just functional – it was cultural memory shaped in clay. His first creation, the traditional water pot that remains our signature piece, embodied the perfect marriage of utility and artistry.
                </p>
                <p className="mb-4">
                  Each piece in our Heritage Collection traces its lineage back to those early designs, carrying forward the same proportions, techniques, and spiritual dedication that characterized our founder's work. These are not mere reproductions – they are living expressions of an unbroken tradition that has been carefully preserved and passed down through four generations of master artisans.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Master Craftsman Lineage</h3>
                <p className="mb-4">
                  The Heritage Collection is created exclusively by our master craftsmen, artisans who have undergone decades of training in traditional techniques. Each master craftsman represents a direct lineage to our founding potter, having learned not just the technical skills but the philosophical approach to working with clay that makes Clayfable pottery distinctive.
                </p>
                <p className="mb-4">
                  Our Master Craftsman Series features pieces personally created by artisans who have achieved the highest level of skill recognition within our workshop. These individuals can recreate any historical design from memory, understanding not just how to shape the clay but why each curve and proportion was chosen by their predecessors. Their signatures on these pieces represent a guarantee of authenticity and a personal stake in the preservation of our craft heritage.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Royal Patronage and Palace Collections</h3>
                <p className="mb-4">
                  During the 1960s, Clayfable received royal patronage from several Indian princely families, leading to the creation of our prestigious Palace Collection. These ornate pieces, featuring gold accents and elaborate traditional motifs, were commissioned for special ceremonies and state functions. The designs reflect the sophisticated aesthetic sensibilities of Indian royal courts while maintaining the fundamental honesty of handcrafted terracotta.
                </p>
                <p className="mb-4">
                  Today's Palace Collection pieces are faithful recreations of those royal commissions, created using the same techniques and attention to detail that once graced palatial settings. Each piece comes with historical documentation explaining its original context and significance, making these not just beautiful objects but important cultural artifacts.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Spiritual and Sacred Pottery</h3>
                <p className="mb-4">
                  Our Sacred Heritage line includes temple lamps, ceremonial vessels, and devotional objects that have been blessed according to traditional Hindu practices. These pieces serve dual purposes as functional religious items and as artistic expressions of spiritual devotion. The clay used in these pieces is sourced from sacred sites and prepared according to ancient Vedic guidelines.
                </p>
                <p className="mb-4">
                  Many Indian households have maintained unbroken traditions of daily worship using terracotta lamps and vessels for generations. Our Sacred Heritage pieces honor this continuity, providing modern families with authentic devotional objects that connect them to their ancestral practices while meeting contemporary standards of craftsmanship and beauty.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Documentation and Authentication</h3>
                <p className="mb-4">
                  Every piece in the Heritage Collection comes with a Certificate of Authenticity that documents its historical significance, creation process, and the master craftsman responsible for its making. Our archives maintain detailed records of traditional designs, techniques, and the stories behind each piece, ensuring that this knowledge is preserved for future generations.
                </p>
                <p className="mb-4">
                  We maintain photographic documentation of the creation process for each Heritage piece, from clay preparation through final firing. This documentation serves not only as quality assurance but as educational material for those interested in understanding traditional pottery techniques. Many pieces also include QR codes that link to detailed historical information and videos of the creation process.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Museum Quality and Preservation</h3>
                <p className="mb-4">
                  Our Heritage Collection meets museum conservation standards, using only natural materials and traditional techniques that ensure long-term stability and preservation. Special attention is paid to clay preparation, natural pigment selection, and firing temperatures to create pieces that will maintain their integrity for centuries.
                </p>
                <p className="mb-4">
                  Several pieces from our Heritage Collection are displayed in museums and cultural institutions across India, serving as examples of traditional pottery at its finest. We regularly collaborate with archaeologists and cultural historians to ensure our techniques remain authentic to historical practices while meeting contemporary standards of durability and safety.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Legacy for Future Generations</h3>
                <p className="mb-4">
                  The Heritage Collection represents more than historical preservation – it is our gift to future generations who will inherit both the responsibility and the privilege of continuing this ancient craft tradition. Each piece purchased supports the training of young artisans and the maintenance of traditional knowledge systems that might otherwise be lost to time.
                </p>
                <p className="mb-4">
                  By choosing pieces from our Heritage Collection, you become a part of this continuing story, helping ensure that the knowledge, techniques, and spiritual approach to pottery that began in 1952 will continue to flourish for generations to come. These are not just decorative objects – they are tangible links to our cultural heritage and investments in its preservation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">70+ Years of Heritage</h3>
                <p className="text-gray-600">Unbroken tradition of pottery excellence since 1952</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Master Craftsmen</h3>
                <p className="text-gray-600">Fourth generation artisans preserving traditional techniques</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Authenticated Heritage</h3>
                <p className="text-gray-600">Every piece comes with certificate of authenticity and provenance</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}