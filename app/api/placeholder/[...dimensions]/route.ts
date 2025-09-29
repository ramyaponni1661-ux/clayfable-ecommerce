import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { dimensions: string[] } }
) {
  const [width = '300', height = '300'] = params.dimensions

  // Parse dimensions and set reasonable limits
  const w = Math.min(Math.max(parseInt(width) || 300, 50), 2000)
  const h = Math.min(Math.max(parseInt(height) || 300, 50), 2000)

  // Generate an SVG placeholder image
  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f97316" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#ea580c" stop-opacity="0.9"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <rect x="2" y="2" width="${w-4}" height="${h-4}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="5,5" opacity="0.3"/>
      <text x="50%" y="45%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.min(w, h) / 15}" font-weight="bold">
        Clayfable
      </text>
      <text x="50%" y="60%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.min(w, h) / 20}" opacity="0.8">
        ${w} × ${h}
      </text>
      <circle cx="${w/2}" cy="${h/2 + 30}" r="${Math.min(w, h) / 20}" fill="white" opacity="0.2"/>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}