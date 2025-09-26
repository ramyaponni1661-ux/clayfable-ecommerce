"use client"

import { useState, useEffect } from "react"
import { Beaker } from "lucide-react"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import OptimizedProductCard from "@/components/optimized-product-card"
import { createClient } from "@/lib/supabase/client"

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

export default function FermentationPotsPage() {
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
          .or('tags.cs.{fermentation},tags.cs.{pickle},tags.cs.{kimchi},tags.cs.{ferment},tags.cs.{traditional food},tags.cs.{preservation}')
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
    <div className="min-h-screen bg-gray-50">
      <ProductHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Beaker className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Fermentation Pots
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Traditional clay vessels for fermentation and food preparation - perfect for pickles, kimchi, and more
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center mb-3">
              <Beaker className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Natural Fermentation</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Clay's natural properties create the perfect environment for healthy fermentation
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center mb-3">
              <Beaker className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Traditional Methods</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Time-tested designs used for generations in traditional food preparation
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center mb-3">
              <Beaker className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Health Benefits</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Preserve nutrients and enhance flavors naturally without chemicals
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Fermentation Pots Collection</h2>

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
              <Beaker className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Fermentation Pots Found</h3>
              <p className="text-gray-500">
                We're working on adding fermentation pots to our collection. Check back soon!
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
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Clay for Fermentation?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Natural pH Balance</h4>
              <p className="text-gray-600 text-sm">
                Clay naturally maintains optimal pH levels for healthy fermentation processes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Breathable Material</h4>
              <p className="text-gray-600 text-sm">
                Allows proper gas exchange while protecting contents from contamination.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Temperature Stability</h4>
              <p className="text-gray-600 text-sm">
                Maintains consistent temperatures for optimal fermentation conditions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Chemical-Free</h4>
              <p className="text-gray-600 text-sm">
                No harmful chemicals or coatings that could affect your fermented foods.
              </p>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="bg-white rounded-lg p-8 border border-purple-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Fermentation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Perfect for Pickles</h4>
              <p className="text-gray-600 text-sm">
                Ideal for traditional Indian pickles, vegetables, and fruit preserves.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Kimchi & Sauerkraut</h4>
              <p className="text-gray-600 text-sm">
                Create authentic fermented vegetables with enhanced flavors and probiotics.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Yogurt & Dairy</h4>
              <p className="text-gray-600 text-sm">
                Natural vessel for fermenting dairy products and creating cultured foods.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Care Instructions</h4>
              <p className="text-gray-600 text-sm">
                Season properly before first use and maintain with natural cleaning methods.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductFooter />
    </div>
  )
}