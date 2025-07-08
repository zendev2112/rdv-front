const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = 'UCp-yOJF49Ps2gLJvWZ3nr8A' // Replace with your channel ID

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
  if (!API_KEY || !CHANNEL_ID) return []

  // 1. Get latest video IDs
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}`
  const searchRes = await fetch(searchUrl)
  const searchData = await searchRes.json()

  const videoIds = searchData.items
    .filter((item: any) => item.id.kind === 'youtube#video')
    .map((item: any) => item.id.videoId)
    .join(',')

  if (!videoIds) return []

  // 2. Get video details (duration, view count)
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=snippet,contentDetails,statistics`
  const videosRes = await fetch(videosUrl)
  const videosData = await videosRes.json()

  return videosData.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.high.url,
    publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }),
    viewCount: item.statistics?.viewCount,
    duration: parseYouTubeDuration(item.contentDetails.duration),
  }))
}