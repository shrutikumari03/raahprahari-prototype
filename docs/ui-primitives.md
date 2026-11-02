# UI Tokens and Primitive Usage (SH-02 / SH-03)

Shared tokens are defined in `src/styles.css`; shared primitives live in
`src/components/ui/`. Do not copy tokens or introduce parallel primitive
implementations.

## Tokens

- **Palette:** charcoal `#111719`, raised charcoal `#272A2D`, warm ivory
  `#E6E4DC`, orange `#EB5B38`, and blue `#347CCB`, with semantic variants
  declared for each theme.
- **Semantic CSS variables:** `--background`/`--surface`,
  `--card`/`--surface-raised`, `--foreground`/`--text`,
  `--muted-foreground`/`--text-muted`, `--border`, `--ring`/`--focus-ring`,
  `--action-info`, `--action-caution`, `--action-restricted`,
  `--status-unknown`, `--status-stale`, and `--status-closed`.
- **Positive status:** `--status-clear` is reserved for the recent, verified
  clear state. Unknown and stale use neutral grays; neither aliases the positive
  token. Status badges pair the state label with an icon.
- **Typography:** Inter is the body/form/safety-detail face; Oxanium is opt-in
  through `.font-display` for selected headings; JetBrains Mono is reserved for
  IDs. Google Fonts CSS uses `display=swap` and system fallbacks.
- **Spacing:** Tailwind's 4px base utility scale, declared by
  `--space-unit: 0.25rem` (`--spacing`).
- **Radius:** `--radius: 0.875rem` with Tailwind's derived small/medium/large
  radius values.
- **Elevation:** one subtle `--elevation-raised` / `shadow-rp-raised` token;
  prefer borders over larger shadows.
- **Viewport variants:** `360` (22.5rem), `390` (24.375rem), `768` (48rem),
  and `1440` (90rem), in addition to the existing responsive utility variants.
- **Layer scale:** base 0, sticky header 40, dialogs 50, toasts 60.
- **Motion:** `prefers-reduced-motion` disables nonessential animation and
  transitions.
- **Theme:** the default is `system`; the switch cycles system, light and dark.
  An override is stored under the existing `rp.theme` key, storage reads are
  guarded, and the head boot script applies the resolved theme before paint.

### Responsive verification

The live browser rendered `/`, `/check?view=map`, `/check?view=list`, `/report`
and the custom 404 at 360, 390 and 1440 CSS pixels. For each tested page,
`document.documentElement.scrollWidth` equaled `clientWidth` (345, 375 and
1425px respectively, with a vertical scrollbar present). Live browser captures
at 360/390 and 1440 showed the current layout fitting the viewport. The saved
mobile PNGs in `docs/audit-screenshots/` disagree and appear clipped; they are
not reliable proof of current mobile rendering until recaptured.

### Measured contrast

Ratios use the WCAG relative-luminance formula. Text pairs meet 4.5:1; solid UI
outlines/icons meet 3:1. Ratios are measured against the named base surface,
not translucent chip fills.

| Token | Light value / surface | Ratio | Dark value / surface | Ratio |
|---|---|---:|---|---:|
| Text on charcoal | `#E6E4DC` / `#111719` | 14.21:1 | `#E6E4DC` / `#111719` | 14.21:1 |
| Text on ivory | `#111719` / `#E6E4DC` | 14.21:1 | `#111719` / `#E6E4DC` | 14.21:1 |
| Orange action | `#B23A1F` / `#E6E4DC` | 4.69:1 | `#FF8766` / `#111719` | 7.68:1 |
| Blue action | `#245C98` / `#E6E4DC` | 5.39:1 | `#92C5FF` / `#111719` | 10.04:1 |
| Caution | `#A44200` / `#E6E4DC` | 4.91:1 | `#FFD166` / `#111719` | 12.55:1 |
| Restricted / closed | `#B4232F` / `#E6E4DC` | 5.12:1 | `#FF7474` / `#111719` | 6.90:1 |
| Unknown / stale | `#56616A` / `#E6E4DC` | 4.98:1 | `#C4CBD1` / `#111719` | 11.04:1 |
| Muted text | `#4B5558` / `#E6E4DC` | 6.02:1 | `#B7BCB9` / `#111719` | 9.40:1 |
| Focus ring / info blue | `#245C98` / `#E6E4DC` | 5.39:1 | `#92C5FF` / `#111719` | 10.04:1 |
| Border / input | `#757D7B` / `#E6E4DC` | 3.32:1 | `#758187` / `#272A2D` | 3.60:1 |
| Fresh verified clear icon/border | `#237547` / `#F8F6EF` | 5.24:1 | `#69D596` / `#272A2D` | 7.94:1 |

## Primitive examples

### Buttons and icon-only actions

```tsx
import { Button, IconButton } from '@/components/ui/button'
import { X } from 'lucide-react'

<Button type="submit">Save draft</Button>
<IconButton label="Close details" icon={<X />} variant="ghost" />
```

Icon-sized `Button` variants require an `aria-label` at the TypeScript boundary.
`IconButton` makes the accessible name required. All Button sizes have a 44px
minimum target.

### Labelled fields

```tsx
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

<Field label="Road name" description="Use the name shown on the route sign."
  error={roadNameError} required>
  <Input name="roadName" autoComplete="address-level3" />
</Field>

<Field label="What did you observe?">
  <Textarea name="observation" />
</Field>
```

`Field` renders a visible label and connects its helper/error IDs to Input,
Textarea and SelectTrigger using `aria-describedby`; an error also sets
`aria-invalid`. Use Radix Select inside the same Field wrapper.

### Tabs and dialog

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog'

<Tabs defaultValue="map">
  <TabsList aria-label="Advisory view">
    <TabsTrigger value="map">Map</TabsTrigger>
    <TabsTrigger value="list">List</TabsTrigger>
  </TabsList>
  <TabsContent value="map">Map view</TabsContent>
  <TabsContent value="list">List view</TabsContent>
</Tabs>

<Dialog>
  <DialogTrigger asChild><Button>Open details</Button></DialogTrigger>
  <DialogContent><DialogTitle>Road details</DialogTitle></DialogContent>
</Dialog>
```

Tabs and Dialog use Radix semantics, keyboard handling and focus management.
DialogContent must include a visible `DialogTitle`.

### Loading, error, empty and hidden text

```tsx
import { EmptyState, ErrorState, LoadingState, SkipLink, VisuallyHidden } from '@/components/ui/feedback'

<LoadingState label="Loading advisories" />
<ErrorState message="Advisories could not be loaded." onRetry={reload} />
<EmptyState title="No saved roads" message="Search for a route to save it."
  action={<Button asChild><a href="/check">Find a road</a></Button>} />
<VisuallyHidden>Decorative map illustration</VisuallyHidden>
<SkipLink href="#main">Skip to content</SkipLink>
```

LoadingState reserves space and announces politely; ErrorState announces the
failure and only renders retry when a retry handler is supplied; EmptyState
accepts explanatory next-step copy/action. SkipLink is mounted in the shared
root document.

### Tests and remaining validation

`primitives.test.tsx`, `controls.test.tsx` and `preferences.test.tsx` pass
(14 tests total), covering button keyboard/name/disabled behavior; field label,
helper and error relationships for Input/Select/Textarea; Select, Tabs,
Checkbox, Radio and Switch keyboard behavior; Dialog Escape/focus trap/focus
return; feedback announcements/actions; and theme preference persistence.
Full-page keyboard/screen-reader review is not covered by these unit tests.
