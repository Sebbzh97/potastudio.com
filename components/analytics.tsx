'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

// All analytics/pixel IDs come from environment variables — never hardcoded.
const GA_ID      = process.env.NEXT_PUBLIC_GA_ID               // e.g. G-XXXXXXXXXX
const GADS_ID    = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID       // e.g. AW-XXXXXXXXXX
const META_ID    = process.env.NEXT_PUBLIC_META_PIXEL_ID        // e.g. 123456789
const TIKTOK_ID  = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID     // e.g. CXXXXXXXXXX

export default function Analytics() {
  // All tracking pixels (including GA4) are consent-gated for GDPR compliance.
  // The Consent Mode v2 default in layout.tsx denies storage until accepted.
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    const check = () => {
      const val = localStorage.getItem('pota_cookie_consent')
      setConsented(val === 'accepted')
    }
    check()
    window.addEventListener('pota_consent_change', check)
    return () => window.removeEventListener('pota_consent_change', check)
  }, [])

  return (
    <>
      {/* All pixels use `afterInteractive` or `lazyOnload` to stay off the
          LCP critical path. All are consent-gated per GDPR Consent Mode v2. */}

      {/* GA4 — consent-gated, loads after user accepts cookies */}
      {GA_ID && consented && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
              gtag('consent', 'update', {
                analytics_storage: 'granted',
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
              });
            `}
          </Script>
        </>
      )}

      {/* Google Ads — consent-gated, lazy */}
      {GADS_ID && consented && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
            strategy="lazyOnload"
          />
          <Script id="gads-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('config', '${GADS_ID}');
            `}
          </Script>
        </>
      )}

      {/* Meta (Facebook) Pixel — consent-gated, lazy */}
      {META_ID && consented && (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* TikTok Pixel — consent-gated, lazy */}
      {TIKTOK_ID && consented && (
        <Script id="tiktok-pixel" strategy="lazyOnload">
          {`
            !function(w,d,t){
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
              ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._c=ttq._c||{};ttq._c[e]=n||{};
              var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;
              var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${TIKTOK_ID}');
              ttq.page();
            }(window,document,'ttq');
          `}
        </Script>
      )}
    </>
  )
}
