import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Force dynamic to avoid static generation issues with request.url
export const dynamic = 'force-dynamic'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCYourChannelId' // Replace with actual channel ID

interface YouTubeVideoItem {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    thumbnails: {
      high: {
        url: string
      }
      maxres?: {
        url: string
      }
    }
    publishedAt: string
    channelTitle: string
  }
}

interface YouTubeSearchResponse {
  items: YouTubeVideoItem[]
  nextPageToken?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}

interface YouTubeVideoDetails {
  items: Array<{
    id: string
    statistics: {
      viewCount: string
      likeCount: string
    }
    contentDetails: {
      duration: string
    }
  }>
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const maxResults = searchParams.get('maxResults') || '12'
    const pageToken = searchParams.get('pageToken') || ''
    const query = searchParams.get('q') || 'pottery terracotta clayfable'

    if (!YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured, returning demo data')
      return NextResponse.json({
        items: getDemoVideoData(),
        nextPageToken: null,
        pageInfo: { totalResults: 3, resultsPerPage: 12 }
      })
    }

    // Search for videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
      `key=${YOUTUBE_API_KEY}&` +
      `channelId=${CHANNEL_ID}&` +
      `part=snippet&` +
      `type=video&` +
      `order=date&` +
      `maxResults=${maxResults}&` +
      `q=${encodeURIComponent(query)}` +
      (pageToken ? `&pageToken=${pageToken}` : '')

    const searchResponse = await fetch(searchUrl)

    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.status}`)
    }

    const searchData: YouTubeSearchResponse = await searchResponse.json()

    if (!searchData.items || searchData.items.length === 0) {
      return NextResponse.json({
        items: getDemoVideoData(),
        nextPageToken: null,
        pageInfo: { totalResults: 3, resultsPerPage: 12 }
      })
    }

    // Get video IDs for detailed information
    const videoIds = searchData.items.map(item => item.id.videoId).join(',')

    // Get video statistics and details
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
      `key=${YOUTUBE_API_KEY}&` +
      `id=${videoIds}&` +
      `part=statistics,contentDetails`

    const detailsResponse = await fetch(detailsUrl)
    const detailsData: YouTubeVideoDetails = await detailsResponse.json()

    // Combine search results with detailed information
    const videosWithDetails = searchData.items.map(item => {
      const details = detailsData.items.find(d => d.id === item.id.videoId)

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        viewCount: details?.statistics.viewCount || '0',
        likeCount: details?.statistics.likeCount || '0',
        duration: parseDuration(details?.contentDetails.duration || 'PT0S')
      }
    })

    return NextResponse.json({
      items: videosWithDetails,
      nextPageToken: searchData.nextPageToken,
      pageInfo: searchData.pageInfo
    })

  } catch (error) {
    console.error('Error fetching YouTube videos:', error)

    // Return demo data as fallback
    return NextResponse.json({
      items: getDemoVideoData(),
      nextPageToken: null,
      pageInfo: { totalResults: 3, resultsPerPage: 12 }
    })
  }
}

function parseDuration(duration: string): string {
  // Parse ISO 8601 duration format (PT4M13S) to MM:SS
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'

  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function getDemoVideoData() {
  return [
    {
      id: "dQw4w9WgXcQ",
      title: "Traditional Pottery Making - Clayfable Heritage",
      description: "Watch our master craftsmen create beautiful terracotta pieces using traditional techniques passed down through generations.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      publishedAt: "2024-01-15T10:00:00Z",
      viewCount: "15234",
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
      viewCount: "8567",
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
      viewCount: "12891",
      likeCount: "678",
      duration: "15:33",
      channelTitle: "Clayfable Official"
    }
  ]
}