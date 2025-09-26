import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/service'
import { sendInvoiceEmail } from '@/lib/email'

const supabase = createClient()

// Razorpay webhook secret from environment
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET

interface RazorpayWebhookEvent {
  entity: string
  account_id: string
  event: string
  contains: string[]
  payload: {
    payment: {
      entity: {
        id: string
        amount: number
        currency: string
        status: string
        order_id: string
        invoice_id?: string
        method: string
        amount_refunded: number
        refund_status?: string
        captured: boolean
        description?: string
        card_id?: string
        bank?: string
        wallet?: string
        vpa?: string
        email: string
        contact: string
        notes: Record<string, any>
        fee: number
        tax: number
        error_code?: string
        error_description?: string
        error_source?: string
        error_step?: string
        error_reason?: string
        created_at: number
      }
    }
  }
}

// Verify Razorpay webhook signature
function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured')
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'utf8'),
    Buffer.from(expectedSignature, 'utf8')
  )
}

// Generate invoice automatically
async function generateInvoiceForOrder(orderId: string, paymentId: string) {
  try {
    // Generate invoice using our existing API logic
    const invoiceResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/invoices/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        sendEmail: true // Automatically send invoice email
      })
    })

    if (invoiceResponse.ok) {
      const invoiceData = await invoiceResponse.json()
      console.log(`Invoice generated and sent for order ${orderId}, payment ${paymentId}`)
      return invoiceData
    } else {
      const error = await invoiceResponse.text()
      console.error(`Failed to generate invoice for order ${orderId}:`, error)
      return null
    }
  } catch (error) {
    console.error(`Error generating invoice for order ${orderId}:`, error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      console.error('Missing Razorpay signature header')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid Razorpay webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event: RazorpayWebhookEvent = JSON.parse(body)

    console.log(`Received Razorpay webhook: ${event.event}`)

    // Handle payment captured event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity

      console.log(`Payment captured: ${payment.id} for order ${payment.order_id}`)

      // Find the order in our database using Razorpay order ID
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('razorpay_order_id', payment.order_id)
        .single()

      if (orderError) {
        console.error('Error finding order:', orderError)
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      if (!order) {
        console.error(`Order not found for Razorpay order ID: ${payment.order_id}`)
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // Update order with payment details
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          razorpay_payment_id: payment.id,
          payment_method: payment.method,
          status: 'confirmed', // Move from pending to confirmed
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id)

      if (updateError) {
        console.error('Error updating order:', updateError)
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
      }

      console.log(`Order ${order.id} updated with payment details`)

      // Generate and send invoice automatically
      try {
        await generateInvoiceForOrder(order.id, payment.id)
      } catch (invoiceError) {
        console.error('Error generating invoice:', invoiceError)
        // Don't fail the webhook if invoice generation fails
        // The payment was successful, so we should acknowledge it
      }

      return NextResponse.json({
        success: true,
        message: 'Payment processed and invoice generated',
        orderId: order.id,
        paymentId: payment.id
      })
    }

    // Handle payment failed event
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity

      console.log(`Payment failed: ${payment.id} for order ${payment.order_id}`)

      // Find and update the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('razorpay_order_id', payment.order_id)
        .single()

      if (!orderError && order) {
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            razorpay_payment_id: payment.id,
            payment_method: payment.method,
            status: 'failed',
            notes: payment.error_description || 'Payment failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id)

        console.log(`Order ${order.id} marked as failed`)
      }

      return NextResponse.json({
        success: true,
        message: 'Payment failure recorded',
        orderId: order?.id,
        paymentId: payment.id
      })
    }

    // Handle other events (optional)
    console.log(`Unhandled Razorpay event: ${event.event}`)

    return NextResponse.json({
      success: true,
      message: `Event ${event.event} acknowledged`
    })

  } catch (error) {
    console.error('Razorpay webhook error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET method for webhook testing (optional)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Razorpay webhook endpoint is active',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
}