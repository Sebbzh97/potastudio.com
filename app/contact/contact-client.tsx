'use client'

import { useState } from 'react'
import { ArrowUpRight, Instagram, Linkedin } from 'lucide-react'

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
)

const defaultServices = [
  'Social Media Management',
  'Paid Advertising',
  'Content Production',
  'Web Design & Development',
  'Influencer Marketing',
  'Brand Representation',
  'Other',
]

interface ContactData {
  heroLabel?: string
  heroHeadline?: string
  heroAccent?: string
  heroBody?: string
  directLabel?: string
  followLabel?: string
  emailLabel?: string
  phoneLabel?: string
  founderName?: string
  founderRole?: string
  addressLabel?: string
  addressLine1?: string
  addressLine2?: string
  formHeadline?: string
  formNameLabel?: string
  formEmailLabel?: string
  formCompanyLabel?: string
  formServiceLabel?: string
  formBudgetLabel?: string
  formMessageLabel?: string
  formButtonLabel?: string
  formPrivacyDisclaimer?: string
  formSuccessTitle?: string
  formSuccessBody?: string
}

export default function ContactPageClient({ data }: { data?: ContactData | null }) {
  const heroLabel    = data?.heroLabel    ?? 'Contact'
  const heroHeadline = data?.heroHeadline ?? "Let's build\nsomething."
  const heroBody     = data?.heroBody     ?? 'Tell us about your brand and what you are trying to achieve. We respond within 24 hours, usually faster.'

  const [heroLine1, heroLine2] = heroHeadline.includes('\n')
    ? heroHeadline.split('\n')
    : [heroHeadline, '']

  const directLabel  = data?.directLabel  ?? 'Direct'
  const addressLabel = data?.addressLabel ?? 'Offices'
  const followLabel  = data?.followLabel  ?? 'Follow Us'

  const emailAddress = data?.emailLabel ?? 'ciao@potastudio.com'
  // Mask the email visually as an anti-spam measure: "ciao@potastudio.com" → "ciao (at) potastudio (dot) com"
  const maskedEmail = emailAddress.replace('@', ' (at) ').replace(/\.(?=[^.]*$)/, ' (dot) ')

  const founderName = data?.founderName  ?? 'Sebastian Bonfanti'
  const founderRole = data?.founderRole  ?? 'Founder & CEO'

  const addressLine1 = data?.addressLine1 ?? 'Bergamo HQ'
  const addressLine2 = data?.addressLine2 ?? 'Ponte San Pietro, Bergamo, Italy'

  const formNameLabel    = data?.formNameLabel    ?? 'Your Name'
  const formEmailLabel   = data?.formEmailLabel   ?? 'Email'
  const formCompanyLabel = data?.formCompanyLabel ?? 'Company'
  const formServiceLabel = data?.formServiceLabel ?? 'Service Needed'
  const formBudgetLabel  = data?.formBudgetLabel  ?? 'Monthly Budget'
  const formMessageLabel = data?.formMessageLabel ?? 'Your Brief'
  const formButtonLabel  = data?.formButtonLabel  ?? 'Send Brief'
  const privacyDisclaimer = data?.formPrivacyDisclaimer ?? ''
  const successTitle     = data?.formSuccessTitle ?? 'Message sent.'
  const successBody      = data?.formSuccessBody  ?? 'We will review your brief and get back to you within 24 hours. Usually much faster.'

  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', budget: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main>
      {/* Hero */}
      <section className="pt-28 sm:pt-40 pb-12 sm:pb-24 bg-[#0D0D0D] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
          aria-hidden="true"
        />
        <div className="container-site relative">
          <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">
            {heroLabel}
          </span>
          <h1
            className="font-bold text-white leading-[1.05] mb-5 sm:mb-6"
            style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(3rem, 11vw, 8rem)' }}
          >
            {heroLine1}
            {heroLine2 && (
              <>
                <br />
                <span className="text-[#FF5C00]">{heroLine2}</span>
              </>
            )}
          </h1>
          <p className="text-base sm:text-xl text-[#B0B0B0] max-w-xl leading-relaxed">{heroBody}</p>
        </div>
      </section>

      {/* Contact grid */}
      <section className="py-12 sm:py-24 bg-[#0D0D0D] border-t border-white/10">
          <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 sm:gap-16">

            {/* Left: Info */}
            <div className="lg:col-span-2 flex flex-col gap-8 sm:gap-10">
              <div>
                <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">
                  {directLabel}
                </span>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-white font-semibold mb-1" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                      {founderName}
                    </p>
                    <p className="text-[#B0B0B0] text-sm mb-2">{founderRole}</p>
                    <a href={`mailto:${emailAddress}`} className="text-[#FF5C00] text-sm hover:underline">
                      {maskedEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">
                  {addressLabel}
                </span>
                <div className="flex flex-col gap-4 sm:gap-6">
                  <div className="border border-white/10 rounded-xl p-4 sm:p-5 bg-[#141414]">
                    <p className="text-white font-semibold text-sm mb-1" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                      {addressLine1}
                    </p>
                    <p className="text-[#B0B0B0] text-sm">{addressLine2}</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-4 sm:mb-6 block">
                  {followLabel}
                </span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <a href="https://instagram.com/potastudio" target="_blank" rel="noopener noreferrer" aria-label="Follow Pota Studio on Instagram"
                    className="w-11 h-11 border border-white/20 rounded-full flex items-center justify-center text-[#B0B0B0] hover:text-[#FF5C00] hover:border-[#FF5C00] transition-colors">
                    <Instagram size={18} aria-hidden="true" />
                  </a>
                  <a href="https://tiktok.com/@potastudio" target="_blank" rel="noopener noreferrer" aria-label="Follow Pota Studio on TikTok"
                    className="w-11 h-11 border border-white/20 rounded-full flex items-center justify-center text-[#B0B0B0] hover:text-[#FF5C00] hover:border-[#FF5C00] transition-colors">
                    <TikTokIcon />
                  </a>
                  <a href="https://linkedin.com/company/potastudio" target="_blank" rel="noopener noreferrer" aria-label="Follow Pota Studio on LinkedIn"
                    className="w-11 h-11 border border-white/20 rounded-full flex items-center justify-center text-[#B0B0B0] hover:text-[#FF5C00] hover:border-[#FF5C00] transition-colors">
                    <Linkedin size={18} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 border border-white/10 rounded-2xl bg-[#141414]">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FF5C00]/20 flex items-center justify-center mb-5 sm:mb-6">
                    <ArrowUpRight className="text-[#FF5C00]" size={24} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    {successTitle}
                  </h2>
                  <p className="text-[#B0B0B0] max-w-sm text-sm sm:text-base px-4">{successBody}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-xs font-semibold text-[#B0B0B0] uppercase tracking-widest">
                        {formNameLabel} <span className="text-[#FF5C00]">*</span>
                      </label>
                      <input id="name" name="name" type="text" required aria-required="true" value={form.name} onChange={handleChange}
                        placeholder="Sebastian Bonfanti"
                        className="px-4 py-3 bg-[#141414] border border-white/10 rounded-lg text-white placeholder-[#B0B0B0] text-sm focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] focus-visible:border-[#FF5C00] focus:border-[#FF5C00] transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-xs font-semibold text-[#B0B0B0] uppercase tracking-widest">
                        {formEmailLabel} <span className="text-[#FF5C00]">*</span>
                      </label>
                      <input id="email" name="email" type="email" required aria-required="true" value={form.email} onChange={handleChange}
                        placeholder="you@company.com"
                        className="px-4 py-3 bg-[#141414] border border-white/10 rounded-lg text-white placeholder-[#B0B0B0] text-sm focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] focus-visible:border-[#FF5C00] focus:border-[#FF5C00] transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="company" className="text-xs font-semibold text-[#B0B0B0] uppercase tracking-widest">
                        {formCompanyLabel}
                      </label>
                      <input id="company" name="company" type="text" value={form.company} onChange={handleChange}
                        placeholder="Acme S.r.l."
                        className="px-4 py-3 bg-[#141414] border border-white/10 rounded-lg text-white placeholder-[#B0B0B0] text-sm focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] focus-visible:border-[#FF5C00] focus:border-[#FF5C00] transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="service" className="text-xs font-semibold text-[#B0B0B0] uppercase tracking-widest">
                        {formServiceLabel}
                      </label>
                      <select id="service" name="service" value={form.service} onChange={handleChange}
                        className="px-4 py-3 bg-[#141414] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] focus-visible:border-[#FF5C00] focus:border-[#FF5C00] transition-colors appearance-none">
                        <option value="" className="bg-[#141414]">Select...</option>
                        {defaultServices.map((s) => (
                          <option key={s} value={s} className="bg-[#141414]">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="budget" className="text-xs font-semibold text-[#B0B0B0] uppercase tracking-widest">
                      {formBudgetLabel}
                    </label>
                    <select id="budget" name="budget" value={form.budget} onChange={handleChange}
                      className="px-4 py-3 bg-[#141414] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] focus-visible:border-[#FF5C00] focus:border-[#FF5C00] transition-colors appearance-none">
                      <option value="" className="bg-[#141414]">Select...</option>
                      <option value="under-2k" className="bg-[#141414]">Under €2,000</option>
                      <option value="2k-5k" className="bg-[#141414]">€2,000 – €5,000</option>
                      <option value="5k-10k" className="bg-[#141414]">€5,000 – €10,000</option>
                      <option value="10k-25k" className="bg-[#141414]">€10,000 – €25,000</option>
                      <option value="25k+" className="bg-[#141414]">€25,000+</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs font-semibold text-[#B0B0B0] uppercase tracking-widest">
                      {formMessageLabel} <span className="text-[#FF5C00]">*</span>
                    </label>
                    <textarea id="message" name="message" required aria-required="true" rows={5} value={form.message} onChange={handleChange}
                      placeholder="Tell us about your brand, your goals, and what you need help with..."
                      className="px-4 py-3 bg-[#141414] border border-white/10 rounded-lg text-white placeholder-[#B0B0B0] text-sm focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] focus-visible:border-[#FF5C00] focus:border-[#FF5C00] transition-colors resize-none" />
                  </div>

                  <button type="submit"
                    className="self-start inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#FF5C00] text-white font-semibold rounded-lg hover:bg-[#e04f00] hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all text-sm sm:text-base">
                    {formButtonLabel}
                    <ArrowUpRight size={16} />
                  </button>

                  {privacyDisclaimer && (
                    <p className="text-[#666] text-xs leading-relaxed mt-1 max-w-lg">
                      {privacyDisclaimer}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
