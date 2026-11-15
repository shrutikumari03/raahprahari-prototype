import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { usePrefs } from "@/i18n/preferences";
import { useAccountSession } from "@/lib/account-session";

const FOOTER_LINKS = [
  ["footer.about", "/about", undefined],
  ["footer.privacy", "/about", "privacy"],
  ["footer.terms", "/about", "terms"],
  ["footer.accessibility", "/about", "accessibility"],
  ["footer.contact", "/contact", undefined],
  ["nav.myReports", "/reports", undefined],
  ["footer.contributions", "/contributions", undefined],
  ["footer.status", "/status", undefined],
] as const;

/** Page footer (unchanged content; it moved out of the old site chrome). */
export function SiteFooter() {
  const { t } = usePrefs();
  const signedIn = useAccountSession().status === "authenticated";
  const items = FOOTER_LINKS.filter(([, to]) => to !== "/reports" || signedIn);
  return (
    <footer data-reveal className="border-t border-border bg-card/40">
      <div className="rp-container flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
          <p className="text-xs text-muted-foreground">{t("footer.note")}</p>
        </div>
        <nav
          aria-label={t("nav.footer")}
          className="flex flex-wrap gap-x-5 gap-y-1"
        >
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
  );
}
