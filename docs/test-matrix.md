# SH-15 test matrix

| Scenario | Expected result | Test file | Status |
|---|---|---|---|
| Fresh, aging, stale, and timestamp-unknown synthetic advisories | Card and segment detail use the source timestamp for age; unknown/stale are not positive and do not say “Safe”; cache time is separate | `src/test/sh-15-advisory.test.tsx` | Implemented |
| Active official closure, including pending clearance | Closure remains visible on card/detail; pending clearance is explicit; no disclosure can collapse it | `src/test/sh-15-advisory.test.tsx` | Implemented |
| Community-only report plus synthetic score, reputation, and AI output | Community evidence cannot create a cleared/verified result or official restriction | `src/test/sh-15-advisory.test.tsx` | Implemented |
| Map provider failure on `/map` and `/traveller` | Provider error is simulated; list fallback and notice appear; selection, details, report CTA, and navigation remain usable | `src/test/sh-15-map-search-links.test.tsx` | Simulated |
| Traveller search: loading, results, no results, failure, location denied | Each state is displayed; manual search remains available after denial | `src/test/sh-15-map-search-links.test.tsx` | Implemented |
| Route links on all pages, including menu, footer, and bottom navigation | Every link resolves to a registered route or existing in-page target; no placeholder `#`; report CTAs target `/report` | `src/test/sh-15-map-search-links.test.tsx` | Implemented |
| Unknown, stale, and closed CSS status colors | Regression test rejects green-hued status token values | `src/test/sh-15-status-token.test.ts` | Implemented |
