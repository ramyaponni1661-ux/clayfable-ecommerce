"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Truck, Shield, MapPin, Mail, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import RazorpayPayment from "@/components/razorpay-payment"

// Product data to match with cart
const products = [
  {
    id: 1,
    name: "Traditional Clay Cooking Pot",
    price: 599,
    originalPrice: 799,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
  },
  {
    id: 2,
    name: "Handcrafted Serving Bowl Set",
    price: 899,
    originalPrice: 1199,
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
  },
  {
    id: 3,
    name: "Decorative Terracotta Vase",
    price: 349,
    originalPrice: 449,
    image: "/decorative-terracotta-vases-and-planters.jpg",
  },
  {
    id: 4,
    name: "Clay Water Storage Pot",
    price: 1299,
    originalPrice: 1599,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
  },
  {
    id: 5,
    name: "Artisan Dinner Plate Set",
    price: 1199,
    originalPrice: 1499,
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
  },
  {
    id: 6,
    name: "Garden Planter Collection",
    price: 799,
    originalPrice: 999,
    image: "/decorative-terracotta-vases-and-planters.jpg",
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  })

  useEffect(() => {
    // Load cart items from localStorage
    const storedCartItems = localStorage.getItem("cartItems")
    if (storedCartItems) {
      const cartMap = JSON.parse(storedCartItems)
      const cartArray = Object.entries(cartMap).map(([productId, quantity]) => {
        const product = products.find(p => p.id === parseInt(productId))
        if (product) {
          return {
            ...product,
            quantity: quantity as number
          }
        }
        return null
      }).filter(Boolean)
      setCartItems(cartArray)
    }
  }, [])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.state || !formData.pincode || !formData.phone) {
      alert('Please fill in all required fields')
      return
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    // For COD and other payment methods
    if (paymentMethod === 'cod') {
      handleCODOrder()
    }
    // Razorpay payment is handled by the RazorpayPayment component
  }

  const handleCODOrder = () => {
    setIsProcessingOrder(true)

    // Simulate order processing
    setTimeout(() => {
      // Clear cart
      localStorage.removeItem('cartItems')

      // Redirect to success page
      router.push('/checkout/success?payment=cod')
    }, 2000)
  }

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData)

    // Clear cart
    localStorage.removeItem('cartItems')

    // Store order details for success page
    localStorage.setItem('lastOrderDetails', JSON.stringify({
      orderId: paymentData.razorpay_order_id,
      paymentId: paymentData.razorpay_payment_id,
      amount: total,
      items: cartItems,
      customer: formData
    }))

    // Redirect to success page
    router.push('/checkout/success?payment=razorpay')
  }

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error)
    alert('Payment failed. Please try again.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clayfable</h1>
                <p className="text-xs text-orange-600 font-medium">EST. 1952</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/cart">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                1
              </div>
              Shipping
            </span>
            <div className="w-8 h-px bg-gray-300"></div>
            <span className="flex items-center">
              <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs mr-2">
                2
              </div>
              Payment
            </span>
            <div className="w-8 h-px bg-gray-300"></div>
            <span className="flex items-center">
              <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs mr-2">
                3
              </div>
              Confirmation
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <Card className="border-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 text-orange-600 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-orange-200 focus:border-orange-400"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="border-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 text-orange-600 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="border-orange-200 focus:border-orange-400"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="border-orange-200 focus:border-orange-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="border-orange-200 focus:border-orange-400"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="border-orange-200 focus:border-orange-400"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select onValueChange={(value) => handleInputChange("state", value)}>
                        <SelectTrigger className="border-orange-200">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input
                        id="pincode"
                        placeholder="PIN code"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        className="border-orange-200 focus:border-orange-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-orange-200 focus:border-orange-400"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 text-orange-600 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 border border-orange-200 rounded-lg">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Online Payment</span>
                          <div className="flex space-x-2">
                            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                              VISA
                            </div>
                            <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                              MC
                            </div>
                            <div className="w-8 h-5 bg-purple-600 rounded text-white text-xs flex items-center justify-center">
                              UPI
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Cards, UPI, Net Banking, Wallets</div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border border-orange-200 rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Cash on Delivery</span>
                          <div className="text-sm text-gray-600">Pay when you receive</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "razorpay" && (
                    <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-900">Secure Payment via Razorpay</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Your payment information is encrypted and secure. You'll be redirected to Razorpay's secure payment gateway.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-orange-100 sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            <span className="font-medium">₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  {paymentMethod === "razorpay" ? (
                    <RazorpayPayment
                      amount={total}
                      orderDetails={{
                        customerName: `${formData.firstName} ${formData.lastName}`,
                        customerEmail: formData.email,
                        customerPhone: formData.phone,
                        address: formData
                      }}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  ) : (
                    <Button
                      type="submit"
                      disabled={isProcessingOrder}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-4"
                    >
                      {isProcessingOrder ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Order...
                        </>
                      ) : (
                        'Place Order (COD)'
                      )}
                    </Button>
                  )}

                  {/* Trust Signals */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-orange-600 mr-2" />
                      Secure SSL encrypted checkout
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-orange-600 mr-2" />
                      Free shipping on orders above ₹999
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
