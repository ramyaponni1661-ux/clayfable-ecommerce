// Payment integration utilities for Razorpay and other gateways

export interface PaymentOptions {
  amount: number
  currency: string
  orderId: string
  customerEmail: string
  customerPhone: string
  customerName: string
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  orderId?: string
  signature?: string
  error?: string
}

// Razorpay integration
export const initializeRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const processRazorpayPayment = async (options: PaymentOptions): Promise<PaymentResult> => {
  const isRazorpayLoaded = await initializeRazorpay()

  if (!isRazorpayLoaded) {
    return { success: false, error: "Razorpay SDK failed to load" }
  }

  return new Promise((resolve) => {
    const razorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: options.amount * 100, // Convert to paise
      currency: options.currency,
      name: "Clayfable",
      description: "Authentic Terracotta Products",
      order_id: options.orderId,
      handler: (response: any) => {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        })
      },
      prefill: {
        name: options.customerName,
        email: options.customerEmail,
        contact: options.customerPhone,
      },
      theme: {
        color: "#ea580c", // Orange-600
      },
      modal: {
        ondismiss: () => {
          resolve({ success: false, error: "Payment cancelled by user" })
        },
      },
    }

    // @ts-ignore - Razorpay is loaded dynamically
    const razorpay = new window.Razorpay(razorpayOptions)
    razorpay.open()
  })
}

// UPI Payment processing
export const processUPIPayment = async (options: PaymentOptions): Promise<PaymentResult> => {
  // UPI payment logic would go here
  // For now, simulate success
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentId: "upi_" + Math.random().toString(36).substr(2, 9),
        orderId: options.orderId,
      })
    }, 2000)
  })
}

// COD processing
export const processCODPayment = async (options: PaymentOptions): Promise<PaymentResult> => {
  return {
    success: true,
    paymentId: "cod_" + Math.random().toString(36).substr(2, 9),
    orderId: options.orderId,
  }
}
