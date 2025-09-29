"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, X, Send, Phone } from "lucide-react"

interface WhatsAppWidgetProps {
  productName?: string
  productPrice?: number
  productImage?: string
}

export default function WhatsAppWidget({ productName, productPrice, productImage }: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  const whatsappNumber = "+917418160520" // Clayfable WhatsApp number
  const [isOnline, setIsOnline] = useState(true) // Simulate online status

  const generateWhatsAppMessage = () => {
    let msg = `Hi Clayfable! I'm interested in your products.\\n\\n`

    if (customerName) msg += `Name: ${customerName}\\n`
    if (customerPhone) msg += `Phone: ${customerPhone}\\n\\n`

    if (productName) {
      msg += `Product: ${productName}\\n`
      if (productPrice) msg += `Price: ₹${productPrice}\\n`
      msg += `\\n`
    }

    if (message) msg += `Message: ${message}\\n`

    msg += `\\nPlease provide more details and pricing information.`

    return encodeURIComponent(msg)
  }

  const handleSendMessage = () => {
    const whatsappMsg = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`
    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
    // Reset form
    setMessage("")
    setCustomerName("")
    setCustomerPhone("")
  }

  return (
    <>
      {/* Enterprise WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-2xl border-2 border-white hover:scale-105 transition-all duration-300"
            size="sm"
          >
            <MessageCircle className="h-7 w-7 text-white" />
          </Button>

          {/* Premium Online Status Indicator */}
          {isOnline && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white shadow-lg animate-pulse">
              <div className="w-full h-full bg-green-300 rounded-full animate-ping opacity-75"></div>
            </div>
          )}

          {/* Enhanced Tooltip */}
          {!isOpen && (
            <div className="absolute right-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-3 rounded-xl text-sm font-medium shadow-xl border border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Chat with Clayfable Support</span>
                </div>
                <div className="text-xs text-gray-300 mt-1">Typically replies within minutes</div>
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45 border-r border-b border-gray-700"></div>
              </div>
            </div>
          )}

          {/* Floating Ring Animation */}
          <div className="absolute inset-0 rounded-full border-2 border-green-400 opacity-30 animate-ping"></div>
        </div>
      </div>

      {/* Enterprise WhatsApp Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80">
          <Card className="border-green-200 shadow-2xl border-2 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg relative overflow-hidden">
              {/* Subtle Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20"></div>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-green-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">C</span>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Clayfable Support</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <p className="text-sm opacity-95 font-medium">Online • Replies within minutes</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Product Info (if provided) */}
              {productName && (
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex gap-3">
                    {productImage && (
                      <img
                        src={productImage || "/placeholder.svg"}
                        alt={productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{productName}</h4>
                      {productPrice && <p className="text-orange-600 font-bold">₹{productPrice}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <div className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="border-green-200 focus:border-green-400"
                />
                <Input
                  placeholder="Your phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="border-green-200 focus:border-green-400"
                />
              </div>

              {/* Message */}
              <Textarea
                placeholder="Hi! I'm interested in this product. Please share more details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border-green-200 focus:border-green-400 min-h-[80px]"
              />

              {/* Enterprise Send Button */}
              <Button
                onClick={handleSendMessage}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-green-400/20"
                size="lg"
              >
                <Send className="h-5 w-5 mr-2" />
                Send WhatsApp Message
              </Button>

              {/* Quick Message Templates */}
              <div className="space-y-2">
                <p className="text-xs text-gray-600 font-medium">Quick Templates:</p>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    "Need bulk pricing for restaurant",
                    "Want to schedule workshop visit",
                    "Check custom order availability",
                    "Need product care instructions"
                  ].map((template, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => setMessage(template)}
                      className="text-xs text-left justify-start h-8 px-2 text-gray-700 hover:bg-green-50"
                    >
                      {template}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Enhanced Quick Actions */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const quickMsg = encodeURIComponent(
                      "Hi! I'd like to know more about your terracotta products and pricing.",
                    )
                    window.open(`https://wa.me/${whatsappNumber}?text=${quickMsg}`, "_blank")
                  }}
                  className="flex-1 border-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 text-sm font-medium text-green-700 hover:text-green-800 transition-all duration-200"
                >
                  Quick Inquiry
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.open(`tel:${whatsappNumber}`, "_self")
                  }}
                  className="border-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 px-3 transition-all duration-200"
                  title="Call us directly"
                >
                  <Phone className="h-4 w-4 text-green-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}