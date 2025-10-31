'use client'

import { FaWhatsapp, FaFacebook, FaXTwitter, FaEnvelope } from 'react-icons/fa6'

export default function ArticleShareSidebar({
  title,
  url,
}: {
  title: string
  url: string
}) {
  return (
    <div className="flex flex-col items-center space-y-8">
      {/* ✅ WHATSAPP */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-400 transition"
        title="WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6" />
      </a>

      {/* ✅ FACEBOOK */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-400 transition"
        title="Facebook"
      >
        <FaFacebook className="w-6 h-6" />
      </a>

      {/* ✅ X (TWITTER) */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-400 transition"
        title="X (Twitter)"
      >
        <FaXTwitter className="w-6 h-6" />
      </a>

      {/* ✅ EMAIL */}
      <a
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
        className="text-gray-600 hover:text-gray-400 transition"
        title="Email"
      >
        <FaEnvelope className="w-6 h-6" />
      </a>
    </div>
  )
}
