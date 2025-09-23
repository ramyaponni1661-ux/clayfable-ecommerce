import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Try to get the table structure by selecting all columns from profiles
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        hint: 'Check if profiles table exists and has proper RLS policies'
      })
    }

    // Get the first row to see available columns
    const sampleRow = data?.[0]
    const availableColumns = sampleRow ? Object.keys(sampleRow) : []

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to profiles table',
      availableColumns,
      sampleData: sampleRow,
      totalRows: data?.length || 0
    })

  } catch (error) {
    console.error('Schema check error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check profiles table schema'
    })
  }
}