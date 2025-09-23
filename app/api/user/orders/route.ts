import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

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

  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')

    // Get user ID from session
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Build query for orders with items - fetch both user orders and email orders
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_sku,
          variant_name,
          quantity,
          unit_price,
          total_price
        )
      `)
      .or(`customer_email.eq.${userEmail}${userId ? `,user_id.eq.${userId}` : ''}`)
      .order('created_at', { ascending: false })

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status.toLowerCase())
    }

    // Apply limit if provided
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    // Transform the data to match the frontend expectations
    const transformedOrders = orders?.map(order => ({
      id: order.order_number,
      orderId: order.id,
      userId: order.customer_email,
      date: new Date(order.created_at).toISOString().split('T')[0],
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      total: order.total_amount,
      items: order.order_items?.length || 0,
      image: order.order_items?.[0] ? "/traditional-terracotta-cooking-pots-and-vessels.jpg" : "/placeholder.jpg", // Default image for now
      trackingNumber: order.tracking_number,
      products: order.order_items?.map((item: any) => ({
        name: item.product_name,
        price: item.unit_price,
        quantity: item.quantity
      })) || [],
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_method,
      paymentReference: order.payment_reference
    })) || []

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

