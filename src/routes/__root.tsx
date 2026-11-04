import { HeadContent, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SkipLink } from '@/components/ui/feedback'
import { NotFoundPage } from '@/components/error-pages'
import { SiteFooter, SiteHeader } from '@/components/site-chrome'
import { DemoBadge } from '@/components/advisory'
import { PreferencesProvider, themeBootScript } from '@/i18n/preferences'

import '../styles.css'

const siteName = 'RaahPrahari — Know before you go'
const siteDescription =
  'Check reported road hazards, information freshness, and official restrictions across Uttarakhand before your journey.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      { name: 'theme-color', content: '#111719' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&family=Noto+Sans+Devanagari:wght@400;600&family=Oxanium:wght@600;700&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { isHome, isTraveller, isMap, isHelp } = useRouterState({
    select: (state) => ({
      isHome: state.location.pathname === '/',
      isTraveller: state.location.pathname === '/traveller',
      isMap: state.location.pathname === '/map',
      isHelp: state.location.pathname === '/help',
    }),
  })

  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <HeadContent />
      </head>
      <body>
        <PreferencesProvider>
          <TooltipProvider>
            <SkipLink>Skip to content</SkipLink>
            <div className="flex min-h-screen flex-col">
              {!isMap && <SiteHeader />}
              <main
                id="main"
                className={isHome || isTraveller || isMap ? 'flex-1' : 'flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0'}
              >
                {children}
              </main>
              {!isHome && !isTraveller && !isMap && !isHelp && <SiteFooter />}
            </div>
            {!isHome && !isTraveller && !isMap && !isHelp && (
              <div className="pointer-events-none fixed right-2 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 lg:bottom-2">
                <DemoBadge />
              </div>
            )}
          </TooltipProvider>
        </PreferencesProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
