import Head from 'next/head'

interface PageSEOProps {
  title: string
  description: string
  canonical?: string
  keywords?: string[]
  ogImage?: string
  noindex?: boolean
}

export default function PageSEO({
  title,
  description,
  canonical,
  keywords = [],
  ogImage = '/og-default.jpg',
  noindex = false
}: PageSEOProps) {
  const siteUrl = 'https://clayfable.com'
  const fullTitle = title.includes('Clayfable') ? title : `${title} | Clayfable`
  const canonicalUrl = canonical || `${siteUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Clayfable" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="googlebot" content={noindex ? 'noindex,nofollow' : 'index,follow'} />

      {/* Additional meta tags */}
      <meta name="author" content="Clayfable" />
      <meta name="theme-color" content="#f97316" />
    </Head>
  )
}