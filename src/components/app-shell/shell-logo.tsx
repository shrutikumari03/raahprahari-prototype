import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { usePrefs } from "@/i18n/preferences";
import { cn } from "@/lib/utils";

/**
 * Logo link to "/": the existing logo files (public/img/logo-on-*.png via
 * <Logo variant="crest">, never redrawn) plus the "RaahPrahari" wordmark
 * (Oxanium 600). Without the wordmark (collapsed rail) only the mark shows;
 * the link's aria-label names it either way.
 */
export function ShellLogo({
  showWordmark = true,
  className,
  wordmarkClassName,
}: {
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
}) {
  const { t } = usePrefs();
  return (
    <Link
      to="/"
      aria-label={t("shell.homeLabel")}
      data-testid="shell-logo"
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md text-shell-text",
        className,
      )}
    >
      <Logo variant="crest" decorative />
      {showWordmark ? (
        <span
          aria-hidden
          className={cn("font-display text-lg font-semibold", wordmarkClassName)}
        >
          RaahPrahari
        </span>
      ) : null}
    </Link>
  );
}
