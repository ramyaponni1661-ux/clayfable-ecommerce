"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
  Send,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react"
import Link from "next/link"
import ProductFooter from "@/components/product-footer"
import TrustBanner from "@/components/trust-banner"
import ProductHeader from "@/components/product-header"
import { useEffect, useState } from "react"

export default function ContactPage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleVisibility = () => {
      const elements = document.querySelectorAll(".scroll-animate")
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("in-view")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("scroll", handleVisibility)
    handleVisibility()

    setTimeout(() => setIsVisible(true), 100)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("scroll", handleVisibility)
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+917418160520",
      description: "Call us for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      details: "support@clayfable.com",
      description: "Send us your questions anytime"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "India",
      description: "Visit our workshop and showroom"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon - Sat: 9 AM - 6 PM",
      description: "Sunday: By appointment only"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 relative overflow-hidden">
      {/* Trust Banner */}
      <TrustBanner />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-parallaxFloat"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-amber-300 rounded-full opacity-15 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/3 w-20 h-20 bg-orange-300 rounded-full opacity-10 animate-bounce"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <ProductHeader />

      {/* Hero Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200">
              We'd Love to Hear From You
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Get in
              <span className="text-orange-600 relative inline-block ml-4">
                Touch
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Have questions about our products or need assistance with your order?
              Our friendly team is here to help you discover the perfect terracotta pieces for your home.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card
                key={info.title}
                className="text-center group hover:shadow-xl transition-all duration-500 border-orange-100 hover-lift scroll-animate"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <info.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-orange-600 font-semibold mb-1">{info.details}</p>
                  <p className="text-sm text-gray-600">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Quick Actions */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="scroll-animate">
              <Card className="border-orange-100 shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="border-orange-200 focus:border-orange-400"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
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
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          className="border-orange-200 focus:border-orange-400"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="border-orange-200 focus:border-orange-400"
                        placeholder="Tell us about your inquiry..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3"
                    >
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-8 scroll-animate">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <MessageCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">WhatsApp Chat</h3>
                          <p className="text-sm text-gray-600">Get instant help via WhatsApp</p>
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Chat Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Phone className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Schedule a Call</h3>
                          <p className="text-sm text-gray-600">Book a consultation with our experts</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-blue-200">
                          Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Mail className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Custom Quote</h3>
                          <p className="text-sm text-gray-600">Request a quote for bulk orders</p>
                        </div>
                        <Link href="/b2b">
                          <Button size="sm" variant="outline" className="border-purple-200">
                            Get Quote
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
                    <Facebook className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
                    <Twitter className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <Card className="border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Need Quick Answers?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Check our frequently asked questions for instant help.
                  </p>
                  <Button variant="outline" className="border-orange-200">
                    View FAQ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <ProductFooter />
    </div>
  )
}