import { NextRequest } from 'next/server'
import { google } from 'googleapis'
import { assertAuthorized, daysAgo, getOAuth2Client } from '@/lib/google-auth'
import { corsPreflight, withCors } from '@/lib/cors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function OPTIONS() { return corsPreflight() }

type Range = { startDate: string; endDate: string }

function getRanges(days = 28): { current: Range; previous: Range } {
  // GSC has ~2-3 day lag; offset window by 3 days
  const end = daysAgo(3)
  const start = daysAgo(3 + days - 1)
  const prevEnd = daysAgo(3 + days)
  const prevStart = daysAgo(3 + 2 * days - 1)
  return {
    current: { startDate: start, endDate: end },
    previous: { startDate: prevStart, endDate: prevEnd },
  }
}

async function queryGsc(siteUrl: string, body: object) {
  const auth = getOAuth2Client()
  const webmasters = google.webmasters({ version: 'v3', auth })
  const res = await webmasters.searchanalytics.query({ siteUrl, requestBody: body as any })
  return res.data.rows ?? []
}

function aggregate(rows: any[]): { clicks: number; impressions: number; ctr: number; position: number } {
  const totals = rows.reduce(
    (acc, r) => {
      acc.clicks += r.clicks ?? 0
      acc.impressions += r.impressions ?? 0
      acc.posSum += (r.position ?? 0) * (r.impressions ?? 0)
      return acc
    },
    { clicks: 0, impressions: 0, posSum: 0 },
  )
  const ctr = totals.impressions ? totals.clicks / totals.impressions : 0
  const position = totals.impressions ? totals.posSum / totals.impressions : 0
  return { clicks: totals.clicks, impressions: totals.impressions, ctr, position }
}

export async function GET(request: NextRequest) {
  const unauth = assertAuthorized(request)
  if (unauth) return withCors(unauth)

  const siteUrl = process.env.GSC_SITE_URL
  if (!siteUrl) return withCors(new Response('Missing GSC_SITE_URL', { status: 500 }))

  const days = Number(request.nextUrl.searchParams.get('days') ?? 28)
  const { current, previous } = getRanges(days)

  try {
    const [overviewRows, prevOverviewRows, topQueries, topPages, lowCtrPages, opportunityQueries] = await Promise.all([
      queryGsc(siteUrl, { ...current, dimensions: ['date'], rowLimit: 500 }),
      queryGsc(siteUrl, { ...previous, dimensions: ['date'], rowLimit: 500 }),
      queryGsc(siteUrl, { ...current, dimensions: ['query'], rowLimit: 50, orderBy: [{ field: 'impressions', sortOrder: 'DESCENDING' }] as any }),
      queryGsc(siteUrl, { ...current, dimensions: ['page'], rowLimit: 50, orderBy: [{ field: 'clicks', sortOrder: 'DESCENDING' }] as any }),
      queryGsc(siteUrl, { ...current, dimensions: ['page'], rowLimit: 100 }),
      queryGsc(siteUrl, { ...current, dimensions: ['query', 'page'], rowLimit: 200 }),
    ])

    const overview = aggregate(overviewRows)
    const previousOverview = aggregate(prevOverviewRows)

    const lowCtr = lowCtrPages
      .filter((r: any) => (r.impressions ?? 0) >= 200 && (r.ctr ?? 1) < 0.02)
      .sort((a: any, b: any) => (b.impressions ?? 0) - (a.impressions ?? 0))
      .slice(0, 20)
      .map((r: any) => ({ page: r.keys?.[0], impressions: r.impressions, clicks: r.clicks, ctr: r.ctr, position: r.position }))

    const opportunities = opportunityQueries
      .filter((r: any) => (r.position ?? 99) >= 4 && (r.position ?? 99) <= 15 && (r.impressions ?? 0) >= 50)
      .sort((a: any, b: any) => (b.impressions ?? 0) - (a.impressions ?? 0))
      .slice(0, 30)
      .map((r: any) => ({ query: r.keys?.[0], page: r.keys?.[1], impressions: r.impressions, clicks: r.clicks, ctr: r.ctr, position: r.position }))

    return withCors(Response.json({
      range: current,
      previousRange: previous,
      overview,
      previousOverview,
      delta: {
        clicks: overview.clicks - previousOverview.clicks,
        impressions: overview.impressions - previousOverview.impressions,
      },
      topQueries: topQueries.map((r: any) => ({ query: r.keys?.[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })),
      topPages: topPages.map((r: any) => ({ page: r.keys?.[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })),
      lowCtrPages: lowCtr,
      opportunities,
    }))
  } catch (err: any) {
    return withCors(Response.json({ error: err?.message ?? 'GSC error', details: err?.errors }, { status: 500 }))
  }
}
