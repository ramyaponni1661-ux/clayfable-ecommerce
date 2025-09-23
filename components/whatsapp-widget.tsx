"use client"

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

  const whatsappNumber = "+919876543210" // Clayfable WhatsApp number

  const generateWhatsAppMessage = () => {
    let msg = `Hi Clayfable! I'm interested in your products.\n\n`

    if (customerName) msg += `Name: ${customerName}\n`
    if (customerPhone) msg += `Phone: ${customerPhone}\n\n`

    if (productName) {
      msg += `Product: ${productName}\n`
      if (productPrice) msg += `Price: ₹${productPrice}\n`
      msg += `\n`
    }

    if (message) msg += `Message: ${message}\n`

    msg += `\nPlease provide more details and pricing information.`

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
      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg animate-pulse"
          size="sm"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* WhatsApp Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80">
          <Card className="border-green-200 shadow-xl">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-500 font-bold">C</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Clayfable Support</CardTitle>
                    <p className="text-sm opacity-90">Typically replies instantly</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-green-600 p-1"
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

              {/* Send Button */}
              <Button onClick={handleSendMessage} className="w-full bg-green-500 hover:bg-green-600">
                <Send className="h-4 w-4 mr-2" />
                Send WhatsApp Message
              </Button>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const quickMsg = encodeURIComponent(
                      "Hi! I'd like to know more about your terracotta products and pricing.",
                    )
                    window.open(`https://wa.me/${whatsappNumber}?text=${quickMsg}`, "_blank")
                  }}
                  className="flex-1 border-green-200 hover:bg-green-50 text-xs"
                >
                  Quick Inquiry
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.open(`tel:${whatsappNumber}`, "_self")
                  }}
                  className="border-green-200 hover:bg-green-50"
                >
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
