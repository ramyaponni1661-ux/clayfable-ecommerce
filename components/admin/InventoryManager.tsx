'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Package, TrendingUp, DollarSign, BarChart3, RefreshCw, Plus, Minus, Edit3 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface InventoryMetrics {
  totalProducts: number
  lowStockItems: number
  outOfStockItems: number
  totalInventoryValue: number
  averageInventoryValue: number
  turnoverRate: number
  stockHealth: {
    healthy: number
    lowStock: number
    outOfStock: number
  }
}

interface Product {
  id: string
  name: string
  sku?: string
  inventory_quantity: number
  price: number
  cost_price?: number
  track_inventory: boolean
  is_active: boolean
  categories?: { name: string }
  updated_at: string
}

interface InventoryData {
  success: boolean
  reportType: string
  metrics?: InventoryMetrics
  products?: Product[]
  threshold?: number
  totalValuation?: number
  categoryBreakdown?: Record<string, any>
  topMovers?: any[]
}

export default function InventoryManager() {
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeReport, setActiveReport] = useState('overview')
  const [threshold, setThreshold] = useState(10)
  const [adjustmentProducts, setAdjustmentProducts] = useState<Array<{
    productId: string
    adjustment?: number
    newQuantity?: number
  }>>([])
  const [adjustmentReason, setAdjustmentReason] = useState('')
  const [adjustmentNotes, setAdjustmentNotes] = useState('')
  const { toast } = useToast()

  const fetchInventoryData = async (reportType: string = 'overview') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        report: reportType,
        threshold: threshold.toString()
      })

      const response = await fetch(`/api/admin/inventory?${params}`)
      const data = await response.json()

      if (data.success) {
        setInventoryData(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch inventory data",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to inventory system",
        variant: "destructive"
      })
    }
    setLoading(false)
  }

  const handleStockAdjustment = async () => {
    if (adjustmentProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please add products to adjust",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'adjust_stock',
          products: adjustmentProducts,
          reason: adjustmentReason || 'Manual adjustment',
          notes: adjustmentNotes
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: `Adjusted stock for ${result.processed} products`,
        })
        setAdjustmentProducts([])
        setAdjustmentReason('')
        setAdjustmentNotes('')
        fetchInventoryData(activeReport) // Refresh data
      } else {
        toast({
          title: "Error",
          description: "Failed to adjust stock",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process stock adjustment",
        variant: "destructive"
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchInventoryData(activeReport)
  }, [activeReport, threshold])

  const addAdjustmentProduct = () => {
    setAdjustmentProducts([...adjustmentProducts, { productId: '', adjustment: 0 }])
  }

  const updateAdjustmentProduct = (index: number, field: string, value: any) => {
    const updated = [...adjustmentProducts]
    updated[index] = { ...updated[index], [field]: value }
    setAdjustmentProducts(updated)
  }

  const removeAdjustmentProduct = (index: number) => {
    setAdjustmentProducts(adjustmentProducts.filter((_, i) => i !== index))
  }

  const getStockStatusColor = (quantity: number, threshold: number) => {
    if (quantity === 0) return 'bg-red-500'
    if (quantity <= threshold) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const getStockStatusText = (quantity: number, threshold: number) => {
    if (quantity === 0) return 'Out of Stock'
    if (quantity <= threshold) return 'Low Stock'
    return 'In Stock'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-gray-600">Advanced inventory analytics and stock management</p>
        </div>
        <Button
          onClick={() => fetchInventoryData(activeReport)}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeReport} onValueChange={setActiveReport} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
          <TabsTrigger value="movement">Movement</TabsTrigger>
          <TabsTrigger value="adjust">Stock Adjust</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {inventoryData?.metrics && (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{inventoryData.metrics.totalProducts}</div>
                    <p className="text-xs text-muted-foreground">Active inventory items</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{Math.round(inventoryData.metrics.totalInventoryValue).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total stock value</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{inventoryData.metrics.lowStockItems}</div>
                    <p className="text-xs text-muted-foreground">Items below threshold</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{inventoryData.metrics.turnoverRate}x</div>
                    <p className="text-xs text-muted-foreground">Monthly turnover</p>
                  </CardContent>
                </Card>
              </div>

              {/* Stock Health Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle>Stock Health Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{inventoryData.metrics.stockHealth.healthy}</div>
                      <p className="text-sm text-muted-foreground">Healthy Stock</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{inventoryData.metrics.stockHealth.lowStock}</div>
                      <p className="text-sm text-muted-foreground">Low Stock</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{inventoryData.metrics.stockHealth.outOfStock}</div>
                      <p className="text-sm text-muted-foreground">Out of Stock</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Products */}
              {inventoryData.products && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {inventoryData.products.slice(0, 10).map((product) => (
                        <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-medium">Qty: {product.inventory_quantity}</div>
                              <div className="text-sm text-muted-foreground">₹{product.price}</div>
                            </div>
                            <Badge className={`${getStockStatusColor(product.inventory_quantity, threshold)} text-white`}>
                              {getStockStatusText(product.inventory_quantity, threshold)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Low Stock Items</h3>
            <div className="flex items-center gap-2">
              <Label htmlFor="threshold">Threshold:</Label>
              <Input
                id="threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value) || 10)}
                className="w-20"
              />
            </div>
          </div>

          {inventoryData?.products && (
            <Card>
              <CardContent className="p-0">
                <div className="space-y-3 p-6">
                  {inventoryData.products.map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg bg-orange-50">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Category: {product.categories?.name || 'Uncategorized'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-medium text-orange-600">Qty: {product.inventory_quantity}</div>
                          <div className="text-sm text-muted-foreground">Last updated: {new Date(product.updated_at).toLocaleDateString()}</div>
                        </div>
                        <Badge variant="destructive">
                          {product.inventory_quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="valuation" className="space-y-6">
          {inventoryData?.categoryBreakdown && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Total Inventory Valuation: ₹{Math.round(inventoryData.totalValuation || 0).toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(inventoryData.categoryBreakdown).map(([category, data]: [string, any]) => (
                      <div key={category} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{category}</h4>
                        <div className="space-y-1 text-sm">
                          <div>Value: ₹{Math.round(data.value).toLocaleString()}</div>
                          <div>Products: {data.products}</div>
                          <div>Quantity: {data.quantity} units</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="movement" className="space-y-6">
          {inventoryData?.topMovers && (
            <Card>
              <CardHeader>
                <CardTitle>Top Moving Products (Last 30 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryData.topMovers.map((mover: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{mover.product?.name}</h4>
                        <p className="text-sm text-muted-foreground">Current Stock: {mover.product?.inventory_quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Sold: {mover.totalSold} units</div>
                        <div className="text-sm text-muted-foreground">{mover.orderCount} orders</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="adjust" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Adjustment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reason">Adjustment Reason</Label>
                  <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Count</SelectItem>
                      <SelectItem value="damage">Damaged Goods</SelectItem>
                      <SelectItem value="loss">Loss/Theft</SelectItem>
                      <SelectItem value="return">Customer Return</SelectItem>
                      <SelectItem value="correction">Data Correction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={adjustmentNotes}
                    onChange={(e) => setAdjustmentNotes(e.target.value)}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Products to Adjust</h4>
                  <Button onClick={addAdjustmentProduct} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                {adjustmentProducts.map((product, index) => (
                  <div key={index} className="flex gap-3 items-center p-3 border rounded-lg">
                    <Input
                      placeholder="Product ID"
                      value={product.productId}
                      onChange={(e) => updateAdjustmentProduct(index, 'productId', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Adjustment (+/-)"
                      value={product.adjustment || ''}
                      onChange={(e) => updateAdjustmentProduct(index, 'adjustment', parseInt(e.target.value))}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAdjustmentProduct(index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleStockAdjustment}
                disabled={loading || adjustmentProducts.length === 0}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Apply Stock Adjustments'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}