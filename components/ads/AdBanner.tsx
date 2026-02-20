import Image from 'next/image'

interface AdBannerProps {
  imageUrl: string
  alt?: string
  href?: string
  width?: number
  height?: number
}

export default function AdBanner({
  imageUrl,
  alt = 'Advertisement',
  href,
  width = 300,
  height = 600,
}: AdBannerProps) {
  const content = (
    <div className="flex justify-center">
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        priority
        className="w-full h-auto"
      />
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}
