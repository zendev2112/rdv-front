export function intercalateEmbeds(
  articleContent: string,
  embeds: {
    igPost?: string
    fbPost?: string
    twPost?: string
    ytVideo?: string
    articleImages?: string | string[]
  }
): { type: 'text' | 'embed'; content: string; embedType?: string }[] {
  // Split article into paragraphs
  const paragraphs = articleContent.split('\n\n').filter((p) => p.trim())
  
  // Collect all embeds
  const embedsList: { type: string; content: string }[] = []
  
  if (embeds.igPost) embedsList.push({ type: 'instagram', content: embeds.igPost })
  if (embeds.fbPost) embedsList.push({ type: 'facebook', content: embeds.fbPost })
  if (embeds.twPost) embedsList.push({ type: 'twitter', content: embeds.twPost })
  if (embeds.ytVideo) embedsList.push({ type: 'youtube', content: embeds.ytVideo })
  
  // ✅ FIX: Handle articleImages as comma-separated string
  if (embeds.articleImages) {
    let imagesArray: string[] = []
    
    if (typeof embeds.articleImages === 'string') {
      // Split by comma and trim whitespace
      imagesArray = embeds.articleImages
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0)
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
  
  const result: { type: 'text' | 'embed'; content: string; embedType?: string }[] = []
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