import * as nodemailer from 'nodemailer'

// Format state name from slug to proper name
function formatStateName(state: string): string {
  if (!state) return 'N/A'
  return state
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Create transporter for GoDaddy Email
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
  return transporter
}

interface OrderNotificationData {
  orderNumber: string
  customerEmail: string
  customerName: string
  orderDate: string
  status: string
  total: number
  trackingNumber?: string
  items: Array<{
    name: string
    quantity: number
    price: number
    image?: string
  }>
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  paymentMethod: string
  estimatedDelivery?: string
}

// Generate email templates for each status
const generateStatusEmailHTML = (data: OrderNotificationData, statusType: string) => {
  const baseStyles = `
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
      .container { max-width: 600px; margin: 0 auto; background: white; }
      .header { background: linear-gradient(135deg, #ea580c, #dc2626); color: white; padding: 30px 20px; text-align: center; }
      .header h1 { margin: 0; font-size: 28px; }
      .status-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 20px; margin-top: 10px; font-weight: 600; }
      .content { padding: 30px 20px; }
      .status-icon { font-size: 48px; text-align: center; margin: 20px 0; }
      .order-summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
      .info-row:last-child { border-bottom: none; }
      .tracking-box { background: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
      .tracking-number { font-size: 24px; font-weight: bold; color: #065f46; font-family: 'Courier New', monospace; letter-spacing: 2px; }
      .btn { display: inline-block; background: #ea580c; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; margin: 10px 5px; }
      .timeline { margin: 30px 0; }
      .timeline-item { display: flex; align-items: flex-start; margin: 15px 0; }
      .timeline-icon { min-width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 20px; }
      .timeline-icon.completed { background: #10b981; color: white; }
      .timeline-icon.current { background: #ea580c; color: white; }
      .timeline-icon.pending { background: #e0e0e0; color: #666; }
      .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
    </style>
  `

  let statusIcon = ''
  let statusTitle = ''
  let statusMessage = ''
  let additionalContent = ''

  switch (statusType) {
    case 'confirmed':
      statusIcon = '✅'
      statusTitle = 'Order Confirmed!'
      statusMessage = 'Your order has been confirmed and is being prepared by our artisans.'
      break

    case 'processing':
      statusIcon = '🏺'
      statusTitle = 'Order in Production'
      statusMessage = 'Our skilled artisans are carefully handcrafting your terracotta products.'
      additionalContent = `
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>🎨 Handcrafted with Care</strong></p>
          <p style="margin: 10px 0 0 0; color: #92400e;">Each piece is individually crafted using traditional techniques passed down through generations.</p>
        </div>
      `
      break

    case 'shipped':
      statusIcon = '📦'
      statusTitle = 'Order Shipped!'
      statusMessage = 'Great news! Your order is on its way to you.'
      additionalContent = data.trackingNumber ? `
        <div class="tracking-box">
          <p style="margin: 0 0 10px 0; font-size: 16px; color: #065f46;">Tracking Number</p>
          <div class="tracking-number">${data.trackingNumber}</div>
          <p style="margin: 15px 0 0 0; color: #065f46;">Use this number to track your shipment</p>
          ${data.estimatedDelivery ? `<p style="margin: 10px 0 0 0; color: #065f46;"><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>` : ''}
        </div>
        <div style="text-align: center;">
          <a href="https://www.clayfable.com/track-order?order=${data.orderNumber}" class="btn">Track Your Order</a>
        </div>
      ` : ''
      break

    case 'out_for_delivery':
      statusIcon = '🚚'
      statusTitle = 'Out for Delivery!'
      statusMessage = 'Your order is out for delivery and will reach you soon.'
      additionalContent = `
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 18px; color: #92400e;"><strong>📍 Delivery Today</strong></p>
          <p style="margin: 10px 0 0 0; color: #92400e;">Please keep your phone handy. Our delivery partner will contact you shortly.</p>
        </div>
      `
      break

    case 'delivered':
      statusIcon = '🎉'
      statusTitle = 'Order Delivered!'
      statusMessage = 'Your order has been successfully delivered. We hope you love your new terracotta products!'
      additionalContent = `
        <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 18px; color: #065f46;"><strong>Thank You for Your Purchase!</strong></p>
          <p style="margin: 10px 0; color: #065f46;">We'd love to hear about your experience.</p>
          <a href="https://www.clayfable.com/products" class="btn" style="background: #10b981;">Shop Again</a>
        </div>
        <div style="margin: 20px 0; padding: 20px; border: 2px dashed #ea580c; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #ea580c;">📸 Share Your Experience</p>
          <p style="margin: 0; color: #666;">Tag us on social media @clayfable and show how you're using your terracotta products!</p>
        </div>
      `
      break

    case 'cancelled':
      statusIcon = '❌'
      statusTitle = 'Order Cancelled'
      statusMessage = 'Your order has been cancelled as requested.'
      additionalContent = `
        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #991b1b;">Refund Information</p>
          <p style="margin: 0; color: #991b1b;">If you've already made the payment, the refund will be processed within 5-7 business days.</p>
        </div>
      `
      break

    default:
      statusIcon = '📋'
      statusTitle = 'Order Update'
      statusMessage = 'There has been an update to your order.'
  }

  const itemsHTML = data.items.map(item => {
    // Ensure full URL for images
    let imageUrl = item.image || ''
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `https://www.clayfable.com${imageUrl}`
    }

    return `
    <div style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #e0e0e0;">
      ${imageUrl ? `<img src="${imageUrl}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 15px; display: block; border: 1px solid #e0e0e0;">` : '<div style="width: 80px; height: 80px; background: #f3f4f6; border-radius: 8px; margin-right: 15px; display: flex; align-items: center; justify-content: center; font-size: 32px;">🏺</div>'}
      <div style="flex: 1;">
        <div style="font-weight: 600; color: #333; font-size: 15px;">${item.name}</div>
        <div style="color: #666; font-size: 14px; margin-top: 4px;">Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}</div>
      </div>
      <div style="font-weight: 600; color: #ea580c; font-size: 16px;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
    </div>
  `
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${statusTitle} - Order ${data.orderNumber}</title>
      ${baseStyles}
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🏺 CLAYFABLE</h1>
          <div class="status-badge">${statusTitle}</div>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Status Icon -->
          <div class="status-icon">${statusIcon}</div>

          <!-- Greeting -->
          <p style="font-size: 18px; margin: 0 0 10px 0;">Hi ${data.customerName},</p>
          <p style="font-size: 16px; color: #666; margin: 0 0 20px 0;">${statusMessage}</p>

          <!-- Additional Content -->
          ${additionalContent}

          <!-- Order Summary -->
          <div class="order-summary">
            <h3 style="margin: 0 0 15px 0; color: #ea580c;">Order Summary</h3>
            <div class="info-row">
              <span>Order Number</span>
              <strong>${data.orderNumber}</strong>
            </div>
            <div class="info-row">
              <span>Order Date</span>
              <strong>${new Date(data.orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
            </div>
            <div class="info-row">
              <span>Status</span>
              <strong style="color: #ea580c; text-transform: capitalize;">${data.status}</strong>
            </div>
            <div class="info-row">
              <span>Total Amount</span>
              <strong style="color: #ea580c; font-size: 18px;">₹${data.total.toLocaleString('en-IN')}</strong>
            </div>
            ${data.trackingNumber ? `
            <div class="info-row">
              <span>Tracking Number</span>
              <strong style="font-family: monospace;">${data.trackingNumber}</strong>
            </div>
            ` : ''}
          </div>

          <!-- Items -->
          <div style="margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0; color: #ea580c;">Order Items</h3>
            ${itemsHTML}
          </div>

          <!-- Shipping Address -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #ea580c;">Delivery Address</h3>
            <p style="margin: 5px 0; font-weight: 600;">${data.shippingAddress.firstName} ${data.shippingAddress.lastName}</p>
            <p style="margin: 5px 0; color: #666;">${data.shippingAddress.address}</p>
            <p style="margin: 5px 0; color: #666;">${data.shippingAddress.city}, ${formatStateName(data.shippingAddress.state)} ${data.shippingAddress.pincode}</p>
            <p style="margin: 5px 0; color: #666;">Phone: ${data.shippingAddress.phone}</p>
          </div>

          <!-- Action Buttons -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.clayfable.com/track-order?order=${data.orderNumber}" class="btn">Track Order</a>
            <a href="https://www.clayfable.com/account/orders" class="btn" style="background: #6b7280;">View All Orders</a>
          </div>

          <!-- Support -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #333;">Need Help?</p>
            <p style="margin: 0 0 15px 0; color: #666;">Our customer support team is here to assist you.</p>
            <div>
              <a href="mailto:support@clayfable.com" style="color: #ea580c; text-decoration: none; margin: 0 10px;">📧 support@clayfable.com</a>
              <a href="tel:+917418160520" style="color: #ea580c; text-decoration: none; margin: 0 10px;">📞 +91 74181 60520</a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin: 0 0 10px 0;">Thank you for choosing Clayfable</p>
          <p style="margin: 0;">Preserving tradition since 1952</p>
          <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} Clayfable. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Send order status update notification
export const sendOrderStatusNotification = async (
  data: OrderNotificationData
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials not configured')
      return { success: false, message: 'Email not configured' }
    }

    const transporter = createTransporter()

    const statusTitles: Record<string, string> = {
      pending: 'Order Received',
      confirmed: 'Order Confirmed',
      processing: 'Order in Production',
      shipped: 'Order Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Order Delivered',
      cancelled: 'Order Cancelled',
      refunded: 'Order Refunded',
    }

    const emailSubject = `${statusTitles[data.status] || 'Order Update'} - ${data.orderNumber} | Clayfable`

    const mailOptions = {
      from: `"Clayfable" <${process.env.EMAIL_FROM}>`,
      to: data.customerEmail,
      subject: emailSubject,
      html: generateStatusEmailHTML(data, data.status),
    }

    await transporter.sendMail(mailOptions)
    console.log(`Order status notification sent to ${data.customerEmail} for order ${data.orderNumber} - Status: ${data.status}`)
    return { success: true, message: 'Notification sent successfully' }
  } catch (error) {
    console.error('Failed to send order status notification:', error)
    return { success: false, message: 'Failed to send notification' }
  }
}

// Send tracking number update
export const sendTrackingNumberUpdate = async (
  data: OrderNotificationData
): Promise<{ success: boolean; message: string }> => {
  if (!data.trackingNumber) {
    return { success: false, message: 'No tracking number provided' }
  }

  // Use the shipped status template which highlights tracking
  return sendOrderStatusNotification({ ...data, status: 'shipped' })
}

// WhatsApp notification for order updates
export const sendOrderWhatsAppNotification = async (
  phone: string,
  orderNumber: string,
  status: string,
  trackingNumber?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const whatsappToken = process.env.WHATSAPP_TOKEN
    const whatsappBusinessId = process.env.WHATSAPP_BUSINESS_ID

    if (!whatsappToken || !whatsappBusinessId) {
      console.log('WhatsApp not configured, skipping WhatsApp notification')
      return { success: false, message: 'WhatsApp not configured' }
    }

    // Format phone number
    let formattedPhone = phone.replace(/\D/g, '')
    if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone
    }

    const statusMessages: Record<string, string> = {
      confirmed: `🎉 Your order ${orderNumber} has been confirmed!\n\nOur artisans are preparing your handcrafted terracotta products with care.\n\nTrack your order: https://www.clayfable.com/track-order?order=${orderNumber}`,
      processing: `🏺 Your order ${orderNumber} is being crafted!\n\nOur skilled artisans are handcrafting your terracotta products using traditional techniques.\n\nThank you for your patience!`,
      shipped: `📦 Your order ${orderNumber} has been shipped!\n\n${trackingNumber ? `Tracking Number: ${trackingNumber}\n\n` : ''}Track: https://www.clayfable.com/track-order?order=${orderNumber}`,
      out_for_delivery: `🚚 Your order ${orderNumber} is out for delivery!\n\nPlease keep your phone handy. Our delivery partner will contact you shortly.`,
      delivered: `🎉 Your order ${orderNumber} has been delivered!\n\nWe hope you love your new terracotta products!\n\nShare your experience with us: support@clayfable.com`,
      cancelled: `❌ Your order ${orderNumber} has been cancelled.\n\nIf you have any questions, please contact us at support@clayfable.com`,
    }

    const message = statusMessages[status] || `Your order ${orderNumber} status: ${status}`

    const response = await fetch(`https://graph.facebook.com/v18.0/${whatsappBusinessId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: { body: message },
      }),
    })

    if (response.ok) {
      console.log(`WhatsApp notification sent for order ${orderNumber}`)
      return { success: true, message: 'WhatsApp notification sent' }
    } else {
      const error = await response.text()
      console.error('WhatsApp API error:', error)
      return { success: false, message: 'WhatsApp API error' }
    }
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error)
    return { success: false, message: 'Failed to send WhatsApp notification' }
  }
}

// Combined notification function - sends both email and WhatsApp
export const sendOrderUpdate = async (
  orderData: OrderNotificationData
): Promise<{ email: boolean; whatsapp: boolean }> => {
  const emailResult = await sendOrderStatusNotification(orderData)
  const whatsappResult = await sendOrderWhatsAppNotification(
    orderData.shippingAddress.phone,
    orderData.orderNumber,
    orderData.status,
    orderData.trackingNumber
  )

  return {
    email: emailResult.success,
    whatsapp: whatsappResult.success,
  }
}