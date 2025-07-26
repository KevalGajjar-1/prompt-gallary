'use client';

import Script from 'next/script';

type AdUnitProps = {
  slot: string;
  format?: string;
  layout?: string;
  layoutKey?: string;
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
};

export function AdUnit({
  slot,
  format = 'auto',
  layout,
  layoutKey,
  className = '',
  style = { display: 'block' },
  responsive = true,
}: AdUnitProps) {
  const client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
  
  if (!client) {
    console.warn('Google AdSense client ID is not set');
    return null;
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-ad-layout-key={layoutKey}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}

export default function GoogleAdSense() {
  const client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
  
  if (!client) {
    console.warn('Google AdSense client ID is not set');
    return null;
  }

  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
    />
  );
}
