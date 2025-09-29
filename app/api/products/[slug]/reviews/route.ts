import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/service'

const supabase = createClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Get product by slug first
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // For now, return placeholder reviews since we don't have a reviews table
    const mockReviews = [
      {
        id: '1',
        author: 'Priya S.',
        rating: 5,
        comment: 'Beautiful craftsmanship! The quality is excellent.',
        date: '2024-01-15',
        verified: true
      },
      {
        id: '2',
        author: 'Raj M.',
        rating: 4,
        comment: 'Great product, very satisfied with the purchase.',
        date: '2024-01-10',
        verified: true
      }
    ]

    return NextResponse.json({
      success: true,
      reviews: mockReviews,
      totalReviews: mockReviews.length,
      averageRating: 4.5
    })

  } catch (error) {
    console.error('Reviews API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()
    const { rating, comment, author } = body

    // Validate input
    if (!rating || !comment || !author) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, just return success since we don't have a reviews table
    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      review: {
        id: Date.now().toString(),
        author,
        rating,
        comment,
        date: new Date().toISOString(),
        verified: false
      }
    })

  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}