import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/service'

const supabase = createClient()

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return null
  }
  return session.user
}

// GET - Get user cart
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
    }

    // Calculate totals
    let subtotal = 0
    let totalItems = 0
    const validCartItems = cartItems?.filter(item => {
      // Check if product is still active and in stock
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
      cart: {
        items: validCartItems,
        subtotal,
        totalItems,
        tax: subtotal * 0.18, // 18% GST
        shipping: subtotal >= 1499 ? 0 : 99, // Free shipping above ₹1499
        total: subtotal + (subtotal * 0.18) + (subtotal >= 1499 ? 0 : 99)
      }
    })

  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { product_id, variant_id, quantity = 1 } = body

    if (!product_id || quantity < 1) {
      return NextResponse.json({
        error: 'Product ID and valid quantity are required'
      }, { status: 400 })
    }

    // Verify product exists and is active
    const { data: product } = await supabase
      .from('products')
      .select('id, name, price, inventory_quantity, is_active, track_inventory')
      .eq('id', product_id)
      .eq('is_active', true)
      .single()

    if (!product) {
      return NextResponse.json({ error: 'Product not found or unavailable' }, { status: 404 })
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
        return NextResponse.json({ error: 'Product variant not found or unavailable' }, { status: 404 })
      }

      // Check stock for variant
      if (product.track_inventory && variant.inventory_quantity < quantity) {
        return NextResponse.json({ error: 'Insufficient stock for this variant' }, { status: 400 })
      }
    } else {
      // Check stock for main product
      if (product.track_inventory && product.inventory_quantity < quantity) {
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
      }
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
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
        return NextResponse.json({ error: 'Insufficient stock for requested quantity' }, { status: 400 })
      }

      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
      }
    } else {
      // Add new item to cart
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id,
          variant_id: variant_id || null,
          quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to cart successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { item_id, quantity } = body

    if (!item_id || quantity < 0) {
      return NextResponse.json({
        error: 'Item ID and valid quantity are required'
      }, { status: 400 })
    }

    // If quantity is 0, delete the item
    if (quantity === 0) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', item_id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart successfully'
      })
    }

    // Get cart item details
    const { data: cartItem } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        variant_id,
        products (
          track_inventory,
          inventory_quantity
        ),
        product_variants (
          inventory_quantity
        )
      `)
      .eq('id', item_id)
      .eq('user_id', user.id)
      .single()

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    // Check stock availability
    if (cartItem.products.track_inventory) {
      const stockToCheck = cartItem.variant_id
        ? cartItem.product_variants?.inventory_quantity
        : cartItem.products.inventory_quantity

      if (stockToCheck && stockToCheck < quantity) {
        return NextResponse.json({ error: 'Insufficient stock for requested quantity' }, { status: 400 })
      }
    }

    // Update quantity
    const { error } = await supabase
      .from('cart_items')
      .update({
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', item_id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Cart item updated successfully'
    })

  } catch (error) {
    console.error('Cart PUT error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Remove item from cart or clear cart
export async function DELETE(request: NextRequest) {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('item_id')
    const clearAll = searchParams.get('clear_all') === 'true'

    if (clearAll) {
      // Clear entire cart
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Cart cleared successfully'
      })
    }

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    // Remove specific item
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully'
    })

  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}