"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  Truck,
  Star,
  Eye,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Edit,
} from "lucide-react"
import Link from "next/link"

// Mock user data
const userData = {
  name: "Priya Sharma",
  email: "priya.sharma@email.com",
  phone: "+91 98765 43210",
  joinDate: "January 2024",
  totalOrders: 12,
  totalSpent: 15420,
  loyaltyPoints: 1542,
}

// Mock order data
const recentOrders = [
  {
    id: "CLF-ABC123",
    date: "2024-01-15",
    status: "Delivered",
    total: 2097,
    items: 3,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
  },
  {
    id: "CLF-DEF456",
    date: "2024-01-10",
    status: "In Transit",
    total: 1299,
    items: 1,
    image: "/elegant-terracotta-serving-bowls-and-plates.jpg",
  },
  {
    id: "CLF-GHI789",
    date: "2024-01-05",
    status: "Processing",
    total: 899,
    items: 2,
    image: "/decorative-terracotta-vases-and-planters.jpg",
  },
]

// Mock wishlist data
const wishlistItems = [
  {
    id: 1,
    name: "Traditional Clay Cooking Pot",
    price: 599,
    originalPrice: 799,
    image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
    inStock: true,
  },
  {
    id: 2,
    name: "Decorative Terracotta Vase",
    price: 349,
    originalPrice: 449,
    image: "/decorative-terracotta-vases-and-planters.jpg",
    inStock: true,
  },
]

export default function DashboardPage() {
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
              <Button className="bg-orange-600 hover:bg-orange-700" size="sm">
                Cart (0)
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {userData.name}!</h1>
          <p className="text-xl text-gray-600">Manage your account and track your orders</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-orange-100">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{userData.name}</h3>
                  <p className="text-gray-600">Member since {userData.joinDate}</p>
                </div>

                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start bg-orange-50 text-orange-700">
                    <User className="h-4 w-4 mr-3" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start hover:bg-orange-50">
                    <Package className="h-4 w-4 mr-3" />
                    Orders
                  </Button>
                  <Button variant="ghost" className="w-full justify-start hover:bg-orange-50">
                    <Heart className="h-4 w-4 mr-3" />
                    Wishlist
                  </Button>
                  <Button variant="ghost" className="w-full justify-start hover:bg-orange-50">
                    <MapPin className="h-4 w-4 mr-3" />
                    Addresses
                  </Button>
                  <Button variant="ghost" className="w-full justify-start hover:bg-orange-50">
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-orange-100">
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{userData.totalOrders}</div>
                  <div className="text-gray-600">Total Orders</div>
                </CardContent>
              </Card>

              <Card className="border-orange-100">
                <CardContent className="p-6 text-center">
                  <ShoppingBag className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">₹{userData.totalSpent.toLocaleString()}</div>
                  <div className="text-gray-600">Total Spent</div>
                </CardContent>
              </Card>

              <Card className="border-orange-100">
                <CardContent className="p-6 text-center">
                  <Star className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{userData.loyaltyPoints}</div>
                  <div className="text-gray-600">Loyalty Points</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white border border-orange-100">
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Recent Orders
                </TabsTrigger>
                <TabsTrigger
                  value="wishlist"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Wishlist
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Card key={order.id} className="border-orange-100">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={order.image || "/placeholder.svg"}
                              alt="Order"
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-bold text-gray-900">Order {order.id}</h4>
                              <p className="text-gray-600">
                                {order.items} items • {order.date}
                              </p>
                              <p className="text-lg font-bold text-orange-600">₹{order.total}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge
                              className={
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "In Transit"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {order.status}
                            </Badge>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-orange-200 hover:bg-orange-50 bg-transparent"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              {order.status === "In Transit" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-orange-200 hover:bg-orange-50 bg-transparent"
                                >
                                  <Truck className="h-4 w-4 mr-2" />
                                  Track
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="wishlist" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {wishlistItems.map((item) => (
                    <Card key={item.id} className="border-orange-100">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2">{item.name}</h4>
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
                              <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                Add to Cart
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-orange-200 hover:bg-orange-50 bg-transparent"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="profile" className="mt-6">
                <Card className="border-orange-100">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Profile Information
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-200 hover:bg-orange-50 bg-transparent"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Personal Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-gray-700">{userData.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-gray-700">{userData.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-gray-700">{userData.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Account Statistics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Member Since:</span>
                            <span className="font-medium">{userData.joinDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Orders:</span>
                            <span className="font-medium">{userData.totalOrders}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Loyalty Points:</span>
                            <span className="font-medium text-orange-600">{userData.loyaltyPoints}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
