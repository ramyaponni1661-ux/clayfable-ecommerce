"use client"

import { useEffect } from 'react'
import Head from 'next/head'

interface CanonicalLinkProps {
  href?: string
}

export default function CanonicalLink({ href }: CanonicalLinkProps) {
  useEffect(() => {
    // Get current URL or use provided href
    const canonicalUrl = href || window.location.href.split('?')[0].split('#')[0]

    // Remove any existing canonical tags
    const existingCanonical = document.querySelector('link[rel="canonical"]')
    if (existingCanonical) {
      existingCanonical.remove()
    }

    // Create new canonical link
    const canonicalLink = document.createElement('link')
    canonicalLink.rel = 'canonical'
    canonicalLink.href = canonicalUrl

    // Add to head
    document.head.appendChild(canonicalLink)

    // Cleanup on unmount
    return () => {
      const linkToRemove = document.querySelector(`link[rel="canonical"][href="${canonicalUrl}"]`)
      if (linkToRemove) {
        linkToRemove.remove()
      }
    }
  }, [href])

  return null // This component doesn't render anything
}

// Alternative using Next.js Head component
export function CanonicalHead({ href }: CanonicalLinkProps) {
  const canonicalUrl = href || (typeof window !== 'undefined' ? window.location.href.split('?')[0].split('#')[0] : '')

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}