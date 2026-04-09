'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface AudioPlayerProps {
  src: string
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoadedMetadata = () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
      setIsLoading(false)
    }
    const onCanPlay = () => setIsLoading(false)
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    const onDurationChange = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration)
    }

    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('durationchange', onDurationChange)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('durationchange', onDurationChange)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }, [isPlaying])

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current
      if (!audio || !duration) return
      const newTime = parseFloat(e.target.value)
      audio.currentTime = newTime
      setCurrentTime(newTime)
    },
    [duration],
  )

  return (
    <div className="flex items-center gap-3 w-full py-3">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play / Pause button */}
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className="w-9 h-9 flex-shrink-0 rounded-full bg-primary-red text-white flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-40"
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isLoading ? (
          <svg
            className="animate-spin w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              className="opacity-75"
            />
          </svg>
        ) : isPlaying ? (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 ml-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Label + seek bar */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <span className="text-sm font-medium text-gray-700 leading-tight">
          Escuchá la nota completa
        </span>
        <input
          type="range"
          min={0}
          max={duration ?? 0}
          step={0.5}
          value={currentTime}
          onChange={handleSeek}
          disabled={!duration}
          className="w-full h-1 rounded-full cursor-pointer accent-[#ff0808] disabled:opacity-40"
          aria-label="Progreso de reproducción"
        />
      </div>

      {/* Single time number */}
      <span className="text-xs text-gray-400 font-mono flex-shrink-0 w-10 text-right">
        {isPlaying || currentTime > 0
          ? formatTime(currentTime)
          : formatTime(duration ?? 0)}
      </span>
    </div>
  )
}
