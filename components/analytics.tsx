'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

// Hard-coded fallback so GA4 keeps working even if the env var is missing or
// not yet propagated to a fresh production build. The env var still wins when
// present so we can swap properties without a code change.
const GA_ID      = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-CMP5TYMZP3'
const GADS_ID    = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID       // e.g. AW-XXXXXXXXXX
const META_ID    = process.env.NEXT_PUBLIC_META_PIXEL_ID        // e.g. 123456789
const TIKTOK_ID  = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID     // e.g. CXXXXXXXXXX

export default function Analytics() {
  // Marketing/social pixels still wait for explicit consent.
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
      {/* ── Google Analytics 4 (always on, IP anonymized for GDPR) ── */}
      {GA_ID && (
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
            `}
          </Script>
        </>
      )}

      {/* ── Google Ads (consent-gated) ── */}
      {GADS_ID && consented && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gads-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('config', '${GADS_ID}');
            `}
          </Script>
        </>
      )}

      {/* ── Meta (Facebook) Pixel — consent-gated ── */}
      {META_ID && consented && (
        <Script id="meta-pixel" strategy="afterInteractive">
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

      {/* ── TikTok Pixel — consent-gated ── */}
      {TIKTOK_ID && consented && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
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
    check()

    // Listen for consent changes dispatched by CookieBanner
    window.addEventListener('pota_consent_change', check)
    return () => window.removeEventListener('pota_consent_change', check)
  }, [])

  if (!consented) return null

  return (
    <>
      {/* ── Google Analytics 4 ── */}
      {GA_ID && (
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
            `}
          </Script>
        </>
      )}

      {/* ── Google Ads ── */}
      {GADS_ID && !GA_ID && (
        // If GA4 is loaded it already includes the gtag lib; skip duplicate script
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
          strategy="afterInteractive"
        />
      )}
      {GADS_ID && (
        <Script id="gads-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('config', '${GADS_ID}');
          `}
        </Script>
      )}

      {/* ── Meta (Facebook) Pixel ── */}
      {META_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
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

      {/* ── TikTok Pixel ── */}
      {TIKTOK_ID && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
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
