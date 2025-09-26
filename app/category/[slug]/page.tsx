"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Star, Heart, ShoppingCart, Filter, Search, Grid, List, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import EnhancedProductCard from "@/components/enhanced-product-card"
import AdvancedSearch from "@/components/advanced-search"
import TrustBanner from "@/components/trust-banner"

export default function CategoryPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [isVisible, setIsVisible] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>("grid")
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    category: slug || '',
    priceRange: [0, 10000] as [number, number],
    rating: 0,
    availability: 'all' as 'all' | 'in-stock' | 'out-of-stock',
    sortBy: 'relevance' as 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popularity',
    tags: []
  })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(null)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
    if (slug) {
      fetchCategoryData()
      fetchCategoryProducts()
    }
  }, [slug])

  const fetchCategoryData = async () => {
    try {
      const supabase = createClient()
      const { data: categoryData, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error fetching category:', error)
      } else {
        setCategory(categoryData)
      }
    } catch (err) {
      console.error('Category fetch error:', err)
    }
  }

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // First get the category ID
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!categoryData) {
        console.error('Category not found for slug:', slug)
        setProducts([])
        return
      }

      // Then get products by category_id
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          id, name, slug, description, price, compare_price, images,
          is_active, inventory_quantity, created_at, capacity,
          material_details, usage_instructions, care_instructions,
          product_tags, category_id
        `)
        .eq('is_active', true)
        .eq('category_id', categoryData.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching category products:', error)
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

        setProducts(transformedProducts)
        setTotalResults(transformedProducts.length)
      }
    } catch (err) {
      console.error('Products fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToWishlist = (product: any) => {
    console.log('Added to wishlist:', product)
  }

  const handleQuickView = (product: any) => {
    console.log('Quick view:', product)
  }

  const categoryTitle = category?.name || slug?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Products'

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
              {categoryTitle.split(' ').map((word, index) =>
                index === categoryTitle.split(' ').length - 1 ? (
                  <span key={index} className="text-orange-600 relative inline-block ml-4">
                    {word}
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                  </span>
                ) : (
                  <span key={index}>{word} </span>
                )
              )}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              {category?.description || `Discover our curated collection of ${categoryTitle.toLowerCase()}, each piece telling a story of traditional craftsmanship and timeless beauty.`}
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
              isLoading={loading}
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
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <div
                  key={product.id}
                  className="scroll-animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <EnhancedProductCard
                    product={product}
                    onAddToWishlist={handleAddToWishlist}
                    onQuickView={handleQuickView}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h3>
                <p className="text-gray-600 mb-8">We couldn't find any products in this category at the moment.</p>
                <Link href="/collections">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Browse All Collections
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <ProductFooter />
    </div>
  )
}