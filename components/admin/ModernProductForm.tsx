"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  X,
  Plus,
  Upload,
  Eye,
  Save,
  ArrowLeft,
  ImageIcon,
  Star,
  Package,
  Tag,
  DollarSign,
  BarChart3,
  Settings,
  Sparkles,
  Camera,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface ModernProductFormProps {
  product?: any
  categories?: any[]
  onSave: (product: any) => void
  onCancel: () => void
}

export function ModernProductForm({ product, categories = [], onSave, onCancel }: ModernProductFormProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    description: product?.description || "",
    short_description: product?.short_description || "",
    price: product?.price || "",
    compare_price: product?.compare_price || "",
    category_id: product?.category_id || "",
    inventory_quantity: product?.inventory_quantity || "",
    low_stock_threshold: product?.low_stock_threshold || "10",
    material: product?.material || "",
    color: product?.color || "",
    dimensions: product?.dimensions || "",
    weight: product?.weight || "",
    care_instructions: product?.care_instructions || "",
    tags: product?.tags || [],
    images: product?.images || [],
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    track_inventory: product?.track_inventory ?? true,
    allow_backorder: product?.allow_backorder ?? false,
    seo_title: product?.seo_title || "",
    seo_description: product?.seo_description || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    {
      id: 'basic',
      title: 'Basic Info',
      icon: Package,
      description: 'Product name, description, and pricing'
    },
    {
      id: 'media',
      title: 'Media & Images',
      icon: Camera,
      description: 'Upload and manage product images'
    },
    {
      id: 'details',
      title: 'Details & Specs',
      icon: Settings,
      description: 'Technical specifications and attributes'
    },
    {
      id: 'inventory',
      title: 'Inventory',
      icon: BarChart3,
      description: 'Stock management and tracking'
    },
    {
      id: 'seo',
      title: 'SEO & Marketing',
      icon: Sparkles,
      description: 'Search optimization and promotion'
    }
  ]

  // Real-time validation
  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'name':
        if (!value || value.length < 3) {
          newErrors.name = 'Product name must be at least 3 characters'
        } else {
          delete newErrors.name
        }
        break
      case 'sku':
        if (!value || value.length < 2) {
          newErrors.sku = 'SKU is required and must be at least 2 characters'
        } else {
          delete newErrors.sku
        }
        break
      case 'price':
        if (!value || parseFloat(value) <= 0) {
          newErrors.price = 'Price must be greater than 0'
        } else {
          delete newErrors.price
        }
        break
      case 'category_id':
        if (!value) {
          newErrors.category_id = 'Please select a category'
        } else {
          delete newErrors.category_id
        }
        break
    }

    setErrors(newErrors)
  }

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  // Image upload handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files).map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file)
      }
      return null
    }).filter(Boolean)

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }))
    }
  }

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = ['name', 'sku', 'price', 'category_id']
    const newErrors: Record<string, string> = {}

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field.replace('_', ' ')} is required`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      toast.success(product ? 'Product updated successfully!' : 'Product created successfully!')
    } catch (error) {
      toast.error('Failed to save product')
    } finally {
      setIsLoading(false)
    }
  }

  const isStepComplete = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Basic Info
        return formData.name && formData.sku && formData.price && formData.category_id
      case 1: // Media
        return formData.images.length > 0
      case 2: // Details
        return true // Optional
      case 3: // Inventory
        return formData.inventory_quantity !== ""
      case 4: // SEO
        return true // Optional
      default:
        return false
    }
  }

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
            Product Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter product name"
            className={`h-11 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'} bg-white shadow-sm`}
          />
          {errors.name && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku" className="text-sm font-semibold text-gray-700">
            SKU *
          </Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleInputChange('sku', e.target.value)}
            placeholder="Enter SKU"
            className={`h-11 ${errors.sku ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'} bg-white shadow-sm`}
          />
          {errors.sku && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.sku}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
          Product Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your product in detail"
          className="min-h-[120px] border-gray-300 focus:border-orange-500 bg-white shadow-sm resize-none"
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_description" className="text-sm font-semibold text-gray-700">
          Short Description
        </Label>
        <Textarea
          id="short_description"
          value={formData.short_description}
          onChange={(e) => handleInputChange('short_description', e.target.value)}
          placeholder="Brief product summary for listings"
          className="min-h-[80px] border-gray-300 focus:border-orange-500 bg-white shadow-sm resize-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-semibold text-gray-700">
            Price (₹) *
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
              className={`h-11 pl-10 ${errors.price ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'} bg-white shadow-sm`}
            />
          </div>
          {errors.price && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.price}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="compare_price" className="text-sm font-semibold text-gray-700">
            Compare Price (₹)
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="compare_price"
              type="number"
              value={formData.compare_price}
              onChange={(e) => handleInputChange('compare_price', e.target.value)}
              placeholder="0.00"
              className="h-11 pl-10 border-gray-300 focus:border-orange-500 bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category_id" className="text-sm font-semibold text-gray-700">
            Category *
          </Label>
          <select
            id="category_id"
            value={formData.category_id}
            onChange={(e) => handleInputChange('category_id', e.target.value)}
            className={`h-11 w-full rounded-md border ${errors.category_id ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'} bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.category_id}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  const renderMediaUpload = () => (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upload Product Images</h3>
            <p className="text-gray-500">Drag and drop images here, or click to browse</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <Camera className="w-4 h-4 mr-2" />
            Choose Images
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>
      </div>

      {formData.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden bg-gray-100">
              <img
                src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeImage(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {index === 0 && (
                <Badge className="absolute top-2 left-2 bg-orange-500">
                  Primary
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="material" className="text-sm font-semibold text-gray-700">
            Material
          </Label>
          <Input
            id="material"
            value={formData.material}
            onChange={(e) => handleInputChange('material', e.target.value)}
            placeholder="e.g., Clay, Ceramic, Terracotta"
            className="h-11 border-gray-300 focus:border-orange-500 bg-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color" className="text-sm font-semibold text-gray-700">
            Color
          </Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            placeholder="e.g., Natural Brown, Glazed Blue"
            className="h-11 border-gray-300 focus:border-orange-500 bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="dimensions" className="text-sm font-semibold text-gray-700">
            Dimensions
          </Label>
          <Input
            id="dimensions"
            value={formData.dimensions}
            onChange={(e) => handleInputChange('dimensions', e.target.value)}
            placeholder="e.g., 15cm x 10cm x 8cm"
            className="h-11 border-gray-300 focus:border-orange-500 bg-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-semibold text-gray-700">
            Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="0.5"
            className="h-11 border-gray-300 focus:border-orange-500 bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="care_instructions" className="text-sm font-semibold text-gray-700">
          Care Instructions
        </Label>
        <Textarea
          id="care_instructions"
          value={formData.care_instructions}
          onChange={(e) => handleInputChange('care_instructions', e.target.value)}
          placeholder="How to care for this product..."
          className="min-h-[100px] border-gray-300 focus:border-orange-500 bg-white shadow-sm resize-none"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-orange-100 text-orange-800 hover:bg-orange-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-2 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>

        {/* Predefined Tags Dropdown */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-600">Quick Add Category Tags</Label>
          <select
            className="h-11 w-full rounded-md border border-gray-300 focus:border-orange-500 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            onChange={(e) => {
              if (e.target.value) {
                addTag(e.target.value)
                e.target.value = ''
              }
            }}
            defaultValue=""
          >
            <option value="">Select a category tag...</option>
            <optgroup label="Category Tags">
              <option value="wall">wall</option>
              <option value="art">art</option>
              <option value="decorative">decorative</option>
              <option value="figurine">figurine</option>
              <option value="sculpture">sculpture</option>
              <option value="statue">statue</option>
              <option value="oven">oven</option>
              <option value="dinnerware">dinnerware</option>
              <option value="dinner">dinner</option>
              <option value="plate">plate</option>
              <option value="bowl">bowl</option>
            </optgroup>
            <optgroup label="Collection Tags">
              <option value="heritage">heritage</option>
              <option value="traditional">traditional</option>
              <option value="vintage">vintage</option>
              <option value="wedding">wedding</option>
              <option value="ceremonial">ceremonial</option>
              <option value="special">special</option>
              <option value="gift">gift</option>
              <option value="artisan">artisan</option>
              <option value="master">master</option>
              <option value="premium">premium</option>
              <option value="limited">limited</option>
            </optgroup>
            <optgroup label="Style Tags">
              <option value="modern">modern</option>
              <option value="contemporary">contemporary</option>
              <option value="rustic">rustic</option>
              <option value="elegant">elegant</option>
              <option value="classic">classic</option>
              <option value="handcrafted">handcrafted</option>
            </optgroup>
          </select>
        </div>

        {/* Custom Tag Input */}
        <Input
          placeholder="Add custom tags (press Enter)"
          className="h-11 border-gray-300 focus:border-orange-500 bg-white shadow-sm"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTag(e.currentTarget.value)
              e.currentTarget.value = ''
            }
          }}
        />
      </div>
    </div>
  )

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="inventory_quantity" className="text-sm font-semibold text-gray-700">
            Stock Quantity *
          </Label>
          <Input
            id="inventory_quantity"
            type="number"
            value={formData.inventory_quantity}
            onChange={(e) => handleInputChange('inventory_quantity', e.target.value)}
            placeholder="0"
            className="h-11 border-gray-300 focus:border-orange-500 bg-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="low_stock_threshold" className="text-sm font-semibold text-gray-700">
            Low Stock Alert
          </Label>
          <Input
            id="low_stock_threshold"
            type="number"
            value={formData.low_stock_threshold}
            onChange={(e) => handleInputChange('low_stock_threshold', e.target.value)}
            placeholder="10"
            className="h-11 border-gray-300 focus:border-orange-500 bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div>
            <Label className="text-sm font-semibold text-gray-700">Track Inventory</Label>
            <p className="text-sm text-gray-500">Monitor stock levels for this product</p>
          </div>
          <Switch
            checked={formData.track_inventory}
            onCheckedChange={(checked) => handleInputChange('track_inventory', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div>
            <Label className="text-sm font-semibold text-gray-700">Allow Backorders</Label>
            <p className="text-sm text-gray-500">Continue selling when out of stock</p>
          </div>
          <Switch
            checked={formData.allow_backorder}
            onCheckedChange={(checked) => handleInputChange('allow_backorder', checked)}
          />
        </div>
      </div>
    </div>
  )

  const renderSEO = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="seo_title" className="text-sm font-semibold text-gray-700">
          SEO Title
        </Label>
        <Input
          id="seo_title"
          value={formData.seo_title}
          onChange={(e) => handleInputChange('seo_title', e.target.value)}
          placeholder="SEO optimized title"
          className="h-11 border-gray-300 focus:border-orange-500 bg-white shadow-sm"
        />
        <p className="text-xs text-gray-500">
          {formData.seo_title.length}/60 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo_description" className="text-sm font-semibold text-gray-700">
          SEO Description
        </Label>
        <Textarea
          id="seo_description"
          value={formData.seo_description}
          onChange={(e) => handleInputChange('seo_description', e.target.value)}
          placeholder="Meta description for search engines"
          className="min-h-[100px] border-gray-300 focus:border-orange-500 bg-white shadow-sm resize-none"
          rows={4}
        />
        <p className="text-xs text-gray-500">
          {formData.seo_description.length}/160 characters
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div>
            <Label className="text-sm font-semibold text-gray-700">Featured Product</Label>
            <p className="text-sm text-gray-500">Highlight this product on homepage</p>
          </div>
          <Switch
            checked={formData.is_featured}
            onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div>
            <Label className="text-sm font-semibold text-gray-700">Active Product</Label>
            <p className="text-sm text-gray-500">Make this product visible to customers</p>
          </div>
          <Switch
            checked={formData.is_active}
            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
          />
        </div>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: return renderBasicInfo()
      case 1: return renderMediaUpload()
      case 2: return renderDetails()
      case 3: return renderInventory()
      case 4: return renderSEO()
      default: return renderBasicInfo()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Create New Product'}
          </h1>
          <p className="text-gray-600 mt-2">
            {product ? 'Update your product information' : 'Add a new product to your catalog'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Step Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Setup Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isComplete = isStepComplete(index)
                  const isActive = activeStep === index

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
                            <Check className="w-4 h-4" />
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
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="min-h-[600px]">
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
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {product ? 'Update Product' : 'Create Product'}
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
  )
}