import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouterState } from "@tanstack/react-router";
import { FeatureSearchModal } from "@/components/feature-search-modal";
import { LoginDialog } from "@/components/login-dialog";
import { cn } from "@/lib/utils";
import { activeNavTarget, sectionLabel, shellSearchHidden } from "./nav";
import { Rail } from "./rail";
import {
  ShellStatusBanner,
  StatusDetailsDialog,
  useShellStatus,
} from "./shell-status";
import { BottomTabs, DesktopTopBar, MobileTopBar } from "./top-bars";
import { useGuardedNavigate, useRailCollapsed } from "./use-shell";

/** True for Ctrl+K, or Cmd+K on a Mac keyboard. */
function isSearchShortcut(event: KeyboardEvent) {
  return (
    (event.ctrlKey || event.metaKey) &&
    !event.altKey &&
    event.key.toLowerCase() === "k"
  );
}

/**
 * The one app shell for every route: a left rail and top bar from 1024px up,
 * a top bar and bottom tabs below. Page content renders in `children`.
 */
export function AppShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { pathname, view } = useRouterState({
    select: (state) => ({
      pathname: state.location.pathname,
      view: (state.location.search as { view?: string }).view,
    }),
  });
  const active = activeNavTarget(pathname, view);
  const section = sectionLabel(pathname, active);
  const status = useShellStatus();
  const { collapsed, toggle } = useRailCollapsed();

  const [loginOpen, setLoginOpen] = useState(false);
  // Focus goes back to whichever control opened sign-in (the rail and the
  // mobile bar each have their own, and only one is visible at a time).
  const loginReturnRef = useRef<HTMLButtonElement | null>(null);
  const openLogin = useCallback(() => {
    const opener = document.activeElement;
    loginReturnRef.current =
      opener instanceof HTMLButtonElement ? opener : null;
    setLoginOpen(true);
  }, []);
  const { requestSignIn, cancelReturn } = useGuardedNavigate(openLogin);

  const [statusOpen, setStatusOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteReturnRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const hideSearch = shellSearchHidden(pathname);
  const isMap = pathname === "/map";
  const isHome = pathname === "/";
  const isGlassPage =
    isMap ||
    pathname === "/traveller" ||
    pathname === "/advisories" ||
    pathname.startsWith("/advisories/") ||
    pathname === "/reports" ||
    pathname.startsWith("/reports/") ||
    pathname === "/report" ||
    pathname.startsWith("/report/") ||
    pathname === "/check" ||
    pathname === "/help" ||
    pathname.startsWith("/help/") ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/profile" ||
    pathname === "/contributions" ||
    pathname === "/review" ||
    pathname.startsWith("/review/") ||
    pathname === "/official" ||
    pathname.startsWith("/auth/");

  const openPalette = useCallback(() => {
    if (document.activeElement instanceof HTMLElement)
      paletteReturnRef.current = document.activeElement;
    setPaletteOpen(true);
  }, []);

  // Ctrl/Cmd+K focuses the road search field. Where that field is hidden
  // (small screens, /traveller, /map) it opens the page palette instead.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!isSearchShortcut(event) || event.repeat || paletteOpen) return;
      event.preventDefault();
      const field = searchRef.current;
      if (field && field.offsetParent !== null) {
        field.focus();
        field.select();
        return;
      }
      openPalette();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, openPalette]);

  return (
    // No fill of its own: the fixed .rp-backdrop photo shows behind the shell.
    <div className="rp-shell flex min-h-svh overflow-x-clip text-shell-text">
      <Rail
        active={active}
        collapsed={collapsed}
        onToggle={toggle}
        status={status}
        onGuard={requestSignIn}
        onOpenLogin={openLogin}
        onOpenSearch={openPalette}
      />

      {/* Bottom padding equals the fixed tab bar (64px + safe area), so the
          end of any page, including the footer, is never covered. */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col pb-[calc(var(--shell-tabs-height)+env(safe-area-inset-bottom))] lg:pb-0",
          // /map fills exactly the space right of the rail: no page scroll.
          isMap && "h-svh overflow-hidden",
        )}
      >
        <MobileTopBar
          status={status}
          section={section}
          onOpenLogin={openLogin}
          onOpenSearch={openPalette}
        />
        <DesktopTopBar
          status={status}
          showSearch={!hideSearch}
          searchRef={searchRef}
        />
        <ShellStatusBanner
          status={status}
          onOpenDetails={() => setStatusOpen(true)}
        />

        <main
          id="main"
          aria-busy="true"
          className={cn(
            "min-w-0 flex-1 text-foreground",
            // Glass redesign, phase by phase: Home shows the backdrop photo;
            // pages not yet redesigned keep their solid background, so their
            // muted text never sits on the photo.
            !isHome && !isGlassPage && "bg-background",
            isMap && "dark",
            isMap && "rp-shell-map flex min-h-0 flex-col",
          )}
        >
          {children}
        </main>
        {footer}
      </div>

      <BottomTabs active={active} onGuard={requestSignIn} />

      <StatusDetailsDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        status={status}
      />
      <FeatureSearchModal
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        returnFocusRef={paletteReturnRef}
        shortcutEnabled={false}
      />
      <LoginDialog
        open={loginOpen}
        onOpenChange={(open) => {
          setLoginOpen(open);
          // Closing sign-in without a session cancels the pending return.
          if (!open) cancelReturn();
        }}
        returnFocusRef={loginReturnRef}
      />
    </div>
  );
}
