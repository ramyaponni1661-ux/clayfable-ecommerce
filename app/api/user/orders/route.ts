import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock user orders database - in production this would be replaced with actual database calls
let userOrders = [
  {
    id: "CLF-ABC123",
    userId: "user1@example.com",
    date: "2024-01-15",
    status: "Delivered",
    total: 2097,
    items: 3,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
    products: [
      { name: "Traditional Clay Pot", price: 599, quantity: 2 },
      { name: "Clay Water Bottle", price: 899, quantity: 1 }
    ],
    shippingAddress: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    }
  },
  {
    id: "CLF-DEF456",
    userId: "user1@example.com",
    date: "2024-01-10",
    status: "In Transit",
    total: 1299,
    items: 1,
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
    trackingNumber: "TRK123456789",
    products: [
      { name: "Decorative Vase", price: 1299, quantity: 1 }
    ],
    shippingAddress: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    }
  },
  {
    id: "CLF-GHI789",
    userId: "user1@example.com",
    date: "2024-01-05",
    status: "Processing",
    total: 899,
    items: 2,
    image: "/decorative-terracotta-vases-and-planters.jpg",
    products: [
      { name: "Terracotta Planter", price: 320, quantity: 1 },
      { name: "Garden Pot Set", price: 579, quantity: 1 }
    ],
    shippingAddress: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    }
  }
]

async function checkUserAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return null
  }
  return session.user.email
}

// GET - Fetch user orders
export async function GET(request: NextRequest) {
  const userEmail = await checkUserAuth()
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = searchParams.get('limit')

  let filteredOrders = userOrders.filter(order => order.userId === userEmail)

  if (status && status !== 'all') {
    filteredOrders = filteredOrders.filter(order =>
      order.status.toLowerCase() === status.toLowerCase()
    )
  }

  if (limit) {
    filteredOrders = filteredOrders.slice(0, parseInt(limit))
  }

  // Calculate user stats
  const totalSpent = filteredOrders.reduce((sum, order) => sum + order.total, 0)
  const loyaltyPoints = Math.floor(totalSpent * 0.1)

  return NextResponse.json({
    orders: filteredOrders,
    stats: {
      totalOrders: filteredOrders.length,
      totalSpent,
      loyaltyPoints,
      recentOrders: filteredOrders.slice(0, 3)
    }
  })
}

// POST - Create new order (for testing purposes)
export async function POST(request: NextRequest) {
  const userEmail = await checkUserAuth()
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { products, shippingAddress, total } = body

    if (!products || !shippingAddress || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newOrder = {
      id: `CLF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: userEmail,
      date: new Date().toISOString().split('T')[0],
      status: "Processing",
      total,
      items: products.length,
      image: products[0]?.image || "/placeholder.jpg",
      products,
      shippingAddress
    }

    userOrders.push(newOrder)

    return NextResponse.json({
      message: 'Order created successfully',
      order: newOrder
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}