import { NextRequest, NextResponse } from 'next/server'

// Force dynamic to avoid static generation issues with request.url
export const dynamic = 'force-dynamic'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCYourChannelId' // Replace with actual channel ID

interface YouTubePlaylistItem {
  id: string
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
  contentDetails: {
    itemCount: number
  }
}

interface YouTubePlaylistResponse {
  items: YouTubePlaylistItem[]
  nextPageToken?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const maxResults = searchParams.get('maxResults') || '10'
    const pageToken = searchParams.get('pageToken') || ''

    if (!YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured, returning demo data')
      return NextResponse.json({
        items: getDemoPlaylistData(),
        nextPageToken: null,
        pageInfo: { totalResults: 3, resultsPerPage: 10 }
      })
    }

    // Get playlists from the channel
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlists?` +
      `key=${YOUTUBE_API_KEY}&` +
      `channelId=${CHANNEL_ID}&` +
      `part=snippet,contentDetails&` +
      `maxResults=${maxResults}` +
      (pageToken ? `&pageToken=${pageToken}` : '')

    const response = await fetch(playlistUrl)

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data: YouTubePlaylistResponse = await response.json()

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({
        items: getDemoPlaylistData(),
        nextPageToken: null,
        pageInfo: { totalResults: 3, resultsPerPage: 10 }
      })
    }

    const playlists = data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high.url,
      videoCount: item.contentDetails.itemCount,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      videos: [] // Could be populated by fetching playlist items if needed
    }))

    return NextResponse.json({
      items: playlists,
      nextPageToken: data.nextPageToken,
      pageInfo: data.pageInfo
    })

  } catch (error) {
    console.error('Error fetching YouTube playlists:', error)

    // Return demo data as fallback
    return NextResponse.json({
      items: getDemoPlaylistData(),
      nextPageToken: null,
      pageInfo: { totalResults: 3, resultsPerPage: 10 }
    })
  }
}

function getDemoPlaylistData() {
  return [
    {
      id: "PLrAXtmRdnEQy1ibfYPvYxqzqKbN9Cc6VB",
      title: "Pottery Making Techniques",
      description: "A comprehensive collection of videos showcasing various pottery making techniques used at Clayfable.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoCount: 8,
      publishedAt: "2024-01-01T00:00:00Z",
      channelTitle: "Clayfable Official",
      videos: []
    },
    {
      id: "PLrAXtmRdnEQy2ibfYPvYxqzqKbN9Cc6VC",
      title: "Product Showcases",
      description: "Featured videos highlighting our beautiful terracotta products and their unique features.",
      thumbnail: "https://img.youtube.com/vi/3JZ_D3ELwAg/maxresdefault.jpg",
      videoCount: 12,
      publishedAt: "2024-01-01T00:00:00Z",
      channelTitle: "Clayfable Official",
      videos: []
    },
    {
      id: "PLrAXtmRdnEQy3ibfYPvYxqzqKbN9Cc6VD",
      title: "Behind the Scenes",
      description: "Get an inside look at our workshop and the passionate artisans who create each piece with care.",
      thumbnail: "https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg",
      videoCount: 6,
      publishedAt: "2024-01-01T00:00:00Z",
      channelTitle: "Clayfable Official",
      videos: []
    }
  ]
}