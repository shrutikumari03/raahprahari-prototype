import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { ActionBadge, FreshnessChip, OfficialBadge, RoadCode } from '@/components/advisory'
import { usePrefs } from '@/i18n/preferences'
import { getAdvisorySourceTimestamp } from '@/lib/advisory'
import type { Segment } from '@/lib/types'
import { advisoryFor } from '@/lib/data'
import { cn } from '@/lib/utils'

export function AdvisoryCard({
  segment,
  className,
}: {
  segment: Segment
  className?: string
}) {
  const { t, place } = usePrefs()
  const advisory = advisoryFor(segment.id)
  if (!advisory) {
    throw new Error(`Missing advisory for segment "${segment.id}"`)
  }
  const report = advisory.evidence[0]
  const sources = [
    ...(advisory.evidence.length > 0 ? [t('source.community')] : []),
    ...(advisory.restriction ? [t('source.official')] : []),
  ]

  return (
    <article className={cn('rounded-xl border border-border bg-card transition-colors hover:border-blue-on-dark/60', className)}>
      <Link
        to="/advisories/$segmentId"
        params={{ segmentId: segment.id }}
        className="block rounded-[inherit] p-4 focus-visible:outline-offset-[-3px]"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <RoadCode>{segment.code} · km {segment.kmStart}–{segment.kmEnd}</RoadCode>
            <h2 className="mt-1 font-semibold">
              {place(segment.from)} – {place(segment.to)}
            </h2>
          </div>
          <ActionBadge level={advisory.level} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {report?.description ?? t('copy.noRecent')}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <FreshnessChip sourceTimestamp={getAdvisorySourceTimestamp(advisory)} />
          {advisory.restriction && (
            <OfficialBadge label={t('map.restriction')} />
          )}
          <span className="text-xs text-muted-foreground">
            {sources.length ? sources.join(' · ') : t('source.unknown')}
          </span>
          <ArrowRight aria-hidden className="ml-auto size-4 text-link" />
        </div>
      </Link>
    </article>
  )
}
