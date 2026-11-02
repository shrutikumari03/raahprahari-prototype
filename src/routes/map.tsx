import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { List, Map as MapIcon } from 'lucide-react'
import { AdvisoryCard } from '@/components/advisory-card'
import { MountainBanner } from '@/components/mountain-banner'
import { Button } from '@/components/ui/button'
import { MapLegend, SchematicMap } from '@/features/routes/schematic-map'
import { SegmentDetail } from '@/features/routes/segment-detail'
import { SEGMENTS } from '@/data/fixtures'
import { usePrefs } from '@/i18n/preferences'
import { cn } from '@/lib/utils'

type MapSearch = { seg?: string; view?: 'map' | 'list' }

export const Route = createFileRoute('/map')({
  validateSearch: (search: Record<string, unknown>): MapSearch => ({
    seg: typeof search.seg === 'string' ? search.seg : undefined,
    view: search.view === 'list' ? 'list' : search.view === 'map' ? 'map' : undefined,
  }),
  head: () => ({ meta: [{ title: 'Live map · RaahPrahari' }] }),
  component: MapPage,
})

function MapPage() {
  const { t } = usePrefs()
  const search = Route.useSearch()
  const [selectedSegmentId, setSelectedSegmentId] = useState(search.seg)
  const [view, setView] = useState<'map' | 'list'>(search.view ?? 'map')

  return (
    <div className="pb-8">
      <MountainBanner
        eyebrow={t('hero.eyebrow')}
        title={t('nav.map')}
        description={t('map.description')}
      />
      <div className="rp-container space-y-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{t('map.coverage')}</span>
            <span aria-hidden>·</span>
            <span>{t('map.seededData')}</span>
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

        {view === 'map' ? (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(19rem,0.8fr)]">
            <div className="space-y-3">
              <SchematicMap
                selectedSegmentId={selectedSegmentId}
                onSelectSegment={setSelectedSegmentId}
                className="max-h-[76vh]"
              />
              <MapLegend />
            </div>
            <SegmentDetail segmentId={selectedSegmentId} />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {SEGMENTS.map((segment) => <AdvisoryCard key={segment.id} segment={segment} />)}
          </div>
        )}
      </div>
    </div>
  )
}
