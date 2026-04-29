/**
 * Conversion / engagement event helpers for Pota Studio.
 *
 * The site currently runs Google Analytics 4 directly via gtag.js
 * (loaded server-side in app/layout.tsx) and is forward-compatible with
 * a future GTM container — both setups consume window.dataLayer, so
 * pushing well-shaped events here lets us wire them up either way.
 *
 * Privacy:
 *   - All helpers are SSR-safe (no side effects at import time).
 *   - We never send raw email, phone, or other PII to dataLayer.
 *
 * Usage:
 *   import { trackContactForm } from '@/lib/gtm-events'
 *   trackContactForm({ formName: 'main_contact', service: 'social' })
 */

type DataLayerEvent = Record<string, string | number | boolean | undefined>

interface DataLayerWindow extends Window {
  dataLayer?: DataLayerEvent[]
}

function pushEvent(event: string, data: DataLayerEvent = {}): void {
  if (typeof window === 'undefined') return
  const w = window as DataLayerWindow
  // gtag.js initialises the array; we only ever read/append, never replace.
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...data })
}

// ─────────────────────────────────────────────────────────────────────
// Conversion events
// ─────────────────────────────────────────────────────────────────────

export type ContactMethod = 'email' | 'phone' | 'form'

export function trackContactForm(params: {
  formName: string
  service?: string
  budget?: string
}): void {
  pushEvent('contact_form_submit', {
    form_name: params.formName,
    service_interest: params.service || 'unspecified',
    budget_range: params.budget || 'unspecified',
  })
}

export function trackContactClick(params: {
  type: ContactMethod
  location: string
}): void {
  pushEvent('contact_click', {
    contact_type: params.type,
    click_location: params.location,
  })
}

export function trackNewsletterSignup(params: { location: string }): void {
  pushEvent('newsletter_signup', {
    signup_location: params.location,
  })
}

// ─────────────────────────────────────────────────────────────────────
// Engagement events
// ─────────────────────────────────────────────────────────────────────

export function trackCTAClick(params: {
  ctaText: string
  ctaLocation: string
  targetUrl?: string
}): void {
  pushEvent('cta_click', {
    cta_text: params.ctaText,
    cta_location: params.ctaLocation,
    target_url: params.targetUrl || '',
  })
}

export function trackCaseStudyView(params: {
  slug: string
  client: string
  category?: string
  year?: string
}): void {
  pushEvent('case_study_view', {
    case_study_slug: params.slug,
    client_name: params.client,
    category: params.category || 'unspecified',
    year: params.year || 'unspecified',
  })
}

export type SocialPlatform =
  | 'linkedin'
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'twitter'
  | 'youtube'

export function trackSocialClick(params: {
  platform: SocialPlatform
  location: string
}): void {
  pushEvent('social_click', {
    social_platform: params.platform,
    click_location: params.location,
  })
}

export function trackFileDownload(params: {
  fileName: string
  fileType: string
  fileCategory?: string
}): void {
  pushEvent('file_download', {
    file_name: params.fileName,
    file_type: params.fileType,
    file_category: params.fileCategory || 'general',
  })
}

export function trackServiceEngagement(params: {
  serviceName: string
  engagementType: 'view' | 'scroll_50' | 'scroll_100' | 'cta_clicked'
}): void {
  pushEvent('service_engagement', {
    service_name: params.serviceName,
    engagement_type: params.engagementType,
  })
}
