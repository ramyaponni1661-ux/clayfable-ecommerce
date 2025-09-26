"use client"

import { useState, useEffect } from "react"
import { Music } from "lucide-react"
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

export default function WindChimesPage() {
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
          .or('tags.cs.{wind chimes},tags.cs.{musical},tags.cs.{chimes},tags.cs.{hanging decor},tags.cs.{garden music},tags.cs.{outdoor decor}')
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
            <Music className="h-8 w-8 text-teal-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Wind Chimes
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Musical terracotta ornaments that bring soothing sounds and natural beauty to your space
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-teal-100">
            <div className="flex items-center mb-3">
              <Music className="h-5 w-5 text-teal-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Soothing Sounds</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Create peaceful melodies with natural terracotta tones and gentle resonance
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-teal-100">
            <div className="flex items-center mb-3">
              <Music className="h-5 w-5 text-teal-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Weather Resistant</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Durable clay construction that withstands outdoor elements and weather changes
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-teal-100">
            <div className="flex items-center mb-3">
              <Music className="h-5 w-5 text-teal-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Handcrafted Art</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Each piece is uniquely crafted, combining artistic beauty with musical function
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Wind Chimes Collection</h2>

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
              <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Wind Chimes Found</h3>
              <p className="text-gray-500">
                We're working on adding wind chimes to our collection. Check back soon!
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
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">The Art of Terracotta Music</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Natural Acoustics</h4>
              <p className="text-gray-600 text-sm">
                Clay's natural properties create warm, melodious tones that resonate beautifully.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Therapeutic Benefits</h4>
              <p className="text-gray-600 text-sm">
                The gentle sounds promote relaxation, stress relief, and peaceful meditation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Cultural Heritage</h4>
              <p className="text-gray-600 text-sm">
                Traditional designs inspired by centuries-old Indian musical instruments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Garden Harmony</h4>
              <p className="text-gray-600 text-sm">
                Perfect addition to gardens, patios, and outdoor spaces for natural ambiance.
              </p>
            </div>
          </div>
        </div>

        {/* Placement Tips */}
        <div className="bg-white rounded-lg p-8 border border-teal-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Perfect Placement Ideas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Garden Sanctuary</h4>
              <p className="text-gray-600 text-sm">
                Hang near plants and trees where natural breezes can create gentle melodies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Patio & Balcony</h4>
              <p className="text-gray-600 text-sm">
                Create a peaceful outdoor retreat with soft musical accompaniment.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Indoor Spaces</h4>
              <p className="text-gray-600 text-sm">
                Near windows or in rooms with good air circulation for gentle movement.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Meditation Areas</h4>
              <p className="text-gray-600 text-sm">
                Enhance your meditation or yoga practice with calming natural sounds.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ProductFooter />
    </div>
  )
}