"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ModernProductForm } from '@/components/admin/ModernProductForm';
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
  Loader2,
  Tag,
  DollarSign,
  BarChart3,
  FileText,
  FileSpreadsheet,
  ImageIcon,
  X
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
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Quick create form state
  const [quickCreateForm, setQuickCreateForm] = useState({
    name: '',
    sku: '',
    price: '',
    inventory_quantity: '',
    category_id: ''
  });

  const [quickCreateErrors, setQuickCreateErrors] = useState<Record<string, string>>({});

  // Export form state
  const [exportOptions, setExportOptions] = useState({
    format: 'csv' as 'csv' | 'xlsx',
    includeImages: false,
    includeInactive: false,
    fields: ['name', 'sku', 'price', 'inventory_quantity', 'is_active']
  });

  // Import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

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

  // Quick Add validation
  const validateQuickCreateField = (name: string, value: any) => {
    const newErrors = { ...quickCreateErrors };

    switch (name) {
      case 'name':
        if (!value || value.length < 3) {
          newErrors.name = 'Product name must be at least 3 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'sku':
        if (!value || value.length < 2) {
          newErrors.sku = 'SKU is required and must be at least 2 characters';
        } else {
          delete newErrors.sku;
        }
        break;
      case 'price':
        if (!value || parseFloat(value) <= 0) {
          newErrors.price = 'Price must be greater than 0';
        } else {
          delete newErrors.price;
        }
        break;
    }

    setQuickCreateErrors(newErrors);
  };

  const handleQuickCreateChange = (name: string, value: any) => {
    setQuickCreateForm(prev => ({ ...prev, [name]: value }));
    validateQuickCreateField(name, value);
  };

  // Handle quick product creation
  const handleQuickCreate = async () => {
    // Validate required fields
    const requiredFields = ['name', 'sku', 'price'];
    const newErrors: Record<string, string> = {};

    requiredFields.forEach(field => {
      if (!quickCreateForm[field as keyof typeof quickCreateForm]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setQuickCreateErrors(newErrors);
      toast.error('Please fill in all required fields');
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
        setQuickCreateErrors({});
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

  // Export functionality
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/admin/products/bulk-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportOptions)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') ||
                     `products-export-${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success(`Products exported successfully as ${exportOptions.format.toUpperCase()}`);
        setShowExportDialog(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export products');
    } finally {
      setIsExporting(false);
    }
  };

  // Import functionality
  const handleImport = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const response = await fetch('/api/admin/products/bulk-import', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setImportResult(result);
        toast.success(`Import completed: ${result.success} products imported, ${result.failed} failed`);
        if (result.success > 0) {
          fetchProducts();
          fetchDashboard();
        }
      } else {
        toast.error(result.error || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import products');
    } finally {
      setIsImporting(false);
    }
  };

  // File drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        setImportFile(file);
      } else {
        toast.error('Please select a CSV file');
      }
    }
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
          {/* Modern Quick Create Button */}
          {showQuickCreate && (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm" />
          )}
          <Dialog open={showQuickCreate} onOpenChange={setShowQuickCreate}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 shadow-sm hover:shadow-md">
                <Zap className="h-4 w-4" />
                Quick Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-gradient-to-br from-white to-orange-50 border-0 shadow-2xl z-50 rounded-2xl">
              <DialogHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <DialogTitle className="text-2xl font-bold text-gray-900">Quick Add Product</DialogTitle>
                <p className="text-gray-600">Create a product instantly with essential details</p>
              </DialogHeader>

              <div className="space-y-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Package className="w-4 h-4 text-orange-500" />
                    Product Name *
                  </label>
                  <Input
                    value={quickCreateForm.name}
                    onChange={(e) => handleQuickCreateChange('name', e.target.value)}
                    placeholder="Enter a descriptive product name"
                    className={`h-12 border-2 transition-all duration-200 ${
                      quickCreateErrors.name
                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                        : 'border-gray-200 focus:border-orange-500 bg-white hover:border-orange-300'
                    } rounded-xl shadow-sm focus:shadow-md`}
                  />
                  {quickCreateErrors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {quickCreateErrors.name}
                    </p>
                  )}
                </div>

                {/* SKU and Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-orange-500" />
                      SKU *
                    </label>
                    <Input
                      value={quickCreateForm.sku}
                      onChange={(e) => handleQuickCreateChange('sku', e.target.value)}
                      placeholder="Product SKU"
                      className={`h-12 border-2 transition-all duration-200 ${
                        quickCreateErrors.sku
                          ? 'border-red-400 focus:border-red-500 bg-red-50'
                          : 'border-gray-200 focus:border-orange-500 bg-white hover:border-orange-300'
                      } rounded-xl shadow-sm focus:shadow-md`}
                    />
                    {quickCreateErrors.sku && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-4 h-4" />
                        {quickCreateErrors.sku}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      Price (₹) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        value={quickCreateForm.price}
                        onChange={(e) => handleQuickCreateChange('price', e.target.value)}
                        placeholder="0.00"
                        className={`h-12 pl-12 border-2 transition-all duration-200 ${
                          quickCreateErrors.price
                            ? 'border-red-400 focus:border-red-500 bg-red-50'
                            : 'border-gray-200 focus:border-orange-500 bg-white hover:border-orange-300'
                        } rounded-xl shadow-sm focus:shadow-md`}
                      />
                    </div>
                    {quickCreateErrors.price && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-4 h-4" />
                        {quickCreateErrors.price}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stock and Category Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-orange-500" />
                      Initial Stock
                    </label>
                    <Input
                      type="number"
                      value={quickCreateForm.inventory_quantity}
                      onChange={(e) => handleQuickCreateChange('inventory_quantity', e.target.value)}
                      placeholder="0"
                      className="h-12 border-2 border-gray-200 focus:border-orange-500 bg-white hover:border-orange-300 rounded-xl shadow-sm focus:shadow-md transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Filter className="w-4 h-4 text-orange-500" />
                      Category
                    </label>
                    <Select
                      value={quickCreateForm.category_id}
                      onValueChange={(value) => handleQuickCreateChange('category_id', value)}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-orange-500 bg-white hover:border-orange-300 rounded-xl shadow-sm focus:shadow-md transition-all duration-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[60]">
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="bg-white hover:bg-orange-50 focus:bg-orange-100 text-gray-900 cursor-pointer rounded-lg py-2 px-3 transition-colors duration-200"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowQuickCreate(false);
                      setQuickCreateErrors({});
                    }}
                    className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleQuickCreate}
                    disabled={isCreating}
                    className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Create Product
                      </>
                    )}
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
              <SelectTrigger className="w-full sm:w-48 border-orange-200 bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[60]">
                <SelectItem value="all" className="bg-white hover:bg-orange-50 focus:bg-orange-100 text-gray-900 cursor-pointer py-2 px-3 transition-colors duration-200">
                  All Categories
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="bg-white hover:bg-orange-50 focus:bg-orange-100 text-gray-900 cursor-pointer py-2 px-3 transition-colors duration-200"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48 border-orange-200 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[60]">
                <SelectItem value="all" className="bg-white hover:bg-orange-50 focus:bg-orange-100 text-gray-900 cursor-pointer py-2 px-3 transition-colors duration-200">
                  All Status
                </SelectItem>
                <SelectItem value="active" className="bg-white hover:bg-orange-50 focus:bg-orange-100 text-gray-900 cursor-pointer py-2 px-3 transition-colors duration-200">
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="bg-white hover:bg-orange-50 focus:bg-orange-100 text-gray-900 cursor-pointer py-2 px-3 transition-colors duration-200">
                  Inactive
                </SelectItem>
                <SelectItem value="low-stock" className="bg-white hover:bg-orange-50 focus:bg-orange-100 text-gray-900 cursor-pointer py-2 px-3 transition-colors duration-200">
                  Low Stock
                </SelectItem>
                <SelectItem value="out-of-stock" className="bg-white hover:bg-orange-50 focus:bg-orange-100 text-gray-900 cursor-pointer py-2 px-3 transition-colors duration-200">
                  Out of Stock
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Import/Export Action Buttons */}
            <div className="flex gap-2">
              <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 transition-all duration-200">
                    <Upload className="h-4 w-4" />
                    Import
                  </Button>
                </DialogTrigger>
              </Dialog>

              <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DialogTrigger>
              </Dialog>
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

      {/* Modern Product Creation/Edit Modal */}
      {showCreateProductModal && (
        <ModernProductForm
          product={selectedProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowCreateProductModal(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm" />
      )}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl z-50 rounded-2xl">
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Download className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">Export Products</DialogTitle>
            <p className="text-gray-600">Download your product catalog in your preferred format</p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={exportOptions.format === 'csv' ? 'default' : 'outline'}
                  onClick={() => setExportOptions(prev => ({ ...prev, format: 'csv' }))}
                  className={`h-12 ${exportOptions.format === 'csv'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'border-2 border-gray-200 hover:border-blue-300'
                  } transition-all duration-200`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  CSV Format
                </Button>
                <Button
                  variant={exportOptions.format === 'xlsx' ? 'default' : 'outline'}
                  onClick={() => setExportOptions(prev => ({ ...prev, format: 'xlsx' }))}
                  className={`h-12 ${exportOptions.format === 'xlsx'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'border-2 border-gray-200 hover:border-blue-300'
                  } transition-all duration-200`}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel Format
                </Button>
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700">Export Options</label>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Include Images</label>
                    <p className="text-xs text-gray-500">Export product image URLs</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={exportOptions.includeImages}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeImages: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Include Inactive Products</label>
                    <p className="text-xs text-gray-500">Export disabled products as well</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={exportOptions.includeInactive}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeInactive: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Field Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Fields to Export</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto bg-gray-50 p-3 rounded-lg border">
                {[
                  { key: 'name', label: 'Product Name' },
                  { key: 'sku', label: 'SKU' },
                  { key: 'price', label: 'Price' },
                  { key: 'inventory_quantity', label: 'Stock' },
                  { key: 'category_id', label: 'Category' },
                  { key: 'description', label: 'Description' },
                  { key: 'is_active', label: 'Status' },
                  { key: 'is_featured', label: 'Featured' }
                ].map(field => (
                  <div key={field.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={field.key}
                      checked={exportOptions.fields.includes(field.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setExportOptions(prev => ({
                            ...prev,
                            fields: [...prev.fields, field.key]
                          }));
                        } else {
                          setExportOptions(prev => ({
                            ...prev,
                            fields: prev.fields.filter(f => f !== field.key)
                          }));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                    />
                    <label htmlFor={field.key} className="text-sm text-gray-700 cursor-pointer">
                      {field.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => setShowExportDialog(false)}
                className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting || exportOptions.fields.length === 0}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Export {exportOptions.format.toUpperCase()}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm" />
      )}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-green-50 border-0 shadow-2xl z-50 rounded-2xl">
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">Import Products</DialogTitle>
            <p className="text-gray-600">Upload a CSV file to bulk import products</p>
          </DialogHeader>

          <div className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upload CSV File</h3>
                  <p className="text-gray-500">Drag and drop your CSV file here, or click to browse</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) setImportFile(file);
                    };
                    input.click();
                  }}
                  className="border-green-300 text-green-600 hover:bg-green-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose CSV File
                </Button>
              </div>
            </div>

            {/* Selected File Display */}
            {importFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">{importFile.name}</p>
                      <p className="text-sm text-green-600">
                        {(importFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setImportFile(null)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Import Result */}
            {importResult && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Import Results</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">Successfully imported:</span>
                    <span className="font-medium">{importResult.success}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Failed:</span>
                    <span className="font-medium">{importResult.failed}</span>
                  </div>
                  {importResult.duplicates > 0 && (
                    <div className="flex justify-between">
                      <span className="text-yellow-600">Duplicates skipped:</span>
                      <span className="font-medium">{importResult.duplicates}</span>
                    </div>
                  )}
                </div>
                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="mt-3 max-h-32 overflow-y-auto">
                    <p className="text-xs font-medium text-gray-700 mb-1">Errors:</p>
                    {importResult.errors.slice(0, 5).map((error: any, index: number) => (
                      <p key={index} className="text-xs text-red-600">
                        Row {error.row}: {error.error}
                      </p>
                    ))}
                    {importResult.errors.length > 5 && (
                      <p className="text-xs text-gray-500">...and {importResult.errors.length - 5} more errors</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* CSV Format Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">CSV Format Requirements</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>Required columns:</strong> name, sku, price</p>
                <p>• <strong>Optional columns:</strong> description, stock_quantity, category, weight, etc.</p>
                <p>• <strong>Boolean values:</strong> Use "true" or "false" for is_active, is_featured</p>
                <p>• <strong>Maximum:</strong> 1000 products per import</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImportDialog(false);
                  setImportFile(null);
                  setImportResult(null);
                }}
                className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={isImporting || !importFile}
                className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Import Products
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedProductsTab;