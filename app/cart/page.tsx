"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Shield } from "lucide-react"
import Link from "next/link"
import MobileHeader from "@/components/mobile-header"

// Product data to match cart items with product details
const products = [
  {
    id: 1,
    name: "Traditional Clay Cooking Pot",
    price: 149,
    originalPrice: 799,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
    inStock: true,
  },
  {
    id: 2,
    name: "Handcrafted Serving Bowl Set",
    price: 149,
    originalPrice: 1199,
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
    inStock: true,
  },
  {
    id: 3,
    name: "Decorative Terracotta Vase",
    price: 149,
    originalPrice: 449,
    image: "/decorative-terracotta-vases-and-planters.jpg",
    inStock: true,
  },
  {
    id: 4,
    name: "Clay Water Storage Pot",
    price: 149,
    originalPrice: 1599,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
    inStock: true,
  },
  {
    id: 5,
    name: "Artisan Dinner Plate Set",
    price: 149,
    originalPrice: 1499,
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
    inStock: false,
  },
  {
    id: 6,
    name: "Garden Planter Collection",
    price: 149,
    originalPrice: 999,
    image: "/decorative-terracotta-vases-and-planters.jpg",
    inStock: true,
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [cartItemsMap, setCartItemsMap] = useState<{[key: number]: number}>({})
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  useEffect(() => {
    // Load cart items from localStorage
    const storedCartItems = localStorage.getItem("cartItems")
    if (storedCartItems) {
      const cartMap = JSON.parse(storedCartItems)
      setCartItemsMap(cartMap)

      // Convert cart map to cart items array with product details
      const cartArray = Object.entries(cartMap).map(([productId, quantity]) => {
        const product = products.find(p => p.id === parseInt(productId))
        if (product) {
          return {
            ...product,
            quantity: quantity as number
          }
        }
        return null
      }).filter(Boolean)

      setCartItems(cartArray)
    }
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      // Remove item from cart
      const updatedCartMap = { ...cartItemsMap }
      delete updatedCartMap[id]
      setCartItemsMap(updatedCartMap)
      localStorage.setItem("cartItems", JSON.stringify(updatedCartMap))
      setCartItems(cartItems.filter((item) => item.id !== id))
    } else {
      // Update quantity
      const updatedCartMap = { ...cartItemsMap, [id]: newQuantity }
      setCartItemsMap(updatedCartMap)
      localStorage.setItem("cartItems", JSON.stringify(updatedCartMap))
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = (id: number) => {
    const updatedCartMap = { ...cartItemsMap }
    delete updatedCartMap[id]
    setCartItemsMap(updatedCartMap)
    localStorage.setItem("cartItems", JSON.stringify(updatedCartMap))
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setPromoApplied(true)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0)
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal - promoDiscount + shipping

  if (cartItems.length === 0) {
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
                <Link href="/products" className="text-gray-700 hover:text-orange-600 font-medium">
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
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
                <Link href="/cart">
                  <Button className="bg-orange-600 hover:bg-orange-700" size="sm">
                    Cart ({Object.values(cartItemsMap).reduce((sum, quantity) => sum + quantity, 0)})
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-xl text-gray-600 mb-8">Discover our beautiful terracotta collection</p>
          <Link href="/products">
            <Button className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-4">
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-xl text-gray-600">Review your items before checkout</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="border-orange-100">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
                            {item.originalPrice > item.price && (
                              <>
                                <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                                <Badge variant="destructive" className="bg-red-100 text-red-800 text-xs">
                                  {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-2 font-medium">{item.quantity}</span>
                          <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">₹{item.price * item.quantity}</div>
                          {item.originalPrice > item.price && (
                            <div className="text-sm text-gray-500">
                              Save ₹{(item.originalPrice - item.price) * item.quantity}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link href="/products">
                <Button variant="outline" className="border-orange-200 hover:bg-orange-50 bg-transparent">
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-orange-100 sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                    </span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You Save</span>
                      <span className="font-medium">-₹{savings}</span>
                    </div>
                  )}

                  {/* Promo Code */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="border-orange-200 focus:border-orange-400"
                      />
                      <Button
                        variant="outline"
                        onClick={applyPromoCode}
                        disabled={promoApplied}
                        className="border-orange-200 hover:bg-orange-50 bg-transparent"
                      >
                        Apply
                      </Button>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo Discount (WELCOME10)</span>
                        <span className="font-medium">-₹{promoDiscount}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
                      <Truck className="h-4 w-4 inline mr-2" />
                      Add ₹{999 - subtotal} more for FREE shipping
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-4 mb-4">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                {/* Trust Signals */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-orange-600 mr-2" />
                    Secure checkout with SSL encryption
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 text-orange-600 mr-2" />
                    Free shipping on orders above ₹999
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
