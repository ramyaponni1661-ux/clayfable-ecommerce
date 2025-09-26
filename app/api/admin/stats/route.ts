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
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

    // Get today's revenue from completed orders
    const { data: todayOrders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid')
      .gte('created_at', todayStart.toISOString())
      .lt('created_at', todayEnd.toISOString())

    if (ordersError) throw ordersError

    const todayRevenue = todayOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

    // Get active orders (pending, confirmed, processing, shipped)
    const { data: activeOrders, error: activeOrdersError } = await supabase
      .from('orders')
      .select('id')
      .in('status', ['pending', 'confirmed', 'processing', 'shipped'])

    if (activeOrdersError) throw activeOrdersError

    const activeOrdersCount = activeOrders?.length || 0

    // Get total product inventory
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('inventory_quantity')
      .eq('is_active', true)

    if (productsError) throw productsError

    const totalInventory = products?.reduce((sum, product) => sum + (product.inventory_quantity || 0), 0) || 0

    // Get online users (users with recent activity - last 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)

    // Since we don't have a last_seen column, we'll use recent cart activity as a proxy
    const { data: recentCartActivity, error: cartError } = await supabase
      .from('cart_items')
      .select('user_id')
      .gte('updated_at', fifteenMinutesAgo.toISOString())

    if (cartError) throw cartError

    // Count unique users with recent activity
    const uniqueActiveUsers = new Set(recentCartActivity?.map(item => item.user_id) || [])
    const onlineUsersCount = uniqueActiveUsers.size

    // Get recent activity (last 20 activities)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    // Get recent orders
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select('id, order_number, total_amount, created_at, status')
      .gte('created_at', oneHourAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(10)

    if (recentOrdersError) throw recentOrdersError

    // Get recent user registrations
    const { data: recentUsers, error: recentUsersError } = await supabase
      .from('profiles')
      .select('id, full_name, created_at')
      .gte('created_at', oneHourAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentUsersError) throw recentUsersError

    // Combine and format recent activities
    const recentActivity = []

    // Add recent orders
    recentOrders?.forEach(order => {
      const timeAgo = getTimeAgo(new Date(order.created_at))
      recentActivity.push({
        time: timeAgo,
        action: `New order #${order.order_number} - ₹${order.total_amount}`,
        type: 'order',
        id: order.id
      })
    })

    // Add recent user registrations
    recentUsers?.forEach(user => {
      const timeAgo = getTimeAgo(new Date(user.created_at))
      recentActivity.push({
        time: timeAgo,
        action: `New user registered: ${user.full_name || 'Anonymous'}`,
        type: 'user',
        id: user.id
      })
    })

    // Sort by most recent
    recentActivity.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

    // Get system uptime (calculated from when the server started)
    const uptimeHours = Math.floor(process.uptime() / 3600)
    const uptimeMinutes = Math.floor((process.uptime() % 3600) / 60)
    const uptime = `${uptimeHours}h ${uptimeMinutes}m`

    return NextResponse.json({
      success: true,
      stats: {
        todayRevenue,
        activeOrders: activeOrdersCount,
        onlineUsers: onlineUsersCount,
        totalInventory,
        recentActivity: recentActivity.slice(0, 10),
        systemHealth: {
          status: 'operational',
          uptime: uptime,
          dbConnected: true
        }
      }
    })

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
}