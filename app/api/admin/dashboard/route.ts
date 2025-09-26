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
    // Get total revenue from all completed orders
    const { data: allOrders, error: allOrdersError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid')

    if (allOrdersError) throw allOrdersError

    const totalRevenue = allOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

    // Get total orders count
    const { data: ordersCount, error: ordersCountError } = await supabase
      .from('orders')
      .select('id', { count: 'exact' })

    if (ordersCountError) throw ordersCountError

    // Get total active products
    const { data: productsCount, error: productsCountError } = await supabase
      .from('products')
      .select('id', { count: 'exact' })
      .eq('is_active', true)

    if (productsCountError) throw productsCountError

    // Get total users
    const { data: usersCount, error: usersCountError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })

    if (usersCountError) throw usersCountError

    // Get pending orders
    const { data: pendingOrders, error: pendingOrdersError } = await supabase
      .from('orders')
      .select('id', { count: 'exact' })
      .eq('status', 'pending')

    if (pendingOrdersError) throw pendingOrdersError

    // Get low stock products (inventory < 10)
    const { data: lowStockProducts, error: lowStockError } = await supabase
      .from('products')
      .select('id', { count: 'exact' })
      .eq('is_active', true)
      .eq('track_inventory', true)
      .lt('inventory_quantity', 10)

    if (lowStockError) throw lowStockError

    // Get recent orders with customer details (last 10)
    // Note: Direct join might not be available, so we'll fetch orders first
    const { data: recentOrdersData, error: recentOrdersError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount,
        status,
        created_at,
        user_id
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    let recentOrders = recentOrdersData || []

    // If we have orders, try to fetch user details separately
    if (recentOrdersData && recentOrdersData.length > 0) {
      const userIds = recentOrdersData.map(order => order.user_id).filter(Boolean)

      if (userIds.length > 0) {
        const { data: usersData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds)

        // Merge user data with orders
        recentOrders = recentOrdersData.map(order => ({
          ...order,
          profiles: usersData?.find(user => user.id === order.user_id) || null
        }))
      }
    }

    if (recentOrdersError) throw recentOrdersError

    // Format recent orders
    const formattedRecentOrders = recentOrders?.map(order => ({
      id: order.order_number || order.id,
      customer: order.profiles?.full_name || order.profiles?.email?.split('@')[0] || 'Anonymous',
      amount: `₹${order.total_amount?.toLocaleString('en-IN') || '0'}`,
      status: order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown',
      date: new Date(order.created_at).toLocaleDateString('en-IN')
    })) || []

    // Get recent products (last 5 created)
    const { data: recentProducts, error: recentProductsError } = await supabase
      .from('products')
      .select('id, name, price, inventory_quantity, is_active, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentProductsError) throw recentProductsError

    // Format recent products
    const formattedRecentProducts = recentProducts?.map(product => ({
      id: product.id,
      name: product.name,
      price: `₹${product.price?.toLocaleString('en-IN') || '0'}`,
      stock: product.inventory_quantity || 0,
      status: product.is_active ? 'Active' : 'Inactive',
      added: new Date(product.created_at).toLocaleDateString('en-IN')
    })) || []

    return NextResponse.json({
      success: true,
      dashboard: {
        stats: {
          totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
          totalOrders: ordersCount?.count || 0,
          totalProducts: productsCount?.count || 0,
          totalUsers: usersCount?.count || 0,
          pendingOrders: pendingOrders?.count || 0,
          lowStock: lowStockProducts?.count || 0,
        },
        recentOrders: formattedRecentOrders,
        recentProducts: formattedRecentProducts
      }
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}