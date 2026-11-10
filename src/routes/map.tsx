import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  CircleHelp,
  Crosshair,
  FileText,
  House,
  List,
  Map as MapIcon,
  Menu,
  Minus,
  Plus,
  Search,
  Shield,
  TriangleAlert,
  UserRound,
  X,
} from 'lucide-react'
import { AdvisoryCard } from '@/components/advisory-card'
import { Logo } from '@/components/site-chrome'
import { SegmentMap } from '@/features/routes/schematic-map'
import { SegmentDetail } from '@/features/routes/segment-detail'
import { usePrefs } from '@/i18n/preferences'
import { useAppStore } from '@/lib/app-store'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import './map.css'

type MapSearch = { seg?: string; view?: 'map' | 'list' }
type ViewMode = 'map' | 'list'

const navigation = [
  { label: 'Home', to: '/' as const, icon: House },
  { label: 'Live Map', to: '/map' as const, icon: MapIcon, active: true },
  { label: 'Advisories', to: '/advisories' as const, icon: TriangleAlert },
  { label: 'Reports', to: '/report' as const, icon: FileText },
]

export const Route = createFileRoute('/map')({
  validateSearch: (search: Record<string, unknown>): MapSearch => ({
    seg: typeof search.seg === 'string' ? search.seg : undefined,
    view: search.view === 'list' ? 'list' : search.view === 'map' ? 'map' : undefined,
  }),
  head: () => ({ meta: [{ title: 'Live map · RaahPrahari' }] }),
  component: MapPage,
})

function MapPage() {
  const { place } = usePrefs()
  const { segments: SEGMENTS, corridors } = useAppStore()
  const corridorById = (id: string) => corridors.find((c) => c.id === id)
  const segmentById = (id: string) => SEGMENTS.find((s) => s.id === id)
  const search = Route.useSearch()
  const initialSegment = search.seg && segmentById(search.seg) ? search.seg : 'nh7-06'
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | undefined>(initialSegment)
  const [view, setView] = useState<ViewMode>(search.view ?? 'map')
  const [query, setQuery] = useState('')
  const [zoom, setZoom] = useState(1.35)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mapFailed, setMapFailed] = useState(false)

  const filteredSegments = useMemo(() => {
    const term = query.trim().toLocaleLowerCase()
    if (!term) return SEGMENTS
    return SEGMENTS.filter((segment) => {
      const corridor = corridors.find((c) => c.id === segment.corridorId)
      return [
        segment.code,
        corridor?.name,
        place(segment.from),
        place(segment.to),
      ].some((value) => value?.toLocaleLowerCase().includes(term))
    })
  }, [place, query, SEGMENTS, corridors])
  const selectedSegment = selectedSegmentId ? segmentById(selectedSegmentId) : undefined
  const selectedCorridor = selectedSegment ? corridorById(selectedSegment.corridorId) : undefined
  const highlightedSegments = selectedSegment
    ? SEGMENTS.filter((segment) => segment.corridorId === selectedSegment.corridorId).map((segment) => segment.id)
    : undefined
  const routeLabels = selectedCorridor && selectedSegment
    ? [...new Set([
        selectedCorridor.stops[0],
        selectedCorridor.stops[selectedCorridor.stops.length - 1],
        selectedSegment.from,
        selectedSegment.to,
      ])]
    : undefined

  const changeView = (nextView: ViewMode) => {
    if (nextView === 'map' && mapFailed) return
    setView(nextView)
  }

  return (
    <div className="rp-map-page">
      <header className="rp-map-header">
        <Link to="/" className="rp-map-brand" aria-label="RaahPrahari home">
          <Logo />
        </Link>
        <label className="rp-map-search">
          <Search aria-hidden className="size-4 shrink-0" />
          <span className="sr-only">Search by road, place, or location</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value
              setQuery(nextQuery)
              const normalized = nextQuery.trim().toLocaleLowerCase()
              if (!normalized) return
              const matching = SEGMENTS.find((segment) => {
                const corridor = corridorById(segment.corridorId)
                return [
                  segment.code,
                  corridor?.name,
                  place(segment.from),
                  place(segment.to),
                ].some((value) => value?.toLocaleLowerCase().includes(normalized))
              })
              if (matching) setSelectedSegmentId(matching.id)
            }}
            placeholder="Search by road, place, or location..."
          />
          {query && (
            <button type="button" className="rp-map-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <X aria-hidden className="size-4" />
            </button>
          )}
        </label>
        <div className="rp-map-header-actions">
          <div className="rp-map-toggle" role="group" aria-label="Map or list view">
            {(['map', 'list'] as const).map((nextView) => (
              <button
                key={nextView}
                type="button"
                aria-pressed={view === nextView}
                disabled={nextView === 'map' && mapFailed}
                onClick={() => changeView(nextView)}
              >
                {nextView === 'map' ? <MapIcon aria-hidden /> : <List aria-hidden />}
                {nextView === 'map' ? 'Map' : 'List'}
              </button>
            ))}
          </div>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="rp-map-mobile-menu"
                aria-label="Open navigation menu"
              >
                <Menu aria-hidden />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(17rem,85vw)]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Main navigation
                </SheetDescription>
              </SheetHeader>
              <MapNavigation onNavigate={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="rp-map-layout">
        <aside className="rp-map-sidebar" aria-label="Main navigation">
          <MapNavigation />
          <MapSidebarBanner />
        </aside>

        <div className="rp-map-main">
          {view === 'map' && <h1 className="sr-only">Live road map</h1>}
          {mapFailed && (
            <p className="rp-map-fallback-notice" role="status">
              The terrain map could not be loaded. Showing the road list instead.
            </p>
          )}

          {view === 'map' ? (
            <section className="rp-map-canvas" aria-label="Live road map">
              <div className="rp-map-canvas-layer" style={{ transform: `scale(${zoom})` }}>
                <img
                  src="/img/map-terrain.png"
                  alt=""
                  className="rp-map-terrain"
                  onError={() => {
                    setMapFailed(true)
                    setView('list')
                  }}
                />
                <div className="rp-map-shade" />
                <SegmentMap
                  terrain
                  highlight={highlightedSegments}
                  labelPlaces={routeLabels}
                  selectedSegmentId={selectedSegmentId}
                  onSelectSegment={setSelectedSegmentId}
                  className="rp-map-route-overlay"
                />
              </div>

              <div className="rp-map-compass" role="img" aria-label="North">
                <span aria-hidden>N</span>
                <span aria-hidden className="rp-map-compass-arrow">▲</span>
              </div>

              <MapLegend />

              <div className="rp-map-controls" aria-label="Map controls">
                <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={() => setZoom((current) => Math.min(current + 0.15, 1.75))}
                >
                  <Plus aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Zoom out"
                  onClick={() => setZoom((current) => Math.max(current - 0.15, 1))}
                >
                  <Minus aria-hidden />
                </button>
                <button type="button" aria-label="Recenter map" onClick={() => setZoom(1)}>
                  <Crosshair aria-hidden />
                </button>
              </div>

              <div className="rp-map-scale" aria-label="Approximate map scale">
                <span>0</span><span>10</span><span>20</span><span>30 km</span>
                <i aria-hidden />
              </div>

              <SegmentDetail
                segmentId={selectedSegmentId}
                variant="map"
                className="rp-map-detail"
                onClose={() => setSelectedSegmentId(undefined)}
              />
            </section>
          ) : (
            <section className="rp-map-list-view" aria-label="Road segment list">
              <div className="rp-map-list">
                <div className="rp-map-list-heading">
                  <div>
                    <p className="rp-map-kicker">ROAD CONDITIONS</p>
                    <h1>Road segments</h1>
                  </div>
                  <span>{filteredSegments.length} segments</span>
                </div>
                {filteredSegments.length ? (
                  <div className="rp-map-list-cards">
                    {filteredSegments.map((segment) => (
                      <article
                        key={segment.id}
                        className={cn(
                          'rp-map-list-card',
                          segment.id === selectedSegmentId && 'is-selected',
                        )}
                      >
                        <button
                          type="button"
                          className="rp-map-list-select"
                          aria-pressed={segment.id === selectedSegmentId}
                          onClick={() => setSelectedSegmentId(segment.id)}
                        >
                          <span>{segment.id === selectedSegmentId ? 'Selected segment' : 'Select segment'}</span>
                          {segment.id === selectedSegmentId && <span aria-hidden>✓</span>}
                        </button>
                        <AdvisoryCard segment={segment} />
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="rp-map-no-results">No road segments match “{query}”.</p>
                )}
              </div>
              <SegmentDetail
                segmentId={selectedSegmentId}
                variant="map"
                className="rp-map-list-detail"
                onClose={() => setSelectedSegmentId(undefined)}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function MapNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="rp-map-nav">
      {navigation.map(({ label, to, icon: Icon, active }) => (
        <Link
          key={label}
          to={to}
          onClick={onNavigate}
          aria-current={active ? 'page' : undefined}
          className={cn('rp-map-nav-link', active && 'is-active')}
        >
          <Icon aria-hidden />
          <span>{label}</span>
        </Link>
      ))}
      <button type="button" className="rp-map-nav-link rp-map-profile" disabled>
        <UserRound aria-hidden />
        <span>Profile</span>
        <span className="sr-only">Profile is not available in this prototype.</span>
      </button>
    </nav>
  )
}

function MapSidebarBanner() {
  return (
    <div className="rp-map-sidebar-banner">
      <img src="/img/banner-strip.png" alt="" />
      <p>Safer roads<br />Stronger journeys</p>
    </div>
  )
}

function MapLegend() {
  return (
    <aside className="rp-map-legend" aria-label="Map legend">
      <h2>Map legend</h2>
      <p><TriangleAlert aria-hidden className="reported" /> Reported hazard</p>
      <p><Shield aria-hidden className="official" /> Official restriction</p>
      <p><CircleHelp aria-hidden className="unknown" /> Unknown information</p>
    </aside>
  )
}
