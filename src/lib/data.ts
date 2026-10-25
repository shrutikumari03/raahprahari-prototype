// Data-access layer. Components read advisories and reports through these
// functions only, so the synthetic fixtures can later be replaced by API calls.

import { DEMO_NOW, REPORTS, RESTRICTIONS, SEGMENTS } from '@/data/fixtures'
import { computeSegmentAdvisory, type SegmentAdvisory } from '@/lib/advisory'

let cache: Map<string, SegmentAdvisory> | null = null

export function getAdvisories(): Map<string, SegmentAdvisory> {
  if (!cache) {
    cache = new Map(
      SEGMENTS.map((s) => [s.id, computeSegmentAdvisory(s.id, REPORTS, RESTRICTIONS, DEMO_NOW)]),
    )
  }
  return cache
}

export const advisoryFor = (segmentId: string) => getAdvisories().get(segmentId)

export const reportByRef = (ref: string) => REPORTS.find((r) => r.ref === ref)
