// SEO Validation utilities to prevent canonical and SEO issues

import { getCurrentSiteUrl } from './seo'

interface SEOValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

interface PageSEOData {
  url: string
  title?: string
  description?: string
  canonical?: string
  hasInternalLinks?: boolean
}

/**
 * Validate canonical URL structure
 */
export function validateCanonicalURL(pageUrl: string, canonicalUrl?: string): SEOValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const baseUrl = getCurrentSiteUrl()
  const expectedCanonical = `${baseUrl}${pageUrl.startsWith('/') ? pageUrl : `/${pageUrl}`}`

  if (!canonicalUrl) {
    errors.push('Canonical URL is missing')
    return { isValid: false, errors, warnings }
  }

  // Check if canonical URL is self-referencing
  if (canonicalUrl !== expectedCanonical) {
    errors.push(`Canonical URL mismatch. Expected: ${expectedCanonical}, Got: ${canonicalUrl}`)
  }

  // Check if canonical URL is absolute
  if (!canonicalUrl.startsWith('http')) {
    warnings.push('Canonical URL should be absolute (include protocol)')
  }

  // Check if canonical URL uses correct protocol
  if (canonicalUrl.startsWith('http://') && process.env.NODE_ENV === 'production') {
    warnings.push('Production canonical URLs should use HTTPS')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validate page SEO metadata
 */
export function validatePageSEO(data: PageSEOData): SEOValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Title validation
  if (!data.title) {
    errors.push('Page title is missing')
  } else {
    if (data.title.length > 60) {
      warnings.push(`Title too long (${data.title.length} chars). Recommended: ≤60 chars`)
    }
    if (data.title.length < 30) {
      warnings.push(`Title too short (${data.title.length} chars). Recommended: 30-60 chars`)
    }
  }

  // Description validation
  if (!data.description) {
    errors.push('Meta description is missing')
  } else {
    if (data.description.length > 160) {
      warnings.push(`Description too long (${data.description.length} chars). Recommended: ≤160 chars`)
    }
    if (data.description.length < 120) {
      warnings.push(`Description too short (${data.description.length} chars). Recommended: 120-160 chars`)
    }
  }

  // Canonical validation
  const canonicalResult = validateCanonicalURL(data.url, data.canonical)
  errors.push(...canonicalResult.errors)
  warnings.push(...canonicalResult.warnings)

  // Internal links validation
  if (data.hasInternalLinks === false) {
    warnings.push('Page has no internal outbound links - consider adding related links for better SEO')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Batch validate multiple pages
 */
export function validateMultiplePages(pages: PageSEOData[]): {
  totalPages: number
  validPages: number
  issues: Array<{
    url: string
    errors: string[]
    warnings: string[]
  }>
} {
  const issues: Array<{ url: string; errors: string[]; warnings: string[] }> = []
  let validPages = 0

  pages.forEach(page => {
    const result = validatePageSEO(page)
    if (result.isValid) {
      validPages++
    }
    if (result.errors.length > 0 || result.warnings.length > 0) {
      issues.push({
        url: page.url,
        errors: result.errors,
        warnings: result.warnings
      })
    }
  })

  return {
    totalPages: pages.length,
    validPages,
    issues
  }
}

/**
 * Generate SEO health report
 */
export function generateSEOHealthReport(pages: PageSEOData[]): string {
  const validation = validateMultiplePages(pages)
  const healthScore = Math.round((validation.validPages / validation.totalPages) * 100)

  let report = `SEO Health Report\n`
  report += `================\n\n`
  report += `Overall Health Score: ${healthScore}%\n`
  report += `Valid Pages: ${validation.validPages}/${validation.totalPages}\n\n`

  if (validation.issues.length > 0) {
    report += `Issues Found:\n`
    report += `-------------\n\n`

    validation.issues.forEach(issue => {
      report += `Page: ${issue.url}\n`
      if (issue.errors.length > 0) {
        report += `  Errors:\n`
        issue.errors.forEach(error => report += `    - ${error}\n`)
      }
      if (issue.warnings.length > 0) {
        report += `  Warnings:\n`
        issue.warnings.forEach(warning => report += `    - ${warning}\n`)
      }
      report += `\n`
    })
  } else {
    report += `🎉 No SEO issues found! All pages are properly configured.\n`
  }

  return report
}

/**
 * Development-only: Log SEO validation errors
 */
export function logSEOIssues(pageUrl: string, data: PageSEOData) {
  if (process.env.NODE_ENV !== 'development') return

  const result = validatePageSEO(data)
  if (result.errors.length > 0 || result.warnings.length > 0) {
    console.group(`🔍 SEO Issues for ${pageUrl}`)
    if (result.errors.length > 0) {
      console.error('❌ Errors:', result.errors)
    }
    if (result.warnings.length > 0) {
      console.warn('⚠️ Warnings:', result.warnings)
    }
    console.groupEnd()
  }
}