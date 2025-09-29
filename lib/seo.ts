import { Metadata } from 'next'

// SEO configuration constants
export const SEO_CONFIG = {
  siteName: 'Clayfable',
  siteDescription: 'Authentic handcrafted terracotta cookware and pottery. 72 years of heritage craftsmanship.',
  siteUrl: process.env.NODE_ENV === 'production'
    ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://clayfable.com')
    : 'http://localhost:3000',
  defaultImage: '/og-default.jpg',
  twitterHandle: '@clayfable',
}

// Get the correct site URL for canonical links
export const getCurrentSiteUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Server-side fallback
  return process.env.NODE_ENV === 'production'
    ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://clayfable.com')
    : 'http://localhost:3000'
}

// Page-specific SEO data
export const PAGE_SEO: Record<string, {
  title: string
  description: string
  keywords?: string[]
  category?: string
}> = {
  home: {
    title: 'Handcrafted Terracotta Cookware | Clayfable',
    description: 'Discover premium terracotta cookware handcrafted with 72 years of expertise. Shop authentic Indian pottery for cooking, serving & decor.',
    keywords: ['terracotta cookware', 'clay pots', 'handcrafted pottery', 'Indian cookware', 'traditional cooking'],
  },
  cooking: {
    title: 'Traditional Cooking Pots & Vessels | Clayfable',
    description: 'Shop premium clay cooking pots and vessels. Handcrafted terracotta cookware for healthy, flavorful cooking. Free shipping on orders over ₹999.',
    keywords: ['clay cooking pots', 'terracotta vessels', 'traditional cookware', 'clay pots for cooking'],
    category: 'Cooking'
  },
  'table-centerpieces': {
    title: 'Elegant Clay Table Centerpieces | Clayfable',
    description: 'Beautiful handcrafted clay centerpieces for dining tables. Transform your space with authentic terracotta decorative pieces.',
    keywords: ['table centerpieces', 'clay decorative pieces', 'dining table decor', 'terracotta centerpieces'],
    category: 'Decor'
  },
  'wind-chimes': {
    title: 'Musical Clay Wind Chimes | Clayfable',
    description: 'Soothing terracotta wind chimes with natural acoustic properties. Handcrafted musical ornaments for gardens and homes.',
    keywords: ['clay wind chimes', 'terracotta bells', 'musical ornaments', 'garden decor'],
    category: 'Decor'
  },
  'tea-sets': {
    title: 'Traditional Clay Tea Sets & Kulhads | Clayfable',
    description: 'Authentic clay tea sets and kulhads for traditional chai experience. Handcrafted terracotta tea service for enhanced flavor.',
    keywords: ['clay tea sets', 'kulhads', 'terracotta cups', 'traditional tea service'],
    category: 'Serving'
  },
  'spice-containers': {
    title: 'Clay Spice Jars & Storage Containers | Clayfable',
    description: 'Keep spices fresh with traditional clay storage containers. Natural terracotta jars preserve aroma and flavor naturally.',
    keywords: ['spice containers', 'clay storage jars', 'masala containers', 'spice storage'],
    category: 'Storage'
  },
  'tandoor-accessories': {
    title: 'Clay Tandoor Accessories & Tools | Clayfable',
    description: 'Complete tandoor setup with authentic clay accessories. Professional-grade terracotta tools for traditional cooking.',
    keywords: ['tandoor accessories', 'clay tandoor tools', 'traditional cooking tools'],
    category: 'Cooking'
  },
  'traditional-griddles': {
    title: 'Clay Tawa & Traditional Griddles | Clayfable',
    description: 'Authentic clay tawa and griddles for healthy cooking. Traditional terracotta cooking surfaces for perfect rotis and flatbreads.',
    keywords: ['clay tawa', 'traditional griddles', 'terracotta tawa', 'clay cooking surface'],
    category: 'Cooking'
  },
  'fermentation-pots': {
    title: 'Clay Fermentation Pots & Vessels | Clayfable',
    description: 'Traditional clay pots for fermentation and food preparation. Natural terracotta vessels for healthy fermented foods.',
    keywords: ['fermentation pots', 'clay fermentation vessels', 'traditional food preparation'],
    category: 'Cooking'
  },
  'hanging-planters': {
    title: 'Suspended Clay Garden Planters | Clayfable',
    description: 'Beautiful hanging clay planters for gardens and balconies. Handcrafted terracotta suspended planters for your green space.',
    keywords: ['hanging planters', 'suspended clay pots', 'garden planters', 'terracotta planters'],
    category: 'Garden'
  },
  'decorative-lamps': {
    title: 'Traditional Clay Lighting & Lamps | Clayfable',
    description: 'Handcrafted clay lamps and traditional lighting. Authentic terracotta diyas and decorative lighting for ambiance.',
    keywords: ['clay lamps', 'terracotta lighting', 'traditional lamps', 'decorative lighting'],
    category: 'Decor'
  },
  'wine-bar-accessories': {
    title: 'Clay Wine Coolers & Bar Accessories | Clayfable',
    description: 'Elegant clay wine coolers and bar accessories. Handcrafted terracotta serving pieces for wine and beverages.',
    keywords: ['clay wine coolers', 'terracotta bar accessories', 'wine serving'],
    category: 'Serving'
  },
  'butter-churns': {
    title: 'Traditional Clay Butter Churns | Clayfable',
    description: 'Authentic clay butter churns for traditional dairy preparation. Handcrafted terracotta equipment for fresh butter making.',
    keywords: ['butter churns', 'clay dairy equipment', 'traditional butter making'],
    category: 'Kitchen Tools'
  },
  contact: {
    title: 'Contact Clayfable | Customer Support',
    description: 'Get in touch with Clayfable for queries about our handcrafted terracotta products. Customer support and bulk orders.',
    keywords: ['contact clayfable', 'customer support', 'pottery queries'],
  },
  about: {
    title: 'About Clayfable | 72 Years of Pottery Heritage',
    description: 'Learn about Clayfable\'s 72-year journey in handcrafted terracotta pottery. Our story of traditional craftsmanship and quality.',
    keywords: ['clayfable story', 'pottery heritage', 'traditional craftsmanship'],
  },
  privacy: {
    title: 'Privacy Policy | Clayfable',
    description: 'Clayfable\'s privacy policy explaining how we collect, use, and protect your personal information.',
  },
  terms: {
    title: 'Terms & Conditions | Clayfable',
    description: 'Terms and conditions for shopping at Clayfable. Shipping, returns, and usage policies.',
  },
  shipping: {
    title: 'Shipping Information | Clayfable',
    description: 'Shipping rates, delivery times, and policies for Clayfable terracotta products across India.',
  },
  refund: {
    title: 'Returns & Refund Policy | Clayfable',
    description: 'Easy returns and refund policy for Clayfable products. Customer satisfaction guarantee.',
  }
}

// Generate metadata for pages
export function generatePageMetadata(
  pageKey: string,
  customTitle?: string,
  customDescription?: string,
  customImage?: string
): Metadata {
  const seoData = PAGE_SEO[pageKey] || PAGE_SEO.home
  const title = customTitle || seoData.title
  const description = customDescription || seoData.description
  const baseUrl = getCurrentSiteUrl()
  const url = `${baseUrl}/${pageKey === 'home' ? '' : pageKey}`
  const image = customImage || SEO_CONFIG.defaultImage

  return {
    title,
    description,
    keywords: seoData.keywords?.join(', '),
    authors: [{ name: SEO_CONFIG.siteName }],
    creator: SEO_CONFIG.siteName,
    publisher: SEO_CONFIG.siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: SEO_CONFIG.twitterHandle,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    other: {
      'price:currency': 'INR',
      'product:category': seoData.category || 'Pottery',
    },
  }
}

// Generate JSON-LD structured data
export function generateStructuredData(pageKey: string, additionalData?: any) {
  const seoData = PAGE_SEO[pageKey] || PAGE_SEO.home
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    description: SEO_CONFIG.siteDescription,
    foundingDate: '1952',
    sameAs: [
      'https://instagram.com/clayfable',
      'https://facebook.com/clayfable',
      'https://twitter.com/clayfable'
    ]
  }

  if (seoData.category) {
    return {
      ...baseStructuredData,
      '@type': 'Store',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: seoData.category,
        itemListElement: [
          {
            '@type': 'Offer',
            category: seoData.category
          }
        ]
      },
      ...additionalData
    }
  }

  return { ...baseStructuredData, ...additionalData }
}