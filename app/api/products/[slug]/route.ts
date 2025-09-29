import { NextRequest, NextResponse } from 'next/server'
import { executeFreshQuery } from '@/lib/supabase/fresh'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Use fresh client with cache busting for critical product data
    const result = await executeFreshQuery(async (supabase) => {
      // Get product by slug with related data
      // Add cache busting to force fresh data
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          short_description,
          sku,
          price,
          compare_price,
          cost_price,
          weight,
          dimensions,
          material,
          color,
          care_instructions,
          images,
          ar_model_url,
          youtube_video_id,
          specifications,
          tags,
          is_featured,
          is_active,
          requires_shipping,
          is_digital,
          seo_title,
          seo_description,
          track_inventory,
          inventory_quantity,
          allow_backorder,
          low_stock_threshold,
          created_at,
          updated_at,
          categories:category_id (
            id,
            name,
            slug,
            description
          ),
          product_variants (
            id,
            name,
            sku,
            price,
            compare_price,
            inventory_quantity,
            weight,
            is_active
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      console.log(`DEBUG: Fresh query for ${slug} at ${new Date().toISOString()}`)

      // Debug logging for stock investigation
      if (slug === 'cooking-vessel' || slug === 'water-bottle') {
        console.log(`DEBUG Frontend API: ${slug} fresh data from DB:`, {
          name: product?.name,
          inventory_quantity: product?.inventory_quantity,
          id: product?.id,
          updated_at: product?.updated_at
        })
      }

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('PRODUCT_NOT_FOUND')
        }
        console.error('Database error:', error)
        throw new Error('DATABASE_ERROR')
      }

      // Get related products from the same category
      let relatedProducts = []
      if (product.categories) {
        const { data: related } = await supabase
          .from('products')
          .select(`
            id,
            name,
            slug,
            short_description,
            price,
            compare_price,
            images,
            is_featured
          `)
          .eq('category_id', product.categories.id)
          .eq('is_active', true)
          .neq('id', product.id)
          .limit(4)

        relatedProducts = related || []
      }

      // Parse JSON fields safely
      const parseJsonSafely = (field: any) => {
        if (!field) return null
        if (typeof field === 'object') return field
        if (typeof field === 'string') {
          try {
            return JSON.parse(field)
          } catch {
            return field
          }
        }
        return field
      }

      const productData = {
        ...product,
        images: parseJsonSafely(product.images) || [],
        specifications: parseJsonSafely(product.specifications) || {},
        dimensions: parseJsonSafely(product.dimensions) || {}
      }

      return {
        product: productData,
        relatedProducts,
        stockStatus: getStockStatus(product),
        pricing: {
          price: product.price,
          comparePrice: product.compare_price,
          savings: product.compare_price ? product.compare_price - product.price : 0,
          savingsPercent: product.compare_price ?
            Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Product API error:', error)

    if (error instanceof Error) {
      if (error.message === 'PRODUCT_NOT_FOUND') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      if (error.message === 'DATABASE_ERROR') {
        return NextResponse.json(
          { error: 'Failed to fetch product' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getStockStatus(product: any) {
  if (!product.track_inventory) {
    return { status: 'in_stock', message: 'In Stock' }
  }

  if (product.inventory_quantity <= 0) {
    if (product.allow_backorder) {
      return { status: 'backorder', message: 'Available on Backorder' }
    } else {
      return { status: 'out_of_stock', message: 'Out of Stock' }
    }
  }

  if (product.inventory_quantity <= product.low_stock_threshold) {
    return {
      status: 'low_stock',
      message: `Only ${product.inventory_quantity} left in stock`,
      quantity: product.inventory_quantity
    }
  }

  return {
    status: 'in_stock',
    message: 'In Stock',
    quantity: product.inventory_quantity
  }
}