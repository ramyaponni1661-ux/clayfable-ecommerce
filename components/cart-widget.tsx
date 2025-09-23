"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, X, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"

export function CartWidget() {
  const { state, updateQuantity, removeFromCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  if (state.itemCount === 0) {
    return (
      <Button variant="outline" size="sm" className="relative bg-transparent">
        <ShoppingBag className="h-4 w-4 mr-2" />
        Cart
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button variant="outline" size="sm" className="relative bg-transparent" onClick={() => setIsOpen(!isOpen)}>
        <ShoppingBag className="h-4 w-4 mr-2" />
        Cart
        <Badge className="ml-2 bg-orange-600 hover:bg-orange-700">{state.itemCount}</Badge>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-orange-100 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-orange-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Shopping Cart</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {state.items.map((item) => (
              <div key={item.id} className="p-4 border-b border-gray-100">
                <div className="flex gap-3">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-600">₹{item.price * item.quantity}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 h-auto p-0 text-xs"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-orange-100">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="font-bold text-xl text-orange-600">₹{state.total}</span>
            </div>
            <div className="space-y-2">
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full border-orange-200 hover:bg-orange-50 bg-transparent">
                  View Cart
                </Button>
              </Link>
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
