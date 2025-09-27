"use client"

import { useState, useEffect } from "react"
import { Coffee } from "lucide-react"
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

export default function TeaSetsPage() {
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
          .or('tags.cs.{tea},tags.cs.{chai},tags.cs.{cup},tags.cs.{teapot},tags.cs.{tea set},tags.cs.{kulhad}')
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
            <Coffee className="h-8 w-8 text-amber-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Tea Sets
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Traditional clay tea service sets that enhance the flavor and experience of your favorite brews
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
            <div className="flex items-center mb-3">
              <Coffee className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Enhanced Flavor</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Clay naturally improves the taste of tea by adding subtle earthy notes
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
            <div className="flex items-center mb-3">
              <Coffee className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Temperature Retention</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Excellent heat retention keeps your tea warm for longer periods
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
            <div className="flex items-center mb-3">
              <Coffee className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Authentic Experience</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Traditional kulhads and teapots for an authentic Indian tea experience
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Tea Sets Collection</h2>

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
              <Coffee className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tea Sets Found</h3>
              <p className="text-gray-500">
                We're working on adding tea sets to our collection. Check back soon!
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
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">The Art of Clay Tea Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Traditional Kulhads</h4>
              <p className="text-gray-600 text-sm">
                Experience authentic Indian chai served in handcrafted clay cups.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Natural Purification</h4>
              <p className="text-gray-600 text-sm">
                Clay naturally filters impurities and enhances the purity of your tea.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Eco-Friendly Choice</h4>
              <p className="text-gray-600 text-sm">
                Sustainable alternative to plastic or paper cups, completely biodegradable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Health Benefits</h4>
              <p className="text-gray-600 text-sm">
                Clay adds natural minerals and helps balance the pH of your beverages.
              </p>
            </div>
          </div>
        </div>

        {/* Tea Culture */}
        <div className="bg-white rounded-lg p-8 border border-amber-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Embrace Tea Culture</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Perfect for Chai</h4>
              <p className="text-gray-600 text-sm">
                Traditional clay cups enhance the flavor of spiced Indian chai and masala tea.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Green Tea Harmony</h4>
              <p className="text-gray-600 text-sm">
                Clay teapots are ideal for brewing delicate green and white teas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Social Connection</h4>
              <p className="text-gray-600 text-sm">
                Create memorable moments with family and friends over traditional tea service.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Gift Sets</h4>
              <p className="text-gray-600 text-sm">
                Beautiful tea sets make perfect gifts for tea lovers and cultural enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductFooter />
    </div>
  )
}