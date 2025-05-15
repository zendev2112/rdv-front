'use client';

import { FacebookEmbed, InstagramEmbed, TwitterEmbed, YouTubeEmbed } from './SocialEmbeds';
import SocialScripts from './SocialScripts';

interface ArticleEmbedsProps {
  fbPost?: string | null;
  igPost?: string | null;
  twPost?: string | null;
  ytVideo?: string | null;
}

export default function ArticleEmbeds({ fbPost, igPost, twPost, ytVideo }: ArticleEmbedsProps) {
  // Only render if we have at least one embed
  if (!fbPost && !igPost && !twPost && !ytVideo) return null;
  
  return (
    <div className="article-embeds my-8">
      {/* Load all social media scripts */}
      <SocialScripts />
      
      {/* Render embeds based on available URLs */}
      {fbPost && <FacebookEmbed url={fbPost} />}
      {igPost && <InstagramEmbed url={igPost} />}
      {twPost && <TwitterEmbed url={twPost} />}
      {ytVideo && <YouTubeEmbed url={ytVideo} />}
    </div>
  );
}