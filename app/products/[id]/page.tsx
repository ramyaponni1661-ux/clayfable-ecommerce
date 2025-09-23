"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ShoppingCart, Share2, Minus, Plus, Truck, Shield, RotateCcw, Award, ZoomIn, MessageCircle, Phone, Mail, Copy, Facebook, Twitter, Instagram, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import WhatsAppWidget from "@/components/whatsapp-widget"
import ARViewer from "@/components/ar-viewer"
import RazorpayTrustBanner from "@/components/razorpay-trust-banner"
import CertificationBanner from "@/components/certification-banner"

// Mock product data (in real app, this would come from API/database)
const productData = {
  1: {
    id: 1,
    name: "Traditional Clay Cooking Pot",
    category: "Cooking",
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 124,
    sku: "TCK-001-2024",
    weight: "1.2 kg",
    dimensions: "20cm x 15cm x 12cm",
    images: [
      "/traditional-terracotta-cooking-pots-and-vessels.jpg",
      "/beautiful-terracotta-pottery-collection-on-rustic-.jpg",
      "/traditional-indian-potter-working-on-terracotta-po.jpg",
    ],
    tags: ["Best Seller", "Traditional"],
    inStock: true,
    stockCount: 15,
    description:
      "Authentic clay cooking pot perfect for slow cooking and enhancing flavors. Handcrafted by master artisans using traditional techniques passed down through generations.",
    features: [
      "100% Natural Clay",
      "Lead-Free & Food Safe",
      "Enhances Food Flavor",
      "Retains Heat Longer",
      "Eco-Friendly",
      "Handcrafted",
    ],
    specifications: {
      Material: "Pure Terracotta Clay",
      Capacity: "2 Liters",
      Dimensions: "20cm x 15cm x 12cm",
      Weight: "1.2 kg",
      Origin: "Rajasthan, India",
      "Care Instructions": "Hand wash only, avoid soap",
    },
    reviews: [
      {
        id: 1,
        name: "Priya Sharma",
        rating: 5,
        date: "2024-01-15",
        comment: "Excellent quality! The food tastes so much better when cooked in this pot. Highly recommended!",
        verified: true,
      },
      {
        id: 2,
        name: "Rajesh Kumar",
        rating: 5,
        date: "2024-01-10",
        comment: "Authentic terracotta pot. Great for slow cooking. The craftsmanship is outstanding.",
        verified: true,
      },
      {
        id: 3,
        name: "Sarah Johnson",
        rating: 4,
        date: "2024-01-05",
        comment: "Beautiful pot, shipped well internationally. Takes some getting used to but worth it!",
        verified: true,
      },
    ],
  },
}

const relatedProducts = [
  {
    id: 2,
    name: "Handcrafted Serving Bowl Set",
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
  },
  {
    id: 3,
    name: "Decorative Terracotta Vase",
    price: 349,
    originalPrice: 449,
    rating: 4.7,
    image: "/decorative-terracotta-vases-and-planters.jpg",
  },
  {
    id: 4,
    name: "Clay Water Storage Pot",
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
  },
]

export default function ProductPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)
  const product = productData[productId as keyof typeof productData]

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [compareItems, setCompareItems] = useState<number[]>([])
  const [isZoomed, setIsZoomed] = useState(false)
  const [showAskQuestion, setShowAskQuestion] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("compareItems")
    if (stored) {
      setCompareItems(JSON.parse(stored))
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareOptions || showAskQuestion) {
        setShowShareOptions(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showShareOptions, showAskQuestion])

  const toggleCompare = (productId: number) => {
    let updated: number[]
    if (compareItems.includes(productId)) {
      updated = compareItems.filter((id) => id !== productId)
    } else {
      if (compareItems.length >= 4) {
        alert("You can compare up to 4 products at a time")
        return
      }
      updated = [...compareItems, productId]
    }
    setCompareItems(updated)
    localStorage.setItem("compareItems", JSON.stringify(updated))
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button className="bg-orange-600 hover:bg-orange-700">Back to Products</Button>
          </Link>
        </div>
      </div>
    )
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
              <Link href="/products" className="text-orange-600 font-medium">
                Products
              </Link>
              <Link href="/collections" className="text-gray-700 hover:text-orange-600 font-medium">
                Collections
              </Link>
              <Link href="/b2b" className="text-gray-700 hover:text-orange-600 font-medium">
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
              {compareItems.length > 0 && (
                <Link href="/compare">
                  <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50 bg-transparent">
                    Compare ({compareItems.length})
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700" size="sm">
                Cart (0)
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-gray-600">
          <Link href="/" className="hover:text-orange-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-orange-600">
            Products
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-orange-600">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Trust Banners */}
        <RazorpayTrustBanner />
        <CertificationBanner />

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden cursor-zoom-in">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onClick={() => setIsZoomed(true)}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className={
                      tag === "Best Seller"
                        ? "bg-orange-600 text-white"
                        : tag === "New"
                          ? "bg-green-600 text-white"
                          : "bg-gray-600 text-white"
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full w-12 h-12 p-0 bg-white/90 hover:bg-white shadow-lg"
                  onClick={() => setIsZoomed(true)}
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full w-12 h-12 p-0 bg-white/90 hover:bg-white shadow-lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button
                  variant={compareItems.includes(product.id) ? "default" : "secondary"}
                  size="sm"
                  className={`rounded-full w-12 h-12 p-0 shadow-lg ${compareItems.includes(product.id) ? "bg-orange-600 hover:bg-orange-700" : "bg-white/90 hover:bg-white"}`}
                  onClick={() => toggleCompare(product.id)}
                >
                  <span className="text-lg font-bold">⚖</span>
                </Button>
              </div>
              <div className="absolute bottom-4 right-4">
                <ARViewer
                  productName={product.name}
                  productImage={product.images[selectedImage] || "/placeholder.svg"}
                />
              </div>
            </div>

            {/* Image Zoom Modal */}
            {isZoomed && (
              <div
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                onClick={() => setIsZoomed(false)}
              >
                <div className="relative max-w-4xl max-h-[90vh]">
                  <img
                    src={product.images[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4 rounded-full w-10 h-10 p-0"
                    onClick={() => setIsZoomed(false)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}

            {/* Thumbnail Images */}
            <div className="flex gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-orange-600" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-gray-900">{product.rating}</span>
                <span className="text-gray-600">({product.reviews.length} reviews)</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-orange-600">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">₹{product.originalPrice}</span>
                    <Badge variant="destructive" className="bg-red-100 text-red-800 text-lg px-3 py-1">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* SKU and Product Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">SKU:</span>
                    <span className="ml-2 text-gray-900">{product.sku}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Weight:</span>
                    <span className="ml-2 text-gray-900">{product.weight}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Dimensions:</span>
                    <span className="ml-2 text-gray-900">{product.dimensions}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">Authentic Clayfable</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-600 mb-6">{product.description}</p>

              {/* Key Features */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Key Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Status and Availability */}
              <div className="mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">In stock, ready to ship</span>
                  </div>
                  <div className="space-y-2 text-sm text-green-700">
                    <div className="flex items-center">
                      <span className="font-medium">Pickup available at</span>
                      <span className="ml-1">Clayfable Workshop - Mumbai, India</span>
                    </div>
                    <div className="text-green-600">Usually ready in 24 hours</div>
                    <button className="text-green-600 hover:text-green-700 underline font-medium">
                      View store information
                    </button>
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium text-gray-900">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      disabled={quantity >= product.stockCount}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-lg py-4"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart - ₹{product.price * quantity}
                  </Button>
                  <Button
                    variant={compareItems.includes(product.id) ? "default" : "outline"}
                    size="lg"
                    className={`px-6 ${compareItems.includes(product.id) ? "bg-orange-600 hover:bg-orange-700" : "border-orange-200 hover:bg-orange-50 bg-transparent"}`}
                    onClick={() => toggleCompare(product.id)}
                  >
                    <span className="text-lg font-bold mr-2">⚖</span>
                    {compareItems.includes(product.id) ? "Added" : "Compare"}
                  </Button>
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-6 border-orange-200 hover:bg-orange-50 bg-transparent"
                      onClick={() => setShowShareOptions(!showShareOptions)}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>

                    {/* Share Options Dropdown */}
                    {showShareOptions && (
                      <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 min-w-[200px]">
                        <h4 className="font-medium text-gray-900 mb-3">Share this product</h4>
                        <div className="space-y-2">
                          <button
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href)
                              alert('Link copied!')
                              setShowShareOptions(false)
                            }}
                          >
                            <Copy className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">Copy Link</span>
                          </button>
                          <button
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 text-left"
                            onClick={() => {
                              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
                              setShowShareOptions(false)
                            }}
                          >
                            <Facebook className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Facebook</span>
                          </button>
                          <button
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 text-left"
                            onClick={() => {
                              window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`, '_blank')
                              setShowShareOptions(false)
                            }}
                          >
                            <Twitter className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">Twitter</span>
                          </button>
                          <button
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50 text-left"
                            onClick={() => {
                              window.open(`https://www.instagram.com/`, '_blank')
                              setShowShareOptions(false)
                            }}
                          >
                            <Instagram className="h-4 w-4 text-pink-600" />
                            <span className="text-sm">Instagram</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center text-gray-700">
                  <Truck className="h-5 w-5 text-orange-600 mr-2" />
                  Free shipping above ₹999
                </div>
                <div className="flex items-center text-gray-700">
                  <Shield className="h-5 w-5 text-orange-600 mr-2" />
                  Quality guaranteed
                </div>
                <div className="flex items-center text-gray-700">
                  <RotateCcw className="h-5 w-5 text-orange-600 mr-2" />
                  7-day return policy
                </div>
                <div className="flex items-center text-gray-700">
                  <Award className="h-5 w-5 text-orange-600 mr-2" />
                  Certified authentic
                </div>
              </div>

              {/* Ask a Question Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="w-full border-orange-200 hover:bg-orange-50 bg-transparent"
                  onClick={() => setShowAskQuestion(!showAskQuestion)}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Ask a Question About This Product
                </Button>

                {showAskQuestion && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Get Expert Advice</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Your Name"
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <textarea
                        placeholder="Ask your question about this product..."
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <div className="flex gap-3">
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          Send Question
                        </Button>
                        <Button variant="outline" onClick={() => setShowAskQuestion(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      Our ceramics experts typically respond within 24 hours
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Options */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
                  <Phone className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-green-700">Call: +91 98765 43210</span>
                </div>
                <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-blue-700">Email Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-orange-100">
              <TabsTrigger
                value="specifications"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                Reviews ({product.reviews.length})
              </TabsTrigger>
              <TabsTrigger value="care" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                Care Instructions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-6">
              <Card className="border-orange-100">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <span className="font-medium text-gray-900">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review Summary */}
                <Card className="border-orange-100">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">{product.rating}</div>
                        <div className="flex items-center justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <div className="text-gray-600">{product.reviews.length} reviews</div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = product.reviews.filter((r) => Math.floor(r.rating) === stars).length
                          const percentage = (count / product.reviews.length) * 100
                          return (
                            <div key={stars} className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600 w-8">{stars}★</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <Card key={review.id} className="border-orange-100">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">{review.name}</span>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="care" className="mt-6">
              <Card className="border-orange-100">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Care Instructions</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                        <p className="text-gray-700">Wash with warm water only - avoid using soap or detergent</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                        <p className="text-gray-700">Season before first use by boiling water in the pot</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                        <p className="text-gray-700">Allow to air dry completely before storing</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                        <p className="text-gray-700">Avoid sudden temperature changes to prevent cracking</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                        <p className="text-gray-700">Store in a dry place away from direct sunlight</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-orange-100"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant={compareItems.includes(relatedProduct.id) ? "default" : "secondary"}
                        className={`rounded-full w-10 h-10 p-0 ${compareItems.includes(relatedProduct.id) ? "bg-orange-600 hover:bg-orange-700" : ""}`}
                        onClick={(e) => {
                          e.preventDefault()
                          toggleCompare(relatedProduct.id)
                        }}
                      >
                        <span className="text-xs font-bold">⚖</span>
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(relatedProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">{relatedProduct.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-orange-600">₹{relatedProduct.price}</span>
                        {relatedProduct.originalPrice > relatedProduct.price && (
                          <span className="text-sm text-gray-500 line-through">₹{relatedProduct.originalPrice}</span>
                        )}
                      </div>
                      <Link href={`/products/${relatedProduct.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-200 hover:bg-orange-50 bg-transparent"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp Widget */}
      <WhatsAppWidget productName={product.name} productPrice={product.price} productImage={product.images[0]} />
    </div>
  )
}
