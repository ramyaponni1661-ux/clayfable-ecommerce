import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { items, customerInfo, shippingAddress, paymentMethod, paymentReference, subtotal, shipping, total } = body

    // Generate order number
    const orderNumber = "CLF-" + Math.random().toString(36).substr(2, 9).toUpperCase()

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        subtotal: subtotal,
        shipping_amount: shipping,
        total_amount: total,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        status: paymentMethod === "cod" ? "confirmed" : "pending",
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_name: item.name,
      product_sku: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw itemsError
    }

    // Send confirmation email (mock)
    console.log(`[v0] Order confirmation email would be sent to ${customerInfo.email}`)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: orderNumber,
    })
  } catch (error) {
    console.error("[v0] Order creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
