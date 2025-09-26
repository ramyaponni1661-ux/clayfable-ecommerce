import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/service'

const supabase = createClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({
        isAdmin: false,
        error: 'Not authenticated'
      }, { status: 401 })
    }

    // Check if user exists in profiles table with admin privileges
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('user_type, email, full_name, is_email_verified, created_at')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('Profile lookup error:', error)

      // Handle case where profile doesn't exist yet
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          isAdmin: false,
          error: 'Profile not found - please complete registration',
          needsProfileSetup: true
        }, { status: 403 })
      }

      return NextResponse.json({
        isAdmin: false,
        error: 'Database error during profile lookup'
      }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({
        isAdmin: false,
        error: 'Profile not found'
      }, { status: 403 })
    }

    const isAdmin = profile.user_type === 'admin'

    // Additional security: log admin access attempts
    if (isAdmin) {
      console.log(`Admin access granted for user: ${profile.email} at ${new Date().toISOString()}`)
    } else {
      console.log(`Admin access denied for user: ${profile.email} - user_type: ${profile.user_type}`)
    }

    return NextResponse.json({
      isAdmin,
      user: {
        id: session.user.id,
        email: profile.email,
        name: profile.full_name,
        userType: profile.user_type,
        isEmailVerified: profile.is_email_verified,
        memberSince: profile.created_at
      },
      ...(isAdmin && {
        permissions: {
          canManageProducts: true,
          canManageOrders: true,
          canManageUsers: true,
          canViewAnalytics: true,
          canManageSettings: true
        }
      })
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({
      isAdmin: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Optional: Add POST method for admin privilege elevation requests
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({
        error: 'Not authenticated'
      }, { status: 401 })
    }

    const { action } = await request.json()

    if (action === 'request_admin_access') {
      // Log admin access request for security review
      console.log(`Admin access requested by user: ${session.user.email} at ${new Date().toISOString()}`)

      // You could add logic here to:
      // - Send notification to existing admins
      // - Create a pending request record
      // - Send email notification

      return NextResponse.json({
        success: true,
        message: 'Admin access request has been logged. Please contact an administrator.'
      })
    }

    return NextResponse.json({
      error: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Admin request error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}