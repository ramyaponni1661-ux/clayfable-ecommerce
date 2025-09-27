"use client"

import { useState, useEffect } from "react"
import { Gauge } from "lucide-react"
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

export default function PressureCookersPage() {
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
          .or('tags.cs.{pressure},tags.cs.{cooker},tags.cs.{cooking},tags.cs.{clay pressure},tags.cs.{pressure pot}')
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
            <Gauge className="h-8 w-8 text-orange-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Pressure Cookers
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Clay pressure cooking pots for faster, healthier, and more flavorful traditional cooking
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
            <div className="flex items-center mb-3">
              <Gauge className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Faster Cooking</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Reduce cooking time significantly while preserving nutrients and flavors
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
            <div className="flex items-center mb-3">
              <Gauge className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Natural Clay Benefits</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Clay adds natural minerals and enhances the taste of your food
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
            <div className="flex items-center mb-3">
              <Gauge className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Energy Efficient</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Save energy and time with superior heat retention properties
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Pressure Cookers Collection</h2>

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
              <Gauge className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Pressure Cookers Found</h3>
              <p className="text-gray-500">
                We're working on adding pressure cookers to our collection. Check back soon!
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
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Clay Pressure Cookers?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Traditional Wisdom</h4>
              <p className="text-gray-600 text-sm">
                Combines ancient clay cooking wisdom with modern pressure cooking technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Nutritional Benefits</h4>
              <p className="text-gray-600 text-sm">
                Preserves more vitamins and minerals compared to conventional pressure cookers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Superior Taste</h4>
              <p className="text-gray-600 text-sm">
                Clay imparts a unique earthy flavor that enhances the natural taste of food.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Eco-Friendly</h4>
              <p className="text-gray-600 text-sm">
                Made from natural materials, completely biodegradable and environment-friendly.
              </p>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="bg-white rounded-lg p-8 border border-orange-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Cooking Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Seasoning Process</h4>
              <p className="text-gray-600 text-sm">
                Properly season your clay pressure cooker before first use for best results.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Heat Management</h4>
              <p className="text-gray-600 text-sm">
                Start with medium heat and adjust gradually for optimal pressure cooking.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Maintenance</h4>
              <p className="text-gray-600 text-sm">
                Clean gently with warm water and avoid harsh detergents to preserve the clay.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Best For</h4>
              <p className="text-gray-600 text-sm">
                Perfect for dal, rice, vegetables, meat curries, and traditional Indian dishes.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductFooter />
    </div>
  )
}