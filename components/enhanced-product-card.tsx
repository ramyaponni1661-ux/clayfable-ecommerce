"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Flame,
  Award,
  Zap,
  MessageCircle,
  Share2
} from "lucide-react"
import WhatsAppWidget from "@/components/whatsapp-widget"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  badges: Array<{
    type: 'bestseller' | 'new' | 'limited' | 'eco' | 'handmade' | 'featured'
    text: string
  }>
  isInWishlist?: boolean
  stock: number
  description: string
}

interface EnhancedProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
  onQuickView?: (product: Product) => void
}

export default function EnhancedProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView
}: EnhancedProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(product.isInWishlist || false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'bestseller':
        return 'bg-orange-500 text-white animate-badgePulse'
      case 'new':
        return 'bg-green-500 text-white'
      case 'limited':
        return 'bg-red-500 text-white animate-pulse'
      case 'eco':
        return 'bg-emerald-500 text-white'
      case 'handmade':
        return 'bg-amber-600 text-white'
      case 'featured':
        return 'bg-purple-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'bestseller':
        return <Flame className="h-3 w-3" />
      case 'new':
        return <Zap className="h-3 w-3" />
      case 'limited':
        return <Award className="h-3 w-3" />
      case 'eco':
        return <span className="text-xs">🌱</span>
      case 'handmade':
        return <span className="text-xs">✋</span>
      case 'featured':
        return <Star className="h-3 w-3" />
      default:
        return null
    }
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
    onAddToWishlist?.(product)
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <>
      <Card className="group product-card-hover overflow-hidden border-orange-100 bg-white">
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-gray-100">
            {!imageLoaded && (
              <div className="w-full h-full bg-gray-200 animate-shimmer" />
            )}
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className={`product-image w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badges.map((badge, index) => (
              <Badge
                key={index}
                className={`text-xs font-semibold ${getBadgeStyle(badge.type)} flex items-center gap-1`}
              >
                {getBadgeIcon(badge.type)}
                {badge.text}
              </Badge>
            ))}
          </div>

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white font-bold">
              -{discountPercentage}%
            </Badge>
          )}

          {/* Stock Status */}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs">
              Only {product.stock} left!
            </Badge>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge className="bg-gray-800 text-white font-semibold">
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {discountPercentage === 0 && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                  onClick={() => onQuickView?.(product)}
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                  onClick={() => setShowWhatsApp(true)}
                >
                  <MessageCircle className="h-4 w-4 text-green-600" />
                </Button>
              </>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= product.rating
                      ? 'fill-orange-400 text-orange-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviewCount})</span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-orange-600">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => onAddToCart?.(product)}
              disabled={product.stock === 0}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-orange-200 hover:bg-orange-50"
              onClick={() => setShowWhatsApp(true)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Authentic Terracotta
            </span>
            <span>Free Shipping ₹1,499+</span>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Widget */}
      {showWhatsApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWhatsApp(false)}
              className="absolute -top-10 right-0 text-white hover:bg-white/20"
            >
              ✕
            </Button>
            <WhatsAppWidget
              productName={product.name}
              productPrice={product.price}
              productImage={product.image}
            />
          </div>
        </div>
      )}
    </>
  )
}