"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Script from 'next/script'

interface RazorpayPaymentProps {
  amount: number
  currency?: string
  orderDetails: {
    customerName: string
    customerEmail: string
    customerPhone: string
    address: any
  }
  onSuccess: (paymentData: any) => void
  onError: (error: any) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayPayment({
  amount,
  currency = 'INR',
  orderDetails,
  onSuccess,
  onError,
}: RazorpayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const createRazorpayOrder = async () => {
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt: `receipt_${Date.now()}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  const verifyPayment = async (paymentData: any) => {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error('Payment verification failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }

  const handlePayment = async () => {
    console.log('Pay button clicked. Script loaded:', scriptLoaded)

    if (!scriptLoaded) {
      alert('Payment system is loading. Please try again in a moment.')
      return
    }

    // Validate required order details
    if (!orderDetails.customerName || !orderDetails.customerEmail || !orderDetails.customerPhone) {
      alert('Please fill in all required fields before proceeding with payment.')
      return
    }

    console.log('Starting payment process with amount:', amount)
    setIsLoading(true)

    try {
      // Create order on backend
      const orderData = await createRazorpayOrder()

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Clayfable',
        description: 'Authentic Terracotta Products',
        image: '/icon-transparent.png',
        order_id: orderData.orderId,
        prefill: {
          name: orderDetails.customerName,
          email: orderDetails.customerEmail,
          contact: orderDetails.customerPhone,
        },
        notes: {
          address: JSON.stringify(orderDetails.address),
        },
        theme: {
          color: '#ea580c', // Orange color matching your theme
        },
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            if (verificationResult.success) {
              onSuccess({
                ...response,
                orderData,
                verification: verificationResult,
              })
            } else {
              onError('Payment verification failed')
            }
          } catch (error) {
            onError(error)
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false)
          },
        },
      }

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', function (response: any) {
        onError(response.error)
        setIsLoading(false)
      })

      rzp.open()
    } catch (error) {
      onError(error)
      setIsLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          console.log('Razorpay script loaded successfully')
          setScriptLoaded(true)
        }}
        onError={() => {
          console.error('Failed to load Razorpay script')
          setScriptLoaded(false)
        }}
      />

      <Button
        onClick={handlePayment}
        disabled={isLoading || !scriptLoaded}
        className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : !scriptLoaded ? (
          'Loading Payment System...'
        ) : (
          `Pay ₹${amount.toLocaleString('en-IN')}`
        )}
      </Button>

      {/* Debug information - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          Debug: Script loaded: {scriptLoaded ? '✅' : '❌'} | Loading: {isLoading ? '⏳' : '✅'}
        </div>
      )}
    </>
  )
}