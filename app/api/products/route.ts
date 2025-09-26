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
    const limit = parseInt(searchParams.get('limit') || '12')
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
        inventory_quantity,
        track_inventory,
        created_at,
        categories:category_id (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)

    // Apply filters
    if (category) {
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

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    return NextResponse.json({
      success: true,
      data: products || [],
      pagination: {
        total: totalCount || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (totalCount || 0)
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