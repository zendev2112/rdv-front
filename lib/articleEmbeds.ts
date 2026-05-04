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
 *
 * HTML articles are split into per-paragraph pieces before placement so
 * suggestions are distributed throughout the text, not dumped at the bottom.
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

  // Expand HTML text parts into individual paragraph chunks so suggestions
  // can be placed between them rather than all at the end.
  const expanded: any[] = []
  for (const part of parts) {
    if (part.type === 'text' && part.content.trimStart().startsWith('<')) {
      const chunks = part.content
        .split('</p>')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => s + '</p>')
      if (chunks.length > 1) {
        chunks.forEach((c) => expanded.push({ type: 'text', content: c }))
        continue
      }
    }
    expanded.push(part)
  }

  const textCount = expanded.filter((p) => p.type === 'text').length
  if (textCount === 0) return expanded

  // 1-based: "insert after the Nth text part"
  let insertAfterNth: number[]
  if (readingTimeMinutes < 3) {
    insertAfterNth = [textCount] // after the very last paragraph
  } else if (readingTimeMinutes < 6) {
    insertAfterNth = [Math.max(1, Math.round(textCount * 0.5))]
  } else if (readingTimeMinutes < 10) {
    insertAfterNth = [
      Math.max(1, Math.round(textCount * (1 / 3))),
      Math.max(1, Math.round(textCount * (2 / 3))),
    ]
  } else {
    insertAfterNth = [
      Math.max(1, Math.round(textCount * 0.25)),
      Math.max(1, Math.round(textCount * 0.5)),
      Math.max(1, Math.round(textCount * 0.75)),
    ]
  }

  // Deduplicate and cap to available suggestions
  const positions = [...new Set(insertAfterNth)].slice(0, suggestions.length)

  const result: any[] = []
  let textSeen = 0
  let suggestionIndex = 0

  for (const part of expanded) {
    result.push(part)

    if (part.type === 'text') {
      textSeen++
      // Use while so multiple suggestions at the same position all get placed
      while (
        suggestionIndex < positions.length &&
        textSeen === positions[suggestionIndex]
      ) {
        result.push({
          type: 'suggestion',
          content: '',
          suggestion: suggestions[suggestionIndex],
        })
        suggestionIndex++
      }
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
