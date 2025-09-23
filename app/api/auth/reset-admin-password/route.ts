import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json({
        success: false,
        error: 'Email and new password are required'
      }, { status: 400 })
    }

    // Check if user exists in auth.users
    const { data: user, error: getUserError } = await supabaseAdmin.auth.admin.listUsers()

    if (getUserError) {
      return NextResponse.json({
        success: false,
        error: getUserError.message
      }, { status: 500 })
    }

    const targetUser = user.users.find(u => u.email === email)

    if (!targetUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found in auth system'
      }, { status: 404 })
    }

    // Update user password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUser.id,
      { password: newPassword }
    )

    if (updateError) {
      return NextResponse.json({
        success: false,
        error: updateError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Password updated successfully for ${email}`
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}