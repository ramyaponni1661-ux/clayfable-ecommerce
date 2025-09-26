import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock orders database
let orders = [
  {
    id: "ORD001",
    customer: "Rajesh Kumar",
    email: "rajesh@example.com",
    amount: "₹2,450",
    status: "Pending",
    date: "2024-01-15",
    items: [
      { productId: 1, name: "Traditional Clay Pot", quantity: 2, price: "₹450" },
      { productId: 2, name: "Decorative Vase", quantity: 1, price: "₹890" }
    ],
    shippingAddress: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91 7418160520"
    }
  },
  {
    id: "ORD002",
    customer: "Priya Sharma",
    email: "priya@restaurant.com",
    amount: "₹1,890",
    status: "Shipped",
    date: "2024-01-14",
    trackingNumber: "TRK123456789",
    items: [
      { productId: 2, name: "Decorative Vase", quantity: 2, price: "₹890" }
    ],
    shippingAddress: {
      street: "456 Business District",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      phone: "+91 7418160521"
    }
  },
  {
    id: "ORD003",
    customer: "Amit Patel",
    email: "amit@example.com",
    amount: "₹3,200",
    status: "Delivered",
    date: "2024-01-13",
    deliveredDate: "2024-01-18",
    items: [
      { productId: 6, name: "Garden Pot Set", quantity: 2, price: "₹1200" },
      { productId: 4, name: "Clay Water Bottle", quantity: 4, price: "₹280" }
    ],
    shippingAddress: {
      street: "789 Garden Lane",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      phone: "+91 7418160522"
    }
  }
]

async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return false
  }
  return true
}

// GET - Fetch orders with optional filtering
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  let filteredOrders = orders

  if (status && status !== 'all') {
    filteredOrders = filteredOrders.filter(order =>
      order.status.toLowerCase() === status.toLowerCase()
    )
  }

  if (search) {
    filteredOrders = filteredOrders.filter(order =>
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase())
    )
  }

  if (startDate) {
    filteredOrders = filteredOrders.filter(order =>
      new Date(order.date) >= new Date(startDate)
    )
  }

  if (endDate) {
    filteredOrders = filteredOrders.filter(order =>
      new Date(order.date) <= new Date(endDate)
    )
  }

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    totalRevenue: orders.reduce((sum, order) => {
      const amount = parseInt(order.amount.replace(/[₹,]/g, ''))
      return sum + amount
    }, 0)
  }

  return NextResponse.json({
    orders: filteredOrders,
    stats
  })
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { orderId, status, trackingNumber, notes } = body

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 })
    }

    const orderIndex = orders.findIndex(o => o.id === orderId)
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update order
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      ...(trackingNumber && { trackingNumber }),
      ...(notes && { notes }),
      ...(status === 'Delivered' && { deliveredDate: new Date().toISOString().split('T')[0] })
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order: orders[orderIndex]
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// POST - Create manual order
export async function POST(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { customer, email, items, shippingAddress, notes } = body

    if (!customer || !email || !items || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      const price = parseInt(item.price.replace(/[₹,]/g, ''))
      return sum + (price * item.quantity)
    }, 0)

    // Generate order ID
    const orderNumber = Math.max(...orders.map(o => parseInt(o.id.replace('ORD', '')))) + 1
    const orderId = `ORD${orderNumber.toString().padStart(3, '0')}`

    const newOrder = {
      id: orderId,
      customer,
      email,
      amount: `₹${totalAmount.toLocaleString()}`,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      items,
      shippingAddress,
      ...(notes && { notes })
    }

    orders.push(newOrder)

    return NextResponse.json({
      message: 'Order created successfully',
      order: newOrder
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}