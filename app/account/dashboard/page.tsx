"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCartCount, useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from "@/components/user-profile"
import NotificationSystem from "@/components/notification-system"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"
import { BulkOperations } from "@/components/dashboard/bulk-operations"
import { SubscriptionManagement } from "@/components/dashboard/subscription-management"
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
  ShoppingCart,
  BarChart3,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"
import { toast } from "sonner"

// Mock user data
const userData = {
  name: "Priya Sharma",
  email: "priya.sharma@email.com",
  phone: "+91 7418160520",
  joinDate: "January 2024",
  totalOrders: 12,
  totalSpent: 15420,
  loyaltyPoints: 1542,
}

// Interface definitions for API data
interface Order {
  id: string
  date: string
  status: string
  total: number
  items: number
  image: string
  trackingNumber?: string
}

interface WishlistItem {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  inStock: boolean
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const cartCount = useCartCount()
  const { addItem: addToCart } = useCart()
  const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlist()
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0
  })

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Fetch user data when session is available
    fetchUserData()
  }, [session, status, router])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)

      // Fetch user profile with addresses
      const profileResponse = await fetch('/api/users/profile')
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        // Profile data will be used in the profile section
      }

      // Fetch orders
      const ordersResponse = await fetch('/api/orders')
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        if (ordersData.success) {
          setUserOrders(ordersData.orders)
          setUserStats(ordersData.stats)
        }
      }

      // Wishlist data is now available through context
      // No need to fetch from API as it's managed by WishlistContext
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setIsLoading(false)
    }
  }


  const handleBulkOrderAction = async (action: string, orderIds: string[]) => {
    try {
      console.log(`Executing bulk action: ${action} on orders:`, orderIds)

      switch (action) {
        case 'reorder':
          // Simulate reorder API call
          setTimeout(() => {
            alert(`Reordered ${orderIds.length} orders successfully!`)
          }, 1000)
          break
        case 'cancel':
          // Simulate cancel API call
          setTimeout(() => {
            alert(`Cancelled ${orderIds.length} orders successfully!`)
          }, 1000)
          break
        case 'track':
          // Simulate track API call
          setTimeout(() => {
            alert(`Generated tracking report for ${orderIds.length} orders!`)
          }, 1000)
          break
        default:
          console.log('Unknown action:', action)
      }
    } catch (error) {
      console.error('Bulk action failed:', error)
    }
  }

  // Show loading while checking authentication or fetching data
  if (status === "loading" || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // Don't render content if not authenticated
  if (!session) {
    return null
  }

  // Use real user data from session and API
  const currentUser = {
    name: session.user?.name || "User",
    email: session.user?.email || "",
    phone: "+91 7418160520", // This would come from user profile in real app
    joinDate: "January 2024", // This would come from user creation date
    totalOrders: userStats.totalOrders,
    totalSpent: userStats.totalSpent,
    loyaltyPoints: userStats.loyaltyPoints,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <ProductHeader cartCount={cartCount} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {currentUser.name}!</h1>
          <p className="text-xl text-gray-600">Manage your account and track your orders</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-orange-100">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-orange-50 text-orange-700"
                    onClick={() => document.querySelector('[value="orders"]')?.click()}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-orange-50"
                    onClick={() => document.querySelector('[value="orders"]')?.click()}
                  >
                    <Package className="h-4 w-4 mr-3" />
                    Orders
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-orange-50"
                    onClick={() => document.querySelector('[value="wishlist"]')?.click()}
                  >
                    <Heart className="h-4 w-4 mr-3" />
                    Wishlist
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-orange-50"
                    onClick={() => document.querySelector('[value="analytics"]')?.click()}
                  >
                    <BarChart3 className="h-4 w-4 mr-3" />
                    Analytics
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-orange-50"
                    onClick={() => document.querySelector('[value="subscriptions"]')?.click()}
                  >
                    <CreditCard className="h-4 w-4 mr-3" />
                    Subscriptions
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-orange-50"
                    onClick={() => document.querySelector('[value="profile"]')?.click()}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Profile
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
                  <div className="text-3xl font-bold text-gray-900 mb-2">{currentUser.totalOrders}</div>
                  <div className="text-gray-600">Total Orders</div>
                </CardContent>
              </Card>

              <Card className="border-orange-100">
                <CardContent className="p-6 text-center">
                  <ShoppingBag className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">₹{currentUser.totalSpent.toLocaleString()}</div>
                  <div className="text-gray-600">Total Spent</div>
                </CardContent>
              </Card>

              <Card className="border-orange-100">
                <CardContent className="p-6 text-center">
                  <Star className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{currentUser.loyaltyPoints}</div>
                  <div className="text-gray-600">Loyalty Points</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-white border border-orange-100">
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger
                  value="wishlist"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Wishlist
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="subscriptions"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Subscriptions
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-6">
                {userOrders.length === 0 ? (
                  <Card className="border-orange-100">
                    <CardContent className="p-8 text-center">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-4">Start shopping to see your orders here!</p>
                      <Button
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => router.push('/products')}
                      >
                        Browse Products
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <BulkOperations orders={userOrders} onBulkAction={handleBulkOrderAction} />
                )}
              </TabsContent>

              <TabsContent value="wishlist" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {wishlistItems.length === 0 ? (
                    <div className="col-span-2">
                      <Card className="border-orange-100">
                        <CardContent className="p-8 text-center">
                          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                          <p className="text-gray-600 mb-4">Save your favorite items to see them here!</p>
                          <Button
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => router.push('/products')}
                          >
                            Explore Products
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    wishlistItems.map((item) => (
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
                              <Button
                                size="sm"
                                className="bg-orange-600 hover:bg-orange-700"
                                onClick={() => {
                                  try {
                                    if (item.inStock) {
                                      const cartItem = {
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        originalPrice: item.originalPrice,
                                        image: item.image,
                                        inStock: item.inStock,
                                        maxQuantity: 99
                                      }
                                      addToCart(cartItem)
                                      toast.success(`${item.name} added to cart!`)
                                    } else {
                                      toast.error(`${item.name} is out of stock`)
                                    }
                                  } catch (error) {
                                    toast.error("Failed to add to cart")
                                    console.error("Add to cart error:", error)
                                  }
                                }}
                                disabled={!item.inStock}
                              >
                                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-orange-200 hover:bg-orange-50 bg-transparent"
                                onClick={() => removeFromWishlist(item.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <AnalyticsDashboard userStats={userStats} orders={userOrders} />
              </TabsContent>

              <TabsContent value="subscriptions" className="mt-6">
                <SubscriptionManagement userStats={userStats} />
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
                        onClick={() => router.push('/account/profile/edit')}
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
                            <span className="text-gray-700">{currentUser.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-gray-700">{currentUser.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-gray-700">{currentUser.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Account Statistics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Member Since:</span>
                            <span className="font-medium">{currentUser.joinDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Orders:</span>
                            <span className="font-medium">{currentUser.totalOrders}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Loyalty Points:</span>
                            <span className="font-medium text-orange-600">{currentUser.loyaltyPoints}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Admin Panel Access */}
                    {session?.user?.isAdmin && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-red-800 mb-1">Admin Access</h4>
                            <p className="text-sm text-red-600">You have administrator privileges</p>
                          </div>
                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => router.push('/admin')}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Admin Panel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <ProductFooter />
    </div>
  )
}
