"use client"

import { useState, useEffect } from "react"
import { Flower } from "lucide-react"
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

export default function HangingPlantersPage() {
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
          .or('tags.cs.{hanging planter},tags.cs.{suspended},tags.cs.{garden pottery},tags.cs.{plant pot},tags.cs.{hanging pot},tags.cs.{vertical garden}')
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
            <Flower className="h-8 w-8 text-emerald-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Hanging Planters
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Suspended garden pottery that creates beautiful vertical gardens and maximizes your growing space
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center mb-3">
              <Flower className="h-5 w-5 text-emerald-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Space Optimization</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Maximize your gardening space with vertical growing solutions for any area
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center mb-3">
              <Flower className="h-5 w-5 text-emerald-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Natural Drainage</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Clay's porous nature provides excellent drainage and prevents root rot
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-100">
            <div className="flex items-center mb-3">
              <Flower className="h-5 w-5 text-emerald-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Decorative Appeal</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Beautiful terracotta designs that complement both plants and surroundings
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Hanging Planters Collection</h2>

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
              <Flower className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Hanging Planters Found</h3>
              <p className="text-gray-500">
                We're working on adding hanging planters to our collection. Check back soon!
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
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits of Clay Hanging Planters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Root Health</h4>
              <p className="text-gray-600 text-sm">
                Clay's breathable nature allows roots to access oxygen, promoting healthier plant growth.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Temperature Regulation</h4>
              <p className="text-gray-600 text-sm">
                Natural insulation keeps soil temperature stable, protecting plant roots from extremes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Eco-Friendly</h4>
              <p className="text-gray-600 text-sm">
                Made from natural materials, these planters are biodegradable and environmentally safe.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Moisture Control</h4>
              <p className="text-gray-600 text-sm">
                Clay naturally regulates moisture levels, reducing the risk of overwatering.
              </p>
            </div>
          </div>
        </div>

        {/* Gardening Tips */}
        <div className="bg-white rounded-lg p-8 border border-emerald-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Hanging Garden Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Perfect Plants</h4>
              <p className="text-gray-600 text-sm">
                Ideal for trailing plants, herbs, succulents, and small flowering varieties.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure Installation</h4>
              <p className="text-gray-600 text-sm">
                Use appropriate hooks and supports to safely hang your planters at the right height.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gary-900 mb-2">Watering Schedule</h4>
              <p className="text-gray-600 text-sm">
                Hanging planters may dry out faster, so adjust your watering routine accordingly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Seasonal Care</h4>
              <p className="text-gray-600 text-sm">
                Consider bringing delicate planters indoors during extreme weather conditions.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductFooter />
    </div>
  )
}