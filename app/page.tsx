"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Truck, Award, Users, ArrowRight, Phone, Mail, MapPin, Menu, X, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import WhatsAppWidget from "@/components/whatsapp-widget"
import ProductHeader from "@/components/product-header"
import TrustBanner from "@/components/trust-banner"
import ProductFooter from "@/components/product-footer"
import NotificationSystem from "@/components/notification-system"
import { UserProfile } from "@/components/user-profile"
import { useEffect, useState } from "react"
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      try {
        if (typeof window !== 'undefined') {
          setScrollY(window.scrollY)
        }
      } catch (error) {
        console.warn('HomePage: Error in handleScroll:', error)
      }
    }

    const handleVisibility = () => {
      try {
        if (typeof window === 'undefined' || !document) return

        const elements = document.querySelectorAll(".scroll-animate")
        elements.forEach((el) => {
          const rect = el.getBoundingClientRect()
          if (rect.top < window.innerHeight - 100) {
            el.classList.add("in-view")
          }
        })
      } catch (error) {
        console.warn('HomePage: Error in handleVisibility:', error)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll)
      window.addEventListener("scroll", handleVisibility)
      handleVisibility() // Initial check
    }

    // Trigger initial animations
    setTimeout(() => setIsVisible(true), 100)

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("scroll", handleScroll)
        window.removeEventListener("scroll", handleVisibility)
      }
    }
  }, [])

  // Fetch featured products on homepage
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const supabase = createClient()
        const { data: products, error } = await supabase
          .from('products')
          .select(`
            id, name, slug, description, price, compare_price, images,
            is_active, inventory_quantity, created_at,
            categories (id, name, slug)
          `)
          .eq('is_active', true)
          .eq('featured_on_homepage', true)
          .order('created_at', { ascending: false })
          .limit(6)

        if (error) {
          console.error('Error fetching featured products:', error)
          setFeaturedProducts([])
        } else {
          const transformedProducts = products?.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.compare_price || Math.floor(product.price * 1.2),
            image: product.images ? JSON.parse(product.images)?.[0] || "/placeholder.svg" : "/placeholder.svg",
            badge: product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? "New" : null,
            badgeColor: "bg-green-600",
            category: product.categories?.name || "Traditional Pottery",
            stock: product.inventory_quantity
          })) || []

          setFeaturedProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setFeaturedProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <>
      <div className="min-h-screen bg-white">
        <ProductHeader />

      <section className="py-12 md:py-20 px-4 relative bg-pattern-dots">
        <div
          className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-amber-100/30"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
        <div className="container mx-auto text-center relative z-10">
          <Badge
            className={`mb-3 md:mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200 text-xs sm:text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 ${isVisible ? "animate-scaleIn stagger-1" : "opacity-0"}`}
          >
            72 Years of Craftsmanship Excellence
          </Badge>

          <h1
            className={`text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 text-balance leading-tight ${isVisible ? "animate-fadeInUp stagger-2" : "opacity-0"}`}
          >
            Authentic Terracotta
            <span className="block text-orange-600 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Crafted with Heritage
            </span>
          </h1>

          <p
            className={`text-sm md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto text-pretty px-4 ${isVisible ? "animate-fadeInUp stagger-3" : "opacity-0"}`}
          >
            From our family kilns to your table, discover premium terracotta cookware and serveware that brings
            generations of Indian craftsmanship to modern kitchens worldwide.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4 ${isVisible ? "animate-fadeInUp stagger-4" : "opacity-0"}`}
          >
            <Link href="/products">
              <Button size="default" className="catchy-button text-sm md:text-base lg:text-lg px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 w-full sm:w-auto">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="default"
                className="catchy-button-outline text-sm md:text-base lg:text-lg px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 hover-lift w-full sm:w-auto"
              >
                Our Story
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
            <div className="absolute bottom-2 right-2 md:-bottom-6 md:-right-6 bg-white p-2 md:p-4 rounded-lg md:rounded-xl shadow-lg hover-lift">
              <div className="flex items-center space-x-1 md:space-x-2">
                <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current animate-pulse" />
                <span className="text-sm md:text-base font-bold text-gray-900">4.9</span>
                <span className="text-xs md:text-sm text-gray-600 hidden sm:inline">• 2,847 reviews</span>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            {[
              { icon: Shield, title: "Certified Quality", desc: "ISO 9001:2015 Certified" },
              { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
              { icon: Award, title: "Award Winning", desc: "National Craft Award 2023" },
              { icon: Users, title: "50,000+ Customers", desc: "Trusted worldwide" },
            ].map((item, index) => (
              <div
                key={index}
                className={`catchy-trust-indicator scroll-animate`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <item.icon className="h-10 w-10 md:h-12 md:w-12 trust-icon mb-3 md:mb-4 mx-auto" />
                <h3 className="trust-title text-center mb-2 text-xs md:text-sm font-semibold">{item.title}</h3>
                <p className="text-[10px] md:text-xs text-gray-600 text-center font-medium" style={{fontVariant: 'small-caps'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-orange-50 to-amber-50 bg-pattern-grid relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 clayfable-heading">Featured Collections</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular terracotta pieces, each telling a story of tradition and craftsmanship
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {loading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-64 bg-gray-300 rounded-t-lg"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : featuredProducts.length > 0 ? (
              // Display featured products from database
              featuredProducts.slice(0, 3).map((product, index) => (
                <Card
                  key={product.id}
                  className="group cursor-pointer catchy-collection-card scroll-animate rounded-xl"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.badge && (
                        <Badge className={`absolute top-4 left-4 ${product.badgeColor} text-white animate-pulse`}>
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 collection-title transition-colors duration-300 uppercase tracking-wide">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">₹{product.price}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="catchy-button-outline text-xs font-bold tracking-wide hover-glow"
                        >
                          VIEW PRODUCT
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback to static collections if no featured products
              [
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
                  className="group cursor-pointer catchy-collection-card scroll-animate rounded-xl"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={collection.image || "/placeholder.svg"}
                        alt={collection.title}
                        className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {collection.badge && (
                        <Badge className={`absolute top-4 left-4 ${collection.badgeColor} text-white animate-pulse`}>
                          {collection.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 collection-title transition-colors duration-300 uppercase tracking-wide">
                        {collection.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{collection.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">{collection.price}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="catchy-button-outline text-xs font-bold tracking-wide hover-glow"
                        >
                          VIEW COLLECTION
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
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
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 clayfable-heading">72 Years of Craftsmanship Excellence</h2>
              <p className="text-lg text-gray-600 mb-6">
                Since 1952, Clayfable has been at the forefront of terracotta craftsmanship in India. What started as a
                small family workshop has grown into a trusted name, serving over 50,000 satisfied customers worldwide.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our master artisans use traditional techniques passed down through generations, combined with modern
                quality standards to create pieces that are both beautiful and functional.
              </p>
              <Button className="catchy-button hover-lift hover-glow">
                READ OUR STORY
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 clayfable-heading">What Our Customers Say</h2>
            <div className="flex items-center justify-center space-x-1 md:space-x-2 mb-3 md:mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-base md:text-lg lg:text-xl font-bold text-gray-900 ml-1 md:ml-2">4.9/5</span>
              <span className="text-xs md:text-sm lg:text-base text-gray-600">• Based on 2,847 reviews</span>
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
              <Card key={index} className="catchy-review-card">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6 review-stars">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 review-text text-base">{review.review}</p>
                  <div>
                    <div className="reviewer-name mb-1">{review.name}</div>
                    <div className="text-xs text-gray-500 font-medium" style={{fontVariant: 'small-caps'}}>{review.location}</div>
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
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 scroll-animate text-white drop-shadow-lg">Ready to Experience Authentic Terracotta?</h2>
          <p className="text-base md:text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto scroll-animate">
            Join thousands of satisfied customers who have made Clayfable their trusted choice for premium terracotta
            products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center scroll-animate">
            <Button size="lg" variant="secondary" className="catchy-button-secondary text-lg px-8 py-4 hover-lift hover-glow">
              SHOP NOW
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="catchy-button-outline-white text-lg px-8 py-4 hover-lift"
            >
              WHATSAPP US
              <Phone className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* WhatsApp Widget */}
      <WhatsAppWidget />

      <ProductFooter />
      </div>
    </>
  )
}
