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

export async function GET(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const { data: recentUsers, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        user_type,
        created_at,
        loyalty_points
      `)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch recent users' }, { status: 500 })
    }

    // Format the users data
    const formattedUsers = recentUsers?.map(user => ({
      id: user.id,
      name: user.full_name || user.email?.split('@')[0] || 'Anonymous User',
      email: user.email || 'No email',
      type: user.user_type === 'admin' ? 'Admin' : user.user_type === 'business' ? 'B2B' : 'Customer',
      joined: new Date(user.created_at).toLocaleDateString('en-IN'),
      loyaltyPoints: user.loyalty_points || 0
    })) || []

    return NextResponse.json({
      success: true,
      users: formattedUsers
    })

  } catch (error) {
    console.error('Recent users API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}