import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import { StructureBuilder } from 'sanity/structure'

// Types managed as singletons — hidden from default list
const SINGLETON_TYPES = new Set(['siteSettings', 'pageContent'])

export default defineConfig({
  name: 'default',
  title: 'Pota Studio CMS',
  projectId: 'hjzz7d9r',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S: StructureBuilder) =>
        S.list()
          .title('Content')
          .items([
            // ─── Global ──────────────────────────────────────────────────────
            S.listItem().title('Site Settings').id('site-settings-group')
              .child(
                S.list().title('Site Settings').items([
                  S.listItem().title('Site Settings — EN').id('siteSettings-en')
                    .child(S.document().schemaType('siteSettings').documentId('siteSettings-en')),
                  S.listItem().title('Site Settings — IT').id('siteSettings-it')
                    .child(S.document().schemaType('siteSettings').documentId('siteSettings-it')),
                ])
              ),

            S.divider(),

            // ─── Pages ───────────────────────────────────────────────────────
            S.listItem().title('Homepage').id('page-homepage')
              .child(
                S.list().title('Homepage').items([
                  S.listItem().title('Homepage — EN').id('pageContent-homepage-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-homepage-en')),
                  S.listItem().title('Homepage — IT').id('pageContent-homepage-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-homepage-it')),
                ])
              ),

            S.listItem().title('Services').id('page-services')
              .child(
                S.list().title('Services').items([
                  S.listItem().title('Services — EN').id('pageContent-services-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-services-en')),
                  S.listItem().title('Services — IT').id('pageContent-services-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-services-it')),
                ])
              ),

            S.listItem().title('Work').id('page-work')
              .child(
                S.list().title('Work').items([
                  S.listItem().title('Work — EN').id('pageContent-work-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-work-en')),
                  S.listItem().title('Work — IT').id('pageContent-work-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-work-it')),
                ])
              ),

            S.listItem().title('About').id('page-about')
              .child(
                S.list().title('About').items([
                  S.listItem().title('About — EN').id('pageContent-about-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-about-en')),
                  S.listItem().title('About — IT').id('pageContent-about-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-about-it')),
                ])
              ),

            S.listItem().title('Contact').id('page-contact')
              .child(
                S.list().title('Contact').items([
                  S.listItem().title('Contact — EN').id('pageContent-contact-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-contact-en')),
                  S.listItem().title('Contact — IT').id('pageContent-contact-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-contact-it')),
                ])
              ),

            S.listItem().title('Live Agency').id('page-live')
              .child(
                S.list().title('Live Agency').items([
                  S.listItem().title('Live — EN').id('pageContent-live-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-live-en')),
                  S.listItem().title('Live — IT').id('pageContent-live-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-live-it')),
                ])
              ),

            S.listItem().title('Media').id('page-media')
              .child(
                S.list().title('Media').items([
                  S.listItem().title('Media — EN').id('pageContent-media-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-media-en')),
                  S.listItem().title('Media — IT').id('pageContent-media-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-media-it')),
                ])
              ),

            S.listItem().title('Careers').id('page-careers')
              .child(
                S.list().title('Careers').items([
                  S.listItem().title('Careers — EN').id('pageContent-careers-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-careers-en')),
                  S.listItem().title('Careers — IT').id('pageContent-careers-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-careers-it')),
                ])
              ),

            S.listItem().title('Clients').id('page-clients')
              .child(
                S.list().title('Clients').items([
                  S.listItem().title('Clients — EN').id('pageContent-clients-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-clients-en')),
                  S.listItem().title('Clients — IT').id('pageContent-clients-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-clients-it')),
                ])
              ),

            S.divider(),

            // ─── Collections ─────────────────────────────────────────────────
            S.listItem().title('Case Studies').id('coll-caseStudy')
              .child(S.documentTypeList('caseStudy').title('Case Studies')),
            S.listItem().title('Team Members').id('coll-teamMember')
              .child(S.documentTypeList('teamMember').title('Team Members')),
            S.listItem().title('Job Openings').id('coll-jobOpening')
              .child(S.documentTypeList('jobOpening').title('Job Openings')),
            S.listItem().title('Testimonials').id('coll-testimonial')
              .child(S.documentTypeList('testimonial').title('Testimonials')),
            S.listItem().title('Clients').id('coll-client')
              .child(S.documentTypeList('client').title('Clients')),
            S.listItem().title('Blog Posts').id('coll-blogPost')
              .child(S.documentTypeList('blogPost').title('Blog Posts')),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
