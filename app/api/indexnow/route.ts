import { NextRequest } from 'next/server'
import { assertAuthorized } from '@/lib/google-auth'
import { corsPreflight, withCors } from '@/lib/cors'

export const runtime = 'nodejs'

const ENDPOINT = 'https://api.indexnow.org/indexnow'
const HOST = 'www.potastudio.com'

export async function OPTIONS() { return corsPreflight() }

export async function POST(request: NextRequest) {
  const unauth = assertAuthorized(request)
  if (unauth) return withCors(unauth)

  const key = process.env.INDEXNOW_KEY
  if (!key) return withCors(new Response('Missing INDEXNOW_KEY', { status: 500 }))

  let body: { urls?: string[] } = {}
  try { body = await request.json() } catch {}
  const urls = (body.urls ?? []).filter((u) => typeof u === 'string' && u.startsWith('https://'))
  if (urls.length === 0) return withCors(Response.json({ error: 'Provide { urls: string[] }' }, { status: 400 }))

  const payload = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList: urls.slice(0, 10000),
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  })
  return withCors(Response.json({ submitted: urls.length, status: res.status, statusText: res.statusText }))
}

export async function GET() {
  return withCors(Response.json({ ok: true, host: HOST, hint: 'POST { urls: [...] } with Bearer INSIGHTS_API_SECRET' }))
}
