import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/service'

const supabase = createClient()

async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return false
  }
  return true
}

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

// GET - Fetch all products with optional filtering
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build the query
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        sku,
        price,
        compare_price,
        inventory_quantity,
        is_active,
        is_featured,
        track_inventory,
        images,
        created_at,
        categories:category_id (
          id,
          name,
          slug
        )
      `)

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (category && category !== 'all') {
      // Get category by slug first
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()

      if (categoryData) {
        query = query.eq('category_id', categoryData.id)
      }
    }

    if (status && status !== 'all') {
      if (status === 'active') {
        query = query.eq('is_active', true)
      } else if (status === 'inactive') {
        query = query.eq('is_active', false)
      } else if (status === 'low-stock') {
        query = query.lte('inventory_quantity', 10).gt('inventory_quantity', 0)
      } else if (status === 'out-of-stock') {
        query = query.eq('inventory_quantity', 0)
      } else if (status === 'featured') {
        query = query.eq('is_featured', true)
      }
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    query = query.order('created_at', { ascending: false })

    const { data: products, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    // Get statistics
    const { data: stats } = await supabase
      .from('products')
      .select('id, is_active, is_featured, inventory_quantity', { count: 'exact' })

    const statsData = {
      total: stats?.length || 0,
      active: stats?.filter(p => p.is_active).length || 0,
      inactive: stats?.filter(p => !p.is_active).length || 0,
      featured: stats?.filter(p => p.is_featured).length || 0,
      lowStock: stats?.filter(p => p.inventory_quantity > 0 && p.inventory_quantity <= 10).length || 0,
      outOfStock: stats?.filter(p => p.inventory_quantity === 0).length || 0
    }

    return NextResponse.json({
      success: true,
      products: products || [],
      total: count || 0,
      pagination: {
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      },
      stats: statsData
    })

  } catch (error) {
    console.error('Admin products GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      name,
      description,
      short_description,
      sku,
      category_id,
      price,
      compare_price,
      images,
      specifications,
      tags,
      material,
      color,
      care_instructions,
      dimensions,
      weight,
      inventory_quantity,
      track_inventory = true,
      allow_backorder = false,
      low_stock_threshold = 10,
      is_featured = false,
      is_active = true,
      requires_shipping = true,
      is_digital = false,
      seo_title,
      seo_description,
      youtube_video_id,
      ar_model_url,
      capacity,
      material_details,
      usage_instructions,
      product_tags,
      featured_on_homepage = false
    } = body

    // Validate required fields
    if (!name || !sku || !price || !category_id) {
      return NextResponse.json({
        error: 'Missing required fields: name, sku, price, category_id'
      }, { status: 400 })
    }

    // Generate slug from name
    const slug = generateSlug(name)

    // Check if SKU or slug already exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id, sku, slug')
      .or(`sku.eq.${sku},slug.eq.${slug}`)
      .single()

    if (existingProduct) {
      if (existingProduct.sku === sku) {
        return NextResponse.json({ error: 'SKU already exists' }, { status: 400 })
      }
      if (existingProduct.slug === slug) {
        return NextResponse.json({ error: 'Product with similar name already exists' }, { status: 400 })
      }
    }

    // Prepare product data
    const productData = {
      name,
      slug,
      description,
      short_description,
      sku,
      category_id,
      price: parseFloat(price),
      compare_price: compare_price ? parseFloat(compare_price) : null,
      images: images ? JSON.stringify(images) : null,
      specifications: specifications ? JSON.stringify(specifications) : null,
      tags: tags || [],
      material,
      color,
      care_instructions,
      dimensions: dimensions ? JSON.stringify(dimensions) : null,
      weight: weight ? parseFloat(weight) : null,
      inventory_quantity: inventory_quantity || 0,
      track_inventory,
      allow_backorder,
      low_stock_threshold,
      is_featured,
      is_active,
      requires_shipping,
      is_digital,
      seo_title: seo_title || name,
      seo_description: seo_description || short_description,
      youtube_video_id,
      ar_model_url,
      capacity,
      material_details,
      usage_instructions,
      product_tags,
      featured_on_homepage
    }

    // Insert product
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert(productData)
      .select(`
        id,
        name,
        slug,
        sku,
        price,
        compare_price,
        inventory_quantity,
        is_active,
        is_featured,
        categories:category_id (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to create product',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    }, { status: 201 })

  } catch (error) {
    console.error('Admin products POST error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id, name, slug, sku')
      .eq('id', id)
      .single()

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // If name is being updated, generate new slug
    if (updateData.name && updateData.name !== existingProduct.name) {
      updateData.slug = generateSlug(updateData.name)
    }

    // Process JSON fields
    if (updateData.images && typeof updateData.images !== 'string') {
      updateData.images = JSON.stringify(updateData.images)
    }
    if (updateData.specifications && typeof updateData.specifications !== 'string') {
      updateData.specifications = JSON.stringify(updateData.specifications)
    }
    if (updateData.dimensions && typeof updateData.dimensions !== 'string') {
      updateData.dimensions = JSON.stringify(updateData.dimensions)
    }

    // Convert numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price)
    if (updateData.compare_price) updateData.compare_price = parseFloat(updateData.compare_price)
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight)
    if (updateData.inventory_quantity !== undefined) {
      updateData.inventory_quantity = parseInt(updateData.inventory_quantity)
    }

    // Update product
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select(`
        id,
        name,
        slug,
        sku,
        price,
        compare_price,
        inventory_quantity,
        is_active,
        is_featured,
        categories:category_id (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to update product',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    })

  } catch (error) {
    console.error('Admin products PUT error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id, name, sku')
      .eq('id', id)
      .single()

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete product (this will cascade to related tables)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to delete product',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      product: existingProduct
    })

  } catch (error) {
    console.error('Admin products DELETE error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}