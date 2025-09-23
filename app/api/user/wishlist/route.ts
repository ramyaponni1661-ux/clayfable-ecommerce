import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock user wishlist database - in production this would be replaced with actual database calls
let userWishlists = [
  {
    userId: "user1@example.com",
    items: [
      {
        id: 1,
        name: "Traditional Clay Cooking Pot",
        price: 149,
        originalPrice: 799,
        image: "/traditional-terracotta-cooking-pots-and-vessels.jpg",
        inStock: true,
        category: "Cookware",
        sku: "TCP001"
      },
      {
        id: 2,
        name: "Decorative Terracotta Vase",
        price: 149,
        originalPrice: 449,
        image: "/decorative-terracotta-vases-and-planters.jpg",
        inStock: true,
        category: "Decor",
        sku: "DTV002"
      },
      {
        id: 3,
        name: "Garden Pot Set",
        price: 149,
        originalPrice: 1500,
        image: "/garden-pot-set.jpg",
        inStock: false,
        category: "Garden",
        sku: "GPS003"
      }
    ]
  }
]

async function checkUserAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return null
  }
  return session.user.email
}

// GET - Fetch user wishlist
export async function GET(request: NextRequest) {
  const userEmail = await checkUserAuth()
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userWishlist = userWishlists.find(w => w.userId === userEmail)
  const items = userWishlist?.items || []

  return NextResponse.json({
    items,
    count: items.length,
    totalValue: items.reduce((sum, item) => sum + item.price, 0)
  })
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  const userEmail = await checkUserAuth()
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { productId, name, price, originalPrice, image, category, sku } = body

    if (!productId || !name || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let userWishlist = userWishlists.find(w => w.userId === userEmail)

    if (!userWishlist) {
      userWishlist = { userId: userEmail, items: [] }
      userWishlists.push(userWishlist)
    }

    // Check if item already exists
    const existingItem = userWishlist.items.find(item => item.id === productId)
    if (existingItem) {
      return NextResponse.json({ error: 'Item already in wishlist' }, { status: 400 })
    }

    const newItem = {
      id: productId,
      name,
      price,
      originalPrice: originalPrice || price,
      image: image || "/placeholder.jpg",
      inStock: true,
      category: category || "Uncategorized",
      sku: sku || `SKU${productId}`
    }

    userWishlist.items.push(newItem)

    return NextResponse.json({
      message: 'Item added to wishlist',
      item: newItem
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  const userEmail = await checkUserAuth()
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  }

  const userWishlist = userWishlists.find(w => w.userId === userEmail)
  if (!userWishlist) {
    return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 })
  }

  const itemIndex = userWishlist.items.findIndex(item => item.id === parseInt(productId))
  if (itemIndex === -1) {
    return NextResponse.json({ error: 'Item not found in wishlist' }, { status: 404 })
  }

  const removedItem = userWishlist.items.splice(itemIndex, 1)[0]

  return NextResponse.json({
    message: 'Item removed from wishlist',
    item: removedItem
  })
}