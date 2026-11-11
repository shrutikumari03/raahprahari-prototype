# SH-15 test matrix

| Scenario | Expected result | Test file | Status |
|---|---|---|---|
| Fresh, aging, stale, and timestamp-unknown synthetic advisories | Card and segment detail use the source timestamp for age; unknown/stale are not positive and do not say “Safe”; cache time is separate | `src/test/sh-15-advisory.test.tsx` | Implemented |
| Active official closure, including pending clearance | Closure remains visible on card/detail; pending clearance is explicit; no disclosure can collapse it | `src/test/sh-15-advisory.test.tsx` | Implemented |
| Community-only report plus synthetic score, reputation, and AI output | Community evidence cannot create a cleared/verified result or official restriction | `src/test/sh-15-advisory.test.tsx` | Implemented |
| Map provider failure on `/map`, `/traveller` and `/advisories/:id` | Real Leaflet map requests OpenStreetMap tiles; the test fails every tile (≥ `TILE_FAILURE_THRESHOLD`, none loaded); the list fallback and notice appear automatically; selection, details, report CTA and navigation stay usable. Going offline triggers the same fallback | `src/test/sh-15-map-search-links.test.tsx`, `src/test/map-sync.test.tsx`, `src/features/map/leaflet-segment-map.test.tsx` | Simulated (tile `error` events in jsdom) |
| Traveller search: loading, results, no results, failure, location denied | Each state is displayed; manual search remains available after denial | `src/test/sh-15-map-search-links.test.tsx`, `src/test/traveller-search.test.tsx` | Implemented |
| Route links on all pages, including menu, footer, and bottom navigation | Every link resolves to a registered route or existing in-page target; no placeholder `#`; report CTAs target `/report` | `src/test/sh-15-map-search-links.test.tsx` | Implemented |
| Unknown, stale, and closed CSS status colors | Regression test rejects green-hued status token values | `src/test/sh-15-status-token.test.ts` | Implemented |

## Interactive map (Leaflet + OpenStreetMap)

Segment lines are approximate, synthetic data generated in `src/data/fixtures.ts` between the two places of each segment. They are not surveyed road alignments.

| Scenario | Expected result | Test file | Status |
|---|---|---|---|
| Segment geometry | Every segment has a polyline that starts and ends at its places and stays inside the coverage area | `src/test/map-geometry.test.ts` | Implemented |
| Unknown / stale never green | No seeded segment is drawn as clear; stale and no-evidence segments are grey, dashed, with a question-mark marker and no hazard triangle; a community clear report is unknown on the map | `src/test/map-geometry.test.ts`, `src/features/map/leaflet-segment-map.test.tsx` | Implemented |
| Official closure always visible | The closure is drawn on every map (even outside the search or focus), on top, never dimmed, with a shield marker named “Official closure” | `src/test/map-geometry.test.ts`, `src/features/map/leaflet-segment-map.test.tsx`, `src/test/map-sync.test.tsx` | Implemented |
| Markers and legend | Triangle = reported hazard, shield = official restriction, question mark = unknown; each marker has a text name and the legend pairs every icon with text | `src/features/map/leaflet-segment-map.test.tsx`, `src/test/map-sync.test.tsx` | Implemented |
| Attribution and labels | “© OpenStreetMap contributors”, “Prototype mockup, synthetic data” and “Road lines: approximate, synthetic data” are shown | `src/features/map/leaflet-segment-map.test.tsx`, `src/test/map-sync.test.tsx`, `src/test/map-ssr.test.tsx` | Implemented |
| Selection sync `/map` | Marker or line click selects the segment; detail panel, list and URL `seg` follow; list selection carries back to the map | `src/test/map-sync.test.tsx` | Implemented |
| Selection sync `/traveller` | Marker click highlights the result row and the selected-section panel; “Show on map” selects on the map | `src/test/map-sync.test.tsx` | Implemented |
| Selection on `/advisories/:id` | The segment is selected; choosing another section opens its detail page | `src/test/map-sync.test.tsx` | Implemented |
| Keyboard | Map container is focusable (arrow keys pan, +/− zoom); markers are focusable buttons selected with Enter; Zoom in/out, Reset view and Show my location are buttons | `src/features/map/leaflet-segment-map.test.tsx`, `src/test/map-sync.test.tsx` | Implemented (arrow-key panning is Leaflet’s built-in handler; verified manually, not in jsdom) |
| Locate | Asks the browser for permission; allowed centres the map on you; denied, unavailable and outside coverage leave the map unchanged with a message | `src/features/map/leaflet-segment-map.test.tsx` | Implemented |
| Client-only Leaflet (no SSR crash) | `/map`, `/traveller` and `/advisories/:id` render on the server without `window`; no Leaflet DOM in server HTML | `src/test/map-ssr.test.tsx` | Implemented |

jsdom has no layout, so map tests give elements a size (`clientWidth`/`clientHeight`) so that Leaflet computes a viewport and requests tiles. Real tile loading, map rendering and keyboard panning were checked in a browser, not in the automated suite.
