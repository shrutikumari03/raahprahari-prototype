import { usePrefs } from '@/i18n/preferences'

export function MountainBanner({
  eyebrow,
  title,
  description,
  children,
  className = '',
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  const { t } = usePrefs()
  return (
    <section className={`relative isolate overflow-hidden border-b border-border ${className}`}>
      <img
        src="/img/hero-road-generated.svg"
        alt={t('hero.imageAlt')}
        className="absolute inset-0 -z-20 size-full object-cover object-[60%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07151f]/95 via-[#07151f]/85 to-[#07151f]/55" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-[#07151f]/75 to-transparent" />
      <div className="rp-container py-8 md:py-12">
        {eyebrow && (
          <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-blue-on-dark uppercase">
            <span aria-hidden className="h-0.5 w-7 bg-brand-orange" />
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-4xl font-display text-3xl leading-tight font-bold text-text-on-charcoal sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description && <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">{description}</p>}
        {children}
      </div>
    </section>
  )
}
