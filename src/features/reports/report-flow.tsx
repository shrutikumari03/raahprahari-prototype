import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  Camera,
  Check,
  CircleCheck,
  CircleDashed,
  CircleX,
  ImageOff,
  ImagePlus,
  LocateFixed,
  LoaderCircle,
  MapPin,
  Pencil,
  RotateCcw,
  Save,
  Send,
  ShieldAlert,
  Trash,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DemoBadge, RoadCode } from '@/components/advisory'
import { placeById, segmentById } from '@/data/fixtures'
import { PlaceInput } from '@/features/routes/place-input'
import { SchematicMap } from '@/features/routes/schematic-map'
import { useOnline } from '@/components/site-chrome'
import { usePrefs } from '@/i18n/preferences'
import { getCurrentPosition, inCoverage, nearbySegments } from '@/lib/geo'
import { STORAGE_KEYS, readLocal, writeLocal } from '@/lib/storage'
import type { HazardType, Severity } from '@/lib/types'
import { cn } from '@/lib/utils'

export const HAZARD_TYPES: HazardType[] = [
  'landslide',
  'rockfall',
  'flooding',
  'road_block',
  'fallen_tree',
  'damaged_bridge',
  'road_damage',
  'snow_ice',
  'poor_visibility',
  'accident',
  'other',
]
const SEVERITIES: Severity[] = ['low', 'moderate', 'high']
const MAX_PHOTOS = 4
const MAX_BYTES = 10 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

interface ReportLocation {
  method: 'search' | 'pin' | 'gps' | 'segment'
  lat: number
  lon: number
  accuracyM?: number
  placeId?: string
  /** null when the reporter is unsure which nearby section it was */
  segmentId: string | null
  candidates: string[]
  landmark: string
  confirmed: boolean
}

interface Draft {
  step: 1 | 2 | 3 | 4
  hazardType: HazardType | null
  description: string
  observedAt: string
  severity: Severity | null
  location: ReportLocation | null
  savedAt?: number
}

type Delivery = 'saved' | 'queued' | 'uploading' | 'received' | 'review' | 'failed'

interface LocalReport {
  ref: string
  draft: Draft
  photoCount: number
  delivery: Delivery
  createdAt: number
  simulated: true
}

interface Photo {
  id: string
  file: File
  url: string
}

const pad = (n: number) => String(n).padStart(2, '0')
const toLocalInput = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`

const observationSchema = z.object({
  hazardType: z.enum(HAZARD_TYPES as [HazardType, ...HazardType[]], { message: 'report.typeErr' }),
  description: z.string().trim().min(10, 'report.descErr').max(500, 'report.descErr'),
  observedAt: z.string().refine((v) => {
    const ts = new Date(v).getTime()
    return !Number.isNaN(ts) && ts <= Date.now() + 5 * 60_000 && Date.now() - ts <= 72 * 3600_000
  }, 'report.whenErr'),
  severity: z.enum(['low', 'moderate', 'high'], { message: 'report.sevErr' }),
})

const emptyDraft = (): Draft => ({
  step: 1,
  hazardType: null,
  description: '',
  observedAt: '',
  severity: null,
  location: null,
})

const demoRef = (seed: string) => {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  return `RP-${String((Math.abs(h) % 900000) + 100000)}`
}

function locationForSegment(segmentId: string): ReportLocation | null {
  const s = segmentById(segmentId)
  if (!s) return null
  const a = placeById(s.from)!
  const b = placeById(s.to)!
  return {
    method: 'segment',
    lat: (a.lat + b.lat) / 2,
    lon: (a.lon + b.lon) / 2,
    segmentId,
    candidates: [segmentId],
    landmark: '',
    confirmed: false,
  }
}

export function ReportFlow({ initialSegment }: { initialSegment?: string }) {
  const { t } = usePrefs()
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<LocalReport | null>(null)
  const [discardOpen, setDiscardOpen] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Restore a saved draft, otherwise start fresh with "now" as the observation time.
  useEffect(() => {
    const saved = readLocal<Draft | null>(STORAGE_KEYS.reportDraft, null)
    if (saved) {
      setDraft(saved)
      toast(t('report.draftRestored'))
    } else {
      setDraft((d) => ({
        ...d,
        observedAt: toLocalInput(new Date()),
        location: initialSegment ? locationForSegment(initialSegment) : null,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), [photos])

  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }))
  const goTo = (step: Draft['step']) => {
    update({ step })
    requestAnimationFrame(() => {
      headingRef.current?.focus()
      headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const saveDraft = () => {
    const d = { ...draft, savedAt: Date.now() }
    setDraft(d)
    writeLocal(STORAGE_KEYS.reportDraft, d)
    toast.success(t('report.draftSaved'), { description: photos.length ? t('report.photoDraftNote') : undefined })
  }

  const discard = () => {
    writeLocal(STORAGE_KEYS.reportDraft, null)
    setDraft({ ...emptyDraft(), observedAt: toLocalInput(new Date()) })
    setPhotos([])
    setErrors({})
    setDiscardOpen(false)
  }

  const validateStep1 = () => {
    const res = observationSchema.safeParse(draft)
    if (res.success) {
      setErrors({})
      return true
    }
    const e: Record<string, string> = {}
    for (const issue of res.error.issues) e[String(issue.path[0])] = issue.message
    setErrors(e)
    return false
  }

  const submit = (report: LocalReport) => {
    writeLocal(STORAGE_KEYS.reportDraft, null)
    setSubmitted(report)
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  if (submitted) {
    return (
      <Submission
        report={submitted}
        onAnother={() => {
          setSubmitted(null)
          setPhotos([])
          setDraft({ ...emptyDraft(), observedAt: toLocalInput(new Date()) })
        }}
      />
    )
  }

  const steps = [t('report.step1'), t('report.step2'), t('report.step3'), t('report.step4')]

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1">
          {steps.map((label, i) => {
            const n = (i + 1) as Draft['step']
            const done = n < draft.step
            const current = n === draft.step
            return (
              <li key={label} className="shrink-0">
                <button
                  type="button"
                  disabled={n > draft.step}
                  onClick={() => goTo(n)}
                  aria-current={current ? 'step' : undefined}
                  className={cn(
                    'flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm',
                    current ? 'bg-raised font-semibold' : 'text-muted-foreground',
                    n > draft.step && 'opacity-60',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs',
                      current && 'border-brand-orange bg-brand-orange text-[#111719]',
                      done && 'border-foreground/40',
                    )}
                  >
                    {done ? <Check className="size-3.5" aria-hidden /> : n}
                  </span>
                  {label}
                </button>
              </li>
            )
          })}
        </ol>
        {draft.savedAt && (
          <div className="mt-4 hidden rounded-xl border border-border p-3 text-xs text-muted-foreground lg:block">
            <p>{t('report.draftSaved')}</p>
            <Button variant="ghost" size="sm" className="mt-1 h-9 px-2 text-muted-foreground" onClick={() => setDiscardOpen(true)}>
              <Trash />
              {t('report.discard')}
            </Button>
          </div>
        )}
      </aside>

      <div className="min-w-0 rounded-2xl border border-border bg-card p-5 sm:p-7">
        <p className="font-mono text-xs text-muted-foreground">
          {t('report.step')} {draft.step} {t('report.of')} 4
        </p>
        <h2 ref={headingRef} tabIndex={-1} className="mt-1 scroll-mt-24 font-display text-2xl font-semibold outline-none">
          {steps[draft.step - 1]}
        </h2>

        <div className="mt-4 flex gap-3 rounded-xl border border-status-caution/60 bg-status-caution/10 p-3.5 text-sm">
          <ShieldAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-status-caution" />
          <p className="font-medium">{t('report.safety')}</p>
        </div>

        <div className="mt-6">
          {draft.step === 1 && <StepObservation draft={draft} update={update} errors={errors} />}
          {draft.step === 2 && <StepEvidence photos={photos} setPhotos={setPhotos} />}
          {draft.step === 3 && (
            <StepLocation
              location={draft.location}
              setLocation={(location) => update({ location })}
              error={errors.location}
            />
          )}
          {draft.step === 4 && <StepReview draft={draft} photos={photos} goTo={goTo} onSubmit={submit} />}
        </div>

        {draft.step < 4 && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <div className="flex gap-2">
              {draft.step > 1 && (
                <Button variant="ghost" className="h-11 rounded-xl" onClick={() => goTo((draft.step - 1) as Draft['step'])}>
                  {t('report.back')}
                </Button>
              )}
              <Button variant="outline" className="h-11 rounded-xl" onClick={saveDraft}>
                <Save />
                {t('report.saveDraft')}
              </Button>
            </div>
            <Button
              className="h-11 rounded-xl px-6 font-semibold"
              onClick={() => {
                if (draft.step === 1 && !validateStep1()) return
                if (draft.step === 3 && !draft.location?.confirmed) {
                  setErrors({ location: 'report.locErr' })
                  return
                }
                setErrors({})
                goTo((draft.step + 1) as Draft['step'])
              }}
            >
              {t('report.continue')}
            </Button>
          </div>
        )}
        {draft.savedAt && (
          <Button variant="ghost" size="sm" className="mt-3 h-9 px-2 text-muted-foreground lg:hidden" onClick={() => setDiscardOpen(true)}>
            <Trash />
            {t('report.discard')}
          </Button>
        )}
      </div>

      <Dialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('report.discard')}?</DialogTitle>
            <DialogDescription>{t('report.draftSaved')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t('report.back')}</Button>
            </DialogClose>
            <Button variant="destructive" onClick={discard}>
              <Trash />
              {t('report.discard')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  const { t } = usePrefs()
  if (!msg) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-status-dnt">
      {t(msg as 'report.typeErr')}
    </p>
  )
}

function StepObservation({
  draft,
  update,
  errors,
}: {
  draft: Draft
  update: (p: Partial<Draft>) => void
  errors: Record<string, string>
}) {
  const { t } = usePrefs()
  return (
    <div className="space-y-7">
      <fieldset aria-describedby={errors.hazardType ? 'err-type' : undefined}>
        <legend className="mb-3 font-semibold">{t('report.type')}</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
          {HAZARD_TYPES.map((h) => (
            <label
              key={h}
              className={cn(
                'flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl border px-3 text-sm transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-ring',
                draft.hazardType === h ? 'border-brand-orange bg-brand-orange/10 font-semibold' : 'border-border hover:bg-accent',
              )}
            >
              <input
                type="radio"
                name="hazardType"
                value={h}
                checked={draft.hazardType === h}
                onChange={() => update({ hazardType: h })}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn('size-3.5 shrink-0 rounded-full border-2', draft.hazardType === h ? 'border-brand-orange bg-brand-orange' : 'border-muted-foreground')}
              />
              {t(`hazard.${h}`)}
            </label>
          ))}
        </div>
        <FieldError id="err-type" msg={errors.hazardType} />
      </fieldset>

      <div>
        <label htmlFor="desc" className="mb-2 block font-semibold">
          {t('report.desc')}
        </label>
        <Textarea
          id="desc"
          rows={4}
          maxLength={500}
          value={draft.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder={t('report.descPh')}
          aria-invalid={!!errors.description || undefined}
          aria-describedby="desc-count err-desc"
          className="rounded-xl bg-raised text-base"
        />
        <div className="mt-1 flex justify-between gap-3">
          <FieldError id="err-desc" msg={errors.description} />
          <p id="desc-count" className="ml-auto text-xs text-muted-foreground">
            {draft.description.length}/500
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="when" className="mb-2 block font-semibold">
          {t('report.when')}
        </label>
        <input
          id="when"
          type="datetime-local"
          value={draft.observedAt}
          max={toLocalInput(new Date(Date.now() + 60_000))}
          onChange={(e) => update({ observedAt: e.target.value })}
          aria-invalid={!!errors.observedAt || undefined}
          aria-describedby="err-when"
          className="h-12 w-full max-w-xs rounded-xl border border-input bg-raised px-3 text-base [color-scheme:inherit]"
        />
        <FieldError id="err-when" msg={errors.observedAt} />
      </div>

      <fieldset aria-describedby={errors.severity ? 'err-sev' : undefined}>
        <legend className="mb-3 font-semibold">{t('report.severity')}</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {SEVERITIES.map((s) => (
            <label
              key={s}
              className={cn(
                'flex min-h-14 cursor-pointer flex-col justify-center rounded-xl border px-4 py-2.5 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-ring',
                draft.severity === s ? 'border-brand-orange bg-brand-orange/10' : 'border-border hover:bg-accent',
              )}
            >
              <input type="radio" name="severity" value={s} checked={draft.severity === s} onChange={() => update({ severity: s })} className="sr-only" />
              <span className="font-semibold">{t(`sev.${s}`)}</span>
              <span className="text-xs text-muted-foreground">{t(`sev.${s}Hint`)}</span>
            </label>
          ))}
        </div>
        <FieldError id="err-sev" msg={errors.severity} />
      </fieldset>
    </div>
  )
}

const formatBytes = (n: number) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`)

function StepEvidence({ photos, setPhotos }: { photos: Photo[]; setPhotos: React.Dispatch<React.SetStateAction<Photo[]>> }) {
  const { t } = usePrefs()
  const inputRef = useRef<HTMLInputElement>(null)
  const [problems, setProblems] = useState<string[]>([])

  const add = (files: FileList | null) => {
    if (!files) return
    const errs: string[] = []
    const next: Photo[] = []
    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type)) errs.push(`${file.name} ${t('report.photoTypeErr')}`)
      else if (file.size > MAX_BYTES) errs.push(`${file.name} ${t('report.photoSizeErr')}`)
      else next.push({ id: `${file.name}-${file.size}-${file.lastModified}`, file, url: URL.createObjectURL(file) })
    }
    const room = MAX_PHOTOS - photos.length
    if (next.length > room) {
      errs.push(t('report.photoMaxErr'))
      next.splice(room).forEach((p) => URL.revokeObjectURL(p.url))
    }
    setProblems(errs)
    setPhotos((prev) => [...prev, ...next])
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-semibold">{t('report.photosTitle')}</p>
          <p className="text-sm text-muted-foreground">{t('report.photosHint')}</p>
        </div>
        <input
          ref={inputRef}
          id="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(e) => add(e.target.files)}
        />
        <Button asChild variant="secondary" className="h-11 rounded-xl" aria-disabled={photos.length >= MAX_PHOTOS}>
          <label htmlFor="photos" className={cn('cursor-pointer', photos.length >= MAX_PHOTOS && 'pointer-events-none opacity-50')}>
            <ImagePlus />
            {t('report.addPhotos')} ({photos.length}/{MAX_PHOTOS})
          </label>
        </Button>
      </div>

      {problems.length > 0 && (
        <ul role="alert" className="space-y-1 rounded-xl border border-status-dnt/60 bg-status-dnt/10 p-3 text-sm">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}

      {photos.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-10 text-center">
          <ImageOff aria-hidden className="mb-3 size-8 text-muted-foreground" />
          <p className="max-w-sm text-sm text-muted-foreground">{t('report.photosEmpty')}</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {photos.map((p) => (
            <li key={p.id} className="flex gap-3 rounded-xl border border-border bg-raised/60 p-2.5">
              <img src={p.url} alt="" className="size-20 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.file.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(p.file.size)}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CircleDashed aria-hidden className="size-3" />
                  {t('report.photoLocal')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-lg"
                className="shrink-0 rounded-full"
                aria-label={`${t('report.photoRemove')} ${p.file.name}`}
                onClick={() => {
                  URL.revokeObjectURL(p.url)
                  setPhotos((prev) => prev.filter((x) => x.id !== p.id))
                }}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <p className="rounded-xl bg-accent p-3.5 text-sm text-muted-foreground">{t('report.photoConsent')}</p>
    </div>
  )
}

function StepLocation({
  location,
  setLocation,
  error,
}: {
  location: ReportLocation | null
  setLocation: (l: ReportLocation | null) => void
  error?: string
}) {
  const { t, place } = usePrefs()
  const [gpsMsg, setGpsMsg] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)

  const fromPoint = (lat: number, lon: number, method: ReportLocation['method'], extra: Partial<ReportLocation> = {}) => {
    const near = nearbySegments(lat, lon, 15)
    const best = near[0]
    const candidates = best ? near.filter((n) => n.km - best.km < 4).slice(0, 3).map((n) => n.segment.id) : []
    setLocation({
      method,
      lat,
      lon,
      segmentId: candidates.length === 1 ? candidates[0] : null,
      candidates,
      landmark: location?.landmark ?? '',
      confirmed: false,
      ...extra,
    })
  }

  const useGps = async () => {
    setLocating(true)
    setGpsMsg(null)
    const res = await getCurrentPosition()
    setLocating(false)
    if (!res.ok) return setGpsMsg(t(res.reason === 'denied' ? 'search.locDenied' : 'search.locUnavailable'))
    if (!inCoverage(res.lat, res.lon)) return setGpsMsg(t('search.locOutside'))
    fromPoint(res.lat, res.lon, 'gps', { accuracyM: res.accuracyM })
  }

  const seg = location?.segmentId ? segmentById(location.segmentId) : undefined

  if (location?.confirmed) {
    return (
      <div className="rounded-2xl border border-status-clear/60 bg-status-clear/10 p-5">
        <p className="flex items-center gap-2 font-semibold">
          <CircleCheck aria-hidden className="size-5 text-status-clear" />
          {t('report.locConfirmed')}
        </p>
        <LocationSummary location={location} />
        <Button variant="outline" className="mt-4 h-11 rounded-xl" onClick={() => setLocation({ ...location, confirmed: false })}>
          <Pencil />
          {t('report.locChange')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <PlaceInput
          label={t('report.locSearch')}
          placeholder={t('search.toPh')}
          value={location?.placeId ?? null}
          onChange={(id) => {
            const p = id ? placeById(id) : undefined
            if (p) fromPoint(p.lat, p.lon, 'search', { placeId: p.id })
          }}
        />
        <Button variant="secondary" className="h-12 rounded-xl" onClick={useGps} disabled={locating}>
          {locating ? <LoaderCircle className="animate-spin" /> : <LocateFixed />}
          {locating ? t('search.locating') : t('report.locGps')}
        </Button>
      </div>
      {gpsMsg && (
        <p role="status" className="text-sm text-muted-foreground">
          {gpsMsg}
        </p>
      )}

      <div>
        <p className="mb-2 text-sm font-semibold">{t('report.locPin')}</p>
        <SchematicMap
          className="max-h-[460px]"
          pin={location ? { lat: location.lat, lon: location.lon } : undefined}
          selectedSegmentId={location?.segmentId ?? undefined}
          highlight={location?.candidates}
          onPickPoint={(lat, lon) => fromPoint(lat, lon, 'pin')}
          onSelectSegment={(id) => {
            const l = locationForSegment(id)
            if (l) setLocation({ ...l, method: 'pin', landmark: location?.landmark ?? '' })
          }}
        />
      </div>

      {location && (
        <div className="space-y-4 rounded-2xl border border-border bg-raised/50 p-5">
          {location.accuracyM !== undefined && (
            <p className="text-sm">
              {t('report.locAccuracy')}: <span className="font-semibold">±{Math.round(location.accuracyM)} m</span>
            </p>
          )}
          {location.candidates.length > 1 ? (
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">{t('report.locAmbiguous')}</legend>
              <div className="space-y-1.5">
                {[...location.candidates, null].map((id) => {
                  const s = id ? segmentById(id) : undefined
                  return (
                    <label key={id ?? 'unsure'} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border px-3 text-sm has-[:checked]:border-brand-orange">
                      <input
                        type="radio"
                        name="seg"
                        checked={location.segmentId === id}
                        onChange={() => setLocation({ ...location, segmentId: id })}
                        className="accent-[var(--brand-orange)]"
                      />
                      {s ? (
                        <span>
                          <RoadCode>{s.code}</RoadCode> {place(s.from)} – {place(s.to)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">{t('level.unknown')} — {t('segment.uncertainty')}</span>
                      )}
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ) : (
            <p className="text-sm">
              {t('report.locSegment')}:{' '}
              {seg ? (
                <span className="font-semibold">
                  <RoadCode>{seg.code}</RoadCode> {place(seg.from)} – {place(seg.to)}
                </span>
              ) : (
                <span className="font-semibold">{t('level.unknown')}</span>
              )}
            </p>
          )}
          <div>
            <label htmlFor="landmark" className="mb-1.5 block text-sm font-semibold">
              {t('report.locLandmark')}
            </label>
            <input
              id="landmark"
              value={location.landmark}
              maxLength={120}
              onChange={(e) => setLocation({ ...location, landmark: e.target.value })}
              placeholder={t('report.locLandmarkPh')}
              className="h-11 w-full rounded-xl border border-input bg-raised px-3"
            />
          </div>
          <p className="text-xs text-muted-foreground">{t('report.locConsent')}</p>
          <Button className="h-11 rounded-xl px-5 font-semibold" onClick={() => setLocation({ ...location, confirmed: true })}>
            <MapPin />
            {t('report.locConfirm')}
          </Button>
        </div>
      )}
      <FieldError id="err-loc" msg={error} />
    </div>
  )
}

function LocationSummary({ location }: { location: ReportLocation }) {
  const { t, place } = usePrefs()
  const seg = location.segmentId ? segmentById(location.segmentId) : undefined
  return (
    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
      <dt className="text-muted-foreground">{t('report.locSegment')}</dt>
      <dd className="font-medium">
        {seg ? (
          <>
            <RoadCode>{seg.code}</RoadCode> {place(seg.from)} – {place(seg.to)}
          </>
        ) : (
          `${t('level.unknown')} (${location.candidates.map((c) => segmentById(c)?.code).join(', ') || '—'})`
        )}
      </dd>
      {location.placeId && (
        <>
          <dt className="text-muted-foreground">{t('report.locSearch')}</dt>
          <dd>{place(location.placeId)}</dd>
        </>
      )}
      {location.landmark && (
        <>
          <dt className="text-muted-foreground">{t('report.locLandmark')}</dt>
          <dd>{location.landmark}</dd>
        </>
      )}
      {location.accuracyM !== undefined && (
        <>
          <dt className="text-muted-foreground">{t('report.locAccuracy')}</dt>
          <dd>±{Math.round(location.accuracyM)} m</dd>
        </>
      )}
    </dl>
  )
}

function StepReview({
  draft,
  photos,
  goTo,
  onSubmit,
}: {
  draft: Draft
  photos: Photo[]
  goTo: (s: Draft['step']) => void
  onSubmit: (r: LocalReport) => void
}) {
  const { t, stamp } = usePrefs()
  const Section = ({ title, step, children }: { title: string; step: Draft['step']; children: React.ReactNode }) => (
    <section className="rounded-xl border border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <Button variant="ghost" size="sm" className="h-9 text-link" onClick={() => goTo(step)}>
          <Pencil />
          {t('report.edit')}
        </Button>
      </div>
      <div className="mt-1 text-sm">{children}</div>
    </section>
  )
  return (
    <div className="space-y-3">
      <Section title={t('report.step1')} step={1}>
        <p className="font-medium">
          {draft.hazardType && t(`hazard.${draft.hazardType}`)} · {draft.severity && t(`sev.${draft.severity}`)}
        </p>
        <p className="mt-1 whitespace-pre-line text-muted-foreground">{draft.description}</p>
        <p className="mt-2 text-muted-foreground">
          {t('report.when')} <span className="text-foreground">{draft.observedAt && stamp(new Date(draft.observedAt).getTime())}</span>
        </p>
      </Section>
      <Section title={t('report.step2')} step={2}>
        {photos.length ? (
          <ul className="flex flex-wrap gap-2">
            {photos.map((p) => (
              <li key={p.id}>
                <img src={p.url} alt={p.file.name} className="size-16 rounded-lg object-cover" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">{t('report.noPhotos')}</p>
        )}
        {photos.length > 0 && <p className="mt-2 text-xs text-muted-foreground">{t('report.photoLocal')}</p>}
      </Section>
      <Section title={t('report.step3')} step={3}>
        {draft.location ? <LocationSummary location={draft.location} /> : <p>—</p>}
      </Section>

      <p className="rounded-xl border border-status-official/50 bg-status-official/10 p-4 text-sm font-medium">{t('report.reviewNote')}</p>
      <p className="text-xs text-muted-foreground">{t('report.simulated')}</p>

      <div className="flex flex-wrap justify-between gap-3 pt-3">
        <Button variant="ghost" className="h-11 rounded-xl" onClick={() => goTo(3)}>
          {t('report.back')}
        </Button>
        <Button
          className="h-12 rounded-xl px-6 text-base font-semibold"
          onClick={() => {
            const createdAt = Date.now()
            const report: LocalReport = {
              ref: demoRef(`${draft.description}|${draft.observedAt}|${createdAt}`),
              draft,
              photoCount: photos.length,
              delivery: 'saved',
              createdAt,
              simulated: true,
            }
            const list = readLocal<LocalReport[]>(STORAGE_KEYS.localReports, [])
            writeLocal(STORAGE_KEYS.localReports, [report, ...list].slice(0, 50))
            onSubmit(report)
          }}
        >
          <Send />
          {t('report.submit')}
        </Button>
      </div>
    </div>
  )
}

const DELIVERY_ORDER: Delivery[] = ['saved', 'queued', 'uploading', 'received', 'review']

function Submission({ report, onAnother }: { report: LocalReport; onAnother: () => void }) {
  const { t } = usePrefs()
  const online = useOnline()
  const [delivery, setDelivery] = useState<Delivery>('saved')
  const [failNext, setFailNext] = useState(false)
  const [attempt, setAttempt] = useState(0)

  // Simulated delivery pipeline. Nothing leaves the device in local demo mode.
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const persist = (d: Delivery) => {
      setDelivery(d)
      const list = readLocal<LocalReport[]>(STORAGE_KEYS.localReports, [])
      writeLocal(
        STORAGE_KEYS.localReports,
        list.map((r) => (r.ref === report.ref ? { ...r, delivery: d } : r)),
      )
    }
    timers.push(setTimeout(() => persist('queued'), 600))
    if (online) {
      timers.push(setTimeout(() => persist('uploading'), 1400))
      if (failNext) {
        timers.push(setTimeout(() => persist('failed'), 2600))
      } else {
        timers.push(setTimeout(() => persist('received'), 2600))
        timers.push(setTimeout(() => persist('review'), 3400))
      }
    }
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, online])

  const reached = (d: Delivery) => delivery !== 'failed' && DELIVERY_ORDER.indexOf(delivery) >= DELIVERY_ORDER.indexOf(d)
  const labels: Record<Delivery, string> = {
    saved: t('delivery.saved'),
    queued: t('delivery.queued'),
    uploading: t('delivery.uploading'),
    received: t('delivery.received'),
    review: t('delivery.review'),
    failed: t('delivery.failed'),
  }
  const seg = report.draft.location?.segmentId ? segmentById(report.draft.location.segmentId) : undefined
  const progress = [
    { label: t('progress.submitted'), done: reached('queued') },
    { label: t('progress.received'), done: reached('received') },
    { label: t('progress.review'), done: reached('review') },
    { label: t('progress.decision'), done: false },
    { label: t('progress.clearance'), done: false },
  ]
  const simulated = (d: Delivery) => d === 'uploading' || d === 'received' || d === 'review'

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <DemoBadge />
        <p className="mt-4 text-sm text-muted-foreground">{t('report.ref')}</p>
        <p className="font-mono text-3xl font-medium tracking-tight">{report.ref}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t('report.refNote')}</p>

        <p className="mt-5 rounded-xl border border-dashed border-border px-3 py-2 text-sm font-medium">{t('report.simulated')}</p>

        <ol className="mt-6 space-y-3" aria-live="polite">
          {DELIVERY_ORDER.map((d) => {
            const done = reached(d)
            const active = delivery === d
            return (
              <li key={d} className="flex items-center gap-3">
                {done ? (
                  active && d === 'uploading' ? (
                    <LoaderCircle aria-hidden className="size-5 animate-spin text-muted-foreground" />
                  ) : (
                    <CircleCheck aria-hidden className="size-5 text-foreground" />
                  )
                ) : (
                  <CircleDashed aria-hidden className="size-5 text-muted-foreground" />
                )}
                <span className={cn('text-sm', done ? 'font-medium' : 'text-muted-foreground')}>{labels[d]}</span>
                {simulated(d) && done && (
                  <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
                    simulated
                  </span>
                )}
              </li>
            )
          })}
          {delivery === 'failed' && (
            <li className="flex items-center gap-3 text-status-dnt">
              <CircleX aria-hidden className="size-5" />
              <span className="text-sm font-semibold">{labels.failed}</span>
            </li>
          )}
        </ol>

        {!online && <p className="mt-4 rounded-xl bg-accent p-3 text-sm">{t('delivery.offlineQueued')}</p>}
        {delivery === 'saved' || delivery === 'queued' ? (
          <p className="mt-4 text-sm text-muted-foreground">{t('copy.savedLocal')}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {delivery === 'failed' && (
            <Button
              className="h-11 rounded-xl"
              onClick={() => {
                setFailNext(false)
                setAttempt((a) => a + 1)
              }}
            >
              <RotateCcw />
              {t('report.retry')}
            </Button>
          )}
          {delivery !== 'failed' && delivery !== 'review' && online && !failNext && (
            <Button variant="ghost" size="sm" className="h-9 text-muted-foreground" onClick={() => {
              setFailNext(true)
              setAttempt((a) => a + 1)
            }}>
              {t('report.simulateFail')}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold">{t('progress.title')}</h2>
        <ol className="mt-4 grid gap-2 sm:grid-cols-5">
          {progress.map((p, i) => (
            <li key={p.label} className={cn('rounded-xl border p-3 text-sm', p.done ? 'border-foreground/40 bg-raised' : 'border-dashed border-border text-muted-foreground')}>
              <span className="font-mono text-xs">{i + 1}</span>
              <p className="mt-1 font-medium">{p.label}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted-foreground">{t('delivery.demoStop')}</p>
        <p className="mt-2 text-sm font-medium">{t('progress.note')}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button className="h-11 rounded-xl" onClick={onAnother}>
          <Camera />
          {t('report.another')}
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-xl">
          <Link to="/check" search={{ view: 'map', seg: seg?.id }}>
            {t('report.viewRoad')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
