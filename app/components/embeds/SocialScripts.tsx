'use client';

import Script from 'next/script';
import { useState } from 'react';

export default function SocialScripts() {
  const [fbLoaded, setFbLoaded] = useState(false);
  const [twitterLoaded, setTwitterLoaded] = useState(false);
  const [instagramLoaded, setInstagramLoaded] = useState(false);
  
  return (
    <>
      {/* Facebook SDK */}
      <Script
        id="facebook-jssdk"
        src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v17.0"
        strategy="lazyOnload"
        onLoad={() => setFbLoaded(true)}
      />
      
      {/* Twitter Widgets */}
      <Script
        id="twitter-widgets"
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => setTwitterLoaded(true)}
      />
      
      {/* Instagram Embed */}
      <Script
        id="instagram-embed"
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => setInstagramLoaded(true)}
      />
    </>
  );
}