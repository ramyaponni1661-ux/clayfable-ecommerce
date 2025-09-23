"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { YouTubePlayer } from "@/components/youtube-player"
import { Search, Filter, Play, Calendar, Eye, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Footer from "@/components/footer"
import NotificationSystem from "@/components/notification-system"
import { UserProfile } from "@/components/user-profile"
import TrustBanner from "@/components/trust-banner"
import MobileHeader from "@/components/mobile-header"
import Link from "next/link"

interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  viewCount?: string
  likeCount?: string
  duration?: string
  channelTitle?: string
}

interface YouTubePlaylist {
  id: string
  title: string
  description: string
  thumbnail: string
  videoCount: number
  videos: YouTubeVideo[]
}

export default function VideosPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [featuredVideo, setFeaturedVideo] = useState<YouTubeVideo | null>(null)

  const categories = [
    { id: "all", name: "All Videos" },
    { id: "pottery", name: "Pottery Making" },
    { id: "techniques", name: "Techniques" },
    { id: "products", name: "Product Showcases" },
    { id: "tutorials", name: "Tutorials" },
  ]

  useEffect(() => {
    loadYouTubeContent()
  }, [])

  const loadYouTubeContent = async () => {
    setLoading(true)
    try {
      // Fetch from your API endpoint that uses YouTube Data API
      const [videosResponse, playlistsResponse] = await Promise.all([
        fetch('/api/youtube/videos'),
        fetch('/api/youtube/playlists')
      ])

      if (videosResponse.ok) {
        const videosData = await videosResponse.json()
        setVideos(videosData.items || [])
        if (videosData.items && videosData.items.length > 0) {
          setFeaturedVideo(videosData.items[0])
        }
      }

      if (playlistsResponse.ok) {
        const playlistsData = await playlistsResponse.json()
        setPlaylists(playlistsData.items || [])
      }
    } catch (error) {
      console.error('Error loading YouTube content:', error)
      // Fallback to demo data
      loadDemoData()
    } finally {
      setLoading(false)
    }
  }

  const loadDemoData = () => {
    const demoVideos: YouTubeVideo[] = [
      {
        id: "dQw4w9WgXcQ",
        title: "Traditional Pottery Making - Clayfable Heritage",
        description: "Watch our master craftsmen create beautiful terracotta pieces using traditional techniques passed down through generations.",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        publishedAt: "2024-01-15T10:00:00Z",
        viewCount: "15,234",
        likeCount: "892",
        duration: "8:45",
        channelTitle: "Clayfable Official"
      },
      {
        id: "3JZ_D3ELwAg",
        title: "Clay Preparation Process - From Earth to Art",
        description: "Learn about our meticulous clay preparation process that ensures the highest quality terracotta products.",
        thumbnail: "https://img.youtube.com/vi/3JZ_D3ELwAg/maxresdefault.jpg",
        publishedAt: "2024-01-10T14:30:00Z",
        viewCount: "8,567",
        likeCount: "445",
        duration: "12:20",
        channelTitle: "Clayfable Official"
      },
      {
        id: "L_jWHffIx5E",
        title: "Glazing Techniques for Terracotta",
        description: "Discover the art of glazing and how we create those beautiful finishes on our terracotta pieces.",
        thumbnail: "https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg",
        publishedAt: "2024-01-05T09:15:00Z",
        viewCount: "12,891",
        likeCount: "678",
        duration: "15:33",
        channelTitle: "Clayfable Official"
      }
    ]

    setVideos(demoVideos)
    setFeaturedVideo(demoVideos[0])
  }

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" ||
                           video.title.toLowerCase().includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatNumber = (num: string | undefined) => {
    if (!num) return '0'
    const number = parseInt(num.replace(/,/g, ''))
    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`
    return num
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Trust Banner */}
      <TrustBanner />

      {/* Header */}
      <MobileHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Heritage Videos</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the art of traditional pottery making through our collection of educational videos
            showcasing 72 years of craftsmanship excellence.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-orange-200 focus:border-orange-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "border-orange-200 hover:bg-orange-50"
                }
              >
                <Filter className="h-3 w-3 mr-1" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Video */}
        {featuredVideo && !loading && (
          <Card className="mb-8 border-orange-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Featured Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-video">
                  <YouTubePlayer
                    videoId={featuredVideo.id}
                    title={featuredVideo.title}
                    thumbnail={featuredVideo.thumbnail}
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{featuredVideo.title}</h3>
                  <p className="text-gray-600 mb-4">{featuredVideo.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(featuredVideo.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {formatNumber(featuredVideo.viewCount)} views
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {formatNumber(featuredVideo.likeCount)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-orange-200">
                <CardContent className="p-0">
                  <Skeleton className="aspect-video w-full rounded-t-lg" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredVideos.map((video) => (
              <Card key={video.id} className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-video relative">
                    <YouTubePlayer
                      videoId={video.id}
                      title={video.title}
                      thumbnail={video.thumbnail}
                      className="w-full h-full"
                    />
                    {video.duration && (
                      <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                        {video.duration}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(video.publishedAt)}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatNumber(video.viewCount)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {formatNumber(video.likeCount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Playlists Section */}
        {playlists.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Playlists</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="border-orange-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-video relative">
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="bg-orange-600 hover:bg-orange-700 transition-colors rounded-full p-3">
                          <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <Badge className="absolute top-2 right-2 bg-orange-600 text-white">
                        {playlist.videoCount} videos
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{playlist.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{playlist.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}