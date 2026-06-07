import { NextRequest } from 'next/server'
import { google } from 'googleapis'
import { assertAuthorized, daysAgo, getOAuth2Client } from '@/lib/google-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function runReport(propertyId: string, body: object) {
  const auth = getOAuth2Client()
  const data = google.analyticsdata({ version: 'v1beta', auth })
  const res = await data.properties.runReport({ property: `properties/${propertyId}`, requestBody: body as any })
  return res.data
}

function num(v?: string | null) { return v ? Number(v) : 0 }

export async function GET(request: NextRequest) {
  const unauth = assertAuthorized(request)
  if (unauth) return unauth

  const propertyId = process.env.GA4_PROPERTY_ID
  if (!propertyId) return new Response('Missing GA4_PROPERTY_ID', { status: 500 })

  const days = Number(request.nextUrl.searchParams.get('days') ?? 28)
  const startDate = daysAgo(days)
  const endDate = 'today'
  const prevStart = daysAgo(days * 2)
  const prevEnd = daysAgo(days + 1)

  try {
    const [overview, prevOverview, byChannel, topLandings, conversions] = await Promise.all([
      runReport(propertyId, {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'sessions' }, { name: 'totalUsers' }, { name: 'screenPageViews' },
          { name: 'engagementRate' }, { name: 'averageSessionDuration' }, { name: 'conversions' },
        ],
      }),
      runReport(propertyId, {
        dateRanges: [{ startDate: prevStart, endDate: prevEnd }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'conversions' }],
      }),
      runReport(propertyId, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }, { name: 'conversions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true } as any],
      }),
      runReport(propertyId, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'landingPage' }],
        metrics: [{ name: 'sessions' }, { name: 'conversions' }, { name: 'engagementRate' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true } as any],
        limit: '20',
      }),
      runReport(propertyId, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true } as any],
        limit: '20',
      }),
    ])

    const o = overview.rows?.[0]?.metricValues ?? []
    const p = prevOverview.rows?.[0]?.metricValues ?? []

    return Response.json({
      range: { startDate, endDate },
      previousRange: { startDate: prevStart, endDate: prevEnd },
      overview: {
        sessions: num(o[0]?.value), users: num(o[1]?.value), pageViews: num(o[2]?.value),
        engagementRate: num(o[3]?.value), avgSessionDuration: num(o[4]?.value), conversions: num(o[5]?.value),
      },
      previousOverview: { sessions: num(p[0]?.value), users: num(p[1]?.value), conversions: num(p[2]?.value) },
      byChannel: byChannel.rows?.map((r: any) => ({ channel: r.dimensionValues?.[0]?.value, sessions: num(r.metricValues?.[0]?.value), conversions: num(r.metricValues?.[1]?.value) })) ?? [],
      topLandingPages: topLandings.rows?.map((r: any) => ({ page: r.dimensionValues?.[0]?.value, sessions: num(r.metricValues?.[0]?.value), conversions: num(r.metricValues?.[1]?.value), engagementRate: num(r.metricValues?.[2]?.value) })) ?? [],
      topEvents: conversions.rows?.map((r: any) => ({ event: r.dimensionValues?.[0]?.value, count: num(r.metricValues?.[0]?.value) })) ?? [],
    })
  } catch (err: any) {
    return Response.json({ error: err?.message ?? 'GA4 error', details: err?.errors }, { status: 500 })
  }
}
