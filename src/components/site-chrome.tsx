import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { House, ListChecks, Map, Menu, Monitor, Moon, Search, Sun, TriangleAlert, UserRound, WifiOff } from 'lucide-react'
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
    <div role="group" aria-label={t('lang.label')} className="inline-flex h-11 rounded-full border border-border p-0.5 text-sm">
      {(['en', 'hi'] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          lang={l}
          className={cn(
            'min-h-11 min-w-11 rounded-full px-2.5 font-medium transition-colors',
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
  const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'
  const label =
    next === 'system'
      ? t('theme.useSystem')
      : next === 'light'
        ? t('theme.light')
        : t('theme.dark')
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="rounded-full"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={t('theme.toggle')}
    >
      {theme === 'system' ? <Monitor /> : theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}

function LoginDialog({
  open,
  onOpenChange,
  returnFocusRef,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  returnFocusRef: React.RefObject<HTMLButtonElement | null>
}) {
  const { t } = usePrefs()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onCloseAutoFocus={(event) => {
          if (returnFocusRef.current?.isConnected) {
            event.preventDefault()
            returnFocusRef.current.focus()
          }
        }}
      >
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

/**
 * The single site navigation. Same items, same order on every route.
 * Desktop (xl and up): logo, primary links, then language, theme, login, report.
 * Below xl: logo + menu button on top, plus the fixed bottom navigation.
 */
export const PRIMARY_NAV = [
  { to: '/', label: 'nav.home' },
  { to: '/traveller', label: 'nav.traveller' },
  { to: '/map', label: 'nav.map' },
  { to: '/advisories', label: 'nav.advisories' },
  { to: '/help', label: 'nav.help' },
  { to: '/about', label: 'nav.about' },
] as const

export const BOTTOM_NAV = [
  { to: '/', label: 'nav.home', icon: House, raised: false },
  { to: '/traveller', label: 'nav.traveller', icon: Search, raised: false },
  { to: '/report', label: 'nav.report', icon: TriangleAlert, raised: true },
  { to: '/map', label: 'nav.map', icon: Map, raised: false },
  { to: '/advisories', label: 'nav.advisories', icon: ListChecks, raised: false },
] as const

type NavTarget = (typeof PRIMARY_NAV)[number]['to'] | (typeof BOTTOM_NAV)[number]['to']

/** Which nav item a pathname belongs to. /check is the route explorer: map view → Live Map, list view → Advisories. */
export function activeNavTarget(pathname: string, view?: string): NavTarget | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (path === '/') return '/'
  if (path === '/traveller') return '/traveller'
  if (path === '/map' || (path === '/check' && view !== 'list')) return '/map'
  if (path === '/advisories' || path.startsWith('/advisories/') || path === '/check') return '/advisories'
  if (path === '/help' || path.startsWith('/help/')) return '/help'
  if (path === '/about') return '/about'
  if (path === '/report' || path.startsWith('/report/')) return '/report'
  return null
}

export function SiteHeader() {
  const { t } = usePrefs()
  const [loginOpen, setLoginOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const loginReturnFocusRef = useRef<HTMLButtonElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const online = useOnline()
  const { pathname, view } = useRouterState({
    select: (s) => ({
      pathname: s.location.pathname,
      view: (s.location.search as { view?: string }).view,
    }),
  })
  const active = activeNavTarget(pathname, view)
  const current = (to: NavTarget) => (active === to ? ('page' as const) : undefined)

  // Close the mobile menu whenever the route changes (e.g. browser back).
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const openLogin = (returnTo: HTMLButtonElement | null) => {
    loginReturnFocusRef.current = returnTo
    setLoginOpen(true)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="rp-container flex h-16 min-w-0 items-center gap-3">
          <Link to="/" className="shrink-0 rounded-md" aria-label={t('nav.homeLabel')}>
            <Logo />
          </Link>

          <nav aria-label={t('nav.primary')} className="hidden min-w-0 items-center xl:flex">
            {PRIMARY_NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                aria-current={current(to)}
                className={cn(
                  'relative inline-flex min-h-11 items-center px-2.5 text-sm font-medium whitespace-nowrap transition-colors 2xl:px-3.5',
                  'after:absolute after:right-2.5 after:bottom-0 after:left-2.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-orange after:transition-transform',
                  active === to ? 'text-foreground after:scale-x-100' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t(label)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden shrink-0 items-center gap-1.5 xl:flex">
            <LangSwitch />
            <ThemeSwitch />
            <Button
              variant="ghost"
              className="h-10 rounded-full whitespace-nowrap"
              onClick={(event) => openLogin(event.currentTarget)}
            >
              <UserRound />
              {t('nav.login')}
            </Button>
            <Button asChild className="h-10 rounded-full px-4 font-semibold whitespace-nowrap">
              <Link to="/report" search={{ segment: undefined }} aria-current={current('/report')}>
                <TriangleAlert />
                {t('nav.report')}
              </Link>
            </Button>
          </div>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                ref={menuTriggerRef}
                variant="ghost"
                size="icon-lg"
                className="ml-auto shrink-0 rounded-full xl:hidden"
                aria-label={t('nav.menu')}
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,90vw)] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
                <SheetDescription className="sr-only">{t('nav.primary')}</SheetDescription>
              </SheetHeader>
              <nav aria-label={t('nav.primary')} className="flex flex-col gap-1 px-4">
                {PRIMARY_NAV.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    aria-current={current(to)}
                    className={cn(
                      'inline-flex min-h-11 items-center rounded-lg px-3 text-base font-medium',
                      active === to ? 'bg-raised text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {t(label)}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 pt-4 pb-6">
                <LangSwitch />
                <ThemeSwitch />
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-full"
                  onClick={() => {
                    setMenuOpen(false)
                    openLogin(menuTriggerRef.current)
                  }}
                >
                  <UserRound />
                  {t('nav.login')}
                </Button>
                <Button asChild className="h-11 w-full rounded-full font-semibold">
                  <Link to="/report" search={{ segment: undefined }} onClick={() => setMenuOpen(false)}>
                    <TriangleAlert />
                    {t('nav.report')}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
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

      <nav
        aria-label={t('nav.bottom')}
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 px-1 pt-1 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-md xl:hidden"
      >
        {BOTTOM_NAV.map(({ to, label, icon: Icon, raised }) => (
          <Link
            key={to}
            to={to}
            aria-current={current(to)}
            className={cn(
              'flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 text-center text-[11px] leading-tight font-medium',
              raised && '-mt-4',
              active === to ? 'text-link' : 'text-muted-foreground',
            )}
          >
            <Icon
              aria-hidden
              className={cn(
                'size-5 shrink-0',
                raised &&
                  '-mt-1 size-12 rounded-full border-4 border-background bg-brand-orange p-2.5 text-[#111719] shadow-lg',
              )}
            />
            <span className="max-w-full truncate">{t(label)}</span>
          </Link>
        ))}
      </nav>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        returnFocusRef={loginReturnFocusRef}
      />
    </>
  )
}

export function SiteFooter() {
  const { t } = usePrefs()
  const items = [
    ['footer.about', '/about', undefined],
    ['footer.privacy', '/about', 'privacy'],
    ['footer.terms', '/about', 'terms'],
    ['footer.accessibility', '/about', 'accessibility'],
    ['footer.contact', '/contact', undefined],
  ] as const
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="rp-container flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">{t('footer.tagline')}</p>
          <p className="text-xs text-muted-foreground">{t('footer.note')}</p>
        </div>
        <nav aria-label={t('nav.footer')} className="flex flex-wrap gap-x-5 gap-y-1">
          {items.map(([key, to, hash]) => (
            <Link
              key={key}
              to={to}
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
