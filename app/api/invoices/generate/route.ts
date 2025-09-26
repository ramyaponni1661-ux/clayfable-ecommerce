import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/service'
import { sendInvoiceEmail } from '@/lib/email'

const supabase = createClient()

async function checkAuth() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function POST(request: NextRequest) {
  try {
    const user = await checkAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, sendEmail = false } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Fetch order details with related data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:user_id (
          full_name,
          email,
          phone
        ),
        addresses:billing_address_id (
          full_name,
          street_address,
          city,
          state,
          postal_code,
          country
        ),
        shipping_addresses:shipping_address_id (
          full_name,
          street_address,
          city,
          state,
          postal_code,
          country
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if user can access this order (admin or order owner)
    const isAdmin = user.isAdmin
    const isOrderOwner = order.user_id === user.id

    if (!isAdmin && !isOrderOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Fetch order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products (
          name,
          sku,
          images
        )
      `)
      .eq('order_id', orderId)

    if (itemsError) {
      console.error('Error fetching order items:', itemsError)
      return NextResponse.json({ error: 'Failed to fetch order items' }, { status: 500 })
    }

    // Generate invoice number if not exists
    let invoiceNumber = order.invoice_number
    if (!invoiceNumber) {
      const invoiceDate = new Date()
      const year = invoiceDate.getFullYear()
      const month = String(invoiceDate.getMonth() + 1).padStart(2, '0')
      const day = String(invoiceDate.getDate()).padStart(2, '0')

      // Format: CF-YYYYMMDD-XXXX (Clayfable)
      const datePrefix = `CF-${year}${month}${day}`

      // Get the count of invoices for today to generate sequence number
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .not('invoice_number', 'is', null)
        .gte('created_at', `${year}-${month}-${day}T00:00:00.000Z`)
        .lt('created_at', `${year}-${month}-${day}T23:59:59.999Z`)

      const sequenceNumber = String((count || 0) + 1).padStart(4, '0')
      invoiceNumber = `${datePrefix}-${sequenceNumber}`

      // Update order with invoice number
      await supabase
        .from('orders')
        .update({
          invoice_number: invoiceNumber,
          invoice_date: new Date().toISOString()
        })
        .eq('id', orderId)
    }

    // Prepare invoice data
    const invoiceData = {
      invoiceNumber,
      invoiceDate: order.invoice_date || order.created_at,
      dueDate: order.created_at, // Immediate payment
      order: {
        id: order.id,
        orderNumber: order.order_number,
        orderDate: order.created_at,
        status: order.status,
        paymentStatus: order.payment_status,
        paymentMethod: order.payment_method,
        razorpayOrderId: order.razorpay_order_id,
        razorpayPaymentId: order.razorpay_payment_id,
        notes: order.notes
      },
      customer: {
        name: order.profiles?.full_name || 'Guest Customer',
        email: order.profiles?.email || order.guest_email,
        phone: order.profiles?.phone || order.guest_phone
      },
      billingAddress: order.addresses || {
        full_name: order.guest_name || order.profiles?.full_name,
        street_address: 'Address not provided',
        city: '',
        state: '',
        postal_code: '',
        country: 'India'
      },
      shippingAddress: order.shipping_addresses || order.addresses || {
        full_name: order.guest_name || order.profiles?.full_name,
        street_address: 'Address not provided',
        city: '',
        state: '',
        postal_code: '',
        country: 'India'
      },
      items: orderItems?.map(item => ({
        name: item.products?.name || 'Unknown Product',
        sku: item.products?.sku || 'N/A',
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: item.quantity * item.unit_price,
        image: item.products?.images ?
          (typeof item.products.images === 'string' ?
            JSON.parse(item.products.images)[0] :
            item.products.images[0]) : null
      })) || [],
      totals: {
        subtotal: order.subtotal_amount || 0,
        shippingCost: order.shipping_cost || 0,
        taxAmount: order.tax_amount || 0,
        discountAmount: order.discount_amount || 0,
        totalAmount: order.total_amount || 0
      },
      company: {
        name: 'Clayfable',
        address: 'Traditional Pottery & Handicrafts',
        city: 'India',
        email: 'info@clayfable.com',
        phone: '+91 9876543210',
        website: 'www.clayfable.com',
        gst: 'GST123456789' // Replace with actual GST number
      }
    }

    // If sendEmail is requested, send the invoice via email
    if (sendEmail && invoiceData.customer.email) {
      try {
        await sendInvoiceEmail(invoiceData.customer.email, invoiceData)
      } catch (emailError) {
        console.error('Failed to send invoice email:', emailError)
        // Don't fail the request if email fails, just log it
      }
    }

    return NextResponse.json({
      success: true,
      invoice: invoiceData,
      message: sendEmail ? 'Invoice generated and email sent' : 'Invoice generated successfully'
    })

  } catch (error) {
    console.error('Invoice generation error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET method to retrieve existing invoice
export async function GET(request: NextRequest) {
  try {
    const user = await checkAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Use the same logic as POST but just return existing data
    const response = await POST(request)
    return response

  } catch (error) {
    console.error('Invoice retrieval error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}