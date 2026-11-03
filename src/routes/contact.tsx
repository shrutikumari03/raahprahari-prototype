import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Mail } from 'lucide-react'
import { MountainBanner } from '@/components/mountain-banner'
import { Button } from '@/components/ui/button'
import { usePrefs } from '@/i18n/preferences'

export const Route = createFileRoute('/contact')({
  head: () => ({ meta: [{ title: 'Contact · RaahPrahari' }] }),
  component: ContactPage,
})

function ContactPage() {
  const { t } = usePrefs()
  return (
    <div className="pb-8">
      <MountainBanner
        eyebrow={t('hero.eyebrow')}
        title={t('contact.title')}
        description={t('contact.body')}
      />
      <div className="rp-container max-w-3xl py-8">
        <section className="rounded-2xl border border-border bg-card p-6">
          <Mail aria-hidden className="mb-3 size-6 text-brand-orange" />
          <h2 className="font-display text-xl font-semibold">{t('contact.title')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t('contact.body')}</p>
          <Button asChild variant="outline" className="mt-5 min-h-11 rounded-xl">
            <Link to="/about"><ArrowLeft aria-hidden />{t('about.title')}</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
