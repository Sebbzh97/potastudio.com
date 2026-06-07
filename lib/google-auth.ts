import { google } from 'googleapis'

/**
 * Returns an OAuth2 client authenticated with the long-lived refresh token.
 * The token was generated once via OAuth Playground and stored in env vars.
 */
export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google OAuth env vars (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)')
  }
  const client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground',
  )
  client.setCredentials({ refresh_token: refreshToken })
  return client
}

/**
 * Throws a Response(401) if the request does not carry the shared secret.
 * Usage:
 *   const unauth = assertAuthorized(request); if (unauth) return unauth;
 */
export function assertAuthorized(request: Request): Response | null {
  const expected = process.env.INSIGHTS_API_SECRET
  if (!expected) return new Response('Server not configured', { status: 500 })
  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (token !== expected) return new Response('Unauthorized', { status: 401 })
  return null
}

/** Utility: returns ISO date YYYY-MM-DD `days` ago from today (UTC). */
export function daysAgo(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}
