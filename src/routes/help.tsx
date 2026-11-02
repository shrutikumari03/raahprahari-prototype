import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  Ban,
  Clock3,
  LockKeyhole,
  Map,
  Search,
  ShieldAlert,
  TriangleAlert,
} from 'lucide-react'
import { MountainBanner } from '@/components/mountain-banner'
import { Input } from '@/components/ui/input'
import { usePrefs } from '@/i18n/preferences'

export const Route = createFileRoute('/help')({
  head: () => ({ meta: [{ title: 'Help & Safety Centre · RaahPrahari' }] }),
  component: HelpPage,
})

const topics = [
  { key: 'report', icon: TriangleAlert },
  { key: 'status', icon: ShieldAlert },
  { key: 'freshness', icon: Clock3 },
  { key: 'map', icon: Map },
  { key: 'privacy', icon: LockKeyhole },
  { key: 'restrictions', icon: Ban },
] as const

function HelpPage() {
  const { t } = usePrefs()
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    if (!normalized) return topics
    return topics.filter((topic) =>
      `${t(`help.${topic.key}`)} ${t(`help.${topic.key}Body`)}`
        .toLocaleLowerCase()
        .includes(normalized),
    )
  }, [query, t])

  return (
    <div className="pb-8">
      <MountainBanner
        eyebrow={t('hero.eyebrow')}
        title={t('help.title')}
        description={t('help.subtitle')}
      />
      <div className="rp-container max-w-6xl space-y-6 py-6">
        <p className="max-w-3xl text-muted-foreground">{t('help.body')}</p>
        <label className="relative block max-w-xl">
          <Search aria-hidden className="absolute top-3.5 left-3.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('help.search')}
            className="h-12 rounded-xl pl-10"
          />
        </label>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ key, icon: Icon }) => (
            <article key={key} className="rounded-2xl border border-border bg-card p-5">
              <Icon aria-hidden className="mb-3 size-5 text-brand-orange" />
              <h2 className="font-display text-lg font-semibold">{t(`help.${key}`)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`help.${key}Body`)}</p>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
              {t('adv.empty')}
            </p>
          )}
        </div>
        <p className="rounded-xl border-l-4 border-brand-orange bg-raised p-4 text-sm font-medium">
          {t('help.reminder')}
        </p>
      </div>
    </div>
  )
}
