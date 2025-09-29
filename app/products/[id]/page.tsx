"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ShoppingCart, Share2, Minus, Plus, Truck, Shield, RotateCcw, Award, ZoomIn, MessageCircle, Phone, Mail, Copy, Facebook, Twitter, Instagram, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import WhatsAppWidget from "@/components/whatsapp-widget"
import ARViewer from "@/components/ar-viewer"
import RazorpayTrustBanner from "@/components/razorpay-trust-banner"
import CertificationBanner from "@/components/certification-banner"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import ProductReviews from "@/components/product-reviews"
import { useCart } from "@/contexts/CartContext"

export default function ProductPage() {
  const params = useParams()
  const slug = params.id as string // Note: This is actually a slug, not an ID
  const { addItem } = useCart()

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [compareItems, setCompareItems] = useState<string[]>([])
  const [isZoomed, setIsZoomed] = useState(false)
  const [showAskQuestion, setShowAskQuestion] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${slug}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch product')
        }

        if (data.success) {
          setProduct(data.data.product)
          setRelatedProducts(data.data.relatedProducts || [])
        } else {
          throw new Error(data.error || 'Product not found')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

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

  const toggleCompare = (productId: string) => {
    let updated: string[]
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

  const addToCart = () => {
    if (!product) return

    // Prepare cart item data
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.compare_price || undefined,
      image: product.images?.[0] || '/placeholder.svg',
      inStock: true, // We'll determine this from stockStatus
      maxQuantity: product.inventory_quantity || 99,
      quantity
    }

    // Add to cart using context
    addItem(cartItem)

    // Show success message
    alert(`Added ${quantity} item(s) to cart!`)
  }

  const handleOutOfStockNotify = () => {
    if (!product) return

    const message = `Hi! I'm interested in "${product.name}" (₹${product.price?.toLocaleString('en-IN') || '0'}). It's currently out of stock. Could you please notify me when it's available again? Thank you!`
    const phoneNumber = "+919876543210"
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank')
    alert('Redirected to WhatsApp for stock notification')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Product...</h2>
          <p className="text-gray-600">Please wait while we fetch the product details.</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {error === 'Product not found' ? 'Product Not Found' : 'Error Loading Product'}
          </h1>
          <p className="text-gray-600 mb-8">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <div className="space-x-4">
            <Link href="/products">
              <Button className="bg-orange-600 hover:bg-orange-700">Back to Products</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <ProductHeader />

      {/* Compare Items Floating Button */}
      {compareItems.length > 0 && (
        <div className="fixed top-20 right-4 z-40">
          <Link href="/compare">
            <Button className="bg-orange-600 hover:bg-orange-700 shadow-lg">
              Compare ({compareItems.length})
            </Button>
          </Link>
        </div>
      )}

      {/* Enhanced Professional Breadcrumb */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-gray-600 space-x-2">
            <Link href="/" className="flex items-center hover:text-orange-600 transition-colors font-medium">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/all-pottery" className="hover:text-orange-600 transition-colors font-medium">
              All Pottery
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/category/${product.categories?.slug || 'uncategorized'}`}
              className="hover:text-orange-600 transition-colors font-medium"
            >
              {product.categories?.name || 'Uncategorized'}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden cursor-zoom-in">
              <img
                src={(product.images && product.images.length > 0) ? product.images[selectedImage] : "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onClick={() => setIsZoomed(true)}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_featured && (
                  <Badge className="bg-orange-600 text-white">
                    Featured
                  </Badge>
                )}
                {product.tags && product.tags.map((tag, index) => (
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
                  productImage={(product.images && product.images.length > 0) ? product.images[selectedImage] : "/placeholder.svg"}
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
                    src={(product.images && product.images.length > 0) ? product.images[selectedImage] : "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4 rounded-full w-10 h-10 p-0"
                    onClick={() => setIsZoomed(false)}
                  >
                    âœ•
                  </Button>
                </div>
              </div>
            )}

            {/* Thumbnail Images */}
            {product.images && Array.isArray(product.images) && product.images.length > 1 && (
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
            )}
          </div>

          {/* Enhanced Product Details */}
          <div className="space-y-6">
            <div>
              {/* Product Category Badge */}
              <div className="mb-3">
                <Link
                  href={`/category/${product.categories?.slug || 'uncategorized'}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
                >
                  {product.categories?.name || 'Uncategorized'}
                </Link>
              </div>

              {/* Enhanced Product Title */}
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Product Description Preview */}
              {product.short_description && (
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  {product.short_description}
                </p>
              )}

              {/* Enhanced Rating Section */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(4.5) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">4.5</span>
                  <span className="text-sm text-gray-500 ml-1">(128 reviews)</span>
                </div>

                {/* Sales Badge */}
                <div className="flex items-center bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-green-800">500+ sold this month</span>
                </div>

                {/* Stock Status Mini Badge */}
                {product.inventory_quantity > 0 && (
                  <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-blue-800">In Stock</span>
                  </div>
                )}
              </div>

              {/* Enhanced Pricing Section */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 mb-6">
                <div className="flex flex-wrap items-end gap-4 mb-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl lg:text-5xl font-bold text-orange-600">
                      ₹{product.price?.toLocaleString('en-IN') || '0'}
                    </span>
                    {product.compare_price && product.compare_price > (product.price || 0) && (
                      <span className="text-2xl text-gray-500 line-through">
                        ₹{product.compare_price?.toLocaleString('en-IN') || '0'}
                      </span>
                    )}
                  </div>

                  {product.compare_price && product.compare_price > (product.price || 0) && (
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="bg-red-500 text-white text-base px-3 py-1.5 font-bold">
                        {Math.round((1 - (product.price || 0) / product.compare_price) * 100)}% OFF
                      </Badge>
                      <span className="text-sm text-green-700 font-medium">
                        Save ₹{(product.compare_price - (product.price || 0)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per unit:</span>
                    <span className="font-medium">₹{product.price?.toLocaleString('en-IN') || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST included:</span>
                    <span className="font-medium text-green-600">Yes</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Product Information Cards */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Product Details Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    Product Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium text-gray-900">{product.sku || 'CF-' + Date.now()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium text-gray-900">{product.weight || '500g'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Material:</span>
                      <span className="font-medium text-gray-900">{product.material || 'Premium Clay'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Color:</span>
                      <span className="font-medium text-gray-900">{product.color || 'Natural Terracotta'}</span>
                    </div>
                  </div>
                </div>

                {/* Certifications Card */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-green-600" />
                    Certifications
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-700 font-medium">GI Tagged Authentic</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-700 font-medium">ISO 9001:2015 Certified</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-700 font-medium">Lead-Free & Food Safe</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-700 font-medium">Handloom Mark Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-600 mb-6">{product.description || product.short_description || 'No description available.'}</p>

              {/* Key Features */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Key Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    100% Natural Clay
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    Lead-Free & Food Safe
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    Handcrafted
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                    Eco-Friendly
                  </div>
                </div>
              </div>

              {/* Stock Status and Availability */}
              <div className="mb-6">
                {product.inventory_quantity > 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-800">
                        {product.inventory_quantity <= 5
                          ? `Only ${product.inventory_quantity} left in stock!`
                          : 'In stock, ready to ship'
                        }
                      </span>
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
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="h-5 w-5 bg-red-500 rounded-full mr-2"></span>
                      <span className="font-semibold text-red-800">Out of Stock</span>
                    </div>
                    <div className="space-y-2 text-sm text-red-700">
                      <div>This item is currently out of stock but you can contact us for availability updates.</div>
                      <div className="text-red-600">We'll notify you as soon as it's back in stock!</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                {product.inventory_quantity > 0 ? (
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
                        onClick={() => setQuantity(Math.min(product.inventory_quantity || 999, quantity + 1))}
                        disabled={quantity >= (product.inventory_quantity || 999)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : null}

                {/* Enhanced Action Buttons */}
                <div className="space-y-4">
                  {/* Primary Action - Add to Cart */}
                  {product.inventory_quantity > 0 ? (
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-lg py-6 font-bold shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                      disabled={!product.is_active}
                      onClick={addToCart}
                    >
                      <ShoppingCart className="h-6 w-6 mr-3" />
                      Add to Cart - ₹{((product.price || 0) * quantity).toLocaleString('en-IN')}
                      <span className="ml-2 text-orange-100">({quantity} item{quantity > 1 ? 's' : ''})</span>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg py-6 font-bold shadow-lg"
                      onClick={handleOutOfStockNotify}
                    >
                      <MessageCircle className="h-6 w-6 mr-3" />
                      Get Notified on WhatsApp
                    </Button>
                  )}

                  {/* Secondary Actions Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={compareItems.includes(product.id) ? "default" : "outline"}
                      className={`py-3 ${compareItems.includes(product.id)
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "border-orange-200 hover:bg-orange-50 bg-transparent"}`}
                      onClick={() => toggleCompare(product.id)}
                    >
                      <span className="text-lg mr-2">⚖</span>
                      <span className="text-sm font-medium">
                        {compareItems.includes(product.id) ? "Added" : "Compare"}
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      className="py-3 border-gray-200 hover:bg-gray-50"
                      onClick={() => setIsWishlisted(!isWishlisted)}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                      <span className="text-sm font-medium">Save</span>
                    </Button>

                    <div className="relative">
                      <Button
                        variant="outline"
                        className="w-full py-3 border-gray-200 hover:bg-gray-50"
                        onClick={() => setShowShareOptions(!showShareOptions)}
                      >
                        <Share2 className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">Share</span>
                      </Button>
                    </div>
                  </div>

                  {/* Share Options Dropdown */}
                  {showShareOptions && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20 min-w-[250px]">
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
                  <span className="text-xs sm:text-sm font-medium text-green-700">Call: +917418160520</span>
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
                Reviews
              </TabsTrigger>
              <TabsTrigger value="care" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                Care Instructions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-6">
              <Card className="border-orange-100">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Material:</span>
                      <span className="text-gray-600">{product.material || 'Clay'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Weight:</span>
                      <span className="text-gray-600">{product.weight || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Color:</span>
                      <span className="text-gray-600">{product.color || 'Natural'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-900">SKU:</span>
                      <span className="text-gray-600">{product.sku || 'N/A'}</span>
                    </div>
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
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
              <ProductReviews
                productId={product.id}
                productName={product.name}
              />
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
        {relatedProducts.length > 0 && (
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
                        src={(relatedProduct.images && relatedProduct.images.length > 0) ? relatedProduct.images[0] : "/placeholder.svg"}
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
                              className={`h-4 w-4 ${i < Math.floor(4.5) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">4.5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-orange-600">₹{relatedProduct.price?.toLocaleString('en-IN') || '0'}</span>
                          {relatedProduct.compare_price && relatedProduct.compare_price > (relatedProduct.price || 0) && (
                            <span className="text-sm text-gray-500 line-through">₹{relatedProduct.compare_price?.toLocaleString('en-IN') || '0'}</span>
                          )}
                        </div>
                        <Link href={`/products/${relatedProduct.slug}`}>
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
        )}
      </div>

      {/* Trust Banners - Positioned at bottom for better UX */}
      <div className="container mx-auto px-4 py-8">
        <RazorpayTrustBanner />
        <CertificationBanner />
      </div>

      {/* Footer */}
      <ProductFooter />

      {/* WhatsApp Widget */}
      <WhatsAppWidget
        productName={product.name}
        productPrice={product.price}
        productImage={(product.images && product.images.length > 0) ? product.images[0] : "/placeholder.svg"}
      />
    </div>
  )
}