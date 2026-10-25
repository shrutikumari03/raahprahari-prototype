import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowUpDown, LocateFixed, RotateCcw, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QUICK_PICKS } from '@/data/fixtures'
import { usePrefs } from '@/i18n/preferences'
import { getCurrentPosition, inCoverage, nearestPlace } from '@/lib/geo'
import { STORAGE_KEYS, useLocalState } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { PlaceInput } from '@/features/routes/place-input'

interface RecentSearch {
  from: string
  to: string
  at: number
}

export function RouteSearchCard({
  initialFrom = null,
  initialTo = null,
  layout = 'stacked',
  className,
}: {
  initialFrom?: string | null
  initialTo?: string | null
  layout?: 'stacked' | 'inline'
  className?: string
}) {
  const { t, place } = usePrefs()
  const navigate = useNavigate()
  const [from, setFrom] = useState<string | null>(initialFrom)
  const [to, setTo] = useState<string | null>(initialTo)
  const [locMsg, setLocMsg] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)
  const [recent, setRecent] = useLocalState<RecentSearch[]>(STORAGE_KEYS.recentSearches, [])

  useEffect(() => {
    setFrom(initialFrom)
    setTo(initialTo)
  }, [initialFrom, initialTo])

  const same = !!from && from === to
  const valid = !!from && !!to && !same

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!valid) return
    setRecent((prev) => [{ from, to, at: Date.now() }, ...prev.filter((r) => !(r.from === from && r.to === to))].slice(0, 5))
    void navigate({ to: '/check', search: { from, to } })
  }

  const locate = async () => {
    setLocating(true)
    setLocMsg(null)
    const res = await getCurrentPosition()
    setLocating(false)
    if (!res.ok) {
      setLocMsg(t(res.reason === 'denied' ? 'search.locDenied' : 'search.locUnavailable'))
      return
    }
    if (!inCoverage(res.lat, res.lon)) {
      setLocMsg(t('search.locOutside'))
      return
    }
    const p = nearestPlace(res.lat, res.lon)
    setFrom(p.id)
    setLocMsg(`${t('search.locNearest')}: ${place(p.id)} (±${Math.round(res.accuracyM)} m)`)
  }

  const pick = (id: string) => {
    if (!from) setFrom(id)
    else if (!to && id !== from) setTo(id)
    else setTo(id)
  }

  const inline = layout === 'inline'

  return (
    <form onSubmit={submit} noValidate className={cn('space-y-4', className)} aria-label={t('search.title')}>
      <div className={cn('grid gap-3', inline ? 'md:grid-cols-[1fr_auto_1fr_auto] md:items-end' : 'grid-cols-1')}>
        <PlaceInput label={t('search.from')} placeholder={t('search.fromPh')} value={from} onChange={setFrom} />
        <div className={cn('flex', inline ? 'justify-center md:pb-0.5' : '-my-2 justify-end')}>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="size-11 rounded-full"
            onClick={() => {
              setFrom(to)
              setTo(from)
            }}
            aria-label={t('search.swap')}
            title={t('search.swap')}
          >
            <ArrowUpDown className={cn(inline && 'md:rotate-90')} />
          </Button>
        </div>
        <PlaceInput label={t('search.to')} placeholder={t('search.toPh')} value={to} onChange={setTo} invalid={same} />
        {inline && (
          <Button type="submit" disabled={!valid} className="h-12 rounded-xl px-6 text-base font-semibold">
            <Search />
            {t('search.submit')}
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button type="button" variant="link" className="h-11 px-0 text-link" onClick={locate} disabled={locating}>
          <LocateFixed />
          {locating ? t('search.locating') : t('search.useLocation')}
        </Button>
        {same && (
          <p role="alert" className="text-sm font-medium text-status-dnt">
            {t('search.same')}
          </p>
        )}
      </div>
      {locMsg && (
        <p role="status" className="-mt-2 text-sm text-muted-foreground">
          {locMsg}
        </p>
      )}

      {!inline && (
        <Button type="submit" disabled={!valid} className="h-12 w-full rounded-xl text-base font-semibold">
          <Search />
          {t('search.submit')}
        </Button>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t('search.quick')}</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PICKS.map((id) => {
            const selected = id === from || id === to
            return (
              <button
                key={id}
                type="button"
                onClick={() => pick(id)}
                aria-pressed={selected}
                className={cn(
                  'min-h-9 rounded-full border px-3 text-sm transition-colors',
                  selected
                    ? 'border-brand-orange bg-brand-orange/15 text-foreground'
                    : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                )}
              >
                {place(id)}
              </button>
            )
          })}
        </div>
      </div>

      {recent.length > 0 && (
        <div>
          <div className="mb-1 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t('search.recent')}</p>
            <Button type="button" variant="ghost" size="sm" className="h-9 text-muted-foreground" onClick={() => setRecent([])}>
              <X />
              {t('search.clearRecent')}
            </Button>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {recent.map((r) => (
              <li key={`${r.from}-${r.to}`}>
                <button
                  type="button"
                  onClick={() => {
                    setFrom(r.from)
                    setTo(r.to)
                  }}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent px-3 text-sm hover:bg-muted"
                >
                  <RotateCcw aria-hidden className="size-3.5 text-muted-foreground" />
                  {place(r.from)} → {place(r.to)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-muted-foreground">{t('search.coverage')}</p>
    </form>
  )
}
