import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

// Format state name from slug to proper name
function formatStateName(state: string): string {
  if (!state) return 'N/A'
  return state
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const orderNumber = searchParams.get('orderNumber')

    console.log('[track-order] Searching for order:', orderNumber)

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Fetch order with items
    const { data: order, error } = await supabase
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
      .eq('order_number', orderNumber)
      .single()

    console.log('[track-order] Database query result:', { order, error })

    if (error) {
      console.error('Error fetching order:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
    }

    // Parse product details from notes field if available (same logic as user orders API)
    let products = []
    if (order.notes) {
      try {
        const notesData = JSON.parse(order.notes)
        products = notesData.products || []
      } catch (e) {
        console.log('Failed to parse order notes for tracking:', e)
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
        console.log('Failed to parse shipping address for tracking:', e)
      }
    }

    // Transform the data to match frontend expectations
    const transformedOrder = {
      id: order.order_number,
      orderId: order.id,
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
        name: 'Customer',
        address: 'Customer Address',
        city: 'N/A',
        state: 'N/A',
        pincode: 'PIN Code',
        phone: 'Phone Number'
      },
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Unknown'
    }

    return NextResponse.json({ order: transformedOrder })
  } catch (error) {
    console.error('Error in track order API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}