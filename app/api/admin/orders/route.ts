import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/service'
import { sendOrderUpdate } from '@/lib/order-notifications'

async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return false
  }
  return true
}

// GET - Fetch orders with enterprise-level filtering and analytics
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)

    // Enterprise filtering parameters
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const paymentStatus = searchParams.get('paymentStatus')
    const paymentMethod = searchParams.get('paymentMethod')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // Build comprehensive query with joins
    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        user_id,
        status,
        payment_status,
        payment_method,
        subtotal,
        tax_amount,
        shipping_amount,
        discount_amount,
        total_amount,
        currency,
        shipping_address,
        billing_address,
        notes,
        tracking_number,
        created_at,
        updated_at,
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

    // Apply enterprise-level filters
    if (status && status !== 'all') {
      query = query.eq('status', status.toLowerCase())
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query = query.eq('payment_status', paymentStatus.toLowerCase())
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query = query.eq('payment_method', paymentMethod.toLowerCase())
    }

    if (startDate) {
      query = query.gte('created_at', new Date(startDate).toISOString())
    }

    if (endDate) {
      query = query.lte('created_at', new Date(endDate).toISOString())
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%`)
    }

    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    const { data: orders, error: ordersError, count } = await query

    if (ordersError) {
      console.error('Admin orders fetch error:', ordersError)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    // Get comprehensive statistics
    const { data: allOrders, error: statsError } = await supabase
      .from('orders')
      .select('status, payment_status, total_amount, created_at')

    const stats = {
      total: allOrders?.length || 0,
      pending: allOrders?.filter(o => o.status === 'pending').length || 0,
      processing: allOrders?.filter(o => o.status === 'processing').length || 0,
      shipped: allOrders?.filter(o => o.status === 'shipped').length || 0,
      delivered: allOrders?.filter(o => o.status === 'delivered').length || 0,
      cancelled: allOrders?.filter(o => o.status === 'cancelled').length || 0,
      totalRevenue: allOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0,
      averageOrderValue: allOrders?.length ? (allOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0) / allOrders.length) : 0,
      todayOrders: allOrders?.filter(o => {
        const today = new Date().toISOString().split('T')[0]
        return o.created_at.startsWith(today)
      }).length || 0,
      thisWeekRevenue: allOrders?.filter(o => {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        return o.created_at >= weekAgo
      }).reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0,
      paymentStats: {
        paid: allOrders?.filter(o => o.payment_status === 'paid').length || 0,
        pending: allOrders?.filter(o => o.payment_status === 'pending').length || 0,
        failed: allOrders?.filter(o => o.payment_status === 'failed').length || 0,
        refunded: allOrders?.filter(o => o.payment_status === 'refunded').length || 0
      }
    }

    // Transform orders for frontend - keep raw structure for component
    const transformedOrders = orders?.map(order => {
      // Parse JSON fields but keep them as objects
      let shippingAddr = null
      let billingAddr = null
      let notesData = {}

      try {
        shippingAddr = order.shipping_address ?
          (typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address) : null
      } catch (e) {
        console.error('Failed to parse shipping_address:', e)
      }

      try {
        billingAddr = order.billing_address ?
          (typeof order.billing_address === 'string' ? JSON.parse(order.billing_address) : order.billing_address) : null
      } catch (e) {
        console.error('Failed to parse billing_address:', e)
      }

      try {
        notesData = order.notes ?
          (typeof order.notes === 'string' ? JSON.parse(order.notes) : order.notes) : {}
      } catch (e) {
        console.error('Failed to parse notes:', e)
      }

      // Extract customer email from notes or addresses
      const customerEmail = notesData?.customer_email || billingAddr?.email || shippingAddr?.email || 'N/A'

      const transformed = {
        id: order.id,
        order_number: order.order_number,
        user_id: order.user_id,
        status: order.status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        subtotal: order.subtotal || 0,
        tax_amount: order.tax_amount || 0,
        shipping_amount: order.shipping_amount || 0,
        discount_amount: order.discount_amount || 0,
        total_amount: order.total_amount || 0,
        currency: order.currency || 'INR',
        shipping_address: shippingAddr,
        billing_address: billingAddr,
        notes: notesData,
        tracking_number: order.tracking_number,
        created_at: order.created_at,
        updated_at: order.updated_at,
        customer_email: customerEmail,
        items: order.order_items || []
      }

      return transformed
    }) || []

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      stats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: (offset + limit) < (count || 0)
      }
    })

  } catch (error) {
    console.error('Admin orders API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Enterprise order status management with audit trail
export async function PUT(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const {
      orderId,
      status,
      paymentStatus,
      trackingNumber,
      notes,
      adminNotes,
      estimatedDelivery,
      shippingCarrier,
      fulfillmentCenter
    } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Validate status values
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded']

    if (status && !validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 })
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 })
    }

    // Get current order for audit trail
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderId)
      .single()

    if (fetchError || !currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (status) updateData.status = status.toLowerCase()
    if (paymentStatus) updateData.payment_status = paymentStatus.toLowerCase()
    if (trackingNumber !== undefined) updateData.tracking_number = trackingNumber
    if (notes !== undefined) updateData.notes = notes

    // Add delivery date for delivered orders
    if (status?.toLowerCase() === 'delivered' && !currentOrder.delivered_at) {
      updateData.delivered_at = new Date().toISOString()
    }

    // Update order in database
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('order_number', orderId)
      .select()
      .single()

    if (updateError) {
      console.error('Order update error:', updateError)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    // Create audit trail entry
    const auditData = {
      order_id: currentOrder.id,
      action: 'status_update',
      old_values: {
        status: currentOrder.status,
        payment_status: currentOrder.payment_status,
        tracking_number: currentOrder.tracking_number
      },
      new_values: {
        status: updateData.status || currentOrder.status,
        payment_status: updateData.payment_status || currentOrder.payment_status,
        tracking_number: updateData.tracking_number
      },
      admin_notes: adminNotes,
      created_at: new Date().toISOString()
    }

    // Insert audit trail (if audit table exists)
    const { error: auditError } = await supabase
      .from('order_audit_log')
      .insert(auditData)

    if (auditError) {
      console.log('Audit log not available:', auditError.message)
    }

    // Send notification to customer (if status changed)
    const statusChanged = status && status.toLowerCase() !== currentOrder.status
    const trackingChanged = trackingNumber && trackingNumber !== currentOrder.tracking_number

    if (statusChanged || trackingChanged) {
      try {
        // Parse order data for notification
        let shippingAddress = currentOrder.shipping_address
        let products = []
        let customerEmail = currentOrder.customer_email

        try {
          shippingAddress = typeof currentOrder.shipping_address === 'string'
            ? JSON.parse(currentOrder.shipping_address)
            : currentOrder.shipping_address
        } catch (e) {
          console.error('Failed to parse shipping address:', e)
        }

        try {
          const notes = JSON.parse(currentOrder.notes || '{}')
          products = notes.products || []
          customerEmail = notes.customer_email || customerEmail
        } catch (e) {
          console.error('Failed to parse order notes:', e)
        }

        // Send notification
        const notificationResult = await sendOrderUpdate({
          orderNumber: currentOrder.order_number,
          customerEmail: customerEmail,
          customerName: `${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}`.trim() || 'Customer',
          orderDate: currentOrder.created_at,
          status: status?.toLowerCase() || currentOrder.status,
          total: currentOrder.total_amount,
          trackingNumber: trackingNumber || currentOrder.tracking_number || undefined,
          items: products.map((p: any) => ({
            name: p.name || 'Product',
            quantity: p.quantity || 1,
            price: p.price || 0,
            image: p.image || undefined,
          })),
          shippingAddress: {
            firstName: shippingAddress?.firstName || '',
            lastName: shippingAddress?.lastName || '',
            address: shippingAddress?.address || '',
            city: shippingAddress?.city || '',
            state: shippingAddress?.state || '',
            pincode: shippingAddress?.pincode || '',
            phone: shippingAddress?.phone || '',
          },
          paymentMethod: currentOrder.payment_method,
          estimatedDelivery: updateData.estimated_delivery || undefined,
        })

        console.log(`Notification sent for order ${orderId}:`, notificationResult)
      } catch (notifError) {
        console.error('Failed to send notification:', notifError)
        // Don't fail the entire request if notification fails
      }
    }

    // Return updated order with additional details
    const { data: orderWithDetails, error: detailsError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          products (
            name,
            images
          )
        )
      `)
      .eq('id', updatedOrder.id)
      .single()

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: orderWithDetails || updatedOrder,
      auditTrail: auditData
    })

  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Enterprise manual order creation
export async function POST(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const {
      customerEmail,
      customerName,
      customerPhone,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod = 'admin_created',
      status = 'pending',
      notes,
      adminNotes,
      discountAmount = 0,
      shippingAmount = 0,
      taxRate = 0.18
    } = body

    // Validate required fields
    if (!customerEmail || !items || !items.length || !shippingAddress) {
      return NextResponse.json({
        error: 'Missing required fields: customerEmail, items, shippingAddress'
      }, { status: 400 })
    }

    // Validate and calculate order totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        return NextResponse.json({
          error: 'Each item must have productId, quantity, and price'
        }, { status: 400 })
      }

      // Verify product exists
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, price, inventory_quantity, track_inventory')
        .eq('id', item.productId)
        .single()

      if (productError || !product) {
        return NextResponse.json({
          error: `Product not found: ${item.productId}`
        }, { status: 400 })
      }

      // Check inventory
      if (product.track_inventory && product.inventory_quantity < item.quantity) {
        return NextResponse.json({
          error: `Insufficient inventory for product: ${product.name}`
        }, { status: 400 })
      }

      const itemTotal = item.price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: itemTotal
      })
    }

    // Calculate totals
    const taxAmount = subtotal * taxRate
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount

    // Generate order number
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
    const orderNumber = `CLF-${randomSuffix}${timestamp.toString().slice(-6)}`

    // Find or create customer
    let customerId = null
    const [firstName, ...lastNameParts] = (customerName || '').split(' ')
    const lastName = lastNameParts.join(' ') || ''

    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', customerEmail)
      .single()

    if (existingUser) {
      customerId = existingUser.id
    } else if (customerName) {
      // Create new user profile for manual orders
      const { data: newUser, error: userError } = await supabase
        .from('profiles')
        .insert({
          email: customerEmail,
          first_name: firstName,
          last_name: lastName,
          phone: customerPhone,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (!userError && newUser) {
        customerId = newUser.id
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: customerId,
        status: status.toLowerCase(),
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
        payment_method: paymentMethod,
        subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        currency: 'INR',
        shipping_address: JSON.stringify(shippingAddress),
        billing_address: JSON.stringify(billingAddress || shippingAddress),
        notes,
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
      // Rollback order creation
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 })
    }

    // Update inventory
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('inventory_quantity, track_inventory')
        .eq('id', item.productId)
        .single()

      if (product?.track_inventory) {
        await supabase
          .from('products')
          .update({
            inventory_quantity: product.inventory_quantity - item.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.productId)
      }
    }

    // Create audit trail
    const auditData = {
      order_id: order.id,
      action: 'manual_creation',
      admin_notes: adminNotes || 'Order created manually by admin',
      created_at: new Date().toISOString()
    }

    const { error: auditError2 } = await supabase
      .from('order_audit_log')
      .insert(auditData)

    if (auditError2) {
      console.log('Audit log not available:', auditError2.message)
    }

    // Fetch complete order details
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          products (
            id,
            name,
            images
          )
        )
      `)
      .eq('id', order.id)
      .single()

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: completeOrder || order,
      orderNumber,
      totalAmount
    }, { status: 201 })

  } catch (error) {
    console.error('Manual order creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Bulk operations for enterprise management
export async function PATCH(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const { operation, orderIds, data } = body

    if (!operation || !orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({
        error: 'Missing required fields: operation, orderIds'
      }, { status: 400 })
    }

    let results = []
    let errors = []

    switch (operation) {
      case 'bulk_status_update':
        if (!data.status) {
          return NextResponse.json({ error: 'Status is required for bulk update' }, { status: 400 })
        }

        for (const orderId of orderIds) {
          try {
            const { data: updatedOrder, error } = await supabase
              .from('orders')
              .update({
                status: data.status.toLowerCase(),
                updated_at: new Date().toISOString()
              })
              .eq('order_number', orderId)
              .select()
              .single()

            if (error) {
              errors.push({ orderId, error: error.message })
            } else {
              results.push(updatedOrder)

              // Create audit trail
              const { error: bulkAuditError } = await supabase
                .from('order_audit_log')
                .insert({
                  order_id: updatedOrder.id,
                  action: 'bulk_status_update',
                  new_values: { status: data.status.toLowerCase() },
                  admin_notes: data.adminNotes || 'Bulk status update by admin',
                  created_at: new Date().toISOString()
                })

              if (bulkAuditError) {
                console.log('Audit log error:', bulkAuditError.message)
              }
            }
          } catch (err) {
            errors.push({ orderId, error: 'Update failed' })
          }
        }
        break

      case 'bulk_payment_status_update':
        if (!data.paymentStatus) {
          return NextResponse.json({ error: 'Payment status is required' }, { status: 400 })
        }

        for (const orderId of orderIds) {
          try {
            const { data: updatedOrder, error } = await supabase
              .from('orders')
              .update({
                payment_status: data.paymentStatus.toLowerCase(),
                updated_at: new Date().toISOString()
              })
              .eq('order_number', orderId)
              .select()
              .single()

            if (error) {
              errors.push({ orderId, error: error.message })
            } else {
              results.push(updatedOrder)
            }
          } catch (err) {
            errors.push({ orderId, error: 'Update failed' })
          }
        }
        break

      case 'bulk_archive':
        // Archive orders (soft delete)
        for (const orderId of orderIds) {
          try {
            const { data: updatedOrder, error } = await supabase
              .from('orders')
              .update({
                status: 'archived',
                archived_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('order_number', orderId)
              .select()
              .single()

            if (error) {
              errors.push({ orderId, error: error.message })
            } else {
              results.push(updatedOrder)
            }
          } catch (err) {
            errors.push({ orderId, error: 'Archive failed' })
          }
        }
        break

      case 'bulk_export':
        // Export order data
        const { data: orders, error: exportError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (name, sku)
            )
          `)
          .in('order_number', orderIds)

        if (exportError) {
          return NextResponse.json({ error: 'Export failed' }, { status: 500 })
        }

        // Transform for CSV export
        const exportData = orders.map(order => {
          const shippingAddr = order.shipping_address ? JSON.parse(order.shipping_address) : null
          const notes = order.notes ? JSON.parse(order.notes) : null

          return {
            order_number: order.order_number,
            customer_name: shippingAddr ? `${shippingAddr.firstName || ''} ${shippingAddr.lastName || ''}`.trim() : 'Guest',
            customer_email: notes?.customer_email || shippingAddr?.email || 'N/A',
            customer_phone: shippingAddr?.phone || 'N/A',
            status: order.status,
            payment_status: order.payment_status,
            payment_method: order.payment_method,
            total_amount: order.total_amount,
            created_at: order.created_at,
            items_count: order.order_items?.length || 0,
            items_detail: order.order_items?.map(item =>
              `${item.products?.name || 'Unknown'} (Qty: ${item.quantity})`
            ).join('; ') || 'N/A'
          }
        })

        return NextResponse.json({
          success: true,
          operation: 'bulk_export',
          data: exportData,
          count: exportData.length
        })

      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      operation,
      processed: results.length,
      errors: errors.length,
      results: results.slice(0, 5), // Limit response size
      errorDetails: errors
    })

  } catch (error) {
    console.error('Bulk operation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}