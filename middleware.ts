import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle broken link redirects to prevent 404s
  const redirectMap: Record<string, string> = {
    '/pressure-cookers': '/cooking',
    '/wine-accessories': '/wine-bar-accessories',
    '/centerpieces': '/table-centerpieces',
    '/lamps': '/decorative-lamps',
    '/griddles': '/traditional-griddles',
    '/fermentation': '/fermentation-pots',
    '/videos': '/' // Deleted page redirect to home
  }

  if (redirectMap[pathname]) {
    const redirectUrl = new URL(redirectMap[pathname], request.url)
    return NextResponse.redirect(redirectUrl, 301) // Permanent redirect
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/api/admin/:path*',
    '/api/user/:path*',
    '/pressure-cookers',
    '/wine-accessories',
    '/centerpieces',
    '/lamps',
    '/griddles',
    '/fermentation',
    '/videos'
  ]
}
