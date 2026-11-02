import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AdvisoryCard } from '@/components/advisory-card'
import { MountainBanner } from '@/components/mountain-banner'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/feedback'
import { SEGMENTS } from '@/data/fixtures'
import { usePrefs } from '@/i18n/preferences'
import { advisoryFor } from '@/lib/data'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'issues' | 'official' | 'unknown'

export const Route = createFileRoute('/advisories/')({
  head: () => ({ meta: [{ title: 'Road advisories · RaahPrahari' }] }),
  component: AdvisoriesPage,
})

function AdvisoriesPage() {
  const { t } = usePrefs()
  const [filter, setFilter] = useState<Filter>('all')
  const segments = SEGMENTS.filter((segment) => {
    const advisory = advisoryFor(segment.id)
    if (!advisory) throw new Error(`Missing advisory for segment "${segment.id}"`)
    if (filter === 'issues') return advisory.level === 'caution' || advisory.level === 'avoid' || advisory.level === 'do_not_travel'
    if (filter === 'official') return !!advisory.restriction
    if (filter === 'unknown') return advisory.level === 'unknown' || advisory.stale
    return true
  })

  return (
    <div className="pb-8">
      <MountainBanner
        eyebrow={t('hero.eyebrow')}
        title={t('adv.title')}
        description={t('adv.body')}
      />
      <div className="rp-container space-y-5 py-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('adv.filter')}>
          {(['all', 'issues', 'official', 'unknown'] as const).map((value) => (
            <Button
              key={value}
              type="button"
              variant={filter === value ? 'secondary' : 'outline'}
              aria-pressed={filter === value}
              className={cn('min-h-11 rounded-full', filter === value && 'text-link')}
              onClick={() => setFilter(value)}
            >
              {t(
                value === 'all'
                  ? 'adv.filterAll'
                  : value === 'issues'
                    ? 'adv.filterIssues'
                    : value === 'official'
                      ? 'adv.filterOfficial'
                      : 'adv.filterUnknown',
              )}
            </Button>
          ))}
        </div>
        {segments.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {segments.map((segment) => <AdvisoryCard key={segment.id} segment={segment} />)}
          </div>
        ) : (
          <EmptyState title={t('adv.empty')} message={t('help.reminder')} />
        )}
      </div>
    </div>
  )
}
