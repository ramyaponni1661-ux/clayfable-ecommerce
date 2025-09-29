import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/service'

async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return false
  }
  return true
}

// GET - Advanced inventory analytics and reporting
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)

    const reportType = searchParams.get('report') || 'overview'
    const lowStockThreshold = parseInt(searchParams.get('threshold') || '10')
    const categoryId = searchParams.get('category')
    const dateRange = searchParams.get('range') || '30' // days

    switch (reportType) {
      case 'overview':
        // Get comprehensive inventory overview
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            sku,
            inventory_quantity,
            price,
            cost_price,
            track_inventory,
            is_active,
            created_at,
            updated_at,
            categories (name, id),
            product_variants (
              id,
              name,
              inventory_quantity,
              price,
              cost_price
            )
          `)
          .eq('is_active', true)

        if (productsError) {
          return NextResponse.json({ error: 'Failed to fetch inventory data' }, { status: 500 })
        }

        // Calculate inventory metrics
        const totalProducts = products?.length || 0
        const lowStockItems = products?.filter(p => p.inventory_quantity <= lowStockThreshold).length || 0
        const outOfStockItems = products?.filter(p => p.inventory_quantity === 0).length || 0
        const totalInventoryValue = products?.reduce((sum, p) => {
          const costPrice = p.cost_price || p.price * 0.6 // 40% margin assumption
          return sum + (p.inventory_quantity * costPrice)
        }, 0) || 0

        // Calculate turnover rate (simplified)
        const averageInventoryValue = totalInventoryValue / totalProducts
        const estimatedMonthlyTurnover = 2.5 // Industry average for pottery/crafts

        const inventoryMetrics = {
          totalProducts,
          lowStockItems,
          outOfStockItems,
          totalInventoryValue,
          averageInventoryValue,
          turnoverRate: estimatedMonthlyTurnover,
          stockHealth: {
            healthy: totalProducts - lowStockItems - outOfStockItems,
            lowStock: lowStockItems,
            outOfStock: outOfStockItems
          }
        }

        return NextResponse.json({
          success: true,
          reportType: 'overview',
          metrics: inventoryMetrics,
          products: products?.slice(0, 20) // Limit for overview
        })

      case 'low-stock':
        // Get low stock items
        const { data: lowStockProducts, error: lowStockError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            sku,
            inventory_quantity,
            price,
            categories (name),
            updated_at
          `)
          .lte('inventory_quantity', lowStockThreshold)
          .eq('is_active', true)
          .eq('track_inventory', true)
          .order('inventory_quantity', { ascending: true })

        if (lowStockError) {
          return NextResponse.json({ error: 'Failed to fetch low stock data' }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          reportType: 'low-stock',
          threshold: lowStockThreshold,
          products: lowStockProducts
        })

      case 'valuation':
        // Inventory valuation report
        const { data: valuationData, error: valuationError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            sku,
            inventory_quantity,
            price,
            cost_price,
            categories (name, id)
          `)
          .eq('is_active', true)

        if (valuationError) {
          return NextResponse.json({ error: 'Failed to fetch valuation data' }, { status: 500 })
        }

        const categoryValuation = {}
        let totalValuation = 0

        valuationData?.forEach(product => {
          const costPrice = product.cost_price || product.price * 0.6
          const productValue = product.inventory_quantity * costPrice
          totalValuation += productValue

          const categoryName = product.categories?.name || 'Uncategorized'
          if (!categoryValuation[categoryName]) {
            categoryValuation[categoryName] = {
              value: 0,
              products: 0,
              quantity: 0
            }
          }

          categoryValuation[categoryName].value += productValue
          categoryValuation[categoryName].products += 1
          categoryValuation[categoryName].quantity += product.inventory_quantity
        })

        return NextResponse.json({
          success: true,
          reportType: 'valuation',
          totalValuation,
          categoryBreakdown: categoryValuation,
          products: valuationData
        })

      case 'movement':
        // Inventory movement analysis (basic implementation)
        const movementDays = parseInt(dateRange)
        const dateThreshold = new Date(Date.now() - movementDays * 24 * 60 * 60 * 1000).toISOString()

        const { data: recentOrders, error: ordersError } = await supabase
          .from('order_items')
          .select(`
            quantity,
            products (id, name, sku, inventory_quantity),
            orders (created_at, status)
          `)
          .gte('orders.created_at', dateThreshold)
          .in('orders.status', ['processing', 'shipped', 'delivered'])

        if (ordersError) {
          return NextResponse.json({ error: 'Failed to fetch movement data' }, { status: 500 })
        }

        // Calculate movement metrics
        const productMovement = {}
        recentOrders?.forEach(item => {
          const productId = item.products?.id
          if (!productMovement[productId]) {
            productMovement[productId] = {
              product: item.products,
              totalSold: 0,
              orderCount: 0
            }
          }
          productMovement[productId].totalSold += item.quantity
          productMovement[productId].orderCount += 1
        })

        const movementAnalysis = Object.values(productMovement)
          .sort((a, b) => b.totalSold - a.totalSold)
          .slice(0, 50)

        return NextResponse.json({
          success: true,
          reportType: 'movement',
          dateRange: movementDays,
          topMovers: movementAnalysis
        })

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Inventory report error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Inventory adjustments and stock operations
export async function POST(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const { operation, products, reason, notes } = body

    if (!operation || !products || !Array.isArray(products)) {
      return NextResponse.json({
        error: 'Missing required fields: operation, products array'
      }, { status: 400 })
    }

    const results = []
    const errors = []

    switch (operation) {
      case 'adjust_stock':
        for (const item of products) {
          const { productId, adjustment, newQuantity } = item

          if (!productId || (adjustment === undefined && newQuantity === undefined)) {
            errors.push({ productId, error: 'Missing productId or adjustment/newQuantity' })
            continue
          }

          try {
            // Get current stock
            const { data: currentProduct, error: fetchError } = await supabase
              .from('products')
              .select('id, name, inventory_quantity, track_inventory')
              .eq('id', productId)
              .single()

            if (fetchError || !currentProduct) {
              errors.push({ productId, error: 'Product not found' })
              continue
            }

            if (!currentProduct.track_inventory) {
              errors.push({ productId, error: 'Product does not track inventory' })
              continue
            }

            // Calculate new quantity
            const currentQty = currentProduct.inventory_quantity || 0
            const finalQuantity = newQuantity !== undefined ? newQuantity : currentQty + adjustment

            if (finalQuantity < 0) {
              errors.push({ productId, error: 'Cannot set negative inventory' })
              continue
            }

            // Update inventory
            const { data: updatedProduct, error: updateError } = await supabase
              .from('products')
              .update({
                inventory_quantity: finalQuantity,
                updated_at: new Date().toISOString()
              })
              .eq('id', productId)
              .select()
              .single()

            if (updateError) {
              errors.push({ productId, error: updateError.message })
              continue
            }

            // Log inventory adjustment
            await supabase
              .from('inventory_adjustments')
              .insert({
                product_id: productId,
                previous_quantity: currentQty,
                new_quantity: finalQuantity,
                adjustment_amount: finalQuantity - currentQty,
                reason: reason || 'Manual adjustment',
                notes,
                created_at: new Date().toISOString()
              })
              .catch(err => console.log('Adjustment log failed:', err.message))

            results.push({
              productId,
              productName: currentProduct.name,
              previousQuantity: currentQty,
              newQuantity: finalQuantity,
              adjustment: finalQuantity - currentQty
            })

          } catch (err) {
            errors.push({ productId, error: 'Adjustment failed' })
          }
        }
        break

      case 'bulk_restock':
        for (const item of products) {
          const { productId, restockQuantity, supplierCost } = item

          if (!productId || !restockQuantity || restockQuantity <= 0) {
            errors.push({ productId, error: 'Invalid restock quantity' })
            continue
          }

          try {
            // Get current stock
            const { data: currentProduct, error: fetchError } = await supabase
              .from('products')
              .select('id, name, inventory_quantity, cost_price')
              .eq('id', productId)
              .single()

            if (fetchError || !currentProduct) {
              errors.push({ productId, error: 'Product not found' })
              continue
            }

            const newQuantity = (currentProduct.inventory_quantity || 0) + restockQuantity

            // Update inventory and cost if provided
            const updateData = {
              inventory_quantity: newQuantity,
              updated_at: new Date().toISOString()
            }

            if (supplierCost) {
              updateData.cost_price = supplierCost
            }

            const { error: updateError } = await supabase
              .from('products')
              .update(updateData)
              .eq('id', productId)

            if (updateError) {
              errors.push({ productId, error: updateError.message })
              continue
            }

            // Log restock
            await supabase
              .from('inventory_adjustments')
              .insert({
                product_id: productId,
                previous_quantity: currentProduct.inventory_quantity || 0,
                new_quantity: newQuantity,
                adjustment_amount: restockQuantity,
                reason: 'Restock',
                notes: `Restocked ${restockQuantity} units${supplierCost ? ` at cost ₹${supplierCost}` : ''}`,
                created_at: new Date().toISOString()
              })
              .catch(err => console.log('Restock log failed:', err.message))

            results.push({
              productId,
              productName: currentProduct.name,
              restockQuantity,
              newTotalQuantity: newQuantity
            })

          } catch (err) {
            errors.push({ productId, error: 'Restock failed' })
          }
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      operation,
      processed: results.length,
      errors: errors.length,
      results,
      errorDetails: errors
    })

  } catch (error) {
    console.error('Inventory operation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update inventory settings and configurations
export async function PUT(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const { productId, settings } = body

    if (!productId || !settings) {
      return NextResponse.json({
        error: 'Missing required fields: productId, settings'
      }, { status: 400 })
    }

    const allowedSettings = [
      'track_inventory',
      'low_stock_threshold',
      'auto_reorder_enabled',
      'reorder_point',
      'reorder_quantity',
      'cost_price',
      'supplier_info'
    ]

    const updateData = {}
    Object.keys(settings).forEach(key => {
      if (allowedSettings.includes(key)) {
        updateData[key] = settings[key]
      }
    })

    updateData.updated_at = new Date().toISOString()

    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update inventory settings' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Inventory settings updated successfully',
      product: updatedProduct
    })

  } catch (error) {
    console.error('Inventory settings update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}