import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - Track guest order by email and order number
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { email, orderNumber } = body

    if (!email || !orderNumber) {
      return NextResponse.json({ error: 'Email and order number are required' }, { status: 400 })
    }

    // Fetch order with items
    const { data: order, error } = await supabase
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
      .eq('customer_email', email)
      .eq('order_number', orderNumber.toUpperCase())
      .single()

    if (error || !order) {
      return NextResponse.json({
        error: 'Order not found. Please check your email and order number.'
      }, { status: 404 })
    }

    // Transform the data to match frontend expectations
    const transformedOrder = {
      id: order.order_number,
      orderId: order.id,
      date: new Date(order.created_at).toISOString().split('T')[0],
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      total: order.total_amount,
      items: order.order_items?.length || 0,
      trackingNumber: order.tracking_number,
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      products: order.order_items?.map((item: any) => ({
        name: item.product_name,
        price: item.unit_price,
        quantity: item.quantity
      })) || [],
      estimatedDelivery: order.shipped_at
        ? new Date(new Date(order.shipped_at).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')
        : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')
    }

    return NextResponse.json({
      success: true,
      order: transformedOrder
    })
  } catch (error) {
    console.error('Error tracking order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}