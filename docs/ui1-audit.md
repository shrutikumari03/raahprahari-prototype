# UI-1 Audit (SH-01)

Audit scope: the RaahPrahari app at the repository root (`src/`), inspected
from source on 2026-11-02. The workspace also contains a nested `fixaura/`
Vite project; its relationship to this PWA is unconfirmed and it is not
included in the app findings below.

`design.md` does not exist. For this R1 audit, `PLAN.md` and `src/styles.css`
are the current implementation baseline; the approved mockups in
`docs/references/mockups/` are the visual target. The requested
`docs/reference/mockups/` path is absent; the workspace uses the plural
`references` directory. The folder contains PNG exports (not PDFs), with
duplicate copies of several exports.

## R1 implementation snapshot

- Git history has three relevant commits: the initial app baseline, `SH-01:
  UI audit`, and `UI-1: initial work before mockup theme change`. `main..HEAD`
  includes the report route, generated route tree, Vite configuration changes,
  and committed build output. This is a baseline summary, not a clean diff:
  the working tree already has uncommitted UI-1 changes.
- The uncommitted work includes the theme tokens, status badge, site chrome,
  home page and route-search updates; Button and form-control changes; shared
  field/feedback primitives; preference/i18n changes; tests; and audit docs
  and screenshots. Those existing changes are present in the workspace and
  were not created by this R1 audit.
- Existing user-facing routes include `/`, `/check` (search/results, map/list,
  and embedded segment detail), and `/report`. The report route is in the
  existing branch diff but belongs to Sudiksha; it is out of Shruti's page
  implementation scope. `/about`, `/help`, `/traveller`, `/map`, and
  `/advisories/:segmentId` are not currently mounted as dedicated routes.
- Shared UI already includes a responsive header with a Sheet menu, footer,
  theme/language controls, status badges, route search, route cards, a
  schematic map, embedded segment details, a report card, and accessible
  Radix/shadcn-style primitives. The map/list toggle and search-result view
  exist inside `/check`; there is no mobile bottom navigation or shared
  `AdvisoryCard`/freshness chip yet.
- The current token file already declares light and dark palettes and the
  requested Oxanium, Inter, JetBrains Mono and Devanagari fallback stacks.
  R1 makes no font changes. The theme is currently configured with orange as
  the generic primary action; the mockup brief instead calls for blue primary
  actions and orange hazard/report actions.

## Repository scan

- **Framework/router:** React 19, TanStack Start/Router, Vite 8; route files and
  generated route types live in `src/routes/` and `src/routeTree.gen.ts`.
- **Styling:** Tailwind CSS 4 utilities, `src/styles.css` custom properties,
  and shadcn-style Radix wrappers in `src/components/ui/`.
- **State:** React local state and `PreferencesContext`; preference/draft
  persistence uses guarded `localStorage` helpers. No client/server state
  library is configured.
- **Tests:** Vitest with JSDOM and Testing Library; tests cover router SSR,
  advisory rules, form controls, overlays, error pages, and an unmounted form
  example.
- **Shared data types/fixtures:** `src/lib/types.ts` is the domain-shape module;
  `src/data/fixtures.ts` is the synthetic data source and `src/lib/data.ts`
  computes advisory results. No shared server/client API contract module or
  live endpoint was found.
- **Assets/fonts:** `public/` contains the favicon and hero road image. Fonts
  are loaded from Google Fonts with system fallbacks; no self-hosted font files
  were found.
- **i18n/theme:** English and Hindi dictionaries in `src/i18n/dictionary.ts`;
  language/theme preferences are managed in `src/i18n/preferences.tsx`.
- **PWA:** No web manifest or service worker was found in the app source/assets;
  PWA installation/cache-sync behavior is unconfirmed and is listed as roadmap
  work.
- **Additional project:** A nested `fixaura/` package is present. It has a
  separate package manifest, but its relationship to this PWA is unconfirmed
  and it was not treated as a second UI implementation for this audit.

## Routes

| Route | Exists? | Status | Mobile state | Desktop state | Notes | Blocker + owner |
|---|---|---|---|---|---|---|
| `/` | Yes | Improve | Live browser inspected at 360/390; no document-level overflow. Saved mobile PNGs disagree with live rendering. | Live browser inspected at 1440; no document-level overflow. | Home includes route search and synthetic advisory content. Hero image transformation returned a local 404; whether this is dev-only is unconfirmed. | Investigate local image transform; UI-1 |
| `/traveller` | No | Missing | Not applicable | Not applicable | No file-based route found. | Traveller route/screen is not confirmed as in scope; UI-1 owns presentation, Sudiksha owns reporting/auth/client sync |
| `/map` | No | Missing | `/check?view=map` alias inspected at 360/390; no document-level overflow. Saved mobile PNG appears clipped and is not reliable evidence. | Alias inspected at 1440; no document-level overflow. | The schematic map is nested in `/check`; there is no standalone `/map` route. | Desired route alias unconfirmed; Backend owns map configuration |
| `/advisories` | No | Missing | `/check?view=list` inspected at 360/390; no document-level overflow. Saved mobile PNG appears clipped and is not reliable evidence. | Alias inspected at 1440; no document-level overflow. | Advisory list is nested in `/check`; there is no standalone `/advisories` route. | Desired route alias unconfirmed; UI-1 owns presentation |
| `/advisories/:segmentId` | No | Missing | Not applicable; embedded detail is not a route. | Not applicable; embedded detail is not a route. | Segment detail appears in the `/check` explorer through `seg` search state. | Desired route contract unconfirmed; Backend owns sanitized segment/advisory/history contract |
| `/about` | No | Missing | Not applicable; route is missing. | Not applicable; route is missing. | Header/footer links target this path, which resolves to the custom 404. | Content and route owner unconfirmed |
| `/contact` | No | Missing | Not applicable; no standalone route. | Not applicable; no standalone route. | Contact footer link targets an anchor on `/about`, which is missing. | Contact destination and owner unconfirmed |
| 404 | Yes | Keep | Live browser checked at 360/390; no document-level overflow. | Live browser checked at 1440; no document-level overflow. | Root route supplies a custom not-found page with a home action. | None identified |

### Screenshot inspection

Nine PNGs exist in `docs/audit-screenshots/` for home, map and advisory-list
views at 360, 390 and 1440px. The initial local server attempt failed (port
3000 returned HTTP 500); a working Vite server was later available at port
3002. The live browser visually rendered the home and map alias at 360/390 and
the list alias at 1440. Browser measurements also covered `/`, map/list aliases,
`/report` and a custom 404 at all three widths: `documentElement.scrollWidth`
equaled `clientWidth` at each width (345/375/1425px respectively, due to the
vertical scrollbar).

The saved mobile PNGs show content clipped at the right edge, unlike the live
browser rendering and measurements. A fresh capture attempt did not produce a
valid replacement, so those PNGs are retained as an unresolved capture
discrepancy, not as proof that the current mobile UI is clipped or correct.
The desktop captures visually match the live layout. A local 404 for the
home-page Netlify image transformation was observed; whether that is limited
to local development is unconfirmed.

Captures: [home 360](./audit-screenshots/home-360.png),
[home 390](./audit-screenshots/home-390.png),
[home 1440](./audit-screenshots/home-1440.png),
[map 360](./audit-screenshots/map-360.png),
[map 390](./audit-screenshots/map-390.png),
[map 1440](./audit-screenshots/map-1440.png),
[advisories 360](./audit-screenshots/advisories-360.png),
[advisories 390](./audit-screenshots/advisories-390.png),
[advisories 1440](./audit-screenshots/advisories-1440.png).

## Shared components and primitives

Responsive page checks cover the mounted shared chrome and route content; they
do not replace isolated primitive keyboard/ARIA tests or imply every component
was visually inspected in isolation.

| Component | Exists? | Status | Mobile state | Desktop state | Notes | Blocker + owner |
|---|---|---|---|---|---|---|
| AppShell | Yes, root document/layout | Keep | Rendered in mobile browser checks | Rendered in 1440px browser check | Composes preferences, global header/main/footer and toaster. | None identified |
| Header | Yes (`SiteHeader`) | Keep | Rendered at 360/390; mobile controls visible in live capture | Rendered at 1440 | Primary nav, report CTA, login mock and offline notice are mounted here. | None identified |
| MobileMenu | Yes (Radix Sheet) | Keep | Mounted; not opened during visual check | Not applicable | Sheet menu reuses site navigation; Radix supplies keyboard behavior. | None identified |
| Button | Yes | Keep | Keyboard tested; not captured in isolation | Keyboard tested; not captured in isolation | Button sizes now have a 44px minimum; icon-only sizes require an accessible label. | None identified |
| IconButton | Yes (`IconButton`) | Keep | Keyboard/name tested; not captured in isolation | Keyboard/name tested; not captured in isolation | Shared icon-only action wrapper requires a label. | None identified |
| Input | Yes | Keep | Field label/error relationships tested | Field label/error relationships tested | Use `Field` for visible labels, helper text, linked errors and `aria-invalid`. | None identified |
| Select | Yes (Radix) | Keep | Keyboard and Field relationships tested | Keyboard and Field relationships tested | Radix keyboard behavior plus shared Field descriptions/errors. | None identified |
| Textarea | Yes | Keep | Field label/error relationships tested | Field label/error relationships tested | Use `Field` for visible labels, helper text and linked errors. | None identified |
| Checkbox/Radio | Yes (Radix wrappers) | Keep | Keyboard/label tests pass; not visually checked in isolation | Same; not visually checked in isolation | Existing shared controls remain available; no additional workflow was added in this phase. | None identified |
| Tabs | Yes (Radix) | Keep | Arrow-key navigation tested | Arrow-key navigation tested | Radix supplies tab roles and arrow-key behavior. | None identified |
| Dialog | Yes (Radix) | Keep | Keyboard, Escape, focus trap/restore tested | Same behavior; not visually checked in isolation | Dialog requires a visible title and uses Radix focus management. | None identified |
| Loading/Error/Empty primitives | Yes (`feedback.tsx`) | Keep | ARIA announcement/retry/next-step tests | Same; not visually checked in isolation | Shared `LoadingState`, `ErrorState`, and `EmptyState` are available. | None identified |
| VisuallyHidden/SkipLink | Yes (`feedback.tsx`) | Keep | Skip-link and hidden-text semantics tested | Same; not visually checked in isolation | SkipLink is mounted in the shared root document. | None identified |
| Logo | Yes (inline SVG) | Keep | Rendered in mobile browser checks | Rendered at 1440 | Shared in site chrome; decorative when paired with its home-link label. | None identified |
| Footer | Yes (`SiteFooter`) | Keep | Present below page content; not scrolled into view | Rendered in desktop capture | Shared footer is mounted by the root document. | None identified |
| ActionBadge | Partial (`AdvisoryBadge`) | Improve | Rendered in synthetic advisory content | Rendered in list capture | Shared status badge has icon and text; no separately named action badge. | UI-1 |
| FreshnessChip | Partial (`StaleBadge`) | Improve | Rendered in synthetic advisory content | Rendered in list capture | Stale chip derives age from observation timestamps; no standalone freshness component. | UI-1 |
| EvidenceLabel | Partial | Improve | Not separately checked | Not separately checked | Source/status details are rendered in report/segment detail UI; no shared evidence-label primitive. | UI-1 |
| AdvisoryCard | No exact shared component | Improve | Not separately checked | Not separately checked | Route summaries use `RouteCard`; no shared `AdvisoryCard` symbol was found. Do not duplicate it. | UI-1 owns shared presentation; backend contract remains a dependency |
| SegmentSearch | Partial (`RouteSearchCard`, `PlaceInput`) | Improve | Rendered in map alias capture | Rendered in list alias capture | Search is place/route based and backed by seeded route data; no `SegmentSearch` component. | UI-1 |
| SegmentMap | Partial (`SchematicMap`) | Improve | Rendered in map alias; schematic, not live | Rendered in map alias; schematic, not live | No live map integration. | Backend owns map configuration |
| SegmentList | Partial, inline in `/check` | Improve | Rendered in list alias; separate detail not checked | Rendered in list capture | List/filter is part of `/check`, not a standalone shared component. | UI-1 |
| SegmentDetail | Yes | Keep | Embedded detail not separately checked | Embedded detail not separately checked | Detail separates observed condition, recommended action, official restriction and evidence. | None identified |
| PrototypeRibbon | Partial (`DemoBadge`) | Improve | Badge rendered; not a persistent ribbon | Badge rendered; not a persistent ribbon | Copy says “Prototype mockup — synthetic data”. | UI-1 |
| OfflineBanner | Partial, inline in header | Improve | Mounted; live/offline state not toggled | Mounted; live/offline state not toggled | Status notice is in `SiteHeader`, not a standalone banner. Ownership allocation assigns OfflineBanner to Sudiksha. | Sudiksha owns the shared offline workflow |
| Auth slot | Yes, login dialog mock | Improve | Mock dialog not separately checked | Mock dialog not separately checked | No auth service is present. | Sudiksha owns auth; backend must enforce permissions |

## Baseline and findings

### Tokens vs. current mockup brief

- Implemented in `src/styles.css`: charcoal/ivory/orange/blue palettes with
  semantic light/dark variants, text/action/status tokens, focus and border
  tokens, spacing/radius/elevation/layer scales, and 360/390/768/1440 viewport
  targets. Ratios and token usage are documented in
  [`ui-primitives.md`](./ui-primitives.md).
- Oxanium is opt-in for selected display headings; Inter is the body/form/safety
  face and JetBrains Mono is reserved for IDs. Fonts use Google Fonts with
  `display=swap` and system fallbacks, not self-hosted assets.
- `prefers-reduced-motion` is respected. Theme defaults to the system setting,
  supports manual light/dark/system selection, and persists through guarded
  storage plus a prepaint script.
- `--status-clear` is reserved for a recent verified clear state. Unknown and
  stale remain neutral; there is no generic green/safe token for either state.

### Accessibility and safety checks

- Present: skip-to-main, header/nav/main/footer landmarks, translated nav
  labels, visible global focus styles, Radix dialog/select/tabs/checkbox/radio,
  and a custom 404. Buttons enforce 44px minimum targets; `Field` links visible
  labels, helper/error text and invalid state.
- Primitive tests cover button keyboard/name/disabled behavior; field/input/
  select/textarea ARIA; tab arrow keys; dialog Escape, focus trap and restore;
  and feedback/hidden/skip semantics. These tests do not establish full-page
  keyboard or screen-reader conformance.
- Live browser viewport checks found no document-level horizontal overflow at
  360, 390 or 1440px on home, map/list aliases, report and custom 404. Saved
  mobile screenshots disagree with live rendering, so visual confidence in
  those PNGs remains unconfirmed. Contrast measurements are documented, but
  translucent component fills were not exhaustively audited.
- Information age is formatted from report observation/published timestamps
  relative to the synthetic `DEMO_NOW`; the literal “25 minutes ago” was not
  found. No distinct cache timestamp/age is modeled.
- “Received by server” translation keys exist, but no endpoint/server mutation
  was found. Fixtures and report-flow UI are synthetic; server receipt must not
  be inferred from those labels. The report route explicitly distinguishes
  a locally saved draft from server receipt.
- Fixture records are marked synthetic. No fabricated external partner,
  endorsement or impact-stat claims were found. Google Fonts URLs and the
  Netlify image transformation path are infrastructure/resource references,
  not partnership claims. `docs/forms.md` shows `/api/contact` as a clearly
  labelled example only, not an available endpoint.
- Advisory state is centralized in `src/lib/advisory.ts`; `clear` is returned
  only for a recent verified clear observation. Unknown is explicitly
  documented as never green. Official restrictions take precedence over
  community evidence; review-time passage alone does not clear a restriction.
- No shared `AdvisoryCard` copy was found in the main app source. The main app
  defines theme tokens in `src/styles.css`; a nested `fixaura/` project exists,
  but whether it is part of this PWA or should share tokens is unconfirmed.
- No literal “25 minutes ago” freshness string was found; relative age uses
  synthetic source timestamps. Cache time is not modeled separately. A local
  home hero image-transformation request returned 404; local-dev-only behavior
  is unconfirmed.

## Mockup gap audit

The table covers each distinct screen in `docs/references/mockups/`. Files
whose names end in `- Copy` are byte-identical copies of the corresponding
PNG and are represented in the same row. The listed screen filename is the
representative export. “Exists?” describes the current app, not the presence
of the image.

| Mockup screen | Maps to route/component | Owner (Shruti/Sudiksha/Vanshika) | Exists? | Gap vs mockup | Action (Keep/Restyle/Build/Not mine) |
|---|---|---|---|---|---|
| `RaahPrahari Mountain Road Advisory` (Home) | `/` — hero, sample advisory, feature strip | Shruti | Partial | Home/search exist, but layout and header do not follow the approved hero composition; page-wide prototype label is missing. Feature claims must remain synthetic and must not imply offline capability. | Restyle |
| `Mountain Travel Safety Help Centre` | Proposed `/help` or `/about` | Shruti | No | No help/about route exists. Preserve the useful safety guidance, but replace “safe” phrasing with neutral, evidence-aware copy. | Build — route choice needs approval |
| `Mountain Road Safety Login Interface` | Login / shared auth primitives | Sudiksha (theme/shared UI only) | Partial | Header login dialog only; no login page. | Not mine |
| `RaahPrahari Safer Roads Registration UI` | Register / shared auth primitives | Sudiksha (theme/shared UI only) | No | No registration page. | Not mine |
| `Mountain Traveler Dashboard Profile` | Profile / shared cards and badges | Sudiksha (theme/shared UI only) | No | No profile page. Any displayed activity must be labeled synthetic, not real usage statistics. | Not mine |
| `RaahPrahari Outdoor Safety Settings` | Settings / shared controls | Sudiksha (theme/shared UI only) | No | No settings page; theme token update should keep controls reusable. | Not mine |
| `RaahPrahari Himalayan Road Map` (road-search landing) | `/traveller` — search and map/list toggle | Shruti | Partial | `/check` has route search and map/list views, but no dedicated `/traveller` landing or mockup layout. Mobile must stack the map and search/list content. | Build |
| `RaahPrahari Himalayan Route Dashboard` (search results) | `/traveller` — results and map/list toggle | Shruti | Partial | `/check` shows route/segment results, but result rows need an action badge, freshness chip and source consistently. Do not copy fixed ages or imply no-match means safe. | Restyle |
| `RaahPrahari Mountain Road Hazard Dashboard` (selected segment map) | `/map` — map, legend and selected-segment panel | Shruti | Partial | `SchematicMap` and `SegmentDetail` exist only in `/check`; the map is schematic and markers/legend need consistent triangle (reported hazard), shield (official restriction), and question-mark (unknown) shapes/labels. No `/map` route. | Build |
| `RaahPrahari_ Safer Himalayan Journeys` (NH 3 route detail) | `/advisories/:segmentId` — route overview and map | Shruti | Partial | Segment detail is embedded rather than a route page. Replace fixed 2025 dates, “Recent” chip and “Verified by community contributors”; freshness must derive from source timestamps. | Build |
| `RaahPrahari Mountain Road Hazard Dashboard (1)` (reported debris detail) | Advisory/evidence detail using shared `AdvisoryCard` | Shruti (shared with Vanshika) | Partial | Evidence is shown in embedded `ReportCard`/`SegmentDetail`; no shared `AdvisoryCard`. Status history must say “AI-assisted indication, not an official closure”; a report or AI score cannot create an official closure. | Build |
| `RaahPrahari Himalayan Route Comparison Dashboard` | Proposed `/traveller/compare` | Shruti | Partial | Route cards expose a compare action but there is no comparison page. Keep comparisons neutral: counts, official restrictions, evidence freshness and coverage side by side; never rank/recommend a safer route. | Build — optional route needs approval |
| `RaahPrahari Mountain Hazard Dashboard` (All Reports) | All Reports / reports list | Sudiksha (theme/shared UI only) | No | `/check` is the road-advisory explorer, not an all-reports workspace. | Not mine |
| `RaahPrahari Mountain Reports Dashboard` (My Reports) | My Reports / report cards | Sudiksha (theme/shared UI only) | No | No personal-report dashboard; activity totals in the mockup must be labeled synthetic. | Not mine |
| `RaahPrahari Road Hazard Report Dashboard` (report observation step) | Report flow / shared fields and cards | Sudiksha (theme/shared UI only) | Yes | A report route/flow exists in the branch; any page-level mockup alignment belongs to Sudiksha. | Not mine |
| `RaahPrahari Himalayan Location Dashboard` (report location step) | Report flow / map and location controls | Sudiksha (theme/shared UI only) | Partial | The report flow exists, but this is an owned workflow screen; provide only reusable shared UI/theme changes. | Not mine |
| `RaahPrahari Mountain Photo Evidence Dashboard` (report review/evidence step) | Report flow / evidence components | Sudiksha (theme/shared UI only) | Partial | The report flow exists, but evidence workflow is not Shruti-owned. | Not mine |
| `RaahPrahari Report Received in the Mountains` | Report received state | Sudiksha (theme/shared UI only) | Partial | No separate received route; synthetic UI must not imply a real server receipt. | Not mine |
| `Mountain Road Report Update Dashboard` | Report update | Sudiksha (theme/shared UI only) | No | No update screen. | Not mine |
| `RaahPrahari Mountain Clearance Dashboard` | Clearance update / official decision | Sudiksha (theme/shared UI only) | No | No clearance workflow screen; clearance requires an approved process and unresolved clearance must say “Awaiting clearance verification.” | Not mine |
| `Offline Reports Sync Dashboard` | Offline sync | Sudiksha (theme/shared UI only) | No | No offline-sync workflow or capability exists. Shared styling must not claim “Offline-Aware Access.” | Not mine |
| `RaahPrahari Hazard Report Dashboard` (report progress) | Report progress | Sudiksha (theme/shared UI only) | No | No dedicated progress screen; Received/Reviewed must not be presented as Verified. | Not mine |
| `RaahPrahari Hazard Review Dashboard` (review queue) | Review queue / reviewer list | Vanshika (theme/shared UI only) | No | No reviewer queue page. | Not mine |
| `RaahPrahari Landslide Review Dashboard` (report review/send step) | Report flow / review and send | Sudiksha (theme/shared UI only) | Partial | This is the traveller's final report step, not a reviewer screen; workflow ownership remains with Sudiksha. | Not mine |
| `Mountain Road Hazard Report Review` | Review report / evidence review | Vanshika (theme/shared UI only) | No | No review-report page. The duplicate `- Copy` export is identical. | Not mine |
| `RaahPrahari Mountain Safety Dashboard` | Reviewer workspace dashboard | Vanshika (theme/shared UI only) | No | No reviewer workspace. | Not mine |
| `RaahPrahari Mountain Hazard Dashboard (1)` (AI assessment) | AI assessment | Vanshika (theme/shared UI only) | No | No AI assessment page. AI output must remain advisory, explain uncertainty, and never create official closure. | Not mine |
| `RaahPrahari Mountain Road Assessment Dashboard` | AI assessment variant | Vanshika (theme/shared UI only) | No | No assessment page; use the shared theme only, not a new AI workflow. | Not mine |
| `RaahPrahari Official Road Restrictions Dashboard` | Official restrictions | Vanshika (theme/shared UI only) | No | No official-restrictions workspace; keep the official shield shape/label distinct from reported-hazard triangles. | Not mine |
| `RaahPrahari Connectivity Coverage Dashboard` | Connectivity coverage (proposed feature) | Vanshika (theme/shared UI only) | No | No coverage page or real connectivity coverage data. This is explicitly a proposed feature. | Not mine |

### Token and component changes required for R2

No visual changes are made in R1. For R2, preserve the current font stacks
exactly and update the shared palette/layout around these tokens and surfaces:

- **Tokens / `src/styles.css`:** make the deep charcoal-navy theme the default;
  darken and blue-shift the page/card surfaces, keep raised surfaces subtly
  lighter with quiet borders, retain 12–16px card radii, set blue as primary
  action and orange as report/hazard action, and retain an ivory-surface light
  theme. Keep unknown/stale neutral; do not introduce a green “all clear.”
- **Shared status / `src/components/advisory.tsx`:** retain icon + text pills;
  add a reusable ActionBadge and timestamp-derived FreshnessChip; distinguish
  official restrictions with shield + label and reported hazards with triangle
  + label. Clearance labels must distinguish verified process outcomes from
  pending verification.
- **Shared shell / `src/components/site-chrome.tsx`,
  `src/routes/__root.tsx`:** align logo/header/footer with the mockup shell,
  add a small-screen bottom navigation while keeping the desktop/mobile menu,
  keep map/list navigation, and ensure the exact “Prototype mockup, synthetic
  data” label is present on every route.
- **Shared cards and controls / `src/components/ui/card.tsx`,
  `src/components/ui/button.tsx`, `src/components/ui/input.tsx`,
  `src/components/ui/select.tsx`, `src/components/ui/field.tsx`:** tune shared
  surface, radius, border, focus, and button-role variants without changing
  the public props or accessibility behavior.
- **Advisory/map components / `src/features/routes/schematic-map.tsx`,
  `src/features/routes/segment-detail.tsx`,
  `src/features/routes/route-card.tsx`, and new shared `AdvisoryCard`:** match
  the map/list panel proportions and consistent marker/legend shapes; build
  evidence/freshness/source presentation for the owned traveller routes. Any
  mountain/road imagery must be licensed or generated, optimized, and have
  appropriate alt text.
- **Owned route presentation / `src/routes/index.tsx`,
  `src/routes/check.tsx`, `src/features/routes/route-search.tsx`,
  `src/i18n/dictionary.ts`, and new route files:** restyle Home and `/check`,
  then add only Shruti-owned route surfaces after the route choices below are
  confirmed. Update translations for safety terminology and the prototype
  label.

**Cross-owner risk:** changing token values and visual defaults in
`styles.css`, shared cards/buttons/fields, status badges, `SiteHeader`, the root
shell, and the shared map/advisory components can alter Sudiksha's report/auth/
profile/settings screens and Vanshika's review/AI/official screens. Preserve
component APIs, keep behavioral changes out of those screens, and validate
their shared controls against the existing tests. The committed report route
is not an invitation to take over its workflow.

### Prioritized R2 plan

1. **Confirm route scope**: choose `/help` or `/about` for Help & Safety Centre;
   decide whether `/traveller/compare` is in scope. Connectivity coverage stays
   a Vanshika-proposed feature, not an implementation item here.
2. **Restyle shared foundations first**: dark-first/light theme tokens,
   accessible action/status/freshness badges, shared card/control surfaces,
   header/footer/mobile navigation, per-screen prototype label, and
   safety-correct copy. Keep all four configured font stacks unchanged.
3. **Restyle and route Shruti-owned screens**: Home; road-search landing and
   results; `/map`; segment detail; hazard/evidence detail; About/Contact/Help
   and 404. Preserve the map/list toggle and use generated/licensed image
   assets with responsive sizing and alt text.
4. **Responsive and safety verification**: validate 360/390/768/1440 layouts,
   stack columns, collapse sidebars, and use mobile bottom navigation. Test
   freshness from source timestamps with deterministic fixtures/clock, icon
   and label semantics, route comparison neutrality, image loading, and
   existing shared primitive behavior. Do not modify the other owners' pages.

### Backend contract status

| Contract surface | Status | Evidence / dependency |
|---|---|---|
| Segment endpoint | Blocked | Segment types and records exist in `src/lib/types.ts` and `src/data/fixtures.ts`; no segment endpoint/loader was found. Backend owns the sanitized segment contract. |
| Advisory endpoint | Blocked | `src/lib/data.ts` computes advisory states from in-memory fixtures; no server endpoint was found. Backend owns the sanitized advisory contract. |
| History endpoint | Blocked | Evidence/history is read from synthetic fixture reports; no history endpoint was found. Backend owns the sanitized history contract. |
| Seed records | Mocked | Seed places, corridors, segments, reports and restrictions are explicitly synthetic in `src/data/fixtures.ts`. |
| Map configuration | Mocked | Bounds and schematic geometry are local fixture data; no backend-provided map configuration or live map integration was found. Backend owns map configuration. |

## Prioritized plan

1. **Route contract:** confirm whether `/map`, `/advisories`,
   `/advisories/:segmentId`, `/traveller`, `/about` and `/contact` are required
   paths before adding or changing routes; route/content owners are unconfirmed.
2. **Backend contract:** backend supplies sanitized segment/advisory/history
   data and map config. Keep current synthetic fixtures clearly labelled.
3. **Screenshot discrepancy:** regenerate trustworthy mobile PNGs and determine
   why saved captures differ from live browser output; do not infer a layout
   defect from the stale captures.
4. **Local image:** determine whether the home hero transformation 404 is a
   local-dev limitation or requires a UI-owned asset-path fix.
5. **Ownership:** Sudiksha owns auth, reporting/client sync and OfflineBanner;
   content/destination ownership for About/Contact remains unconfirmed.
