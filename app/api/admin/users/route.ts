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

// GET - Fetch users with optional filtering and cart information
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const include_cart = searchParams.get('include_cart') === 'true'

    // Build the query for users
    let query = supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        phone,
        avatar_url,
        user_type,
        loyalty_points,
        is_email_verified,
        is_phone_verified,
        created_at,
        updated_at
      `)

    // Apply search filter
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Apply pagination and sorting
    query = query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    const { data: users, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // If cart information is requested, fetch cart items for each user
    if (include_cart && users) {
      for (const user of users) {
        try {
          const { data: cartItems } = await supabase
            .from('cart_items')
            .select(`
              id,
              quantity,
              products (price),
              product_variants (price)
            `)
            .eq('user_id', user.id)

          let cartTotal = 0
          let itemCount = 0

          cartItems?.forEach(item => {
            const price = item.product_variants?.price || item.products.price
            cartTotal += price * item.quantity
            itemCount += item.quantity
          })

          user.cart_summary = {
            item_count: itemCount,
            total_value: cartTotal
          }
        } catch (cartError) {
          console.error(`Error fetching cart for user ${user.id}:`, cartError)
          user.cart_summary = { item_count: 0, total_value: 0 }
        }
      }
    }

    return NextResponse.json({
      success: true,
      users: users || [],
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: (offset + limit) < (count || 0)
      }
    })

  } catch (error) {
    console.error('Users GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new user or bulk operations
export async function POST(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { operation, user_data, user_ids } = body

    if (!operation) {
      return NextResponse.json({ error: 'Operation is required' }, { status: 400 })
    }

    switch (operation) {
      case 'create_user':
        if (!user_data || !user_data.email || !user_data.full_name) {
          return NextResponse.json({
            error: 'email and full_name are required'
          }, { status: 400 })
        }

        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user_data.email)
          .single()

        if (existingUser) {
          return NextResponse.json({
            error: 'User with this email already exists'
          }, { status: 409 })
        }

        // Create new user profile
        const { data: newUser, error: createError } = await supabase
          .from('profiles')
          .insert({
            email: user_data.email,
            full_name: user_data.full_name,
            phone: user_data.phone || null,
            user_type: user_data.user_type || 'customer',
            loyalty_points: user_data.loyalty_points || 0,
            is_email_verified: user_data.is_email_verified || false,
            is_phone_verified: user_data.is_phone_verified || false
          })
          .select()
          .single()

        if (createError) {
          console.error('User creation error details:', JSON.stringify(createError, null, 2))
          console.error('User creation error message:', createError.message)
          console.error('User creation error code:', createError.code)
          return NextResponse.json({
            error: 'Failed to create user',
            details: createError.message
          }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          message: 'User created successfully',
          user: newUser
        }, { status: 201 })

      case 'bulk_update_status':
        if (!user_ids || !Array.isArray(user_ids)) {
          return NextResponse.json({
            error: 'user_ids array is required'
          }, { status: 400 })
        }

        const { user_type, loyalty_points, is_email_verified, is_phone_verified } = body
        const updateData = {}

        if (user_type !== undefined) {
          updateData.user_type = user_type
        }
        if (loyalty_points !== undefined) {
          updateData.loyalty_points = loyalty_points
        }
        if (is_email_verified !== undefined) {
          updateData.is_email_verified = is_email_verified
        }
        if (is_phone_verified !== undefined) {
          updateData.is_phone_verified = is_phone_verified
        }

        if (Object.keys(updateData).length === 0) {
          return NextResponse.json({
            error: 'At least one update field must be provided'
          }, { status: 400 })
        }

        updateData.updated_at = new Date().toISOString()

        let successCount = 0
        let errorCount = 0
        const results = []

        for (const userId of user_ids) {
          try {
            const { error } = await supabase
              .from('profiles')
              .update(updateData)
              .eq('id', userId)

            if (error) throw error
            successCount++
          } catch (error) {
            console.error(`Error updating user ${userId}:`, error)
            errorCount++
            results.push({ user_id: userId, error: 'Update failed' })
          }
        }

        return NextResponse.json({
          success: true,
          message: 'Bulk user update completed',
          results: {
            total_processed: user_ids.length,
            successful: successCount,
            failed: errorCount,
            errors: results
          }
        })

      default:
        return NextResponse.json({
          error: 'Invalid operation. Supported: create_user, bulk_update_status'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Users POST error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Update user information
export async function PUT(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { user_id, ...updateData } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    // Remove any fields that shouldn't be updated directly
    delete updateData.id
    delete updateData.created_at
    updateData.updated_at = new Date().toISOString()

    const { data: updatedUser, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user_id)
      .select(`
        id,
        email,
        full_name,
        phone,
        avatar_url,
        user_type,
        loyalty_points,
        is_email_verified,
        is_phone_verified,
        updated_at
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to update user',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Users PUT error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Delete users (soft delete recommended)
export async function DELETE(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { user_ids } = body

    if (!user_ids || !Array.isArray(user_ids)) {
      return NextResponse.json({
        error: 'user_ids array is required'
      }, { status: 400 })
    }

    let successCount = 0
    let errorCount = 0
    const results = []

    for (const userId of user_ids) {
      try {
        // Check if user has orders (should not delete users with orders)
        const { data: orders, error: orderCheckError } = await supabase
          .from('orders')
          .select('id')
          .eq('user_id', userId)
          .limit(1)

        if (orderCheckError) throw orderCheckError

        if (orders && orders.length > 0) {
          results.push({
            user_id: userId,
            error: 'Cannot delete user with existing orders. Consider deactivating instead.'
          })
          errorCount++
          continue
        }

        // Delete user's cart items first
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId)

        // Delete user's addresses
        await supabase
          .from('addresses')
          .delete()
          .eq('user_id', userId)

        // Delete user profile
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId)

        if (error) throw error
        successCount++
      } catch (error) {
        console.error(`Error deleting user ${userId}:`, error)
        errorCount++
        results.push({ user_id: userId, error: 'Deletion failed' })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bulk user deletion completed',
      results: {
        total_processed: user_ids.length,
        successful: successCount,
        failed: errorCount,
        errors: results
      }
    })

  } catch (error) {
    console.error('Users DELETE error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}