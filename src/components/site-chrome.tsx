import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, TriangleAlert, UserRound, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { usePrefs } from '@/i18n/preferences'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 32 32" aria-hidden className="size-8 shrink-0">
        <rect width="32" height="32" rx="8" fill="#111719" />
        <path d="M4 23 L12 11 L16 16 L20 9 L28 23 Z" fill="#30363A" />
        <path d="M20 9 L23 13.5 L21 13 L19.5 14.5 L18 12 Z" fill="#E6E4DC" />
        <path d="M10 28 C13 23 19 22 16 17 C14.5 14.5 18 12.5 20 12" fill="none" stroke="#EB5B38" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight">
        Raah<span className="text-brand-orange">Prahari</span>
      </span>
    </span>
  )
}

export function useOnline() {
  const [online, setOnline] = useState(true)
  useEffect(() => {
    setOnline(navigator.onLine)
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

function LangSwitch() {
  const { lang, setLang, t } = usePrefs()
  return (
    <div role="group" aria-label={t('lang.label')} className="inline-flex h-10 rounded-full border border-border p-0.5 text-sm">
      {(['en', 'hi'] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          lang={l}
          className={cn(
            'min-w-11 rounded-full px-2.5 font-medium transition-colors',
            lang === l ? 'bg-raised text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {l === 'en' ? 'EN' : 'हिन्दी'}
        </button>
      ))}
    </div>
  )
}

function ThemeSwitch() {
  const { theme, setTheme, t } = usePrefs()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="rounded-full"
      onClick={() => setTheme(next)}
      aria-label={t(next === 'light' ? 'theme.light' : 'theme.dark')}
      title={t('theme.toggle')}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}

function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = usePrefs()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">{t('login.title')}</DialogTitle>
          <DialogDescription>{t('login.body')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>{t('login.close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function SiteHeader() {
  const { t } = usePrefs()
  const [loginOpen, setLoginOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const online = useOnline()
  const { pathname, view } = useRouterState({
    select: (s) => ({
      pathname: s.location.pathname,
      view: (s.location.search as { view?: string }).view,
    }),
  })

  const linkClass = (active: boolean) =>
    cn(
      'inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-medium transition-colors',
      active ? 'bg-raised text-foreground' : 'text-muted-foreground hover:text-foreground',
    )
  const current = (active: boolean) => (active ? ('page' as const) : undefined)
  const isMap = pathname === '/check' && view !== 'list'
  const isList = pathname === '/check' && view === 'list'

  const navLinks = (onClick?: () => void) => (
    <>
      <Link to="/" onClick={onClick} aria-current={current(pathname === '/')} className={linkClass(pathname === '/')}>
        {t('nav.home')}
      </Link>
      <Link to="/check" search={{ view: 'map' }} onClick={onClick} aria-current={current(isMap)} className={linkClass(isMap)}>
        {t('nav.map')}
      </Link>
      <Link to="/check" search={{ view: 'list' }} onClick={onClick} aria-current={current(isList)} className={linkClass(isList)}>
        {t('nav.advisories')}
      </Link>
      <Link to="/about" onClick={onClick} aria-current={current(pathname === '/about')} className={linkClass(pathname === '/about')}>
        {t('nav.about')}
      </Link>
    </>
  )

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="rp-container flex h-16 items-center gap-3">
          <Link to="/" className="mr-2 rounded-md" aria-label="RaahPrahari — home">
            <Logo />
          </Link>
          <nav aria-label={t('nav.primary')} className="hidden items-center gap-0.5 lg:flex">
            {navLinks()}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="hidden items-center gap-1.5 md:flex">
              <LangSwitch />
              <ThemeSwitch />
              <Button variant="ghost" className="h-10 rounded-full" onClick={() => setLoginOpen(true)}>
                <UserRound />
                {t('nav.login')}
              </Button>
            </div>
            <Button asChild className="h-10 rounded-full px-4 font-semibold">
              <Link to="/report">
                <TriangleAlert />
                <span className="hidden sm:inline">{t('nav.report')}</span>
                <span className="sm:hidden">{t('hero.report')}</span>
              </Link>
            </Button>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-lg" className="rounded-full lg:hidden" aria-label={t('nav.menu')}>
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(20rem,90vw)]">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                  <SheetDescription className="sr-only">{t('nav.primary')}</SheetDescription>
                </SheetHeader>
                <nav aria-label={t('nav.primary')} className="flex flex-col gap-1 px-4">
                  {navLinks(() => setMenuOpen(false))}
                </nav>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border px-4 pt-4">
                  <LangSwitch />
                  <ThemeSwitch />
                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-full"
                    onClick={() => {
                      setMenuOpen(false)
                      setLoginOpen(true)
                    }}
                  >
                    <UserRound />
                    {t('nav.login')}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {!online && (
          <div role="status" className="border-t border-border bg-raised">
            <p className="rp-container flex items-center gap-2 py-2 text-sm">
              <WifiOff aria-hidden className="size-4 text-muted-foreground" />
              {t('offline.banner')}
            </p>
          </div>
        )}
      </header>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  )
}

export function SiteFooter() {
  const { t } = usePrefs()
  const items = [
    ['footer.about', 'about'],
    ['footer.privacy', 'privacy'],
    ['footer.terms', 'terms'],
    ['footer.accessibility', 'accessibility'],
    ['footer.contact', 'contact'],
  ] as const
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="rp-container flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Know before you go. · <span lang="hi">सफ़र से पहले सुरक्षा की ख़बर</span>
          </p>
          <p className="text-xs text-muted-foreground">{t('footer.note')}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-1">
          {items.map(([key, hash]) => (
            <Link
              key={key}
              to="/about"
              hash={hash}
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground"
            >
              {t(key)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
