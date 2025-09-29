"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Heart, Leaf, ArrowRight, Star, Calendar } from "lucide-react"
import Link from "next/link"
import ProductFooter from "@/components/product-footer"
import TrustBanner from "@/components/trust-banner"
import ProductHeader from "@/components/product-header"
import { useEffect, useState } from "react"

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

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

  const timeline = [
    {
      year: "1952",
      title: "The Beginning",
      description: "Founded by master craftsman Ravi Kumar in a small village, starting with traditional water pots and storage vessels."
    },
    {
      year: "1970",
      title: "Expanding Horizons",
      description: "Introduced decorative pieces and began supplying to local markets across the region."
    },
    {
      year: "1995",
      title: "Modern Techniques",
      description: "Adopted modern firing techniques while preserving traditional hand-crafting methods."
    },
    {
      year: "2010",
      title: "National Recognition",
      description: "Received the National Handicrafts Award for excellence in traditional pottery."
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Launched online presence to bring authentic terracotta to homes worldwide."
    },
    {
      year: "2024",
      title: "Sustainable Future",
      description: "Leading eco-friendly practices and teaching traditional skills to new generations."
    }
  ]

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Every piece is crafted with love and dedication, carrying forward 72 years of passion for the art."
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Using natural clay and eco-friendly processes to create products that respect our planet."
    },
    {
      icon: Star,
      title: "Quality",
      description: "Uncompromising standards ensure each product meets the highest quality expectations."
    },
    {
      icon: Users,
      title: "Community",
      description: "Supporting local artisans and preserving traditional skills for future generations."
    }
  ]

  return (
    <>
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
              72 Years of Heritage
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Our
              <span className="text-orange-600 relative inline-block ml-4">
                Story
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              From humble beginnings in 1952 to becoming a trusted name in authentic terracotta,
              discover the journey of passion, craftsmanship, and dedication that defines Clayfable.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Crafting Tradition Since 1952
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Clayfable began as a small family workshop in rural India, where master craftsman Ravi Kumar
                  started creating traditional terracotta vessels for local communities. What started with
                  simple water pots and storage containers has evolved into a celebration of authentic
                  craftsmanship that honors both tradition and innovation.
                </p>
                <p>
                  Each piece we create today carries the same dedication to quality and authenticity that
                  our founder instilled in 1952. We believe that true craftsmanship cannot be rushed—
                  it requires patience, skill, and an unwavering commitment to excellence.
                </p>
                <p>
                  Our artisans, many of whom are third-generation craftspeople, continue to use traditional
                  hand-building techniques passed down through generations, ensuring that every product
                  tells a story of heritage and artistry.
                </p>
              </div>
            </div>
            <div className="scroll-animate">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-orange-800">72 Years</h3>
                    <p className="text-orange-600">of Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the milestones that have shaped Clayfable into the trusted brand it is today.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-orange-200"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`flex items-center scroll-animate ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <Card className="border-orange-100 hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <Calendar className="h-5 w-5 text-orange-600" />
                          <Badge className="bg-orange-600 text-white">{item.year}</Badge>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-orange-600 rounded-full border-4 border-white"></div>
                  </div>

                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Clayfable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="text-center group hover:shadow-xl transition-all duration-500 border-orange-100 hover-lift scroll-animate"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-700 text-white relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="scroll-animate">
            <h2 className="text-4xl font-bold mb-4">
              Experience Our Craftsmanship
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              Discover the beauty and authenticity of handcrafted terracotta products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/collections">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4 hover-lift hover-glow">
                  Shop Collections
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-orange-600 bg-transparent hover-lift"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProductFooter />
      </div>
    </>
  )
}