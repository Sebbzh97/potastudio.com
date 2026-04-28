import { NextResponse } from 'next/server'
import { getNavigation } from '@/sanity/lib/navigation'
import {
  getSiteSettings,
  getHomepage,
  getServicesPage,
  getAboutPage,
  getContactPage,
  getWorkPage,
  getCareersPage,
  getClientsPage,
} from '@/sanity/lib/page-queries'

// GET /api/sanity-check?secret=pota-check-2026
// Returns a JSON health report of every page fetch for both locales.
// Useful for verifying Sanity content is seeded and reachable after running /api/seed-copy.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== (process.env.SANITY_CHECK_SECRET ?? 'pota-check-2026')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [
    navEn,      navIt,
    settingsEn, settingsIt,
    homeEn,     homeIt,
    servicesEn, servicesIt,
    aboutEn,    aboutIt,
    contactEn,  contactIt,
    workEn,     workIt,
    careersEn,  careersIt,
    clientsEn,  clientsIt,
  ] = await Promise.all([
    getNavigation('en'),    getNavigation('it'),
    getSiteSettings('en'),  getSiteSettings('it'),
    getHomepage('en'),      getHomepage('it'),
    getServicesPage('en'),  getServicesPage('it'),
    getAboutPage('en'),     getAboutPage('it'),
    getContactPage('en'),   getContactPage('it'),
    getWorkPage('en'),      getWorkPage('it'),
    getCareersPage('en'),   getCareersPage('it'),
    getClientsPage('en'),   getClientsPage('it'),
  ])

  const ok = (doc: unknown, key: string) =>
    doc ? { ok: true, [key]: (doc as Record<string, unknown>)[key] } : { ok: false }

  const report = {
    navigation:   { en: ok(navEn, 'ctaLabel'),              it: ok(navIt, 'ctaLabel') },
    siteSettings: { en: ok(settingsEn, 'siteName'),         it: ok(settingsIt, 'siteName') },
    homepage:     { en: ok(homeEn, 'heroLabel'),            it: ok(homeIt, 'heroLabel') },
    servicesPage: { en: ok(servicesEn, 'heroHeadline'),     it: ok(servicesIt, 'heroHeadline') },
    aboutPage:    { en: ok(aboutEn, 'heroHeadline'),        it: ok(aboutIt, 'heroHeadline') },
    contactPage:  { en: ok(contactEn, 'heroHeadline'),      it: ok(contactIt, 'heroHeadline') },
    workPage:     { en: ok(workEn, 'heroHeadline'),         it: ok(workIt, 'heroHeadline') },
    careersPage:  { en: ok(careersEn, 'heroHeadline'),      it: ok(careersIt, 'heroHeadline') },
    clientsPage:  { en: ok(clientsEn, 'heroHeadline'),      it: ok(clientsIt, 'heroHeadline') },
  }

  const allOk = Object.values(report).every((section) =>
    Object.values(section).every((v) => (v as { ok: boolean }).ok),
  )

  return NextResponse.json(
    {
      status: allOk ? 'all_ok' : 'missing_documents',
      hint: allOk ? undefined : 'Run /api/seed-copy?secret=pota-seed-2026 to seed all documents.',
      projectId: 'hjzz7d9r',
      dataset: 'production',
      checkedAt: new Date().toISOString(),
      report,
    },
    { status: allOk ? 200 : 207 },
  )
}
