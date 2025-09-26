import { Badge } from "@/components/ui/badge"
import { Shield, Truck, Award, Leaf, Clock } from "lucide-react"

const messages = [
  {
    icon: Truck,
    text: "Free Shipping on Orders Above ₹1,499 | Secure Payment",
    color: "bg-green-600"
  },
  {
    icon: Award,
    text: "✓ GI Tagged Terracotta ✓ 100% Natural Clay ✓ ISO 9001:2015 Certified",
    color: "bg-blue-600"
  },
  {
    icon: Shield,
    text: "Trusted by 500+ Restaurants Across India | 4.8★ Google Reviews",
    color: "bg-orange-600"
  },
  {
    icon: Clock,
    text: "New Collection Drop Every Thursday 8 PM IST",
    color: "bg-purple-600"
  }
]

export default function TrustBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white py-2 overflow-hidden">
      <div className="animate-scroll whitespace-nowrap">
        <div className="inline-flex items-center space-x-8">
          {messages.map((message, index) => (
            <div key={index} className="inline-flex items-center space-x-2 px-4">
              <message.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          ))}
          {/* Duplicate for continuous scroll */}
          {messages.map((message, index) => (
            <div key={`dup-${index}`} className="inline-flex items-center space-x-2 px-4">
              <message.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}