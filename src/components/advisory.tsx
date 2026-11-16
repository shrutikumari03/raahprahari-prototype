import {
  CheckCircle2,
  CircleCheck,
  CircleQuestionMark,
  Clock,
  OctagonAlert,
  OctagonX,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import {
  getFreshnessState,
  type AdvisoryLevel,
  type FreshnessState,
} from "@/lib/advisory";
import { usePrefs } from "@/i18n/preferences";
import { cn } from "@/lib/utils";

/**
 * A flat 15% tint of --tint over a glass pill's fill. It is a gradient layer
 * only so the tint sits on top of the glass background colour instead of
 * replacing it; both stops are the same colour, so it looks flat.
 */
const TINT_15 =
  "bg-[linear-gradient(color-mix(in_srgb,var(--tint)_15%,transparent),color-mix(in_srgb,var(--tint)_15%,transparent))]";
export const LEVEL_META: Record<
  AdvisoryLevel,
  { icon: typeof CircleCheck; color: string; chip: string; bar: string }
> = {
  // Severity is carried by the label and a different icon for every level; the
  // tinted border and tint repeat it in colour, they never carry it alone.
  clear: {
    icon: CircleCheck,
    color: "var(--status-clear)",
    chip: "border-status-clear [--tint:var(--status-clear)]",
    bar: "bg-status-clear",
  },
  caution: {
    icon: TriangleAlert,
    color: "var(--status-caution)",
    chip: "border-status-caution [--tint:var(--status-caution)]",
    bar: "bg-status-caution",
  },
  avoid: {
    icon: OctagonAlert,
    color: "var(--status-avoid)",
    chip: "border-status-avoid [--tint:var(--status-avoid)]",
    bar: "bg-status-avoid",
  },
  do_not_travel: {
    icon: OctagonX,
    color: "var(--status-dnt)",
    chip: "border-status-dnt [--tint:var(--status-dnt)]",
    bar: "bg-status-dnt",
  },
  unknown: {
    icon: CircleQuestionMark,
    color: "var(--status-unknown)",
    chip: "border-status-unknown [--tint:var(--status-unknown)]",
    bar: "bg-status-unknown",
  },
};

export function AdvisoryBadge({
  level,
  size = "sm",
  className,
}: {
  level: AdvisoryLevel;
  size?: "sm" | "lg";
  className?: string;
}) {
  const { t } = usePrefs();
  const meta = LEVEL_META[level];
  const Icon = meta.icon;
  // One attention pulse on load for AVOID and official closures; never infinite.
  const attention = level === "avoid" || level === "do_not_travel";
  return (
    <span
      style={
        attention
          ? ({ "--rp-attn-color": meta.color } as React.CSSProperties)
          : undefined
      }
      className={cn(
        "rp-fade-in glass-pill inline-flex items-center gap-1.5 rounded-full border font-semibold text-foreground shadow-none",
        TINT_15,
        attention && "rp-attn",
        size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs",
        meta.chip,
        className,
      )}
    >
      <Icon
        aria-hidden
        className={size === "lg" ? "size-4" : "size-3.5"}
        style={{ color: meta.color }}
      />
      {t(`level.${level}`)}
    </span>
  );
}

export function ActionBadge({
  level,
  size = "sm",
  className,
}: {
  level: AdvisoryLevel;
  size?: "sm" | "lg";
  className?: string;
}) {
  return <AdvisoryBadge level={level} size={size} className={className} />;
}

const FRESHNESS_META: Record<
  FreshnessState,
  { icon: typeof Clock; color: string; chip: string }
> = {
  fresh: {
    icon: CheckCircle2,
    color: "var(--link)",
    chip: "border-link/50 bg-link/10",
  },
  stale: {
    icon: Clock,
    color: "var(--status-stale)",
    chip: "border-status-stale/50 bg-status-stale/10",
  },
  unknown: {
    icon: CircleQuestionMark,
    color: "var(--status-unknown)",
    chip: "border-status-unknown/50 bg-status-unknown/10",
  },
};

export function FreshnessChip({
  observationTimestamp,
  className,
}: {
  observationTimestamp?: number;
  className?: string;
}) {
  const { t, ago, now } = usePrefs();
  const state = getFreshnessState(observationTimestamp, now);
  const meta = FRESHNESS_META[state];
  const Icon = meta.icon;
  return (
    <span
      data-testid="freshness-chip"
      className={cn(
        "rp-fade-in inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium text-foreground",
        meta.chip,
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" style={{ color: meta.color }} />
      {state === "unknown"
        ? t("freshness.observationUnknown")
        : t(`freshness.${state}`)}
      {observationTimestamp && state !== "unknown"
        ? ` · ${ago(observationTimestamp)}`
        : ""}
    </span>
  );
}

export function CacheTimeLabel({ timestamp }: { timestamp: number }) {
  const { stamp, t } = usePrefs();
  return (
    <span className="text-xs text-muted-foreground" data-testid="cache-time">
      {t("advisory.calculatedLocally")}:{" "}
      <time dateTime={new Date(timestamp).toISOString()}>
        {stamp(timestamp)}
      </time>
    </span>
  );
}

export function StaleBadge({
  age,
  className,
}: {
  age?: string;
  className?: string;
}) {
  const { t } = usePrefs();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-dashed border-status-stale px-2.5 py-0.5 text-xs font-medium text-status-stale",
        className,
      )}
    >
      <Clock aria-hidden className="size-3.5" />
      {t("freshness.stale")}
      {age ? ` · ${age}` : ""}
    </span>
  );
}

export function OfficialBadge({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { t } = usePrefs();
  return (
    <span
      className={cn(
        "rp-fade-in rp-attn [--rp-attn-color:var(--status-official)] [--tint:var(--status-official)] glass-pill inline-flex items-center gap-1.5 rounded-full border border-status-official px-2.5 py-0.5 text-xs font-semibold text-foreground shadow-none",
        TINT_15,
        className,
      )}
    >
      <ShieldCheck aria-hidden className="size-3.5 text-status-official" />
      {label ?? t("level.official")}
    </span>
  );
}

export function RoadCode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
