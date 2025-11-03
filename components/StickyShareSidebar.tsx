'use client'

import ArticleShareSidebar from './ArticleShareSidebar'

export default function StickyShareSidebar({
  title,
  url,
}: {
  title: string
  url: string
}) {
  return (
    <div
      style={{
        position: 'sticky',
        top: '120px',
        height: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <ArticleShareSidebar title={title} url={url} />
    </div>
  )
}