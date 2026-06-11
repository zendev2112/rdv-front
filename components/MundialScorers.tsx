// Goal scorers for a match, attributed to each side. Names come straight from
// the API (proper nouns, not translated); minute markers like 45' are universal.
// Handles several scorers per team: each side stacks vertically and names wrap
// instead of truncating, so the card grows to fit any number of goals.
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
    <div className={`flex justify-between items-start gap-3 mt-2 ${txt} text-gray-500`}>
      {/* Local scorers — left aligned */}
      <ul className="space-y-0.5 min-w-0 flex-1">
        {local.map((g, i) => (
          <li key={i} className="flex items-start gap-1">
            <span className="shrink-0 leading-tight">⚽</span>
            <span className="break-words leading-tight">{g}</span>
          </li>
        ))}
      </ul>
      {/* Visitor scorers — right aligned */}
      <ul className="space-y-0.5 min-w-0 flex-1 text-right">
        {visitante.map((g, i) => (
          <li key={i} className="flex items-start justify-end gap-1">
            <span className="break-words leading-tight">{g}</span>
            <span className="shrink-0 leading-tight">⚽</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
