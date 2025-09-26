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
  Globe,
  AlertCircle,
  CheckCircle,
  Loader2,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  Zap,
  FileText,
  Image,
  Link,
  Hash,
  Calendar,
  Activity,
  X,
  Save,
  Upload
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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [categoryErrors, setCategoryErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [categoryStats, setCategoryStats] = useState({});

  // Enhanced category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    is_active: true,
    is_featured: false,
    sort_order: 0,
    meta_title: '',
    meta_description: '',
    image_url: '',
    icon: '',
    color_theme: '#f97316', // Orange default
    tags: [],
    featured_products: []
  });

  const steps = [
    {
      id: 'basic',
      title: 'Basic Info',
      icon: Package,
      description: 'Category name, description, and hierarchy'
    },
    {
      id: 'design',
      title: 'Design & Branding',
      icon: Image,
      description: 'Visual elements and theme customization'
    },
    {
      id: 'seo',
      title: 'SEO & Marketing',
      icon: TrendingUp,
      description: 'Search optimization and promotional settings'
    }
  ];

  // Real-time validation
  const validateField = (name, value) => {
    const newErrors = { ...categoryErrors };

    switch (name) {
      case 'name':
        if (!value || value.length < 2) {
          newErrors.name = 'Category name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'slug':
        if (!value || value.length < 2) {
          newErrors.slug = 'URL slug is required';
        } else if (!/^[a-z0-9-]+$/.test(value)) {
          newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
        } else {
          delete newErrors.slug;
        }
        break;
      case 'description':
        if (value && value.length > 500) {
          newErrors.description = 'Description must be less than 500 characters';
        } else {
          delete newErrors.description;
        }
        break;
    }

    setCategoryErrors(newErrors);
  };

  const handleInputChange = (name, value) => {
    // Handle parent_id special case
    if (name === 'parent_id' && value === 'none') {
      value = '';
    }

    setCategoryForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value);

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = generateSlug(value);
      setCategoryForm(prev => ({ ...prev, slug }));
      validateField('slug', slug);
    }
  };

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


  const handleEditCategory = (category) => {
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || '',
      is_active: category.is_active,
      is_featured: category.is_featured || false,
      sort_order: category.sort_order || 0,
      meta_title: category.meta_title || '',
      meta_description: category.meta_description || '',
      image_url: category.image_url || '',
      icon: category.icon || '',
      color_theme: category.color_theme || '#f97316',
      tags: category.tags || [],
      featured_products: category.featured_products || []
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

  // Step completion validation
  const isStepComplete = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Basic Info
        return categoryForm.name && categoryForm.slug && !categoryErrors.name && !categoryErrors.slug;
      case 1: // Design
        return true; // Optional
      case 2: // SEO
        return true; // Optional
      default:
        return false;
    }
  };

  // Enhanced save function
  const handleSaveCategory = async () => {
    // Validate required fields
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (Object.keys(categoryErrors).length > 0) {
      toast.error('Please fix validation errors');
      return;
    }

    setIsCreating(true);
    try {
      const categoryData = {
        ...categoryForm,
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
        setActiveStep(0);
      } else {
        toast.error(result.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setIsCreating(false);
    }
  };

  // Enhanced reset function
  const resetForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      parent_id: '',
      is_active: true,
      is_featured: false,
      sort_order: 0,
      meta_title: '',
      meta_description: '',
      image_url: '',
      icon: '',
      color_theme: '#f97316',
      tags: [],
      featured_products: []
    });
    setEditingCategory(null);
    setCategoryErrors({});
    setActiveStep(0);
    setImageFile(null);
    setPreviewImage('');
  };

  // Step content rendering
  const renderStepContent = () => {
    switch (activeStep) {
      case 0: return renderBasicInfo();
      case 1: return renderDesignBranding();
      case 2: return renderSEOMarketing();
      default: return renderBasicInfo();
    }
  };

  // Basic Info Step
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
            Category Name *
          </Label>
          <Input
            id="name"
            value={categoryForm.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter category name"
            className={`h-11 ${categoryErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'} bg-white shadow-sm`}
          />
          {categoryErrors.name && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {categoryErrors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="text-sm font-semibold text-gray-700">
            URL Slug *
          </Label>
          <Input
            id="slug"
            value={categoryForm.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="category-slug"
            className={`h-11 ${categoryErrors.slug ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'} bg-white shadow-sm`}
          />
          {categoryErrors.slug && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {categoryErrors.slug}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
          Description
        </Label>
        <Textarea
          id="description"
          value={categoryForm.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe this category and its purpose"
          className="min-h-[120px] border-gray-300 focus:border-orange-500 bg-white shadow-sm resize-none"
          rows={5}
        />
        {categoryErrors.description && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {categoryErrors.description}
          </p>
        )}
        <p className="text-xs text-gray-500">{categoryForm.description.length}/500 characters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="parent_id" className="text-sm font-semibold text-gray-700">
            Parent Category
          </Label>
          <Select
            value={categoryForm.parent_id || 'none'}
            onValueChange={(value) => handleInputChange('parent_id', value)}
          >
            <SelectTrigger className="h-11 bg-white border-gray-300 focus:border-orange-500 shadow-sm">
              <SelectValue placeholder="Select parent category" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[60]">
              <SelectItem value="none" className="bg-white hover:bg-orange-50 focus:bg-orange-100 text-gray-900 cursor-pointer py-2 px-3 transition-colors duration-200">
                No Parent (Top Level)
              </SelectItem>
              {categories.filter(cat => !cat.parent_id && cat.id !== editingCategory?.id).map(category => (
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_order" className="text-sm font-semibold text-gray-700">
            Sort Order
          </Label>
          <Input
            id="sort_order"
            type="number"
            value={categoryForm.sort_order}
            onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
            placeholder="0"
            className="h-11 border-gray-300 focus:border-orange-500 bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div>
          <Label className="text-sm font-semibold text-gray-700">Active Category</Label>
          <p className="text-sm text-gray-500">Make this category visible to customers</p>
        </div>
        <input
          type="checkbox"
          checked={categoryForm.is_active}
          onChange={(e) => handleInputChange('is_active', e.target.checked)}
          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
        />
      </div>
    </div>
  );

  // Design & Branding Step
  const renderDesignBranding = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Category Icon</Label>
        <div className="grid grid-cols-6 gap-3">
          {['🏺', '🎨', '🍽️', '✨', '🏢', '🌿', '🎭', '🔥', '💎', '🌟', '🎪', '🎨'].map(icon => (
            <button
              key={icon}
              onClick={() => handleInputChange('icon', icon)}
              className={`p-3 text-2xl border-2 rounded-lg transition-all ${
                categoryForm.icon === icon
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Color Theme</Label>
        <div className="grid grid-cols-8 gap-3">
          {[
            '#f97316', '#ef4444', '#10b981', '#3b82f6',
            '#8b5cf6', '#f59e0b', '#06b6d4', '#84cc16'
          ].map(color => (
            <button
              key={color}
              onClick={() => handleInputChange('color_theme', color)}
              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                categoryForm.color_theme === color
                  ? 'border-gray-900 scale-110'
                  : 'border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url" className="text-sm font-semibold text-gray-700">
          Category Image URL
        </Label>
        <Input
          id="image_url"
          value={categoryForm.image_url}
          onChange={(e) => handleInputChange('image_url', e.target.value)}
          placeholder="https://example.com/category-image.jpg"
          className="h-11 border-gray-300 focus:border-orange-500 bg-white shadow-sm"
        />
      </div>

      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div>
          <Label className="text-sm font-semibold text-gray-700">Featured Category</Label>
          <p className="text-sm text-gray-500">Highlight this category on homepage</p>
        </div>
        <input
          type="checkbox"
          checked={categoryForm.is_featured}
          onChange={(e) => handleInputChange('is_featured', e.target.checked)}
          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
        />
      </div>
    </div>
  );

  // SEO & Marketing Step
  const renderSEOMarketing = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="meta_title" className="text-sm font-semibold text-gray-700">
          SEO Title
        </Label>
        <Input
          id="meta_title"
          value={categoryForm.meta_title}
          onChange={(e) => handleInputChange('meta_title', e.target.value)}
          placeholder="SEO-friendly title for search engines"
          className="h-11 border-gray-300 focus:border-orange-500 bg-white shadow-sm"
          maxLength={60}
        />
        <p className="text-xs text-gray-500">{categoryForm.meta_title.length}/60 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_description" className="text-sm font-semibold text-gray-700">
          SEO Description
        </Label>
        <Textarea
          id="meta_description"
          value={categoryForm.meta_description}
          onChange={(e) => handleInputChange('meta_description', e.target.value)}
          placeholder="Meta description for search engines and social media"
          className="min-h-[100px] border-gray-300 focus:border-orange-500 bg-white shadow-sm resize-none"
          rows={4}
          maxLength={160}
        />
        <p className="text-xs text-gray-500">{categoryForm.meta_description.length}/160 characters</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">SEO Preview</h4>
        <div className="space-y-1">
          <p className="text-blue-600 text-sm font-medium">
            {categoryForm.meta_title || categoryForm.name || 'Category Title'}
          </p>
          <p className="text-green-600 text-xs">
            yoursite.com/category/{categoryForm.slug || 'category-slug'}
          </p>
          <p className="text-gray-600 text-sm">
            {categoryForm.meta_description || categoryForm.description || 'Category description will appear here...'}
          </p>
        </div>
      </div>
    </div>
  );

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

      {/* Modern Category Creation/Edit Modal */}
      {(showCreateCategory || showEditCategory) && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 p-6 z-50">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCreateCategory(false);
                    setShowEditCategory(false);
                    resetForm();
                    setActiveStep(0);
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back to Categories
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h1>
              <p className="text-gray-600 mt-2">
                {editingCategory ? 'Update category information and settings' : 'Add a new category to organize your products'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Step Navigation */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Setup Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const isComplete = index < activeStep || (index === activeStep && isStepComplete(index));
                      const isActive = activeStep === index;

                      return (
                        <button
                          key={step.id}
                          onClick={() => setActiveStep(index)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            isActive
                              ? 'bg-orange-100 border-orange-300 border'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isComplete
                                ? 'bg-green-500 text-white'
                                : isActive
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {isComplete ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Icon className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p className={`font-medium text-sm ${
                                isActive ? 'text-orange-900' : 'text-gray-900'
                              }`}>
                                {step.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card className="min-h-[600px] border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {React.createElement(steps[activeStep].icon, { className: "w-5 h-5" })}
                      {steps[activeStep].title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderStepContent()}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    Previous
                  </Button>

                  <div className="flex gap-3">
                    {activeStep < steps.length - 1 ? (
                      <Button
                        onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSaveCategory}
                        disabled={isCreating}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {editingCategory ? 'Update Category' : 'Create Category'}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCategoryManager;