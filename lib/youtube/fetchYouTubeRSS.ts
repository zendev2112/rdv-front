interface YouTubeVideo {
  id: string
  title: string
  thumbnailUrl: string
  publishedAt: string
  description: string
}

export async function fetchYouTubeRSS(
  channelId: string
): Promise<YouTubeVideo[]> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`

    const response = await fetch(rssUrl, {
      next: { revalidate: 3600 * 6 }, // Cache for 6 hours
    })

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`)
    }

    const xmlText = await response.text()

    // Parse XML to extract video data
    const videos = parseYouTubeRSS(xmlText)

    return videos
  } catch (error) {
    console.error('Error fetching YouTube RSS:', error)
    return []
  }
}

function parseYouTubeRSS(xmlText: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = []

  // Match all <entry> elements
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  const entries = xmlText.match(entryRegex) || []

  // FIX: Explicitly type the entry parameter as string
  entries.forEach((entry: string) => {
    // Extract video ID from: <yt:videoId>VIDEO_ID</yt:videoId>
    const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)
    const videoId = videoIdMatch ? videoIdMatch[1] : ''

    // Extract title
    const titleMatch = entry.match(/<title>(.*?)<\/title>/)
    const title = titleMatch ? titleMatch[1] : ''

    // Extract published date
    const publishedMatch = entry.match(/<published>(.*?)<\/published>/)
    const publishedAt = publishedMatch ? formatDate(publishedMatch[1]) : ''

    // Extract thumbnail - use maxresdefault for best quality
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`

    // Extract description
    const descMatch = entry.match(
      /<media:description>(.*?)<\/media:description>/
    )
    const description = descMatch ? descMatch[1] : ''

    if (videoId && title) {
      videos.push({
        id: videoId,
        title: decodeHtmlEntities(title),
        thumbnailUrl,
        publishedAt,
        description: decodeHtmlEntities(description),
      })
    }
  })

  return videos
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`
  return `Hace ${Math.floor(diffDays / 365)} años`
}

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  }

  return text.replace(/&[a-z]+;|&#\d+;/g, (match) => entities[match] || match)
}
