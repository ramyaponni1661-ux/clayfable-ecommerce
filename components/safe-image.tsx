"use client";

import { useState } from 'react'
import { Package } from 'lucide-react'

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | string[]
  fallback?: string
  showIcon?: boolean
}

export function SafeImage({
  src,
  fallback = '/api/placeholder/300/300',
  showIcon = false,
  className = '',
  alt = '',
  ...props
}: SafeImageProps) {
  const [imgError, setImgError] = useState(false)
  const [imgSrc, setImgSrc] = useState(() => {
    // Handle various image source formats
    if (!src) return fallback

    if (Array.isArray(src)) {
      return src.length > 0 ? src[0] : fallback
    }

    if (typeof src === 'string') {
      // Filter out blob URLs, malformed URLs, etc.
      if (src.startsWith('blob:') ||
          src.includes('[%22') ||
          src.includes('%22]') ||
          src.startsWith('[') ||
          src.endsWith(']')) {
        return fallback
      }
      return src
    }

    return fallback
  })

  const handleError = () => {
    if (!imgError) {
      setImgError(true)
      setImgSrc(fallback)
    }
  }

  const handleLoad = () => {
    setImgError(false)
  }

  // If showing icon and no valid src, show package icon
  if (showIcon && (imgError || !imgSrc || imgSrc === fallback)) {
    return (
      <div className={`${className} flex items-center justify-center bg-orange-100`} {...props}>
        <Package className="w-1/2 h-1/2 text-orange-600" />
      </div>
    )
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  )
}