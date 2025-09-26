// app/api/admin/init-db/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/service'

const supabase = createClient()

// Helper function to check admin privileges
async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', session.user.id)
    .single()

  return profile?.user_type === 'admin'
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 403 })
    }

    const results = []

    // 1. Insert sample categories if they don't exist
    const sampleCategories = [
      {
        name: 'Terracotta Cookware',
        slug: 'terracotta-cookware',
        description: 'Traditional clay cooking vessels and pots',
        is_active: true,
        sort_order: 1
      },
      {
        name: 'Decorative Items',
        slug: 'decorative-items',
        description: 'Beautiful terracotta decorations for home',
        is_active: true,
        sort_order: 2
      },
      {
        name: 'Garden Pots',
        slug: 'garden-pots',
        description: 'Eco-friendly pots for your garden plants',
        is_active: true,
        sort_order: 3
      }
    ]

    for (const category of sampleCategories) {
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category.slug)
        .single()

      if (!existing) {
        const { data: newCategory, error } = await supabase
          .from('categories')
          .insert({
            ...category,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) {
          results.push({ category: category.name, success: false, error: error.message })
        } else {
          results.push({ category: category.name, success: true, id: newCategory.id })
        }
      } else {
        results.push({ category: category.name, success: true, status: 'already exists' })
      }
    }

    // 2. Insert sample products if categories exist
    const { data: categories } = await supabase
      .from('categories')
      .select('id, slug')

    if (categories && categories.length > 0) {
      const cookwareCat = categories.find(c => c.slug === 'terracotta-cookware')
      const decorCat = categories.find(c => c.slug === 'decorative-items')
      const gardenCat = categories.find(c => c.slug === 'garden-pots')

      const sampleProducts = [
        {
          name: 'Traditional Clay Pot',
          slug: 'traditional-clay-pot',
          description: 'Handcrafted traditional terracotta cooking pot, perfect for slow cooking and retaining nutrients.',
          short_description: 'Handcrafted traditional terracotta cooking pot',
          sku: 'TCP001',
          price: 450,
          compare_price: 550,
          inventory_quantity: 25,
          category_id: cookwareCat?.id,
          is_active: true,
          is_featured: true,
          tags: ['traditional', 'cookware', 'handmade'],
          care_instructions: 'Wash with mild soap, air dry completely before storing',
          track_inventory: true,
          low_stock_threshold: 5
        },
        {
          name: 'Decorative Terracotta Vase',
          slug: 'decorative-terracotta-vase',
          description: 'Elegant terracotta vase with intricate patterns, perfect for home decoration.',
          short_description: 'Elegant decorative terracotta vase',
          sku: 'DTV001',
          price: 890,
          compare_price: 1200,
          inventory_quantity: 15,
          category_id: decorCat?.id,
          is_active: true,
          is_featured: false,
          tags: ['decorative', 'vase', 'patterns'],
          care_instructions: 'Clean with dry cloth, avoid direct water contact',
          track_inventory: true,
          low_stock_threshold: 3
        },
        {
          name: 'Garden Planter Set',
          slug: 'garden-planter-set',
          description: 'Set of 3 eco-friendly terracotta planters in different sizes for your garden.',
          short_description: 'Set of 3 eco-friendly terracotta planters',
          sku: 'GPS001',
          price: 1200,
          compare_price: 1500,
          inventory_quantity: 30,
          category_id: gardenCat?.id,
          is_active: true,
          is_featured: true,
          tags: ['garden', 'planter', 'eco-friendly', 'set'],
          care_instructions: 'Ensure proper drainage, suitable for outdoor use',
          track_inventory: true,
          low_stock_threshold: 8
        }
      ]

      for (const product of sampleProducts) {
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('sku', product.sku)
          .single()

        if (!existingProduct && product.category_id) {
          const { data: newProduct, error } = await supabase
            .from('products')
            .insert({
              ...product,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (error) {
            results.push({ product: product.name, success: false, error: error.message })
          } else {
            results.push({ product: product.name, success: true, id: newProduct.id })
          }
        } else {
          results.push({
            product: product.name,
            success: true,
            status: existingProduct ? 'already exists' : 'no category found'
          })
        }
      }
    }

    // 3. Log the initialization
    console.log(`Database initialized by admin at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: 'Database initialization completed',
      results,
      summary: {
        categories: results.filter(r => r.category).length,
        products: results.filter(r => r.product).length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    })

  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database initialization failed'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Check database status - this can be public for monitoring
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name, is_active')
      .limit(10)

    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name, is_active')
      .limit(10)

    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('id, user_type, created_at')
      .eq('user_type', 'admin')

    // Count active vs inactive
    const activeCategories = categories?.filter(c => c.is_active).length || 0
    const activeProducts = products?.filter(p => p.is_active).length || 0

    return NextResponse.json({
      success: true,
      status: {
        categories: {
          total: categories?.length || 0,
          active: activeCategories,
          inactive: (categories?.length || 0) - activeCategories,
          error: catError?.message
        },
        products: {
          total: products?.length || 0,
          active: activeProducts,
          inactive: (products?.length || 0) - activeProducts,
          error: prodError?.message
        },
        admins: {
          count: profiles?.length || 0,
          error: profError?.message,
          lastCreated: profiles?.[0]?.created_at
        },
        lastCheck: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Database status check error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}