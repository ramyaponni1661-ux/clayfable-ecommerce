import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/service'

// Format state name from slug to proper name
function formatStateName(state: string): string {
  if (!state) return 'N/A'
  return state
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

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

  // For development: allow viewing all orders if not authenticated
  // In production, this should require authentication
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (!userEmail && !isDevelopment) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const orderNumber = searchParams.get('orderNumber')

    // Get user ID from session
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Build query for orders with items - fetch user orders by user_id
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          total_price
        )
      `)

    // Filter by user_id if available, otherwise fetch all (for development)
    if (userId) {
      query = query.eq('user_id', userId)
    }

    query = query.order('created_at', { ascending: false })

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status.toLowerCase())
    }

    // Apply order number filter if provided
    if (orderNumber) {
      query = query.eq('order_number', orderNumber)
    }

    // Apply limit if provided
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({
        orders: [],
        stats: {
          totalOrders: 0,
          totalSpent: 0,
          loyaltyPoints: 0,
          recentOrders: []
        }
      })
    }

    // Transform the data to match the frontend expectations
    const transformedOrders = orders?.map(order => {
      // Parse product details from notes field if available
      let products = []
      let customerEmail = null

      if (order.notes) {
        try {
          const notesData = JSON.parse(order.notes)
          products = notesData.products || []
          customerEmail = notesData.customer_email
        } catch (e) {
          console.log('Failed to parse order notes:', e)
        }
      }

      // Fallback to order_items if no products in notes
      if (products.length === 0) {
        products = order.order_items?.map((item: any) => ({
          name: 'Clay Product',
          price: item.unit_price,
          quantity: item.quantity,
          image: "/traditional-terracotta-cooking-pots-and-vessels.jpg"
        })) || []
      }

      // Parse shipping address
      let parsedShippingAddress = null
      if (order.shipping_address) {
        try {
          parsedShippingAddress = typeof order.shipping_address === 'string'
            ? JSON.parse(order.shipping_address)
            : order.shipping_address
        } catch (e) {
          console.log('Failed to parse shipping address:', e)
        }
      }

      return {
        id: order.order_number,
        orderId: order.id,
        orderNumber: order.order_number, // Add explicit orderNumber field
        userId: customerEmail || order.customer_email,
        date: new Date(order.created_at).toISOString().split('T')[0],
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        total: order.total_amount,
        items: products.map(product => ({
          id: product.id || 'unknown',
          name: product.name || 'Unknown Product',
          quantity: product.quantity || 1,
          price: product.price || 0,
          image: product.image || "/traditional-terracotta-cooking-pots-and-vessels.jpg"
        })),
        image: products[0]?.image || "/traditional-terracotta-cooking-pots-and-vessels.jpg",
        trackingNumber: order.tracking_number,
        products: products,
        shippingAddress: parsedShippingAddress ? {
          name: `${parsedShippingAddress.firstName || ''} ${parsedShippingAddress.lastName || ''}`.trim(),
          address: parsedShippingAddress.address || 'N/A',
          city: parsedShippingAddress.city || 'N/A',
          state: formatStateName(parsedShippingAddress.state || 'N/A'),
          pincode: parsedShippingAddress.pincode || 'N/A',
          phone: parsedShippingAddress.phone || 'N/A'
        } : {
          name: 'N/A',
          address: 'N/A',
          city: 'N/A',
          state: 'N/A',
          pincode: 'N/A',
          phone: 'N/A'
        },
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Unknown'
      }
    }) || []

    // Calculate user stats
    const totalSpent = transformedOrders.reduce((sum, order) => sum + order.total, 0)
    const loyaltyPoints = Math.floor(totalSpent * 0.1)

    return NextResponse.json({
      orders: transformedOrders,
      stats: {
        totalOrders: transformedOrders.length,
        totalSpent,
        loyaltyPoints,
        recentOrders: transformedOrders.slice(0, 3)
      }
    })
  } catch (error) {
    console.error('Error in orders API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

