import { Link } from '@tanstack/react-router'
import { Camera, Copy, GitCompare, MapPin, ShieldCheck, TriangleAlert, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdvisoryBadge, DemoBadge, OfficialBadge, RoadCode, StaleBadge } from '@/components/advisory'
import { corridorById, segmentById } from '@/data/fixtures'
import { advisoryFor } from '@/lib/data'
import { usePrefs } from '@/i18n/preferences'
import type { CommunityReport } from '@/lib/types'
import { cn } from '@/lib/utils'

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-3.5">
      <h4 className="mb-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{title}</h4>
      <div className="space-y-1.5 text-sm">{children}</div>
    </div>
  )
}

export function ReportCard({ report }: { report: CommunityReport }) {
  const { t, ago, stamp } = usePrefs()
  const isHazard = report.kind === 'hazard'
  return (
    <li className="rounded-xl border border-border bg-raised/60 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-semibold">
          {isHazard ? <TriangleAlert aria-hidden className="size-4 text-status-caution" /> : <MapPin aria-hidden className="size-4 text-muted-foreground" />}
          {isHazard ? `${t(`hazard.${report.hazardType}`)} · ${t(`sev.${report.severity}`)}` : t('kind.clear')}
        </span>
        <RoadCode>{report.ref}</RoadCode>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{report.description}</p>
      <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">{t('segment.observedAgo')}</dt>
        <dd title={stamp(report.observedAt)}>{ago(report.observedAt)}</dd>
        <dt className="text-muted-foreground">{t('segment.status')}</dt>
        <dd>{t(`status.${report.status}`)}</dd>
        <dt className="text-muted-foreground">{t('segment.source')}</dt>
        <dd>{t(`source.${report.source}`)}</dd>
        <dt className="text-muted-foreground">{t('segment.locConf')}</dt>
        <dd>{t(`conf.${report.locationConfidence}`)}</dd>
      </dl>
      <div className="mt-2.5 flex flex-wrap gap-1.5 text-xs">
        <span className="rounded-full border border-border px-2 py-0.5">{t('copy.notOfficial')}</span>
        {report.landmark && <span className="rounded-full bg-accent px-2 py-0.5">{report.landmark}</span>}
        {report.photoCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5">
            <Camera aria-hidden className="size-3" /> {report.photoCount} {t('segment.photos')}
          </span>
        )}
        {report.conflictsWith && (
          <span className="inline-flex items-center gap-1 rounded-full border border-status-caution/70 px-2 py-0.5">
            <GitCompare aria-hidden className="size-3" /> {t('segment.conflict')} {report.conflictsWith}
          </span>
        )}
        {report.duplicateOf && (
          <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5">
            <Copy aria-hidden className="size-3" /> {t('segment.duplicate')} {report.duplicateOf}
          </span>
        )}
      </div>
    </li>
  )
}

export function SegmentDetail({ segmentId, onClose, className }: { segmentId?: string; onClose?: () => void; className?: string }) {
  const { t, ago, stamp, place } = usePrefs()
  const seg = segmentId ? segmentById(segmentId) : undefined
  const adv = segmentId ? advisoryFor(segmentId) : undefined

  if (!seg || !adv) {
    return (
      <div className={cn('flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center', className)}>
        <MapPin aria-hidden className="mb-2 size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t('segment.select')}</p>
      </div>
    )
  }

  const corridor = corridorById(seg.corridorId)
  const hazards = adv.evidence.filter((r) => r.kind === 'hazard')
  const latestHazard = hazards[0]
  const unverified = adv.evidence.some((r) => r.kind === 'hazard' && r.status !== 'verified')
  const sources = new Set(adv.evidence.map((r) => r.source))
  const r = adv.restriction

  return (
    <section aria-labelledby="seg-title" className={cn('rounded-2xl border border-border bg-card p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <RoadCode>
            {seg.code} · km {seg.kmStart}–{seg.kmEnd}
          </RoadCode>
          <h3 id="seg-title" className="mt-1 font-display text-xl font-semibold">
            {place(seg.from)} – {place(seg.to)}
          </h3>
          <p className="text-sm text-muted-foreground">{corridor?.name}</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon-lg" className="-mt-1 -mr-2 rounded-full" onClick={onClose} aria-label={t('segment.close')}>
            <X />
          </Button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <AdvisoryBadge level={adv.level} size="lg" />
        {adv.stale && <StaleBadge age={adv.latestObservationAt ? ago(adv.latestObservationAt) : undefined} />}
        {r && <OfficialBadge label={t(`restriction.${r.type}`)} />}
        {adv.awaitingClearance && (
          <span className="rounded-full border border-dashed border-status-official px-2.5 py-0.5 text-xs font-medium">
            {t('copy.awaitingClearance')}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs font-medium text-muted-foreground">{t('copy.estimate')}</p>

      <div className="mt-3">
        <Block title={t('segment.observed')}>
          {latestHazard ? (
            <p>
              {t(`hazard.${latestHazard.hazardType}`)} · {t(`sev.${latestHazard.severity}`)} — {latestHazard.description}
            </p>
          ) : adv.basis === 'verified_clear' ? (
            <p>{t('kind.clear')}</p>
          ) : (
            <p>{t('copy.noRecent')}</p>
          )}
        </Block>

        <Block title={t('segment.action')}>
          <p className="font-medium">{t(`action.${adv.level}`)}</p>
          {(adv.level === 'unknown' || adv.level === 'clear') && (
            <p className="text-muted-foreground">{t('copy.noReportNotSafe')}</p>
          )}
        </Block>

        <Block title={t('segment.official')}>
          {r ? (
            <div className="rounded-xl border border-status-official/50 bg-status-official/10 p-3">
              <p className="flex items-center gap-2 font-semibold">
                <ShieldCheck aria-hidden className="size-4 text-status-official" />
                {t(`restriction.${r.type}`)} — {r.title}
              </p>
              <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                <dt className="text-muted-foreground">{t('segment.issuedBy')}</dt>
                <dd>{r.issuingAuthority}</dd>
                <dt className="text-muted-foreground">{t('segment.published')}</dt>
                <dd>{stamp(r.publishedAt)}</dd>
                <dt className="text-muted-foreground">{t('segment.effective')}</dt>
                <dd>{stamp(r.effectiveFrom)}</dd>
                <dt className="text-muted-foreground">{t('segment.reviewBy')}</dt>
                <dd>{stamp(r.reviewBy)}</dd>
                <dt className="text-muted-foreground">{t('segment.status')}</dt>
                <dd className="font-semibold">{t('segment.inForce')}</dd>
                <dt className="text-muted-foreground">{t('segment.ref')}</dt>
                <dd className="font-mono">{r.supportingReference}</dd>
              </dl>
              {adv.restrictionPastReview && <p className="mt-2 text-xs font-medium">{t('copy.pastReview')}</p>}
            </div>
          ) : (
            <p>{t('copy.noOfficial')}</p>
          )}
        </Block>

        <Block title={t('segment.source')}>
          {adv.latestObservationAt ? (
            <p>
              {t('results.latest')}: <span className="font-medium">{ago(adv.latestObservationAt)}</span>{' '}
              <span className="text-muted-foreground">({stamp(adv.latestObservationAt)})</span>
            </p>
          ) : (
            <p>{t('copy.noRecent')}</p>
          )}
          {sources.size > 0 && (
            <p className="text-muted-foreground">
              {[...sources].map((s) => t(`source.${s}`)).join(' · ')} — {adv.evidence.length} {t('segment.reportsCount')}
            </p>
          )}
        </Block>

        <Block title={t('segment.uncertainty')}>
          <p>{t(`basis.${adv.basis}`)}</p>
          {adv.evidence.length > 0 && (
            <p className="text-muted-foreground">
              {adv.reviewedCount} {t('segment.reviewed')} / {adv.evidence.length}
            </p>
          )}
          {unverified && <p className="text-muted-foreground">{t('copy.communityUnverified')}</p>}
        </Block>
      </div>

      {adv.evidence.length > 0 && (
        <div className="border-t border-border pt-3.5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t('segment.reports')}</h4>
            <DemoBadge />
          </div>
          <ul className="space-y-2">
            {adv.evidence.slice(0, 3).map((rep) => (
              <ReportCard key={rep.ref} report={rep} />
            ))}
          </ul>
        </div>
      )}

      <Button asChild variant="outline" className="mt-4 h-11 w-full rounded-xl">
        <Link to="/report" search={{ segment: seg.id }}>
          <TriangleAlert />
          {t('results.reportHere')}
        </Link>
      </Button>
    </section>
  )
}
