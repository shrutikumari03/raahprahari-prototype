import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Compass,
  Crosshair,
  List,
  LocateFixed,
  Map as MapIcon,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
  X,
} from 'lucide-react'
import { ActionBadge, FreshnessChip } from '@/components/advisory'
import { Button } from '@/components/ui/button'
import { SEGMENTS, PLACES, placeById, placeById as getPlace } from '@/data/fixtures'
import { getCurrentPosition, inCoverage, nearestPlace } from '@/lib/geo'
import { getAdvisorySourceTimestamp } from '@/lib/advisory'
import type { AdvisoryLevel, SegmentAdvisory } from '@/lib/advisory'
import { advisoryFor } from '@/lib/data'
import { STORAGE_KEYS, useLocalState } from '@/lib/storage'
import { usePrefs } from '@/i18n/preferences'
import { findSeededRoutes } from '@/features/routes/routing'
import type { Segment } from '@/lib/types'
import { cn } from '@/lib/utils'
import './traveller.css'

type TravellerSearch = {
  q?: string
  from?: string
  to?: string
  view?: 'map' | 'list'
  seg?: string
}

type RecentTravellerSearch = {
  query: string
  at: number
}

type ResultFilter = 'all' | 'roads' | 'hazards'
type SearchStatus = 'idle' | 'loading' | 'failure'

const RECENT_TRAVELLER_SEARCHES = `${STORAGE_KEYS.recentSearches}.traveller`

export const Route = createFileRoute('/traveller')({
  validateSearch: (search: Record<string, unknown>): TravellerSearch => ({
    q: typeof search.q === 'string' ? search.q : undefined,
    from: typeof search.from === 'string' ? search.from : undefined,
    to: typeof search.to === 'string' ? search.to : undefined,
    view: search.view === 'list' ? 'list' : search.view === 'map' ? 'map' : undefined,
    seg: typeof search.seg === 'string' ? search.seg : undefined,
  }),
  head: () => ({ meta: [{ title: 'Search roads · RaahPrahari' }] }),
  component: TravellerPage,
})

function TravellerPage() {
  const { place, ago } = usePrefs()
  const navigate = useNavigate()
  const search = Route.useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const [recent, setRecent] = useLocalState<RecentTravellerSearch[]>(RECENT_TRAVELLER_SEARCHES, [])
  const from = search.from && placeById(search.from) ? search.from : undefined
  const to = search.to && placeById(search.to) ? search.to : undefined
  const journey = !!from && !!to && from !== to
  const [query, setQuery] = useState(
    search.q ?? (journey && from && to ? `${place(from)} to ${place(to)}` : ''),
  )
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle')
  const [filter, setFilter] = useState<ResultFilter>('all')
  const [locationMessage, setLocationMessage] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)
  const [manualEntry, setManualEntry] = useState(false)
  const activeQuery = search.q?.trim() ?? ''
  const hasSearch = !!activeQuery || journey

  const routeOptions = useMemo(
    () => {
      if (journey && from && to) return findSeededRoutes(from, to)
      const endpoints = routePlaceIds(activeQuery)
      return endpoints ? findSeededRoutes(...endpoints) : []
    },
    [activeQuery, from, to, journey],
  )
  const matchingSegments = useMemo(() => {
    if (journey && from && to) {
      return [...new Map(routeOptions.flatMap((route) => route.segments).map((segment) => [segment.id, segment])).values()]
    }
    return activeQuery ? segmentsForQuery(activeQuery) : []
  }, [activeQuery, from, journey, routeOptions, to])
  const matchingAdvisories = matchingSegments.map((segment) => {
    const advisory = advisoryFor(segment.id)
    if (!advisory) throw new Error(`Missing advisory for segment "${segment.id}"`)
    return { segment, advisory }
  })
  const filteredResults = matchingAdvisories.filter(({ advisory }) => {
    if (filter === 'hazards') {
      return advisory.evidence.some((report) => report.kind === 'hazard') || !!advisory.restriction
    }
    if (filter === 'roads') return true
    return true
  })
  const routeSummary = routeOptions[0]
  const runSearch = (rawQuery = query) => {
    const value = rawQuery.trim()
    if (!value) {
      inputRef.current?.focus()
      return
    }

    setQuery(value)
    setLocationMessage(null)
    setSearchStatus('loading')
    window.setTimeout(() => {
      void navigate({
        to: '/traveller',
        search: {
          q: value,
          from: undefined,
          to: undefined,
          view: undefined,
          seg: undefined,
        },
      }).then(() => {
        setSearchStatus('idle')
        setRecent((previous) => [
          { query: value, at: Date.now() },
          ...previous.filter((item) => item.query.toLowerCase() !== value.toLowerCase()),
        ].slice(0, 5))
      }).catch((error: unknown) => {
        console.error('Road search navigation failed', error)
        setSearchStatus('failure')
      })
    }, 100)
  }

  const clearSearch = () => {
    setQuery('')
    setSearchStatus('idle')
    setLocationMessage(null)
    void navigate({
      to: '/traveller',
      search: { q: undefined, from: undefined, to: undefined, view: undefined, seg: undefined },
    })
  }

  const requestCurrentLocation = async () => {
    setLocating(true)
    setLocationMessage(null)
    const result = await getCurrentPosition()
    setLocating(false)
    if (!result.ok) {
      setLocationMessage(
        result.reason === 'denied'
          ? 'Location permission denied. Search manually instead.'
          : 'Location is unavailable. You can still search manually.',
      )
      setManualEntry(true)
      return
    }
    if (!inCoverage(result.lat, result.lon)) {
      setLocationMessage('Your location is outside the current coverage area. Enter a place or road manually.')
      setManualEntry(true)
      return
    }

    const nearest = nearestPlace(result.lat, result.lon)
    setQuery(place(nearest.id))
    setLocationMessage(`Nearest covered place: ${place(nearest.id)}. Review or edit the search before continuing.`)
  }

  const chooseRecent = (value: string) => {
    setQuery(value)
    runSearch(value)
  }

  const searchForm = (
    <form
      className="traveller-search-form"
      onSubmit={(event) => {
        event.preventDefault()
        runSearch()
      }}
    >
      <label className="traveller-search-label" htmlFor="traveller-query">
        Search a place or road
      </label>
      <div className="traveller-query-wrap">
        <Search aria-hidden className="traveller-query-icon" />
        <input
          ref={inputRef}
          id="traveller-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. Dehradun to Mussoorie"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className="traveller-clear-query"
            aria-label="Clear search"
            onClick={clearSearch}
          >
            <X aria-hidden />
          </button>
        )}
      </div>
      <Button type="submit" className="traveller-search-submit" disabled={!query.trim() || searchStatus === 'loading'}>
        <Search aria-hidden />
        {searchStatus === 'loading' ? 'Searching…' : 'Search road'}
      </Button>
      <div className="traveller-location-actions">
        <Button type="button" variant="outline" onClick={() => void requestCurrentLocation()} disabled={locating}>
          <LocateFixed aria-hidden />
          {locating ? 'Getting location…' : 'Use current location'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setManualEntry(true)
            inputRef.current?.focus()
          }}
        >
          <MapPin aria-hidden />
          Enter location manually
        </Button>
      </div>
      <p className="traveller-location-note" role={locationMessage ? 'status' : undefined}>
        {locationMessage ??
          (manualEntry
            ? 'Manual search is active. Location access is optional.'
            : 'Location access is optional. Search manually at any time.')}
      </p>
    </form>
  )

  if (!hasSearch && searchStatus !== 'failure') {
    return (
      <div className="traveller-page traveller-landing">
        <section className="traveller-search-panel" aria-labelledby="traveller-title">
          <div className="traveller-panel-content">
            <p className="traveller-eyebrow">ROAD ADVISORIES · UTTARAKHAND</p>
            <h1 id="traveller-title">Where are you travelling?</h1>
            <p className="traveller-panel-description">
              Search reported road conditions, evidence freshness, and official restrictions.
            </p>
            {searchForm}
            <RecentSearches
              recent={recent}
              onChoose={chooseRecent}
              onClear={() => setRecent([])}
            />
          </div>
        </section>
        <IllustrativeMap
          results={[]}
          routeFrom="Dehradun"
          routeTo="Mussoorie"
          summary="Illustrative example · approx."
        />
        <TravellerFooter />
      </div>
    )
  }

  const resultTitle = 'Search results'
  const routeFrom = journey && from ? place(from) : routeSummary ? place(routeSummary.segments[0]?.from ?? '') : undefined
  const routeTo = journey && to ? place(to) : routeSummary ? place(routeSummary.segments.at(-1)?.to ?? '') : undefined

  return (
    <div className="traveller-page traveller-results-page">
      <section className="traveller-results-banner">
        <div className="traveller-results-heading">
          <div>
            <button type="button" className="traveller-back-link" onClick={clearSearch}>
              <ArrowLeft aria-hidden />
              Back to search
            </button>
            <h1>{resultTitle}</h1>
            <p>Here are the latest reports and advisories for your search.</p>
          </div>
          <div className="traveller-results-search">{searchForm}</div>
        </div>
        <div className="traveller-filter-row" role="group" aria-label="Filter results">
          {([
            ['all', 'All'],
            ['roads', 'Roads'],
            ['hazards', 'Hazards'],
          ] as const).map(([key, label]) => (
            <button
              type="button"
              key={key}
              aria-pressed={filter === key}
              className={cn('traveller-filter-chip', filter === key && 'is-active')}
              onClick={() => setFilter(key)}
            >
              {key === 'roads' && <MapIcon aria-hidden />}
              {key === 'hazards' && <TriangleAlert aria-hidden />}
              {label}
            </button>
          ))}
        </div>
      </section>

      <div className="traveller-results-layout">
        <section className="traveller-result-list" aria-label="Search results">
          {searchStatus === 'loading' ? (
            <div className="traveller-state-card" role="status">
              <span className="traveller-loading-mark" aria-hidden />
              <div>
                <h2>Searching road information…</h2>
                <p>Checking available synthetic reports and advisories.</p>
              </div>
            </div>
          ) : searchStatus === 'failure' ? (
            <div className="traveller-state-card" role="alert">
              <TriangleAlert aria-hidden />
              <div>
                <h2>Search could not be completed.</h2>
                <p>Try again or enter a place or road manually.</p>
                <Button type="button" variant="outline" onClick={() => runSearch()}>
                  Try again
                </Button>
              </div>
            </div>
          ) : filteredResults.length ? (
            filteredResults.map(({ segment, advisory }) => (
              <ResultRow
                key={segment.id}
                segment={segment}
                observedAt={getAdvisorySourceTimestamp(advisory)}
                reason={
                  advisory.evidence[0]?.description ??
                  advisory.restriction?.title ??
                  'No recent observation is available for this road section.'
                }
                observedLabel={advisory.latestObservationAt ? ago(advisory.latestObservationAt) : undefined}
              />
            ))
          ) : (
            <div className="traveller-empty-state">
              <MapPin aria-hidden />
              <div>
                <h2>No matching reports found.</h2>
                <p>This does not confirm current road conditions.</p>
              </div>
              <Button type="button" variant="ghost" onClick={clearSearch}>
                <RotateCcw aria-hidden />
                Try a different search
              </Button>
            </div>
          )}
        </section>
        <IllustrativeMap
          results={filteredResults}
          routeFrom={routeFrom}
          routeTo={routeTo}
          summary={routeSummary ? 'Route summary · approx.' : 'Illustrative route · approx.'}
        />
      </div>
      <TravellerFooter />
    </div>
  )
}

export function getTravellerResultAction(advisory: SegmentAdvisory): AdvisoryLevel {
  if (advisory.restriction) {
    return advisory.level === 'clear' ? 'unknown' : advisory.level
  }
  if (!advisory.evidence.length) return 'unknown'
  return advisory.level === 'caution' || advisory.level === 'avoid' ? advisory.level : 'unknown'
}

export function ResultRow({
  segment,
  observedAt,
  observedLabel,
  reason,
}: {
  segment: Segment
  observedAt?: number
  observedLabel?: string
  reason: string
}) {
  const { place } = usePrefs()
  const advisory = advisoryFor(segment.id)
  if (!advisory) throw new Error(`Missing advisory for segment "${segment.id}"`)
  const action = getTravellerResultAction(advisory)
  const sourceLabel = advisory.evidence.length
    ? 'Community report, not independently verified'
    : advisory.restriction
      ? 'Official source'
      : 'No reported source'

  return (
    <article className={cn('traveller-result-row', `status-${action}`, advisory.stale && 'is-stale')}>
      <div className="traveller-result-badge">
        <ActionBadge level={action} />
      </div>
      <div className="traveller-result-main">
        <h2 className="rp-wrap-anywhere">
          {place(segment.from)} – {place(segment.to)} <span>({segment.code})</span>
        </h2>
        <p className="traveller-road-code">km {segment.kmStart}–{segment.kmEnd}</p>
        <p className="traveller-result-reason">{reason}</p>
        <p className="traveller-restriction-detail">
          <strong>Official restriction:</strong>{' '}
          {advisory.restriction?.title ?? 'No current official information'}
        </p>
        <p className="traveller-source-detail">
          <strong>Evidence / Source:</strong> {sourceLabel}
        </p>
        <div className="traveller-result-metadata">
          <span>
            <Clock3 aria-hidden />
            <strong>Observed:</strong> {observedLabel ?? 'time unavailable'}
          </span>
          {advisory.restriction && <span><ShieldCheck aria-hidden /> Official restriction</span>}
          {advisory.evidence.length > 0 && <span><UsersRound aria-hidden /> Community evidence</span>}
        </div>
      </div>
      <div className="traveller-row-trailing">
        <span className="traveller-freshness-chip">
          <strong>Freshness:</strong>
          <FreshnessChip sourceTimestamp={observedAt} className="traveller-inline-freshness" />
        </span>
        <Button asChild type="button" variant="outline" className="traveller-view-details">
          <Link to="/advisories/$segmentId" params={{ segmentId: segment.id }}>
            View details
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    </article>
  )
}

function RecentSearches({
  recent,
  onChoose,
  onClear,
}: {
  recent: RecentTravellerSearch[]
  onChoose: (query: string) => void
  onClear: () => void
}) {
  const [showExample, setShowExample] = useState(true)
  const example = 'Dehradun to Mussoorie'
  return (
    <section className="traveller-recent" aria-labelledby="traveller-recent-title">
      <div className="traveller-recent-heading">
        <h2 id="traveller-recent-title">Recent searches</h2>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            onClear()
            setShowExample(false)
          }}
        >
          <X aria-hidden />
          Clear
        </Button>
      </div>
      <ul>
        {recent.map(({ query }) => (
          <li key={query}>
            <button type="button" onClick={() => onChoose(query)}>
              <RotateCcw aria-hidden />
              {query}
            </button>
          </li>
        ))}
        {!recent.length && showExample && (
          <li className="traveller-example-search">
            <span>Illustrative example</span>
            <button type="button" onClick={() => onChoose(example)}>
              <RotateCcw aria-hidden />
              {example}
            </button>
          </li>
        )}
      </ul>
    </section>
  )
}

function IllustrativeMap({
  results,
  routeFrom,
  routeTo,
  summary,
}: {
  results: { segment: Segment }[]
  routeFrom?: string
  routeTo?: string
  summary: string
}) {
  const [mode, setMode] = useState<'map' | 'list'>('map')
  const [mapUnavailable, setMapUnavailable] = useState(false)
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>()
  const [zoom, setZoom] = useState(1)
  return (
    <section className="traveller-map-panel" aria-label="Illustrative route map">
      <div className="traveller-map-surface" style={{ '--map-zoom': zoom } as React.CSSProperties}>
        {mode === 'map' ? (
          <>
            <img
              src="/img/map-terrain.png"
              alt=""
              className="traveller-map-terrain"
              onError={() => {
                setMapUnavailable(true)
                setMode('list')
              }}
            />
            <p className="traveller-map-disclaimer">ILLUSTRATIVE · NOT FOR NAVIGATION</p>
            <div className="traveller-map-route" aria-hidden>
              <span className="route-piece route-piece-one" />
              <span className="route-piece route-piece-two" />
              <span className="route-piece route-piece-three" />
              <span className="route-piece route-piece-four" />
              <span className="route-piece route-piece-five" />
              <MapPin className="route-pin route-pin-start" />
              <MapPin className="route-pin route-pin-end" />
              <TriangleAlert className="route-hazard route-hazard-one" />
              <TriangleAlert className="route-hazard route-hazard-two" />
            </div>
            {routeFrom && <span className="traveller-map-place map-place-start">{routeFrom}</span>}
            {routeTo && <span className="traveller-map-place map-place-end">{routeTo}</span>}
            <div className="traveller-compass" aria-label="North">
              <Compass aria-hidden />
              <span>N</span>
            </div>
            <div className="traveller-map-tools">
              <button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(value + 0.1, 1.5))}>
                <Plus aria-hidden />
              </button>
              <button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(value - 0.1, 0.8))}>
                <Minus aria-hidden />
              </button>
              <button type="button" aria-label="Reset map orientation" onClick={() => setZoom(1)}>
                <Crosshair aria-hidden />
              </button>
            </div>
            <div className="traveller-map-scale" aria-label="Illustrative scale">
              <span>0</span><span>25</span><span>50</span><span>100 km</span>
            </div>
            <div className="traveller-map-legend" aria-label="Map legend">
              <span><TriangleAlert aria-hidden /> Reported hazard</span>
              <span><ShieldCheck aria-hidden /> Official restriction</span>
              <span><span className="unknown-dot">?</span> Unknown</span>
            </div>
          </>
        ) : (
          <>
            {mapUnavailable && (
              <p className="traveller-map-fallback-notice" role="status">
                The illustrative map provider is unavailable. Showing road sections instead.
              </p>
            )}
            <div className="traveller-map-list">
              <h2>Road sections</h2>
              {results.length ? results.slice(0, 6).map(({ segment }) => (
                <div className="traveller-map-list-row" key={segment.id}>
                  <button
                    type="button"
                    aria-pressed={selectedSegmentId === segment.id}
                    onClick={() => setSelectedSegmentId(segment.id)}
                  >
                    {selectedSegmentId === segment.id ? 'Selected: ' : 'Select: '}
                    {getPlace(segment.from)?.name} – {getPlace(segment.to)?.name}
                  </button>
                  <Link to="/advisories/$segmentId" params={{ segmentId: segment.id }}>
                    View details
                  </Link>
                  <Link to="/report" search={{ segment: segment.id }}>
                    Report this road
                  </Link>
                </div>
              )) : <p>Search manually to view matching road sections.</p>}
            </div>
          </>
        )}
        <div className="traveller-map-toggle" role="group" aria-label="Map view">
          <button
            type="button"
            aria-pressed={mode === 'map'}
            disabled={mapUnavailable}
            onClick={() => setMode('map')}
          >
            <MapIcon aria-hidden /> Map
          </button>
          <button type="button" aria-pressed={mode === 'list'} onClick={() => setMode('list')}>
            <List aria-hidden /> List
          </button>
        </div>
      </div>
      <div className="traveller-route-summary">
        <div className="traveller-summary-icon"><ArrowRight aria-hidden /></div>
        <div>
          <strong>{routeFrom && routeTo ? `${routeFrom} → ${routeTo}` : 'Route summary'}</strong>
          <span>{summary}</span>
        </div>
        <span className="traveller-summary-approx">approx.</span>
      </div>
    </section>
  )
}

function TravellerFooter() {
  return (
    <footer className="traveller-page-footer">
      <span><TriangleAlert aria-hidden /> Synthetic demo data, not current road conditions.</span>
      <span>PROTOTYPE · SYNTHETIC DEMO DATA</span>
    </footer>
  )
}

function segmentsForQuery(query: string): Segment[] {
  const normalized = normalizeQuery(query)
  const endpoints = routePlaceIds(query)
  if (endpoints) {
    return [...new Map(findSeededRoutes(...endpoints).flatMap((route) => route.segments).map((segment) => [segment.id, segment])).values()]
  }

  const words = normalized.split(/\s+/).filter((word) => word && word !== 'to')
  return SEGMENTS.filter((segment) => {
    const advisory = advisoryFor(segment.id)
    const from = placeById(segment.from)
    const to = placeById(segment.to)
    const haystack = normalizeQuery([
      segment.code,
      from?.name,
      from?.nameHi,
      to?.name,
      to?.nameHi,
      ...advisory?.evidence.map((report) => report.description) ?? [],
      ...advisory?.evidence.map((report) => report.landmark) ?? [],
      advisory?.restriction?.title,
    ].filter(Boolean).join(' '))
    return haystack.includes(normalized) || words.every((word) => haystack.includes(word))
  })
}

function routePlaceIds(query: string): [string, string] | undefined {
  const parts = query.split(/\s+(?:to|→|–)\s+/i).map((part) => part.trim()).filter(Boolean)
  if (parts.length !== 2) return undefined
  const start = findPlaceId(parts[0])
  const end = findPlaceId(parts[1])
  return start && end ? [start, end] : undefined
}

function findPlaceId(value: string) {
  const needle = normalizeQuery(value)
  return PLACES.find((place) =>
    [place.id, place.name, place.nameHi].some((candidate) => normalizeQuery(candidate) === needle),
  )?.id
}

function normalizeQuery(value: string) {
  return value.toLocaleLowerCase().replace(/[.,]/g, ' ').replace(/\s+/g, ' ').trim()
}
