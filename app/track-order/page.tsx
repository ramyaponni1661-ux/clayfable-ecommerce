"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Package, Truck, MapPin, Clock, CheckCircle, Circle, ArrowLeft, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import CanonicalLink from "@/components/seo/canonical-link"

interface TrackingStatus {
  status: string
  description: string
  date: string
  time: string
  location?: string
  isCompleted: boolean
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const orderParam = searchParams?.get('order')

  const [orderNumber, setOrderNumber] = useState(orderParam || "")
  const [tracking, setTracking] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Mock tracking data - only for demo orders that don't exist in database
  const mockTrackingData = {
    "CLF-ABC123456": {
      orderNumber: "CLF-ABC123456",
      orderDate: "2024-01-15",
      expectedDelivery: "2024-01-20",
      currentStatus: "shipped",
      carrier: "Express Delivery",
      trackingNumber: "ED123456789",
      shippingAddress: {
        name: "John Doe",
        address: "123 Main Street, City Name",
        pincode: "400001",
        phone: "+91 7418160520"
      },
      items: [
        {
          name: "Traditional Clay Cooking Pot",
          quantity: 2,
          price: 149,
          image: "/traditional-terracotta-cooking-pots-and-vessels.jpg"
        },
        {
          name: "Handcrafted Serving Bowl Set",
          quantity: 1,
          price: 149,
          image: "/elegant-terracotta-serving-bowls-and-plates.jpg"
        }
      ],
      timeline: [
        {
          status: "Order Placed",
          description: "Your order has been successfully placed",
          date: "2024-01-15",
          time: "10:30 AM",
          location: "Clayfable Store",
          isCompleted: true
        },
        {
          status: "Order Confirmed",
          description: "Payment confirmed and order accepted",
          date: "2024-01-15",
          time: "10:35 AM",
          location: "Clayfable Store",
          isCompleted: true
        },
        {
          status: "Preparing",
          description: "Your items are being carefully prepared",
          date: "2024-01-16",
          time: "09:00 AM",
          location: "Clayfable Workshop",
          isCompleted: true
        },
        {
          status: "Shipped",
          description: "Package has been shipped via Express Delivery",
          date: "2024-01-17",
          time: "02:15 PM",
          location: "Mumbai Hub",
          isCompleted: true
        },
        {
          status: "In Transit",
          description: "Package is on the way to your location",
          date: "2024-01-18",
          time: "06:00 AM",
          location: "Local Distribution Center",
          isCompleted: false
        },
        {
          status: "Out for Delivery",
          description: "Package is out for delivery",
          date: "2024-01-20",
          time: "Expected",
          location: "Your Area",
          isCompleted: false
        },
        {
          status: "Delivered",
          description: "Package delivered successfully",
          date: "2024-01-20",
          time: "Expected",
          location: "Your Address",
          isCompleted: false
        }
      ]
    }
  }

  const trackOrder = async () => {
    if (!orderNumber.trim()) {
      setError("Please enter an order number")
      return
    }

    setLoading(true)
    setError("")

    try {
      // First try to get real order data from API
      const response = await fetch(`/api/track-order?orderNumber=${encodeURIComponent(orderNumber)}`)

      if (response.ok) {
        const data = await response.json()
        const realOrder = data.order

        if (realOrder && realOrder.products?.length > 0) {
          // Convert real order data to tracking format
          const realTrackingData = {
            orderNumber: realOrder.id,
            orderDate: realOrder.date,
            expectedDelivery: realOrder.estimatedDelivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            currentStatus: realOrder.status.toLowerCase(),
            carrier: "Express Delivery",
            trackingNumber: realOrder.trackingNumber,
            shippingAddress: realOrder.shippingAddress ? {
              name: `${realOrder.shippingAddress.firstName || ''} ${realOrder.shippingAddress.lastName || ''}`.trim() || "Customer",
              address: `${realOrder.shippingAddress.address || ''}, ${realOrder.shippingAddress.city || ''}, ${realOrder.shippingAddress.state || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',') || "Customer Address",
              pincode: realOrder.shippingAddress.pincode || "PIN Code",
              phone: realOrder.shippingAddress.phone || "Phone Number"
            } : {
              name: "Customer",
              address: "Customer Address",
              pincode: "PIN Code",
              phone: "Phone Number"
            },
            items: realOrder.products.map((product: any) => ({
              name: product.name,
              quantity: product.quantity,
              price: product.price,
              image: "/traditional-terracotta-cooking-pots-and-vessels.jpg" // Default for now
            })),
            timeline: [
              {
                status: "Order Placed",
                description: "Your order has been successfully placed",
                date: realOrder.date,
                time: new Date(`${realOrder.date}T10:30:00`).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                location: "Clayfable Store",
                isCompleted: true
              },
              {
                status: "Payment Confirmed",
                description: `Online payment of ₹${realOrder.total.toLocaleString('en-IN')} confirmed`,
                date: realOrder.date,
                time: new Date(`${realOrder.date}T10:35:00`).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                location: "Clayfable Store",
                isCompleted: true
              },
              {
                status: "Preparing",
                description: "Your items are being carefully prepared by our artisans",
                date: realOrder.status.toLowerCase() !== "processing" ? realOrder.date : "Expected",
                time: realOrder.status.toLowerCase() !== "processing" ?
                  new Date(`${realOrder.date}T14:00:00`).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) :
                  "Expected",
                location: "Clayfable Workshop",
                isCompleted: realOrder.status.toLowerCase() !== "processing"
              },
              {
                status: "Ready to Ship",
                description: "Package is ready for dispatch",
                date: ["shipped", "delivered"].includes(realOrder.status.toLowerCase()) ?
                  new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
                  "Expected",
                time: "Expected",
                location: "Clayfable Warehouse",
                isCompleted: ["shipped", "delivered"].includes(realOrder.status.toLowerCase())
              },
              {
                status: "Shipped",
                description: "Package has been shipped via Express Delivery",
                date: realOrder.status.toLowerCase() === "delivered" ?
                  new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
                  "Expected",
                time: "Expected",
                location: "Local Distribution Hub",
                isCompleted: realOrder.status.toLowerCase() === "delivered"
              },
              {
                status: "Delivered",
                description: `Package delivered to ${realOrder.shippingAddress?.address || 'your address'}`,
                date: "Expected",
                time: "Expected",
                location: "Your Address",
                isCompleted: realOrder.status.toLowerCase() === "delivered"
              }
            ]
          }

          setTracking(realTrackingData)
          setError("")
          setLoading(false)
          return
        }
      }

      // Fallback to mock data if no real data found
      const trackingData = mockTrackingData[orderNumber as keyof typeof mockTrackingData]

      if (trackingData) {
        setTracking(trackingData)
        setError("")
      } else {
        setError("Order not found. Please check your order number and try again.")
        setTracking(null)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      // Fallback to mock data on error
      const trackingData = mockTrackingData[orderNumber as keyof typeof mockTrackingData]

      if (trackingData) {
        setTracking(trackingData)
        setError("")
      } else {
        setError("Order not found. Please check your order number and try again.")
        setTracking(null)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderParam) {
      trackOrder()
    }
  }, [orderParam])

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
      case 'in transit':
      case 'out for delivery':
        return 'bg-blue-100 text-blue-800'
      case 'preparing':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <CanonicalLink />
      <div className="min-h-screen bg-gray-50">
      <ProductHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
            <p className="text-gray-600 mt-2">Enter your order number to track your package</p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Order Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="orderNumber" className="text-sm font-medium">
                    Order Number
                  </Label>
                  <Input
                    id="orderNumber"
                    placeholder="Enter your order number (e.g., CLF-ABC123456)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You can find your order number in the confirmation email
                  </p>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={trackOrder}
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {loading ? "Tracking..." : "Track Order"}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tracking Results */}
          {tracking && (
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Order #{tracking.orderNumber}</span>
                    <Badge className={getStatusBadgeColor(tracking.currentStatus)}>
                      {tracking.currentStatus.charAt(0).toUpperCase() + tracking.currentStatus.slice(1)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span>{new Date(tracking.orderDate).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Carrier:</span>
                          <span>{tracking.carrier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tracking Number:</span>
                          <span className="font-mono">{tracking.trackingNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expected Delivery:</span>
                          <span className="font-medium text-green-600">
                            {new Date(tracking.expectedDelivery).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Delivery Address</h4>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{tracking.shippingAddress.name}</p>
                        <p>{tracking.shippingAddress.address}</p>
                        <p>PIN: {tracking.shippingAddress.pincode}</p>
                        <p>Phone: {tracking.shippingAddress.phone}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Tracking Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tracking.timeline.map((event: TrackingStatus, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-200">
                          {event.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${event.isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                              {event.status}
                            </h4>
                            <div className="text-sm text-gray-500">
                              {event.date} {event.time}
                            </div>
                          </div>
                          <p className={`text-sm ${event.isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                            {event.description}
                          </p>
                          {event.location && (
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tracking.items.map((item: any, index: number) => (
                      <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Help Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center justify-center"
                      onClick={() => window.open('tel:+917418160520', '_self')}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Support
                    </Button>
                    <Link href="/contact">
                      <Button variant="outline" className="flex items-center justify-center w-full">
                        <Mail className="mr-2 h-4 w-4" />
                        Email Support
                      </Button>
                    </Link>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    For any queries about your order, contact our customer support team
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Demo Notice */}
          <Card className="mt-8 bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <h3 className="font-medium text-orange-900 mb-2">Demo Order for Testing</h3>
              <p className="text-sm text-orange-700 mb-3">
                You can test the tracking system with this demo order number:
              </p>
              <div className="flex items-center gap-2">
                <code className="bg-orange-100 px-2 py-1 rounded text-sm font-mono">CLF-ABC123456</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setOrderNumber("CLF-ABC123456")
                    trackOrder()
                  }}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Try Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ProductFooter />
      </div>
    </>
  )
}