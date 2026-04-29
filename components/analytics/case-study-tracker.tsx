'use client'

import { useEffect } from 'react'
import { trackCaseStudyView } from '@/lib/gtm-events'

interface CaseStudyTrackerProps {
  slug: string
  client: string
  category?: string
  year?: string
}

/**
 * Fires a single `case_study_view` event into the dataLayer once a
 * case study page has mounted on the client. Renders nothing.
 */
export default function CaseStudyTracker({
  slug,
  client,
  category,
  year,
}: CaseStudyTrackerProps) {
  useEffect(() => {
    trackCaseStudyView({ slug, client, category, year })
  }, [slug, client, category, year])

  return null
}
