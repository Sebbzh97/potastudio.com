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
                  S.listItem().title('Services — EN').id('pageContent-servicesPage-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-servicesPage-en')),
                  S.listItem().title('Services — IT').id('pageContent-servicesPage-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-servicesPage-it')),
                ])
              ),

            S.listItem().title('Work').id('page-work')
              .child(
                S.list().title('Work').items([
                  S.listItem().title('Work — EN').id('pageContent-workPage-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-workPage-en')),
                  S.listItem().title('Work — IT').id('pageContent-workPage-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-workPage-it')),
                ])
              ),

            S.listItem().title('About').id('page-about')
              .child(
                S.list().title('About').items([
                  S.listItem().title('About — EN').id('pageContent-aboutPage-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-aboutPage-en')),
                  S.listItem().title('About — IT').id('pageContent-aboutPage-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-aboutPage-it')),
                ])
              ),

            S.listItem().title('Contact').id('page-contact')
              .child(
                S.list().title('Contact').items([
                  S.listItem().title('Contact — EN').id('pageContent-contactPage-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-contactPage-en')),
                  S.listItem().title('Contact — IT').id('pageContent-contactPage-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-contactPage-it')),
                ])
              ),

            S.listItem().title('Careers').id('page-careers')
              .child(
                S.list().title('Careers').items([
                  S.listItem().title('Careers — EN').id('pageContent-careersPage-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-careersPage-en')),
                  S.listItem().title('Careers — IT').id('pageContent-careersPage-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-careersPage-it')),
                ])
              ),

            S.listItem().title('Clients').id('page-clients')
              .child(
                S.list().title('Clients').items([
                  S.listItem().title('Clients — EN').id('pageContent-clientsPage-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-clientsPage-en')),
                  S.listItem().title('Clients — IT').id('pageContent-clientsPage-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-clientsPage-it')),
                ])
              ),

            S.listItem().title('Blog').id('page-blog')
              .child(
                S.list().title('Blog Index Page').items([
                  S.listItem().title('Blog Index — EN').id('pageContent-blogPage-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-blogPage-en')),
                  S.listItem().title('Blog Index — IT').id('pageContent-blogPage-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-blogPage-it')),
                ])
              ),

            S.listItem().title('Privacy Policy').id('page-privacy')
              .child(
                S.list().title('Privacy Policy').items([
                  S.listItem().title('Privacy — EN').id('pageContent-privacyPage-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-privacyPage-en')),
                  S.listItem().title('Privacy — IT').id('pageContent-privacyPage-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-privacyPage-it')),
                ])
              ),

            S.listItem().title('Cookie Policy').id('page-cookie')
              .child(
                S.list().title('Cookie Policy').items([
                  S.listItem().title('Cookie — EN').id('pageContent-cookiePage-en')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-cookiePage-en')),
                  S.listItem().title('Cookie — IT').id('pageContent-cookiePage-it')
                    .child(S.document().schemaType('pageContent').documentId('pageContent-cookiePage-it')),
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
