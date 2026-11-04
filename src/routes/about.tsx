import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeInfo,
  Database,
  Route as RouteIcon,
} from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About | RaahPrahari" }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="rp-info-page">
      <PageBanner
        eyebrow="ABOUT"
        title="About RaahPrahari"
        description="RaahPrahari shows reported road hazards, information freshness and official restrictions together so travellers can decide with more context."
      />
      <div className="rp-info-container rp-info-content">
        <div className="grid gap-3 min-[600px]:grid-cols-2 min-[1050px]:grid-cols-3">
          <article className="rp-info-card">
            <Database aria-hidden className="mb-3 size-5 text-brand-orange" />
            <h2>What this prototype is</h2>
            <p>
              RaahPrahari is a prototype with synthetic demo data. It is not a
              live service, and its displayed reports and road information
              should not be treated as current real-world conditions.
            </p>
          </article>

          <article className="rp-info-card">
            <BadgeInfo aria-hidden className="mb-3 size-5 text-brand-orange" />
            <h2>How to read an advisory</h2>
            <p>
              An observed condition, advisory action, official restriction,
              supporting evidence and information freshness are shown
              separately.
            </p>
            <ul className="mt-3 space-y-2 pl-5">
              <li>
                <strong>CAUTION:</strong> use added care for the reported
                condition.
              </li>
              <li>
                <strong>AVOID:</strong> avoid the route as advised.
              </li>
              <li>
                <strong>UNKNOWN:</strong> the current status is not known.
              </li>
            </ul>
            <p>
              Unknown or stale information is never shown as safe and is not a
              safety clearance.
            </p>
          </article>

          <article className="rp-info-card">
            <RouteIcon aria-hidden className="mb-3 size-5 text-brand-orange" />
            <h2>What reports can and cannot do</h2>
            <p>
              A report, score, reputation or AI output cannot create or remove
              an official road closure. Any clearance remains{" "}
              <strong>Awaiting verification</strong> until the approved process
              resolves it.
            </p>
          </article>
        </div>
        <nav className="rp-info-actions" aria-label="Explore RaahPrahari">
          <Button asChild className="min-h-11 rounded-xl">
            <Link to="/traveller">
              Check a road <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11 rounded-xl">
            <Link to="/advisories">View advisories</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11 rounded-xl">
            <Link to="/help">Help</Link>
          </Button>
        </nav>
      </div>
    </div>
  );
}
