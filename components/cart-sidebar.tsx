"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
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
    if (isOpen) {
      // Prevent body scroll when cart is open
      document.body.style.overflow = 'hidden'
    } else {
      // Restore body scroll when cart is closed
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset'
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
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-[9998] ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out z-[9999] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart
              {getTotalItems() > 0 && (
                <Badge className="ml-2 bg-orange-600 text-white">
                  {getTotalItems()}
                </Badge>
              )}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some beautiful terracotta pieces to get started!</p>
              <Link href="/products">
                <Button onClick={onClose} className="bg-orange-600 hover:bg-orange-700">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {item.name}
                        </h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-bold text-orange-600">
                            ₹{item.price}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="space-y-3">
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium">₹{calculateSubtotal()}</span>
                  </div>

                  {/* Savings */}
                  {calculateSavings() > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>You save</span>
                      <span className="font-medium">₹{calculateSavings()}</span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  {/* Free shipping message */}
                  {shippingFee > 0 && (
                    <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                      Add ₹{999 - calculateSubtotal()} more for free shipping!
                    </div>
                  )}

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  {/* Checkout Button */}
                  <Link href="/checkout" className="block w-full">
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
                      onClick={onClose}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  {/* View Cart Link */}
                  <Link href="/cart" className="block w-full">
                    <Button
                      variant="outline"
                      className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={onClose}
                    >
                      View Full Cart
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )

  return createPortal(cartSidebarContent, document.body)
}