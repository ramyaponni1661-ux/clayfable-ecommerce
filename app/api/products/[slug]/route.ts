import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createClient()
    const { slug } = params

    // Get product by slug with related data
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

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      )
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
    const productData = {
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
      specifications: typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications,
      dimensions: typeof product.dimensions === 'string' ? JSON.parse(product.dimensions) : product.dimensions
    }

    return NextResponse.json({
      success: true,
      data: {
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

  } catch (error) {
    console.error('Product API error:', error)
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