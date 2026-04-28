import blogPost from './blogPost'
import { blogCategory } from './blogCategory'
import { blogAuthor } from './blogAuthor'
import { blockContent } from './blockContent'
import { faqItem } from './faqItem'
import caseStudy from './caseStudy'
import teamMember from './teamMember'
import jobOpening from './jobOpening'
import testimonial from './testimonial'
import client from './client'
import { siteSettings } from './siteSettings'
import { pageContent } from './pageContent'

export const schemaTypes = [
  // Blog
  blogPost,
  blogCategory,
  blogAuthor,
  blockContent,
  faqItem,
  // Content
  caseStudy,
  teamMember,
  jobOpening,
  testimonial,
  client,
  // Site-wide config + page content
  siteSettings,
  pageContent,
]
