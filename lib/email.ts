import nodemailer from 'nodemailer'

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD, // App-specific password for Gmail
    },
  })
}

interface OrderConfirmationData {
  customerEmail: string
  customerName: string
  orderNumber: string
  orderDate: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  total: number
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
  trackingUrl?: string
}

const generateOrderConfirmationHTML = (data: OrderConfirmationData) => {
  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <div style="font-weight: 500; color: #333;">${item.name}</div>
        <div style="color: #666; font-size: 14px;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${item.price.toLocaleString('en-IN')}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">
        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Clayfable</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #ea580c, #dc2626); color: white; border-radius: 8px;">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
          <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="font-weight: bold; font-size: 20px;">C</span>
          </div>
          <div>
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Clayfable</h1>
            <p style="margin: 0; font-size: 12px; opacity: 0.9;">EST. 1952</p>
          </div>
        </div>
        <h2 style="margin: 10px 0 0 0; font-size: 24px;">Order Confirmed!</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
      </div>

      <!-- Greeting -->
      <div style="margin-bottom: 25px;">
        <p style="font-size: 16px; margin: 0;">Dear ${data.customerName},</p>
        <p style="margin: 10px 0 0 0;">Your order has been successfully placed and is being prepared with care by our artisans.</p>
      </div>

      <!-- Order Details -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 8px;">Order Details</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${data.orderDate}</p>
          </div>
          <div>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${data.total.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 8px;">Ordered Items</h3>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: #ea580c; color: white;">
              <th style="padding: 15px; text-align: left; font-weight: 600;">Item</th>
              <th style="padding: 15px; text-align: right; font-weight: 600;">Unit Price</th>
              <th style="padding: 15px; text-align: right; font-weight: 600;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr style="background: #f8f9fa; border-top: 2px solid #ea580c;">
              <td style="padding: 15px; font-weight: 600;">Subtotal</td>
              <td></td>
              <td style="padding: 15px; text-align: right; font-weight: 600;">₹${data.subtotal.toLocaleString('en-IN')}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 15px; font-weight: 600;">Shipping</td>
              <td></td>
              <td style="padding: 15px; text-align: right; font-weight: 600;">₹${data.shipping.toLocaleString('en-IN')}</td>
            </tr>
            <tr style="background: #ea580c; color: white;">
              <td style="padding: 15px; font-weight: 700; font-size: 16px;">Grand Total</td>
              <td></td>
              <td style="padding: 15px; text-align: right; font-weight: 700; font-size: 16px;">₹${data.total.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Shipping Address -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 8px;">Delivery Address</h3>
        <div style="color: #666;">
          <p style="margin: 5px 0; font-weight: 600; color: #333;">${data.shippingAddress.firstName} ${data.shippingAddress.lastName}</p>
          <p style="margin: 5px 0;">${data.shippingAddress.address}</p>
          <p style="margin: 5px 0;">${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.pincode}</p>
          <p style="margin: 5px 0;">Phone: ${data.shippingAddress.phone}</p>
        </div>
      </div>

      <!-- Next Steps -->
      <div style="background: linear-gradient(135deg, #fef3c7, #fed7aa); padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; color: #ea580c;">What Happens Next?</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div style="text-align: center;">
            <div style="font-size: 24px; margin-bottom: 8px;">📧</div>
            <p style="margin: 0; font-weight: 600; color: #333;">Confirmation</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Email confirmation sent</p>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; margin-bottom: 8px;">🏺</div>
            <p style="margin: 0; font-weight: 600; color: #333;">Preparation</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Crafted by our artisans</p>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; margin-bottom: 8px;">🚛</div>
            <p style="margin: 0; font-weight: 600; color: #333;">Delivery</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">5-7 business days</p>
          </div>
        </div>
      </div>

      <!-- Tracking Info -->
      ${data.trackingUrl ? `
      <div style="text-align: center; margin-bottom: 25px;">
        <a href="${data.trackingUrl}" style="display: inline-block; background: #ea580c; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">Track Your Order</a>
      </div>
      ` : `
      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
        <p style="margin: 0; color: #1565c0;">📦 Tracking information will be available within 24 hours</p>
      </div>
      `}

      <!-- Support -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
        <h3 style="margin: 0 0 15px 0; color: #ea580c;">Need Help?</h3>
        <p style="margin: 0 0 15px 0; color: #666;">Our customer support team is here to assist you with any questions.</p>
        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
          <a href="mailto:support@clayfable.com" style="color: #ea580c; text-decoration: none; font-weight: 600;">📧 support@clayfable.com</a>
          <a href="tel:+917418160520" style="color: #ea580c; text-decoration: none; font-weight: 600;">📞 +91 74181 60520</a>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
        <p style="margin: 0 0 10px 0;">Thank you for choosing Clayfable - preserving tradition since 1952</p>
        <p style="margin: 0;">© ${new Date().getFullYear()} Clayfable. All rights reserved.</p>
      </div>

    </body>
    </html>
  `
}

// Invoice data interface
interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  order: {
    id: string
    orderNumber: string
    orderDate: string
    status: string
    paymentStatus: string
    paymentMethod: string
    razorpayOrderId?: string
    razorpayPaymentId?: string
    notes?: string
  }
  customer: {
    name: string
    email: string
    phone?: string
  }
  billingAddress: {
    full_name: string
    street_address: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  shippingAddress: {
    full_name: string
    street_address: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  items: Array<{
    name: string
    sku: string
    quantity: number
    unitPrice: number
    total: number
    image?: string
  }>
  totals: {
    subtotal: number
    shippingCost: number
    taxAmount: number
    discountAmount: number
    totalAmount: number
  }
  company: {
    name: string
    address: string
    city: string
    email: string
    phone: string
    website: string
    gst: string
  }
}

const generateInvoiceHTML = (data: InvoiceData) => {
  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">
        <div style="font-weight: 500; color: #333;">${item.name}</div>
        <div style="color: #666; font-size: 12px;">SKU: ${item.sku}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.unitPrice.toLocaleString('en-IN')}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-weight: 500;">₹${item.total.toLocaleString('en-IN')}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - ${data.invoiceNumber}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">

      <!-- Header -->
      <div style="border-bottom: 3px solid #ea580c; padding-bottom: 20px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #ea580c, #dc2626); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <span style="color: white; font-weight: bold; font-size: 24px;">C</span>
              </div>
              <div>
                <h1 style="margin: 0; font-size: 32px; color: #ea580c; font-weight: bold;">Clayfable</h1>
                <p style="margin: 0; color: #666; font-size: 14px;">Traditional Pottery & Handicrafts</p>
              </div>
            </div>
            <div style="color: #666; font-size: 14px;">
              <p style="margin: 2px 0;">${data.company.address}</p>
              <p style="margin: 2px 0;">${data.company.city}</p>
              <p style="margin: 2px 0;">Email: ${data.company.email}</p>
              <p style="margin: 2px 0;">Phone: ${data.company.phone}</p>
              <p style="margin: 2px 0;">GST: ${data.company.gst}</p>
            </div>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0 0 10px 0; font-size: 28px; color: #ea580c;">INVOICE</h2>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #ea580c;">
              <p style="margin: 5px 0; font-weight: 600;">Invoice #: ${data.invoiceNumber}</p>
              <p style="margin: 5px 0;">Date: ${new Date(data.invoiceDate).toLocaleDateString('en-IN')}</p>
              <p style="margin: 5px 0;">Due: ${new Date(data.dueDate).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer and Order Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="margin: 0 0 15px 0; color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 5px;">Bill To</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <p style="margin: 5px 0; font-weight: 600; color: #333;">${data.customer.name}</p>
            <p style="margin: 5px 0; color: #666;">${data.customer.email}</p>
            ${data.customer.phone ? `<p style="margin: 5px 0; color: #666;">${data.customer.phone}</p>` : ''}
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
              <p style="margin: 2px 0; color: #666;">${data.billingAddress.full_name}</p>
              <p style="margin: 2px 0; color: #666;">${data.billingAddress.street_address}</p>
              <p style="margin: 2px 0; color: #666;">${data.billingAddress.city}, ${data.billingAddress.state}</p>
              <p style="margin: 2px 0; color: #666;">${data.billingAddress.postal_code}, ${data.billingAddress.country}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 style="margin: 0 0 15px 0; color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 5px;">Order Details</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <p style="margin: 5px 0;"><strong>Order #:</strong> ${data.order.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(data.order.orderDate).toLocaleDateString('en-IN')}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #ea580c; font-weight: 600;">${data.order.status}</span></p>
            <p style="margin: 5px 0;"><strong>Payment:</strong> <span style="color: #10b981; font-weight: 600;">${data.order.paymentStatus}</span></p>
            ${data.order.razorpayPaymentId ? `<p style="margin: 5px 0; font-size: 12px; color: #666;"><strong>Payment ID:</strong> ${data.order.razorpayPaymentId}</p>` : ''}
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px 0; color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 5px;">Items</h3>
        <table style="width: 100%; border-collapse: collapse; background: white; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #ea580c; color: white;">
              <th style="padding: 15px; text-align: left; font-weight: 600;">Description</th>
              <th style="padding: 15px; text-align: center; font-weight: 600;">Qty</th>
              <th style="padding: 15px; text-align: right; font-weight: 600;">Unit Price</th>
              <th style="padding: 15px; text-align: right; font-weight: 600;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 300px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">Subtotal:</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee; font-weight: 600;">₹${data.totals.subtotal.toLocaleString('en-IN')}</td>
            </tr>
            ${data.totals.shippingCost > 0 ? `
            <tr>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">Shipping:</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee; font-weight: 600;">₹${data.totals.shippingCost.toLocaleString('en-IN')}</td>
            </tr>
            ` : ''}
            ${data.totals.taxAmount > 0 ? `
            <tr>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">Tax:</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee; font-weight: 600;">₹${data.totals.taxAmount.toLocaleString('en-IN')}</td>
            </tr>
            ` : ''}
            ${data.totals.discountAmount > 0 ? `
            <tr>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">Discount:</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee; font-weight: 600; color: #10b981;">-₹${data.totals.discountAmount.toLocaleString('en-IN')}</td>
            </tr>
            ` : ''}
            <tr style="background: #ea580c; color: white;">
              <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 16px;">Total:</td>
              <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 16px;">₹${data.totals.totalAmount.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Payment Info -->
      ${data.order.paymentStatus === 'paid' ? `
      <div style="background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
        <p style="margin: 0; color: #065f46; font-weight: 600;">✅ Payment Received - Thank You!</p>
        <p style="margin: 5px 0 0 0; color: #065f46; font-size: 14px;">Paid via ${data.order.paymentMethod}</p>
      </div>
      ` : ''}

      <!-- Terms and Notes -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #ea580c;">Terms & Conditions</h4>
        <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
          <li>All handcrafted items are unique and may have slight variations</li>
          <li>Items are carefully packed but fragile items may require extra care</li>
          <li>Return/exchange policy applies within 7 days of delivery</li>
          <li>For any queries, contact us at support@clayfable.com</li>
        </ul>
        ${data.order.notes ? `<p style="margin: 15px 0 0 0; color: #666;"><strong>Notes:</strong> ${data.order.notes}</p>` : ''}
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
        <p style="margin: 0 0 10px 0;">Thank you for choosing Clayfable - preserving tradition since 1952</p>
        <p style="margin: 0;">This is a computer-generated invoice. No signature required.</p>
        <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} Clayfable. All rights reserved.</p>
      </div>

    </body>
    </html>
  `
}

export const sendInvoiceEmail = async (customerEmail: string, invoiceData: InvoiceData): Promise<boolean> => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"Clayfable" <${process.env.EMAIL_FROM}>`,
      to: customerEmail,
      subject: `Invoice ${invoiceData.invoiceNumber} - Order ${invoiceData.order.orderNumber} | Clayfable`,
      html: generateInvoiceHTML(invoiceData),
      text: `
Dear ${invoiceData.customer.name},

Thank you for your purchase! Please find your invoice details below:

Invoice Number: ${invoiceData.invoiceNumber}
Invoice Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString('en-IN')}
Order Number: ${invoiceData.order.orderNumber}
Total Amount: ₹${invoiceData.totals.totalAmount.toLocaleString('en-IN')}

Items:
${invoiceData.items.map(item => `- ${item.name} (${item.quantity}x) - ₹${item.total.toLocaleString('en-IN')}`).join('\n')}

Subtotal: ₹${invoiceData.totals.subtotal.toLocaleString('en-IN')}
${invoiceData.totals.shippingCost > 0 ? `Shipping: ₹${invoiceData.totals.shippingCost.toLocaleString('en-IN')}` : ''}
${invoiceData.totals.taxAmount > 0 ? `Tax: ₹${invoiceData.totals.taxAmount.toLocaleString('en-IN')}` : ''}
${invoiceData.totals.discountAmount > 0 ? `Discount: -₹${invoiceData.totals.discountAmount.toLocaleString('en-IN')}` : ''}
Total: ₹${invoiceData.totals.totalAmount.toLocaleString('en-IN')}

Payment Status: ${invoiceData.order.paymentStatus}

Thank you for choosing Clayfable!

Best regards,
Clayfable Team
      `.trim()
    }

    await transporter.sendMail(mailOptions)
    console.log(`Invoice email sent to ${customerEmail}`)
    return true
  } catch (error) {
    console.error('Failed to send invoice email:', error)
    return false
  }
}

export const sendOrderConfirmationEmail = async (data: OrderConfirmationData): Promise<boolean> => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"Clayfable" <${process.env.EMAIL_FROM}>`,
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderNumber} | Clayfable`,
      html: generateOrderConfirmationHTML(data),
      text: `
Dear ${data.customerName},

Your order #${data.orderNumber} has been confirmed!

Order Details:
- Order Number: ${data.orderNumber}
- Order Date: ${data.orderDate}
- Total Amount: ₹${data.total.toLocaleString('en-IN')}
- Payment Method: ${data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}

Items Ordered:
${data.items.map(item => `- ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n')}

Delivery Address:
${data.shippingAddress.firstName} ${data.shippingAddress.lastName}
${data.shippingAddress.address}
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.pincode}
Phone: ${data.shippingAddress.phone}

Your order is being carefully prepared by our artisans and will be delivered within 5-7 business days.

Thank you for choosing Clayfable!

Best regards,
Clayfable Team
      `.trim()
    }

    await transporter.sendMail(mailOptions)
    console.log(`Order confirmation email sent to ${data.customerEmail}`)
    return true
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return false
  }
}