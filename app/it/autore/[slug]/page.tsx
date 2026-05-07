import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getAllAuthorSlugs,
  getAuthorBySlug,
  getPostsByAuthor,
} from '@/sanity/lib/blog'
import { urlFor } from '@/sanity/lib/client'
import { JsonLd } from '@/components/json-ld'
import { authorProfileSchemaGraph } from '@/lib/jsonld/schemas'
import AuthorProfileContent from '@/components/author/author-profile-content'
import { portableTextToPlainText } from '@/lib/portable-text'

// ISR: see EN counterpart — author profiles re-render hourly so newly
// published posts surface in the "Articoli scritti da" grid without a
// full deploy.
export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs()
  return (slugs ?? []).map((s) => ({ slug: s.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return { title: 'Autore non trovato' }

  const title = `${author.name}${author.role ? ` — ${author.role}` : ''}`
  // Same defensive serialisation as the EN counterpart — handles both plain
  // string and Portable Text array without emitting [object Object].
  const bioPlain = portableTextToPlainText(author.bio ?? author.longBio_it ?? author.longBio)
  const description =
    bioPlain.slice(0, 160) ||
    `Articoli scritti da ${author.name}${author.role ? `, ${author.role}` : ''} per Pota Studio.`

  let ogImage: string | undefined
  try {
    if (author.photo?.asset?._ref || author.photo?.asset?._id) {
      ogImage = urlFor(author.photo).width(1200).height(630).fit('crop').auto('format').url()
    }
  } catch {
    ogImage = undefined
  }

  const canonical = `https://www.potastudio.com/it/autore/${slug}`
  const enHref = `https://www.potastudio.com/author/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: enHref,
        it: canonical,
        'x-default': enHref,
      },
    },
    authors: [{ name: author.name, url: `https://www.potastudio.com/author/${slug}` }],
    openGraph: {
      type: 'profile',
      title,
      description,
      url: canonical,
      siteName: 'Pota Studio',
      locale: 'it_IT',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function AuthorPageIT({ params }: Props) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const posts = await getPostsByAuthor(slug, 'it')

  let photoUrl: string | undefined
  try {
    if (author.photo?.asset?._ref || author.photo?.asset?._id) {
      photoUrl = urlFor(author.photo).width(800).height(800).fit('crop').auto('format').url()
    }
  } catch {
    photoUrl = undefined
  }

  const schemaBio = portableTextToPlainText(author.bio ?? author.longBio_it ?? author.longBio).slice(0, 300) || undefined
  const schema = authorProfileSchemaGraph({
    slug,
    name: author.name,
    role: author.role,
    shortBio: schemaBio,
    imageUrl: photoUrl,
    email: author.email,
    expertise: author.expertise ?? [],
    credentials: author.credentials ?? [],
    linkedin: author.linkedin,
    twitterX: author.twitterX,
    instagram: author.instagram,
    website: author.website,
    personalWebsite: author.personalWebsite,
    wikidataId: author.wikidataId,
    locale: 'it',
  })

  return (
    <>
      <JsonLd data={schema} />
      <AuthorProfileContent
        author={{
          _id: author._id,
          name: author.name,
          slug,
          role: author.role,
          bio: author.bio,
          longBio: author.longBio,
          longBio_it: author.longBio_it,
          expertise: author.expertise,
          yearsOfExperience: author.yearsOfExperience,
          location: author.location,
          email: author.email,
          website: author.website,
          personalWebsite: author.personalWebsite,
          wikidataId: author.wikidataId,
          linkedin: author.linkedin,
          twitterX: author.twitterX,
          instagram: author.instagram,
          photo: author.photo,
          credentials: author.credentials,
        }}
        posts={(posts ?? []).map((p: {
          _id: string
          title: string
          slug: string
          excerpt?: string
          publishedAt?: string
          readingTime?: number
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          coverImage?: { asset?: any; alt?: string }
          categories?: { title: string; slug: string; color?: string }[]
        }) => ({
          _id: p._id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          publishedAt: p.publishedAt,
          readingTime: p.readingTime,
          coverImage: p.coverImage,
          categories: p.categories,
        }))}
        locale="it"
      />
    </>
  )
}
