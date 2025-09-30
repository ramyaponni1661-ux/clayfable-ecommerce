// Test script to update order and trigger notification
const fetch = require('node-fetch')

async function testOrderUpdate() {
  const orderId = '8e143f6f-3da1-4a3e-aede-14cd61a58e76' // Your test order ID

  console.log('🧪 Testing Order Update with Notification...\n')

  try {
    const response = await fetch(`http://localhost:3000/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'next-auth.session-token=test' // You'll need actual session
      },
      body: JSON.stringify({
        status: 'processing',
        admin_notes: 'Test update from script',
      })
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Order updated successfully!')
      console.log('📧 Notification should have been sent')
      console.log('\nResponse:', JSON.stringify(data, null, 2))
    } else {
      console.log('❌ Update failed:', data)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Test getting orders
async function testGetOrders() {
  console.log('\n🧪 Testing Get Orders...\n')

  try {
    const response = await fetch('http://localhost:3000/api/admin/orders', {
      headers: {
        'Cookie': 'next-auth.session-token=test'
      }
    })

    const data = await response.json()

    if (response.ok) {
      console.log(`✅ Retrieved ${data.orders?.length || 0} orders`)
      if (data.orders && data.orders.length > 0) {
        console.log('\nFirst order:')
        console.log('- Order Number:', data.orders[0].order_number)
        console.log('- Status:', data.orders[0].status)
        console.log('- Customer:', data.orders[0].customer_email)
        console.log('- Total:', data.orders[0].total_amount)
      }
    } else {
      console.log('❌ Failed:', data)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Run tests
testGetOrders()
// Uncomment to test update (requires authentication)
// testOrderUpdate()