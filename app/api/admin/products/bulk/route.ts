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

// GET - Fetch multiple products by IDs
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const productIds = searchParams.get('ids')?.split(',') || []

    if (productIds.length === 0) {
      return NextResponse.json({ error: 'No product IDs provided' }, { status: 400 })
    }

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        sku,
        price,
        compare_price,
        inventory_quantity,
        is_active,
        track_inventory,
        images,
        description,
        category_id,
        categories (
          id,
          name,
          slug
        ),
        created_at,
        updated_at
      `)
      .in('id', productIds)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      products: products || [],
      count: products?.length || 0
    })

  } catch (error) {
    console.error('Bulk products GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Bulk operations on products
export async function POST(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { operation, product_ids, data } = body

    if (!operation || !product_ids || !Array.isArray(product_ids)) {
      return NextResponse.json({
        error: 'Operation, product_ids array is required'
      }, { status: 400 })
    }

    let results = []
    let successCount = 0
    let errorCount = 0

    switch (operation) {
      case 'bulk_update':
        for (const productId of product_ids) {
          try {
            const { error } = await supabase
              .from('products')
              .update({
                ...data,
                updated_at: new Date().toISOString()
              })
              .eq('id', productId)

            if (error) throw error
            successCount++
          } catch (error) {
            console.error(`Error updating product ${productId}:`, error)
            errorCount++
            results.push({ product_id: productId, error: 'Update failed' })
          }
        }
        break

      case 'bulk_activate':
        for (const productId of product_ids) {
          try {
            const { error } = await supabase
              .from('products')
              .update({
                is_active: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', productId)

            if (error) throw error
            successCount++
          } catch (error) {
            console.error(`Error activating product ${productId}:`, error)
            errorCount++
            results.push({ product_id: productId, error: 'Activation failed' })
          }
        }
        break

      case 'bulk_deactivate':
        for (const productId of product_ids) {
          try {
            const { error } = await supabase
              .from('products')
              .update({
                is_active: false,
                updated_at: new Date().toISOString()
              })
              .eq('id', productId)

            if (error) throw error
            successCount++
          } catch (error) {
            console.error(`Error deactivating product ${productId}:`, error)
            errorCount++
            results.push({ product_id: productId, error: 'Deactivation failed' })
          }
        }
        break

      case 'bulk_delete':
        for (const productId of product_ids) {
          try {
            // First check if product has orders
            const { data: orderItems, error: checkError } = await supabase
              .from('order_items')
              .select('id')
              .eq('product_id', productId)
              .limit(1)

            if (checkError) throw checkError

            if (orderItems && orderItems.length > 0) {
              results.push({
                product_id: productId,
                error: 'Cannot delete product with existing orders'
              })
              errorCount++
              continue
            }

            // Delete product variants first
            await supabase
              .from('product_variants')
              .delete()
              .eq('product_id', productId)

            // Delete cart items
            await supabase
              .from('cart_items')
              .delete()
              .eq('product_id', productId)

            // Delete the product
            const { error } = await supabase
              .from('products')
              .delete()
              .eq('id', productId)

            if (error) throw error
            successCount++
          } catch (error) {
            console.error(`Error deleting product ${productId}:`, error)
            errorCount++
            results.push({ product_id: productId, error: 'Deletion failed' })
          }
        }
        break

      default:
        return NextResponse.json({
          error: 'Invalid operation. Supported: bulk_update, bulk_activate, bulk_deactivate, bulk_delete'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Bulk ${operation} completed`,
      results: {
        total_processed: product_ids.length,
        successful: successCount,
        failed: errorCount,
        errors: results
      }
    })

  } catch (error) {
    console.error('Bulk products POST error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Bulk update inventory
export async function PUT(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { inventory_updates } = body

    if (!inventory_updates || !Array.isArray(inventory_updates)) {
      return NextResponse.json({
        error: 'inventory_updates array is required'
      }, { status: 400 })
    }

    let successCount = 0
    let errorCount = 0
    const results = []

    for (const update of inventory_updates) {
      const { product_id, inventory_quantity } = update

      if (!product_id || inventory_quantity === undefined) {
        errorCount++
        results.push({ product_id, error: 'Missing product_id or inventory_quantity' })
        continue
      }

      try {
        const { error } = await supabase
          .from('products')
          .update({
            inventory_quantity: parseInt(inventory_quantity),
            updated_at: new Date().toISOString()
          })
          .eq('id', product_id)

        if (error) throw error
        successCount++
      } catch (error) {
        console.error(`Error updating inventory for product ${product_id}:`, error)
        errorCount++
        results.push({ product_id, error: 'Inventory update failed' })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bulk inventory update completed',
      results: {
        total_processed: inventory_updates.length,
        successful: successCount,
        failed: errorCount,
        errors: results
      }
    })

  } catch (error) {
    console.error('Bulk inventory PUT error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}