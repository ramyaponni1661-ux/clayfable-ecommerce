"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Mail, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get order details from localStorage
    const storedDetails = localStorage.getItem('lastOrderDetails')
    if (storedDetails) {
      try {
        const details = JSON.parse(storedDetails)
        setOrderDetails(details)
        // Clear the stored details after use
        localStorage.removeItem('lastOrderDetails')
      } catch (error) {
        console.error('Error parsing order details:', error)
      }
    }
    setLoading(false)
  }, [])

  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clayfable</h1>
              <p className="text-xs text-orange-600 font-medium">EST. 1952</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-600">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-8 mb-8">
            <Card className="border-orange-100">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Order Details</h3>
                    <div className="space-y-2 text-gray-600">
                      <div>
                        <span className="font-medium">Order Number:</span> {orderDetails?.orderNumber || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Order Date:</span> {new Date().toLocaleDateString("en-IN")}
                      </div>
                      <div>
                        <span className="font-medium">Total Amount:</span> ₹{orderDetails?.amount?.toLocaleString('en-IN') || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Payment Method:</span> {orderDetails?.paymentMethod === 'cod' ? 'Cash on Delivery' : orderDetails?.paymentMethod === 'razorpay' ? 'Online Payment' : 'N/A'}
                      </div>
                      {orderDetails?.paymentId && (
                        <div>
                          <span className="font-medium">Payment ID:</span> {orderDetails.paymentId}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Delivery Information</h3>
                    <div className="space-y-2 text-gray-600">
                      <div>
                        <span className="font-medium">Estimated Delivery:</span> {estimatedDelivery}
                      </div>
                      <div>
                        <span className="font-medium">Shipping Method:</span> Standard Delivery
                      </div>
                      <div>
                        <span className="font-medium">Delivery Address:</span>
                        <div className="mt-1 text-sm">
                          {orderDetails?.customer ? (
                            <>
                              {orderDetails.customer.firstName} {orderDetails.customer.lastName}<br />
                              {orderDetails.customer.address}<br />
                              {orderDetails.customer.city}, {orderDetails.customer.state} {orderDetails.customer.pincode}<br />
                              Ph: {orderDetails.customer.phone}
                            </>
                          ) : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Tracking:</span> Available in 24 hours
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            {orderDetails?.items && orderDetails.items.length > 0 && (
              <Card className="border-orange-100">
                <CardContent className="p-8">
                  <h3 className="font-bold text-gray-900 mb-6">Ordered Items</h3>
                  <div className="space-y-4">
                    {orderDetails.items.map((item: any, index: number) => (
                      <div key={index} className="flex gap-4 p-4 bg-orange-50 rounded-lg">
                        <div className="w-20 h-20 flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">₹{item.price} each</div>
                              <div className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Next Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-orange-100">
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Order Confirmation</h3>
                <p className="text-sm text-gray-600">
                  You'll receive an email confirmation with your order details shortly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-100">
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Order Processing</h3>
                <p className="text-sm text-gray-600">Your order is being carefully prepared by our artisans.</p>
              </CardContent>
            </Card>

            <Card className="border-orange-100">
              <CardContent className="p-6 text-center">
                <Truck className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Shipping Updates</h3>
                <p className="text-sm text-gray-600">Track your order status and delivery updates via email and SMS.</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-4">
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" className="border-orange-200 hover:bg-orange-50 text-lg px-8 py-4 bg-transparent">
              Track Your Order
            </Button>
          </div>

          {/* Support */}
          <div className="mt-12 p-6 bg-orange-50 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Our customer support team is here to help with any questions about your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-orange-200 hover:bg-orange-100 bg-transparent">
                Contact Support
              </Button>
              <Button variant="outline" className="border-orange-200 hover:bg-orange-100 bg-transparent">
                WhatsApp Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
