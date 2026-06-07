import { NextRequest } from 'next/server'
import { google } from 'googleapis'
import { assertAuthorized, getOAuth2Client } from '@/lib/google-auth'
import { corsPreflight, withCors } from '@/lib/cors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEFAULT_SITEMAP_URL = 'https://www.potastudio.com/sitemap.xml'

export async function OPTIONS() { return corsPreflight() }

export async function POST(request: NextRequest) {
  const unauth = assertAuthorized(request)
  if (unauth) return withCors(unauth)

  const siteUrl = process.env.GSC_SITE_URL
  if (!siteUrl) return withCors(new Response('Missing GSC_SITE_URL', { status: 500 }))

  let body: { sitemapUrl?: string } = {}
  try { body = await request.json() } catch {}
  const feedpath = body.sitemapUrl ?? DEFAULT_SITEMAP_URL

  try {
    const auth = getOAuth2Client()
    const webmasters = google.webmasters({ version: 'v3', auth })
    await webmasters.sitemaps.submit({ siteUrl, feedpath })

    // Read back the status
    const status = await webmasters.sitemaps.get({ siteUrl, feedpath })
    return withCors(Response.json({ submitted: feedpath, status: status.data }))
  } catch (err: any) {
    return withCors(Response.json({ error: err?.message ?? 'Submit failed', details: err?.errors }, { status: 500 }))
  }
}

export async function GET(request: NextRequest) {
  const unauth = assertAuthorized(request)
  if (unauth) return withCors(unauth)

  const siteUrl = process.env.GSC_SITE_URL
  if (!siteUrl) return withCors(new Response('Missing GSC_SITE_URL', { status: 500 }))

  try {
    const auth = getOAuth2Client()
    const webmasters = google.webmasters({ version: 'v3', auth })
    const res = await webmasters.sitemaps.list({ siteUrl })
    return withCors(Response.json({ sitemaps: res.data.sitemap ?? [] }))
  } catch (err: any) {
    return withCors(Response.json({ error: err?.message ?? 'List failed' }, { status: 500 }))
  }
}
