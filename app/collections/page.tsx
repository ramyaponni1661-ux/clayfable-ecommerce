"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import ProductFooter from "@/components/product-footer"
import ProductHeader from "@/components/product-header"

export default function CollectionsPage() {
  const collections = [
    {
      name: "Heritage Collection",
      description: "Traditional designs passed down through generations",
      link: "/collections/heritage",
      itemCount: 12
    },
    {
      name: "Modern Collection",
      description: "Contemporary terracotta designs for modern living",
      link: "/collections/modern",
      itemCount: 18
    },
    {
      name: "Wedding Collection",
      description: "Special ceremonial pieces for your big day",
      link: "/collections/wedding",
      itemCount: 8
    },
    {
      name: "Artisan Collection",
      description: "Handcrafted pieces by master artisans",
      link: "/collections/artisan",
      itemCount: 15
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader />

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Collections
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our curated collections of authentic terracotta products
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {collections.map((collection) => (
            <Card key={collection.name} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {collection.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {collection.itemCount} items
                  </span>
                </div>

                <p className="text-gray-600 mb-4">
                  {collection.description}
                </p>

                <Link href={collection.link}>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    View Collection
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Looking for something specific?
          </h2>
          <p className="text-gray-600 mb-6">
            Browse all our products or get in touch for custom orders
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/all-pottery">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                View All Products
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ProductFooter />
    </div>
  )
}