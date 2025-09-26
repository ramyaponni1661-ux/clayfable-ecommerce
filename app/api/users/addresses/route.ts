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

// GET - Get user addresses
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      addresses: addresses || []
    })

  } catch (error) {
    console.error('Addresses GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      type = 'shipping',
      first_name,
      last_name,
      company,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
      phone,
      is_default = false
    } = body

    // Validate required fields
    if (!first_name || !last_name || !address_line_1 || !city || !state || !postal_code || !country) {
      return NextResponse.json({
        error: 'Missing required fields: first_name, last_name, address_line_1, city, state, postal_code, country'
      }, { status: 400 })
    }

    // If this address is being set as default, unset other default addresses
    if (is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('type', type)
    }

    // Create new address
    const { data: newAddress, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        type,
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        company: company?.trim() || null,
        address_line_1: address_line_1.trim(),
        address_line_2: address_line_2?.trim() || null,
        city: city.trim(),
        state: state.trim(),
        postal_code: postal_code.trim(),
        country: country.trim(),
        phone: phone?.trim() || null,
        is_default,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to create address',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Address created successfully',
      address: newAddress
    }, { status: 201 })

  } catch (error) {
    console.error('Addresses POST error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Update address
export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 })
    }

    // Check if address exists and belongs to user
    const { data: existingAddress } = await supabase
      .from('addresses')
      .select('id, user_id, type')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // If this address is being set as default, unset other default addresses
    if (updateData.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('type', existingAddress.type)
        .neq('id', id)
    }

    // Trim string values
    Object.keys(updateData).forEach(key => {
      if (typeof updateData[key] === 'string') {
        updateData[key] = updateData[key].trim() || null
      }
    })

    updateData.updated_at = new Date().toISOString()

    // Update address
    const { data: updatedAddress, error } = await supabase
      .from('addresses')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to update address',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      address: updatedAddress
    })

  } catch (error) {
    console.error('Addresses PUT error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Delete address
export async function DELETE(request: NextRequest) {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 })
    }

    // Check if address exists and belongs to user
    const { data: existingAddress } = await supabase
      .from('addresses')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // Delete address
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        error: 'Failed to delete address',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })

  } catch (error) {
    console.error('Addresses DELETE error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}