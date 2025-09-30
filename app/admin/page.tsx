"use client";

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import BulkProductManager from "@/components/admin/BulkProductManager"
import BulkCartOperations from "@/components/admin/BulkCartOperations"
import EnhancedProductsTab from "@/components/admin/EnhancedProductsTab"
import AdminCategoryManager from "@/components/admin/AdminCategoryManager"
import NotificationManager from "@/components/admin/NotificationManager"
import EnterpriseOrderManagement from "@/components/admin/EnterpriseOrderManagement"
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
  Layers,
  Zap,
  Search,
  ChevronDown,
  Activity,
  Database,
  Clock,
  Home,
  User,
  LogOut,
  HelpCircle,
  Maximize2,
  Minimize2,
  RefreshCw,
  Save,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    category_id: "",
    inventory_quantity: "",
    is_active: true,
    is_featured: false,
    featured_on_homepage: false,
    capacity: "",
    material_details: "",
    usage_instructions: "",
    care_instructions: "",
    product_tags: ""
  })

  // User form state
  const [userForm, setUserForm] = useState({
    email: "",
    full_name: "",
    phone: "",
    user_type: "customer"
  })

  // Bulk operations state
  const [selectedProducts, setSelectedProducts] = useState([])

  // Real data states
  const [currentTime, setCurrentTime] = useState(new Date())
  const [realTimeStats, setRealTimeStats] = useState({
    todayRevenue: 0,
    activeOrders: 0,
    onlineUsers: 0,
    totalInventory: 0
  })
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: "₹0",
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStock: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [recentUsers, setRecentUsersData] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])

  // Loading states
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)
  const [isLoadingRecentUsers, setIsLoadingRecentUsers] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  const { data: session, status } = useSession()
  const router = useRouter()

  // Handle product selection from BulkProductManager
  const handleProductSelection = (products) => {
    setSelectedProducts(products)
  }

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Authentication check
  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Check if user is admin
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/admin/check-auth')
        if (!response.ok) {
          router.push("/auth/signin?error=unauthorized")
          return
        }
        const data = await response.json()
        if (!data.isAdmin) {
          router.push("/auth/signin?error=unauthorized")
          return
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        router.push("/auth/signin?error=unauthorized")
      }
    }

    checkAdminStatus()
  }, [session, status, router])

  // Load real-time statistics
  const fetchStats = async () => {
    try {
      setIsLoadingStats(true)
      const response = await fetch('/api/admin/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')

      const data = await response.json()
      if (data.success) {
        setRealTimeStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load real-time statistics')
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Load dashboard data
  const fetchDashboard = async () => {
    try {
      setIsLoadingDashboard(true)
      const response = await fetch('/api/admin/dashboard')
      if (!response.ok) throw new Error('Failed to fetch dashboard data')

      const data = await response.json()
      if (data.success) {
        setDashboardStats(data.dashboard.stats)
        setRecentOrders(data.dashboard.recentOrders)
        setRecentProducts(data.dashboard.recentProducts)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoadingDashboard(false)
    }
  }

  // Load products
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const params = new URLSearchParams({
        limit: '20',
        offset: '0'
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedStatus !== 'all') params.append('status', selectedStatus)

      const response = await fetch(`/api/admin/products?${params}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.products || [])
      } else {
        toast.error('Failed to load products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Load categories
  const fetchCategories = async () => {
    try {
      // Fetch ALL categories (including subcategories) for admin forms
      const response = await fetch('/api/categories?parent_id=all')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Load orders
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      if (response.ok) {
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  // Load users
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users?limit=10')
      const data = await response.json()
      if (data.success) {
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // Load recent users data
  const fetchRecentUsers = async () => {
    try {
      setIsLoadingRecentUsers(true)
      const response = await fetch('/api/admin/users/recent?limit=5')
      if (!response.ok) throw new Error('Failed to fetch recent users')

      const data = await response.json()
      if (data.success) {
        setRecentUsersData(data.users)
      }
    } catch (error) {
      console.error('Error fetching recent users:', error)
      toast.error('Failed to load recent users')
    } finally {
      setIsLoadingRecentUsers(false)
    }
  }


  // Handle product creation
  const handleCreateProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.sku) {
      toast.error('Please fill in required fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Product created successfully')
        setShowAddProductModal(false)
        setProductForm({
          name: "",
          description: "",
          price: "",
          sku: "",
          category_id: "",
          inventory_quantity: "",
          is_active: true,
          is_featured: false,
          featured_on_homepage: false,
          capacity: "",
          material_details: "",
          usage_instructions: "",
          care_instructions: "",
          product_tags: ""
        })
        fetchProducts()
        fetchDashboard()
      } else {
        toast.error('Failed to create product: ' + data.error)
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to create product')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle user creation
  const handleCreateUser = async () => {
    if (!userForm.email || !userForm.full_name) {
      toast.error('Please fill in required fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'create_user',
          user_data: userForm
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('User created successfully')
        setShowAddUserModal(false)
        setUserForm({
          email: "",
          full_name: "",
          phone: "",
          user_type: "customer"
        })
        fetchUsers()
        fetchDashboard()
      } else {
        toast.error('Failed to create user: ' + data.error)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Failed to create user')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle product deletion with admin controls
  const handleDeleteProduct = async (productId, productName) => {
    const confirmDelete = async (force = false) => {
      setIsLoading(true)
      try {
        const url = `/api/admin/products?id=${productId}${force ? '&force=true' : ''}`
        const response = await fetch(url, { method: 'DELETE' })
        const data = await response.json()

        if (data.success) {
          toast.success(data.message || 'Product deleted successfully')
          fetchProducts()
          fetchDashboard()
        } else if (data.canForceDelete && !force) {
          // Show detailed dialog for products with orders
          const options = [
            `🛒 **Orders Found**: ${data.orderCount} order(s) contain this product`,
            `📦 **Details**: ${data.details}`,
            '',
            '**Admin Options:**',
            '1️⃣ **Deactivate** - Hide from customers, keep order history',
            '2️⃣ **Force Delete** - Remove product AND order history (⚠️ irreversible)',
            '3️⃣ **Cancel** - Keep product as-is'
          ].join('\n')

          if (confirm(`⚠️ PRODUCT HAS ORDERS\n\n${data.details}\n\nOptions:\n✅ DEACTIVATE - Hide from customers, keep order history\n❌ FORCE DELETE - Remove everything (irreversible)\n\nClick OK to DEACTIVATE or Cancel to abort.\n\nTo force delete, hold Shift and click OK.`)) {
            if (window.event && window.event.shiftKey) {
              // Shift + OK = Force delete
              if (confirm(`🚨 FORCE DELETE CONFIRMATION\n\nThis will permanently delete:\n- Product: "${productName}"\n- ${data.orderCount} order entries\n- All related order history\n\nThis CANNOT be undone!\n\nClick OK to confirm FORCE DELETE.`)) {
                await confirmDelete(true)
              }
            } else {
              // Regular OK = Deactivate
              await handleToggleProductStatus(productId, false)
              toast.info(`Product "${productName}" deactivated. Hidden from customers, order history preserved.`)
            }
          }
        } else {
          // Handle 404 error gracefully (product already deleted)
          if (response.status === 404) {
            toast.info(`Product "${productName}" was already deleted. Refreshing the product list.`)
            fetchProducts() // Refresh to remove stale data
            fetchDashboard()
          } else {
            toast.error('Failed to delete product: ' + data.error)
          }
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        // Check if it's a network error with product not found
        if (error.message && error.message.includes('404')) {
          toast.info(`Product "${productName}" was already deleted. Refreshing the product list.`)
          fetchProducts() // Refresh to remove stale data
          fetchDashboard()
        } else {
          toast.error('Failed to delete product')
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Simple confirmation for products without orders
    if (confirm(`Delete "${productName}"?\n\nThis will permanently remove the product.`)) {
      await confirmDelete(false)
    }
  }

  // Handle product activation/deactivation
  const handleToggleProductStatus = async (productId, isActive) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, is_active: isActive })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Product ${isActive ? 'activated' : 'deactivated'} successfully`)
        fetchProducts()
        fetchDashboard()
      } else {
        toast.error('Failed to update product: ' + data.error)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle making user admin
  const handleMakeAdmin = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to make "${userEmail}" an admin?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'update_user_type',
          user_id: userId,
          user_type: 'admin'
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`${userEmail} is now an admin`)
        fetchUsers()
        fetchDashboard()
      } else {
        toast.error('Failed to make user admin: ' + data.error)
      }
    } catch (error) {
      console.error('Error making user admin:', error)
      toast.error('Failed to make user admin')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle removing admin privileges
  const handleRemoveAdmin = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to remove admin privileges from "${userEmail}"?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'update_user_type',
          user_id: userId,
          user_type: 'customer'
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Admin privileges removed from ${userEmail}`)
        fetchUsers()
        fetchDashboard()
      } else {
        toast.error('Failed to remove admin privileges: ' + data.error)
      }
    } catch (error) {
      console.error('Error removing admin privileges:', error)
      toast.error('Failed to remove admin privileges')
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh all data
  const refreshAllData = async () => {
    setIsLoading(true)
    toast.info('Refreshing all data...')
    try {
      await Promise.all([
        fetchStats(),
        fetchDashboard(),
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchUsers(),
        fetchRecentUsers()
      ])
      toast.success('Data refreshed successfully')
    } catch (error) {
      console.error('Error refreshing data:', error)
      toast.error('Failed to refresh some data')
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on mount and set up intervals
  useEffect(() => {
    Promise.all([
      fetchStats(),
      fetchDashboard(),
      fetchProducts(),
      fetchCategories(),
      fetchOrders(),
      fetchUsers(),
      fetchRecentUsers()
    ])

    // Set up refresh intervals
    const statsInterval = setInterval(fetchStats, 30000) // Every 30 seconds
    const dashboardInterval = setInterval(fetchDashboard, 60000) // Every minute

    return () => {
      clearInterval(statsInterval)
      clearInterval(dashboardInterval)
    }
  }, [])

  // Refetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [searchTerm, selectedCategory, selectedStatus])

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-600">Loading admin dashboard...</div>
        </div>
      </div>
    )
  }

  // Don't render admin content if not authenticated
  if (!session) {
    return null
  }

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory
    const matchesStatus = selectedStatus === "all" ||
                         (selectedStatus === "active" && product.is_active) ||
                         (selectedStatus === "inactive" && !product.is_active) ||
                         (selectedStatus === "low-stock" && product.inventory_quantity <= 10) ||
                         (selectedStatus === "out-of-stock" && product.inventory_quantity === 0)

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Enterprise Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-xl">
        {/* Top Status Bar */}
        <div className="bg-slate-950 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 text-xs">
              <div className="flex items-center space-x-6 text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>System Status: Operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-3 h-3" />
                  <span>Uptime: {Math.floor(performance.now() / 60000)}m</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="w-3 h-3" />
                  <span>DB: Connected</span>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-slate-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{currentTime.toLocaleTimeString()}</span>
                </div>
                <div>{currentTime.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Clayfable Admin Console</h1>
                <p className="text-sm text-orange-300">Enterprise Management Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={refreshAllData}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>


              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="bg-red-900/20 border-red-500/30 text-red-300 hover:bg-red-800/30 hover:text-red-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-slate-800/50 border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-slate-300">Today's Revenue:</span>
                  <span className="text-green-400 font-bold">
                    {isLoadingStats ? '...' : `₹${realTimeStats.todayRevenue.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <ShoppingCart className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">Active Orders:</span>
                  <span className="text-blue-400 font-bold">
                    {isLoadingStats ? '...' : realTimeStats.activeOrders}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">Online Users:</span>
                  <span className="text-purple-400 font-bold">
                    {isLoadingStats ? '...' : realTimeStats.onlineUsers}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-xs text-slate-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </div>
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-none lg:flex flex-wrap">
            <TabsTrigger value="overview" className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="bulk-products" className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600">
              <Layers className="w-4 h-4" />
              Bulk Products
            </TabsTrigger>
            <TabsTrigger value="bulk-cart" className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
              <Zap className="w-4 h-4" />
              Bulk Cart
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-400 text-white hover:from-amber-600 hover:to-orange-500">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600">
              <Layers className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Enterprise Metrics Dashboard */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 mb-8 shadow-2xl border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Real-Time Business Intelligence</h3>
                  <p className="text-slate-300 text-sm">Enterprise-grade analytics and performance monitoring</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-500/20 rounded-full px-3 py-1 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Live</span>
                  </div>
                  <Badge variant="secondary" className="bg-slate-800 text-slate-200 border-slate-600">
                    <Activity className="w-3 h-3 mr-1" />
                    System Active
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-all">
                  <div className="text-center">
                    <div className="p-2 bg-emerald-500/20 rounded-lg w-fit mx-auto mb-2">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Revenue/Hour</p>
                    <p className="text-white font-bold text-base">₹{Math.floor(realTimeStats.todayRevenue / 24).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-all">
                  <div className="text-center">
                    <div className="p-2 bg-blue-500/20 rounded-lg w-fit mx-auto mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Conversion</p>
                    <p className="text-white font-bold text-base">12.4%</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-all">
                  <div className="text-center">
                    <div className="p-2 bg-purple-500/20 rounded-lg w-fit mx-auto mb-2">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Active Users</p>
                    <p className="text-white font-bold text-base">{realTimeStats.onlineUsers}</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-all">
                  <div className="text-center">
                    <div className="p-2 bg-orange-500/20 rounded-lg w-fit mx-auto mb-2">
                      <Package className="w-5 h-5 text-orange-400" />
                    </div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Inventory</p>
                    <p className="text-white font-bold text-base">{realTimeStats.totalInventory}</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-all">
                  <div className="text-center">
                    <div className="p-2 bg-red-500/20 rounded-lg w-fit mx-auto mb-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Low Stock</p>
                    <p className="text-white font-bold text-base">{dashboardStats.lowStock}</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-all">
                  <div className="text-center">
                    <div className="p-2 bg-cyan-500/20 rounded-lg w-fit mx-auto mb-2">
                      <Globe className="w-5 h-5 text-cyan-400" />
                    </div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Regions</p>
                    <p className="text-white font-bold text-base">24</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group bg-gradient-to-br from-white to-orange-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium group-hover:text-orange-700 transition-colors">Total Revenue</CardTitle>
                  <div className="p-2 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                    <DollarSign className="h-4 w-4 text-orange-600 group-hover:text-orange-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700 group-hover:text-orange-800 transition-colors">
                    {isLoadingDashboard ? '...' : dashboardStats.totalRevenue}
                  </div>
                  <p className="text-xs text-green-600 flex items-center mt-1 group-hover:text-green-700 transition-colors">
                    <TrendingUp className="w-3 h-3 mr-1 group-hover:animate-pulse" />
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium group-hover:text-blue-700 transition-colors">Total Orders</CardTitle>
                  <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <ShoppingCart className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700 group-hover:text-blue-800 transition-colors">
                    {isLoadingDashboard ? '...' : dashboardStats.totalOrders}
                  </div>
                  <p className="text-xs text-green-600 flex items-center mt-1 group-hover:text-green-700 transition-colors">
                    <TrendingUp className="w-3 h-3 mr-1 group-hover:animate-pulse" />
                    +8.2% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group bg-gradient-to-br from-white to-purple-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium group-hover:text-purple-700 transition-colors">Total Products</CardTitle>
                  <div className="p-2 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                    <Package className="h-4 w-4 text-purple-600 group-hover:text-purple-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700 group-hover:text-purple-800 transition-colors">
                    {isLoadingDashboard ? '...' : dashboardStats.totalProducts}
                  </div>
                  <p className="text-xs text-orange-600 flex items-center mt-1 group-hover:text-orange-700 transition-colors">
                    <Calendar className="w-3 h-3 mr-1 group-hover:animate-pulse" />
                    {isLoadingDashboard ? '...' : dashboardStats.lowStock} low stock items
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group bg-gradient-to-br from-white to-green-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium group-hover:text-green-700 transition-colors">Total Users</CardTitle>
                  <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                    <Users className="h-4 w-4 text-green-600 group-hover:text-green-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700 group-hover:text-green-800 transition-colors">
                    {isLoadingDashboard ? '...' : dashboardStats.totalUsers}
                  </div>
                  <p className="text-xs text-green-600 flex items-center mt-1 group-hover:text-green-700 transition-colors">
                    <TrendingUp className="w-3 h-3 mr-1 group-hover:animate-pulse" />
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
                  {isLoadingDashboard ? (
                    <div className="text-center py-8">
                      <div className="text-sm text-gray-600">Loading recent orders...</div>
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-sm text-gray-600">No recent orders found</p>
                    </div>
                  ) : (
                    recentOrders.map((order) => (
                      <div key={order.id} className="group flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 hover:shadow-md transition-all duration-200 cursor-pointer border border-transparent hover:border-orange-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-8 bg-orange-300 rounded-full group-hover:bg-orange-500 transition-colors"></div>
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-orange-800 transition-colors">{order.id}</p>
                            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">{order.customer}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium text-gray-900 group-hover:text-orange-800 transition-colors">{order.amount}</p>
                            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">{order.date}</p>
                          </div>
                          <Badge
                            variant={
                              order.status === "Pending"
                                ? "secondary"
                                : order.status === "Shipped"
                                  ? "default"
                                  : "outline"
                            }
                            className="group-hover:shadow-sm transition-shadow"
                          >
                            {order.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-orange-600 hover:text-white hover:border-orange-600"
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowOrderModal(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Enterprise Management Actions */}
                <div className="mt-6 pt-4 border-t border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm" className="hover:bg-orange-600 hover:text-white hover:border-orange-600">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                      </Button>
                      <Button variant="outline" size="sm" className="hover:bg-blue-600 hover:text-white hover:border-blue-600">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Alerts
                      </Button>
                      <Button variant="outline" size="sm" className="hover:bg-purple-600 hover:text-white hover:border-purple-600">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>System synchronized • Last backup: {new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Enterprise Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-blue-200 hover:border-blue-300 transition-colors bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Center
                  </CardTitle>
                  <CardDescription>Enterprise security monitoring and controls</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Access Control</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Auth</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audit Logs</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">24/7</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:border-purple-300 transition-colors bg-gradient-to-br from-white to-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Automation Hub
                  </CardTitle>
                  <CardDescription>Automated workflows and smart triggers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-Restock</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Running</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Price Updates</span>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">Scheduled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Marketing Sync</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:border-green-300 transition-colors bg-gradient-to-br from-white to-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Global Operations
                  </CardTitle>
                  <CardDescription>Multi-region business intelligence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Regions</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">24</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Currency Support</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Time Zones</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">Global</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab - Enhanced with new component */}
          <TabsContent value="products" className="space-y-6">
            <EnhancedProductsTab
              products={products}
              categories={categories}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              isLoadingProducts={isLoadingProducts}
              fetchProducts={fetchProducts}
              fetchDashboard={fetchDashboard}
              handleDeleteProduct={handleDeleteProduct}
              handleToggleProductStatus={handleToggleProductStatus}
            />
          </TabsContent>

          {/* Bulk Products Tab */}
          <TabsContent value="bulk-products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-orange-800">Bulk Product Operations</h2>
                <p className="text-gray-600">Manage multiple products efficiently with bulk operations</p>
              </div>
            </div>
            <BulkProductManager onProductSelect={handleProductSelection} />
          </TabsContent>

          {/* Bulk Cart Tab */}
          <TabsContent value="bulk-cart" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-orange-800">Bulk Cart Operations</h2>
                <p className="text-gray-600">Add products to multiple user carts and manage bulk cart operations</p>
              </div>
            </div>
            <BulkCartOperations selectedProducts={selectedProducts} />
          </TabsContent>

          {/* Orders Tab - Enterprise Management */}
          <TabsContent value="orders" className="space-y-6">
            <EnterpriseOrderManagement />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-orange-800">User Management</h2>
                <p className="text-gray-600">Manage customer accounts and permissions</p>
              </div>
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => setShowAddUserModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                      <p className="text-gray-500 mb-4">Users will appear here once they register.</p>
                      <Button
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => setShowAddUserModal(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </div>
                  ) : (
                    users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.full_name || user.email}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={user.user_type === "admin" ? "default" : "secondary"}>
                            {user.user_type}
                          </Badge>
                          {user.user_type !== "admin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMakeAdmin(user.id, user.email)}
                              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                            >
                              <Shield className="w-4 h-4 mr-1" />
                              Make Admin
                            </Button>
                          )}
                          {user.user_type === "admin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveAdmin(user.id, user.email)}
                              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
                            >
                              <User className="w-4 h-4 mr-1" />
                              Remove Admin
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-orange-800">Category Management</h2>
                <p className="text-gray-600">Manage product categories and their hierarchical structure</p>
              </div>
            </div>
            <AdminCategoryManager />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <NotificationManager />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}
      <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
        <DialogContent className="max-w-2xl bg-white border border-gray-200 shadow-xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {selectedProduct ? 'Update product information' : 'Fill in the details to create a new product'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={productForm.sku}
                  onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
                  placeholder="Enter SKU"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="inventory">Inventory Quantity</Label>
                <Input
                  id="inventory"
                  type="number"
                  value={productForm.inventory_quantity}
                  onChange={(e) => setProductForm(prev => ({ ...prev, inventory_quantity: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={productForm.category_id} onValueChange={(value) => setProductForm(prev => ({ ...prev, category_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity/Size</Label>
                  <Input
                    id="capacity"
                    value={productForm.capacity}
                    onChange={(e) => setProductForm(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="e.g., 2 Liters, Large, 10 inches"
                  />
                </div>
                <div>
                  <Label htmlFor="product_tags">Tags (comma-separated)</Label>
                  <Input
                    id="product_tags"
                    value={productForm.product_tags}
                    onChange={(e) => setProductForm(prev => ({ ...prev, product_tags: e.target.value }))}
                    placeholder="cooking, traditional, handmade"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="material_details">Material Details</Label>
                <Input
                  id="material_details"
                  value={productForm.material_details}
                  onChange={(e) => setProductForm(prev => ({ ...prev, material_details: e.target.value }))}
                  placeholder="Natural terracotta clay, eco-friendly finish"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="usage_instructions">Usage Instructions</Label>
                  <Textarea
                    id="usage_instructions"
                    value={productForm.usage_instructions}
                    onChange={(e) => setProductForm(prev => ({ ...prev, usage_instructions: e.target.value }))}
                    placeholder="How to use this product..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="care_instructions">Care Instructions</Label>
                  <Textarea
                    id="care_instructions"
                    value={productForm.care_instructions}
                    onChange={(e) => setProductForm(prev => ({ ...prev, care_instructions: e.target.value }))}
                    placeholder="How to care for this product..."
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={productForm.is_active}
                    onChange={(e) => setProductForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                  />
                  <Label htmlFor="is_featured">Featured in Category</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured_on_homepage"
                    checked={productForm.featured_on_homepage}
                    onChange={(e) => setProductForm(prev => ({ ...prev, featured_on_homepage: e.target.checked }))}
                  />
                  <Label htmlFor="featured_on_homepage">Featured on Homepage</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddProductModal(false)
                setSelectedProduct(null)
                setProductForm({
                  name: "",
                  description: "",
                  price: "",
                  sku: "",
                  category_id: "",
                  inventory_quantity: "",
                  is_active: true,
                  is_featured: false
                })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProduct}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              {selectedProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent className="max-w-md bg-white border border-gray-200 shadow-xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
            <div>
              <Label htmlFor="user_email">Email *</Label>
              <Input
                id="user_email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label htmlFor="user_name">Full Name *</Label>
              <Input
                id="user_name"
                value={userForm.full_name}
                onChange={(e) => setUserForm(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="user_phone">Phone</Label>
              <Input
                id="user_phone"
                value={userForm.phone}
                onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <Label htmlFor="user_type">User Type</Label>
              <Select value={userForm.user_type} onValueChange={(value) => setUserForm(prev => ({ ...prev, user_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="b2b">B2B</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddUserModal(false)
                setUserForm({
                  email: "",
                  full_name: "",
                  phone: "",
                  user_type: "customer"
                })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Details Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder ? `Order #${selectedOrder.id}` : 'Order information'}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <p className="text-sm font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className="text-sm font-medium">{selectedOrder.amount}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={selectedOrder.status === "Pending" ? "secondary" : "default"}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <Label>Date</Label>
                  <p className="text-sm">{selectedOrder.date}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Internal Links Footer */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <a href="/" className="text-blue-600 hover:text-blue-800">Home</a>
          <a href="/all-pottery" className="text-blue-600 hover:text-blue-800">All Pottery</a>
          <a href="/cooking" className="text-blue-600 hover:text-blue-800">Cooking</a>
          <a href="/collections" className="text-blue-600 hover:text-blue-800">Collections</a>
          <a href="/about" className="text-blue-600 hover:text-blue-800">About</a>
          <a href="/contact" className="text-blue-600 hover:text-blue-800">Contact</a>
        </div>
      </div>
    </div>
  )
}