"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  Users,
  TrendingUp,
  Truck,
  Shield,
  Calculator,
  MessageCircle,
  Download,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

// Mock B2B products with bulk pricing
const b2bProducts = [
  {
    id: 1,
    name: "Traditional Clay Cooking Pot",
    category: "Cooking",
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
    pricing: [
      { quantity: "1-49", price: 599 },
      { quantity: "50-99", price: 549, discount: "8%" },
      { quantity: "100-499", price: 499, discount: "17%" },
      { quantity: "500+", price: 449, discount: "25%" },
    ],
    moq: 50,
    leadTime: "7-10 days",
  },
  {
    id: 2,
    name: "Handcrafted Serving Bowl Set",
    category: "Serving",
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
    pricing: [
      { quantity: "1-24", price: 899 },
      { quantity: "25-49", price: 829, discount: "8%" },
      { quantity: "50-199", price: 749, discount: "17%" },
      { quantity: "200+", price: 674, discount: "25%" },
    ],
    moq: 25,
    leadTime: "10-14 days",
  },
]

export default function B2BPage() {
  const [quoteForm, setQuoteForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    requirements: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setQuoteForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Quote request submitted:", quoteForm)
    alert("Quote request submitted! We'll contact you within 24 hours.")
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

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-orange-600 font-medium">
                Products
              </Link>
              <Link href="/collections" className="text-gray-700 hover:text-orange-600 font-medium">
                Collections
              </Link>
              <Link href="/b2b" className="text-orange-600 font-medium">
                B2B Portal
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 font-medium">
                Our Story
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 font-medium">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700" size="sm">
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200">B2B Solutions</Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Wholesale Terracotta
            <span className="block text-orange-600">for Your Business</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
            Partner with Clayfable for bulk terracotta supplies. Serving restaurants, hotels, retailers, and
            distributors with premium quality products and competitive wholesale pricing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-4">
              Request Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-orange-200 hover:bg-orange-50 bg-transparent"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* B2B Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Clayfable B2B?</h2>
            <p className="text-xl text-gray-600">Trusted by 500+ businesses across India and internationally</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-orange-100 text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Volume Discounts</h3>
                <p className="text-gray-600">Up to 25% off on bulk orders</p>
              </CardContent>
            </Card>

            <Card className="border-orange-100 text-center">
              <CardContent className="p-6">
                <Truck className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600">7-14 days lead time guaranteed</p>
              </CardContent>
            </Card>

            <Card className="border-orange-100 text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Quality Assured</h3>
                <p className="text-gray-600">ISO certified manufacturing</p>
              </CardContent>
            </Card>

            <Card className="border-orange-100 text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Dedicated Support</h3>
                <p className="text-gray-600">Personal account manager</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bulk Pricing */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Bulk Pricing</h2>
            <p className="text-xl text-gray-600">Transparent pricing with volume discounts</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {b2bProducts.map((product) => (
              <Card key={product.id} className="border-orange-100">
                <CardContent className="p-6">
                  <div className="flex gap-6 mb-6">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>MOQ: {product.moq} units</span>
                        <span>Lead Time: {product.leadTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900">Volume Pricing:</h4>
                    {product.pricing.map((tier, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="font-medium text-gray-900">{tier.quantity} units</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-orange-600">₹{tier.price}</span>
                          {tier.discount && (
                            <Badge variant="destructive" className="bg-green-100 text-green-800">
                              {tier.discount} OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                      <Calculator className="h-4 w-4 mr-2" />
                      Get Quote
                    </Button>
                    <Button variant="outline" className="border-orange-200 hover:bg-orange-50 bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Request Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Request a Quote</h2>
              <p className="text-xl text-gray-600">Get personalized pricing for your business needs</p>
            </div>

            <Card className="border-orange-100">
              <CardContent className="p-8">
                <form onSubmit={handleQuoteSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="Your company name"
                        value={quoteForm.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        className="border-orange-200 focus:border-orange-400"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input
                        id="contactName"
                        placeholder="Your full name"
                        value={quoteForm.contactName}
                        onChange={(e) => handleInputChange("contactName", e.target.value)}
                        className="border-orange-200 focus:border-orange-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@company.com"
                        value={quoteForm.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="border-orange-200 focus:border-orange-400"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={quoteForm.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="border-orange-200 focus:border-orange-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select onValueChange={(value) => handleInputChange("businessType", value)}>
                      <SelectTrigger className="border-orange-200">
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="retailer">Retailer</SelectItem>
                        <SelectItem value="distributor">Distributor</SelectItem>
                        <SelectItem value="export">Export Business</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Tell us about your requirements, quantities, and timeline..."
                      value={quoteForm.requirements}
                      onChange={(e) => handleInputChange("requirements", e.target.value)}
                      className="border-orange-200 focus:border-orange-400 min-h-[120px]"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-4">
                    Submit Quote Request
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Trusted by leading businesses</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Building2 className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <h4 className="font-bold text-gray-900">Spice Route Restaurant</h4>
                    <p className="text-sm text-gray-600">Mumbai</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Clayfable's terracotta cookware has elevated our authentic Indian cuisine. The bulk pricing helped us
                  outfit our entire kitchen cost-effectively."
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  500+ pieces ordered
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Building2 className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <h4 className="font-bold text-gray-900">Heritage Hotels Group</h4>
                    <p className="text-sm text-gray-600">Rajasthan</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Perfect for our heritage hotel chain. The quality and authenticity align perfectly with our brand.
                  Excellent B2B support."
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  1000+ pieces across 5 hotels
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Building2 className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <h4 className="font-bold text-gray-900">Artisan Exports Ltd</h4>
                    <p className="text-sm text-gray-600">Delhi</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Reliable partner for our international exports. Consistent quality and timely delivery have helped us
                  grow our overseas business."
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Monthly orders of 2000+ pieces
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
