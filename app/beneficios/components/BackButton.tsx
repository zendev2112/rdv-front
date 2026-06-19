'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

// Goes back in history, or to `fallback` when the page was opened directly
// (e.g. a shared cupón link) and there's no history to pop.
export default function BackButton({
  fallback = '/beneficios',
  label = 'Volver',
  className,
}: {
  fallback?: string
  label?: string
  className?: string
}) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back()
        else router.push(fallback)
      }}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-gray transition-colors hover:text-dark-gray',
        className,
      )}
    >
      <ArrowLeft size={18} />
      {label}
    </button>
  )
}
