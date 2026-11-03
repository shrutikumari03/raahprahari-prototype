import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, BadgeInfo, Database, Route as RouteIcon } from 'lucide-react'
import { MountainBanner } from '@/components/mountain-banner'
import { Button } from '@/components/ui/button'
import { usePrefs } from '@/i18n/preferences'

export const Route = createFileRoute('/about')({
  head: () => ({ meta: [{ title: 'About · RaahPrahari' }] }),
  component: AboutPage,
})

function AboutPage() {
  const { t } = usePrefs()
  return (
    <div className="pb-8">
      <MountainBanner
        eyebrow={t('hero.eyebrow')}
        title={t('about.title')}
        description={t('about.body')}
      />
      <div className="rp-container max-w-5xl space-y-5 py-6">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { icon: Database, title: t('about.syntheticTitle'), body: t('about.syntheticBody') },
            { icon: BadgeInfo, title: t('about.uncertaintyTitle'), body: t('about.uncertaintyBody') },
            { icon: RouteIcon, title: t('about.coverageTitle'), body: t('about.coverageBody') },
          ].map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-5">
              <Icon aria-hidden className="mb-3 size-5 text-brand-orange" />
              <h2 className="font-display text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="min-h-11 rounded-xl">
            <Link to="/traveller">
              {t('nav.advisories')} <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11 rounded-xl">
            <Link to="/help">{t('nav.help')}</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11 rounded-xl">
            <Link to="/contact">{t('footer.contact')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
