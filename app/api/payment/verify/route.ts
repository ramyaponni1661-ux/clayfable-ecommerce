import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = await request.json()

    // Handle mock development orders
    if (process.env.NODE_ENV === 'development' && razorpay_order_id?.startsWith('order_dev_')) {
      console.log('Processing mock payment verification for development')
      return NextResponse.json({
        success: true,
        message: 'Mock payment verified successfully',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id || `pay_dev_${Date.now()}`
      })
    }

    // Verify the payment signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex')

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      // Here you would typically:
      // 1. Update order status in database
      // 2. Send confirmation email
      // 3. Update inventory
      // 4. Clear cart

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      })
    } else {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}