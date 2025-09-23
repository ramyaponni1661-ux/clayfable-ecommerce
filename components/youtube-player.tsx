"use client"

import { useState } from "react"
import { Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface YouTubePlayerProps {
  videoId: string
  title?: string
  thumbnail?: string
  className?: string
}

export function YouTubePlayer({ videoId, title, thumbnail, className = "" }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const thumbnailUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  if (isPlaying) {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
          onClick={() => setIsPlaying(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title || "Product Video"}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className={`relative cursor-pointer group ${className}`} onClick={() => setIsPlaying(true)}>
      <img
        src={thumbnailUrl || "/placeholder.svg"}
        alt={title || "Video thumbnail"}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center">
        <div className="bg-red-600 hover:bg-red-700 transition-colors rounded-full p-4">
          <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
        </div>
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
          <p className="text-white font-medium">{title}</p>
        </div>
      )}
    </div>
  )
}
