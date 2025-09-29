"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Users,
  Package,
  AlertCircle,
  Loader2,
  Search,
  RefreshCw,
  Eye,
  ShoppingBag
} from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  images?: string[]
  inventory_quantity: number
  is_active: boolean
}

interface User {
  id: string
  email: string
  full_name: string
  cart_summary?: {
    item_count: number
    total_value: number
  }
}

interface CartItem {
  product_id: string
  variant_id?: string | null
  quantity: number
}

interface BulkCartOperationsProps {
  selectedProducts: Product[]
}

export default function BulkCartOperations({ selectedProducts }: BulkCartOperationsProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [showAddToCart, setShowAddToCart] = useState(false)
  const [cartItems, setCartItems] = useState<{ [key: string]: CartItem }>({})
  const [showUserCarts, setShowUserCarts] = useState(false)
  const [selectedUserForCart, setSelectedUserForCart] = useState("")
  const [userCartData, setUserCartData] = useState(null)

  // Initialize cart items when selectedProducts change
  useEffect(() => {
    const newCartItems: { [key: string]: CartItem } = {}
    selectedProducts.forEach(product => {
      newCartItems[product.id] = {
        product_id: product.id,
        variant_id: null,
        quantity: 1
      }
    })
    setCartItems(newCartItems)
  }, [selectedProducts])

  // Load users
  useEffect(() => {
    fetchUsers()
  }, [userSearch])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: '50',
        include_cart: 'true'
      })

      if (userSearch) {
        params.append('search', userSearch)
      }

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.users || [])
      } else {
        toast.error('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserCart = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/cart/bulk?user_id=${userId}`)
      const data = await response.json()

      if (data.success) {
        setUserCartData(data.cart)
      } else {
        toast.error('Failed to fetch user cart')
      }
    } catch (error) {
      console.error('Error fetching user cart:', error)
      toast.error('Failed to fetch user cart')
    }
  }

  const handleUserSelection = (userId: string, checked: boolean) => {
    const newSelection = new Set(selectedUsers)
    if (checked) {
      newSelection.add(userId)
    } else {
      newSelection.delete(userId)
    }
    setSelectedUsers(newSelection)
  }

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(users.map(user => user.id)))
    } else {
      setSelectedUsers(new Set())
    }
  }

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      const newCartItems = { ...cartItems }
      delete newCartItems[productId]
      setCartItems(newCartItems)
    } else {
      setCartItems(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: Math.max(1, quantity)
        }
      }))
    }
  }

  const handleBulkAddToCart = async () => {
    if (selectedUsers.size === 0) {
      toast.error('Please select at least one user')
      return
    }

    if (Object.keys(cartItems).length === 0) {
      toast.error('No products to add to cart')
      return
    }

    setLoading(true)
    try {
      const productItems = Object.values(cartItems).filter(item => item.quantity > 0)

      const response = await fetch('/api/admin/cart/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'bulk_add_to_cart',
          user_ids: Array.from(selectedUsers),
          product_items: productItems
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Products added to ${selectedUsers.size} user cart(s) successfully`)

        if (data.results.failed_operations > 0) {
          toast.warning(`${data.results.failed_operations} operations failed`)
        }

        setShowAddToCart(false)
        setSelectedUsers(new Set())
        fetchUsers() // Refresh to show updated cart summaries
      } else {
        toast.error(data.error || 'Failed to add products to carts')
      }
    } catch (error) {
      console.error('Error adding products to carts:', error)
      toast.error('Failed to add products to carts')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkClearCart = async () => {
    if (selectedUsers.size === 0) {
      toast.error('Please select at least one user')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/cart/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'bulk_clear_cart',
          user_ids: Array.from(selectedUsers),
          product_items: []
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Cleared carts for ${selectedUsers.size} user(s) successfully`)
        setSelectedUsers(new Set())
        fetchUsers() // Refresh to show updated cart summaries
      } else {
        toast.error(data.error || 'Failed to clear carts')
      }
    } catch (error) {
      console.error('Error clearing carts:', error)
      toast.error('Failed to clear carts')
    } finally {
      setLoading(false)
    }
  }

  const totalCartValue = Object.entries(cartItems).reduce((total, [productId, item]) => {
    const product = selectedProducts.find(p => p.id === productId)
    return total + (product ? product.price * item.quantity : 0)
  }, 0)

  const totalCartItems = Object.values(cartItems).reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bulk Cart Operations</h2>
          <p className="text-gray-600">
            {selectedProducts.length} product(s) selected, {selectedUsers.size} user(s) selected
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Selected Products Summary */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Selected Products ({selectedProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-sm text-gray-500">₹{product.price}</div>
                    {cartItems[product.id] && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartItemQuantity(product.id, cartItems[product.id].quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {cartItems[product.id].quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartItemQuantity(product.id, cartItems[product.id].quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {selectedProducts.length > 6 && (
                <div className="flex items-center justify-center p-3 border rounded-lg text-gray-500">
                  +{selectedProducts.length - 6} more products
                </div>
              )}
            </div>
            {selectedProducts.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Total Items: {totalCartItems}</span>
                  <span>Total Value: ₹{totalCartValue.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Select Users
            </div>
            <div className="text-sm text-gray-600">
              {users.length} users found
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => handleSelectAllUsers(true)} variant="outline" size="sm">
              Select All
            </Button>
            <Button onClick={() => handleSelectAllUsers(false)} variant="outline" size="sm">
              Clear All
            </Button>
          </div>

          {/* Users List */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading users...
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Cart</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        {user.cart_summary ? (
                          <div className="text-sm">
                            <div>{user.cart_summary.item_count} items</div>
                            <div className="text-gray-500">₹{user.cart_summary.total_value.toFixed(2)}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Empty</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUserForCart(user.id)
                                fetchUserCart(user.id)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Cart for {user.full_name}</DialogTitle>
                              <DialogDescription>{user.email}</DialogDescription>
                            </DialogHeader>
                            <div className="max-h-96 overflow-y-auto">
                              {userCartData ? (
                                <div className="space-y-4">
                                  {userCartData.items && userCartData.items.length > 0 ? (
                                    <>
                                      {userCartData.items.map((item: any, index: number) => (
                                        <div key={index} className="flex items-center space-x-4 p-3 border rounded">
                                          {item.products.images && item.products.images.length > 0 && (
                                            <img
                                              src={item.products.images[0]}
                                              alt={item.products.name}
                                              className="w-12 h-12 rounded object-cover"
                                            />
                                          )}
                                          <div className="flex-1">
                                            <div className="font-medium">{item.products.name}</div>
                                            <div className="text-sm text-gray-500">
                                              Qty: {item.quantity} × ₹{item.products.price}
                                            </div>
                                          </div>
                                          <div className="font-medium">
                                            ₹{(item.products.price * item.quantity).toFixed(2)}
                                          </div>
                                        </div>
                                      ))}
                                      <div className="border-t pt-4">
                                        <div className="flex justify-between text-sm">
                                          <span>Subtotal:</span>
                                          <span>₹{userCartData.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span>Tax:</span>
                                          <span>₹{userCartData.tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span>Shipping:</span>
                                          <span>₹{userCartData.shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                          <span>Total:</span>
                                          <span>₹{userCartData.total.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <p className="text-center text-gray-500 py-8">Cart is empty</p>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center justify-center py-8">
                                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                  Loading cart...
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      {(selectedProducts.length > 0 || selectedUsers.size > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Bulk Cart Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Dialog open={showAddToCart} onOpenChange={setShowAddToCart}>
                <DialogTrigger asChild>
                  <Button
                    disabled={selectedProducts.length === 0 || selectedUsers.size === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart ({selectedUsers.size} users)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Bulk Add to Cart</DialogTitle>
                    <DialogDescription>
                      Add {selectedProducts.length} product(s) to {selectedUsers.size} user cart(s).
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="text-sm font-medium">Summary:</div>
                      <div className="text-sm">Products: {selectedProducts.length}</div>
                      <div className="text-sm">Total Items: {totalCartItems}</div>
                      <div className="text-sm">Value per User: ₹{totalCartValue.toFixed(2)}</div>
                      <div className="text-sm font-bold">Total Value: ₹{(totalCartValue * selectedUsers.size).toFixed(2)}</div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddToCart(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleBulkAddToCart}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Add to Carts
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={selectedUsers.size === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Carts ({selectedUsers.size} users)
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear User Carts?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear all items from {selectedUsers.size} user cart(s).
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkClearCart}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear Carts
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}