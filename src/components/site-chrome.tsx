import { useRef, useState, useSyncExternalStore } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  Award,
  ChevronDown,
  Ellipsis,
  FileText,
  House,
  Info,
  LifeBuoy,
  ListChecks,
  Mail,
  Map,
  Menu,
  Monitor,
  Moon,
  Search,
  Sun,
  TriangleAlert,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { crossFadeTheme, useScrolled } from '@/components/motion'
import { SyncStatusIndicator } from '@/components/offline-banner'
import { Button } from '@/components/ui/button'
import { FeatureSearchModal } from '@/components/feature-search-modal'
import { LoginDialog } from '@/components/login-dialog'
import type { TranslationKey } from '@/i18n/dictionary'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Logo } from '@/components/logo'
import { usePrefs } from '@/i18n/preferences'
import { useAccountSession } from '@/lib/account-session'
import { cn } from '@/lib/utils'

function LanguageSwitch() {
  const { lang, setLang, t } = usePrefs()
  return (
    <div
      role="group"
      aria-label={t('lang.label')}
      className="rp-lang inline-flex h-11 shrink-0 items-center gap-0.5 rounded-full bg-muted/60 text-sm whitespace-nowrap"
    >
      {(['en', 'hi'] as const).map((language) => (
        <button
          key={language}
          type="button"
          aria-pressed={lang === language}
          onClick={() => setLang(language)}
          lang={language}
          className={cn(
            // Full 44px targets; the track behind them shows the group.
            'rp-press rp-lang-btn inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-medium whitespace-nowrap',
            lang === language
              ? 'bg-raised text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {language === 'en' ? 'EN' : 'हिन्दी'}
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
      onClick={() => {
        crossFadeTheme()
        setTheme(next)
      }}
      aria-label={label}
      title={t('theme.toggle')}
    >
      <span key={theme} className="rp-icon-swap grid place-items-center">
        {theme === 'system' ? <Monitor /> : theme === 'dark' ? <Sun /> : <Moon />}
      </span>
    </Button>
  )
}

// Navigation availability (VA-16). Items are hidden, not faked, until they work:
// - Community Login: opens the real Supabase sign-in form (login-dialog.tsx).
//   The header shows "Account" only once Supabase returns a session.
// - Official (/official): the publishing service it posts to does not exist
//   (see /status). The route stays reachable directly for development.
// - My Reports (/reports): it needs a signed-in account, so it is listed only
//   while a session exists.

const noSubscription = () => () => {}
const isApplePlatform = () => {
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform
  return /mac|iphone|ipad/i.test(platform)
}

/**
 * "⌘K" on Apple keyboards, "Ctrl K" elsewhere. The server snapshot is "Ctrl K",
 * so the server HTML and the first client render match (no hydration error).
 */
function useShortcutLabel() {
  const mac = useSyncExternalStore(noSubscription, isApplePlatform, () => false)
  return mac ? '⌘K' : 'Ctrl K'
}

/** Opens the feature search. The shortcut badge is decorative; aria-keyshortcuts names it. */
function SearchButton({
  onOpen,
  compact = false,
}: {
  onOpen: (button: HTMLButtonElement) => void
  compact?: boolean
}) {
  const { t } = usePrefs()
  const shortcut = useShortcutLabel()
  const shared = {
    type: 'button' as const,
    variant: 'ghost' as const,
    'aria-keyshortcuts': 'Control+K Meta+K',
    title: t('palette.shortcut').replace('{keys}', shortcut),
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => onOpen(event.currentTarget),
  }
  // An icon-only button must carry its name in aria-label (Button enforces it).
  if (compact)
    return (
      <Button {...shared} size="icon-lg" aria-label={t('palette.open')}>
        <Search aria-hidden />
      </Button>
    )
  return (
    <Button
      {...shared}
      className="gap-2 px-3 text-muted-foreground hover:text-foreground xl:w-full xl:justify-start xl:border xl:border-border xl:bg-card"
    >
      <Search aria-hidden />
      {/* In the rail there is room to name it; elsewhere the name is for screen
          readers. The shortcut stays in the tooltip and aria-keyshortcuts. */}
      <span className="sr-only xl:not-sr-only xl:truncate xl:whitespace-nowrap">
        {t('palette.open')}
      </span>
    </Button>
  )
}


export const PRIMARY_NAV = [
  { to: '/', label: 'nav.home', icon: House },
  { to: '/traveller', label: 'nav.traveller', icon: Search },
  { to: '/map', label: 'nav.map', icon: Map },
  { to: '/advisories', label: 'nav.advisories', icon: ListChecks },
  { to: '/help', label: 'nav.help', icon: LifeBuoy },
] as const

export const SECONDARY_NAV = [
  { to: '/contributions', label: 'nav.contributions', icon: Award },
  { to: '/about', label: 'nav.about', icon: Info },
  { to: '/contact', label: 'nav.contact', icon: Mail },
  { to: '/reports', label: 'nav.myReports', icon: FileText },
] as const

export const BOTTOM_NAV = [
  { to: '/', label: 'nav.home', icon: House, raised: false },
  { to: '/traveller', label: 'nav.traveller', icon: Search, raised: false },
  { to: '/report', label: 'nav.report', icon: TriangleAlert, raised: true },
  { to: '/map', label: 'nav.map', icon: Map, raised: false },
  { to: '/advisories', label: 'nav.advisories', icon: ListChecks, raised: false },
] as const

type NavTarget =
  | (typeof PRIMARY_NAV)[number]['to']
  | (typeof SECONDARY_NAV)[number]['to']
  | (typeof BOTTOM_NAV)[number]['to']

export function activeNavTarget(pathname: string, view?: string): NavTarget | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (path === '/') return '/'
  if (path === '/traveller') return '/traveller'
  if (path === '/map' || (path === '/check' && view !== 'list')) return '/map'
  if (path === '/advisories' || path.startsWith('/advisories/') || path === '/check') {
    return '/advisories'
  }
  if (path === '/help' || path.startsWith('/help/')) return '/help'
  if (path === '/about') return '/about'
  if (path === '/contact') return '/contact'
  if (path === '/contributions') return '/contributions'
  if (path === '/reports' || path.startsWith('/reports/')) return '/reports'
  if (path === '/report' || path.startsWith('/report/')) return '/report'
  return null
}

/** The mobile top bar names the section you are in; pages keep their own h1. */
function sectionLabel(pathname: string, active: NavTarget | null): TranslationKey | null {
  const item = [...PRIMARY_NAV, ...SECONDARY_NAV, ...BOTTOM_NAV].find(({ to }) => to === active)
  if (item) return item.label
  if (pathname.startsWith('/status')) return 'footer.status'
  if (pathname.startsWith('/review')) return 'review.title'
  if (pathname.startsWith('/official')) return 'official.title'
  if (pathname.startsWith('/profile')) return 'nav.account'
  return null
}

/** Secondary links available now. My Reports appears only with a session. */
function useSecondaryNav() {
  const signedIn = useAccountSession().status === 'authenticated'
  return SECONDARY_NAV.filter(({ to }) => to !== '/reports' || signedIn)
}

/** One rail link: icon and label, with the current page marked in orange. */
function RailLink({
  to,
  label,
  icon: Icon,
  current,
}: {
  to: NavTarget
  label: string
  icon: LucideIcon
  current: 'page' | undefined
}) {
  return (
    <li>
      <Link
        to={to}
        aria-current={current}
        className="rp-rail-link rp-press flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium whitespace-nowrap"
      >
        <Icon aria-hidden className="size-[1.15rem] shrink-0" />
        <span className="truncate">{label}</span>
      </Link>
    </li>
  )
}

/**
 * The "More" group: a toggle that shows or hides the secondary links. It opens
 * by itself when you arrive on one of its pages, and you can still close it.
 * The collapsed list stays in the DOM (for the height transition) but is inert,
 * so it is skipped by keyboard and screen readers.
 */
function MoreGroup({
  id,
  inSecondary,
  size = 'rail',
  children,
}: {
  id: string
  inSecondary: boolean
  size?: 'rail' | 'sheet'
  children: React.ReactNode
}) {
  const { t } = usePrefs()
  const [open, setOpen] = useState(inSecondary)
  // Open again when navigation lands on a "More" page (state derived from props,
  // updated during render as React recommends, not in an effect).
  const [wasInSecondary, setWasInSecondary] = useState(inSecondary)
  if (wasInSecondary !== inSecondary) {
    setWasInSecondary(inSecondary)
    if (inSecondary) setOpen(true)
  }
  return (
    <div className="rp-more" data-state={open ? 'open' : 'closed'}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'rp-rail-link rp-press flex w-full items-center gap-3 rounded-lg px-3 font-medium',
          size === 'rail' ? 'min-h-10 text-sm' : 'min-h-11 text-base',
        )}
      >
        <Ellipsis aria-hidden className={size === 'rail' ? 'size-[1.15rem] shrink-0' : 'size-5 shrink-0'} />
        <span id={id} className="flex-1 text-left">
          {t('nav.more')}
        </span>
        <ChevronDown aria-hidden className="rp-more-chevron size-4 shrink-0" />
      </button>
      <div id={`${id}-panel`} className="rp-more-panel" inert={!open}>
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

/**
 * The app shell's chrome. One <header> serves both layouts: below xl it is a
 * top bar (brand, section, search, sync status, menu) above fixed bottom tabs;
 * from xl the same element becomes the left navigation rail. Keeping one
 * element keeps a single banner landmark and the same keyboard order.
 */
export function SiteHeader() {
  const { t } = usePrefs()
  const secondaryNav = useSecondaryNav()
  const [loginOpen, setLoginOpen] = useState(false)
  // Show "Account" only when the provider has returned a real session.
  const accountLabel =
    useAccountSession().status === 'authenticated' ? t('nav.account') : t('nav.login')
  const loginReturnFocusRef = useRef<HTMLButtonElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const scrolled = useScrolled()
  const { pathname, view } = useRouterState({
    select: (state) => ({
      pathname: state.location.pathname,
      view: (state.location.search as { view?: string }).view,
    }),
  })
  const active = activeNavTarget(pathname, view)
  const current = (to: NavTarget) => (active === to ? ('page' as const) : undefined)
  const section = sectionLabel(pathname, active)
  const inSecondary = secondaryNav.some(({ to }) => to === active)

  const openLogin = (returnTo: HTMLButtonElement | null) => {
    loginReturnFocusRef.current = returnTo
    setLoginOpen(true)
  }

  const [searchOpen, setSearchOpen] = useState(false)
  const searchReturnFocusRef = useRef<HTMLButtonElement | null>(null)
  const openSearch = (button: HTMLButtonElement) => {
    searchReturnFocusRef.current = button
    setSearchOpen(true)
  }

  return (
    <>
      <header
        data-scrolled={scrolled}
        className="rp-header sticky top-0 z-(--z-header) border-b border-border/70 bg-background xl:fixed xl:inset-y-0 xl:left-0 xl:w-(--rp-rail-w) xl:border-r xl:border-b-0"
      >
        {/* Sized to fit 768px-tall screens with More open. The rail only
            scrolls on very short windows (rp-rail-body), never at 768 or 1080. */}
        <div className="rp-container rp-rail-body flex h-16 min-w-0 items-center gap-3 xl:h-full xl:flex-col xl:items-stretch xl:gap-2 xl:py-3">
          <Logo className="min-w-11 xl:self-start xl:px-2" heightClassName="h-10 xl:h-12" />

          <p className="rp-shell-section m-0 min-w-0 flex-1 truncate font-display text-base font-semibold text-foreground xl:hidden">
            {section ? (
              <>
                <span className="sr-only">{t('nav.section')}: </span>
                {t(section)}
              </>
            ) : null}
          </p>

          <nav
            aria-label={t('nav.primary')}
            className="rp-rail-nav hidden min-h-0 min-w-0 flex-col gap-0.5 xl:flex"
          >
            <ul className="m-0 grid list-none gap-0.5 p-0">
              {PRIMARY_NAV.map(({ to, label, icon }) => (
                <RailLink key={to} to={to} label={t(label)} icon={icon} current={current(to)} />
              ))}
            </ul>
            <MoreGroup id="rp-rail-more" inSecondary={inSecondary}>
              <ul aria-labelledby="rp-rail-more" className="m-0 grid list-none gap-0.5 p-0 pt-0.5">
                {secondaryNav.map(({ to, label, icon }) => (
                  <RailLink key={to} to={to} label={t(label)} icon={icon} current={current(to)} />
                ))}
              </ul>
            </MoreGroup>
          </nav>

          {/* Status and utilities sit at the foot of the rail. Report Hazard is
              not repeated here: pages and the mobile tabs carry it. */}
          <SyncStatusIndicator className="shrink-0 xl:mt-auto" />

          <div className="rp-rail-tools ml-auto hidden min-w-0 shrink-0 items-center gap-2 xl:ml-0 xl:flex xl:flex-wrap">
            <SearchButton onOpen={openSearch} />
            <LanguageSwitch />
            <ThemeSwitch />
            <Button
              variant="ghost"
              className="ml-2 whitespace-nowrap xl:ml-0 xl:w-full xl:justify-start"
              onClick={(event) => openLogin(event.currentTarget)}
            >
              <UserRound aria-hidden />
              {accountLabel}
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-1 xl:hidden">
            <SearchButton onOpen={openSearch} compact />
            {/* Report Hazard lives in the raised bottom tab below xl, so the
                top bar does not repeat it. */}
            <Sheet key={pathname}>
              <SheetTrigger asChild>
                <Button
                  ref={menuTriggerRef}
                  variant="ghost"
                  size="icon-lg"
                  className="xl:hidden"
                  aria-label={t('nav.menu')}
                >
                  <Menu aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="max-h-dvh w-[min(22rem,90vw)] overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]"
              >
                <SheetHeader className="gap-0 py-3 pr-16 pl-4">
                  <SheetTitle>
                    <Logo className="min-w-11" heightClassName="h-10" />
                  </SheetTitle>
                  <SheetDescription className="sr-only">{t('nav.primary')}</SheetDescription>
                </SheetHeader>
                <nav aria-label={t('nav.primary')} className="rp-chrome-nav flex flex-col gap-1 px-4">
                  {PRIMARY_NAV.map(({ to, label, icon: Icon }) => (
                    <SheetClose key={to} asChild>
                      <Link
                        to={to}
                        aria-current={current(to)}
                        className="rp-rail-link rp-press inline-flex min-h-11 items-center gap-3 rounded-lg px-3 text-base font-medium"
                      >
                        <Icon aria-hidden className="size-5 shrink-0" />
                        {t(label)}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <nav
                  aria-label={t('nav.more')}
                  className="rp-chrome-nav mt-2 border-t border-border px-4 pt-3"
                >
                  <MoreGroup id="rp-sheet-more" inSecondary={inSecondary} size="sheet">
                    <div className="flex flex-col gap-1 pt-1">
                      {secondaryNav.map(({ to, label, icon: Icon }) => (
                        <SheetClose key={to} asChild>
                          <Link
                            to={to}
                            aria-current={current(to)}
                            className="rp-rail-link rp-press inline-flex min-h-11 items-center gap-3 rounded-lg px-3 text-base font-medium"
                          >
                            <Icon aria-hidden className="size-5 shrink-0" />
                            {t(label)}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </MoreGroup>
                </nav>
                <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 pt-4 pb-6">
                  <LanguageSwitch />
                  <ThemeSwitch />
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="mt-2 w-full"
                      onClick={() => openLogin(menuTriggerRef.current)}
                    >
                      <UserRound aria-hidden />
                      {accountLabel}
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild variant="report" className="w-full font-semibold">
                      <Link
                        to="/report"
                        search={{ segment: undefined }}
                        aria-current={current('/report')}
                      >
                        <TriangleAlert aria-hidden />
                        {t('nav.report')}
                      </Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <p className="rp-rail-tagline m-0 hidden border-t border-border pt-3 text-xs text-muted-foreground xl:block">
            {t('footer.tagline')}
          </p>
        </div>
      </header>

      <nav
        aria-label={t('nav.bottom')}
        className="rp-bottom-nav fixed inset-x-0 bottom-0 z-(--z-bottom-nav) border-t border-border bg-background pb-[env(safe-area-inset-bottom)] xl:hidden"
      >
        <ul className="mx-auto flex max-w-xl items-stretch justify-around px-2">
          {BOTTOM_NAV.map(({ to, label, icon: Icon, raised }) => {
            const isActive = active === to
            // Icons start at the same top line, so a label that wraps to two
            // lines never pushes its icon out of the row.
            const itemClass = cn(
              'rp-press relative flex min-h-16 flex-col items-center justify-start gap-1 px-1 pt-2 pb-1.5 text-center text-xs leading-tight font-medium',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )
            // Orange marks where you are; it is the one accent in the chrome.
            const marker = isActive ? (
              <span
                aria-hidden
                data-testid="bottom-nav-marker"
                className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-orange-on-light dark:bg-brand-orange"
              />
            ) : null
            const icon = (
              <span
                aria-hidden
                className={cn(
                  'flex h-7 w-12 items-center justify-center rounded-full',
                  isActive && 'bg-brand-orange/15',
                )}
              >
                <Icon
                  className={cn('size-5', (raised || isActive) && 'text-brand-orange')}
                />
              </span>
            )
            return (
              <li key={to} className="flex flex-1">
                {to === '/report' ? (
                  <Link
                    to="/report"
                    search={{ segment: undefined }}
                    aria-current={current(to)}
                    className={cn(itemClass, 'w-full')}
                  >
                    {marker}
                    {icon}
                    {t(label)}
                  </Link>
                ) : (
                  <Link to={to} aria-current={current(to)} className={cn(itemClass, 'w-full')}>
                    {marker}
                    {icon}
                    {t(label)}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* One instance: it also owns the Ctrl+K / Cmd+K shortcut for the page. */}
      <FeatureSearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        returnFocusRef={searchReturnFocusRef}
      />

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        returnFocusRef={loginReturnFocusRef}
      />
    </>
  )
}

const FOOTER_LINKS = [
  ['footer.about', '/about', undefined],
  ['footer.privacy', '/about', 'privacy'],
  ['footer.terms', '/about', 'terms'],
  ['footer.accessibility', '/about', 'accessibility'],
  ['footer.contact', '/contact', undefined],
  ['nav.myReports', '/reports', undefined],
  ['footer.contributions', '/contributions', undefined],
  ['footer.status', '/status', undefined],
] as const

export function SiteFooter() {
  const { t } = usePrefs()
  const signedIn = useAccountSession().status === 'authenticated'
  const items = FOOTER_LINKS.filter(([, to]) => to !== '/reports' || signedIn)
  return (
    <footer data-reveal className="border-t border-border bg-card/40">
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
