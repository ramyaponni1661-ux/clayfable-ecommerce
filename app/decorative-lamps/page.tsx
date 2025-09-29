"use client"

import { useState, useEffect } from "react"
import { Lightbulb } from "lucide-react"
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

export default function DecorativeLampsPage() {
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
          .or('tags.cs.{lamp},tags.cs.{light},tags.cs.{lighting},tags.cs.{decorative},tags.cs.{clay lamp},tags.cs.{traditional lighting}')
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
            <Lightbulb className="h-8 w-8 text-amber-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Decorative Lamps
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Traditional clay lighting that creates warm ambiance and adds natural beauty to your space
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
            <div className="flex items-center mb-3">
              <Lightbulb className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Warm Ambiance</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Creates soft, diffused lighting that enhances the atmosphere of any room
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
            <div className="flex items-center mb-3">
              <Lightbulb className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Handcrafted Beauty</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Each lamp is uniquely crafted with traditional techniques and artistic designs
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
            <div className="flex items-center mb-3">
              <Lightbulb className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Eco-Friendly Lighting</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Natural clay construction makes these lamps an environmentally conscious choice
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Decorative Lamps Collection</h2>

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
              <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Decorative Lamps Found</h3>
              <p className="text-gray-500">
                We're working on adding decorative lamps to our collection. Check back soon!
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
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">The Magic of Clay Lighting</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Natural Light Diffusion</h4>
              <p className="text-gray-600 text-sm">
                Clay naturally filters and softens light, creating a warm, cozy atmosphere.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Traditional Craftsmanship</h4>
              <p className="text-gray-600 text-sm">
                Each lamp reflects centuries-old pottery techniques and artistic traditions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Versatile Designs</h4>
              <p className="text-gray-600 text-sm">
                From simple elegance to intricate patterns, perfect for any decor style.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Energy Efficient</h4>
              <p className="text-gray-600 text-sm">
                Compatible with LED bulbs for long-lasting, energy-efficient lighting.
              </p>
            </div>
          </div>
        </div>

        {/* Placement Ideas */}
        <div className="bg-white rounded-lg p-8 border border-amber-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Perfect Placement Ideas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Living Room Accent</h4>
              <p className="text-gray-600 text-sm">
                Create a focal point with table lamps or floor lamps in your living space.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Bedroom Lighting</h4>
              <p className="text-gray-600 text-sm">
                Provide soft, relaxing illumination for bedside reading or ambient lighting.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Outdoor Spaces</h4>
              <p className="text-gray-600 text-sm">
                Weather-resistant designs perfect for patios, gardens, and outdoor dining areas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Special Occasions</h4>
              <p className="text-gray-600 text-sm">
                Ideal for creating magical atmospheres during festivals, dinners, and celebrations.
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