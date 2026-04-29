export function getHreflang(englishPath: string) {
  const base = 'https://www.potastudio.com'
  // Strip any leading /it prefix in case caller passes the wrong path
  const cleanPath = englishPath.replace(/^\/it/, '') || '/'
  return {
    alternates: {
      canonical: `${base}${cleanPath}`,
      languages: {
        en: `${base}${cleanPath}`,
        it: `${base}/it${cleanPath === '/' ? '' : cleanPath}`,
        'x-default': `${base}${cleanPath}`,
      },
    },
  }
}
