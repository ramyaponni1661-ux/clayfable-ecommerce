import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'
import { createClient as createServiceClient } from '@/lib/supabase/service'

// Helper function to check admin privileges
async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return false

  const supabase = createServiceClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', session.user.id)
    .single()

  return profile?.user_type === 'admin'
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const includeProductCount = searchParams.get('include_product_count') === 'true'
    const parentId = searchParams.get('parent_id')
    const active = searchParams.get('active') !== 'false' // default to true

    // Build the query
    let query = supabase
      .from('categories')
      .select('*')

    if (active) {
      query = query.eq('is_active', true)
    }

    if (parentId) {
      query = query.eq('parent_id', parentId)
    } else {
      // Get only top-level categories by default
      query = query.is('parent_id', null)
    }

    query = query.order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    const { data: categories, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    // If requested, include product count for each category
    if (includeProductCount && categories) {
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('is_active', true)

          return {
            ...category,
            productCount: count || 0
          }
        })
      )

      return NextResponse.json({
        success: true,
        data: categoriesWithCount
      })
    }

    return NextResponse.json({
      success: true,
      data: categories || []
    })

  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
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

    const supabase = createServiceClient()
    const body = await request.json()
    const {
      name,
      slug,
      description,
      meta_title,
      meta_description,
      sort_order,
      is_active,
      parent_id
    } = body

    if (!name || !slug) {
      return NextResponse.json({
        success: false,
        error: 'Name and slug are required'
      }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'A category with this slug already exists'
      }, { status: 400 })
    }

    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description: description || null,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        sort_order: sort_order || 0,
        is_active: is_active !== false, // Default to true
        parent_id: parent_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create category:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to create category'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Category created successfully'
    })

  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('id')

    if (!categoryId) {
      return NextResponse.json({
        success: false,
        error: 'Category ID is required'
      }, { status: 400 })
    }

    const supabase = createServiceClient()
    const body = await request.json()
    const {
      name,
      slug,
      description,
      meta_title,
      meta_description,
      sort_order,
      is_active,
      parent_id
    } = body

    if (!name || !slug) {
      return NextResponse.json({
        success: false,
        error: 'Name and slug are required'
      }, { status: 400 })
    }

    // Check if slug already exists for a different category
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .neq('id', categoryId)
      .single()

    if (existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'A category with this slug already exists'
      }, { status: 400 })
    }

    const { data: updatedCategory, error } = await supabase
      .from('categories')
      .update({
        name,
        slug,
        description,
        meta_title,
        meta_description,
        sort_order,
        is_active,
        parent_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', categoryId)
      .select()
      .single()

    if (error) {
      console.error('Failed to update category:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to update category'
      }, { status: 500 })
    }

    if (!updatedCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    })

  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('id')

    if (!categoryId) {
      return NextResponse.json({
        success: false,
        error: 'Category ID is required'
      }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Check if category has products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', categoryId)
      .limit(1)

    if (productsError) {
      console.error('Error checking category products:', productsError)
      return NextResponse.json({
        success: false,
        error: 'Failed to check category usage'
      }, { status: 500 })
    }

    if (products && products.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete category with existing products. Move or delete products first.'
      }, { status: 400 })
    }

    // Check if category has subcategories
    const { data: subcategories, error: subcategoriesError } = await supabase
      .from('categories')
      .select('id')
      .eq('parent_id', categoryId)
      .limit(1)

    if (subcategoriesError) {
      console.error('Error checking subcategories:', subcategoriesError)
      return NextResponse.json({
        success: false,
        error: 'Failed to check subcategories'
      }, { status: 500 })
    }

    if (subcategories && subcategories.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete category with subcategories. Move or delete subcategories first.'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) {
      console.error('Failed to delete category:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to delete category'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })

  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}