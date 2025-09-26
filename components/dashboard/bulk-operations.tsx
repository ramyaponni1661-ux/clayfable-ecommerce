"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Package,
  Download,
  RefreshCw,
  X,
  CheckCircle,
  AlertTriangle,
  Eye,
  Truck
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface BulkOperationsProps {
  orders: any[]
  onBulkAction: (action: string, orderIds: string[]) => void
}

export function BulkOperations({ orders, onBulkAction }: BulkOperationsProps) {
  const router = useRouter()
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    action: string
    title: string
    description: string
  }>({
    open: false,
    action: '',
    title: '',
    description: ''
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map(order => order.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId])
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) return

    setIsProcessing(true)
    try {
      await onBulkAction(action, selectedOrders)
      setSelectedOrders([])
      setConfirmDialog(prev => ({ ...prev, open: false }))
    } catch (error) {
      console.error('Bulk action failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const openConfirmDialog = (action: string, title: string, description: string) => {
    setConfirmDialog({
      open: true,
      action,
      title,
      description
    })
  }

  const exportOrders = () => {
    const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id))
    const csvContent = [
      ['Order ID', 'Date', 'Status', 'Total', 'Items'].join(','),
      ...selectedOrdersData.map(order => [
        order.id,
        order.date,
        order.status,
        order.total,
        order.items
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'in transit':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Bulk Actions Header */}
      <Card className="border-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              Bulk Order Operations
            </div>
            <Badge variant="outline">
              {selectedOrders.length} of {orders.length} selected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectAll(selectedOrders.length !== orders.length)}
              className="border-orange-200"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {selectedOrders.length === orders.length ? 'Deselect All' : 'Select All'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={selectedOrders.length === 0}
              onClick={exportOrders}
              className="border-orange-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>

            <Select disabled={selectedOrders.length === 0}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="reorder"
                  onClick={() => openConfirmDialog('reorder', 'Reorder Items', `Reorder ${selectedOrders.length} selected orders?`)}
                >
                  <RefreshCw className="h-4 w-4 mr-2 inline" />
                  Reorder All
                </SelectItem>
                <SelectItem
                  value="cancel"
                  onClick={() => openConfirmDialog('cancel', 'Cancel Orders', `Cancel ${selectedOrders.length} selected orders? This action cannot be undone.`)}
                >
                  <X className="h-4 w-4 mr-2 inline" />
                  Cancel Orders
                </SelectItem>
                <SelectItem
                  value="track"
                  onClick={() => openConfirmDialog('track', 'Track Orders', `Generate tracking report for ${selectedOrders.length} selected orders?`)}
                >
                  <Truck className="h-4 w-4 mr-2 inline" />
                  Track All
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List with Selection */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className={`border-orange-100 transition-all ${selectedOrders.includes(order.id) ? 'ring-2 ring-orange-200 bg-orange-50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                />

                <img
                  src={order.image || "/placeholder.svg"}
                  alt="Order"
                  className="w-16 h-16 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">Order {order.id}</h4>
                      <p className="text-gray-600">
                        {order.items} items • {order.date}
                      </p>
                      <p className="text-lg font-bold text-orange-600">₹{order.total}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>

                      <div className="flex gap-2">
                        <Link href={`/track-order?order=${order.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-orange-200 hover:bg-orange-50"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>

                        {(order.status === "In Transit" || order.status === "processing" || order.status === "shipped") && (
                          <Link href={`/track-order?order=${order.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-orange-200 hover:bg-orange-50"
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Track
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              {confirmDialog.title}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleBulkAction(confirmDialog.action)}
              disabled={isProcessing}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}