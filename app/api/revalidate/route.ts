import { revalidateTag, revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// Map Sanity _type → cache tags to revalidate on webhook publish/unpublish
const TYPE_TO_TAGS: Record<string, string[]> = {
  // Site-wide config (nav + footer merged into siteSettings)
  siteSettings:  ['siteSettings', 'siteSettings-en', 'siteSettings-it'],
  // All pages use the unified `pageContent` type with a `pageId` field
  pageContent:   [
    'pageContent',
    'pageContent-homepage-en',     'pageContent-homepage-it',
    'pageContent-aboutPage-en',    'pageContent-aboutPage-it',
    'pageContent-servicesPage-en', 'pageContent-servicesPage-it',
    'pageContent-contactPage-en',  'pageContent-contactPage-it',
    'pageContent-workPage-en',     'pageContent-workPage-it',
    'pageContent-careersPage-en',  'pageContent-careersPage-it',
    'pageContent-clientsPage-en',  'pageContent-clientsPage-it',
    'pageContent-blogPage-en',     'pageContent-blogPage-it',
    'pageContent-privacyPage-en',  'pageContent-privacyPage-it',
    'pageContent-cookiePage-en',   'pageContent-cookiePage-it',
  ],
  // Content types
  blogPost:      ['blogPost', 'blogPost-en', 'blogPost-it'],
  caseStudy:     ['caseStudies'],
  teamMember:    ['teamMember'],
  jobOpening:    ['jobOpenings'],
  testimonial:   ['testimonials'],
  client:        ['client'],
}

// All site paths — revalidated on every webhook call so pages regenerate immediately
const ALL_PATHS = [
  '/', '/it',
  '/services', '/it/services',
  '/about', '/it/about',
  '/contact', '/it/contact',
  '/careers', '/it/careers',
  '/work', '/it/work',
  '/blog', '/it/blog',
  '/clients', '/it/clients',
  '/privacy', '/it/privacy',
  '/cookie', '/it/cookie',
]

// POST /api/revalidate — called by Sanity webhook on publish/unpublish
// Sanity Webhook config:
//   URL:    https://your-domain.vercel.app/api/revalidate?secret=pota-revalidate-2026
//   Method: POST  |  Triggers: publish, unpublish
//   Projection: { _type, _id }
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET ?? 'pota-revalidate-2026'

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  let body: { _type?: string; _id?: string } = {}
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { _type } = body
  if (!_type) {
    return NextResponse.json({ error: 'Missing _type in body' }, { status: 400 })
  }

  const tags = TYPE_TO_TAGS[_type] ?? []

  // 1) Purge tags so fetch() cache entries are invalidated
  for (const tag of tags) revalidateTag(tag, 'max')

  // 2) Revalidate all paths so page HTML is regenerated immediately
  for (const path of ALL_PATHS) revalidatePath(path)

  // 3) Revalidate dynamic slug routes for content types that have them
  if (_type === 'caseStudy') {
    revalidatePath('/work/[slug]', 'page')
    revalidatePath('/it/work/[slug]', 'page')
  }
  if (_type === 'blogPost') {
    revalidatePath('/blog/[slug]', 'page')
    revalidatePath('/it/blog/[slug]', 'page')
  }

  console.log(`[revalidate] type="${_type}" → tags: [${tags.join(', ')}] + ${ALL_PATHS.length} paths`)

  return NextResponse.json({
    revalidated: true,
    type: _type,
    tags,
    paths: ALL_PATHS,
    revalidatedAt: new Date().toISOString(),
  })
}

// GET /api/revalidate?secret=... — manual full-site purge
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET ?? 'pota-revalidate-2026'

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const allTags = [...new Set(Object.values(TYPE_TO_TAGS).flat())]
  for (const tag of allTags) revalidateTag(tag, 'max')
  for (const path of ALL_PATHS) revalidatePath(path)
  // Dynamic slug routes
  revalidatePath('/work/[slug]', 'page')
  revalidatePath('/it/work/[slug]', 'page')
  revalidatePath('/blog/[slug]', 'page')
  revalidatePath('/it/blog/[slug]', 'page')

  return NextResponse.json({
    revalidated: true,
    tags: allTags,
    paths: ALL_PATHS,
    revalidatedAt: new Date().toISOString(),
  })
}

