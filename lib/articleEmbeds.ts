export function intercalateEmbeds(
  articleContent: string,
  embeds: {
    igPost?: string
    fbPost?: string
    twPost?: string
    ytVideo?: string
    articleImages?: string | string[]
  },
): { type: 'text' | 'embed'; content: string; embedType?: string }[] {
  // Split article into paragraphs
  const paragraphs = articleContent.split('\n\n').filter((p) => p.trim())

  // Collect all embeds
  const embedsList: { type: string; content: string }[] = []

  if (embeds.igPost)
    embedsList.push({ type: 'instagram', content: embeds.igPost })
  if (embeds.fbPost)
    embedsList.push({ type: 'facebook', content: embeds.fbPost })
  if (embeds.twPost)
    embedsList.push({ type: 'twitter', content: embeds.twPost })
  if (embeds.ytVideo)
    embedsList.push({ type: 'youtube', content: embeds.ytVideo })

  // ✅ FIX: Handle articleImages as comma-separated string
  if (embeds.articleImages) {
    let imagesArray: string[] = []

    if (typeof embeds.articleImages === 'string') {
      // Split by comma and trim whitespace
      imagesArray = embeds.articleImages
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
    } else if (Array.isArray(embeds.articleImages)) {
      imagesArray = embeds.articleImages
    }

    imagesArray.forEach((img) => {
      embedsList.push({ type: 'image', content: img })
    })
  }

  if (embedsList.length === 0) {
    return [{ type: 'text', content: articleContent }]
  }

  // ✅ FIX: Better distribution - calculate how many paragraphs between each embed
  const totalParagraphs = paragraphs.length
  const totalEmbeds = embedsList.length
  const spacing = Math.floor(totalParagraphs / (totalEmbeds + 1))

  const result: {
    type: 'text' | 'embed'
    content: string
    embedType?: string
  }[] = []
  let embedIndex = 0
  let paragraphsSinceLastEmbed = 0

  paragraphs.forEach((paragraph, index) => {
    result.push({ type: 'text', content: paragraph })
    paragraphsSinceLastEmbed++

    // Insert embed after every 'spacing' paragraphs
    if (
      embedIndex < totalEmbeds &&
      paragraphsSinceLastEmbed >= spacing &&
      index < totalParagraphs - 1 // Don't add after last paragraph
    ) {
      result.push({
        type: 'embed',
        content: embedsList[embedIndex].content,
        embedType: embedsList[embedIndex].type,
      })
      embedIndex++
      paragraphsSinceLastEmbed = 0
    }
  })

  // Add any remaining embeds at the end
  while (embedIndex < totalEmbeds) {
    result.push({
      type: 'embed',
      content: embedsList[embedIndex].content,
      embedType: embedsList[embedIndex].type,
    })
    embedIndex++
  }

  return result
}

export function extractYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ''
}

export interface SuggestedArticle {
  id: string
  title: string
  slug: string
  imgUrl?: string
  overline?: string
  created_at?: string
  section?: string
  section_path?: string
}

/**
 * Injects suggestion cards into an already-intercalated content parts array.
 * Positions are based on reading time:
 *   < 3 min  → 1 suggestion at the very end
 *   3–6 min  → 1 suggestion at midpoint
 *   6–10 min → 2 suggestions at ⅓ and ⅔
 *   10+ min  → 3 suggestions at ¼, ½ and ¾
 */
export function intercalateSuggestions(
  parts: { type: 'text' | 'embed'; content: string; embedType?: string }[],
  suggestions: SuggestedArticle[],
  readingTimeMinutes: number,
): {
  type: 'text' | 'embed' | 'suggestion'
  content: string
  embedType?: string
  suggestion?: SuggestedArticle
}[] {
  if (suggestions.length === 0) return parts as any

  const textCount = parts.filter((p) => p.type === 'text').length

  // Calculate insertion positions (as fractions of text parts)
  let fractions: number[]
  if (readingTimeMinutes < 3) {
    fractions = [1] // end
  } else if (readingTimeMinutes < 6) {
    fractions = [0.5]
  } else if (readingTimeMinutes < 10) {
    fractions = [1 / 3, 2 / 3]
  } else {
    fractions = [0.25, 0.5, 0.75]
  }

  // Convert fractions to text-part indices
  const insertAfterTextIndex = fractions
    .slice(0, suggestions.length)
    .map((f) => Math.max(0, Math.round(textCount * f) - 1))

  const result: any[] = []
  let textSeen = 0
  let suggestionIndex = 0

  for (const part of parts) {
    result.push(part)

    if (part.type === 'text') {
      if (
        suggestionIndex < insertAfterTextIndex.length &&
        textSeen === insertAfterTextIndex[suggestionIndex]
      ) {
        result.push({
          type: 'suggestion',
          content: '',
          suggestion: suggestions[suggestionIndex],
        })
        suggestionIndex++
      }
      textSeen++
    }
  }

  // Any remaining suggestions go at the end
  while (suggestionIndex < suggestions.length) {
    result.push({
      type: 'suggestion',
      content: '',
      suggestion: suggestions[suggestionIndex],
    })
    suggestionIndex++
  }

  return result
}
