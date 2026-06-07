import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// Map: blog post _id -> { file, alt }
const COVERS = [
  { id: 'post-en-b2b-demand-gen', file: 'b2b-demand-gen.png', alt: 'Abstract illustration of a B2B demand generation funnel turning into a connected audience network' },
  { id: 'post-en-brand-storytelling', file: 'brand-storytelling.png', alt: 'Abstract illustration of brand storytelling with a flowing ribbon forming an open book and speech bubbles' },
  { id: 'post-en-future-of-content', file: 'future-of-content.png', alt: 'Abstract illustration of AI-enhanced human-directed content with a hand and neural circuit converging' },
  { id: 'post-en-geo-strategy', file: 'geo-strategy.png', alt: 'Abstract illustration of generative engine optimization with a search prompt and orbiting AI answer cards' },
  { id: 'post-en-global-media-buying', file: 'global-media-buying.png', alt: 'Abstract illustration of global media buying with a wireframe globe and ad bid arrows' },
  { id: 'post-en-google-ads-saas-d2c', file: 'google-ads-saas-d2c.png', alt: 'Abstract illustration of Google Ads for SaaS and D2C with a cursor click and rising performance graph' },
  { id: 'post-en-italian-creative-edge', file: 'italian-creative-edge.png', alt: 'Abstract illustration of creative design driving ROAS with a pen nib and upward performance arrow' },
  { id: 'post-en-scaling-d2c', file: 'scaling-d2c.png', alt: 'Abstract illustration of scaling D2C brands globally with a rocket trajectory over a world map' },
  { id: 'post-en-tiktok-shop-global', file: 'tiktok-shop-global.png', alt: 'Abstract illustration of TikTok Shop global commerce with a smartphone, shopping bag and video feed' },
]

async function run() {
  for (const { id, file, alt } of COVERS) {
    const path = join(root, 'public', 'blog-covers', file)
    const buf = readFileSync(path)
    process.stdout.write(`Uploading ${file} ... `)
    const asset = await client.assets.upload('image', buf, { filename: file })
    await client
      .patch(id)
      .set({
        coverImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt,
        },
      })
      .commit()
    console.log(`done -> ${id}`)
  }
  console.log('\nAll covers uploaded and linked.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
