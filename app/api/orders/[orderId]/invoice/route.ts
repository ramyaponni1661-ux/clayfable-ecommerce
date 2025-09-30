import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/service'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const supabase = createClient()

    // Fetch order details
    const { data: order, error } = await supabase
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
      .eq('order_number', orderId)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Parse shipping and billing addresses
    let shippingAddress = null
    let billingAddress = null
    let products = []

    try {
      shippingAddress = order.shipping_address ? JSON.parse(order.shipping_address) : null
      billingAddress = order.billing_address ? JSON.parse(order.billing_address) : null

      // Parse products from notes field
      if (order.notes) {
        const notesData = JSON.parse(order.notes)
        products = notesData.products || []
      }
    } catch (e) {
      console.log('Failed to parse order data for invoice:', e)
    }

    // Generate invoice HTML
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice - ${order.order_number}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ea580c; padding-bottom: 20px; }
        .company-name { font-size: 28px; font-weight: bold; color: #ea580c; margin-bottom: 10px; }
        .invoice-title { font-size: 24px; margin: 20px 0; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-details, .customer-details { width: 48%; }
        .invoice-details h3, .customer-details h3 { color: #ea580c; border-bottom: 1px solid #ea580c; padding-bottom: 5px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background-color: #ea580c; color: white; }
        .items-table tr:nth-child(even) { background-color: #f9f9f9; }
        .totals { text-align: right; margin-top: 20px; }
        .totals table { margin-left: auto; }
        .totals td { padding: 8px 15px; }
        .total-row { font-weight: bold; font-size: 18px; background-color: #ea580c; color: white; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        .payment-info { margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="invoice-header">
        <div class="company-name">CLAYFABLE</div>
        <div>Authentic Terracotta Products</div>
        <div>www.clayfable.com | support@clayfable.com</div>
    </div>

    <div class="invoice-title">INVOICE</div>

    <div class="invoice-info">
        <div class="invoice-details">
            <h3>Invoice Details</h3>
            <p><strong>Invoice Number:</strong> INV-${order.order_number}</p>
            <p><strong>Order Number:</strong> ${order.order_number}</p>
            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</p>
            <p><strong>Payment Status:</strong> ${order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</p>
            <p><strong>Payment Method:</strong> ${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
        </div>

        <div class="customer-details">
            <h3>Bill To</h3>
            ${billingAddress ? `
                <p><strong>${billingAddress.firstName} ${billingAddress.lastName}</strong></p>
                <p>${billingAddress.address}</p>
                <p>${billingAddress.city}, ${billingAddress.state} ${billingAddress.pincode}</p>
                <p>Phone: ${billingAddress.phone}</p>
            ` : '<p>Customer details not available</p>'}
        </div>
    </div>

    ${shippingAddress && JSON.stringify(shippingAddress) !== JSON.stringify(billingAddress) ? `
    <div class="customer-details">
        <h3>Ship To</h3>
        <p><strong>${shippingAddress.firstName} ${shippingAddress.lastName}</strong></p>
        <p>${shippingAddress.address}</p>
        <p>${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.pincode}</p>
        <p>Phone: ${shippingAddress.phone}</p>
    </div>
    ` : ''}

    <table class="items-table">
        <thead>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${products.map(product => `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>₹${product.price.toLocaleString('en-IN')}</td>
                    <td>₹${(product.price * product.quantity).toLocaleString('en-IN')}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td>Subtotal:</td>
                <td>₹${order.subtotal.toLocaleString('en-IN')}</td>
            </tr>
            ${order.tax_amount > 0 ? `
            <tr>
                <td>Tax:</td>
                <td>₹${order.tax_amount.toLocaleString('en-IN')}</td>
            </tr>
            ` : ''}
            ${order.shipping_amount > 0 ? `
            <tr>
                <td>Shipping:</td>
                <td>₹${order.shipping_amount.toLocaleString('en-IN')}</td>
            </tr>
            ` : ''}
            ${order.discount_amount > 0 ? `
            <tr>
                <td>Discount:</td>
                <td>-₹${order.discount_amount.toLocaleString('en-IN')}</td>
            </tr>
            ` : ''}
            <tr class="total-row">
                <td>Total:</td>
                <td>₹${order.total_amount.toLocaleString('en-IN')}</td>
            </tr>
        </table>
    </div>

    <div class="payment-info">
        <h3>Payment Information</h3>
        <p><strong>Status:</strong> ${order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</p>
        <p><strong>Method:</strong> ${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
        ${order.payment_method !== 'cod' ? `<p><strong>Transaction Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</p>` : ''}
    </div>

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>This is a computer-generated invoice. No signature required.</p>
        <p>For any queries, contact us at support@clayfable.com or visit www.clayfable.com</p>
    </div>
</body>
</html>
    `

    return new NextResponse(invoiceHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="invoice-${order.order_number}.html"`
      }
    })

  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 })
  }
}