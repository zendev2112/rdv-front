/**
 * Unified slot-filling algorithm for homepage section components.
 *
 * Sorts articles by editorial priority (`order` field) then by recency,
 * producing a deterministic array where:
 *   - index 0 = principal (or newest fallback)
 *   - index 1 = secundario (or next fallback)
 *   - index 2 = normal (or next fallback)
 *   - index 3+ = remaining articles by created_at DESC
 *
 * If multiple articles share the same `order`, the most recently created wins
 * that slot and the others cascade down.
 */

type Article = {
  id: string | number
  order?: string
  created_at?: string
  [key: string]: unknown
}

const PRIORITY: Record<string, number> = {
  principal: 0,
  secundario: 1,
  normal: 2,
}

function getPriority(article: Article): number {
  return PRIORITY[article.order ?? ''] ?? 3
}

function byPriorityThenDate(a: Article, b: Article): number {
  const pa = getPriority(a)
  const pb = getPriority(b)
  if (pa !== pb) return pa - pb

  // Same priority → newest first
  const da = a.created_at ? new Date(a.created_at).getTime() : 0
  const db = b.created_at ? new Date(b.created_at).getTime() : 0
  return db - da
}

/**
 * Returns articles sorted for slot placement.
 *
 * @param articles  Raw articles from the database / API
 * @param slotCount Maximum number of articles to return (= total visual slots)
 */
export function sortArticlesForSlots<T extends Article>(
  articles: T[],
  slotCount: number,
): T[] {
  if (!articles.length) return []

  const sorted = [...articles].sort(byPriorityThenDate)

  // Deduplicate: if the same article appears twice (e.g. from a view join),
  // keep the first occurrence (highest priority position).
  const seen = new Set<string | number>()
  const deduped: T[] = []
  for (const a of sorted) {
    if (!seen.has(a.id)) {
      seen.add(a.id)
      deduped.push(a)
    }
  }

  return deduped.slice(0, slotCount)
}
