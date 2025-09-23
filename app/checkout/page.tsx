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
import MobileHeader from "@/components/mobile-header"

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

  const handleCODOrder = async () => {
    setIsProcessingOrder(true)

    try {
      // Create order in database
      const orderData = {
        items: cartItems,
        customerInfo: {
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone
        },
        paymentMethod: 'cod',
        paymentReference: null,
        subtotal: subtotal,
        shipping: shipping,
        total: total
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (result.success) {
        // Clear cart
        localStorage.removeItem('cartItems')

        // Store order details for success page
        localStorage.setItem('lastOrderDetails', JSON.stringify({
          orderId: result.orderId,
          orderNumber: result.orderNumber,
          amount: total,
          items: cartItems,
          customer: formData,
          paymentMethod: 'cod'
        }))

        // Redirect to success page
        router.push('/checkout/success?payment=cod')
      } else {
        throw new Error('Order creation failed')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setIsProcessingOrder(false)
    }
  }

  const handlePaymentSuccess = async (paymentData: any) => {
    console.log('Payment successful:', paymentData)
    setIsProcessingOrder(true)

    try {
      // Create order in database
      const orderData = {
        items: cartItems,
        customerInfo: {
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone
        },
        paymentMethod: 'razorpay',
        paymentReference: paymentData.razorpay_payment_id,
        subtotal: subtotal,
        shipping: shipping,
        total: total
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (result.success) {
        // Clear cart
        localStorage.removeItem('cartItems')

        // Store order details for success page
        localStorage.setItem('lastOrderDetails', JSON.stringify({
          orderId: result.orderId,
          orderNumber: result.orderNumber,
          paymentId: paymentData.razorpay_payment_id,
          amount: total,
          items: cartItems,
          customer: formData,
          paymentMethod: 'razorpay'
        }))

        // Redirect to success page
        router.push('/checkout/success?payment=razorpay')
      } else {
        throw new Error('Order creation failed')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setIsProcessingOrder(false)
    }
  }

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error)
    alert('Payment failed. Please try again.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <MobileHeader
        showBackButton={true}
        backUrl="/cart"
        backText="Back to Cart"
        showNavigation={false}
        cartCount={cartItems.length}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
          <div className="flex items-center justify-center md:justify-start space-x-2 md:space-x-4 text-xs md:text-sm text-gray-600">
            <span className="flex items-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs mr-1 md:mr-2">
                1
              </div>
              <span className="hidden sm:inline">Shipping</span>
            </span>
            <div className="w-4 md:w-8 h-px bg-gray-300"></div>
            <span className="flex items-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs mr-1 md:mr-2">
                2
              </div>
              <span className="hidden sm:inline">Payment</span>
            </span>
            <div className="w-4 md:w-8 h-px bg-gray-300"></div>
            <span className="flex items-center">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs mr-1 md:mr-2">
                3
              </div>
              <span className="hidden sm:inline">Confirmation</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-4 lg:space-y-8">
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
                    <p className="text-xs text-gray-600 mt-1">
                      We'll send order confirmation and tracking updates to this email
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs">i</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">Guest Checkout</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          You can complete your purchase as a guest using just your email.
                          You'll receive order confirmation and tracking via email.
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Want order history and faster checkout?</strong>
                          <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 underline ml-1">
                            Sign in with Google
                          </Link> or create an account after checkout.
                        </p>
                      </div>
                    </div>
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
                      <Select onValueChange={(value) => handleInputChange("state", value)} value={formData.state}>
                        <SelectTrigger className="border-orange-200">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                          <SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
                          <SelectItem value="assam">Assam</SelectItem>
                          <SelectItem value="bihar">Bihar</SelectItem>
                          <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                          <SelectItem value="goa">Goa</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                          <SelectItem value="haryana">Haryana</SelectItem>
                          <SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
                          <SelectItem value="jharkhand">Jharkhand</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="kerala">Kerala</SelectItem>
                          <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="manipur">Manipur</SelectItem>
                          <SelectItem value="meghalaya">Meghalaya</SelectItem>
                          <SelectItem value="mizoram">Mizoram</SelectItem>
                          <SelectItem value="nagaland">Nagaland</SelectItem>
                          <SelectItem value="odisha">Odisha</SelectItem>
                          <SelectItem value="punjab">Punjab</SelectItem>
                          <SelectItem value="rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="sikkim">Sikkim</SelectItem>
                          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="telangana">Telangana</SelectItem>
                          <SelectItem value="tripura">Tripura</SelectItem>
                          <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                          <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                          <SelectItem value="west-bengal">West Bengal</SelectItem>
                          <SelectItem value="andaman-nicobar">Andaman and Nicobar Islands</SelectItem>
                          <SelectItem value="chandigarh">Chandigarh</SelectItem>
                          <SelectItem value="dadra-nagar-haveli">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="jammu-kashmir">Jammu and Kashmir</SelectItem>
                          <SelectItem value="ladakh">Ladakh</SelectItem>
                          <SelectItem value="lakshadweep">Lakshadweep</SelectItem>
                          <SelectItem value="puducherry">Puducherry</SelectItem>
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
                    <div className="flex items-center space-x-2 p-4 border-2 border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">💳 Online Payment</span>
                              <span className="text-xs text-blue-600 font-medium">Powered by Razorpay</span>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                              VISA
                            </div>
                            <div className="w-10 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                              MC
                            </div>
                            <div className="w-10 h-6 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
                              UPI
                            </div>
                            <div className="w-12 h-6 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                              NET
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          💰 Cards, UPI, Net Banking, Wallets • 🔒 100% Secure • ⚡ Instant
                        </div>
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
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-900">🔒 Secure Payment via Razorpay</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          256-bit SSL encryption for maximum security
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          PCI DSS compliant payment processing
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Trusted by 8M+ businesses across India
                        </p>
                        <p className="text-xs text-blue-600 font-medium mt-2">
                          You'll be redirected to Razorpay's secure payment gateway
                        </p>
                      </div>
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
