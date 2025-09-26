import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'

async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return false
  }
  return true
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

    const supabase = createClient()

    // Build the query
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        price,
        inventory_quantity,
        is_active,
        images,
        description,
        created_at,
        updated_at,
        track_inventory,
        low_stock_threshold,
        categories:category_id (
          id,
          name,
          slug
        )
      `)

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply category filter
    if (category && category !== 'all') {
      query = query.eq('categories.slug', category)
    }

    // Apply status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        query = query.eq('is_active', true).gt('inventory_quantity', 5)
      } else if (status === 'low-stock') {
        query = query.eq('is_active', true).lte('inventory_quantity', 5).gt('inventory_quantity', 0)
      } else if (status === 'out-of-stock') {
        query = query.eq('inventory_quantity', 0)
      } else if (status === 'inactive') {
        query = query.eq('is_active', false)
      }
    }

    const { data: products, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    // Transform products for admin interface
    const transformedProducts = products?.map(product => {
      const stockLevel = product.inventory_quantity || 0
      const lowThreshold = product.low_stock_threshold || 5

      let stockStatus = 'Active'
      if (!product.is_active) {
        stockStatus = 'Inactive'
      } else if (stockLevel === 0) {
        stockStatus = 'Out of Stock'
      } else if (stockLevel <= lowThreshold) {
        stockStatus = 'Low Stock'
      }

      let images: string[] = []
      try {
        images = product.images ? JSON.parse(product.images) : []
      } catch {
        images = []
      }

      return {
        id: product.id,
        name: product.name,
        price: `₹${product.price}`,
        stock: stockLevel,
        category: product.categories?.name || 'Uncategorized',
        status: stockStatus,
        image: images[0] || '/placeholder.jpg',
        description: product.description || '',
        sku: product.sku,
        isActive: product.is_active,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      }
    }) || []

    // Calculate stats
    const totalProducts = transformedProducts.length
    const activeProducts = transformedProducts.filter(p => p.status === 'Active').length
    const lowStockProducts = transformedProducts.filter(p => p.status === 'Low Stock').length
    const outOfStockProducts = transformedProducts.filter(p => p.status === 'Out of Stock').length

    return NextResponse.json({
      products: transformedProducts,
      total: totalProducts,
      stats: {
        total: totalProducts,
        active: activeProducts,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts
      }
    })

  } catch (error) {
    console.error('Admin products API error:', error)
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
    const { name, price, stock, category, description, sku } = body

    // Validate required fields
    if (!name || !price || stock === undefined || !category || !sku) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if SKU already exists
    if (products.find(p => p.sku === sku)) {
      return NextResponse.json({ error: 'SKU already exists' }, { status: 400 })
    }

    // Determine status based on stock
    let status = 'Active'
    if (stock === 0) status = 'Out of Stock'
    else if (stock <= 5) status = 'Low Stock'

    const newProduct = {
      id: Math.max(...products.map(p => p.id)) + 1,
      name,
      price,
      stock: parseInt(stock),
      category,
      status,
      description: description || '',
      sku,
      image: "/placeholder.jpg"
    }

    products.push(newProduct)

    return NextResponse.json({
      message: 'Product created successfully',
      product: newProduct
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, name, price, stock, category, description, sku } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const productIndex = products.findIndex(p => p.id === parseInt(id))
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if SKU already exists for different product
    if (sku && products.find(p => p.sku === sku && p.id !== parseInt(id))) {
      return NextResponse.json({ error: 'SKU already exists' }, { status: 400 })
    }

    // Update product
    const updatedProduct = {
      ...products[productIndex],
      ...(name && { name }),
      ...(price && { price }),
      ...(stock !== undefined && { stock: parseInt(stock) }),
      ...(category && { category }),
      ...(description !== undefined && { description }),
      ...(sku && { sku })
    }

    // Update status based on stock
    if (stock !== undefined) {
      if (parseInt(stock) === 0) updatedProduct.status = 'Out of Stock'
      else if (parseInt(stock) <= 5) updatedProduct.status = 'Low Stock'
      else updatedProduct.status = 'Active'
    }

    products[productIndex] = updatedProduct

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  }

  const productIndex = products.findIndex(p => p.id === parseInt(id))
  if (productIndex === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const deletedProduct = products[productIndex]
  products.splice(productIndex, 1)

  return NextResponse.json({
    message: 'Product deleted successfully',
    product: deletedProduct
  })
}