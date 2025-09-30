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
  // Enhanced structured data for rich Google results
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Store', 'LocalBusiness'],
    '@id': 'https://www.clayfable.com/#organization',
    name: 'Clayfable',
    alternateName: 'Clayfable Pottery',
    legalName: 'Clayfable Terracotta & Pottery',
    url: 'https://www.clayfable.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.clayfable.com/logo-square.png',
      width: 512,
      height: 512
    },
    image: [
      'https://www.clayfable.com/logo-square.png',
      'https://www.clayfable.com/icon-transparent.png'
    ],
    description: 'Authentic handcrafted terracotta cookware and pottery. 72 years of heritage craftsmanship serving 50,000+ customers worldwide. Premium clay pots, serving ware, and traditional pottery.',
    foundingDate: '1952',
    slogan: 'Preserving tradition since 1952',
    keywords: 'terracotta cookware, clay pots, handcrafted pottery, traditional pottery, premium pottery, authentic terracotta',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Credit Card, Debit Card, UPI, Net Banking, Cash on Delivery',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Traditional Pottery District',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      postalCode: '600001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 13.0827,
      longitude: 80.2707
    },
    areaServed: {
      '@type': 'Country',
      name: 'India'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-7418160520',
        contactType: 'Customer Service',
        email: 'support@clayfable.com',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Tamil'],
        contactOption: 'TollFree'
      },
      {
        '@type': 'ContactPoint',
        telephone: '+91-7418160520',
        contactType: 'Sales',
        email: 'support@clayfable.com',
        areaServed: 'IN'
      }
    ],
    sameAs: [
      'https://www.instagram.com/clayfable',
      'https://www.facebook.com/clayfable',
      'https://twitter.com/clayfable',
      'https://www.linkedin.com/company/clayfable'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2847',
      bestRating: '5',
      worstRating: '1',
      ratingExplanation: 'Based on verified customer reviews'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Clayfable Product Catalog',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Terracotta Cookware',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Traditional Clay Cooking Pots'
              }
            }
          ]
        },
        {
          '@type': 'OfferCatalog',
          name: 'Decorative Pottery',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Handcrafted Vases & Planters'
              }
            }
          ]
        },
        {
          '@type': 'OfferCatalog',
          name: 'Serving Ware',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Clay Bowls & Plates'
              }
            }
          ]
        }
      ]
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.clayfable.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  // Website structured data
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.clayfable.com/#website',
    url: 'https://www.clayfable.com',
    name: 'Clayfable',
    description: 'Premium handcrafted terracotta cookware and pottery since 1952',
    publisher: {
      '@id': 'https://www.clayfable.com/#organization'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.clayfable.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  // Breadcrumb list for homepage
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.clayfable.com'
      }
    ]
  }

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="Y46oya9MziMPOeHu1wyumHpcfMR3AFyrZjzz2AtIoQU" />
        <link rel="icon" href="/icon-transparent.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-transparent.png" />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
