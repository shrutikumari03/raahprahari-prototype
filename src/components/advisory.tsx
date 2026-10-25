import {
  CircleCheck,
  CircleQuestionMark,
  Clock,
  FlaskConical,
  OctagonAlert,
  OctagonX,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import type { AdvisoryLevel } from '@/lib/advisory'
import { usePrefs } from '@/i18n/preferences'
import { cn } from '@/lib/utils'

export const LEVEL_META: Record<
  AdvisoryLevel,
  { icon: typeof CircleCheck; color: string; chip: string; bar: string }
> = {
  clear: { icon: CircleCheck, color: 'var(--status-clear)', chip: 'bg-status-clear/15 border-status-clear/60', bar: 'bg-status-clear' },
  caution: { icon: TriangleAlert, color: 'var(--status-caution)', chip: 'bg-status-caution/15 border-status-caution/70', bar: 'bg-status-caution' },
  avoid: { icon: OctagonAlert, color: 'var(--status-avoid)', chip: 'bg-status-avoid/15 border-status-avoid/70', bar: 'bg-status-avoid' },
  do_not_travel: { icon: OctagonX, color: 'var(--status-dnt)', chip: 'bg-status-dnt/15 border-status-dnt/70', bar: 'bg-status-dnt' },
  unknown: { icon: CircleQuestionMark, color: 'var(--status-unknown)', chip: 'bg-status-unknown/15 border-status-unknown/60', bar: 'bg-status-unknown' },
}

export function AdvisoryBadge({
  level,
  size = 'sm',
  className,
}: {
  level: AdvisoryLevel
  size?: 'sm' | 'lg'
  className?: string
}) {
  const { t } = usePrefs()
  const meta = LEVEL_META[level]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold text-foreground',
        size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs',
        meta.chip,
        className,
      )}
    >
      <Icon aria-hidden className={size === 'lg' ? 'size-4' : 'size-3.5'} style={{ color: meta.color }} />
      {t(`level.${level}`)}
    </span>
  )
}

export function StaleBadge({ age, className }: { age?: string; className?: string }) {
  const { t } = usePrefs()
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-dashed border-muted-foreground/70 px-2.5 py-0.5 text-xs font-medium text-muted-foreground',
        className,
      )}
    >
      <Clock aria-hidden className="size-3.5" />
      {t('level.stale')}
      {age ? ` · ${age}` : ''}
    </span>
  )
}

export function OfficialBadge({ label, className }: { label?: string; className?: string }) {
  const { t } = usePrefs()
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-status-official/70 bg-status-official/15 px-2.5 py-0.5 text-xs font-semibold text-foreground',
        className,
      )}
    >
      <ShieldCheck aria-hidden className="size-3.5 text-status-official" />
      {label ?? t('level.official')}
    </span>
  )
}

export function DemoBadge({ className }: { className?: string }) {
  const { t } = usePrefs()
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-border bg-background/70 px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide text-muted-foreground uppercase',
        className,
      )}
    >
      <FlaskConical aria-hidden className="size-3" />
      {t('demo.badge')}
    </span>
  )
}

export function RoadCode({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('font-mono text-xs font-medium tracking-tight text-muted-foreground', className)}>
      {children}
    </span>
  )
}
