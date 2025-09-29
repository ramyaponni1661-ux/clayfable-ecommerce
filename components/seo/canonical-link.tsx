"use client";

import Head from 'next/head'

interface CanonicalLinkProps {
  href?: string
}

export default function CanonicalLink({ href }: CanonicalLinkProps) {
  // Get canonical URL safely - avoid window access during SSR
  let canonicalUrl = href

  if (!canonicalUrl && typeof window !== 'undefined') {
    try {
      canonicalUrl = window.location.href.split('?')[0].split('#')[0]
    } catch (error) {
      console.warn('CanonicalLink: Failed to get window location:', error)
      canonicalUrl = ''
    }
  }

  // Don't render if no URL is available
  if (!canonicalUrl) {
    return null
  }

  // Use Next.js Head component for safe SSR-compatible canonical link management
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}

// Alternative using Next.js Head component (recommended for SSR)
export function CanonicalHead({ href }: CanonicalLinkProps) {
  // Get canonical URL safely
  let canonicalUrl = href

  if (!canonicalUrl && typeof window !== 'undefined') {
    try {
      canonicalUrl = window.location.href.split('?')[0].split('#')[0]
    } catch (error) {
      console.warn('CanonicalHead: Failed to get window location:', error)
      canonicalUrl = ''
    }
  }

  // Don't render if no URL is available
  if (!canonicalUrl) {
    return null
  }

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}