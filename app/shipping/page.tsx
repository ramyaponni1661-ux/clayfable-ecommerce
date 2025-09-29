"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Package, Shield, Clock, MapPin, Calendar, CheckCircle, AlertCircle, Info } from "lucide-react"
import Link from "next/link"
import ProductFooter from "@/components/product-footer"
import ProductHeader from "@/components/product-header"
import CanonicalLink from "@/components/seo/canonical-link"

export default function ShippingPolicyPage() {
  const shippingZones = [
    {
      zone: "Zone 1 - Metro Cities",
      cities: "Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad",
      standardDelivery: "2-3 business days",
      expressDelivery: "1-2 business days",
      freeShippingThreshold: "₹999"
    },
    {
      zone: "Zone 2 - Major Cities",
      cities: "Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Visakhapatnam, Patna",
      standardDelivery: "3-4 business days",
      expressDelivery: "2-3 business days",
      freeShippingThreshold: "₹1,499"
    },
    {
      zone: "Zone 3 - Other Cities & Towns",
      cities: "All other serviceable locations across India",
      standardDelivery: "4-7 business days",
      expressDelivery: "3-5 business days",
      freeShippingThreshold: "₹1,999"
    }
  ]

  const shippingCharges = [
    { weight: "Up to 500g", standard: "₹49", express: "₹99" },
    { weight: "501g - 1kg", standard: "₹79", express: "₹149" },
    { weight: "1.1kg - 2kg", standard: "₹99", express: "₹199" },
    { weight: "2.1kg - 5kg", standard: "₹149", express: "₹299" },
    { weight: "Above 5kg", standard: "₹199", express: "₹399" }
  ]

  const internationalZones = [
    { region: "South Asia", countries: "Nepal, Sri Lanka, Bangladesh", delivery: "7-10 business days", charges: "₹499" },
    { region: "Southeast Asia", countries: "Singapore, Malaysia, Thailand", delivery: "10-14 business days", charges: "₹799" },
    { region: "Middle East", countries: "UAE, Saudi Arabia, Qatar", delivery: "12-15 business days", charges: "₹999" },
    { region: "Europe & North America", countries: "USA, UK, Canada, Germany", delivery: "15-21 business days", charges: "₹1,499" },
    { region: "Rest of World", countries: "All other countries", delivery: "18-25 business days", charges: "₹1,999" }
  ]

  return (
    <>
      <CanonicalLink />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <ProductHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200">
            Shipping Information
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We deliver authentic terracotta products safely to your doorstep. Learn about our shipping zones, delivery timelines, and policies.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-orange-100 text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders above ₹999 for metro cities</p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Safe Packaging</h3>
              <p className="text-gray-600">Special protection for fragile terracotta items</p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Express delivery available in 1-2 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Domestic Shipping */}
        <Card className="border-orange-100 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapPin className="h-6 w-6 text-orange-600" />
              Domestic Shipping (India)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {shippingZones.map((zone, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{zone.zone}</h4>
                      <p className="text-gray-600 mb-2 text-sm">{zone.cities}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>Standard: {zone.standardDelivery}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-green-600" />
                          <span>Express: {zone.expressDelivery}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">
                        Free shipping above {zone.freeShippingThreshold}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Charges */}
        <Card className="border-orange-100 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Shipping Charges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Package Weight</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Standard Delivery</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Express Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingCharges.map((charge, index) => (
                    <tr key={index} className="border-b hover:bg-orange-50">
                      <td className="py-3 px-4 text-gray-700">{charge.weight}</td>
                      <td className="py-3 px-4 text-center font-medium text-orange-600">{charge.standard}</td>
                      <td className="py-3 px-4 text-center font-medium text-orange-600">{charge.express}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">Important Notes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Shipping charges are calculated based on the total weight of your order</li>
                    <li>Free shipping applies when order value exceeds the threshold for your zone</li>
                    <li>Express delivery available only for in-stock items</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* International Shipping */}
        <Card className="border-orange-100 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Package className="h-6 w-6 text-orange-600" />
              International Shipping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {internationalZones.map((zone, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{zone.region}</h4>
                      <p className="text-sm text-gray-600">{zone.countries}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{zone.delivery}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-orange-600">{zone.charges}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-2">International Shipping Terms:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>International shipping charges are exclusive of customs duties and taxes</li>
                    <li>Delivery times may vary due to customs clearance</li>
                    <li>Some countries may have restrictions on ceramic imports</li>
                    <li>Minimum order value of ₹2,999 required for international shipping</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Handling */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Special Packaging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Fragile Item Protection</h4>
                    <p className="text-sm text-gray-600">Extra cushioning and bubble wrap for all terracotta products</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Water-Resistant Packaging</h4>
                    <p className="text-sm text-gray-600">Protected against moisture during transit</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Temperature Control</h4>
                    <p className="text-sm text-gray-600">Special handling for extreme weather conditions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                Order Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Order Confirmation</h4>
                    <p className="text-sm text-gray-600">Within 2 hours of placing order</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Processing Time</h4>
                    <p className="text-sm text-gray-600">1-2 business days for in-stock items</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Tracking Information</h4>
                    <p className="text-sm text-gray-600">SMS and email updates with tracking number</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unserviceable Areas */}
        <Card className="border-orange-100 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Delivery Restrictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Currently Not Serviceable:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Remote hill stations and tribal areas</li>
                    <li>• Military and restricted areas (requires special permission)</li>
                    <li>• Some islands and border areas</li>
                    <li>• Areas with ongoing civil unrest or natural disasters</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    Please check serviceability by entering your PIN code during checkout. For special delivery requests,
                    <Link href="/contact" className="text-orange-600 hover:underline ml-1">contact our support team</Link>.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-orange-100">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help with Shipping?</h3>
            <p className="text-gray-600 mb-6">
              Our customer support team is here to help with any shipping questions or special requests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Contact Support
                </Button>
              </Link>
              <Button variant="outline" className="border-orange-200 hover:bg-orange-50">
                Track Your Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProductFooter />
      </div>
    </>
  )
}