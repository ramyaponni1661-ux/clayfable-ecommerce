"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  Bell,
  DollarSign,
  TrendingUp,
  Calendar,
  MessageSquare,
  Globe,
  Shield,
  Mail,
  Smartphone,
} from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for demonstration
  const stats = {
    totalRevenue: "₹12,45,678",
    totalOrders: 1234,
    totalProducts: 456,
    totalUsers: 2890,
    pendingOrders: 23,
    lowStock: 12,
  }

  const recentOrders = [
    { id: "ORD001", customer: "Rajesh Kumar", amount: "₹2,450", status: "Pending", date: "2024-01-15" },
    { id: "ORD002", customer: "Priya Sharma", amount: "₹1,890", status: "Shipped", date: "2024-01-14" },
    { id: "ORD003", customer: "Amit Patel", amount: "₹3,200", status: "Delivered", date: "2024-01-13" },
  ]

  const products = [
    { id: 1, name: "Traditional Clay Pot", price: "₹450", stock: 25, category: "Cookware", status: "Active" },
    { id: 2, name: "Decorative Vase", price: "₹890", stock: 5, category: "Decor", status: "Low Stock" },
    { id: 3, name: "Terracotta Planter", price: "₹320", stock: 0, category: "Garden", status: "Out of Stock" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-orange-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clayfable Admin</h1>
                <p className="text-sm text-gray-600">Manage your terracotta empire</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                <Badge variant="destructive" className="ml-2">
                  3
                </Badge>
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700">{stats.totalRevenue}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700">{stats.totalOrders}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.2% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700">{stats.totalProducts}</div>
                  <p className="text-xs text-orange-600 flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {stats.lowStock} low stock items
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700">{stats.totalUsers}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15.3% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800">Recent Orders</CardTitle>
                <CardDescription>Latest orders from your customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{order.amount}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <Badge
                          variant={
                            order.status === "Pending"
                              ? "secondary"
                              : order.status === "Shipped"
                                ? "default"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-orange-800">Product Management</h2>
                <p className="text-gray-600">Manage your terracotta product catalog</p>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Product Filters */}
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-orange-200"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full sm:w-48 border-orange-200">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="cookware">Cookware</SelectItem>
                      <SelectItem value="decor">Decor</SelectItem>
                      <SelectItem value="garden">Garden</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full sm:w-48 border-orange-200">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-orange-200 bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-orange-200 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{product.price}</p>
                          <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                        </div>
                        <Badge
                          variant={
                            product.status === "Active"
                              ? "default"
                              : product.status === "Low Stock"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {product.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-orange-800">Order Management</h2>
                <p className="text-gray-600">Track and manage customer orders</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Manual Order
                </Button>
              </div>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-orange-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-700">{stats.pendingOrders}</div>
                    <p className="text-sm text-gray-600">Pending Orders</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-orange-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">45</div>
                    <p className="text-sm text-gray-600">Processing</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-orange-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">128</div>
                    <p className="text-sm text-gray-600">Shipped</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-orange-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">892</div>
                    <p className="text-sm text-gray-600">Delivered</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders List */}
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{order.amount}</p>
                        </div>
                        <Badge
                          variant={
                            order.status === "Pending"
                              ? "secondary"
                              : order.status === "Shipped"
                                ? "default"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-orange-800">User Management</h2>
                <p className="text-gray-600">Manage customer accounts and permissions</p>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">User Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Users</span>
                    <span className="font-medium">{stats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="font-medium">2,456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">New This Month</span>
                    <span className="font-medium text-green-600">+234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">B2B Customers</span>
                    <span className="font-medium">156</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Rajesh Kumar", email: "rajesh@example.com", type: "Customer", joined: "2024-01-15" },
                      { name: "Priya Sharma", email: "priya@restaurant.com", type: "B2B", joined: "2024-01-14" },
                      { name: "Amit Patel", email: "amit@example.com", type: "Customer", joined: "2024-01-13" },
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={user.type === "B2B" ? "default" : "secondary"}>{user.type}</Badge>
                          <span className="text-sm text-gray-600">{user.joined}</span>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-orange-800">Content Management</h2>
                <p className="text-gray-600">Manage website content and media</p>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Homepage Content */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Homepage Content</CardTitle>
                  <CardDescription>Edit homepage sections and banners</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hero-title">Hero Section Title</Label>
                    <Input
                      id="hero-title"
                      defaultValue="Authentic Terracotta Craftsmanship Since 1952"
                      className="border-orange-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-subtitle">Hero Section Subtitle</Label>
                    <Textarea
                      id="hero-subtitle"
                      defaultValue="Discover our premium collection of handcrafted terracotta products..."
                      className="border-orange-200"
                    />
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700">Update Homepage</Button>
                </CardContent>
              </Card>

              {/* Media Library */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Media Library</CardTitle>
                  <CardDescription>Manage images and media files</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square bg-orange-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-orange-400" />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full border-orange-200 bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Media
                  </Button>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">SEO Settings</CardTitle>
                  <CardDescription>Optimize your site for search engines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input
                      id="meta-title"
                      defaultValue="Clayfable - Premium Terracotta Products"
                      className="border-orange-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      defaultValue="Discover authentic terracotta products crafted with 72 years of expertise..."
                      className="border-orange-200"
                    />
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700">Update SEO</Button>
                </CardContent>
              </Card>

              {/* Blog Management */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Blog Management</CardTitle>
                  <CardDescription>Create and manage blog posts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[
                      "The Art of Terracotta Making",
                      "Caring for Your Clay Cookware",
                      "Traditional vs Modern Pottery",
                    ].map((title, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium">{title}</span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full border-orange-200 bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    New Blog Post
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-orange-800">Platform Settings</h2>
              <p className="text-gray-600">Configure your Clayfable platform</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">General Settings</CardTitle>
                  <CardDescription>Basic platform configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" defaultValue="Clayfable" className="border-orange-200" />
                  </div>
                  <div>
                    <Label htmlFor="site-tagline">Site Tagline</Label>
                    <Input
                      id="site-tagline"
                      defaultValue="Authentic Terracotta Since 1952"
                      className="border-orange-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" defaultValue="info@clayfable.com" className="border-orange-200" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+91 98765 43210" className="border-orange-200" />
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700">Save General Settings</Button>
                </CardContent>
              </Card>

              {/* Payment Settings */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Payment Settings</CardTitle>
                  <CardDescription>Configure payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: "Credit/Debit Cards", enabled: true },
                      { name: "UPI Payments", enabled: true },
                      { name: "Net Banking", enabled: true },
                      { name: "Cash on Delivery", enabled: true },
                      { name: "Wallet Payments", enabled: false },
                    ].map((method, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium">{method.name}</span>
                        <Badge variant={method.enabled ? "default" : "secondary"}>
                          {method.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full border-orange-200 bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Payment Gateways
                  </Button>
                </CardContent>
              </Card>

              {/* Shipping Settings */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Shipping Settings</CardTitle>
                  <CardDescription>Configure shipping options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="free-shipping">Free Shipping Threshold</Label>
                    <Input id="free-shipping" defaultValue="₹999" className="border-orange-200" />
                  </div>
                  <div>
                    <Label htmlFor="shipping-charge">Standard Shipping Charge</Label>
                    <Input id="shipping-charge" defaultValue="₹99" className="border-orange-200" />
                  </div>
                  <div>
                    <Label htmlFor="express-charge">Express Shipping Charge</Label>
                    <Input id="express-charge" defaultValue="₹199" className="border-orange-200" />
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700">Update Shipping Settings</Button>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Notification Settings</CardTitle>
                  <CardDescription>Configure email and SMS notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: "Order Confirmations", type: "Email + SMS", enabled: true },
                      { name: "Shipping Updates", type: "Email + SMS", enabled: true },
                      { name: "Low Stock Alerts", type: "Email", enabled: true },
                      { name: "New User Registration", type: "Email", enabled: false },
                      { name: "Marketing Emails", type: "Email", enabled: true },
                    ].map((notification, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium">{notification.name}</span>
                          <p className="text-xs text-gray-600">{notification.type}</p>
                        </div>
                        <Badge variant={notification.enabled ? "default" : "secondary"}>
                          {notification.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full border-orange-200 bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    Configure Email Templates
                  </Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Security Settings</CardTitle>
                  <CardDescription>Platform security configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: "Two-Factor Authentication", status: "Enabled" },
                      { name: "SSL Certificate", status: "Active" },
                      { name: "Firewall Protection", status: "Active" },
                      { name: "Backup Encryption", status: "Enabled" },
                    ].map((security, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium">{security.name}</span>
                        <Badge variant="default">{security.status}</Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full border-orange-200 bg-transparent">
                    <Shield className="w-4 h-4 mr-2" />
                    Advanced Security Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Integration Settings */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Integration Settings</CardTitle>
                  <CardDescription>Third-party service integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: "WhatsApp Business API", status: "Connected", icon: MessageSquare },
                      { name: "Google Analytics", status: "Connected", icon: BarChart3 },
                      { name: "Facebook Pixel", status: "Not Connected", icon: Globe },
                      { name: "SMS Gateway", status: "Connected", icon: Smartphone },
                    ].map((integration, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <integration.icon className="w-5 h-5 text-orange-600" />
                          <span className="text-sm font-medium">{integration.name}</span>
                        </div>
                        <Badge variant={integration.status === "Connected" ? "default" : "secondary"}>
                          {integration.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full border-orange-200 bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Integration
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
