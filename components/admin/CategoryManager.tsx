"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Move,
  Eye,
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
  ChevronDown,
  Package,
  Hash,
  Globe,
  Image,
  Loader2,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Copy
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  product_count?: number;
  children?: Category[];
}

interface CategoryManagerProps {
  onCategorySelect?: (category: Category | null) => void;
  selectedCategoryId?: string;
  showProductCounts?: boolean;
  allowMultiSelect?: boolean;
  className?: string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  onCategorySelect,
  selectedCategoryId,
  showProductCounts = true,
  allowMultiSelect = false,
  className = ''
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'grid' | 'list'>('tree');
  const [showInactive, setShowInactive] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    selectedCategoryId ? new Set([selectedCategoryId]) : new Set()
  );

  // Category form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    parent_id: '',
    sort_order: 0,
    is_active: true,
    meta_title: '',
    meta_description: ''
  });

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.categories || []);
        setFilteredCategories(data.categories || []);
      } else {
        toast.error('Failed to load categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  // Create category tree structure
  const buildCategoryTree = (categories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // First pass: create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build tree structure
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;

      if (category.parent_id && categoryMap.has(category.parent_id)) {
        const parent = categoryMap.get(category.parent_id)!;
        parent.children = parent.children || [];
        parent.children.push(categoryWithChildren);
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    // Sort by sort_order
    const sortCategories = (cats: Category[]) => {
      cats.sort((a, b) => a.sort_order - b.sort_order);
      cats.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
          sortCategories(cat.children);
        }
      });
    };

    sortCategories(rootCategories);
    return rootCategories;
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setCategoryForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'name' ? { slug: generateSlug(value) } : {})
    }));
  };

  // Reset form
  const resetForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      parent_id: '',
      sort_order: 0,
      is_active: true,
      meta_title: '',
      meta_description: ''
    });
    setEditingCategory(null);
  };

  // Open create modal
  const openCreateModal = (parentId?: string) => {
    resetForm();
    if (parentId) {
      setCategoryForm(prev => ({ ...prev, parent_id: parentId }));
    }
    setShowCreateModal(true);
  };

  // Open edit modal
  const openEditModal = (category: Category) => {
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image_url: category.image_url || '',
      parent_id: category.parent_id || '',
      sort_order: category.sort_order,
      is_active: category.is_active,
      meta_title: category.meta_title || '',
      meta_description: category.meta_description || ''
    });
    setEditingCategory(category);
    setShowCreateModal(true);
  };

  // Submit category
  const handleSubmit = async () => {
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';

      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingCategory
            ? 'Category updated successfully'
            : 'Category created successfully'
        );
        setShowCreateModal(false);
        resetForm();
        fetchCategories();
      } else {
        toast.error(data.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete category
  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This will also delete all subcategories.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Category deleted successfully');
        fetchCategories();
      } else {
        toast.error(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Toggle category expansion
  const toggleExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Handle category selection
  const handleCategorySelect = (category: Category) => {
    if (allowMultiSelect) {
      setSelectedCategories(prev => {
        const newSet = new Set(prev);
        if (newSet.has(category.id)) {
          newSet.delete(category.id);
        } else {
          newSet.add(category.id);
        }
        return newSet;
      });
    } else {
      setSelectedCategories(new Set([category.id]));
      onCategorySelect?.(category);
    }
  };

  // Filter categories
  useEffect(() => {
    let filtered = categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesActive = showInactive || category.is_active;

      return matchesSearch && matchesActive;
    });

    setFilteredCategories(filtered);
  }, [categories, searchTerm, showInactive]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Render category tree node
  const renderCategoryTreeNode = (category: Category, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategories.has(category.id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id} className="w-full">
        <div
          className={`group flex items-center justify-between p-2 rounded-lg hover:bg-orange-50 transition-all duration-200 cursor-pointer ${
            isSelected ? 'bg-orange-100 border border-orange-300' : 'border border-transparent'
          } ${level > 0 ? 'ml-6' : ''}`}
          style={{ paddingLeft: `${8 + level * 24}px` }}
          onClick={() => handleCategorySelect(category)}
        >
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-orange-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpansion(category.id);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <div className="w-6" />
              )}

              <FolderTree className="h-4 w-4 text-orange-600" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">
                    {category.name}
                  </span>
                  {!category.is_active && (
                    <Badge variant="outline" className="text-xs">Inactive</Badge>
                  )}
                  {showProductCounts && category.product_count !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      {category.product_count}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{category.slug}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                openCreateModal(category.id);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(category);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(category);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category.children!.map(child => renderCategoryTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const categoryTree = buildCategoryTree(filteredCategories);

  return (
    <Card className={`border-orange-200 ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Category Management ({categories.length} categories)
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openCreateModal()}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-orange-200 pl-9"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="show-inactive"
                checked={showInactive}
                onCheckedChange={setShowInactive}
              />
              <Label htmlFor="show-inactive" className="text-sm">Show inactive</Label>
            </div>

            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tree">
                  <div className="flex items-center gap-2">
                    <FolderTree className="h-4 w-4" />
                    Tree
                  </div>
                </SelectItem>
                <SelectItem value="grid">
                  <div className="flex items-center gap-2">
                    <Grid className="h-4 w-4" />
                    Grid
                  </div>
                </SelectItem>
                <SelectItem value="list">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    List
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <div className="text-sm text-gray-600">Loading categories...</div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <FolderTree className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? 'Try adjusting your search terms.'
                : 'Create your first product category to get started.'
              }
            </p>
            <Button
              onClick={() => openCreateModal()}
              className="bg-orange-600 hover:bg-orange-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Category
            </Button>
          </div>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {categoryTree.map(category => renderCategoryTreeNode(category))}
          </div>
        )}
      </CardContent>

      {/* Create/Edit Category Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={categoryForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={categoryForm.slug}
                    onChange={(e) => handleFormChange('slug', e.target.value)}
                    placeholder="auto-generated"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={categoryForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Category description (optional)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parent">Parent Category</Label>
                  <Select
                    value={categoryForm.parent_id}
                    onValueChange={(value) => handleFormChange('parent_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No parent (root category)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No parent (root category)</SelectItem>
                      {categories
                        .filter(cat => editingCategory ? cat.id !== editingCategory.id : true)
                        .map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={categoryForm.sort_order}
                    onChange={(e) => handleFormChange('sort_order', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* SEO Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">SEO Settings</h3>

              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={categoryForm.meta_title}
                  onChange={(e) => handleFormChange('meta_title', e.target.value)}
                  placeholder="Leave empty to use category name"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {categoryForm.meta_title.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={categoryForm.meta_description}
                  onChange={(e) => handleFormChange('meta_description', e.target.value)}
                  placeholder="Brief description for search engines"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {categoryForm.meta_description.length}/160 characters
                </p>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={categoryForm.is_active}
                onCheckedChange={(checked) => handleFormChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active Category</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CategoryManager;