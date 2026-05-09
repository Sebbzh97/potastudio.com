import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Locale detection proxy — replaces the deprecated middleware.ts convention (Next.js 16)
const LOCALE_COOKIE = 'pota-locale'

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Strip Vercel deployment-protection token from public production URLs.
  // When `_vercel_share` is present the URL should 301-redirect to the clean
  // version so search engines never index the token-bearing URL.
  if (searchParams.has('_vercel_share')) {
    const clean = request.nextUrl.clone()
    clean.searchParams.delete('_vercel_share')
    return NextResponse.redirect(clean, { status: 301 })
  }

  // Forward the pathname as a request header so layout.tsx can detect locale
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Skip middleware for routes that don't need locale handling
  const isItRoute      = pathname.startsWith('/it')
  const isApiRoute     = pathname.startsWith('/api')
  const isStudioRoute  = pathname.startsWith('/studio')
  const isStaticFile   = /\.(.+)$/.test(pathname)
  const isNextInternal = pathname.startsWith('/_next')

  if (isApiRoute || isStudioRoute || isStaticFile || isNextInternal) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // If the user has an explicit locale cookie, respect it and don't redirect
  const localeCookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (localeCookie) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Detect country from Vercel's injected header (Next.js 15+ / 16 — request.geo removed)
  const country        = request.headers.get('x-vercel-ip-country') ?? ''
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const prefersItalian =
    country === 'IT' ||
    acceptLanguage.toLowerCase().startsWith('it')

  if (prefersItalian && !isItRoute) {
    const itPath = `/it${pathname === '/' ? '' : pathname}`
    const url    = request.nextUrl.clone()
    url.pathname = itPath
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
