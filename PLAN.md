# RaahPrahari — Build Plan

1. **Done** — Design system (dark/light tokens, Oxanium/Inter/JetBrains Mono/Noto Sans Devanagari), header with EN/हिन्दी and theme switch, footer, offline banner.
2. **Done** — Synthetic data: 38 places, 14 corridors, 31 reports (conflicts, duplicates, rejected, stale), 3 official restrictions incl. pending clearance (`src/data/fixtures.ts`).
3. **Done** — Pure advisory rules plus unit tests (`src/lib/advisory.ts`).
4. **Done** — Home page with hero image, FROM/TO search, sample advisory and the sections below it.
5. **Done** — `/check`: route results (sort, save, compare), schematic map/list, filters, section detail panel.
6. **Built, not yet mounted** — 4-step report flow component (`src/features/reports/report-flow.tsx`). Next step: add `src/routes/report.tsx` that renders `<ReportFlow initialSegment={search.segment} />`.
7. **Todo** — `/about` page (with privacy/terms/accessibility/contact anchors; footer already links there).
8. **Todo** — Traveller dashboard: My Reports (Active/Reviewed/Drafts), report progress, follow-ups, saved roads, notifications, settings, offline queue.
9. **Todo** — Reviewer workspace with decisions, reasons, history and a read-only AI assessment panel.
10. **Todo** — Official workspace (restrictions CRUD, audit, clearance verification) and Admin workspace.
11. **Todo** — Demo login/signup with role test accounts; later real auth with server-enforced roles.
12. **Todo** — PWA manifest, service worker, last-sync time, Sync Now.
13. **Todo** — Real persistence and server-side routing behind `RoutingProvider`.
