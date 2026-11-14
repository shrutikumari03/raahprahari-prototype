import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SkipLink } from "@/components/ui/feedback";
import { NotFoundPage } from "@/components/error-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { BackToTop, PageTransition, RevealObserver } from "@/components/motion";
import { BootGate, RouteProgress, bootGuardScript } from "@/components/boot-screen";
import { PrototypeRibbon } from "@/components/prototype-ribbon";
import { AccountScopeBoundary } from "@/components/account-scope-boundary";
import { AuthSessionBridge } from "@/components/auth-session-bridge";
import { SyncProvider } from "@/components/sync-provider";
import { PreferencesProvider, themeBootScript } from "@/i18n/preferences";

import "../styles.css";

if (import.meta.env.DEV && import.meta.env.VITE_DEV_RECEIPT_STUB === "true") {
  void import("@/dev/receipt-stub").catch((error: unknown) => {
    console.error("Unable to initialize the development receipt stub", error);
  });
}

const siteName = "RaahPrahari — Know before you go";
const siteDescription =
  "Check reported road hazards, information freshness, and official restrictions across Uttarakhand before your journey.";

export const Route = createRootRoute({
  head: ({ matches }) => {
    const isNotFound = matches.some(
      (match) => match.status === "notFound" || match._notFound,
    );
    const title = isNotFound ? "Page not found | RaahPrahari" : siteName;
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title,
        },
        {
          name: "description",
          content: siteDescription,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: siteDescription,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        { name: "theme-color", content: "#07151f", media: "(prefers-color-scheme: dark)" },
        { name: "theme-color", content: "#e6e4dc", media: "(prefers-color-scheme: light)" },
      ],
      links: [
        // Web app manifest only. There is no service worker, so nothing is cached for offline use.
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
        { rel: "icon", type: "image/png", href: "/favicon-32.png", sizes: "32x32" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&family=Noto+Sans+Devanagari:wght@400;600&family=Oxanium:wght@600;700&display=swap",
        },
      ],
    };
  },
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  // These routes render the shared PrototypeRibbon inside their own layout.
  const {
    isHome,
    isTraveller,
    isMap,
    isHelp,
    isNotFound,
    isAdvisories,
    isReport,
    hasInlineRibbon,
  } =
    useRouterState({
      select: (state) => ({
        isReport: state.location.pathname.startsWith("/report"),
        // /review, /review/$ref and /contributions always render the ribbon at
        // the top of their content, so the floating copy would be a duplicate.
        hasInlineRibbon:
          state.location.pathname === "/contributions" ||
          state.location.pathname === "/review" ||
          state.location.pathname.startsWith("/review/"),
        isHome: state.location.pathname === "/",
        isTraveller: state.location.pathname === "/traveller",
        isMap: state.location.pathname === "/map",
        isHelp: state.location.pathname === "/help",
        isNotFound: state.matches.some(
          (match) => match.status === "notFound" || match._notFound,
        ),
        isAdvisories:
          state.location.pathname === "/advisories" ||
          state.location.pathname === "/advisories/",
      }),
    });

  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <HeadContent />
      </head>
      <body>
        <BootGate />
        <script dangerouslySetInnerHTML={{ __html: bootGuardScript }} />
        <noscript>
          <style>{"#rp-boot{display:none!important}"}</style>
        </noscript>
        <PreferencesProvider>
          <TooltipProvider>
            <AuthSessionBridge />
            <AccountScopeBoundary>
              <SyncProvider>
                <SkipLink>Skip to content</SkipLink>
                <PageTransition />
                <RouteProgress />
                <RevealObserver />
                <BackToTop />
                {/* App shell: below xl the header is a top bar and the bottom
                    tabs need room under the content; from xl the header is a
                    fixed left rail and the content starts after it. */}
                {/* From xl the shell is exactly one viewport tall: the rail is
                    fixed and only the content column (#rp-content) scrolls, so
                    the document itself never does. Below xl the page scrolls
                    normally above the bottom tabs. */}
                <div className="rp-shell flex min-h-svh flex-col overflow-x-clip pb-[calc(var(--rp-bottom-h)+env(safe-area-inset-bottom))] xl:h-svh xl:min-h-0 xl:overflow-hidden xl:pb-0 xl:pl-(--rp-rail-w)">
                  <SiteHeader />
                  <div
                    id="rp-content"
                    data-scroll-restoration-id="rp-content"
                    className="rp-content flex min-h-0 min-w-0 flex-1 flex-col xl:relative xl:overflow-y-auto xl:overscroll-contain"
                  >
                  <main id="main" aria-busy="true" className="min-w-0 flex-1">
                    {children}
                    {/* Fixed on screen, but kept inside <main> so it sits in a landmark. */}
                    {!isHome &&
                      !isTraveller &&
                      !isMap &&
                      !isHelp &&
                      !isNotFound &&
                      !isReport &&
                      !isAdvisories &&
                      !hasInlineRibbon && (
                        <div className="rp-demo-badge-ribbon pointer-events-none fixed right-2 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-(--z-bottom-nav) xl:bottom-2">
                          <PrototypeRibbon />
                        </div>
                      )}
                  </main>
                  {!isHome && !isTraveller && !isMap && !isHelp && <SiteFooter />}
                  </div>
                </div>
              </SyncProvider>
            </AccountScopeBoundary>
          </TooltipProvider>
        </PreferencesProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}