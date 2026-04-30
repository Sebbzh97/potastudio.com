'use client'

import Script from 'next/script'
import { ArrowUpRight } from 'lucide-react'

interface IubendaEmbedProps {
  /** Full Iubenda policy URL, e.g. https://www.iubenda.com/privacy-policy/31096609 */
  url: string
  /** Button label, e.g. "View Privacy Policy" */
  label: string
  /** Caption shown above the button */
  caption?: string
  /** Sub-caption shown below the button */
  subCaption?: string
}

/**
 * Renders an Iubenda policy button that opens the full policy in a modal.
 * Loads `cdn.iubenda.com/iubenda.js` after interactive so the link is upgraded.
 */
export default function IubendaEmbed({ url, label, caption, subCaption }: IubendaEmbedProps) {
  return (
    <div className="border border-white/10 rounded-2xl p-6 sm:p-10 bg-[#141414]">
      {caption && (
        <p
          className="text-white text-base sm:text-lg font-semibold mb-2"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          {caption}
        </p>
      )}

      {subCaption && (
        <p className="text-[#B0B0B0] text-sm leading-relaxed mb-6 max-w-2xl">{subCaption}</p>
      )}

      <a
        href={url}
        // eslint-disable-next-line react/no-unknown-property
        title={label}
        // Iubenda hooks (ts-ignore the unknown class names)
        className="iubenda-nostyle iubenda-noiframe iubenda-embed iubenda-no-brand no-brand inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF5C00] text-white font-semibold rounded hover:bg-[#e04f00] hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all text-sm sm:text-base"
        rel="nofollow"
      >
        {label}
        <ArrowUpRight size={16} aria-hidden />
      </a>

      {/* lazyOnload ensures Iubenda's CDN loader runs only after the
          window load event, keeping it off the LCP critical path. The
          policy button still works without JS — the script merely
          upgrades the link into a modal. */}
      <Script id="iubenda-loader" strategy="lazyOnload">
        {`(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);`}
      </Script>
    </div>
  )
}
