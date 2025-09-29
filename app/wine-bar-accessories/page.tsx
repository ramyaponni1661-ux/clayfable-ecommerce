"use client"

import { useState, useEffect } from "react"
import { Wine } from "lucide-react"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import OptimizedProductCard from "@/components/optimized-product-card"
import { createClient } from "@/lib/supabase/client"
import CanonicalLink from "@/components/seo/canonical-link"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category_id: string
  inventory_quantity: number
  is_active: boolean
  tags?: string[]
  created_at: string
}

export default function WineBarAccessoriesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .or('tags.cs.{wine},tags.cs.{bar},tags.cs.{cooler},tags.cs.{glass},tags.cs.{wine accessories},tags.cs.{beverage},tags.cs.{bar accessories}')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching products:', error)
          return
        }

        const transformedProducts = data?.map(item => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description || '',
          price: parseFloat(item.price) || 0,
          originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
          image: Array.isArray(item.images) && item.images.length > 0
            ? item.images[0]
            : item.image || '/placeholder.svg',
          images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
          category_id: item.category_id,
          inventory_quantity: item.inventory_quantity || 0,
          is_active: item.is_active,
          tags: Array.isArray(item.tags) ? item.tags : [],
          created_at: item.created_at
        })) || []

        setProducts(transformedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [supabase])

  return (
    <>
      <CanonicalLink />
      <div className="min-h-screen bg-gray-50">
      <ProductHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Wine className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Wine & Bar Accessories
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Elegant clay wine coolers, glasses, and bar accessories for sophisticated entertaining
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center mb-3">
              <Wine className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Natural Cooling</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Clay's natural properties keep beverages cool and maintain optimal serving temperature
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center mb-3">
              <Wine className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Enhanced Flavor</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Terracotta enhances the taste of wines and beverages with its earthy character
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center mb-3">
              <Wine className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Elegant Design</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Sophisticated pieces that add rustic charm to any bar or entertainment area
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Wine & Bar Accessories Collection</h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Wine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Wine & Bar Accessories Found</h3>
              <p className="text-gray-500">
                We're working on adding wine and bar accessories to our collection. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <OptimizedProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Clay for Wine & Bar?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Temperature Control</h4>
              <p className="text-gray-600 text-sm">
                Natural insulation keeps beverages at the perfect serving temperature for longer.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Breathable Material</h4>
              <p className="text-gray-600 text-sm">
                Clay allows wine to breathe naturally, enhancing its flavor profile and aroma.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Eco-Friendly Choice</h4>
              <p className="text-gray-600 text-sm">
                Sustainable alternative to plastic or metal barware with timeless appeal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Unique Character</h4>
              <p className="text-gray-600 text-sm">
                Each piece has distinct variations that add personality to your collection.
              </p>
            </div>
          </div>
        </div>

        {/* Entertainment Tips */}
        <div className="bg-white rounded-lg p-8 border border-purple-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Perfect for Entertaining</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Wine Cooling</h4>
              <p className="text-gray-600 text-sm">
                Use clay wine coolers to maintain ideal temperature without ice dilution.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Cocktail Service</h4>
              <p className="text-gray-600 text-sm">
                Clay glasses and accessories add rustic elegance to cocktail presentations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Seasonal Drinks</h4>
              <p className="text-gray-600 text-sm">
                Perfect for serving traditional drinks like lassi, nimbu paani, or mulled wine.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Care Instructions</h4>
              <p className="text-gray-600 text-sm">
                Season properly before use and clean gently to maintain the clay's natural properties.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductFooter />
      </div>
    </>
  )
}