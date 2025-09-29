"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Truck, Shield, MapPin, Mail, ArrowLeft, Loader2, User, Building2, Star, Crown, Clock, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import RazorpayPayment from "@/components/razorpay-payment"
import MobileHeader from "@/components/mobile-header"
import CanonicalLink from "@/components/seo/canonical-link"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items: cartItems, totalAmount, itemCount, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [checkoutMode, setCheckoutMode] = useState("standard") // standard, express, business
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    // Enterprise fields
    companyName: "",
    gstNumber: "",
    businessType: "",
    purchaseOrderNumber: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingPincode: "",
    sameBillingShipping: true,
    specialInstructions: "",
    priority: "standard",
    invoiceEmail: ""
  })

  // Calculate totals using cart context with enterprise discounts
  const subtotal = totalAmount
  const enterpriseDiscount = session?.user && subtotal > 5000 ? Math.floor(subtotal * 0.05) : 0
  const priorityShipping = formData.priority === "express" ? 199 : 0
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal - enterpriseDiscount + shipping + priorityShipping

  // Fetch user profile for logged-in users
  useEffect(() => {
    if (session?.user) {
      fetchUserProfile()
    }
  }, [session])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/users/profile')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUserProfile(data.profile)
          // Pre-fill form with profile data
          setFormData(prev => ({
            ...prev,
            email: data.profile.email || "",
            firstName: data.profile.full_name?.split(' ')[0] || "",
            lastName: data.profile.full_name?.split(' ').slice(1).join(' ') || "",
            phone: data.profile.phone || ""
          }))
        }
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      // Auto-copy shipping to billing if enabled
      if (field.startsWith('billing') === false && newData.sameBillingShipping) {
        if (field === 'address') newData.billingAddress = value
        if (field === 'city') newData.billingCity = value
        if (field === 'state') newData.billingState = value
        if (field === 'pincode') newData.billingPincode = value
      }
      return newData
    })
  }

  const toggleBillingShipping = () => {
    setFormData(prev => {
      const newData = { ...prev, sameBillingShipping: !prev.sameBillingShipping }
      if (newData.sameBillingShipping) {
        newData.billingAddress = prev.address
        newData.billingCity = prev.city
        newData.billingState = prev.state
        newData.billingPincode = prev.pincode
      }
      return newData
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'pincode', 'phone']
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return
      }
    }

    // Enterprise validation
    if (checkoutMode === 'business' && !formData.companyName) {
      alert('Company name is required for business checkout')
      return
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    // Razorpay payment is handled by the RazorpayPayment component
  }


  const handlePaymentSuccess = async (paymentData: any) => {
    console.log('Payment successful:', paymentData)
    setIsProcessingOrder(true)

    try {
      // Create enhanced order data with enterprise features
      const orderData = {
        items: cartItems,
        customerInfo: {
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
          gstNumber: formData.gstNumber,
          businessType: formData.businessType
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
        billingAddress: formData.sameBillingShipping ? null : {
          address: formData.billingAddress,
          city: formData.billingCity,
          state: formData.billingState,
          pincode: formData.billingPincode
        },
        paymentMethod: 'razorpay',
        paymentReference: paymentData.razorpay_payment_id,
        subtotal: subtotal,
        enterpriseDiscount: enterpriseDiscount,
        shipping: shipping,
        priorityShipping: priorityShipping,
        total: total,
        checkoutMode: checkoutMode,
        priority: formData.priority,
        purchaseOrderNumber: formData.purchaseOrderNumber,
        specialInstructions: formData.specialInstructions,
        userId: session?.user?.email,
        isAuthenticated: !!session?.user
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
        // Clear cart using context
        clearCart()

        // Store enhanced order details for success page
        localStorage.setItem('lastOrderDetails', JSON.stringify({
          orderId: result.orderId,
          orderNumber: result.orderNumber,
          paymentId: paymentData.razorpay_payment_id,
          amount: total,
          items: cartItems,
          customer: formData,
          paymentMethod: 'razorpay',
          checkoutMode: checkoutMode,
          isEnterprise: !!session?.user,
          enterpriseDiscount: enterpriseDiscount,
          priorityShipping: priorityShipping
        }))

        // Redirect to success page with customer data
        const successUrl = `/checkout/success?payment=razorpay&amount=${total}&paymentId=${encodeURIComponent(paymentData.razorpay_payment_id)}&firstName=${encodeURIComponent(formData.firstName)}&lastName=${encodeURIComponent(formData.lastName)}&address=${encodeURIComponent(formData.address)}&city=${encodeURIComponent(formData.city)}&state=${encodeURIComponent(formData.state)}&pincode=${encodeURIComponent(formData.pincode)}&phone=${encodeURIComponent(formData.phone)}`
        router.push(successUrl)
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
    <>
      <CanonicalLink />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <MobileHeader
        showBackButton={true}
        backUrl="/cart"
        backText="Back to Cart"
        showNavigation={false}
        cartCount={itemCount}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 md:mb-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  {session?.user ? 'Enterprise Checkout' : 'Professional Checkout'}
                </h1>
                <p className="text-slate-600 mt-2 text-lg">
                  {session?.user ? 'Streamlined enterprise purchasing experience' : 'Professional-grade checkout process'}
                </p>
              </div>
              {session?.user && (
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <Crown className="h-5 w-5" />
                  <span className="font-semibold">Premium Member</span>
                </div>
              )}
            </div>
          </div>
          {session?.user && userProfile && (
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-6 mb-8 shadow-xl border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold">Welcome back, {userProfile.full_name || session.user.name}!</p>
                  <p className="text-blue-100 flex items-center gap-2 mt-1">
                    <span className="bg-green-500 w-2 h-2 rounded-full"></span>
                    Express checkout enabled • 5% enterprise discount applied
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-slate-600">
            <span className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shadow-lg">
                1
              </div>
              <span className="hidden sm:inline">Shipping</span>
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-slate-300"></div>
            <span className="flex items-center">
              <div className="w-8 h-8 bg-slate-300 text-slate-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </div>
              <span className="hidden sm:inline">Payment</span>
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-slate-300 to-slate-400"></div>
            <span className="flex items-center">
              <div className="w-8 h-8 bg-slate-300 text-slate-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
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
              {/* Checkout Mode Selection for Logged-in Users */}
              {session?.user && (
                <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-t-lg">
                    <CardTitle className="flex items-center text-xl">
                      <Settings className="h-6 w-6 mr-3" />
                      Choose Your Enterprise Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={checkoutMode} onValueChange={setCheckoutMode} className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border-2 border-blue-200 rounded-lg bg-white">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-gray-900 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-600" />
                                Express Checkout
                              </span>
                              <p className="text-sm text-gray-600">Pre-filled with your saved details</p>
                            </div>
                            <Star className="h-5 w-5 text-yellow-500" />
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg bg-white">
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-gray-900 flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-purple-600" />
                                Business Checkout
                              </span>
                              <p className="text-sm text-gray-600">With GST, company details & invoicing</p>
                            </div>
                            <Crown className="h-5 w-5 text-purple-500" />
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg bg-white">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex-1 cursor-pointer">
                          <div>
                            <span className="font-semibold text-gray-900">Standard Checkout</span>
                            <p className="text-sm text-gray-600">Regular checkout process</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}
              {/* Contact Information */}
              <Card className="border-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 text-orange-600 mr-2" />
                    {checkoutMode === 'business' ? 'Business Contact Information' : 'Contact Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Business Information for Business Checkout */}
                  {checkoutMode === 'business' && (
                    <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-purple-600" />
                        Business Details
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            placeholder="Your Company Pvt Ltd"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange("companyName", e.target.value)}
                            className="border-purple-200 focus:border-purple-400"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                          <Input
                            id="gstNumber"
                            placeholder="29AAAPL1234C1Z5"
                            value={formData.gstNumber}
                            onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                            className="border-purple-200 focus:border-purple-400"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="businessType">Business Type</Label>
                          <Select onValueChange={(value) => handleInputChange("businessType", value)} value={formData.businessType}>
                            <SelectTrigger className="border-purple-200">
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="retailer">Retailer</SelectItem>
                              <SelectItem value="wholesaler">Wholesaler</SelectItem>
                              <SelectItem value="distributor">Distributor</SelectItem>
                              <SelectItem value="restaurant">Restaurant</SelectItem>
                              <SelectItem value="hotel">Hotel</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="purchaseOrderNumber">Purchase Order Number (Optional)</Label>
                          <Input
                            id="purchaseOrderNumber"
                            placeholder="PO-2024-001"
                            value={formData.purchaseOrderNumber}
                            onChange={(e) => handleInputChange("purchaseOrderNumber", e.target.value)}
                            className="border-purple-200 focus:border-purple-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}
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

                  {!session?.user && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs">i</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">Professional Guest Checkout</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            Complete your purchase with enterprise-grade features as a guest.
                            You'll receive professional order confirmation and tracking.
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Unlock premium benefits:</strong>
                            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 underline ml-1">
                              Sign in with Google
                            </Link> for express checkout, order history & 5% enterprise discount.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Invoice Email for Business Checkout */}
                  {checkoutMode === 'business' && (
                    <div>
                      <Label htmlFor="invoiceEmail">Invoice Email (if different)</Label>
                      <Input
                        id="invoiceEmail"
                        type="email"
                        placeholder="accounts@yourcompany.com"
                        value={formData.invoiceEmail}
                        onChange={(e) => handleInputChange("invoiceEmail", e.target.value)}
                        className="border-purple-200 focus:border-purple-400"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        GST invoice will be sent here if provided
                      </p>
                    </div>
                  )}
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 7418160520"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="border-orange-200 focus:border-orange-400"
                        required
                      />
                    </div>
                    {(session?.user || checkoutMode === 'business') && (
                      <div>
                        <Label htmlFor="priority">Delivery Priority</Label>
                        <Select onValueChange={(value) => handleInputChange("priority", value)} value={formData.priority}>
                          <SelectTrigger className="border-orange-200">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard (5-7 days) - FREE</SelectItem>
                            <SelectItem value="express">Express (2-3 days) - ₹199</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Billing Address for Business Checkout */}
                  {checkoutMode === 'business' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">Billing Address</h4>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.sameBillingShipping}
                            onChange={toggleBillingShipping}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-600">Same as shipping</span>
                        </label>
                      </div>

                      {!formData.sameBillingShipping && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="billingAddress">Billing Address</Label>
                            <Input
                              id="billingAddress"
                              placeholder="Billing street address"
                              value={formData.billingAddress}
                              onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                              className="border-gray-300 focus:border-gray-400"
                            />
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="billingCity">City</Label>
                              <Input
                                id="billingCity"
                                placeholder="City"
                                value={formData.billingCity}
                                onChange={(e) => handleInputChange("billingCity", e.target.value)}
                                className="border-gray-300 focus:border-gray-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="billingState">State</Label>
                              <Select onValueChange={(value) => handleInputChange("billingState", value)} value={formData.billingState}>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto">
                                  <SelectItem value="karnataka">Karnataka</SelectItem>
                                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                  <SelectItem value="delhi">Delhi</SelectItem>
                                  {/* Add more states as needed */}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="billingPincode">PIN Code</Label>
                              <Input
                                id="billingPincode"
                                placeholder="PIN code"
                                value={formData.billingPincode}
                                onChange={(e) => handleInputChange("billingPincode", e.target.value)}
                                className="border-gray-300 focus:border-gray-400"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Special Instructions */}
                  {(session?.user || checkoutMode === 'business') && (
                    <div>
                      <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                      <textarea
                        id="specialInstructions"
                        placeholder="Any special delivery instructions or requirements..."
                        value={formData.specialInstructions}
                        onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                        className="w-full p-3 border border-orange-200 rounded-md focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 min-h-[80px]"
                      />
                    </div>
                  )}
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
                    {enterpriseDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Enterprise Discount (5%)
                        </span>
                        <span>-₹{enterpriseDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                    </div>
                    {priorityShipping > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Express Delivery
                        </span>
                        <span>₹{priorityShipping}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  <RazorpayPayment
                    amount={total}
                    orderDetails={{
                      customerName: `${formData.firstName} ${formData.lastName}`,
                      customerEmail: formData.email,
                      customerPhone: formData.phone,
                      address: formData,
                      companyName: formData.companyName,
                      checkoutMode: checkoutMode,
                      isEnterprise: !!session?.user
                    }}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />

                  {/* Enhanced Trust Signals */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-orange-600 mr-2" />
                      Enterprise-grade SSL encryption
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-orange-600 mr-2" />
                      Free shipping on orders above ₹999
                    </div>
                    {session?.user && (
                      <div className="flex items-center text-green-600">
                        <Crown className="h-4 w-4 mr-2" />
                        Premium member benefits applied
                      </div>
                    )}
                    {checkoutMode === 'business' && (
                      <div className="flex items-center text-purple-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        GST invoice & business receipts
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
      </div>
    </>
  )
}
