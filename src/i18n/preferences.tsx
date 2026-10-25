import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { en, hi, type TranslationKey } from '@/i18n/dictionary'
import { DEMO_NOW, placeById } from '@/data/fixtures'
import { STORAGE_KEYS, readLocal, writeLocal } from '@/lib/storage'

export type Lang = 'en' | 'hi'
export type Theme = 'dark' | 'light'

interface Preferences {
  lang: Lang
  setLang: (l: Lang) => void
  theme: Theme
  setTheme: (t: Theme) => void
  t: (key: TranslationKey) => string
  /** Human age relative to the demo clock, e.g. "3 h ago" */
  ago: (ts: number) => string
  /** Absolute local time, e.g. "25 Oct, 14:30" */
  stamp: (ts: number) => string
  place: (id: string) => string
  duration: (minutes: number) => string
}

const PreferencesContext = createContext<Preferences | null>(null)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    setLangState(readLocal<Lang>(STORAGE_KEYS.lang, 'en'))
    setThemeState(readLocal<Theme>(STORAGE_KEYS.theme, 'dark'))
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
  }, [theme])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    writeLocal(STORAGE_KEYS.lang, l)
  }, [])
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    writeLocal(STORAGE_KEYS.theme, t)
  }, [])

  const value = useMemo<Preferences>(() => {
    const dict = lang === 'hi' ? hi : en
    const t = (key: TranslationKey) => dict[key] ?? en[key]
    return {
      lang,
      setLang,
      theme,
      setTheme,
      t,
      ago: (ts) => {
        const mins = Math.max(0, Math.round((DEMO_NOW - ts) / 60_000))
        if (mins < 5) return t('time.justNow')
        if (mins < 60) return `${mins} ${t('time.minAgo')}`
        const h = Math.round(mins / 60)
        if (h < 48) return `${h} ${t('time.hAgo')}`
        return `${Math.round(h / 24)} ${t('time.dAgo')}`
      },
      stamp: (ts) =>
        new Date(ts).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata',
        }),
      place: (id) => {
        const p = placeById(id)
        return p ? (lang === 'hi' ? p.nameHi : p.name) : id
      },
      duration: (minutes) => {
        const h = Math.floor(minutes / 60)
        const m = minutes % 60
        return h ? `${h} ${t('common.hr')} ${m ? `${m} ${t('common.min')}` : ''}`.trim() : `${m} ${t('common.min')}`
      },
    }
  }, [lang, theme, setLang, setTheme])

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePrefs() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePrefs must be used inside PreferencesProvider')
  return ctx
}

/** Inline script that applies the saved theme before first paint. */
export const themeBootScript = `try{var t=localStorage.getItem('${STORAGE_KEYS.theme}');if(t&&JSON.parse(t)==='light'){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light'}}catch(e){}`
