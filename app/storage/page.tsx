"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Filter, Package, Leaf, Shield, Clock, Award, Users, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProductHeader from "@/components/product-header"
import ProductFooter from "@/components/product-footer"

export default function StorageContainersPage() {
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const storageProducts = [
    {
      id: 1,
      name: "Traditional Grain Storage Jar - Large Family Size",
      price: 2999,
      originalPrice: 3799,
      image: "/products/grain-jar-large.jpg",
      type: "grain",
      capacity: "25kg",
      rating: 4.9,
      reviews: 287,
      badge: "Best Seller",
      features: ["Air-tight seal", "Pest resistant", "Moisture control", "Large capacity"],
      description: "Perfect for storing rice, wheat, and other grains with natural preservation properties"
    },
    {
      id: 2,
      name: "Spice Storage Set - Kitchen Essentials",
      price: 1899,
      originalPrice: 2399,
      image: "/products/spice-storage-set.jpg",
      type: "spice",
      capacity: "Set of 12",
      rating: 4.8,
      reviews: 345,
      badge: "Popular Choice",
      features: ["Individual compartments", "Aroma preservation", "Easy labeling", "Compact design"],
      description: "Complete spice storage solution keeping flavors fresh and organized"
    },
    {
      id: 3,
      name: "Oil Storage Pot - Traditional Ghani Style",
      price: 2299,
      originalPrice: 2899,
      image: "/products/oil-pot-ghani.jpg",
      type: "oil",
      capacity: "5L",
      rating: 4.7,
      reviews: 198,
      badge: "Traditional",
      features: ["Natural filtration", "Temperature stable", "Authentic design", "Health benefits"],
      description: "Traditional oil storage maintaining natural properties and extending shelf life"
    },
    {
      id: 4,
      name: "Multi-Purpose Food Storage Containers - Family Pack",
      price: 3499,
      originalPrice: 4299,
      image: "/products/food-containers-family.jpg",
      type: "food",
      capacity: "Various sizes",
      rating: 4.8,
      reviews: 234,
      badge: "Family Pack",
      features: ["Multiple sizes", "Stack-able design", "Food grade", "Versatile use"],
      description: "Versatile storage solution for all types of food items and kitchen essentials"
    },
    {
      id: 5,
      name: "Pickle Storage Jar - Fermentation Specialist",
      price: 1599,
      originalPrice: 1999,
      image: "/products/pickle-jar-fermentation.jpg",
      type: "pickle",
      capacity: "3L",
      rating: 4.9,
      reviews: 156,
      badge: "Specialty",
      features: ["Fermentation friendly", "Acid resistant", "Traditional shape", "Perfect seal"],
      description: "Specially designed for pickles and fermented foods with optimal aging conditions"
    },
    {
      id: 6,
      name: "Premium Storage System - Complete Kitchen Organization",
      price: 5999,
      originalPrice: 7499,
      image: "/products/storage-system-premium.jpg",
      type: "system",
      capacity: "Complete set",
      rating: 4.8,
      reviews: 123,
      badge: "Premium",
      features: ["Complete organization", "Modular design", "Premium quality", "Professional grade"],
      description: "Comprehensive storage system for complete kitchen organization and food preservation"
    }
  ]

  const typeOptions = [
    { value: "all", label: "All Storage" },
    { value: "grain", label: "Grain Storage" },
    { value: "spice", label: "Spice Containers" },
    { value: "oil", label: "Oil Storage" },
    { value: "food", label: "Food Containers" },
    { value: "pickle", label: "Pickle Jars" },
    { value: "system", label: "Storage Systems" }
  ]

  const filteredProducts = selectedType === "all"
    ? storageProducts
    : storageProducts.filter(product => product.type === selectedType)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-teal-50">
      <ProductHeader />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-teal-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-green-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-teal-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className={`pt-24 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-100 text-green-800 border-green-200 text-sm px-4 py-2">
                Storage Solutions
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Natural <span className="text-green-600">Storage Containers</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Preserve the freshness and nutritional value of your food with our traditional clay storage containers.
                Natural, breathable, and chemical-free storage solutions for a healthier kitchen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                  <Package className="h-5 w-5 mr-2" />
                  Shop Storage
                </Button>
                <Button size="lg" variant="outline" className="border-green-200 hover:bg-green-50 text-lg px-8 py-3">
                  Storage Guide
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Preservation</h3>
                <p className="text-gray-600">Clay's natural properties keep food fresh longer without chemicals</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pest Protection</h3>
                <p className="text-gray-600">Natural pest resistance without harmful chemical treatments</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Extended Freshness</h3>
                <p className="text-gray-600">Maintains optimal moisture levels for longer food storage</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Chemical-Free</h3>
                <p className="text-gray-600">100% natural materials safe for food contact</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Filters */}
              <div className="lg:w-1/4">
                <Card className="border-green-100 sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Filter className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Storage Type</label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger className="border-green-100 focus:border-green-300">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Capacity</label>
                        <Select>
                          <SelectTrigger className="border-green-100 focus:border-green-300">
                            <SelectValue placeholder="Select capacity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Capacities</SelectItem>
                            <SelectItem value="small">Small (1-5L)</SelectItem>
                            <SelectItem value="medium">Medium (5-15L)</SelectItem>
                            <SelectItem value="large">Large (15L+)</SelectItem>
                            <SelectItem value="sets">Sets & Collections</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Price Range</label>
                        <Select value={priceRange} onValueChange={setPriceRange}>
                          <SelectTrigger className="border-green-100 focus:border-green-300">
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under-2000">Under ₹2,000</SelectItem>
                            <SelectItem value="2000-3000">₹2,000 - ₹3,000</SelectItem>
                            <SelectItem value="3000-5000">₹3,000 - ₹5,000</SelectItem>
                            <SelectItem value="above-5000">Above ₹5,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-green-200 text-green-600 mr-2" />
                            <span className="text-sm text-gray-600">Air-tight Seal</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-green-200 text-green-600 mr-2" />
                            <span className="text-sm text-gray-600">Pest Resistant</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-green-200 text-green-600 mr-2" />
                            <span className="text-sm text-gray-600">Stackable Design</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-green-200 text-green-600 mr-2" />
                            <span className="text-sm text-gray-600">Food Grade</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Content - Products */}
              <div className="lg:w-3/4">
                {/* Sort Options */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Storage Containers</h2>
                    <p className="text-gray-600">{filteredProducts.length} storage solutions available</p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-green-100 focus:border-green-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="capacity">By Capacity</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <div className="w-full h-64 bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                            <Package className="h-16 w-16 text-green-400" />
                          </div>
                          {product.badge && (
                            <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge className="absolute top-3 right-3 bg-white/90 text-green-600">
                            {product.capacity}
                          </Badge>
                          <button className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                            <Heart className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {product.features.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
                              Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Information Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Science of Clay Food Storage</h2>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="text-xl mb-6">
                  For thousands of years, clay containers have been humanity's primary method of food storage and preservation. At Clayfable, we continue this ancient tradition by creating storage solutions that harness the natural properties of terracotta to keep your food fresh, nutritious, and safe without relying on synthetic materials or chemical preservatives.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Natural Food Preservation</h3>
                <p className="mb-4">
                  Clay storage containers work through multiple natural mechanisms that create optimal conditions for food preservation. The porous structure of terracotta allows for controlled air exchange while maintaining stable humidity levels. This natural breathability prevents the condensation that can lead to mold growth while keeping foods at optimal moisture levels for extended freshness.
                </p>
                <p className="mb-4">
                  The alkaline nature of clay helps neutralize acids that can cause food spoilage, while the natural minerals present in terracotta have antimicrobial properties that inhibit bacterial growth. These combined effects create a preservation environment that extends shelf life naturally, without the need for artificial preservatives or chemical treatments.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Traditional Grain Storage Systems</h3>
                <p className="mb-4">
                  Our large grain storage jars represent centuries of refined design for bulk food preservation. The wide mouth allows for easy filling and access, while the narrow neck minimizes air exposure to stored contents. The thick walls provide excellent insulation against temperature fluctuations, while the natural properties of clay create an environment that discourages pest infestation.
                </p>
                <p className="mb-4">
                  Traditional grain storage in clay containers can extend the shelf life of rice, wheat, and other grains by months compared to modern plastic or metal alternatives. The clay absorbs excess moisture during humid periods and releases it during dry conditions, maintaining optimal storage conditions automatically. This natural regulation prevents the moisture extremes that can lead to mold growth or insect infestation.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Specialized Spice Preservation</h3>
                <p className="mb-4">
                  Spices require special storage conditions to maintain their potency, aroma, and flavor compounds. Our spice storage containers are designed with tight-fitting lids that create an optimal microclimate for each spice type. The clay material helps regulate humidity while the dark interior protects sensitive compounds from light degradation.
                </p>
                <p className="mb-4">
                  The porous nature of clay also helps absorb excess oils that can turn rancid over time, while allowing beneficial volatile compounds to concentrate rather than escape. This results in spices that maintain their potency significantly longer than those stored in conventional containers, preserving both flavor and potential health benefits.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Oil Storage and Preservation</h3>
                <p className="mb-4">
                  Traditional oil storage in clay pots offers superior preservation compared to modern alternatives. The natural filtration properties of clay help remove impurities that can cause rancidity, while the temperature stability prevents the heating and cooling cycles that break down beneficial compounds in oils. Our oil storage pots are designed with narrow necks to minimize air contact and wide bases for stability.
                </p>
                <p className="mb-4">
                  Clay oil storage also allows for natural settling of sediments while maintaining the integrity of beneficial compounds. The alkaline nature of clay helps neutralize free fatty acids that contribute to rancidity, significantly extending the shelf life of stored oils. Many traditional oil pressing communities still rely exclusively on clay storage for maintaining oil quality.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Fermentation and Pickling Containers</h3>
                <p className="mb-4">
                  Fermentation requires precise environmental control, and clay containers excel at providing optimal conditions for beneficial bacterial cultures. Our pickle jars are specially designed with shapes and clay compositions that promote healthy fermentation while preventing contamination. The natural pH buffering properties of clay help maintain stable acidity levels crucial for proper fermentation.
                </p>
                <p className="mb-4">
                  The porous structure allows for controlled gas exchange essential to fermentation processes, while the thick walls maintain stable temperatures. Traditional fermented foods prepared and stored in clay containers often develop more complex flavors and better nutritional profiles compared to those made in non-porous materials.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Health and Safety Benefits</h3>
                <p className="mb-4">
                  Unlike plastic storage containers, clay storage poses no risk of chemical leaching into food. There are no concerns about BPA, phthalates, or other synthetic compounds that can migrate from container to contents. Clay is completely inert and safe for direct food contact, making it ideal for long-term storage of consumables.
                </p>
                <p className="mb-4">
                  The natural minerals present in clay can actually enhance the nutritional value of stored foods through minimal, beneficial mineral transfer. Studies have shown that foods stored in clay containers often have improved mineral content and better preservation of water-soluble vitamins compared to foods stored in synthetic containers.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pest Control Without Chemicals</h3>
                <p className="mb-4">
                  Traditional clay storage provides natural pest deterrence without the need for harmful chemical treatments. The alkaline environment created by clay is naturally inhospitable to many common food pests, while the smooth interior surfaces provide no places for insects to hide or lay eggs. Properly sealed clay containers create an environment that insects cannot penetrate or survive in.
                </p>
                <p className="mb-4">
                  For enhanced protection, traditional methods include mixing neem leaves or other natural deterrents with stored grains. The porous nature of clay allows these natural compounds to permeate the storage environment while maintaining food safety and quality.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Maintenance and Care</h3>
                <p className="mb-4">
                  Proper care of clay storage containers ensures optimal performance and longevity. Before first use, containers should be seasoned by soaking in clean water and allowing to dry completely. This initial preparation helps seal the clay and prepares it for food storage. Regular cleaning with warm water and natural scrubbing materials maintains hygiene without damaging the clay surface.
                </p>
                <p className="mb-4">
                  Periodic sunning helps maintain the antimicrobial properties of clay while preventing any moisture buildup that could lead to problems. With proper care, clay storage containers can provide decades of reliable service, often improving with age as the clay becomes more seasoned and effective at maintaining optimal storage conditions.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Environmental Sustainability</h3>
                <p className="mb-4">
                  Clay storage containers represent one of the most sustainable food storage solutions available. The materials are completely natural and renewable, the production process has minimal environmental impact, and the containers are completely biodegradable at the end of their useful life. Unlike plastic alternatives, clay storage creates no pollution and requires no petroleum-based materials.
                </p>
                <p className="mb-4">
                  By choosing clay storage solutions, you reduce dependence on plastic containers that contribute to environmental pollution while supporting traditional crafts and sustainable production methods. Clay storage containers can serve multiple generations, making them an investment in both family health and environmental responsibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-r from-green-50 to-teal-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">100,000+ Households</h3>
                <p className="text-gray-600">Trusted by Indian families for natural food storage solutions</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Food Grade Certified</h3>
                <p className="text-gray-600">All storage containers meet international food safety standards</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assured</h3>
                <p className="text-gray-600">Every container tested for durability and food safety compliance</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductFooter />
    </div>
  )
}