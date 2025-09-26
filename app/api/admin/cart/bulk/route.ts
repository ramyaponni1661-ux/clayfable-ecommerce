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

// GET - View multiple users' carts or specific user cart
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (userId) {
      // Get specific user's cart
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          variant_id,
          created_at,
          products (
            id,
            name,
            slug,
            price,
            compare_price,
            images,
            inventory_quantity,
            is_active
          ),
          product_variants (
            id,
            name,
            sku,
            price,
            compare_price,
            inventory_quantity,
            is_active
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
      }

      // Calculate cart totals
      let subtotal = 0
      let totalItems = 0
      const validCartItems = cartItems?.filter(item => {
        if (item.variant_id && item.product_variants) {
          const variant = item.product_variants
          if (!variant.is_active || variant.inventory_quantity < item.quantity) {
            return false
          }
          subtotal += (variant.price || item.products.price) * item.quantity
        } else {
          if (!item.products.is_active || item.products.inventory_quantity < item.quantity) {
            return false
          }
          subtotal += item.products.price * item.quantity
        }
        totalItems += item.quantity
        return true
      }) || []

      return NextResponse.json({
        success: true,
        user_id: userId,
        cart: {
          items: validCartItems,
          subtotal,
          totalItems,
          tax: subtotal * 0.18, // 18% GST
          shipping: subtotal >= 1499 ? 0 : 99,
          total: subtotal + (subtotal * 0.18) + (subtotal >= 1499 ? 0 : 99)
        }
      })
    } else {
      // Get all users with cart items
      const { data: cartSummary, error } = await supabase
        .from('cart_items')
        .select(`
          user_id,
          quantity,
          products (
            price
          ),
          product_variants (
            price
          )
        `)
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: 'Failed to fetch cart summary' }, { status: 500 })
      }

      // Group by user_id and calculate totals
      const userCarts = {}
      cartSummary?.forEach(item => {
        if (!userCarts[item.user_id]) {
          userCarts[item.user_id] = {
            user_id: item.user_id,
            total_items: 0,
            total_value: 0
          }
        }
        const price = item.product_variants?.price || item.products.price
        userCarts[item.user_id].total_items += item.quantity
        userCarts[item.user_id].total_value += price * item.quantity
      })

      return NextResponse.json({
        success: true,
        user_carts: Object.values(userCarts),
        pagination: { limit, offset }
      })
    }

  } catch (error) {
    console.error('Bulk cart GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Bulk add products to user carts
export async function POST(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { operation, user_ids, product_items } = body

    if (!operation || !user_ids || !Array.isArray(user_ids) || !product_items || !Array.isArray(product_items)) {
      return NextResponse.json({
        error: 'Operation, user_ids array, and product_items array are required'
      }, { status: 400 })
    }

    let totalSuccess = 0
    let totalErrors = 0
    const results = []

    switch (operation) {
      case 'bulk_add_to_cart':
        for (const userId of user_ids) {
          const userResults = {
            user_id: userId,
            added_items: [],
            errors: []
          }

          for (const productItem of product_items) {
            const { product_id, variant_id = null, quantity = 1 } = productItem

            if (!product_id || quantity < 1) {
              userResults.errors.push({ product_id, error: 'Invalid product_id or quantity' })
              totalErrors++
              continue
            }

            try {
              // Verify product exists and is active
              const { data: product } = await supabase
                .from('products')
                .select('id, name, price, inventory_quantity, is_active, track_inventory')
                .eq('id', product_id)
                .eq('is_active', true)
                .single()

              if (!product) {
                userResults.errors.push({ product_id, error: 'Product not found or unavailable' })
                totalErrors++
                continue
              }

              // If variant specified, verify it exists
              if (variant_id) {
                const { data: variant } = await supabase
                  .from('product_variants')
                  .select('id, inventory_quantity, is_active')
                  .eq('id', variant_id)
                  .eq('product_id', product_id)
                  .eq('is_active', true)
                  .single()

                if (!variant) {
                  userResults.errors.push({ product_id, variant_id, error: 'Product variant not found or unavailable' })
                  totalErrors++
                  continue
                }

                // Check stock for variant
                if (product.track_inventory && variant.inventory_quantity < quantity) {
                  userResults.errors.push({ product_id, variant_id, error: 'Insufficient stock for this variant' })
                  totalErrors++
                  continue
                }
              } else {
                // Check stock for main product
                if (product.track_inventory && product.inventory_quantity < quantity) {
                  userResults.errors.push({ product_id, error: 'Insufficient stock' })
                  totalErrors++
                  continue
                }
              }

              // Check if item already exists in user's cart
              const { data: existingItem } = await supabase
                .from('cart_items')
                .select('id, quantity')
                .eq('user_id', userId)
                .eq('product_id', product_id)
                .eq('variant_id', variant_id || null)
                .single()

              if (existingItem) {
                // Update existing item quantity
                const newQuantity = existingItem.quantity + quantity

                // Check stock again for new total quantity
                const stockToCheck = variant_id
                  ? (await supabase.from('product_variants').select('inventory_quantity').eq('id', variant_id).single()).data?.inventory_quantity
                  : product.inventory_quantity

                if (product.track_inventory && stockToCheck && stockToCheck < newQuantity) {
                  userResults.errors.push({ product_id, variant_id, error: 'Insufficient stock for requested quantity' })
                  totalErrors++
                  continue
                }

                const { error } = await supabase
                  .from('cart_items')
                  .update({
                    quantity: newQuantity,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', existingItem.id)

                if (error) throw error
              } else {
                // Add new item to cart
                const { error } = await supabase
                  .from('cart_items')
                  .insert({
                    user_id: userId,
                    product_id,
                    variant_id: variant_id || null,
                    quantity,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })

                if (error) throw error
              }

              userResults.added_items.push({
                product_id,
                variant_id,
                quantity,
                product_name: product.name
              })
              totalSuccess++

            } catch (error) {
              console.error(`Error adding product ${product_id} to cart for user ${userId}:`, error)
              userResults.errors.push({ product_id, variant_id, error: 'Failed to add to cart' })
              totalErrors++
            }
          }

          results.push(userResults)
        }
        break

      case 'bulk_clear_cart':
        for (const userId of user_ids) {
          try {
            const { error } = await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', userId)

            if (error) throw error
            totalSuccess++
            results.push({ user_id: userId, status: 'cleared' })
          } catch (error) {
            console.error(`Error clearing cart for user ${userId}:`, error)
            totalErrors++
            results.push({ user_id: userId, error: 'Failed to clear cart' })
          }
        }
        break

      default:
        return NextResponse.json({
          error: 'Invalid operation. Supported: bulk_add_to_cart, bulk_clear_cart'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Bulk ${operation} completed`,
      results: {
        total_users: user_ids.length,
        successful_operations: totalSuccess,
        failed_operations: totalErrors,
        details: results
      }
    })

  } catch (error) {
    console.error('Bulk cart POST error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Bulk remove items from carts
export async function DELETE(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { user_ids, product_ids } = body

    if (!user_ids || !Array.isArray(user_ids) || !product_ids || !Array.isArray(product_ids)) {
      return NextResponse.json({
        error: 'user_ids array and product_ids array are required'
      }, { status: 400 })
    }

    let successCount = 0
    let errorCount = 0
    const results = []

    for (const userId of user_ids) {
      for (const productId of product_ids) {
        try {
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId)

          if (error) throw error
          successCount++
        } catch (error) {
          console.error(`Error removing product ${productId} from user ${userId} cart:`, error)
          errorCount++
          results.push({ user_id: userId, product_id: productId, error: 'Removal failed' })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bulk cart item removal completed',
      results: {
        total_operations: user_ids.length * product_ids.length,
        successful: successCount,
        failed: errorCount,
        errors: results
      }
    })

  } catch (error) {
    console.error('Bulk cart DELETE error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}