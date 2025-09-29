"use client"

import { useState, useEffect } from "react"
import { Archive } from "lucide-react"
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

export default function SpiceContainersPage() {
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
          .or('tags.cs.{spice},tags.cs.{container},tags.cs.{jar},tags.cs.{storage},tags.cs.{spice jar},tags.cs.{masala}')
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
            <Archive className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Spice Containers
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Keep spices fresh and flavorful with traditional clay storage solutions that preserve aroma and potency
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
            <div className="flex items-center mb-3">
              <Archive className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Freshness Preservation</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Natural clay properties help maintain spice freshness and prevent moisture absorption
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
            <div className="flex items-center mb-3">
              <Archive className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Aroma Retention</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Clay containers lock in essential oils and aromas better than plastic or metal
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
            <div className="flex items-center mb-3">
              <Archive className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Chemical-Free Storage</h3>
            </div>
            <p className="text-gray-600 text-sm">
              No harmful chemicals or coatings that could contaminate your precious spices
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Spice Containers Collection</h2>

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
              <Archive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Spice Containers Found</h3>
              <p className="text-gray-500">
                We're working on adding spice containers to our collection. Check back soon!
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
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">The Science of Spice Storage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Natural Moisture Control</h4>
              <p className="text-gray-600 text-sm">
                Clay naturally regulates humidity levels, preventing spice degradation from moisture.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Temperature Stability</h4>
              <p className="text-gray-600 text-sm">
                Provides thermal insulation that protects spices from temperature fluctuations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Light Protection</h4>
              <p className="text-gray-600 text-sm">
                Opaque clay walls protect spices from light-induced degradation of color and flavor.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Extended Shelf Life</h4>
              <p className="text-gray-600 text-sm">
                Proper clay storage can significantly extend the potency and flavor life of spices.
              </p>
            </div>
          </div>
        </div>

        {/* Storage Tips */}
        <div className="bg-white rounded-lg p-8 border border-green-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Spice Storage Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Proper Preparation</h4>
              <p className="text-gray-600 text-sm">
                Season new clay containers before use and ensure spices are completely dry before storage.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Whole vs Ground</h4>
              <p className="text-gray-600 text-sm">
                Store whole spices when possible, as they retain flavor longer than ground varieties.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Labeling System</h4>
              <p className="text-gray-600 text-sm">
                Label containers with purchase dates to ensure you use older spices first.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Cool & Dry Location</h4>
              <p className="text-gray-600 text-sm">
                Store away from heat sources like stoves and direct sunlight for maximum freshness.
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