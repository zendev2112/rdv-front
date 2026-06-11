// Goal scorers for a match, attributed to each side. Names come straight from
// the API (proper nouns, not translated); minute markers like 45' are universal.
export default function MundialScorers({
  local,
  visitante,
  size = 'sm',
}: {
  local: string[]
  visitante: string[]
  size?: 'sm' | 'xs'
}) {
  if (local.length === 0 && visitante.length === 0) return null
  const txt = size === 'xs' ? 'text-[10px]' : 'text-[11px]'

  return (
    <div className={`flex justify-between gap-3 mt-2 ${txt} text-gray-500`}>
      <div className="space-y-0.5 min-w-0">
        {local.map((g, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="shrink-0">⚽</span>
            <span className="truncate">{g}</span>
          </div>
        ))}
      </div>
      <div className="space-y-0.5 min-w-0 text-right">
        {visitante.map((g, i) => (
          <div key={i} className="flex items-center justify-end gap-1">
            <span className="truncate">{g}</span>
            <span className="shrink-0">⚽</span>
          </div>
        ))}
      </div>
    </div>
  )
}
