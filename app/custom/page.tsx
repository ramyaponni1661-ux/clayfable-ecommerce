"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Palette,
  Users,
  Star,
  Clock,
  CheckCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Truck,
  Shield,
  Award,
  Building,
  Sparkles,
  Heart
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"

export default function CustomOrdersPage() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [orderType, setOrderType] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const customCategories = [
    {
      title: "Custom Dinnerware Sets",
      description: "Personalized dining collections for your family or business",
      image: "/custom/dinnerware-custom.jpg",
      minOrder: "12 pieces",
      timeline: "3-4 weeks",
      price: "From ₹299/piece"
    },
    {
      title: "Bulk Corporate Orders",
      description: "Large volume orders for restaurants, hotels, and institutions",
      image: "/custom/corporate-bulk.jpg",
      minOrder: "100+ pieces",
      timeline: "4-6 weeks",
      price: "From ₹199/piece"
    },
    {
      title: "Wedding Collections",
      description: "Special pottery sets for weddings and celebrations",
      image: "/custom/wedding-collection.jpg",
      minOrder: "50 pieces",
      timeline: "5-7 weeks",
      price: "From ₹399/piece"
    },
    {
      title: "Architectural Elements",
      description: "Custom tiles, panels, and decorative architectural pieces",
      image: "/custom/architectural.jpg",
      minOrder: "25+ sq ft",
      timeline: "6-8 weeks",
      price: "From ₹599/sq ft"
    },
    {
      title: "Branded Corporate Gifts",
      description: "Custom pottery with your company logo and branding",
      image: "/custom/corporate-gifts.jpg",
      minOrder: "25 pieces",
      timeline: "3-5 weeks",
      price: "From ₹499/piece"
    },
    {
      title: "Artistic Commissions",
      description: "One-of-a-kind artistic pieces designed to your specifications",
      image: "/custom/artistic-commission.jpg",
      minOrder: "1 piece",
      timeline: "8-12 weeks",
      price: "From ₹2,999/piece"
    }
  ]

  const customizationOptions = [
    { icon: Palette, title: "Colors & Glazes", description: "Choose from 50+ colors and finish options" },
    { icon: FileText, title: "Engravings & Text", description: "Add personal messages, names, or logos" },
    { icon: Star, title: "Shapes & Sizes", description: "Customize dimensions to your exact requirements" },
    { icon: Sparkles, title: "Special Finishes", description: "Metallic accents, textures, and artistic details" }
  ]

  const processSteps = [
    { step: 1, title: "Submit Request", description: "Fill out our detailed custom order form", icon: FileText },
    { step: 2, title: "Design Consultation", description: "Our designers work with you to refine your vision", icon: Users },
    { step: 3, title: "Sample Creation", description: "We create a prototype for your approval", icon: Star },
    { step: 4, title: "Production", description: "Master craftsmen bring your design to life", icon: CheckCircle },
    { step: 5, title: "Quality Check", description: "Rigorous quality control ensures perfection", icon: Shield },
    { step: 6, title: "Delivery", description: "Secure packaging and timely delivery to your location", icon: Truck }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-purple-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-pink-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200 text-sm px-4 py-2">
                Custom Orders & B2B Solutions
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Custom <span className="text-purple-600">Terracotta</span> Creations
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Bring your unique vision to life with our custom pottery services. From personalized dinnerware
                to large-scale architectural projects, we craft bespoke terracotta solutions for individuals,
                businesses, and institutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                  Start Custom Order
                </Button>
                <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-50 text-lg px-8 py-3">
                  Download Catalog
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Customization Options */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Unlimited Customization Possibilities</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Every aspect of your pottery can be customized to match your exact specifications and aesthetic preferences
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {customizationOptions.map((option, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <option.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Order Categories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our range of custom pottery services designed for various needs and applications
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {customCategories.map((category, index) => (
                <Card key={index} className="group border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <Heart className="h-12 w-12 text-purple-400" />
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-purple-600">
                          {category.timeline}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">{category.description}</p>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Min Order:</span>
                          <span className="font-medium">{category.minOrder}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Timeline:</span>
                          <span className="font-medium">{category.timeline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Price:</span>
                          <span className="font-medium text-purple-600">{category.price}</span>
                        </div>
                      </div>

                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Request Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Custom Order Process</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From initial concept to final delivery, we guide you through every step of creating your perfect pottery
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-purple-200 -ml-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Request Form */}
        <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="border-purple-100">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">Request Custom Quote</CardTitle>
                  <p className="text-gray-600">Tell us about your project and we'll provide a detailed quote within 24 hours</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <Input placeholder="Your full name" className="border-purple-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <Input type="email" placeholder="your@email.com" className="border-purple-100" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <Input placeholder="+91 9876543210" className="border-purple-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                      <Select value={orderType} onValueChange={setOrderType}>
                        <SelectTrigger className="border-purple-100">
                          <SelectValue placeholder="Select order type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dinnerware">Custom Dinnerware</SelectItem>
                          <SelectItem value="corporate">Corporate Order</SelectItem>
                          <SelectItem value="wedding">Wedding Collection</SelectItem>
                          <SelectItem value="architectural">Architectural Elements</SelectItem>
                          <SelectItem value="gifts">Corporate Gifts</SelectItem>
                          <SelectItem value="artistic">Artistic Commission</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Needed</label>
                      <Input placeholder="e.g., 100 pieces" className="border-purple-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Delivery Date</label>
                      <Input type="date" className="border-purple-100" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                    <Textarea
                      placeholder="Please describe your custom pottery requirements, including size, colors, design preferences, intended use, and any special requirements..."
                      className="border-purple-100 min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range (Optional)</label>
                    <Select>
                      <SelectTrigger className="border-purple-100">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-10k">Under ₹10,000</SelectItem>
                        <SelectItem value="10k-25k">₹10,000 - ₹25,000</SelectItem>
                        <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
                        <SelectItem value="50k-1l">₹50,000 - ₹1,00,000</SelectItem>
                        <SelectItem value="above-1l">Above ₹1,00,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3">
                    Submit Quote Request
                  </Button>

                  <div className="text-center text-sm text-gray-500">
                    We'll respond within 24 hours with a detailed quote and timeline
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions about custom orders? Our team is here to help you bring your vision to life
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="border-purple-100 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600">+91 7418 160 520</p>
                  <p className="text-sm text-gray-500 mt-2">Mon-Sat: 9 AM - 7 PM</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">custom@clayfable.com</p>
                  <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Visit Our Studio</h3>
                  <p className="text-gray-600">Artisan Village, Chennai</p>
                  <p className="text-sm text-gray-500 mt-2">By appointment only</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">500+ Business Clients</h3>
                <p className="text-gray-600">Trusted by restaurants, hotels, and corporations across India</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">On-Time Delivery</h3>
                <p className="text-gray-600">95% of custom orders delivered within promised timeline</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Master Craftsmen</h3>
                <p className="text-gray-600">Over 70 years of combined experience in custom pottery</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}