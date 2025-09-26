import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/service'

const supabase = createClient()

async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return false
  }
  return true
}

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

// GET - Fetch all categories
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const includeProductCount = searchParams.get('include_product_count') === 'true'
    const parentId = searchParams.get('parent_id')

    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (parentId) {
      query = query.eq('parent_id', parentId)
    }

    const { data: categories, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    // If requested, include product count for each category
    if (includeProductCount && categories) {
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)

          return {
            ...category,
            productCount: count || 0
          }
        })
      )

      return NextResponse.json({
        success: true,
        categories: categoriesWithCount
      })
    }

    return NextResponse.json({
      success: true,
      categories: categories || []
    })

  } catch (error) {
    console.error('Admin categories GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      name,
      description,
      image_url,
      parent_id,
      sort_order = 0,
      is_active = true,
      meta_title,
      meta_description
    } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({
        error: 'Category name is required'
      }, { status: 400 })
    }

    // Generate slug from name
    const slug = generateSlug(name)

    // Check if slug already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('slug', slug)
      .single()

    if (existingCategory) {
      return NextResponse.json({
        error: 'Category with similar name already exists'
      }, { status: 400 })
    }

    // Prepare category data
    const categoryData = {
      name,
      slug,
      description,
      image_url,
      parent_id: parent_id || null,
      sort_order: parseInt(sort_order),
      is_active,
      meta_title: meta_title || name,
      meta_description: meta_description || description
    }

    // Insert category
    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to create category',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: newCategory
    }, { status: 201 })

  } catch (error) {
    console.error('Admin categories POST error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Update category
export async function PUT(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    // Check if category exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('id', id)
      .single()

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // If name is being updated, generate new slug
    if (updateData.name && updateData.name !== existingCategory.name) {
      updateData.slug = generateSlug(updateData.name)
    }

    // Convert numeric fields
    if (updateData.sort_order !== undefined) {
      updateData.sort_order = parseInt(updateData.sort_order)
    }

    // Update category
    const { data: updatedCategory, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to update category',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    })

  } catch (error) {
    console.error('Admin categories PUT error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    // Check if category exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id, name')
      .eq('id', id)
      .single()

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if category has products
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id)

    if (productCount && productCount > 0) {
      return NextResponse.json({
        error: `Cannot delete category. It contains ${productCount} products.`
      }, { status: 400 })
    }

    // Check if category has subcategories
    const { count: subcategoryCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('parent_id', id)

    if (subcategoryCount && subcategoryCount > 0) {
      return NextResponse.json({
        error: `Cannot delete category. It contains ${subcategoryCount} subcategories.`
      }, { status: 400 })
    }

    // Delete category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to delete category',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      category: existingCategory
    })

  } catch (error) {
    console.error('Admin categories DELETE error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}