import { NextRequest, NextResponse } from 'next/server'
import { validateMultiplePages, generateSEOHealthReport } from '@/lib/seo-validator'

export async function GET(request: NextRequest) {
  try {
    // Define key pages to validate
    const keyPages = [
      { url: '/', title: 'Handcrafted Terracotta Cookware | Clayfable', description: 'Discover premium terracotta cookware handcrafted with 72 years of expertise. Shop authentic Indian pottery for cooking, serving & decor.', canonical: `${process.env.NODE_ENV === 'production' ? 'https://clayfable.com' : 'http://localhost:3000'}/`, hasInternalLinks: true },
      { url: '/cooking', title: 'Traditional Cooking Pots & Vessels | Clayfable', description: 'Shop premium clay cooking pots and vessels. Handcrafted terracotta cookware for healthy, flavorful cooking. Free shipping on orders over ₹999.', canonical: `${process.env.NODE_ENV === 'production' ? 'https://clayfable.com' : 'http://localhost:3000'}/cooking`, hasInternalLinks: true },
      { url: '/table-centerpieces', title: 'Elegant Clay Table Centerpieces | Clayfable', description: 'Beautiful handcrafted clay centerpieces for dining tables. Transform your space with authentic terracotta decorative pieces.', canonical: `${process.env.NODE_ENV === 'production' ? 'https://clayfable.com' : 'http://localhost:3000'}/table-centerpieces`, hasInternalLinks: true },
      { url: '/wind-chimes', title: 'Musical Clay Wind Chimes | Clayfable', description: 'Soothing terracotta wind chimes with natural acoustic properties. Handcrafted musical ornaments for gardens and homes.', canonical: `${process.env.NODE_ENV === 'production' ? 'https://clayfable.com' : 'http://localhost:3000'}/wind-chimes`, hasInternalLinks: true },
      { url: '/all-pottery', title: 'All Pottery Collection | Clayfable', description: 'Browse our complete collection of handcrafted terracotta pottery and traditional cookware.', canonical: `${process.env.NODE_ENV === 'production' ? 'https://clayfable.com' : 'http://localhost:3000'}/all-pottery`, hasInternalLinks: true },
      { url: '/contact', title: 'Contact Clayfable | Customer Support', description: 'Get in touch with Clayfable for queries about our handcrafted terracotta products. Customer support and bulk orders.', canonical: `${process.env.NODE_ENV === 'production' ? 'https://clayfable.com' : 'http://localhost:3000'}/contact`, hasInternalLinks: true },
      { url: '/about', title: 'About Clayfable | 72 Years of Pottery Heritage', description: 'Learn about Clayfable\'s 72-year journey in handcrafted terracotta pottery. Our story of traditional craftsmanship and quality.', canonical: `${process.env.NODE_ENV === 'production' ? 'https://clayfable.com' : 'http://localhost:3000'}/about`, hasInternalLinks: true },
      { url: '/admin', title: 'Admin Dashboard | Clayfable', description: 'Administrative dashboard for managing products, orders, and site content.', canonical: `${process.env.NODE_ENV === 'production' ? 'https://clayfable.com' : 'http://localhost:3000'}/admin`, hasInternalLinks: true }
    ]

    const validation = validateMultiplePages(keyPages)
    const report = generateSEOHealthReport(keyPages)

    return NextResponse.json({
      success: true,
      healthScore: Math.round((validation.validPages / validation.totalPages) * 100),
      summary: {
        totalPages: validation.totalPages,
        validPages: validation.validPages,
        issuesCount: validation.issues.length
      },
      issues: validation.issues,
      report,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('SEO validation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to validate SEO'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pages } = await request.json()

    if (!pages || !Array.isArray(pages)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid pages data'
      }, { status: 400 })
    }

    const validation = validateMultiplePages(pages)
    const report = generateSEOHealthReport(pages)

    return NextResponse.json({
      success: true,
      healthScore: Math.round((validation.validPages / validation.totalPages) * 100),
      summary: {
        totalPages: validation.totalPages,
        validPages: validation.validPages,
        issuesCount: validation.issues.length
      },
      issues: validation.issues,
      report,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('SEO validation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to validate SEO'
    }, { status: 500 })
  }
}