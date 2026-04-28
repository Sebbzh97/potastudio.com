'use client'

import { useState } from 'react'

type Phase = 'idle' | 'seeding' | 'done' | 'error'
type SeedTarget = 'pages' | 'blog'

interface VerifyResult {
  id: string
  type: string
  status: 'ok' | 'missing' | 'empty_fields'
  emptyFields?: string[]
}

interface SeedResponse {
  success?: boolean
  seeded?: number | Record<string, string>
  failed?: number
  deleted?: number
  documents?: string[]
  results?: Record<string, string>
  error?: string
  errors?: Record<string, string>
  verify?: { authors: number; categories: number; posts: number }
  verification?: {
    passed: boolean
    results: VerifyResult[]
    summary: { ok: number; missing: number; empty_fields: number }
  }
}

export default function AdminSeedPage() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<SeedResponse | null>(null)
  const [verify, setVerify] = useState(false)
  const [purge, setPurge] = useState(true)
  const [target, setTarget] = useState<SeedTarget>('pages')

  async function runSeed() {
    setPhase('seeding')
    setResult(null)
    try {
      const endpoint = target === 'blog' ? '/api/seed-blog' : '/api/seed-copy'
      const params = new URLSearchParams({ secret: 'pota-seed-2026' })
      if (verify) params.set('verify', '1')
      if (purge)  params.set('purge',  '1')
      const res = await fetch(`${endpoint}?${params.toString()}`)
      const data: SeedResponse = await res.json()
      setResult(data)
      const ok = !data.error && (data.success || typeof data.seeded !== 'undefined')
      setPhase(ok ? 'done' : 'error')
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : 'Network error' })
      setPhase('error')
    }
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#FF5C00] uppercase tracking-[0.3em] mb-2">
            Pota Studio CMS
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Seed Sanity
          </h1>
          <p className="mt-3 text-[#B0B0B0] text-sm leading-relaxed">
            Scrive o aggiorna i documenti Sanity via <code className="text-[#FF5C00]">createOrReplace</code>.
          </p>
        </div>

        {/* Seed target selector */}
        <div className="mb-5 flex gap-2">
          {(['pages', 'blog'] as SeedTarget[]).map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                target === t
                  ? 'bg-[#FF5C00] border-[#FF5C00] text-white'
                  : 'border-white/20 text-[#B0B0B0] hover:border-white/40 hover:text-white'
              }`}
            >
              {t === 'pages' ? 'Page Content' : 'Blog Posts'}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#B0B0B0] mb-6">
          {target === 'pages'
            ? 'Scrive pageContent, siteSettings, caseStudy, ecc. — tutti i documenti di pagina.'
            : 'Scrive 1 autore + 4 categorie + 12 blogPost (6 EN + 6 IT).'}
        </p>

        {/* Options */}
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={purge}
            onClick={() => setPurge((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              purge ? 'bg-[#FF5C00]' : 'bg-white/20'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                purge ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-[#B0B0B0]">
            Purge: cancella tutti i doc esistenti prima del seed (consigliato)
          </span>
        </div>
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={verify}
            onClick={() => setVerify((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              verify ? 'bg-[#FF5C00]' : 'bg-white/20'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                verify ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-[#B0B0B0]">
            Verifica dopo il seed
          </span>
        </div>

        {/* Action button */}
        <button
          onClick={runSeed}
          disabled={phase === 'seeding'}
          className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: phase === 'seeding' ? '#333' : '#FF5C00',
            color: 'white',
            fontFamily: 'var(--font-space-grotesk)',
          }}
        >
          {phase === 'seeding' ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Seeding in corso...
            </span>
          ) : (
            'Esegui Seed'
          )}
        </button>

        {/* Result */}
        {result && (
          <div
            className={`mt-6 rounded-xl border p-5 text-sm ${
              result.success
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-red-500/30 bg-red-500/5'
            }`}
          >
            {/* Status line */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${result.success ? 'bg-green-400' : 'bg-red-400'}`}
              />
              <span className={`font-semibold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                {result.success ? 'Completato' : 'Errore'}
              </span>
            </div>

            {result.error && (
              <p className="text-red-300 mb-3 font-mono text-xs">{result.error}</p>
            )}

            {typeof result.seeded === 'number' && (
              <p className="text-white mb-3">
                Documenti scritti:{' '}
                <span className="font-bold text-[#FF5C00]">{result.seeded}</span>
                {typeof result.failed === 'number' && result.failed > 0 && (
                  <span className="ml-2 text-red-400">({result.failed} falliti)</span>
                )}
              </p>
            )}

            {result.verify && (
              <div className="mt-3 text-xs text-[#B0B0B0] space-y-1">
                <p>Autori: <span className="text-white font-bold">{result.verify.authors}</span></p>
                <p>Categorie: <span className="text-white font-bold">{result.verify.categories}</span></p>
                <p>Blog post: <span className="text-white font-bold">{result.verify.posts}</span></p>
              </div>
            )}

            {typeof result.deleted === 'number' && result.deleted > 0 && (
              <p className="text-white/80 mb-3 text-xs">
                Documenti rimossi (orphan): <span className="font-bold">{result.deleted}</span>
              </p>
            )}

            {/* Verification summary */}
            {result.verification && (
              <div className="mt-3">
                <div className="flex items-center gap-4 mb-3 text-xs">
                  <span className="text-green-400 font-semibold">
                    OK: {result.verification.summary.ok}
                  </span>
                  {result.verification.summary.missing > 0 && (
                    <span className="text-red-400 font-semibold">
                      Missing: {result.verification.summary.missing}
                    </span>
                  )}
                  {result.verification.summary.empty_fields > 0 && (
                    <span className="text-yellow-400 font-semibold">
                      Empty fields: {result.verification.summary.empty_fields}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto pr-1">
                  {result.verification.results.map((r) => (
                    <div key={r.id} className="flex items-center justify-between py-0.5">
                      <span className="font-mono text-xs text-[#B0B0B0] truncate">{r.id}</span>
                      <span
                        className={`text-xs font-bold ml-2 flex-shrink-0 ${
                          r.status === 'ok'
                            ? 'text-green-400'
                            : r.status === 'missing'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                        }`}
                      >
                        {r.status === 'ok' ? 'OK' : r.status === 'missing' ? 'MISSING' : 'EMPTY'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer note */}
        <p className="mt-8 text-xs text-white/20 text-center">
          /admin/seed — solo per uso interno
        </p>
      </div>
    </main>
  )
}
