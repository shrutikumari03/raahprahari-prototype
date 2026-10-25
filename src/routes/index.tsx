import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ClipboardCheck,
  Clock,
  Eye,
  MessageSquareWarning,
  Radio,
  Ruler,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdvisoryBadge, DemoBadge, OfficialBadge, RoadCode, StaleBadge } from '@/components/advisory'
import { SEGMENTS, segmentById } from '@/data/fixtures'
import { RouteSearchCard } from '@/features/routes/route-search'
import { usePrefs } from '@/i18n/preferences'
import { advisoryFor } from '@/lib/data'

export const Route = createFileRoute('/')({
  component: Home,
})

const heroSrc = (w: number) => `/.netlify/images?url=/img/hero-road.png&w=${w}&fm=webp&q=70`

function Home() {
  const { t } = usePrefs()
  return (
    <>
      <Hero />
      <CheckYourRoad />
      <section aria-labelledby="flow-title" className="border-y border-border bg-card/50">
        <div className="rp-container py-16 md:py-20">
          <h2 id="flow-title" className="font-display text-3xl font-bold md:text-4xl">
            {t('s2.title')}
          </h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: MessageSquareWarning, title: t('s2.step1'), body: t('s2.step1Body') },
              { icon: ClipboardCheck, title: t('s2.step2'), body: t('s2.step2Body') },
              { icon: Radio, title: t('s2.step3'), body: t('s2.step3Body') },
            ].map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <s.icon aria-hidden className="mt-4 size-7 text-brand-orange" />
                <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.body}</p>
                {i < 2 && (
                  <ArrowRight aria-hidden className="absolute top-1/2 -right-5 z-10 hidden size-6 -translate-y-1/2 text-muted-foreground md:block" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <LocalKnowledge />
      <section aria-labelledby="final-title" className="rp-container py-16 md:py-20">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
          <h2 id="final-title" className="font-display text-3xl font-bold">
            {t('final.title')}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t('final.body')}</p>
          <p className="mt-3 text-sm font-medium">{t('copy.noReportNotSafe')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="h-12 rounded-xl px-6 text-base font-semibold">
              <Link to="/check" search={{ view: 'map' }}>
                {t('search.submit')}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl px-6 text-base">
              <Link to="/report">
                <TriangleAlert />
                {t('hero.report')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function Hero() {
  const { t, lang } = usePrefs()
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <img
        src={heroSrc(1600)}
        srcSet={`${heroSrc(800)} 800w, ${heroSrc(1280)} 1280w, ${heroSrc(1920)} 1920w`}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#111719] via-[#111719]/85 to-[#111719]/35" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="rp-container grid gap-10 pt-12 pb-16 md:pt-20 md:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="text-[#E6E4DC]">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#E6E4DC]/25 bg-[#111719]/50 px-3 py-1 text-sm">
            <span aria-hidden className="size-1.5 rounded-full bg-brand-orange" />
            {t('hero.eyebrow')}
          </p>
          <h1 id="hero-title" className="mt-6 font-display text-5xl leading-[1.02] font-bold sm:text-6xl xl:text-7xl">
            {t('hero.title')}
          </h1>
          {lang === 'en' && (
            <p lang="hi" className="mt-3 text-xl font-semibold text-[#F4D6A6] sm:text-2xl" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              सफ़र से पहले सुरक्षा की ख़बर
            </p>
          )}
          <p className="mt-5 max-w-xl text-lg text-[#E6E4DC]/85">{t('hero.body')}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="h-12 rounded-xl border-[#E6E4DC]/40 bg-[#111719]/40 px-5 text-base text-[#E6E4DC] hover:bg-[#111719]/70 hover:text-[#E6E4DC]">
              <Link to="/report">
                <TriangleAlert />
                {t('hero.report')}
              </Link>
            </Button>
          </div>
          <SampleAdvisory />
        </div>

        <div className="rounded-3xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-sm sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold">{t('search.title')}</h2>
            <DemoBadge />
          </div>
          <RouteSearchCard />
        </div>
      </div>
    </section>
  )
}

function SampleAdvisory() {
  const { t, place, ago } = usePrefs()
  const seg = segmentById('nh7-06')!
  const a = advisoryFor(seg.id)!
  return (
    <Link
      to="/check"
      search={{ view: 'map', seg: seg.id }}
      className="mt-10 block max-w-md rounded-2xl border border-[#465056] bg-[#272A2D]/90 p-4 text-[#E6E4DC] transition-colors hover:border-[#B7BCB9]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold tracking-wider text-[#B7BCB9] uppercase">{t('hero.sample')}</span>
        <span className="font-mono text-[10px] text-[#B7BCB9] uppercase">{t('demo.badge')}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-[#B7BCB9]">
            {seg.code} · km {seg.kmStart}–{seg.kmEnd}
          </p>
          <p className="font-semibold">
            {place(seg.from)} – {place(seg.to)}
          </p>
        </div>
        <span className="dark">
          <AdvisoryBadge level={a.level} />
        </span>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-[#B7BCB9]">
        <ShieldCheck aria-hidden className="size-4 text-[#92C5FF]" />
        {a.restriction && t(`restriction.${a.restriction.type}`)} · {a.latestObservationAt && ago(a.latestObservationAt)}
      </p>
      {a.awaitingClearance && <p className="mt-1 text-xs text-[#B7BCB9]">{t('copy.awaitingClearance')}</p>}
    </Link>
  )
}

function CheckYourRoad() {
  const { t, place } = usePrefs()
  const nh7 = SEGMENTS.filter((s) => s.corridorId === 'nh7')
  const points = [
    { icon: TriangleAlert, label: t('s1.a') },
    { icon: Clock, label: t('s1.b') },
    { icon: ShieldCheck, label: t('s1.c') },
    { icon: Ruler, label: t('s1.d') },
  ]
  return (
    <section aria-labelledby="check-title" className="rp-container grid gap-10 py-16 md:py-20 lg:grid-cols-2 lg:items-center">
      <div>
        <h2 id="check-title" className="font-display text-3xl font-bold md:text-4xl">
          {t('s1.title')}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{t('s1.body')}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {points.map((p) => (
            <li key={p.label} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <p.icon aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-orange" />
              <span className="text-sm font-medium">{p.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-baseline gap-2">
            <RoadCode className="text-sm">NH-7</RoadCode>
            <span className="font-semibold">
              {place('rishikesh')} – {place('badrinath')}
            </span>
          </p>
          <DemoBadge />
        </div>
        <ol className="space-y-1.5">
          {nh7.map((s) => {
            const a = advisoryFor(s.id)!
            return (
              <li key={s.id}>
                <Link
                  to="/check"
                  search={{ from: 'rishikesh', to: 'badrinath', view: 'list', seg: s.id }}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-accent"
                >
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] text-muted-foreground">km {s.kmStart}–{s.kmEnd}</span>
                    <span className="block truncate text-sm font-medium">
                      {place(s.from)} – {place(s.to)}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {a.restriction && <ShieldCheck aria-label={t('level.official')} className="size-4 text-status-official" />}
                    {a.stale && <StaleBadge />}
                    <AdvisoryBadge level={a.level} />
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">{t('copy.estimate')}</p>
      </div>
    </section>
  )
}

function LocalKnowledge() {
  const { t } = usePrefs()
  return (
    <section aria-labelledby="local-title" className="rp-container grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_1fr] lg:items-center">
      <div className="order-2 grid gap-3 sm:grid-cols-2 lg:order-1">
        <StateCard badge={<OfficialBadge label={t('restriction.road_closed')} />} text={t('copy.awaitingClearance')} />
        <StateCard
          badge={
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs font-medium">
              <Eye aria-hidden className="size-3.5" />
              {t('copy.notOfficial')}
            </span>
          }
          text={t('copy.communityUnverified')}
        />
        <StateCard badge={<AdvisoryBadge level="unknown" />} text={t('copy.noRecent')} />
        <StateCard badge={<StaleBadge age="40 h" />} text={t('s3.c')} />
      </div>
      <div className="order-1 lg:order-2">
        <h2 id="local-title" className="font-display text-3xl font-bold md:text-4xl">
          {t('s3.title')}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{t('s3.body')}</p>
        <ul className="mt-6 space-y-3">
          {[t('s3.a'), t('s3.b'), t('s3.c')].map((p) => (
            <li key={p} className="flex gap-3">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-orange" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function StateCard({ badge, text }: { badge: React.ReactNode; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      {badge}
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
