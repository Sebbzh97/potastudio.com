import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'hjzz7d9r',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  // useCdn: false ensures the deployed site always reads from the Sanity API directly,
  // bypassing the CDN edge cache that was causing stale navigation on v0-potastudio.vercel.app.
  useCdn: false,
})

// Image URL builder — used by Portable Text image renderer, author photos,
// cover images, etc. Accepts any Sanity image reference and returns a
// chainable URL builder (`.width()`, `.height()`, `.fit()`, `.auto()`, …).
const builder = imageUrlBuilder(client)
export const urlFor = (source: SanityImageSource) => builder.image(source)

// Write client — only used server-side (seed script / mutations)
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'hjzz7d9r',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
