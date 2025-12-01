'use client'

import { FaWhatsapp, FaFacebook, FaXTwitter, FaEnvelope } from 'react-icons/fa6'

export default function ArticleShareSidebar({
  title,
  url,
}: {
  title: string
  url: string
}) {
  // Ensure we have the full URL
  const fullUrl = url.startsWith('http')
    ? url
    : `${window.location.origin}${url}`

  return (
    <div className="flex flex-row md:flex-col items-center md:items-start space-x-6 md:space-x-0 md:space-y-8">
      {/* ✅ WHATSAPP */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          `${title}\n\n${fullUrl}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-400 transition"
        title="WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6" />
      </a>

      {/* ✅ FACEBOOK */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          fullUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-400 transition"
        title="Facebook"
      >
        <FaFacebook className="w-6 h-6" />
      </a>

      {/* ✅ X (TWITTER) */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(fullUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-400 transition"
        title="X (Twitter)"
      >
        <FaXTwitter className="w-6 h-6" />
      </a>

      {/* ✅ EMAIL */}
      <a
        href={`mailto:?subject=${encodeURIComponent(
          title
        )}&body=${encodeURIComponent(`${title}\n\n${fullUrl}`)}`}
        className="text-gray-600 hover:text-gray-400 transition"
        title="Email"
      >
        <FaEnvelope className="w-6 h-6" />
      </a>
    </div>
  )
}
