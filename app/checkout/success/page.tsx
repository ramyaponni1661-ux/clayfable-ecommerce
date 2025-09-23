import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const orderNumber = "CLF-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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
          <Card className="border-orange-100 mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Order Details</h3>
                  <div className="space-y-2 text-gray-600">
                    <div>
                      <span className="font-medium">Order Number:</span> {orderNumber}
                    </div>
                    <div>
                      <span className="font-medium">Order Date:</span> {new Date().toLocaleDateString("en-IN")}
                    </div>
                    <div>
                      <span className="font-medium">Total Amount:</span> ₹2,097
                    </div>
                    <div>
                      <span className="font-medium">Payment Method:</span> Credit Card
                    </div>
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
                      <span className="font-medium">Tracking:</span> Available in 24 hours
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
