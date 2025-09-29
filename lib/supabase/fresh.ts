import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Creates a fresh Supabase client instance to bypass caching issues
 * This should be used for critical operations like inventory management
 */
export function createFreshClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables for fresh client"
    )
  }

  // Create a completely fresh client with unique instance identifier
  const uniqueId = Date.now() + Math.random()

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'X-Client-Info': `fresh-${uniqueId}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    },
    realtime: {
      params: {
        eventsPerSecond: -1
      }
    }
  })
}

/**
 * Execute a query with cache-busting mechanisms
 */
export async function executeFreshQuery<T>(
  queryFn: (client: any) => Promise<T>
): Promise<T> {
  const client = createFreshClient()

  try {
    return await queryFn(client)
  } finally {
    // Cleanup connection if possible
    if (client && typeof client.removeAllChannels === 'function') {
      client.removeAllChannels()
    }
  }
}