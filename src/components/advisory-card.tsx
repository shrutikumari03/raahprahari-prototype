import { Link } from '@tanstack/react-router'
import { ArrowRight, Clock3, ShieldCheck, TriangleAlert, UsersRound } from 'lucide-react'
import { ActionBadge, FreshnessChip, OfficialBadge, RoadCode } from '@/components/advisory'
import { usePrefs } from '@/i18n/preferences'
import { getAdvisorySourceTimestamp } from '@/lib/advisory'
import type { Segment } from '@/lib/types'
import { advisoryFor } from '@/lib/data'
import { cn } from '@/lib/utils'

export function AdvisoryCard({
  segment,
  className,
  variant = 'default',
}: {
  segment: Segment
  className?: string
  variant?: 'default' | 'home-featured'
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

  if (variant === 'home-featured') {
    const sourceTimestamp = getAdvisorySourceTimestamp(advisory)
    if (sourceTimestamp === undefined) {
      throw new Error(`Missing source timestamp for sample segment "${segment.id}"`)
    }

    const lastUpdated = new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(sourceTimestamp)

    return (
      <article className={cn('home-advisory', className)}>
        <Link
          to="/advisories/$segmentId"
          params={{ segmentId: segment.id }}
          className="home-advisory-link"
        >
          <p className="home-advisory-kicker">
            <TriangleAlert aria-hidden />
            ROAD ADVISORY
          </p>
          <div className="home-advisory-status">
            <ActionBadge level={advisory.level} size="lg" className="home-avoid-badge" />
            <RoadCode className="home-advisory-road">B-12 · Km 42–48</RoadCode>
          </div>
          <p className="home-advisory-description">Reported debris on the road</p>
          <dl className="home-advisory-details">
            <div>
              <ShieldCheck aria-hidden />
              <dt>Official restriction:</dt>
              <dd>No current official information</dd>
            </div>
            <div>
              <UsersRound aria-hidden />
              <dt>Evidence:</dt>
              <dd>Community corroborated</dd>
            </div>
            <div>
              <Clock3 aria-hidden />
              <dt>Last updated:</dt>
              <dd>{lastUpdated}</dd>
            </div>
          </dl>
          <p className="home-advisory-footer">Illustrative synthetic information</p>
        </Link>
      </article>
    )
  }

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
