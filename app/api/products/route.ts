import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const featured = searchParams.get('featured') === 'true'
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const material = searchParams.get('material')
    const inStock = searchParams.get('in_stock') === 'true'

    // Build the query
    let query = supabase
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
        images,
        material,
        color,
        is_featured,
        is_active,
        inventory_quantity,
        track_inventory,
        allow_backorder,
        low_stock_threshold,
        tags,
        created_at,
        updated_at,
        categories:category_id (
          id,
          name,
          slug,
          description
        )
      `)
      .eq('is_active', true)

    // Apply filters
    if (category && category !== 'all') {
      // First get category by slug
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()

      if (categoryData) {
        query = query.eq('category_id', categoryData.id)
      }
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }

    if (material) {
      query = query.eq('material', material)
    }

    if (inStock) {
      query = query.gt('inventory_quantity', 0)
    }

    // Apply sorting
    const sortMapping: Record<string, string> = {
      'newest': 'created_at',
      'oldest': 'created_at',
      'price_asc': 'price',
      'price_desc': 'price',
      'name_asc': 'name',
      'name_desc': 'name',
      'featured': 'is_featured'
    }

    const sortColumn = sortMapping[sort] || 'created_at'
    const sortOrder = sort.includes('_desc') || sort === 'oldest' ? false : sort.includes('_asc') ? true : order === 'asc'

    query = query.order(sortColumn, { ascending: sortOrder })

    if (sort === 'featured') {
      query = query.order('created_at', { ascending: false })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: products, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    // Transform products to include computed fields
    const transformedProducts = products?.map(product => {
      // Parse images safely
      let images: string[] = []
      try {
        images = product.images ? JSON.parse(product.images) : []
      } catch {
        images = []
      }

      // Calculate stock status
      const stockStatus = getStockStatus(product)

      // Calculate savings
      const savings = product.compare_price ? product.compare_price - product.price : 0
      const savingsPercent = product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.short_description,
        sku: product.sku,
        price: product.price,
        originalPrice: product.compare_price,
        image: images[0] || '/placeholder.svg',
        images,
        category: product.categories?.name || 'Uncategorized',
        categorySlug: product.categories?.slug,
        tags: product.tags || [],
        isFeatured: product.is_featured,
        stockStatus,
        inStock: stockStatus.status === 'in_stock' || stockStatus.status === 'low_stock',
        stockCount: product.inventory_quantity || 0,
        savings,
        savingsPercent,
        isNew: isProductNew(product.created_at),
        rating: 4.5 + Math.random() * 0.4, // Temporary until reviews system
        reviews: Math.floor(Math.random() * 200) + 25, // Temporary
        createdAt: product.created_at,
        updatedAt: product.updated_at
      }
    }) || []

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      },
      filters: {
        category,
        search,
        sort,
        featured,
        minPrice,
        maxPrice,
        material,
        inStock
      }
    })

  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to determine stock status
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

// Helper function to check if product is new (within last 30 days)
function isProductNew(createdAt: string): boolean {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return new Date(createdAt) > thirtyDaysAgo
}