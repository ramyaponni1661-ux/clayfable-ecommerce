/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app *.vercel-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *.supabase.co *.googleusercontent.com; font-src 'self' data:; connect-src 'self' *.supabase.co *.vercel-analytics.com wss:; frame-ancestors 'none';"
          }
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Add any broken link redirects here
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
