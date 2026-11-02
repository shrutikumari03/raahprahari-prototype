import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CloudDownload, MapPin, Search, ShieldCheck, TriangleAlert, UsersRound } from 'lucide-react'
import { AdvisoryCard } from '@/components/advisory-card'
import { segmentById } from '@/data/fixtures'
import { usePrefs } from '@/i18n/preferences'
import './home.css'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { t } = usePrefs()
  const sampleSegment = segmentById('nh107-02')
  if (!sampleSegment) throw new Error('Missing sample segment "nh107-02"')

  return (
    <div className="home-page">
      <section aria-labelledby="hero-title" className="home-hero">
        <img
          src="/img/hero-mountain.png"
          alt=""
          fetchPriority="high"
          className="home-hero-image"
        />
        <div aria-hidden className="home-hero-overlay" />
        <div className="home-content">
          <div className="home-copy">
            <h1 id="hero-title">{t('hero.title')}</h1>
            <p>{t('hero.body')}</p>
            <div className="home-actions">
              <Link to="/traveller" className="home-action home-action-check">
                <Search aria-hidden />
                <span>Check a road</span>
                <ArrowRight aria-hidden />
              </Link>
              <Link to="/report" search={{ segment: undefined }} className="home-action home-action-report">
                <TriangleAlert aria-hidden />
                <span>Report a hazard</span>
                <ArrowRight aria-hidden />
              </Link>
            </div>
          </div>

          <IllustrativeRoute />
          <AdvisoryCard segment={sampleSegment} variant="home-featured" />
        </div>

        <ul aria-label="RaahPrahari features" className="home-features">
          <li>
            <UsersRound aria-hidden />
            <span>
              <strong>Community Reporting</strong>
              <small>Real people. Real observations.</small>
            </span>
          </li>
          <li>
            <ShieldCheck aria-hidden />
            <span>
              <strong>Evidence &amp; Freshness</strong>
              <small>See what’s current. Know what’s real.</small>
            </span>
          </li>
          <li>
            <CloudDownload aria-hidden />
            <span>
              <strong>Offline-Aware Access</strong>
              <small>Stay informed, even off the network.</small>
            </span>
          </li>
        </ul>

        <p className="home-prototype-label">PROTOTYPE · SYNTHETIC DEMO DATA</p>
      </section>
    </div>
  )
}

function IllustrativeRoute() {
  return (
    <div
      role="img"
      aria-label="Illustrative route only with three synthetic coordinate pins"
      className="home-route"
    >
      <span className="home-route-label">ILLUSTRATIVE ROUTE ONLY</span>
      <div aria-hidden className="home-route-line home-route-line-one" />
      <div aria-hidden className="home-route-line home-route-line-two" />
      <div className="home-route-pin home-route-pin-one">
        <MapPin aria-hidden />
        <span>32.2435° N<br />77.1890° E</span>
      </div>
      <div className="home-route-pin home-route-pin-two">
        <MapPin aria-hidden />
        <span>32.1876° N<br />77.1420° E</span>
      </div>
      <div className="home-route-pin home-route-pin-three">
        <MapPin aria-hidden />
        <span>32.1042° N<br />77.0931° E</span>
      </div>
    </div>
  )
}
