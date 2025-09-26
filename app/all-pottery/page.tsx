"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Star, Heart, ShoppingCart, Filter, Search, Grid, List, Eye, Bookmark, Share2, Users, CheckCircle, Truck, Award, Palette, Crown, TreePine } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"

export default function AllPotteryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSubCategory, setSelectedSubCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMaterial, setSelectedMaterial] = useState("all")
  const [selectedSize, setSelectedSize] = useState("all")
  const [selectedStyle, setSelectedStyle] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isVisible, setIsVisible] = useState(false)
  const [realProducts, setRealProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    fetchRealProducts()
  }, [])

  const fetchRealProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const supabase = createClient()

      // First get the "All Pottery" category ID
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'all-pottery')
        .single()

      if (!categoryData) {
        console.error('All Pottery category not found')
        setRealProducts([])
        return
      }

      // Then get products only from the "All Pottery" category
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          price,
          compare_price,
          images,
          is_active,
          is_featured,
          inventory_quantity,
          created_at,
          category_id
        `)
        .eq('is_active', true)
        .eq('category_id', categoryData.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      const transformedProducts = products?.map((product, index) => ({
        id: `db-${product.id}`,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.compare_price || product.price * 1.2,
        image: product.images && product.images.length > 0 ? product.images[0] : "/elegant-wedding-terracotta-collection.jpg",
        category: "All Pottery",
        subCategory: "Database Product",
        rating: 4.5 + (Math.random() * 0.5),
        reviews: Math.floor(Math.random() * 200) + 50,
        badge: product.is_featured ? "Featured" : "New Arrival",
        features: ["Handcrafted", "Premium Quality", "Authentic", "Durable"],
        description: product.description || `Beautiful ${product.name} crafted with traditional techniques`,
        material: "Premium Terracotta",
        size: "Standard",
        style: "Traditional",
        inStock: (product.inventory_quantity || 0) > 0,
        trending: product.is_featured,
        eco_friendly: true,
        handmade: true,
        weight: "2kg",
        dimensions: "Standard size"
      })) || []

      setRealProducts(transformedProducts)
    } catch (error) {
      console.error('Error in fetchRealProducts:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const allPotteryProducts = [
    // Traditional Pottery
    {
      id: 1,
      name: "Heritage Clay Cooking Pot",
      price: 1899,
      originalPrice: 2299,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Traditional Pottery",
      subCategory: "Cooking Pots",
      rating: 4.8,
      reviews: 156,
      badge: "Heritage Collection",
      features: ["Slow Cooking", "Heat Retention", "Natural Clay", "Authentic Taste"],
      description: "Traditional clay cooking pot that enhances flavors and provides healthier cooking with natural heat retention properties",
      material: "Premium Terracotta",
      size: "Large (3L)",
      style: "Traditional",
      inStock: true,
      trending: true,
      eco_friendly: true,
      handmade: true,
      weight: "2.5kg",
      dimensions: "25cm x 20cm"
    },
    {
      id: 2,
      name: "Crystal Water Storage Vessel",
      price: 999,
      originalPrice: 1299,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Traditional Pottery",
      subCategory: "Water Storage",
      rating: 4.9,
      reviews: 234,
      badge: "Best Seller",
      features: ["Natural Cooling", "Mineral Enhancement", "Eco-Friendly", "Large Capacity"],
      description: "Naturally cool and purify your water with this traditional storage vessel designed for optimal taste and health benefits",
      material: "Filtered Clay",
      size: "Extra Large (10L)",
      style: "Traditional",
      inStock: true,
      trending: false,
      eco_friendly: true,
      handmade: true,
      weight: "4kg",
      dimensions: "35cm x 40cm"
    },
    // Decorative Items
    {
      id: 3,
      name: "Majestic Garden Planter Set",
      price: 3299,
      originalPrice: 3999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Decorative Items",
      subCategory: "Vases & Planters",
      rating: 4.7,
      reviews: 89,
      badge: "Garden Special",
      features: ["Weather Resistant", "Drainage System", "Set of 3", "Artistic Design"],
      description: "Transform your garden with this stunning planter set featuring graduated sizes and beautiful artistic patterns",
      material: "Weather-Resistant Clay",
      size: "Set (Small, Medium, Large)",
      style: "Contemporary",
      inStock: true,
      trending: true,
      eco_friendly: true,
      handmade: true,
      weight: "8kg",
      dimensions: "Various sizes"
    },
    {
      id: 4,
      name: "Intricate Wall Art Panel",
      price: 2799,
      originalPrice: 3499,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Decorative Items",
      subCategory: "Wall Art",
      rating: 4.8,
      reviews: 67,
      badge: "Artist Collection",
      features: ["Hand-Carved", "Intricate Design", "Wall Mounted", "Cultural Motifs"],
      description: "Showcase traditional artistry with this intricately carved wall panel featuring authentic cultural motifs and patterns",
      material: "High-Grade Terracotta",
      size: "Large (60cm x 40cm)",
      style: "Traditional",
      inStock: true,
      trending: false,
      eco_friendly: true,
      handmade: true,
      weight: "5kg",
      dimensions: "60cm x 40cm x 5cm"
    },
    // Serving Ware
    {
      id: 5,
      name: "Elegant Serving Bowl Collection",
      price: 2199,
      originalPrice: 2699,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Serving Ware",
      subCategory: "Bowls & Plates",
      rating: 4.9,
      reviews: 145,
      badge: "Elegant Series",
      features: ["Set of 8", "Elegant Design", "Perfect for Entertaining", "Dishwasher Safe"],
      description: "Elevate your dining experience with this elegant serving bowl collection perfect for both everyday meals and special occasions",
      material: "Glazed Terracotta",
      size: "Set (Various sizes)",
      style: "Modern",
      inStock: true,
      trending: true,
      eco_friendly: true,
      handmade: true,
      weight: "3kg",
      dimensions: "Various"
    },
    {
      id: 6,
      name: "Artisan Coffee Cup Set",
      price: 1599,
      originalPrice: 1899,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Serving Ware",
      subCategory: "Cups & Mugs",
      rating: 4.6,
      reviews: 98,
      badge: "Coffee Special",
      features: ["Set of 6", "Insulated Design", "Comfortable Grip", "Perfect Temperature"],
      description: "Enjoy your morning coffee in style with these artisan-crafted cups that maintain perfect temperature and enhance flavor",
      material: "Insulated Clay",
      size: "Medium (250ml each)",
      style: "Contemporary",
      inStock: true,
      trending: false,
      eco_friendly: true,
      handmade: true,
      weight: "1.5kg",
      dimensions: "10cm x 8cm each"
    },
    // Figurines & Sculptures
    {
      id: 7,
      name: "Sacred Ganesha Sculpture",
      price: 2499,
      originalPrice: 2999,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Figurines",
      subCategory: "Religious",
      rating: 4.9,
      reviews: 234,
      badge: "Sacred Art",
      features: ["Hand-Painted", "Spiritual Significance", "Blessed Creation", "Premium Finish"],
      description: "Bring blessings and positive energy to your home with this beautifully crafted and blessed Ganesha sculpture",
      material: "Sacred Clay Blend",
      size: "Large (25cm height)",
      style: "Traditional",
      inStock: true,
      trending: true,
      eco_friendly: true,
      handmade: true,
      weight: "3kg",
      dimensions: "25cm x 20cm x 15cm"
    },
    {
      id: 8,
      name: "Elegant Peacock Garden Sculpture",
      price: 3799,
      originalPrice: 4499,
      image: "/elegant-wedding-terracotta-collection.jpg",
      category: "Figurines",
      subCategory: "Garden Sculptures",
      rating: 4.7,
      reviews: 78,
      badge: "Garden Masterpiece",
      features: ["Weather Resistant", "Vibrant Colors", "Artistic Detail", "Statement Piece"],
      description: "Add elegance and grace to your garden with this stunning peacock sculpture featuring vibrant hand-painted details",
      material: "Weather-Proof Clay",
      size: "Extra Large (45cm)",
      style: "Artistic",
      inStock: true,
      trending: false,
      eco_friendly: true,
      handmade: true,
      weight: "6kg",
      dimensions: "45cm x 30cm x 20cm"
    }
  ]

  const categoryOptions = [
    { value: "all", label: "All Categories", count: allPotteryProducts.length },
    { value: "traditional-pottery", label: "Traditional Pottery", count: 2 },
    { value: "decorative-items", label: "Decorative Items", count: 2 },
    { value: "serving-ware", label: "Serving Ware", count: 2 },
    { value: "figurines", label: "Figurines & Sculptures", count: 2 }
  ]

  const subCategoryOptions = {
    "traditional-pottery": [
      { value: "all", label: "All Traditional" },
      { value: "cooking-pots", label: "Cooking Pots" },
      { value: "water-storage", label: "Water Storage" },
      { value: "ovens", label: "Clay Ovens" },
      { value: "storage", label: "Storage Containers" }
    ],
    "decorative-items": [
      { value: "all", label: "All Decorative" },
      { value: "vases-planters", label: "Vases & Planters" },
      { value: "wall-art", label: "Wall Art" },
      { value: "garden-decor", label: "Garden Decor" },
      { value: "figurines", label: "Figurines" }
    ],
    "serving-ware": [
      { value: "all", label: "All Serving" },
      { value: "bowls-plates", label: "Bowls & Plates" },
      { value: "cups-mugs", label: "Cups & Mugs" },
      { value: "serving-sets", label: "Serving Sets" },
      { value: "dinnerware", label: "Dinnerware" }
    ],
    "figurines": [
      { value: "all", label: "All Figurines" },
      { value: "religious", label: "Religious" },
      { value: "garden-sculptures", label: "Garden Sculptures" },
      { value: "decorative", label: "Decorative" },
      { value: "cultural", label: "Cultural" }
    ]
  }

  // Use only real database products from "All Pottery" category
  const allProducts = realProducts

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase().replace(/\s+/g, "-").replace("&", "") === selectedCategory
    const matchesSubCategory = selectedSubCategory === "all" || product.subCategory.toLowerCase().replace(/\s+/g, "-").replace("&", "") === selectedSubCategory
    const matchesSearch = searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesMaterial = selectedMaterial === "all" || product.material.toLowerCase().includes(selectedMaterial.toLowerCase())
    const matchesSize = selectedSize === "all" || product.size.toLowerCase().includes(selectedSize.toLowerCase())
    const matchesStyle = selectedStyle === "all" || product.style.toLowerCase() === selectedStyle.toLowerCase()

    return matchesCategory && matchesSubCategory && matchesSearch && matchesPrice && matchesMaterial && matchesSize && matchesStyle
  })

  const sortedProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id
      case "trending":
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0)
      case "alphabetical":
        return a.name.localeCompare(b.name)
      default: // featured
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.rating - a.rating
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-slate-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gray-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-slate-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-gray-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-slate-100 text-slate-800 border-slate-200 text-sm px-4 py-2">
                Complete Pottery Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                All <span className="text-slate-600">Pottery</span> & Terracotta
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Explore our complete collection of handcrafted terracotta pottery. From traditional cooking vessels to contemporary decorative pieces,
                discover over 200+ authentic creations spanning generations of expertise and cultural heritage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-slate-600 hover:bg-slate-700 text-lg px-8 py-3">
                  <Eye className="h-5 w-5 mr-2" />
                  Explore Collection
                </Button>
                <Button size="lg" variant="outline" className="border-slate-200 hover:bg-slate-50 text-lg px-8 py-3">
                  <Filter className="h-5 w-5 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-600 mb-1">200+</div>
                <div className="text-sm text-gray-600">Unique Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-600 mb-1">50+</div>
                <div className="text-sm text-gray-600">Master Artisans</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-600 mb-1">72</div>
                <div className="text-sm text-gray-600">Years Heritage</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-600 mb-1">15k+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Palette className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Handcrafted Excellence</h3>
                <p className="text-gray-600">Every piece individually crafted by skilled artisans using traditional techniques</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TreePine className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Eco-Friendly</h3>
                <p className="text-gray-600">100% natural clay materials supporting sustainable living and environment</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Crown className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Heritage Quality</h3>
                <p className="text-gray-600">Traditional craftsmanship passed down through 3 generations since 1952</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Award Winning</h3>
                <p className="text-gray-600">Recognition for excellence in traditional pottery and modern innovation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Filters Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Comprehensive Filters */}
              <div className="lg:w-1/4">
                <Card className="border-slate-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-slate-600" />
                      <h3 className="text-lg font-bold text-gray-900">Comprehensive Filters</h3>
                    </div>

                    <div className="space-y-6">
                      {/* Search */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Search Products</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search all pottery..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-slate-100 focus:border-slate-300"
                          />
                        </div>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Main Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="border-slate-100 focus:border-slate-300">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label} ({option.count})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sub-Category Filter */}
                      {selectedCategory !== "all" && subCategoryOptions[selectedCategory] && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-3 block">Sub-Category</label>
                          <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                            <SelectTrigger className="border-slate-100 focus:border-slate-300">
                              <SelectValue placeholder="Select sub-category" />
                            </SelectTrigger>
                            <SelectContent>
                              {subCategoryOptions[selectedCategory].map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Price Range Slider */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">
                          Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                        </label>
                        <div className="px-3">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={50000}
                            min={0}
                            step={100}
                            className="w-full"
                          />
                        </div>
                      </div>

                      {/* Material Filter */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Material</label>
                        <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                          <SelectTrigger className="border-slate-100 focus:border-slate-300">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Materials</SelectItem>
                            <SelectItem value="terracotta">Premium Terracotta</SelectItem>
                            <SelectItem value="glazed">Glazed Terracotta</SelectItem>
                            <SelectItem value="filtered">Filtered Clay</SelectItem>
                            <SelectItem value="weather-resistant">Weather-Resistant Clay</SelectItem>
                            <SelectItem value="sacred">Sacred Clay Blend</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Size Filter */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Size</label>
                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                          <SelectTrigger className="border-slate-100 focus:border-slate-300">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sizes</SelectItem>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                            <SelectItem value="extra large">Extra Large</SelectItem>
                            <SelectItem value="set">Set/Multiple</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Style Filter */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Style</label>
                        <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                          <SelectTrigger className="border-slate-100 focus:border-slate-300">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Styles</SelectItem>
                            <SelectItem value="traditional">Traditional</SelectItem>
                            <SelectItem value="contemporary">Contemporary</SelectItem>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="artistic">Artistic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Special Features */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Special Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-slate-200 text-slate-600 mr-2" />
                            <span className="text-sm text-gray-600">Handmade</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-slate-200 text-slate-600 mr-2" />
                            <span className="text-sm text-gray-600">Eco-Friendly</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-slate-200 text-slate-600 mr-2" />
                            <span className="text-sm text-gray-600">Trending</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-slate-200 text-slate-600 mr-2" />
                            <span className="text-sm text-gray-600">Weather Resistant</span>
                          </label>
                        </div>
                      </div>

                      {/* Clear Filters Button */}
                      <Button
                        variant="outline"
                        className="w-full border-slate-200 hover:bg-slate-50"
                        onClick={() => {
                          setSelectedCategory("all")
                          setSelectedSubCategory("all")
                          setPriceRange([0, 50000])
                          setSearchQuery("")
                          setSelectedMaterial("all")
                          setSelectedSize("all")
                          setSelectedStyle("all")
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Content - Products */}
              <div className="lg:w-3/4">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-lg shadow-sm">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Pottery Collection</h2>
                    <p className="text-gray-600">{sortedProducts.length} of {allProducts.length} products • Showing filtered results{isLoadingProducts ? ' • Loading database products...' : ''}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* View Mode Toggle */}
                    <div className="flex border border-slate-200 rounded-md">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="rounded-r-none"
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="rounded-l-none"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Sort Options */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48 border-slate-100 focus:border-slate-300">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="trending">Trending</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="alphabetical">A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Product Grid/List */}
                <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
                  {sortedProducts.map((product) => (
                    <Card key={product.id} className={`group border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${viewMode === "list" ? "flex flex-row" : ""}`}>
                      <CardContent className="p-0">
                        <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                          <div className={`relative overflow-hidden cursor-pointer ${viewMode === "list" ? "w-64 flex-shrink-0" : "rounded-t-lg"}`}>
                            <div className={`w-full bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center ${viewMode === "list" ? "h-48" : "h-64"}`}>
                              <Palette className="h-16 w-16 text-slate-400" />
                            </div>

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            <Badge className="bg-slate-600 text-white text-xs">
                              {product.badge}
                            </Badge>
                            {product.trending && (
                              <Badge className="bg-orange-500 text-white text-xs">
                                Trending
                              </Badge>
                            )}
                            {product.eco_friendly && (
                              <Badge className="bg-green-500 text-white text-xs">
                                Eco-Friendly
                              </Badge>
                            )}
                          </div>

                          <div className="absolute top-3 right-3">
                            <Badge className="bg-white/90 text-slate-600 text-xs">
                              {product.category}
                            </Badge>
                          </div>

                          <div className="absolute bottom-3 right-3 flex gap-2">
                            <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                              <Heart className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                              <Bookmark className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                          </div>
                        </Link>

                        <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                          </div>

                          <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-slate-600 transition-colors line-clamp-2 cursor-pointer">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                          {/* Product Details */}
                          <div className="text-xs text-gray-500 mb-4 space-y-1">
                            <div className="flex justify-between">
                              <span>Material:</span>
                              <span className="font-medium">{product.material}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Size:</span>
                              <span className="font-medium">{product.size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Style:</span>
                              <span className="font-medium">{product.style}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {product.features.slice(0, viewMode === "list" ? 4 : 2).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-slate-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-slate-600 hover:bg-slate-700"
                              onClick={() => {
                                // Add to cart functionality
                                console.log('Adding to cart:', product.name)
                                alert(`Added ${product.name} to cart!`)
                              }}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Link href={product.slug ? `/products/${product.slug}` : '#'}>
                              <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-200 hover:bg-slate-50"
                              onClick={() => {
                                // Share functionality
                                if (navigator.share) {
                                  navigator.share({
                                    title: product.name,
                                    text: product.description,
                                    url: window.location.origin + `/products/${product.slug}`
                                  })
                                } else {
                                  // Fallback: copy to clipboard
                                  navigator.clipboard.writeText(window.location.origin + `/products/${product.slug}`)
                                  alert('Product link copied to clipboard!')
                                }
                              }}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* No Results */}
                {sortedProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">No pottery matches your search criteria</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory("all")
                        setSelectedSubCategory("all")
                        setPriceRange([0, 50000])
                        setSearchQuery("")
                        setSelectedMaterial("all")
                        setSelectedSize("all")
                        setSelectedStyle("all")
                      }}
                      className="border-slate-200 hover:bg-slate-50"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}

                {/* Load More Button */}
                {sortedProducts.length > 0 && sortedProducts.length < allProducts.length && (
                  <div className="text-center mt-12">
                    <Button variant="outline" size="lg" className="border-slate-200 hover:bg-slate-50">
                      Load More Products
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-slate-50 to-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">50,000+ Pottery Enthusiasts</h3>
                <p className="text-gray-600">Trusted by collectors, chefs, and pottery lovers across India</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Heritage Authenticity</h3>
                <p className="text-gray-600">Every piece certified authentic with 72 years of craftsmanship legacy</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Packaging</h3>
                <p className="text-gray-600">Professional care ensures every pottery piece arrives safely</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}