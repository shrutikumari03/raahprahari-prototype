import { Link } from "@tanstack/react-router";
import { usePrefs } from "@/i18n/preferences";
import { cn } from "@/lib/utils";

/** Mountain-and-road mark. Uses currentColor so it follows the theme. */
export function ShellMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn("size-8 shrink-0", className)}
    >
      {/* Two peaks */}
      <path
        d="M2 26 L11 10 L16 18 L20 12 L30 26 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Road winding up the valley */}
      <path
        d="M14 30 C14 26 19 25 18 21 C17.5 19 16 18.5 16 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Logo link to "/": mark plus the "RaahPrahari" wordmark (Oxanium 600). */
export function ShellLogo({ showWordmark = true }: { showWordmark?: boolean }) {
  const { t } = usePrefs();
  return (
    <Link
      to="/"
      aria-label={t("shell.homeLabel")}
      className="inline-flex min-h-11 min-w-11 items-center gap-2 rounded-md text-shell-text"
    >
      <ShellMark />
      {showWordmark ? (
        <span aria-hidden className="font-display text-lg font-semibold">
          RaahPrahari
        </span>
      ) : null}
    </Link>
  );
}
