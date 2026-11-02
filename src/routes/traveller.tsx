import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { List, Map as MapIcon } from 'lucide-react'
import { AdvisoryCard } from '@/components/advisory-card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/feedback'
import { MountainBanner } from '@/components/mountain-banner'
import { MapLegend, SchematicMap } from '@/features/routes/schematic-map'
import { RouteSearchCard } from '@/features/routes/route-search'
import { SegmentDetail } from '@/features/routes/segment-detail'
import { findSeededRoutes } from '@/features/routes/routing'
import { SEGMENTS, placeById } from '@/data/fixtures'
import { usePrefs } from '@/i18n/preferences'
import { advisoryFor } from '@/lib/data'
import { cn } from '@/lib/utils'

type TravellerSearch = {
  from?: string
  to?: string
  view?: 'map' | 'list'
  seg?: string
}

export const Route = createFileRoute('/traveller')({
  validateSearch: (search: Record<string, unknown>): TravellerSearch => ({
    from: typeof search.from === 'string' ? search.from : undefined,
    to: typeof search.to === 'string' ? search.to : undefined,
    view: search.view === 'list' ? 'list' : search.view === 'map' ? 'map' : undefined,
    seg: typeof search.seg === 'string' ? search.seg : undefined,
  }),
  head: () => ({ meta: [{ title: 'Search roads · RaahPrahari' }] }),
  component: TravellerPage,
})

function TravellerPage() {
  const { t, place } = usePrefs()
  const search = Route.useSearch()
  const [view, setView] = useState<'map' | 'list'>(search.view ?? 'map')
  const from = search.from && placeById(search.from) ? search.from : undefined
  const to = search.to && placeById(search.to) ? search.to : undefined
  const journey = !!from && !!to && from !== to
  const routes = useMemo(
    () => (from && to && from !== to ? findSeededRoutes(from, to) : []),
    [from, to],
  )
  const routeSegmentIds = new Set(routes.flatMap((route) => route.segments.map((segment) => segment.id)))
  const segments = journey
    ? SEGMENTS.filter((segment) => routeSegmentIds.has(segment.id))
    : SEGMENTS
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | undefined>(
    search.seg,
  )
  const advisories = segments.map((segment) => {
    const advisory = advisoryFor(segment.id)
    if (!advisory) throw new Error(`Missing advisory for segment "${segment.id}"`)
    return advisory
  })
  const hazards = advisories.reduce(
    (count, advisory) => count + advisory.evidence.filter((evidence) => evidence.kind === 'hazard').length,
    0,
  )
  const restrictions = advisories.filter((advisory) => advisory.restriction).length

  return (
    <div className="pb-8">
      <MountainBanner
        eyebrow={t('hero.eyebrow')}
        title={t('traveller.title')}
        description={t('traveller.body')}
      />

      <div className="rp-container grid gap-5 py-6 lg:grid-cols-[minmax(17rem,0.8fr)_minmax(0,1.8fr)]">
        <section aria-label={t('search.title')} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <RouteSearchCard initialFrom={from} initialTo={to} destination="traveller" />
        </section>
        <section aria-labelledby="traveller-results" className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="traveller-results" className="font-display text-2xl font-semibold">
                {journey && from && to ? `${place(from)} – ${place(to)}` : t('adv.title')}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {journey ? `${routes.length} ${t('results.title').toLowerCase()}` : t('adv.body')}
              </p>
            </div>
            <div role="group" aria-label={`${t('view.map')} / ${t('view.list')}`} className="inline-flex rounded-full border border-border p-1">
              {(['map', 'list'] as const).map((nextView) => (
                <Button
                  key={nextView}
                  type="button"
                  variant={view === nextView ? 'secondary' : 'ghost'}
                  aria-pressed={view === nextView}
                  className={cn('h-10 rounded-full px-3', view === nextView && 'text-link')}
                  onClick={() => setView(nextView)}
                >
                  {nextView === 'map' ? <MapIcon aria-hidden /> : <List aria-hidden />}
                  {t(`view.${nextView}`)}
                </Button>
              ))}
            </div>
          </div>

          <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{hazards} {t('results.hazards')}</span>
            <span>{restrictions} {t('results.restrictions')}</span>
            <span>{t('results.seeded')}</span>
          </p>

          {journey && routes.length === 0 ? (
            <EmptyState title={t('results.none')} message={t('results.noneBody')} />
          ) : view === 'map' ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
              <div className="space-y-3">
                <SchematicMap
                  endpoints={journey ? [from, to] : undefined}
                  highlight={journey ? [...routeSegmentIds] : undefined}
                  selectedSegmentId={selectedSegmentId}
                  onSelectSegment={setSelectedSegmentId}
                  className="max-h-[70vh]"
                />
                <MapLegend />
              </div>
              <SegmentDetail segmentId={selectedSegmentId} />
            </div>
          ) : (
            <div className="space-y-3">
              {segments.map((segment) => (
                <AdvisoryCard key={segment.id} segment={segment} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
