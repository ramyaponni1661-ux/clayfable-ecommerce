"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Truck,
  Shield,
  MapPin,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  Gift,
  Percent,
  Lock,
  CheckCircle,
  Clock,
  Globe,
  Package,
  FileText,
  Loader2,
  AlertCircle,
  Star
} from "lucide-react"
import RazorpayPayment from "./razorpay-payment"
import RazorpayTrustBanner from "./razorpay-trust-banner"

interface EnterpriseCheckoutProps {
  cartItems: any[]
  onSuccess: (orderData: any) => void
  onError: (error: string) => void
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Andaman and Nicobar Islands"
]

export default function EnterpriseCheckout({ cartItems, onSuccess, onError }: EnterpriseCheckoutProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [customerType, setCustomerType] = useState("individual")
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [isProcessing, setIsProcessing] = useState(false)
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([])
  const [giftWrapSelected, setGiftWrapSelected] = useState(false)
  const [saveInfo, setSaveInfo] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true)

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  })

  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  })

  const [businessInfo, setBusinessInfo] = useState({
    companyName: "",
    gstNumber: "",
    businessType: "",
    billingEmail: ""
  })

  const [deliveryOptions, setDeliveryOptions] = useState({
    shippingMethod: "standard",
    specialInstructions: "",
    preferredDeliveryTime: ""
  })

  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")

  // Calculate pricing
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const giftWrapCost = giftWrapSelected ? 99 : 0
  const shippingCost = deliveryOptions.shippingMethod === "express" ? 199 : (subtotal >= 999 ? 0 : 99)
  const gstAmount = Math.round((subtotal + giftWrapCost + shippingCost) * 0.18)
  const discountAmount = appliedCoupons.includes("WELCOME10") ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + giftWrapCost + shippingCost + gstAmount - discountAmount

  useEffect(() => {
    // Calculate estimated delivery based on shipping method and location
    const baseDelivery = deliveryOptions.shippingMethod === "express" ? 2 : 5
    const today = new Date()
    const deliveryDate = new Date(today.getTime() + (baseDelivery * 24 * 60 * 60 * 1000))
    setEstimatedDelivery(deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))
  }, [deliveryOptions.shippingMethod, shippingAddress.pincode])

  const validateStep = (step: number) => {
    if (step === 1) {
      return shippingAddress.firstName && shippingAddress.lastName &&
             shippingAddress.email && shippingAddress.phone &&
             shippingAddress.address && shippingAddress.city &&
             shippingAddress.state && shippingAddress.pincode
    }
    if (step === 2) {
      return deliveryOptions.shippingMethod
    }
    if (step === 3) {
      return paymentMethod && agreeToTerms
    }
    return true
  }

  const applyCoupon = () => {
    if (couponCode === "WELCOME10" && !appliedCoupons.includes("WELCOME10")) {
      setAppliedCoupons([...appliedCoupons, "WELCOME10"])
      setCouponCode("")
    } else if (couponCode === "FIRST20" && !appliedCoupons.includes("FIRST20")) {
      setAppliedCoupons([...appliedCoupons, "FIRST20"])
      setCouponCode("")
    } else {
      alert("Invalid or already applied coupon code")
    }
  }

  const handlePaymentSuccess = (paymentData: any) => {
    const orderData = {
      ...paymentData,
      shippingAddress,
      billingAddress: sameAsBilling ? shippingAddress : billingAddress,
      businessInfo,
      deliveryOptions,
      cartItems,
      pricing: {
        subtotal,
        giftWrapCost,
        shippingCost,
        gstAmount,
        discountAmount,
        total
      },
      customerType,
      appliedCoupons,
      giftWrapSelected,
      subscribeNewsletter
    }
    onSuccess(orderData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <img
                  src="/icon-transparent.png"
                  alt="Clayfable Logo"
                  className="h-12 w-12"
                  onError={(e) => {
                    e.currentTarget.src = '/icon.png'
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Clayfable</h1>
                <p className="text-xs text-orange-600 font-medium">EST. 1952</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Lock className="h-4 w-4 mr-1" />
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-orange-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStep === 1 && "Customer Information"}
              {currentStep === 2 && "Shipping & Delivery"}
              {currentStep === 3 && "Payment Method"}
              {currentStep === 4 && "Order Review"}
            </h2>
            <p className="text-gray-600">
              Step {currentStep} of 4 - Complete your order securely
            </p>
          </div>
        </div>

        {/* Trust Banner */}
        <RazorpayTrustBanner />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <Tabs value={currentStep.toString()} className="w-full">
              {/* Step 1: Customer Information */}
              <TabsContent value="1" className="space-y-6">
                <Card className="border-orange-100">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 text-orange-600 mr-2" />
                      Customer Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={customerType === "individual" ? "default" : "outline"}
                        onClick={() => setCustomerType("individual")}
                        className={customerType === "individual" ? "bg-orange-600 hover:bg-orange-700" : ""}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Individual
                      </Button>
                      <Button
                        variant={customerType === "business" ? "default" : "outline"}
                        onClick={() => setCustomerType("business")}
                        className={customerType === "business" ? "bg-orange-600 hover:bg-orange-700" : ""}
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Business
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {customerType === "business" && (
                  <Card className="border-orange-100">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="h-5 w-5 text-orange-600 mr-2" />
                        Business Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            value={businessInfo.companyName}
                            onChange={(e) => setBusinessInfo({...businessInfo, companyName: e.target.value})}
                            className="border-orange-200 focus:border-orange-400"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="gstNumber">GST Number</Label>
                          <Input
                            id="gstNumber"
                            value={businessInfo.gstNumber}
                            onChange={(e) => setBusinessInfo({...businessInfo, gstNumber: e.target.value})}
                            className="border-orange-200 focus:border-orange-400"
                            placeholder="Optional for tax benefits"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={shippingAddress.firstName}
                          onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                          className="border-orange-200 focus:border-orange-400"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={shippingAddress.lastName}
                          onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                          className="border-orange-200 focus:border-orange-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingAddress.email}
                          onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                          className="border-orange-200 focus:border-orange-400"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                          className="border-orange-200 focus:border-orange-400"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        className="border-orange-200 focus:border-orange-400"
                        placeholder="Street address"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="apartment">Apartment, Suite, etc.</Label>
                      <Input
                        id="apartment"
                        value={shippingAddress.apartment}
                        onChange={(e) => setShippingAddress({...shippingAddress, apartment: e.target.value})}
                        className="border-orange-200 focus:border-orange-400"
                        placeholder="Optional"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          className="border-orange-200 focus:border-orange-400"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={shippingAddress.state}
                          onValueChange={(value) => setShippingAddress({...shippingAddress, state: value})}
                        >
                          <SelectTrigger className="border-orange-200">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pincode">PIN Code *</Label>
                        <Input
                          id="pincode"
                          value={shippingAddress.pincode}
                          onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                          className="border-orange-200 focus:border-orange-400"
                          placeholder="6-digit PIN"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saveInfo"
                        checked={saveInfo}
                        onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                      />
                      <label htmlFor="saveInfo" className="text-sm text-gray-700">
                        Save this information for faster checkout next time
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!validateStep(1)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3"
                >
                  Continue to Shipping
                </Button>
              </TabsContent>

              {/* Step 2: Shipping & Delivery */}
              <TabsContent value="2" className="space-y-6">
                <Card className="border-orange-100">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 text-orange-600 mr-2" />
                      Shipping Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="standard"
                            name="shipping"
                            value="standard"
                            checked={deliveryOptions.shippingMethod === "standard"}
                            onChange={(e) => setDeliveryOptions({...deliveryOptions, shippingMethod: e.target.value})}
                            className="text-orange-600"
                          />
                          <label htmlFor="standard" className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Standard Shipping</p>
                                <p className="text-sm text-gray-600">5-7 business days</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{subtotal >= 999 ? "FREE" : "₹99"}</p>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="express"
                            name="shipping"
                            value="express"
                            checked={deliveryOptions.shippingMethod === "express"}
                            onChange={(e) => setDeliveryOptions({...deliveryOptions, shippingMethod: e.target.value})}
                            className="text-orange-600"
                          />
                          <label htmlFor="express" className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Express Shipping</p>
                                <p className="text-sm text-gray-600">2-3 business days</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">₹199</p>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specialInstructions">Special Delivery Instructions</Label>
                      <Input
                        id="specialInstructions"
                        value={deliveryOptions.specialInstructions}
                        onChange={(e) => setDeliveryOptions({...deliveryOptions, specialInstructions: e.target.value})}
                        className="border-orange-200 focus:border-orange-400"
                        placeholder="Leave with neighbor, call before delivery, etc."
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-800">Estimated Delivery</span>
                      </div>
                      <p className="text-blue-700">{estimatedDelivery}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-100">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Gift className="h-5 w-5 text-orange-600 mr-2" />
                      Additional Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="giftWrap"
                        checked={giftWrapSelected}
                        onCheckedChange={(checked) => setGiftWrapSelected(checked as boolean)}
                      />
                      <label htmlFor="giftWrap" className="text-sm text-gray-700 flex-1">
                        Gift wrapping (+₹99)
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border-orange-200"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={!validateStep(2)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </TabsContent>

              {/* Step 3: Payment */}
              <TabsContent value="3" className="space-y-6">
                <Card className="border-orange-100">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 text-orange-600 mr-2" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="razorpay"
                            name="payment"
                            value="razorpay"
                            checked={paymentMethod === "razorpay"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-orange-600"
                          />
                          <label htmlFor="razorpay" className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Online Payment</p>
                                <p className="text-sm text-gray-600">Cards, UPI, Net Banking, Wallets</p>
                              </div>
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
                          </label>
                        </div>
                      </div>

                      <div className="border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="cod"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-orange-600"
                          />
                          <label htmlFor="cod" className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Cash on Delivery</p>
                                <p className="text-sm text-gray-600">Pay when you receive</p>
                              </div>
                              <div>
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                  Available
                                </Badge>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === "razorpay" && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
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

                {/* Terms and Newsletter */}
                <Card className="border-orange-100">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                        className="mt-1"
                      />
                      <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                        I agree to the{" "}
                        <a href="/terms" className="text-orange-600 underline" target="_blank">
                          Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-orange-600 underline" target="_blank">
                          Privacy Policy
                        </a>
                        *
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={subscribeNewsletter}
                        onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
                      />
                      <label htmlFor="newsletter" className="text-sm text-gray-700">
                        Subscribe to our newsletter for exclusive offers and pottery tips
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 border-orange-200"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(4)}
                    disabled={!validateStep(3)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    Review Order
                  </Button>
                </div>
              </TabsContent>

              {/* Step 4: Order Review */}
              <TabsContent value="4" className="space-y-6">
                <Card className="border-orange-100">
                  <CardHeader>
                    <CardTitle>Order Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Order Summary */}
                    <div>
                      <h4 className="font-medium mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center border-b pb-2">
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-medium">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Addresses Review */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Shipping Address</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                          <p>{shippingAddress.address}</p>
                          {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                          <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
                          <p>{shippingAddress.phone}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Delivery Method</h4>
                        <div className="text-sm text-gray-600">
                          <p className="capitalize">{deliveryOptions.shippingMethod} Shipping</p>
                          <p>Estimated: {estimatedDelivery}</p>
                          {deliveryOptions.specialInstructions && (
                            <p>Instructions: {deliveryOptions.specialInstructions}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Review */}
                    <div>
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <p className="text-sm text-gray-600">
                        {paymentMethod === "razorpay" ? "Online Payment (Razorpay)" : "Cash on Delivery"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 border-orange-200"
                  >
                    Back
                  </Button>

                  {paymentMethod === "razorpay" ? (
                    <div className="flex-1">
                      <RazorpayPayment
                        amount={total}
                        orderDetails={{
                          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                          customerEmail: shippingAddress.email,
                          customerPhone: shippingAddress.phone,
                          address: shippingAddress
                        }}
                        onSuccess={handlePaymentSuccess}
                        onError={onError}
                      />
                    </div>
                  ) : (
                    <Button
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      onClick={() => {
                        const orderData = {
                          paymentMethod: "cod",
                          shippingAddress,
                          deliveryOptions,
                          cartItems,
                          total
                        }
                        onSuccess(orderData)
                      }}
                    >
                      Place Order (COD)
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-orange-100 sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <p className="text-sm text-gray-600">+{cartItems.length - 3} more items</p>
                  )}
                </div>

                <Separator />

                {/* Coupon Code */}
                <div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="border-orange-200 focus:border-orange-400"
                    />
                    <Button
                      variant="outline"
                      onClick={applyCoupon}
                      className="border-orange-200"
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedCoupons.length > 0 && (
                    <div className="space-y-1">
                      {appliedCoupons.map((coupon) => (
                        <Badge key={coupon} className="bg-green-100 text-green-800">
                          {coupon} Applied
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  {giftWrapSelected && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gift Wrapping</span>
                      <span>₹{giftWrapCost}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%)</span>
                    <span>₹{gstAmount}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                {/* Trust Signals */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-orange-600 mr-2" />
                    256-bit SSL encryption
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 text-orange-600 mr-2" />
                    Free shipping on orders above ₹999
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-orange-600 mr-2" />
                    4.8/5 customer satisfaction
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}