import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock database - in production this would be replaced with actual database calls
let products = [
  { id: 1, name: "Traditional Clay Pot", price: "₹450", stock: 25, category: "Cookware", status: "Active", image: "/placeholder.jpg", description: "Handcrafted traditional clay pot perfect for cooking", sku: "TCP001" },
  { id: 2, name: "Decorative Vase", price: "₹890", stock: 5, category: "Decor", status: "Low Stock", image: "/placeholder.jpg", description: "Elegant decorative vase with intricate patterns", sku: "DV002" },
  { id: 3, name: "Terracotta Planter", price: "₹320", stock: 0, category: "Garden", status: "Out of Stock", image: "/placeholder.jpg", description: "Natural terracotta planter for indoor plants", sku: "TP003" },
  { id: 4, name: "Clay Water Bottle", price: "₹280", stock: 15, category: "Cookware", status: "Active", image: "/placeholder.jpg", description: "Eco-friendly clay water bottle", sku: "CWB004" },
  { id: 5, name: "Decorative Lamp", price: "₹650", stock: 8, category: "Decor", status: "Active", image: "/placeholder.jpg", description: "Handcrafted terracotta table lamp", sku: "DL005" },
  { id: 6, name: "Garden Pot Set", price: "₹1200", stock: 3, category: "Garden", status: "Low Stock", image: "/placeholder.jpg", description: "Set of 3 garden pots in different sizes", sku: "GPS006" },
]

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

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const status = searchParams.get('status')

  let filteredProducts = products

  if (search) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase())
    )
  }

  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    )
  }

  if (status && status !== 'all') {
    filteredProducts = filteredProducts.filter(product => {
      if (status === 'active') return product.status === 'Active'
      if (status === 'low-stock') return product.status === 'Low Stock'
      if (status === 'out-of-stock') return product.status === 'Out of Stock'
      return true
    })
  }

  return NextResponse.json({
    products: filteredProducts,
    total: filteredProducts.length,
    stats: {
      total: products.length,
      active: products.filter(p => p.status === 'Active').length,
      lowStock: products.filter(p => p.status === 'Low Stock').length,
      outOfStock: products.filter(p => p.status === 'Out of Stock').length
    }
  })
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