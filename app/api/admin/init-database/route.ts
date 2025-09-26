import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { initializeDatabase, checkDatabaseSchema, insertSampleProducts } from '@/lib/database/setup'

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin permissions
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action } = await request.json()

    switch (action) {
      case 'initialize':
        console.log('🚀 Starting database initialization...')
        const initResults = await initializeDatabase()
        return NextResponse.json({
          success: true,
          message: 'Database initialization completed',
          results: initResults
        })

      case 'check-schema':
        console.log('🔍 Checking database schema...')
        const schemaResults = await checkDatabaseSchema()
        return NextResponse.json({
          success: true,
          message: 'Schema check completed',
          results: schemaResults
        })

      case 'insert-samples':
        console.log('📦 Inserting sample products...')
        const sampleResults = await insertSampleProducts()
        return NextResponse.json({
          success: sampleResults.success,
          message: sampleResults.success ? 'Sample products inserted successfully' : 'Failed to insert sample products',
          data: sampleResults.success ? {
            categories: sampleResults.categories?.length || 0,
            products: sampleResults.products?.length || 0
          } : null,
          error: sampleResults.error || null
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      {
        error: 'Database initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Just check schema status
    const schemaResults = await checkDatabaseSchema()

    return NextResponse.json({
      success: true,
      message: 'Database status retrieved',
      results: schemaResults
    })

  } catch (error) {
    console.error('Database check error:', error)
    return NextResponse.json(
      {
        error: 'Database check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}