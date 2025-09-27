"use client"

import { useState, useEffect } from "react"
import { Circle } from "lucide-react"
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

export default function TraditionalGriddlesPage() {
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
          .or('tags.cs.{griddle},tags.cs.{tawa},tags.cs.{pan},tags.cs.{cooking},tags.cs.{clay griddle},tags.cs.{flat pan}')
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
            <Circle className="h-8 w-8 text-yellow-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Traditional Griddles
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Clay tawa and cooking surfaces for authentic flatbreads, pancakes, and traditional cooking
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-100">
            <div className="flex items-center mb-3">
              <Circle className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Even Heat Distribution</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Clay ensures uniform heat distribution for perfectly cooked flatbreads and pancakes
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-100">
            <div className="flex items-center mb-3">
              <Circle className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Non-Stick Surface</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Natural clay surface develops non-stick properties with proper seasoning
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-100">
            <div className="flex items-center mb-3">
              <Circle className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Enhanced Flavor</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Adds subtle earthy flavor to rotis, dosas, and other traditional breads
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Traditional Griddles Collection</h2>

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
              <Circle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Traditional Griddles Found</h3>
              <p className="text-gray-500">
                We're working on adding traditional griddles to our collection. Check back soon!
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
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">The Art of Clay Griddle Cooking</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Traditional Technique</h4>
              <p className="text-gray-600 text-sm">
                Used for centuries to make rotis, dosas, uttapam, and other traditional flatbreads.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Health Benefits</h4>
              <p className="text-gray-600 text-sm">
                Clay adds natural minerals and helps maintain nutritional value of foods.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Versatile Cooking</h4>
              <p className="text-gray-600 text-sm">
                Perfect for making various flatbreads, pancakes, and even roasting spices.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Maintenance</h4>
              <p className="text-gray-600 text-sm">
                Simple to clean and maintain with proper care and occasional re-seasoning.
              </p>
            </div>
          </div>
        </div>

        {/* Cooking Tips */}
        <div className="bg-white rounded-lg p-8 border border-yellow-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Griddle Cooking Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Seasoning Process</h4>
              <p className="text-gray-600 text-sm">
                Season your new griddle with oil and gradual heating for best non-stick properties.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Heat Control</h4>
              <p className="text-gray-600 text-sm">
                Start with medium heat and adjust as needed for different types of bread and thickness.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Perfect Rotis</h4>
              <p className="text-gray-600 text-sm">
                For soft rotis, cook until small bubbles form, then flip for even cooking.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Cleaning Care</h4>
              <p className="text-gray-600 text-sm">
                Clean with warm water and a soft brush. Avoid soap to preserve seasoning.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductFooter />
    </div>
  )
}