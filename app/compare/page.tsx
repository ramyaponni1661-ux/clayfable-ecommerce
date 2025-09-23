"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, X, ShoppingCart, Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock product data (same as products page)
const products = [
  {
    id: 1,
    name: "Traditional Clay Cooking Pot",
    category: "Cooking",
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 124,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
    tags: ["Best Seller", "Traditional"],
    inStock: true,
    description: "Authentic clay cooking pot perfect for slow cooking and enhancing flavors",
    specifications: {
      material: "Pure Terracotta Clay",
      capacity: "2 Liters",
      weight: "1.2 kg",
      dimensions: "20cm x 15cm",
      dishwasherSafe: "No",
      microwaveSafe: "No",
      ovenSafe: "Yes (up to 200°C)",
    },
  },
  {
    id: 2,
    name: "Handcrafted Serving Bowl Set",
    category: "Serving",
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviews: 89,
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
    tags: ["Premium", "Set of 4"],
    inStock: true,
    description: "Beautiful set of 4 serving bowls for elegant dining",
    specifications: {
      material: "Premium Terracotta Clay",
      capacity: "500ml each",
      weight: "2.5 kg (set)",
      dimensions: "15cm x 8cm each",
      dishwasherSafe: "Hand wash recommended",
      microwaveSafe: "No",
      ovenSafe: "Yes (up to 180°C)",
    },
  },
  {
    id: 3,
    name: "Decorative Terracotta Vase",
    category: "Decor",
    price: 349,
    originalPrice: 449,
    rating: 4.7,
    reviews: 67,
    image: "/decorative-terracotta-vases-and-planters.jpg",
    tags: ["New", "Handmade"],
    inStock: true,
    description: "Elegant decorative vase perfect for home decor",
    specifications: {
      material: "Artistic Terracotta Clay",
      capacity: "1 Liter",
      weight: "800g",
      dimensions: "25cm x 12cm",
      dishwasherSafe: "Hand wash only",
      microwaveSafe: "No",
      ovenSafe: "No",
    },
  },
  {
    id: 4,
    name: "Clay Water Storage Pot",
    category: "Cooking",
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviews: 156,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
    tags: ["Large", "Traditional"],
    inStock: true,
    description: "Large capacity water storage pot with natural cooling properties",
    specifications: {
      material: "Pure Terracotta Clay",
      capacity: "10 Liters",
      weight: "4.5 kg",
      dimensions: "35cm x 30cm",
      dishwasherSafe: "No",
      microwaveSafe: "No",
      ovenSafe: "No",
    },
  },
]

export default function ComparePage() {
  const [compareItems, setCompareItems] = useState<number[]>([])

  useEffect(() => {
    // Get comparison items from localStorage
    const stored = localStorage.getItem("compareItems")
    if (stored) {
      setCompareItems(JSON.parse(stored))
    }
  }, [])

  const removeFromCompare = (productId: number) => {
    const updated = compareItems.filter((id) => id !== productId)
    setCompareItems(updated)
    localStorage.setItem("compareItems", JSON.stringify(updated))
  }

  const clearAll = () => {
    setCompareItems([])
    localStorage.removeItem("compareItems")
  }

  const compareProducts = products.filter((product) => compareItems.includes(product.id))

  if (compareItems.length === 0) {
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
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl text-gray-300 mb-6">⚖️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Products to Compare</h1>
          <p className="text-xl text-gray-600 mb-8">Add products to your comparison list to see them here</p>
          <Link href="/products">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Compare Products</h1>
            <p className="text-xl text-gray-600">Compare {compareProducts.length} products side by side</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={clearAll} className="border-orange-200 bg-transparent">
              Clear All
            </Button>
            <Link href="/products">
              <Button variant="outline" className="border-orange-200 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg border border-orange-100 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 min-w-full">
              {compareProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`border-r border-gray-200 ${index === compareProducts.length - 1 ? "border-r-0" : ""}`}
                >
                  {/* Product Header */}
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCompare(product.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="relative mb-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.tags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            className={
                              tag === "Best Seller"
                                ? "bg-orange-600 text-white text-xs"
                                : tag === "New"
                                  ? "bg-green-600 text-white text-xs"
                                  : tag === "Premium"
                                    ? "bg-purple-600 text-white text-xs"
                                    : "bg-gray-600 text-white text-xs"
                            }
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      {product.originalPrice > product.price && (
                        <Badge variant="destructive" className="bg-red-100 text-red-800 text-xs">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-sm" disabled={!product.inStock}>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm" className="border-orange-200 p-2 bg-transparent">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                      <Badge variant="outline" className="border-orange-200 text-orange-700">
                        {product.category}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Availability</h4>
                      <Badge className={product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Specifications</h4>
                      <div className="space-y-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                            <span className="text-gray-900 font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add More Products */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Want to compare more products?</p>
          <Link href="/products">
            <Button variant="outline" className="border-orange-200 hover:bg-orange-50 bg-transparent">
              Browse More Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
