"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Package,
  ArrowRight,
  Settings,
  Eye,
  Tag,
  Archive,
  Star,
  Globe
} from 'lucide-react';

// Complete category structure mapping - exactly as specified in requirements
const CATEGORY_HIERARCHY = {
  'new-arrivals': {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Featured new products section',
    icon: '✨',
    subcategories: {}
  },
  'all-pottery': {
    name: 'All Pottery',
    slug: 'all-pottery',
    description: 'Complete product catalog',
    icon: '🏺',
    subcategories: {}
  },
  'traditional-pottery': {
    name: 'Traditional Pottery',
    slug: 'traditional-pottery',
    description: 'Authentic clay cooking vessels and traditional pottery',
    icon: '🏺',
    subcategories: {
      'cooking-pots': { name: 'Cooking Pots', description: 'Authentic clay cooking vessels' },
      'water-storage-vessels': { name: 'Water Storage Vessels', description: 'Cool and pure water storage' },
      'clay-ovens': { name: 'Clay Ovens', description: 'Traditional tandoor and baking ovens' },
      'storage-containers': { name: 'Storage Containers', description: 'Keep food fresh naturally' },
      'pressure-cookers': { name: 'Pressure Cookers', description: 'Clay pressure cooking pots' },
      'tandoor-accessories': { name: 'Tandoor Accessories', description: 'Complete tandoor setup items' },
      'traditional-griddles': { name: 'Traditional Griddles', description: 'Clay tawa and cooking surfaces' },
      'fermentation-pots': { name: 'Fermentation Pots', description: 'For traditional food preparation' }
    }
  },
  'decorative-items': {
    name: 'Decorative Items',
    slug: 'decorative-items',
    description: 'Beautiful home and garden decor pieces',
    icon: '🎨',
    subcategories: {
      'vases-planters': { name: 'Vases & Planters', description: 'Beautiful home and garden decor' },
      'wall-art': { name: 'Wall Art', description: 'Handcrafted terracotta wall pieces' },
      'garden-decor': { name: 'Garden Decor', description: 'Transform your outdoor space' },
      'figurines': { name: 'Figurines', description: 'Traditional and modern sculptures' },
      'table-centerpieces': { name: 'Table Centerpieces', description: 'Elegant dining table decor' },
      'wind-chimes': { name: 'Wind Chimes', description: 'Musical terracotta ornaments' },
      'hanging-planters': { name: 'Hanging Planters', description: 'Suspended garden pottery' },
      'decorative-lamps': { name: 'Decorative Lamps', description: 'Traditional clay lighting' }
    }
  },
  'serving-ware': {
    name: 'Serving Ware',
    slug: 'serving-ware',
    description: 'Elegant dining essentials and serving solutions',
    icon: '🍽️',
    subcategories: {
      'bowls-plates': { name: 'Bowls & Plates', description: 'Elegant dining essentials' },
      'cups-mugs': { name: 'Cups & Mugs', description: 'Perfect for beverages' },
      'serving-sets': { name: 'Serving Sets', description: 'Complete serving solutions' },
      'dinnerware': { name: 'Dinnerware', description: 'Complete dining sets' },
      'tea-sets': { name: 'Tea Sets', description: 'Traditional clay tea service' },
      'wine-bar-accessories': { name: 'Wine & Bar Accessories', description: 'Clay wine coolers and glasses' },
      'spice-containers': { name: 'Spice Containers', description: 'Keep spices fresh and flavorful' },
      'butter-churns': { name: 'Butter Churns', description: 'Traditional dairy equipment' }
    }
  },
  'collections': {
    name: 'Collections',
    slug: 'collections',
    description: 'Curated pottery collections for special occasions',
    icon: '✨',
    subcategories: {
      'heritage-collection': { name: 'Heritage Collection', description: 'Traditional designs from 1952' },
      'modern-fusion': { name: 'Modern Fusion', description: 'Contemporary meets traditional' },
      'wedding-collection': { name: 'Wedding Collection', description: 'Special occasion pottery' },
      'artisan-specials': { name: 'Artisan Specials', description: 'Exclusive handcrafted pieces' }
    }
  },
  'b2b-portal': {
    name: 'B2B Portal',
    slug: 'b2b-portal',
    description: 'Wholesale business section',
    icon: '🏢',
    subcategories: {}
  }
};

const AdminCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    is_active: true,
    sort_order: 0,
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products?limit=100');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Handle category creation/update
  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setLoading(true);
    try {
      const categoryData = {
        ...categoryForm,
        slug: generateSlug(categoryForm.name),
        meta_title: categoryForm.meta_title || categoryForm.name,
        meta_description: categoryForm.meta_description || categoryForm.description
      };

      const response = await fetch('/api/admin/categories', {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory ? { ...categoryData, id: editingCategory.id } : categoryData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        fetchCategories();
        resetForm();
        setShowCreateCategory(false);
        setShowEditCategory(false);
      } else {
        toast.error(result.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  // Initialize categories from predefined structure
  const initializeCategories = async () => {
    setLoading(true);
    try {
      for (const [slug, categoryData] of Object.entries(CATEGORY_HIERARCHY)) {
        // Create main category
        const mainCategoryResponse = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: categoryData.name,
            slug: categoryData.slug,
            description: categoryData.description,
            is_active: true,
            sort_order: 0
          })
        });

        if (mainCategoryResponse.ok) {
          const mainCategory = await mainCategoryResponse.json();

          // Create subcategories
          for (const [subSlug, subData] of Object.entries(categoryData.subcategories)) {
            await fetch('/api/admin/categories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: subData.name,
                slug: subSlug,
                description: subData.description,
                parent_id: mainCategory.category?.id,
                is_active: true,
                sort_order: 0
              })
            });
          }
        }
      }

      toast.success('Categories initialized successfully!');
      fetchCategories();
    } catch (error) {
      console.error('Error initializing categories:', error);
      toast.error('Failed to initialize categories');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      parent_id: '',
      is_active: true,
      sort_order: 0,
      meta_title: '',
      meta_description: ''
    });
    setEditingCategory(null);
  };

  const handleEditCategory = (category) => {
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || '',
      is_active: category.is_active,
      sort_order: category.sort_order || 0,
      meta_title: category.meta_title || '',
      meta_description: category.meta_description || ''
    });
    setEditingCategory(category);
    setShowEditCategory(true);
  };

  // Get products for a specific category
  const getProductsForCategory = (categoryId) => {
    return products.filter(product => product.category_id === categoryId);
  };

  // Get category tree structure
  const getCategoryTree = () => {
    const tree = [];
    const parentCategories = categories.filter(cat => !cat.parent_id);

    parentCategories.forEach(parent => {
      const children = categories.filter(cat => cat.parent_id === parent.id);
      tree.push({
        ...parent,
        children: children
      });
    });

    return tree;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-orange-800">Category Management</h2>
          <p className="text-gray-600">Organize your product catalog with hierarchical categories</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={initializeCategories}
            disabled={loading}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Initialize Structure
          </Button>
          <Button
            onClick={() => setShowCreateCategory(true)}
            className="bg-orange-600 hover:bg-orange-700 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(CATEGORY_HIERARCHY).map(([slug, category]) => {
          const categoryProducts = products.filter(p => {
            const prodCategory = categories.find(c => c.id === p.category_id);
            return prodCategory?.slug === slug ||
                   categories.find(c => c.parent_id === categories.find(parent => parent.slug === slug)?.id && c.id === p.category_id);
          });

          return (
            <Card key={slug} className="border-orange-200 hover:border-orange-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl">{category.icon}</div>
                  <Badge variant="outline">
                    {categoryProducts.length} products
                  </Badge>
                </div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(`/category/${slug}`, '_blank')}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      const existingCategory = categories.find(c => c.slug === slug);
                      if (existingCategory) {
                        handleEditCategory(existingCategory);
                      }
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Category Tree */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Category Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getCategoryTree().map(category => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-orange-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getProductsForCategory(category.id).length} products
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Subcategories */}
                {category.children && category.children.length > 0 && (
                  <div className="ml-6 space-y-2">
                    {category.children.map(child => (
                      <div key={child.id} className="flex items-center justify-between p-2 bg-orange-50 rounded border-l-2 border-orange-200">
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-orange-500" />
                          <div>
                            <span className="font-medium text-gray-800">{child.name}</span>
                            <p className="text-xs text-gray-600">{child.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getProductsForCategory(child.id).length}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(child)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {getCategoryTree().length === 0 && (
            <div className="text-center py-8">
              <FolderTree className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No categories found. Initialize the category structure to get started.</p>
              <Button
                onClick={initializeCategories}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Initialize Categories
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Category Modal */}
      <Dialog open={showCreateCategory} onOpenChange={setShowCreateCategory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="seo">SEO Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({
                      ...prev,
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    }))}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="category-slug"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Category description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parent">Parent Category</Label>
                  <Select
                    value={categoryForm.parent_id}
                    onValueChange={(value) => setCategoryForm(prev => ({ ...prev, parent_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Parent (Top Level)</SelectItem>
                      {categories.filter(cat => !cat.parent_id).map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={categoryForm.sort_order}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div>
                <Label htmlFor="meta_title">SEO Title</Label>
                <Input
                  id="meta_title"
                  value={categoryForm.meta_title}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO-friendly title"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">{categoryForm.meta_title.length}/60 characters</p>
              </div>

              <div>
                <Label htmlFor="meta_description">SEO Description</Label>
                <Textarea
                  id="meta_description"
                  value={categoryForm.meta_description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO meta description"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">{categoryForm.meta_description.length}/160 characters</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateCategory(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {loading ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={showEditCategory} onOpenChange={setShowEditCategory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category: {editingCategory?.name}</DialogTitle>
          </DialogHeader>

          {/* Same form structure as create, but with edit data */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_name">Category Name *</Label>
                <Input
                  id="edit_name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="edit_slug">URL Slug</Label>
                <Input
                  id="edit_slug"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="category-slug"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Category description"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditCategory(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {loading ? 'Updating...' : 'Update Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategoryManager;