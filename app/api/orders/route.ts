import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/service'
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/lib/email'

const supabase = createClient()

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return null
  }
  return session.user
}

// GET - Get user orders
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')

    // Build query for orders
    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        payment_status,
        payment_method,
        subtotal,
        tax_amount,
        shipping_amount,
        discount_amount,
        total_amount,
        currency,
        notes,
        created_at,
        updated_at,
        shipping_address,
        billing_address,
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          products (
            id,
            name,
            slug,
            images
          ),
          product_variants (
            id,
            name,
            sku
          )
        )
      `)
      .eq('user_id', user.id)

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply pagination and sorting
    query = query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    const { data: orders, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    // Calculate user stats
    const { data: allOrders } = await supabase
      .from('orders')
      .select('total_amount, status')
      .eq('user_id', user.id)

    const stats = {
      totalOrders: allOrders?.length || 0,
      totalSpent: allOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
      completedOrders: allOrders?.filter(order => order.status === 'delivered').length || 0,
      pendingOrders: allOrders?.filter(order => ['pending', 'processing', 'shipped'].includes(order.status)).length || 0
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: (offset + limit) < (count || 0)
      },
      stats
    })

  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new order (enhanced version)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle both old checkout format and new cart format
    const isOldFormat = body.items && body.customerInfo

    if (isOldFormat) {
      // Old format - from existing checkout
      const { items, customerInfo, shippingAddress, paymentMethod, paymentReference, subtotal, shipping, total } = body

      // Check if user is logged in
      const session = await getServerSession(authOptions)
      const userId = session?.user?.id || null

      // Generate order number
      const orderNumber = `CLF${Date.now()}${Math.floor(Math.random() * 1000)}`

      // Create order in database
      const orderData = {
        order_number: orderNumber,
        user_id: userId,
        subtotal: subtotal,
        tax_amount: 0,
        shipping_amount: shipping || 0,
        discount_amount: 0,
        total_amount: total,
        shipping_address: JSON.stringify(shippingAddress),
        billing_address: JSON.stringify(shippingAddress),
        payment_method: paymentMethod,
        payment_status: paymentMethod === "cod" ? "pending" : "paid",
        status: "processing",
        notes: JSON.stringify({
          products: items.map((item: any) => ({
            id: item.id || null,
            name: item.name || 'Unknown Product',
            image: item.image || '/traditional-terracotta-cooking-pots-and-vessels.jpg',
            price: item.price || 0,
            quantity: item.quantity || 1
          })),
          customer_email: customerInfo.email
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single()

      if (orderError) {
        console.error("Database insert failed:", orderError)
        return NextResponse.json({
          success: false,
          error: "Failed to create order in database",
          details: orderError.message
        }, { status: 500 })
      }

      // Create order items
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id || null,
        quantity: item.quantity || 1,
        unit_price: item.price || 0,
        total_price: (item.price || 0) * (item.quantity || 1),
        created_at: new Date().toISOString()
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

      if (itemsError) {
        console.error("Order items creation failed:", itemsError)
      }

      // Send confirmation email
      const emailData = {
        customerEmail: customerInfo.email,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        orderNumber: orderNumber,
        orderDate: new Date().toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        items: items.map((item: any) => ({
          name: item.name || 'Clay Product',
          quantity: item.quantity || 1,
          price: item.price || 0,
          image: item.image || '/traditional-terracotta-cooking-pots-and-vessels.jpg'
        })),
        subtotal: subtotal,
        shipping: shipping || 0,
        total: total,
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          phone: shippingAddress.phone
        },
        paymentMethod: paymentMethod,
        trackingUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/track-order?order=${orderNumber}`
      }

      try {
        const emailSent = await sendOrderConfirmationEmail(emailData)
        console.log(`Order confirmation email ${emailSent ? 'sent successfully' : 'failed'} to ${customerInfo.email}`)
      } catch (emailError) {
        console.error(`Email sending error:`, emailError)
      }

      // Send admin notification
      try {
        const adminNotificationData = {
          orderNumber: orderNumber,
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customerEmail: customerInfo.email,
          totalAmount: total,
          items: items.map((item: any) => ({
            name: item.name || 'Clay Product',
            quantity: item.quantity || 1,
            price: item.price || 0
          })),
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod
        }

        const adminNotificationResult = await sendOrderNotificationEmail(adminNotificationData)
        console.log(`Admin notification ${adminNotificationResult.success ? 'sent successfully' : 'failed'}: ${adminNotificationResult.message}`)
      } catch (adminEmailError) {
        console.error('Admin notification error:', adminEmailError)
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: orderNumber,
      })
    } else {
      // New format - from cart checkout (Phase 6 implementation)
      const user = await getAuthenticatedUser()

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { payment_method, payment_id, shipping_address, billing_address, notes } = body

      if (!payment_method || !shipping_address) {
        return NextResponse.json({
          error: 'Payment method and shipping address are required'
        }, { status: 400 })
      }

      // Get user's cart items
      const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          variant_id,
          products (
            id,
            name,
            price,
            inventory_quantity,
            track_inventory,
            is_active
          ),
          product_variants (
            id,
            price,
            inventory_quantity,
            is_active
          )
        `)
        .eq('user_id', user.id)

      if (cartError || !cartItems || cartItems.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
      }

      // Validate all items and calculate totals
      let subtotal = 0
      const orderItems = []

      for (const item of cartItems) {
        const product = item.products
        const variant = item.product_variants

        if (!product.is_active) {
          return NextResponse.json({
            error: `Product "${product.name}" is no longer available`
          }, { status: 400 })
        }

        if (variant && !variant.is_active) {
          return NextResponse.json({
            error: `Product variant is no longer available`
          }, { status: 400 })
        }

        // Check stock
        const stockToCheck = variant ? variant.inventory_quantity : product.inventory_quantity
        if (product.track_inventory && stockToCheck < item.quantity) {
          return NextResponse.json({
            error: `Insufficient stock for "${product.name}"`
          }, { status: 400 })
        }

        const unitPrice = variant ? variant.price : product.price
        const totalPrice = unitPrice * item.quantity
        subtotal += totalPrice

        orderItems.push({
          product_id: product.id,
          variant_id: variant?.id || null,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: totalPrice
        })
      }

      // Calculate totals
      const taxAmount = subtotal * 0.18 // 18% GST
      const shippingCost = subtotal >= 1499 ? 0 : 99 // Free shipping above ₹1499
      const totalAmount = subtotal + taxAmount + shippingCost

      // Generate order number
      const orderNumber = `CLF${Date.now()}${Math.floor(Math.random() * 1000)}`

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          payment_status: payment_method === 'razorpay' ? 'paid' : 'pending',
          payment_method,
          payment_id: payment_id || null,
          subtotal,
          tax_amount: taxAmount,
          shipping_amount: shippingCost,
          total_amount: totalAmount,
          currency: 'INR',
          shipping_address: JSON.stringify(shipping_address),
          billing_address: JSON.stringify(billing_address || shipping_address),
          notes: notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (orderError) {
        console.error('Order creation error:', orderError)
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
      }

      // Create order items
      const orderItemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: order.id,
        created_at: new Date().toISOString()
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsWithOrderId)

      if (itemsError) {
        console.error('Order items creation error:', itemsError)
        await supabase.from('orders').delete().eq('id', order.id)
        return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 })
      }

      // Update inventory
      for (const item of cartItems) {
        const product = item.products
        const variant = item.product_variants

        if (product.track_inventory) {
          if (variant) {
            await supabase
              .from('product_variants')
              .update({
                inventory_quantity: variant.inventory_quantity - item.quantity,
                updated_at: new Date().toISOString()
              })
              .eq('id', variant.id)
          } else {
            await supabase
              .from('products')
              .update({
                inventory_quantity: product.inventory_quantity - item.quantity,
                updated_at: new Date().toISOString()
              })
              .eq('id', product.id)
          }
        }
      }

      // Clear user's cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      return NextResponse.json({
        success: true,
        message: 'Order created successfully',
        orderId: order.id,
        orderNumber: orderNumber,
        totalAmount: totalAmount
      }, { status: 201 })
    }

  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to create order",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
