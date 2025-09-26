import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/service'

const supabase = createClient()

export async function GET(request: NextRequest) {
  try {
    // Get all active categories with their products
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        products!inner (
          id,
          name,
          slug,
          price,
          is_featured,
          is_active
        )
      `)
      .eq('is_active', true)
      .eq('products.is_active', true)

    if (categoriesError) throw categoriesError

    // Get featured collections (featured products grouped by category)
    const { data: featuredProducts, error: featuredError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        category_id,
        categories!inner (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(20)

    if (featuredError) throw featuredError

    // Transform categories for navigation dropdown
    const productCategories = categories?.map(category => ({
      name: category.name,
      href: `/category/${category.slug}`,
      items: category.products?.slice(0, 6).map((product: any) => ({
        name: product.name,
        href: `/products/${product.slug}`,
        description: `₹${product.price?.toLocaleString('en-IN') || '0'}`,
        price: product.price
      })) || []
    })) || []

    // Group featured products by category for collections
    const collectionMap = new Map()
    featuredProducts?.forEach((product: any) => {
      const categoryName = product.categories?.name
      if (categoryName) {
        if (!collectionMap.has(categoryName)) {
          collectionMap.set(categoryName, {
            name: `Featured ${categoryName}`,
            href: `/category/${product.categories.slug}?featured=true`,
            items: []
          })
        }
        collectionMap.get(categoryName).items.push({
          name: product.name,
          href: `/products/${product.slug}`,
          description: `₹${product.price?.toLocaleString('en-IN') || '0'}`,
          price: product.price
        })
      }
    })

    const collections = Array.from(collectionMap.values()).slice(0, 4)

    // Add default collections if no featured products exist
    if (collections.length === 0) {
      const { data: defaultProducts, error: defaultError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          categories!inner (
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(12)

      if (!defaultError && defaultProducts) {
        collections.push({
          name: "New Arrivals",
          href: "/products?sort=newest",
          items: defaultProducts.slice(0, 3).map((product: any) => ({
            name: product.name,
            href: `/products/${product.slug}`,
            description: `₹${product.price?.toLocaleString('en-IN') || '0'}`,
            price: product.price
          }))
        })
      }
    }

    return NextResponse.json({
      success: true,
      navigation: {
        productCategories,
        collections
      }
    })

  } catch (error) {
    console.error('Navigation API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch navigation data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}