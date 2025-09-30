import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.clayfable.com'

  // Main pages
  const mainPages = [
    '',
    '/about',
    '/contact',
    '/products',
    '/new-arrivals',
    '/all-pottery',
    '/b2b',
  ]

  // Product categories
  const productCategories = [
    '/cooking',
    '/water-storage',
    '/ovens',
    '/storage',
    '/vases-planters',
    '/wall-art',
    '/garden-decor',
    '/figurines',
    '/serving',
    '/cups-mugs',
    '/serving-sets',
    '/dinnerware',
    '/tandoor-accessories',
    '/traditional-griddles',
    '/fermentation-pots',
    '/hanging-planters',
    '/decorative-lamps',
    '/tea-sets',
    '/wine-bar-accessories',
    '/spice-containers',
    '/butter-churns',
    '/table-centerpieces',
    '/wind-chimes',
  ]

  // Collections
  const collections = [
    '/collections/heritage',
    '/collections/modern',
    '/collections/wedding',
    '/collections/artisan',
  ]

  // Policy pages
  const policyPages = [
    '/privacy',
    '/terms',
    '/shipping',
    '/refund',
  ]

  const allPages = [
    ...mainPages,
    ...productCategories,
    ...collections,
    ...policyPages,
  ]

  return allPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' || page === '/products' || page === '/new-arrivals'
      ? 'daily'
      : page.includes('/collections')
      ? 'weekly'
      : 'monthly',
    priority: page === ''
      ? 1.0
      : mainPages.includes(page)
      ? 0.8
      : productCategories.includes(page)
      ? 0.7
      : 0.5,
  }))
}