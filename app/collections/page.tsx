"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, Filter, Grid, List } from "lucide-react"
import Link from "next/link"
import ProductFooter from "@/components/product-footer"
import TrustBanner from "@/components/trust-banner"
import AdvancedSearch from "@/components/advanced-search"
import EnhancedProductCard from "@/components/enhanced-product-card"
import ProductHeader from "@/components/product-header"
import { useEffect, useState } from "react"
import { createClient } from '@/lib/supabase/client'

export default function CollectionsPage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>("grid")
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    category: '',
    priceRange: [0, 10000] as [number, number],
    rating: 0,
    availability: 'all' as 'all' | 'in-stock' | 'out-of-stock',
    sortBy: 'relevance' as 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popularity',
    tags: []
  })
  const [totalResults, setTotalResults] = useState(24)
  const [collectionProducts, setCollectionProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleVisibility = () => {
      const elements = document.querySelectorAll(".scroll-animate")
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("in-view")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("scroll", handleVisibility)
    handleVisibility()

    setTimeout(() => setIsVisible(true), 100)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("scroll", handleVisibility)
    }
  }, [])

  // Fetch all collection products from database
  useEffect(() => {
    const fetchCollectionProducts = async () => {
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
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
          console.error('Error fetching collection products:', error)
        } else {
          const transformedProducts = products?.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.compare_price || Math.floor(product.price * 1.15),
            image: product.images ? JSON.parse(product.images)?.[0] || "/placeholder.svg" : "/placeholder.svg",
            rating: 4.5 + Math.random() * 0.4,
            reviewCount: Math.floor(Math.random() * 200) + 25,
            badges: [
              ...(product.created_at && new Date(product.created_at) > new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
                ? [{ type: 'new' as const, text: 'New Arrival' }]
                : []),
              { type: 'handmade' as const, text: 'Handmade' }
            ],
            stock: product.inventory_quantity,
            description: product.description || "Premium terracotta piece handcrafted with care"
          })) || []

          setCollectionProducts(transformedProducts)
          setTotalResults(transformedProducts.length)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCollectionProducts()
  }, [])

  // Sample product data for enhanced product cards
  const products = [
    {
      id: '1',
      name: 'Traditional Kulhads Set (6 pieces)',
      price: 149,
      originalPrice: 899,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviewCount: 124,
      badges: [
        { type: 'bestseller' as const, text: 'Bestseller' },
        { type: 'handmade' as const, text: 'Handmade' }
      ],
      stock: 15,
      description: 'Authentic terracotta kulhads perfect for chai and traditional drinks'
    },
    {
      id: '2',
      name: 'Dinner Plate Set (4 pieces)',
      price: 149,
      originalPrice: 1599,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviewCount: 89,
      badges: [
        { type: 'new' as const, text: 'New Arrival' },
        { type: 'eco' as const, text: 'Eco-Friendly' }
      ],
      stock: 8,
      description: 'Elegant dinner plates with traditional motifs'
    },
    {
      id: '3',
      name: 'Water Storage Pot - Large',
      price: 149,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviewCount: 156,
      badges: [
        { type: 'featured' as const, text: 'Featured' },
        { type: 'handmade' as const, text: 'Artisan Made' }
      ],
      stock: 12,
      description: 'Traditional water storage pot with cooling properties'
    },
    {
      id: '4',
      name: 'Decorative Vase Collection',
      price: 149,
      originalPrice: 2299,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviewCount: 67,
      badges: [
        { type: 'limited' as const, text: 'Limited Edition' }
      ],
      stock: 3,
      description: 'Handcrafted decorative vases with intricate designs'
    },
    {
      id: '5',
      name: 'Serving Bowl Set (3 sizes)',
      price: 149,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviewCount: 201,
      badges: [
        { type: 'bestseller' as const, text: 'Top Rated' },
        { type: 'eco' as const, text: 'Natural Clay' }
      ],
      stock: 0,
      description: 'Versatile serving bowls for all occasions'
    },
    {
      id: '6',
      name: 'Tea Set - Premium Collection',
      price: 149,
      originalPrice: 4299,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviewCount: 45,
      badges: [
        { type: 'featured' as const, text: 'Premium' },
        { type: 'handmade' as const, text: 'Master Crafted' }
      ],
      stock: 7,
      description: 'Complete tea set with teapot, cups, and saucers'
    }
  ]

  const collections = [
    {
      id: 1,
      name: "Cooking Collection",
      description: "Traditional terracotta cookware for authentic flavors",
      image: "/api/placeholder/300/200",
      itemCount: 24,
      featured: true,
      category: "cookware"
    },
    {
      id: 2,
      name: "Serving Collection",
      description: "Elegant serving dishes for memorable dining",
      image: "/api/placeholder/300/200",
      itemCount: 18,
      featured: true,
      category: "serving"
    },
    {
      id: 3,
      name: "Decor Collection",
      description: "Beautiful decorative pieces for your home",
      image: "/api/placeholder/300/200",
      itemCount: 32,
      featured: false,
      category: "decor"
    },
    {
      id: 4,
      name: "Garden Collection",
      description: "Planters and garden accessories",
      image: "/api/placeholder/300/200",
      itemCount: 15,
      featured: false,
      category: "garden"
    },
    {
      id: 5,
      name: "Custom Collection",
      description: "Bespoke pieces crafted to your specifications",
      image: "/api/placeholder/300/200",
      itemCount: 8,
      featured: true,
      category: "custom"
    },
    {
      id: 6,
      name: "Heritage Collection",
      description: "Traditional designs passed down through generations",
      image: "/api/placeholder/300/200",
      itemCount: 12,
      featured: false,
      category: "heritage"
    }
  ]

  const handleAddToCart = (product: any) => {
    console.log('Added to cart:', product)
    // In real app, this would add to cart context/state
  }

  const handleAddToWishlist = (product: any) => {
    console.log('Added to wishlist:', product)
    // In real app, this would add to wishlist context/state
  }

  const handleQuickView = (product: any) => {
    console.log('Quick view:', product)
    // In real app, this would open quick view modal
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 relative overflow-hidden">
      {/* Trust Banner */}
      <TrustBanner />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-parallaxFloat"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-amber-300 rounded-full opacity-15 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/3 w-20 h-20 bg-orange-300 rounded-full opacity-10 animate-bounce"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <ProductHeader />

      {/* Hero Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200">
              Handcrafted Excellence Since 1952
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Our
              <span className="text-orange-600 relative inline-block ml-4">
                Collections
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover our curated collections of authentic terracotta products, each piece telling a story
              of traditional craftsmanship and timeless beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Advanced Search and Filters */}
      <section className="py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="scroll-animate">
            <AdvancedSearch
              onFiltersChange={setSearchFilters}
              onViewModeChange={setViewMode}
              totalResults={totalResults}
              isLoading={false}
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className={`grid ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-2xl mx-auto"} gap-8`}>
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
            ) : (collectionProducts.length > 0 ? collectionProducts : products).map((product, index) => (
              <div
                key={product.id}
                className="scroll-animate"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <EnhancedProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onQuickView={handleQuickView}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Overview */}
      <section className="py-16 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 scroll-animate">
            <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200">
              Browse by Collection
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Our
              <span className="text-orange-600 ml-2">Heritage Collections</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each collection represents decades of traditional craftsmanship and authentic terracotta artistry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.slice(0, 6).map((collection, index) => (
              <Card
                key={collection.id}
                className="group hover:shadow-xl transition-all duration-500 border-orange-100 overflow-hidden scroll-animate hover-lift"
                style={{ animationDelay: `${(index + 6) * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {collection.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  {collection.featured && (
                    <Badge className="absolute top-2 left-2 bg-orange-600 text-white text-xs">
                      Featured
                    </Badge>
                  )}
                  <Badge className="absolute top-2 right-2 bg-white text-orange-600 border border-orange-200 text-xs">
                    {collection.itemCount}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {collection.description}
                  </p>

                  <Link href={`/${collection.category}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-orange-200 hover:bg-orange-50"
                    >
                      View Collection
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-700 text-white relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="scroll-animate">
            <h2 className="text-4xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              Let us create something special just for you with our custom design service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/custom">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4 hover-lift hover-glow">
                  Custom Orders
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-orange-600 bg-transparent hover-lift"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProductFooter />
    </div>
  )
}