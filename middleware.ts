import { NextResponse, type NextRequest } from 'next/server'

/**
 * Strip the `_vercel_share` query parameter on production requests.
 *
 * Vercel's Deployment Protection feature appends this token when sharing a
 * preview via the dashboard UI. It must never appear on www.potastudio.com
 * because Google will index it as a separate URL, splitting link equity and
 * creating soft 404s if the token later expires.
 *
 * We issue a 301 to the clean URL only when:
 *   1. The host is www.potastudio.com (production only — keep working on previews)
 *   2. `_vercel_share` is present in the query string
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Only strip on the canonical production domain
  if (
    url.hostname === 'www.potastudio.com' &&
    url.searchParams.has('_vercel_share')
  ) {
    url.searchParams.delete('_vercel_share')
    return NextResponse.redirect(url, { status: 301 })
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
