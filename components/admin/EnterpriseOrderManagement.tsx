"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  Package,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Edit,
  Send,
  RefreshCw,
  AlertCircle,
  ArrowUpDown,
  MoreVertical,
  Printer,
  FileText,
  MessageSquare,
} from "lucide-react"

interface Order {
  id: string
  order_number: string
  user_id: string
  status: string
  payment_status: string
  payment_method: string
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total_amount: number
  currency: string
  billing_address: any
  shipping_address: any
  notes: any
  tracking_number: string | null
  shipped_at: string | null
  delivered_at: string | null
  created_at: string
  updated_at: string
  customer_email?: string
  items?: any[]
  products?: any[]
}

export default function EnterpriseOrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Edit form state
  const [editForm, setEditForm] = useState({
    status: "",
    payment_status: "",
    tracking_number: "",
    estimated_delivery: "",
    admin_notes: "",
  })

  // Analytics
  const [analytics, setAnalytics] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    applyFilters()
    calculateAnalytics()
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter, sortBy, sortOrder])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/orders', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })

      if (!response.ok) throw new Error('Failed to fetch orders')

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...orders]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(order =>
        order.order_number?.toLowerCase().includes(term) ||
        order.customer_email?.toLowerCase().includes(term) ||
        order.tracking_number?.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(order => order.payment_status === paymentFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at)
        const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))

        switch (dateFilter) {
          case "today": return diffDays === 0
          case "week": return diffDays <= 7
          case "month": return diffDays <= 30
          default: return true
        }
      })
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Order]
      let bVal: any = b[sortBy as keyof Order]

      if (sortBy === "created_at" || sortBy === "updated_at") {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    setFilteredOrders(filtered)
  }

  const calculateAnalytics = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total_amount, 0),
      avgOrderValue: 0,
    }

    const completedOrders = orders.filter(o => o.status !== 'cancelled').length
    stats.avgOrderValue = completedOrders > 0 ? stats.totalRevenue / completedOrders : 0

    setAnalytics(stats)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order)
    setEditForm({
      status: order.status,
      payment_status: order.payment_status,
      tracking_number: order.tracking_number || "",
      estimated_delivery: "",
      admin_notes: "",
    })
    setShowEditModal(true)
  }

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return

    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) throw new Error('Failed to update order')

      toast.success('Order updated successfully! Customer notified.')
      setShowEditModal(false)
      fetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order')
    }
  }

  const handleQuickStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      toast.success(`Order ${newStatus}! Customer notified.`)
      fetchOrders()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedOrders.size === 0) {
      toast.error('No orders selected')
      return
    }

    try {
      const response = await fetch('/api/admin/orders/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: Array.from(selectedOrders),
          status: newStatus,
        }),
      })

      if (!response.ok) throw new Error('Failed to update orders')

      toast.success(`${selectedOrders.size} orders updated! Customers notified.`)
      setSelectedOrders(new Set())
      fetchOrders()
    } catch (error) {
      console.error('Error bulk updating:', error)
      toast.error('Failed to update orders')
    }
  }

  const toggleOrderSelection = (orderId: string) => {
    const newSelection = new Set(selectedOrders)
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId)
    } else {
      newSelection.add(orderId)
    }
    setSelectedOrders(newSelection)
  }

  const exportOrders = () => {
    const csv = [
      ['Order Number', 'Date', 'Customer', 'Status', 'Payment', 'Total', 'Tracking'].join(','),
      ...filteredOrders.map(order => [
        order.order_number,
        new Date(order.created_at).toLocaleDateString(),
        order.customer_email || 'N/A',
        order.status,
        order.payment_status,
        order.total_amount,
        order.tracking_number || 'N/A',
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Orders exported successfully')
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-cyan-100 text-cyan-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const parseAddress = (address: any) => {
    try {
      return typeof address === 'string' ? JSON.parse(address) : address
    } catch {
      return null
    }
  }

  const formatStateName = (state: string) => {
    if (!state) return 'N/A'
    return state.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-orange-600" />
        <span className="ml-3 text-lg">Loading orders...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{analytics.total}</div>
            <p className="text-xs text-gray-500 mt-1">All time orders</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {analytics.pending + analytics.processing + analytics.shipped}
            </div>
            <p className="text-xs text-gray-500 mt-1">Pending + Processing + Shipped</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ₹{analytics.totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-gray-500 mt-1">Excluding cancelled orders</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              ₹{Math.round(analytics.avgOrderValue).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-gray-500 mt-1">Per completed order</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Summary */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle>Order Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Pending: <strong>{analytics.pending}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Processing: <strong>{analytics.processing}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-cyan-600" />
              <span className="text-sm">Shipped: <strong>{analytics.shipped}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Delivered: <strong>{analytics.delivered}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm">Cancelled: <strong>{analytics.cancelled}</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                {filteredOrders.length} of {orders.length} orders
                {selectedOrders.size > 0 && ` • ${selectedOrders.size} selected`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportOrders}
                className="border-orange-200 hover:bg-orange-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                className="border-orange-200 hover:bg-orange-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders, customer, tracking..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedOrders.size > 0 && (
            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
              <span className="font-medium">{selectedOrders.size} orders selected</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleBulkStatusUpdate('confirmed')}>
                  Mark Confirmed
                </Button>
                <Button size="sm" onClick={() => handleBulkStatusUpdate('processing')}>
                  Mark Processing
                </Button>
                <Button size="sm" onClick={() => handleBulkStatusUpdate('shipped')}>
                  Mark Shipped
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedOrders(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all" || paymentFilter !== "all" || dateFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Orders will appear here once customers start placing them"}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const shippingAddr = parseAddress(order.shipping_address)
                const products = (() => {
                  try {
                    const notes = JSON.parse(order.notes || '{}')
                    return notes.products || []
                  } catch {
                    return []
                  }
                })()

                return (
                  <div
                    key={order.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedOrders.has(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="mt-1"
                        />

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{order.order_number}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <Badge className={getPaymentColor(order.payment_status)}>
                              {order.payment_status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(order.created_at).toLocaleDateString('en-IN')}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {order.customer_email || shippingAddr?.firstName + ' ' + shippingAddr?.lastName || 'Customer'}
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              ₹{order.total_amount.toLocaleString('en-IN')}
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              {products.length} item{products.length !== 1 ? 's' : ''}
                            </div>
                          </div>

                          {order.tracking_number && (
                            <div className="mt-2 flex items-center gap-2 text-sm">
                              <Truck className="h-4 w-4 text-cyan-600" />
                              <span className="font-mono text-cyan-600">{order.tracking_number}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickStatusUpdate(order.id, 'confirmed')}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickStatusUpdate(order.id, 'processing')}
                            className="border-purple-200 text-purple-700 hover:bg-purple-50"
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                        )}
                        {order.status === 'processing' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditOrder(order)}
                            className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Ship
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditOrder(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  Order Details - {selectedOrder.order_number}
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Created on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Customer & Payment Info */}
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {(() => {
                        const addr = parseAddress(selectedOrder.shipping_address)
                        return addr ? (
                          <>
                            <div><strong>Name:</strong> {addr.firstName} {addr.lastName}</div>
                            <div><strong>Phone:</strong> {addr.phone}</div>
                            <div><strong>Email:</strong> {selectedOrder.customer_email || 'N/A'}</div>
                          </>
                        ) : <div>No customer info</div>
                      })()}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>Method:</strong> {selectedOrder.payment_method}</div>
                      <div><strong>Status:</strong> <Badge className={getPaymentColor(selectedOrder.payment_status)}>{selectedOrder.payment_status}</Badge></div>
                      <div><strong>Total:</strong> ₹{selectedOrder.total_amount.toLocaleString('en-IN')}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    {(() => {
                      const addr = parseAddress(selectedOrder.shipping_address)
                      return addr ? (
                        <>
                          <p>{addr.address}</p>
                          <p>{addr.city}, {formatStateName(addr.state)} {addr.pincode}</p>
                          <p>Phone: {addr.phone}</p>
                        </>
                      ) : <p>No address</p>
                    })()}
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const products = (() => {
                        try {
                          const notes = JSON.parse(selectedOrder.notes || '{}')
                          return notes.products || []
                        } catch {
                          return []
                        }
                      })()

                      return products.length > 0 ? (
                        <div className="space-y-3">
                          {products.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                              </div>
                              <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                          ))}
                          <div className="border-t pt-3 space-y-1 text-sm">
                            <div className="flex justify-between"><span>Subtotal:</span><span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between"><span>Shipping:</span><span>₹{selectedOrder.shipping_amount.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between"><span>Tax:</span><span>₹{selectedOrder.tax_amount.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between font-bold text-base border-t pt-2">
                              <span>Total:</span>
                              <span>₹{selectedOrder.total_amount.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      ) : <p className="text-gray-500">No items</p>
                    })()}
                  </CardContent>
                </Card>

                {/* Tracking Info */}
                {selectedOrder.tracking_number && (
                  <Card className="border-cyan-200 bg-cyan-50">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Tracking Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-mono text-lg">{selectedOrder.tracking_number}</p>
                      {selectedOrder.shipped_at && (
                        <p className="text-sm text-gray-600 mt-2">
                          Shipped on {new Date(selectedOrder.shipped_at).toLocaleString('en-IN')}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button onClick={() => handleEditOrder(selectedOrder)} className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Order
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/api/orders/${selectedOrder.order_number}/invoice`, '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://wa.me/${parseAddress(selectedOrder.shipping_address)?.phone?.replace(/\D/g, '')}`, '_blank')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Order - {selectedOrder.order_number}</DialogTitle>
                <DialogDescription>
                  Update order status and tracking. Customer will be notified automatically.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Order Status</Label>
                    <Select value={editForm.status} onValueChange={(val) => setEditForm({ ...editForm, status: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Payment Status</Label>
                    <Select value={editForm.payment_status} onValueChange={(val) => setEditForm({ ...editForm, payment_status: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Tracking Number</Label>
                  <Input
                    placeholder="Enter tracking number"
                    value={editForm.tracking_number}
                    onChange={(e) => setEditForm({ ...editForm, tracking_number: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Customer will receive tracking email</p>
                </div>

                <div>
                  <Label>Estimated Delivery</Label>
                  <Input
                    type="date"
                    value={editForm.estimated_delivery}
                    onChange={(e) => setEditForm({ ...editForm, estimated_delivery: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Admin Notes (Internal)</Label>
                  <Textarea
                    placeholder="Add internal notes (not visible to customer)"
                    value={editForm.admin_notes}
                    onChange={(e) => setEditForm({ ...editForm, admin_notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">Customer Notification</p>
                      <p className="text-blue-700 mt-1">
                        Customer will receive an email and WhatsApp notification about the status update.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateOrder} className="bg-orange-600 hover:bg-orange-700">
                  <Send className="h-4 w-4 mr-2" />
                  Update & Notify Customer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}