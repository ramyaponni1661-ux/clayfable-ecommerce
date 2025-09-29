"use client";

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Shield, Truck, CreditCard, Gift, Sparkles, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [mounted, setMounted] = useState(false)
  const { items: cartItems, updateQuantity, removeItem, totalAmount, totalSavings, itemCount } = useCart()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    // Only run on client side with valid document.body
    if (typeof window === 'undefined' || !document?.body) return

    // Use requestAnimationFrame to ensure DOM is stable
    const rafId = requestAnimationFrame(() => {
      try {
        if (document?.body) {
          if (isOpen) {
            // Prevent body scroll when cart is open
            document.body.style.overflow = 'hidden'
          } else {
            // Restore body scroll when cart is closed
            document.body.style.overflow = 'unset'
          }
        }
      } catch (error) {
        console.warn('CartSidebar: Error updating body scroll:', error)
      }
    })

    // Cleanup function to restore scroll on unmount
    return () => {
      cancelAnimationFrame(rafId)
      // Use another requestAnimationFrame for cleanup
      requestAnimationFrame(() => {
        try {
          if (typeof window !== 'undefined' && document?.body) {
            document.body.style.overflow = 'unset'
          }
        } catch (error) {
          console.debug('CartSidebar: Cleanup completed')
        }
      })
    }
  }, [isOpen])

  const calculateSubtotal = () => {
    return totalAmount
  }

  const calculateSavings = () => {
    return totalSavings
  }

  const getTotalItems = () => {
    return itemCount
  }

  const shippingFee = calculateSubtotal() >= 999 ? 0 : 99
  const total = calculateSubtotal() + shippingFee

  if (!mounted) return null

  const cartSidebarContent = (
    <>
      {/* Premium Backdrop with Blur */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 z-[9998] ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Enterprise Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-[420px] max-w-[95vw] bg-gradient-to-b from-white to-gray-50/50 shadow-2xl border-l border-gray-200/50 transform transition-all duration-500 ease-out z-[9999] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Premium Header */}
        <div className="relative bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                {getTotalItems() > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-orange-600 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    {getTotalItems()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Cart</h2>
                <p className="text-orange-100 text-sm opacity-90">
                  {getTotalItems() === 0 ? 'Ready to add items' : `${getTotalItems()} item${getTotalItems() > 1 ? 's' : ''} selected`}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-10 w-10 p-0 hover:bg-white/20 text-white rounded-full transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Premium decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            /* Premium Empty Cart State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-transparent"></div>

              <div className="relative z-10 max-w-sm">
                {/* Elegant icon with animation */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <ShoppingBag className="h-12 w-12 text-orange-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">Discover Something Beautiful</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Your cart is waiting for handcrafted terracotta treasures. Let's find the perfect pieces for your space.
                </p>

                {/* Premium CTA buttons */}
                <div className="space-y-3 w-full">
                  <Link href="/all-pottery" className="block w-full">
                    <Button
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/collections" className="block w-full">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="w-full border-2 border-orange-200 text-orange-700 hover:bg-orange-50 font-medium py-3 px-6 rounded-xl transition-all duration-300"
                    >
                      <Gift className="mr-2 h-4 w-4" />
                      Browse Collections
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <Shield className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Secure</p>
                  </div>
                  <div className="text-center">
                    <Truck className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Free Ship</p>
                  </div>
                  <div className="text-center">
                    <Star className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Handmade</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Premium Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="group relative bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-orange-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Premium Product Image */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm bg-gray-50">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                              SALE
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Product Details */}
                          <div className="mb-3">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-orange-700 transition-colors">
                              {item.name}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-orange-600">
                                ₹{item.price}
                              </span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-sm text-gray-400 line-through">
                                  ₹{item.originalPrice}
                                </span>
                              )}
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                  {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls & Actions */}
                          <div className="flex items-center justify-between">
                            {/* Premium Quantity Selector */}
                            <div className="flex items-center bg-gray-50 rounded-xl p-1 shadow-inner">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3 text-gray-600" />
                              </Button>
                              <div className="px-4 py-1 min-w-[3rem] text-center">
                                <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                              >
                                <Plus className="h-3 w-3 text-gray-600" />
                              </Button>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Item Total */}
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Item total:</span>
                              <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scroll indicator for many items */}
                {cartItems.length > 3 && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center text-xs text-gray-400">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                      Scroll for more items
                    </div>
                  </div>
                )}
              </div>

              {/* Premium Footer */}
              <div className="bg-white border-t border-gray-100 shadow-lg">
                {/* Order Summary */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50">
                  <div className="space-y-3">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal ({getTotalItems()} items)</span>
                      <span className="text-base font-semibold text-gray-900">₹{calculateSubtotal()}</span>
                    </div>

                    {/* Savings Highlight */}
                    {calculateSavings() > 0 && (
                      <div className="flex justify-between items-center bg-green-50 -mx-2 px-2 py-2 rounded-lg">
                        <div className="flex items-center">
                          <Gift className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-700">You're saving</span>
                        </div>
                        <span className="text-base font-bold text-green-600">₹{calculateSavings()}</span>
                      </div>
                    )}

                    {/* Shipping */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">Shipping</span>
                      </div>
                      <span className="text-base font-semibold">
                        {shippingFee === 0 ? (
                          <span className="text-green-600 font-bold">FREE</span>
                        ) : (
                          <span className="text-gray-900">₹{shippingFee}</span>
                        )}
                      </span>
                    </div>

                    {/* Free shipping progress */}
                    {shippingFee > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 -mx-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-orange-700">Almost there!</span>
                          <span className="text-xs text-orange-600">₹{999 - calculateSubtotal()} more</span>
                        </div>
                        <div className="w-full bg-orange-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((calculateSubtotal() / 999) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-orange-600 mt-1">
                          <Truck className="h-3 w-3 inline mr-1" />
                          Add ₹{999 - calculateSubtotal()} more for free shipping!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Checkout Action */}
                <div className="px-6 py-4">
                  {/* Prominent Checkout Button */}
                  <Link href="/checkout" className="block w-full mb-4">
                    <Button
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg"
                      onClick={onClose}
                    >
                      <div className="flex items-center justify-center">
                        <Shield className="mr-3 h-6 w-6" />
                        <span>Secure Checkout - ₹{total}</span>
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </div>
                    </Button>
                  </Link>

                  {/* Total Summary */}
                  <div className="flex justify-between items-center mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl">
                    <span className="text-base font-semibold text-gray-700">Order Total</span>
                    <span className="text-xl font-bold text-orange-600">₹{total}</span>
                  </div>

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Link href="/cart" className="block">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-orange-200 text-orange-700 hover:bg-orange-50 font-medium py-3 rounded-xl transition-all duration-300"
                        onClick={onClose}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        View Cart
                      </Button>
                    </Link>
                    <Link href="/all-pottery" className="block">
                      <Button
                        variant="ghost"
                        className="w-full text-gray-600 hover:text-orange-600 hover:bg-orange-50 font-medium py-3 rounded-xl transition-all duration-300"
                        onClick={onClose}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add More
                      </Button>
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Secure Payment</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Fast Delivery</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Star className="h-5 w-5 text-purple-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Handcrafted</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )

  // Only render portal on client-side with valid document.body
  if (!mounted || typeof window === 'undefined' || !document?.body) {
    return null
  }

  // Additional safety check before creating portal
  try {
    if (document.body && document.contains(document.body)) {
      return createPortal(cartSidebarContent, document.body)
    }
  } catch (error) {
    console.warn('CartSidebar: Portal creation failed:', error)
  }

  return null
}