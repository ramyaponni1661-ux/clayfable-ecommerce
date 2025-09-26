"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ProductForm } from '@/components/admin/product-form';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Upload,
  Download,
  Zap,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  compare_price?: number;
  inventory_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  category_id?: string;
  images?: string[] | string;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface EnhancedProductsTabProps {
  products?: Product[];
  categories?: Category[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  isLoadingProducts: boolean;
  fetchProducts: () => void;
  fetchDashboard: () => void;
  handleDeleteProduct: (id: string, name: string) => void;
}

// This component enhances your existing Products tab
const EnhancedProductsTab: React.FC<EnhancedProductsTabProps> = ({
  // Props from your existing admin dashboard
  products = [],
  categories = [],
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  isLoadingProducts,
  fetchProducts,
  fetchDashboard,
  handleDeleteProduct
}) => {
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  // Quick create form state
  const [quickCreateForm, setQuickCreateForm] = useState({
    name: '',
    sku: '',
    price: '',
    inventory_quantity: '',
    category_id: ''
  });

  // Filter products based on search and filters (your existing logic)
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
  });

  // Handle full product creation with your existing ProductForm
  const handleSaveProduct = async (productData: any) => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/admin/products', {
        method: selectedProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedProduct ? { ...productData, id: selectedProduct.id } : productData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(selectedProduct ? 'Product updated successfully!' : 'Product created successfully!');
        setShowCreateProductModal(false);
        setSelectedProduct(null);
        fetchProducts();
        fetchDashboard();
      } else {
        toast.error(result.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle quick product creation
  const handleQuickCreate = async () => {
    if (!quickCreateForm.name || !quickCreateForm.sku || !quickCreateForm.price) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quickCreateForm,
          price: parseFloat(quickCreateForm.price),
          inventory_quantity: parseInt(quickCreateForm.inventory_quantity) || 0,
          is_active: true,
          track_inventory: true
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Product created successfully!');
        setShowQuickCreate(false);
        setQuickCreateForm({ name: '', sku: '', price: '', inventory_quantity: '', category_id: '' });
        fetchProducts();
        fetchDashboard();
      } else {
        toast.error(result.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowCreateProductModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Multiple Create Options */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-orange-800">Product Management</h2>
          <p className="text-gray-600">Manage your terracotta product catalog</p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline" className="gap-1">
              <Package className="h-3 w-3" />
              {products.length} Products
            </Badge>
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              {products.filter(p => p.is_active).length} Active
            </Badge>
            <Badge variant="outline" className="gap-1">
              <AlertCircle className="h-3 w-3 text-red-600" />
              {products.filter(p => p.inventory_quantity <= 10).length} Low Stock
            </Badge>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Quick Create Button */}
          <Dialog open={showQuickCreate} onOpenChange={setShowQuickCreate}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Zap className="h-4 w-4" />
                Quick Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Quick Add Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Product Name *</label>
                  <Input
                    value={quickCreateForm.name}
                    onChange={(e) => setQuickCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">SKU *</label>
                    <Input
                      value={quickCreateForm.sku}
                      onChange={(e) => setQuickCreateForm(prev => ({ ...prev, sku: e.target.value }))}
                      placeholder="SKU"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Price (₹) *</label>
                    <Input
                      type="number"
                      value={quickCreateForm.price}
                      onChange={(e) => setQuickCreateForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Stock</label>
                    <Input
                      type="number"
                      value={quickCreateForm.inventory_quantity}
                      onChange={(e) => setQuickCreateForm(prev => ({ ...prev, inventory_quantity: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={quickCreateForm.category_id}
                      onValueChange={(value) => setQuickCreateForm(prev => ({ ...prev, category_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
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
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowQuickCreate(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleQuickCreate}
                    disabled={isCreating}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Full Create Button */}
          <Button
            className="bg-orange-600 hover:bg-orange-700 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl gap-2"
            onClick={() => {
              setSelectedProduct(null);
              setShowCreateProductModal(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card className="border-orange-200">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-orange-200 pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 border-orange-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48 border-orange-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            {/* Additional Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Products List */}
      <Card className="border-orange-200">
        <CardContent className="pt-6">
          {isLoadingProducts ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <div className="text-sm text-gray-600">Loading products...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria or add a new product.</p>
              <Button
                className="bg-orange-600 hover:bg-orange-700 gap-2"
                onClick={() => {
                  setSelectedProduct(null);
                  setShowCreateProductModal(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-lg hover:from-orange-100 hover:to-orange-50 hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-orange-300 relative overflow-hidden">

                  {/* Product Info */}
                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="w-16 h-16 bg-orange-200 rounded-lg flex items-center justify-center group-hover:bg-orange-300 group-hover:scale-105 transition-all duration-200">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={Array.isArray(product.images) ? product.images[0] : product.images}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-orange-600 group-hover:text-orange-700" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 group-hover:text-orange-800 transition-colors">
                          {product.name}
                        </p>
                        {product.is_featured && (
                          <Badge variant="secondary" className="gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        SKU: {product.sku}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.categories?.name || 'No category'}
                      </p>
                    </div>
                  </div>

                  {/* Product Stats & Actions */}
                  <div className="flex items-center space-x-6 relative z-10">
                    <div className="text-right">
                      <p className="font-medium text-gray-900 group-hover:text-orange-800 transition-colors">
                        ₹{product.price}
                      </p>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        Stock: {product.inventory_quantity}
                      </p>
                      {product.compare_price && product.compare_price > product.price && (
                        <p className="text-xs text-green-600">
                          {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% off
                        </p>
                      )}
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant={
                        product.is_active
                          ? product.inventory_quantity > 10
                            ? "default"
                            : product.inventory_quantity > 0
                              ? "secondary"
                              : "destructive"
                          : "outline"
                      }
                      className="group-hover:shadow-md transition-shadow"
                    >
                      {product.is_active
                        ? product.inventory_quantity > 10
                          ? "Active"
                          : product.inventory_quantity > 0
                            ? "Low Stock"
                            : "Out of Stock"
                        : "Inactive"
                      }
                    </Badge>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-4 group-hover:translate-x-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Viewing product: ${product.name}`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProduct(product);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id, product.name);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Product Creation/Edit Modal using your existing ProductForm */}
      <Dialog open={showCreateProductModal} onOpenChange={setShowCreateProductModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? `Edit ${selectedProduct.name}` : 'Create New Product'}
            </DialogTitle>
          </DialogHeader>

          <ProductForm
            product={selectedProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowCreateProductModal(false);
              setSelectedProduct(null);
            }}
          />

          {isCreating && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                <span className="text-lg font-medium">
                  {selectedProduct ? 'Updating product...' : 'Creating product...'}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedProductsTab;