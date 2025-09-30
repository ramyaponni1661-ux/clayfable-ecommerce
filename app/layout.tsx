import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/CartContext"
import { WishlistProvider } from "@/contexts/WishlistContext"
import { SessionProvider } from "@/components/providers/session-provider"
import { Toaster } from "sonner"
import { generatePageMetadata } from "@/lib/seo"
import "./globals.css"

export const metadata: Metadata = {
  ...generatePageMetadata('home'),
  icons: {
    icon: [
      { url: '/icon-transparent.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-transparent.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-transparent.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [
      { url: '/icon-transparent.png', sizes: '180x180', type: 'image/png' },
      { url: '/icon-transparent.png', sizes: '152x152', type: 'image/png' },
      { url: '/icon-transparent.png', sizes: '120x120', type: 'image/png' }
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/icon-transparent.png',
      }
    ],
    shortcut: '/icon-transparent.png'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#f97316', // Orange theme color
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Structured data for organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Clayfable',
    url: 'https://www.clayfable.com',
    logo: 'https://www.clayfable.com/logo-square.png',
    description: 'Authentic handcrafted terracotta cookware and pottery. 72 years of heritage craftsmanship serving 50,000+ customers worldwide.',
    foundingDate: '1952',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      postalCode: '600001',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-7418160520',
      contactType: 'Customer Service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi', 'ta']
    },
    sameAs: [
      'https://instagram.com/clayfable',
      'https://facebook.com/clayfable',
      'https://twitter.com/clayfable'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2847',
      bestRating: '5',
      worstRating: '1'
    }
  }

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="Y46oya9MziMPOeHu1wyumHpcfMR3AFyrZjzz2AtIoQU" />
        <link rel="icon" href="/icon-transparent.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-transparent.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              <Suspense fallback={null}>
                {children}
                <Analytics />
              </Suspense>
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              color: '#374151',
            },
          }}
        />
      </body>
    </html>
  )
}
