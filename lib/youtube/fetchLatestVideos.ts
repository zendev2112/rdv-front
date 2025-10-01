const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.CHANNEL_ID

export interface VideoItem {
  id: string
  title: string
  thumbnailUrl: string
  publishedAt: string
  viewCount?: string
  duration?: string
}

function parseYouTubeDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  const h = match?.[1] ? match[1].replace('H', '') : ''
  const m = match?.[2] ? match[2].replace('M', '') : ''
  const s = match?.[3] ? match[3].replace('S', '') : ''
  return [h, m, s].filter(Boolean).join(':')
}

export async function fetchLatestVideos(maxResults = 5): Promise<VideoItem[]> {
  try {
    if (!API_KEY || !CHANNEL_ID) {
      console.error('YouTube API_KEY or CHANNEL_ID missing')
      return []
    }

    // 1. Get latest video IDs
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}`
    const searchRes = await fetch(searchUrl, { next: { revalidate: 3600 } })

    if (!searchRes.ok) {
      console.error('YouTube search API failed:', searchRes.status)
      return []
    }

    const searchData = await searchRes.json()

    // CHECK IF ITEMS EXISTS
    if (!searchData.items || !Array.isArray(searchData.items)) {
      console.error(
        'YouTube API returned no items:',
        searchData.error || 'Unknown error'
      )
      return []
    }

    const videoIds = searchData.items
      .filter((item: any) => item.id.kind === 'youtube#video')
      .map((item: any) => item.id.videoId)
      .join(',')

    if (!videoIds) {
      console.error('No video IDs found')
      return []
    }

    // 2. Get video details (duration, view count)
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=snippet,contentDetails,statistics`
    const videosRes = await fetch(videosUrl, { next: { revalidate: 3600 } })

    if (!videosRes.ok) {
      console.error('YouTube videos API failed:', videosRes.status)
      return []
    }

    const videosData = await videosRes.json()

    // CHECK IF ITEMS EXISTS
    if (!videosData.items || !Array.isArray(videosData.items)) {
      console.error('YouTube videos API returned no items')
      return []
    }

    return videosData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(
        'es-AR',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }
      ),
      viewCount: item.statistics?.viewCount,
      duration: parseYouTubeDuration(item.contentDetails.duration),
    }))
  } catch (error) {
    console.error('Exception in fetchLatestVideos:', error)
    return []
  }
}
