export async function fetchSectionArticles(section: string) {
  try {
    // Use absolute URL for server component fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles?front=${section}&status=published`, {
      // Add cache control
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }
    
    // Parse the response as JSON
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching ${section} articles:`, error);
    // Return empty array on error
    return [];
  }
}

export async function fetchLatestHeadlines() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(
      `${baseUrl}/api/articles?status=published&limit=10&orderBy=created_at&order=desc`,
      {
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch headlines: ${response.status}`)
    }

    const articles = await response.json()

    // Transform to HeadlineItem format
    return Array.isArray(articles)
      ? articles.map((article) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          section: article.section,
          timestamp: article.created_at, // Keep the original ISO date string
        }))
      : []
  } catch (error) {
    console.error('Error fetching latest headlines:', error)
    return []
  }
}