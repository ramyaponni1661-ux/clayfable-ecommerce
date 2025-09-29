"use client";

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Youtube, Eye } from "lucide-react"

interface ProductFormProps {
  product?: any
  onSave: (product: any) => void
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    short_description: product?.short_description || "",
    sku: product?.sku || "",
    price: product?.price || "",
    compare_price: product?.compare_price || "",
    cost_price: product?.cost_price || "",
    category_id: product?.category_id || "",
    youtube_video_id: product?.youtube_video_id || "",
    youtube_playlist_id: product?.youtube_playlist_id || "",
    ar_model_url: product?.ar_model_url || "",
    images: product?.images || [],
    tags: product?.tags || [],
    specifications: product?.specifications || {},
    care_instructions: product?.care_instructions || "",
    inventory_quantity: product?.inventory_quantity || 0,
    low_stock_threshold: product?.low_stock_threshold || 10,
    weight: product?.weight || "",
    dimensions: product?.dimensions || { length: "", width: "", height: "" },
    is_featured: product?.is_featured || false,
    is_active: product?.is_active !== false,
    track_inventory: product?.track_inventory !== false,
    allow_backorder: product?.allow_backorder || false,
    seo_title: product?.seo_title || "",
    seo_description: product?.seo_description || "",
  })

  const [newTag, setNewTag] = useState("")
  const [newSpec, setNewSpec] = useState({ key: "", value: "" })

  const [youtubePreview, setYoutubePreview] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addSpecification = () => {
    if (newSpec.key.trim() && newSpec.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpec.key.trim()]: newSpec.value.trim(),
        },
      }))
      setNewSpec({ key: "", value: "" })
    }
  }

  const removeSpecification = (keyToRemove: string) => {
    const newSpecs = { ...formData.specifications }
    delete newSpecs[keyToRemove]
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecs,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{product ? "Edit Product" : "Add New Product"}</h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{product ? "Update Product" : "Create Product"}</Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Media & Videos</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="care_instructions">Care Instructions</Label>
                <Textarea
                  id="care_instructions"
                  value={formData.care_instructions}
                  onChange={(e) => setFormData((prev) => ({ ...prev, care_instructions: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="is_featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-5 w-5" />
                YouTube Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="youtube_video_id">YouTube Video ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="youtube_video_id"
                      placeholder="e.g., dQw4w9WgXcQ"
                      value={formData.youtube_video_id}
                      onChange={(e) => setFormData((prev) => ({ ...prev, youtube_video_id: e.target.value }))}
                    />
                    {formData.youtube_video_id && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setYoutubePreview(!youtubePreview)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Extract from YouTube URL: youtube.com/watch?v=<strong>VIDEO_ID</strong>
                  </p>
                </div>
                <div>
                  <Label htmlFor="youtube_playlist_id">YouTube Playlist ID</Label>
                  <Input
                    id="youtube_playlist_id"
                    placeholder="e.g., PLrAXtmRdnEQy4QyMsrMSoWwJdoFLFwvjU"
                    value={formData.youtube_playlist_id}
                    onChange={(e) => setFormData((prev) => ({ ...prev, youtube_playlist_id: e.target.value }))}
                  />
                </div>
              </div>

              {youtubePreview && formData.youtube_video_id && (
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${formData.youtube_video_id}`}
                    title="YouTube video preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="ar_model_url">AR Model URL</Label>
                <Input
                  id="ar_model_url"
                  placeholder="https://example.com/model.glb"
                  value={formData.ar_model_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ar_model_url: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload 3D model (.glb, .gltf) for AR viewing experience
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Selling Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="compare_price">Compare Price (₹)</Label>
                  <Input
                    id="compare_price"
                    type="number"
                    step="0.01"
                    value={formData.compare_price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, compare_price: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">Original price for discounts</p>
                </div>
                <div>
                  <Label htmlFor="cost_price">Cost Price (₹)</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cost_price: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">For profit calculations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="track_inventory"
                    checked={formData.track_inventory}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, track_inventory: checked }))}
                  />
                  <Label htmlFor="track_inventory">Track Inventory</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow_backorder"
                    checked={formData.allow_backorder}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allow_backorder: checked }))}
                  />
                  <Label htmlFor="allow_backorder">Allow Backorders</Label>
                </div>
              </div>

              {formData.track_inventory && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inventory_quantity">Current Stock</Label>
                    <Input
                      id="inventory_quantity"
                      type="number"
                      value={formData.inventory_quantity}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, inventory_quantity: Number.parseInt(e.target.value) || 0 }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
                    <Input
                      id="low_stock_threshold"
                      type="number"
                      value={formData.low_stock_threshold}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, low_stock_threshold: Number.parseInt(e.target.value) || 0 }))
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="font-medium">{key}:</span>
                    <span>{value as string}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(key)}
                      className="ml-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Specification name"
                  value={newSpec.key}
                  onChange={(e) => setNewSpec((prev) => ({ ...prev, key: e.target.value }))}
                />
                <Input
                  placeholder="Value"
                  value={newSpec.value}
                  onChange={(e) => setNewSpec((prev) => ({ ...prev, value: e.target.value }))}
                />
                <Button type="button" onClick={addSpecification} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input
                  id="seo_title"
                  value={formData.seo_title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seo_title: e.target.value }))}
                  maxLength={60}
                />
                <p className="text-sm text-muted-foreground mt-1">{formData.seo_title.length}/60 characters</p>
              </div>

              <div>
                <Label htmlFor="seo_description">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  value={formData.seo_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seo_description: e.target.value }))}
                  maxLength={160}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">{formData.seo_description.length}/160 characters</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}
