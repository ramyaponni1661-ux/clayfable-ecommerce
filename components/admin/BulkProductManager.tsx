"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Package,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  ShoppingCart,
  CheckSquare,
  Square,
  AlertCircle,
  Loader2,
  Search,
  RefreshCw,
  Settings,
  Plus,
  Minus
} from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  slug: string
  sku?: string
  price: number
  compare_price?: number
  inventory_quantity: number
  is_active: boolean
  track_inventory: boolean
  images?: string[]
  description?: string
  category_id?: string
  categories?: {
    id: string
    name: string
    slug: string
  }
  created_at: string
  updated_at: string
}

interface BulkProductManagerProps {
  onProductSelect?: (products: Product[]) => void
  showCartOperations?: boolean
}

export default function BulkProductManager({
  onProductSelect,
  showCartOperations = true
}: BulkProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [selectedProductsList, setSelectedProductsList] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showBulkEdit, setShowBulkEdit] = useState(false)
  const [bulkOperation, setBulkOperation] = useState("")
  const [categories, setCategories] = useState([])

  // Bulk edit form state
  const [bulkEditData, setBulkEditData] = useState({
    price: "",
    compare_price: "",
    inventory_quantity: "",
    is_active: "",
    track_inventory: ""
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 20

  // Load products
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [currentPage, searchTerm, selectedCategory, selectedStatus])

  // Update selected products list when selection changes
  useEffect(() => {
    const selected = products.filter(product => selectedProducts.has(product.id))
    setSelectedProductsList(selected)
    onProductSelect?.(selected)
  }, [selectedProducts, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: ((currentPage - 1) * itemsPerPage).toString(),
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedStatus !== 'all') params.append('status', selectedStatus)

      const response = await fetch(`/api/admin/products?${params}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.products || [])
        setTotalPages(Math.ceil((data.pagination?.total || 0) / itemsPerPage))
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelection = new Set([...selectedProducts, ...products.map(p => p.id)])
      setSelectedProducts(newSelection)
    } else {
      const currentProductIds = new Set(products.map(p => p.id))
      const newSelection = new Set([...selectedProducts].filter(id => !currentProductIds.has(id)))
      setSelectedProducts(newSelection)
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    const newSelection = new Set(selectedProducts)
    if (checked) {
      newSelection.add(productId)
    } else {
      newSelection.delete(productId)
    }
    setSelectedProducts(newSelection)
  }

  const handleBulkOperation = async (operation: string) => {
    if (selectedProducts.size === 0) {
      toast.error('Please select at least one product')
      return
    }

    setLoading(true)
    try {
      const requestBody = {
        operation,
        product_ids: Array.from(selectedProducts),
        data: operation === 'bulk_update' ? bulkEditData : undefined
      }

      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`${operation} completed successfully`)
        toast.success(`${data.results.successful} products processed successfully`)

        if (data.results.failed > 0) {
          toast.warning(`${data.results.failed} products failed to process`)
        }

        setSelectedProducts(new Set())
        setShowBulkEdit(false)
        fetchProducts()
      } else {
        toast.error(data.error || 'Bulk operation failed')
      }
    } catch (error) {
      console.error('Error performing bulk operation:', error)
      toast.error('Bulk operation failed')
    } finally {
      setLoading(false)
    }
  }

  const currentPageProductIds = new Set(products.map(p => p.id))
  const allCurrentPageSelected = products.length > 0 &&
    products.every(product => selectedProducts.has(product.id))
  const someCurrentPageSelected = products.some(product => selectedProducts.has(product.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bulk Product Manager</h2>
          <p className="text-gray-600">
            {selectedProducts.size} product(s) selected
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchProducts} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setSearchTerm("")} variant="outline" size="sm">
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchProducts} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      {selectedProducts.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Bulk Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Dialog open={showBulkEdit} onOpenChange={setShowBulkEdit}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Bulk Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Bulk Edit Products</DialogTitle>
                    <DialogDescription>
                      Edit {selectedProducts.size} selected product(s). Leave fields empty to keep current values.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bulk-price">Price (₹)</Label>
                      <Input
                        id="bulk-price"
                        type="number"
                        step="0.01"
                        placeholder="Leave empty to keep current"
                        value={bulkEditData.price}
                        onChange={(e) => setBulkEditData(prev => ({ ...prev, price: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bulk-compare-price">Compare Price (₹)</Label>
                      <Input
                        id="bulk-compare-price"
                        type="number"
                        step="0.01"
                        placeholder="Leave empty to keep current"
                        value={bulkEditData.compare_price}
                        onChange={(e) => setBulkEditData(prev => ({ ...prev, compare_price: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bulk-inventory">Inventory Quantity</Label>
                      <Input
                        id="bulk-inventory"
                        type="number"
                        placeholder="Leave empty to keep current"
                        value={bulkEditData.inventory_quantity}
                        onChange={(e) => setBulkEditData(prev => ({ ...prev, inventory_quantity: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bulk-active">Status</Label>
                      <Select
                        value={bulkEditData.is_active}
                        onValueChange={(value) => setBulkEditData(prev => ({ ...prev, is_active: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Keep current status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg">
                          <SelectItem value="">Keep current</SelectItem>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowBulkEdit(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleBulkOperation('bulk_update')}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Update Products
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                onClick={() => handleBulkOperation('bulk_activate')}
                disabled={loading}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Activate All
              </Button>

              <Button
                variant="outline"
                onClick={() => handleBulkOperation('bulk_deactivate')}
                disabled={loading}
              >
                <Square className="h-4 w-4 mr-2" />
                Deactivate All
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {selectedProducts.size} selected product(s).
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleBulkOperation('bulk_delete')}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Products
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Products ({products.length})
            </div>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading products...
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allCurrentPageSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all products"
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.has(product.id)}
                          onCheckedChange={(checked) =>
                            handleSelectProduct(product.id, checked as boolean)
                          }
                          aria-label={`Select ${product.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {product.images && product.images.length > 0 && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.sku}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          ₹{product.price}
                          {product.compare_price && product.compare_price > product.price && (
                            <div className="text-xs text-gray-500 line-through">
                              ₹{product.compare_price}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.inventory_quantity > 0 ? "default" : "destructive"}>
                          {product.inventory_quantity} units
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.categories?.name || "Uncategorized"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, products.length)} of {products.length} products
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}