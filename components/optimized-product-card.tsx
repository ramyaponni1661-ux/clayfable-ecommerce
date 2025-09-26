"use client"

import React, { useState, memo, useMemo } from "react"
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
  Share2,
  Check
} from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"

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
  stock: number
  description: string
}

interface OptimizedProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
  onQuickView?: (product: Product) => void
  priority?: boolean
}

const OptimizedProductCard = memo(function OptimizedProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  priority = false
}: OptimizedProductCardProps) {
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addItem, isInCart, getItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  const isProductInCart = useMemo(() => isInCart(product.id), [isInCart, product.id])
  const cartItem = useMemo(() => getItem(product.id), [getItem, product.id])
  const isWishlisted = useMemo(() => isInWishlist(product.id), [isInWishlist, product.id])

  const discountPercentage = useMemo(() =>
    product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0,
    [product.originalPrice, product.price]
  )

  const getBadgeStyle = useMemo(() => (type: string) => {
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
  }, [])

  const getBadgeIcon = useMemo(() => (type: string) => {
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
  }, [])

  const handleAddToCart = useMemo(() => () => {
    if (product.stock <= 0) {
      toast.error("Product is out of stock")
      return
    }

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        inStock: product.stock > 0,
        maxQuantity: product.stock
      }

      addItem(cartItem)
      toast.success(`${product.name} added to cart!`)
      onAddToCart?.(product)
    } catch (error) {
      toast.error("Failed to add item to cart")
      console.error("Add to cart error:", error)
    }
  }, [product, addItem, onAddToCart])

  const handleWishlistToggle = useMemo(() => () => {
    try {
      if (isWishlisted) {
        removeFromWishlist(product.id)
        toast.success(`${product.name} removed from wishlist`)
      } else {
        const wishlistItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          inStock: product.stock > 0
        }
        addToWishlist(wishlistItem)
        toast.success(`${product.name} added to wishlist!`)
      }

      onAddToWishlist?.(product)
    } catch (error) {
      toast.error("Failed to update wishlist")
      console.error("Wishlist error:", error)
    }
  }, [isWishlisted, product, removeFromWishlist, addToWishlist, onAddToWishlist])

  const renderStars = useMemo(() =>
    [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-3 w-3 ${
          star <= product.rating
            ? 'fill-orange-400 text-orange-400'
            : 'text-gray-300'
        }`}
      />
    )),
    [product.rating]
  )

  return (
    <>
      <Card className="group product-card-hover overflow-hidden border-orange-100 bg-white will-change-transform">
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-gray-100">
            {!imageLoaded && (
              <div className="w-full h-full bg-gray-200 animate-shimmer" />
            )}
            <picture>
              {priority ? (
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className={`product-image w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  loading="eager"
                  fetchPriority="high"
                />
              ) : (
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className={`product-image w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </picture>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badges.map((badge, index) => (
              <Badge
                key={`${badge.type}-${index}`}
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
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
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
                  aria-label="Quick view"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                  onClick={() => setShowWhatsApp(true)}
                  aria-label="WhatsApp inquiry"
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
              {renderStars}
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
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 ${
                isProductInCart
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              } text-white`}
              size="sm"
              aria-label={isProductInCart ? "Already in cart" : "Add to cart"}
            >
              {product.stock === 0 ? (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Out of Stock
                </>
              ) : isProductInCart ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  In Cart ({cartItem?.quantity || 0})
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-orange-200 hover:bg-orange-50"
              onClick={() => setShowWhatsApp(true)}
              aria-label="Share product"
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

      {/* WhatsApp Widget - Lazy loaded */}
      {showWhatsApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWhatsApp(false)}
              className="absolute -top-10 right-0 text-white hover:bg-white/20"
              aria-label="Close WhatsApp widget"
            >
              ✕
            </Button>
            {/* WhatsApp widget would be dynamically imported here */}
            <div className="bg-white rounded-lg p-4 max-w-sm">
              <h3 className="font-semibold mb-2">Contact us about {product.name}</h3>
              <p className="text-gray-600 mb-4">Chat with us on WhatsApp for more details!</p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Open WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

export default OptimizedProductCard