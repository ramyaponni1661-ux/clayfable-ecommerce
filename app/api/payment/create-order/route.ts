import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await request.json()

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      )
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        company: 'Clayfable',
        website: 'clayfable.com'
      }
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)

    // Provide fallback for development when Razorpay keys are not working
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock Razorpay order for development')
      return NextResponse.json({
        orderId: `order_dev_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: currency || 'INR',
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      })
    }

    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}