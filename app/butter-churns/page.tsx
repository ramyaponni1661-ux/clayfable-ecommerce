"use client"

import { useState, useEffect } from "react"
import { Milk } from "lucide-react"
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

export default function ButterChurnsPage() {
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
          .or('tags.cs.{butter churn},tags.cs.{dairy},tags.cs.{traditional dairy},tags.cs.{churn},tags.cs.{butter making},tags.cs.{dairy equipment}')
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
            <Milk className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Butter Churns
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Traditional dairy equipment for making fresh, homemade butter using time-honored methods
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-3">
              <Milk className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Traditional Method</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Experience the authentic way of making butter using centuries-old techniques
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-3">
              <Milk className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Pure & Natural</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Create pure, preservative-free butter without any artificial additives
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-3">
              <Milk className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Health Benefits</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Fresh homemade butter is rich in nutrients and free from commercial processing
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Butter Churns Collection</h2>

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
              <Milk className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Butter Churns Found</h3>
              <p className="text-gray-500">
                We're working on adding butter churns to our collection. Check back soon!
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
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">The Art of Traditional Butter Making</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Time-Honored Tradition</h4>
              <p className="text-gray-600 text-sm">
                Connect with generations of dairy farmers who perfected this craft over centuries.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Superior Quality</h4>
              <p className="text-gray-600 text-sm">
                Clay vessels maintain ideal temperature and provide the perfect environment for churning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Sustainable Practice</h4>
              <p className="text-gray-600 text-sm">
                Reduce packaging waste and support sustainable food production methods.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Educational Value</h4>
              <p className="text-gray-600 text-sm">
                Perfect for teaching children about traditional food preparation and self-sufficiency.
              </p>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-lg p-8 border border-blue-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">How to Make Butter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Fresh Cream</h4>
              <p className="text-gray-600 text-sm">
                Start with high-quality, fresh cream at room temperature for best results.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Churning Process</h4>
              <p className="text-gray-600 text-sm">
                Use consistent, rhythmic motions to agitate the cream until butter forms.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Separation</h4>
              <p className="text-gray-600 text-sm">
                Watch for the separation of butter from buttermilk during the churning process.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Washing & Storage</h4>
              <p className="text-gray-600 text-sm">
                Wash the butter thoroughly and store in cool conditions for freshness.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductFooter />
    </div>
  )
}