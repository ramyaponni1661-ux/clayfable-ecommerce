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

  const whatsappNumber = "+917418160520"
  const [isOnline] = useState(true)

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
    setMessage("")
    setCustomerName("")
    setCustomerPhone("")
  }

  return (
    <div>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
            size="sm"
          >
            <MessageCircle className="h-7 w-7 text-white" />
          </Button>

          {isOnline && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          )}

          {!isOpen && (
            <div className="absolute right-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Chat with Clayfable</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80">
          <Card className="border-green-200 shadow-xl">
            <CardHeader className="bg-green-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">C</span>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Clayfable Support</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                      <p className="text-sm">Online • Replies quickly</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4 bg-white">
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

              <div className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="border-green-200"
                />
                <Input
                  placeholder="Your phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="border-green-200"
                />
              </div>

              <Textarea
                placeholder="Hi! I'm interested in this product. Please share more details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border-green-200 min-h-[80px]"
              />

              <Button
                onClick={handleSendMessage}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                size="lg"
              >
                <Send className="h-5 w-5 mr-2" />
                Send WhatsApp Message
              </Button>

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

              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const quickMsg = encodeURIComponent(
                      "Hi! I'd like to know more about your terracotta products and pricing."
                    )
                    window.open(`https://wa.me/${whatsappNumber}?text=${quickMsg}`, "_blank")
                  }}
                  className="flex-1 border-green-300 text-green-700"
                >
                  Quick Inquiry
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.open(`tel:${whatsappNumber}`, "_self")
                  }}
                  className="border-green-300 px-3"
                  title="Call us directly"
                >
                  <Phone className="h-4 w-4 text-green-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}