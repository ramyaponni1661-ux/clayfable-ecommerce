import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/service'
import { sendOrderNotificationEmail, sendWhatsAppNotification } from '@/lib/email'

async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return false
  }
  return true
}

// GET - Get notification settings and recent notifications
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'settings'

    switch (action) {
      case 'settings':
        // Get current notification settings
        const { data: settings, error: settingsError } = await supabase
          .from('notification_settings')
          .select('*')
          .single()

        if (settingsError && settingsError.code !== 'PGRST116') {
          return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
        }

        const defaultSettings = {
          email_notifications: true,
          email_address: 'support@clayfable.com',
          whatsapp_notifications: false,
          whatsapp_number: '',
          notification_events: {
            new_order: true,
            order_status_change: true,
            low_stock: true,
            payment_received: true,
            customer_signup: false
          }
        }

        return NextResponse.json({
          success: true,
          settings: settings || defaultSettings
        })

      case 'history':
        // Get recent notifications
        const { data: notifications, error: notificationsError } = await supabase
          .from('notifications_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (notificationsError) {
          return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          notifications: notifications || []
        })

      case 'test':
        // Test notification system
        const testResult = await sendOrderNotificationEmail({
          orderNumber: 'TEST-001',
          customerName: 'Test Customer',
          customerEmail: 'test@example.com',
          totalAmount: 999,
          items: [
            { name: 'Test Product', quantity: 1, price: 999 }
          ]
        })

        return NextResponse.json({
          success: true,
          message: 'Test notification sent',
          result: testResult
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Send notifications manually or update settings
export async function POST(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'send_order_notification':
        const { orderId } = data

        // Fetch order details
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              unit_price,
              products (name)
            )
          `)
          .eq('id', orderId)
          .single()

        if (orderError || !order) {
          return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Send email notification
        const shippingAddr = order.shipping_address ? JSON.parse(order.shipping_address) : null
        const notes = order.notes ? JSON.parse(order.notes) : null

        const emailResult = await sendOrderNotificationEmail({
          orderNumber: order.order_number,
          customerName: shippingAddr ? `${shippingAddr.firstName || ''} ${shippingAddr.lastName || ''}`.trim() : 'Guest',
          customerEmail: notes?.customer_email || shippingAddr?.email || '',
          totalAmount: order.total_amount,
          items: order.order_items.map((item: any) => ({
            name: item.products?.name || 'Unknown Product',
            quantity: item.quantity,
            price: item.unit_price
          })),
          shippingAddress: order.shipping_address,
          paymentMethod: order.payment_method
        })

        // Log notification
        await supabase
          .from('notifications_log')
          .insert({
            type: 'order_notification',
            recipient: 'support@clayfable.com',
            order_id: orderId,
            status: emailResult.success ? 'sent' : 'failed',
            message: emailResult.message || 'Order notification sent',
            created_at: new Date().toISOString()
          })

        return NextResponse.json({
          success: true,
          message: 'Order notification sent successfully',
          emailResult
        })

      case 'send_whatsapp':
        const { phone, message, orderId: whatsappOrderId } = data

        const whatsappResult = await sendWhatsAppNotification({
          phone,
          message,
          orderId: whatsappOrderId
        })

        // Log WhatsApp notification
        await supabase
          .from('notifications_log')
          .insert({
            type: 'whatsapp_notification',
            recipient: phone,
            order_id: whatsappOrderId,
            status: whatsappResult.success ? 'sent' : 'failed',
            message: whatsappResult.message || 'WhatsApp notification sent',
            created_at: new Date().toISOString()
          })

        return NextResponse.json({
          success: true,
          message: 'WhatsApp notification sent',
          result: whatsappResult
        })

      case 'update_settings':
        const { settings } = data

        // Update notification settings
        const { error: updateError } = await supabase
          .from('notification_settings')
          .upsert(settings)

        if (updateError) {
          return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          message: 'Notification settings updated successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Notification operation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Clear notification history
export async function DELETE(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    const { error } = await supabase
      .from('notifications_log')
      .delete()
      .lt('created_at', cutoffDate)

    if (error) {
      return NextResponse.json({ error: 'Failed to clear notifications' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Cleared notifications older than ${days} days`
    })

  } catch (error) {
    console.error('Clear notifications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}