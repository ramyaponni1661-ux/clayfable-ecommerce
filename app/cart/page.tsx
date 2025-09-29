"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Shield, Tag, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { toast } from "sonner"

export default function CartPage() {
  const { items, itemCount, totalAmount, totalSavings, updateQuantity, removeItem, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)

  const applyPromoCode = () => {
    const code = promoCode.toLowerCase().trim()
    if (code === "welcome10") {
      setPromoApplied(true)
      setPromoDiscount(Math.round(totalAmount * 0.1))
      toast.success("Promo code applied! 10% discount added.")
    } else if (code === "first20") {
      setPromoApplied(true)
      setPromoDiscount(Math.round(totalAmount * 0.2))
      toast.success("Promo code applied! 20% discount for first-time buyers!")
    } else {
      toast.error("Invalid promo code. Try 'WELCOME10' or 'FIRST20'")
    }
  }

  const removePromoCode = () => {
    setPromoApplied(false)
    setPromoDiscount(0)
    setPromoCode("")
    toast.success("Promo code removed")
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
      toast.success("Item removed from cart")
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id)
    toast.success(`${name} removed from cart`)
  }

  // Calculate totals
  const shipping = totalAmount >= 999 ? 0 : 99
  const finalTotal = totalAmount - promoDiscount + shipping

  // Empty cart state
  if (items.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <ProductHeader />

        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover our beautiful collection of handcrafted terracotta products
            </p>
            <div className="space-y-4">
              <Link href="/collections">
                <Button className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-4 w-full">
                  Browse Collections
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/new-arrivals">
                <Button variant="outline" className="border-orange-200 hover:bg-orange-50 text-lg px-8 py-4 w-full">
                  View New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <ProductFooter />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <ProductHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-0">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="pr-4">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {item.name}
                              </h3>
                              <div className="flex items-center space-x-2 mb-3">
                                <span className="text-xl font-bold text-gray-900">
                                  ₹{item.price.toLocaleString()}
                                </span>
                                {item.originalPrice && (
                                  <>
                                    <span className="text-sm text-gray-500 line-through">
                                      ₹{item.originalPrice.toLocaleString()}
                                    </span>
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                                    </Badge>
                                  </>
                                )}
                              </div>
                              {!item.inStock && (
                                <Badge variant="destructive" className="mb-2">
                                  Out of Stock
                                </Badge>
                              )}
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id, item.name)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={!item.inStock}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={!item.inStock || item.quantity >= (item.maxQuantity || 99)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </div>
                              {item.originalPrice && (
                                <div className="text-sm text-green-600">
                                  Save ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <div className="flex justify-between items-center">
              <Link href="/collections">
                <Button variant="outline" className="border-orange-200 hover:bg-orange-50">
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  Continue Shopping
                </Button>
              </Link>

              <Button
                variant="ghost"
                onClick={() => {
                  clearCart()
                  toast.success("Cart cleared successfully")
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  Promo Code
                </h3>
                {!promoApplied ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="uppercase"
                    />
                    <Button
                      onClick={applyPromoCode}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      disabled={!promoCode.trim()}
                    >
                      Apply Code
                    </Button>
                    <div className="text-xs text-gray-500">
                      Try: WELCOME10 or FIRST20
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div>
                      <div className="font-medium text-green-800">{promoCode.toUpperCase()}</div>
                      <div className="text-sm text-green-600">-₹{promoDiscount.toLocaleString()}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removePromoCode}
                      className="text-green-700 hover:text-green-800"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Total Savings</span>
                      <span>-₹{totalSavings.toLocaleString()}</span>
                    </div>
                  )}

                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo Discount</span>
                      <span>-₹{promoDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Truck className="mr-1 h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Shipping</span>
                    </div>
                    <div className="text-right">
                      {shipping === 0 ? (
                        <span className="font-medium text-green-600">Free</span>
                      ) : (
                        <span className="font-medium">₹{shipping}</span>
                      )}
                      {shipping > 0 && (
                        <div className="text-xs text-gray-500">
                          Free above ₹999
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Shield className="mr-1 h-4 w-4" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="mr-1 h-4 w-4" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="mr-1 h-4 w-4" />
                      <span>Safe Payment</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-lg py-6">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Free Shipping Progress */}
            {totalAmount < 999 && (
              <Card className="border-orange-200">
                <CardContent className="p-4">
                  <div className="text-sm text-center">
                    <div className="text-orange-600 font-medium mb-2">
                      Add ₹{(999 - totalAmount).toLocaleString()} more for FREE shipping!
                    </div>
                    <div className="w-full bg-orange-100 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((totalAmount / 999) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ProductFooter />
      </div>
    </>
  )
}