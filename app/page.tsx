"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Truck, Award, Users, ArrowRight, Phone, Mail, MapPin, Menu, X, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import WhatsAppWidget from "@/components/whatsapp-widget"
import Footer from "@/components/footer"
import TrustBanner from "@/components/trust-banner"
import NotificationSystem from "@/components/notification-system"
import { UserProfile } from "@/components/user-profile"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    handleVisibility() // Initial check

    // Trigger initial animations
    setTimeout(() => setIsVisible(true), 100)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("scroll", handleVisibility)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 relative overflow-hidden">
      {/* Trust Banner */}
      <TrustBanner />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-parallaxFloat"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-amber-300 rounded-full opacity-15 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-red-200 rounded-full opacity-25 animate-parallaxFloat"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-16 h-16 bg-orange-300 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo - Responsive */}
            <Link href="/" className={`flex items-center space-x-2 ${isVisible ? "animate-slideInLeft" : "opacity-0"}`}>
              <div className="relative">
                <img
                  src="/icon-transparent.png"
                  alt="Clayfable Logo"
                  className="h-10 w-10 md:h-14 md:w-14 hover-glow"
                  style={{
                    display: 'block',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/icon.png';
                    e.currentTarget.onerror = function() {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.style.display = 'block';
                      }
                    };
                  }}
                />
                <div className="hidden w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center hover-glow">
                  <span className="text-white font-bold text-lg md:text-xl">C</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">Clayfable</h1>
                <p className="text-xs text-orange-600 font-medium">EST. 1952</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className={`hidden lg:flex items-center space-x-6 xl:space-x-8 z-50 relative ${isVisible ? "animate-fadeInUp stagger-2" : ""}`}>
              <Link href="/products" className="text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:scale-105 relative z-50 cursor-pointer">
                Products
              </Link>
              <Link href="/collections" className="text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:scale-105 relative z-50 cursor-pointer">
                Collections
              </Link>
              <Link href="/b2b" className="text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:scale-105 relative z-50 cursor-pointer">
                B2B Portal
              </Link>
              <Link href="/videos" className="text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:scale-105 relative z-50 cursor-pointer">
                Videos
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:scale-105 relative z-50 cursor-pointer">
                Our Story
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 font-medium transition-all duration-300 hover:scale-105 relative z-50 cursor-pointer">
                Contact
              </Link>
            </nav>

            {/* Mobile & Desktop Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-4">
                <NotificationSystem />
                <UserProfile />
              </div>

              {/* Cart Button - Always Visible */}
              <Link href="/cart">
                <Button size="sm" variant="outline" className="border-orange-200 hover:bg-orange-50 flex items-center space-x-1 px-2 md:px-4">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Cart</span>
                  <span className="bg-orange-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">0</span>
                </Button>
              </Link>

              {/* Mobile User Profile */}
              <div className="md:hidden">
                <UserProfile />
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-orange-100 shadow-lg animate-slideDown">
              <nav className="container mx-auto px-4 py-6 space-y-4">
                <Link
                  href="/products"
                  className="block text-gray-700 hover:text-orange-600 font-medium py-2 border-b border-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/collections"
                  className="block text-gray-700 hover:text-orange-600 font-medium py-2 border-b border-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Collections
                </Link>
                <Link
                  href="/b2b"
                  className="block text-gray-700 hover:text-orange-600 font-medium py-2 border-b border-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  B2B Portal
                </Link>
                <Link
                  href="/videos"
                  className="block text-gray-700 hover:text-orange-600 font-medium py-2 border-b border-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Videos
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-700 hover:text-orange-600 font-medium py-2 border-b border-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Story
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-700 hover:text-orange-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                {/* Mobile Notifications */}
                <div className="pt-4 border-t border-gray-100">
                  <NotificationSystem />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <section className="py-12 md:py-20 px-4 relative bg-pattern-dots">
        <div
          className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-amber-100/30"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
        <div className="container mx-auto text-center relative z-10">
          <Badge
            className={`mb-4 md:mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200 text-sm md:text-base ${isVisible ? "animate-scaleIn stagger-1" : "opacity-0"}`}
          >
            72 Years of Craftsmanship Excellence
          </Badge>

          <h1
            className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 text-balance leading-tight ${isVisible ? "animate-fadeInUp stagger-2" : "opacity-0"}`}
          >
            Authentic Terracotta
            <span className="block text-orange-600 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Crafted with Heritage
            </span>
          </h1>

          <p
            className={`text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto text-pretty px-4 ${isVisible ? "animate-fadeInUp stagger-3" : "opacity-0"}`}
          >
            From our family kilns to your table, discover premium terracotta cookware and serveware that brings
            generations of Indian craftsmanship to modern kitchens worldwide.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4 ${isVisible ? "animate-fadeInUp stagger-4" : "opacity-0"}`}
          >
            <Link href="/products">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 hover-lift hover-glow w-full sm:w-auto">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <Link href="/videos">
              <Button
                variant="outline"
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 border-orange-200 hover:bg-orange-50 bg-transparent hover-lift w-full sm:w-auto"
              >
                Watch Our Story
              </Button>
            </Link>
          </div>

          <div className={`relative max-w-4xl mx-auto ${isVisible ? "animate-scaleIn stagger-5" : "opacity-0"}`}>
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
            <img
              src="/beautiful-terracotta-pottery-collection-on-rustic-.jpg"
              alt="Clayfable terracotta collection"
              className="rounded-2xl shadow-2xl relative z-10 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg hover-lift">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current animate-pulse" />
                <span className="font-bold text-gray-900">4.9</span>
                <span className="text-gray-600">• 2,847 reviews</span>
              </div>
            </div>

            <div className="absolute -top-8 -left-8 w-16 h-16 bg-orange-200 rounded-full opacity-60 animate-float"></div>
            <div className="absolute -bottom-4 -left-12 w-12 h-12 bg-amber-300 rounded-full opacity-40 animate-parallaxFloat"></div>
            <div
              className="absolute -top-4 -right-12 w-20 h-20 bg-red-200 rounded-full opacity-50 animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Shield, title: "Certified Quality", desc: "ISO 9001:2015 Certified" },
              { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
              { icon: Award, title: "Award Winning", desc: "National Craft Award 2023" },
              { icon: Users, title: "50,000+ Customers", desc: "Trusted worldwide" },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center scroll-animate hover-lift`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <item.icon className="h-12 w-12 text-orange-600 mb-4 hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-orange-50 to-amber-50 bg-pattern-grid relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collections</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular terracotta pieces, each telling a story of tradition and craftsmanship
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
                title: "Cooking Collection",
                desc: "Traditional pots, pans, and cooking vessels for authentic flavors",
                price: "From ₹299",
                badge: "Best Seller",
                badgeColor: "bg-orange-600",
              },
              {
                image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
                title: "Serving Collection",
                desc: "Elegant bowls, plates, and serving dishes for every occasion",
                price: "From ₹199",
              },
              {
                image: "/decorative-terracotta-vases-and-planters.jpg",
                title: "Decor Collection",
                desc: "Beautiful vases, planters, and decorative pieces",
                price: "From ₹149",
                badge: "New",
                badgeColor: "bg-green-600",
              },
            ].map((collection, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-xl transition-all duration-500 border-orange-100 hover-lift scroll-animate bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {collection.badge && (
                      <Badge className={`absolute top-4 left-4 ${collection.badgeColor} text-white animate-pulse`}>
                        {collection.badge}
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                      {collection.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{collection.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-600">{collection.price}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-200 hover:bg-orange-50 bg-transparent hover-glow"
                      >
                        View Collection
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Story */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-terracotta-texture"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="scroll-animate">
              <Badge className="mb-6 bg-orange-100 text-orange-800 animate-pulse">Our Heritage</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">72 Years of Craftsmanship Excellence</h2>
              <p className="text-lg text-gray-600 mb-6">
                Since 1952, Clayfable has been at the forefront of terracotta craftsmanship in India. What started as a
                small family workshop has grown into a trusted name, serving over 50,000 satisfied customers worldwide.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our master artisans use traditional techniques passed down through generations, combined with modern
                quality standards to create pieces that are both beautiful and functional.
              </p>
              <Button className="bg-orange-600 hover:bg-orange-700 hover-lift hover-glow">
                Read Our Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative scroll-animate">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
              <img
                src="/traditional-indian-potter-working-on-terracotta-po.jpg"
                alt="Master craftsman at work"
                className="rounded-2xl shadow-xl relative z-10 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute -bottom-6 -left-6 bg-orange-600 text-white p-6 rounded-xl hover-lift animate-float">
                <div className="text-3xl font-bold">72</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-xl font-bold text-gray-900 ml-2">4.9/5</span>
              <span className="text-gray-600">• Based on 2,847 reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                location: "Mumbai",
                review:
                  "The quality is exceptional! My terracotta cookware has transformed my cooking experience. The flavors are so much richer.",
                rating: 5,
              },
              {
                name: "Chef Rajesh Kumar",
                location: "Delhi",
                review:
                  "As a professional chef, I can say these are the finest terracotta pieces I've used. Perfect for my restaurant.",
                rating: 5,
              },
              {
                name: "Sarah Johnson",
                location: "New York",
                review:
                  "Shipped internationally with perfect packaging. The craftsmanship is beautiful and the customer service is outstanding.",
                rating: 5,
              },
            ].map((review, index) => (
              <Card key={index} className="border-orange-100">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{review.review}"</p>
                  <div>
                    <div className="font-bold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-parallaxFloat"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4 scroll-animate">Ready to Experience Authentic Terracotta?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto scroll-animate">
            Join thousands of satisfied customers who have made Clayfable their trusted choice for premium terracotta
            products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center scroll-animate">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 hover-lift hover-glow">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-orange-600 bg-transparent hover-lift"
            >
              WhatsApp Us
              <Phone className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* WhatsApp Widget */}
      <WhatsAppWidget />

      {/* Footer */}
      <Footer />
    </div>
  )
}
