import { DEMO_NOW, segmentById } from '@/data/fixtures'
import type { SegmentAdvisory } from '@/lib/advisory'
import type { CommunityReport, OfficialRestriction, Segment } from '@/lib/types'

export type SH15ScenarioKey =
  | 'fresh'
  | 'aging'
  | 'stale'
  | 'unknown'
  | 'official-closed'
  | 'official-closed-awaiting-clearance'
  | 'community-only'

export interface SH15Scenario {
  key: SH15ScenarioKey
  label: string
  synthetic: true
  now: number
  segment: Segment
  advisory: SegmentAdvisory
  untrustedSignals?: {
    score: number
    reputation: string
    aiOutput: string
  }
}

const templateSegment: Segment = (() => {
  const found = segmentById('msr-01')
  if (!found) throw new Error('Missing fixture segment "msr-01" for SH-15 scenarios')
  return found
})()

const timestampHoursAgo = (hours: number) => DEMO_NOW - hours * 60 * 60_000

function makeSegment(key: SH15ScenarioKey): Segment {
  return {
    ...templateSegment,
    id: `sh15-${key}`,
    code: 'SH-15',
  }
}

function makeReport(
  segmentId: string,
  kind: CommunityReport['kind'],
  observedHoursAgo: number,
  status: CommunityReport['status'] = 'under_review',
): CommunityReport {
  const observedAt = timestampHoursAgo(observedHoursAgo)
  return {
    ref: `SYN-${segmentId}`,
    segmentId,
    kind,
    hazardType: kind === 'hazard' ? 'rockfall' : 'other',
    severity: kind === 'hazard' ? 'moderate' : 'low',
    description: 'Synthetic SH-15 community observation.',
    landmark: 'Synthetic waypoint',
    observedAt,
    receivedAt: observedAt + 5 * 60_000,
    status,
    source: 'traveller',
    locationConfidence: 'medium',
    photoCount: 0,
    synthetic: true,
  }
}

function makeRestriction(
  segmentId: string,
  clearance: OfficialRestriction['clearance'],
): OfficialRestriction {
  const publishedAt = timestampHoursAgo(10)
  return {
    id: `SYN-OR-${segmentId}`,
    segmentId,
    type: 'road_closed',
    title: 'Synthetic SH-15 closure for clearance work',
    issuingAuthority: 'Synthetic District Authority',
    jurisdiction: 'Dehradun',
    supportingReference: `SYN/${segmentId}`,
    publishedAt,
    effectiveFrom: publishedAt,
    reviewBy: timestampHoursAgo(2),
    status: 'active',
    clearance,
    synthetic: true,
  }
}

function makeScenario(
  key: SH15ScenarioKey,
  label: string,
  options: {
    report?: CommunityReport
    restriction?: OfficialRestriction
    level: SegmentAdvisory['level']
    basis: SegmentAdvisory['basis']
    stale?: boolean
    awaitingClearance?: boolean
  },
): SH15Scenario {
  const segment = makeSegment(key)
  const report = options.report
  const advisory: SegmentAdvisory = {
    segmentId: segment.id,
    level: options.level,
    basis: options.basis,
    restriction: options.restriction,
    restrictionPastReview: false,
    awaitingClearance: options.awaitingClearance ?? false,
    stale: options.stale ?? false,
    latestObservationAt: report?.observedAt,
    evidence: report ? [report] : [],
    reviewedCount: report?.status === 'verified' ? 1 : 0,
  }
  return { key, label, synthetic: true, now: DEMO_NOW, segment, advisory }
}

const freshSegment = makeSegment('fresh')
const agingSegment = makeSegment('aging')
const staleSegment = makeSegment('stale')
const closedSegment = makeSegment('official-closed')
const pendingSegment = makeSegment('official-closed-awaiting-clearance')
const communitySegment = makeSegment('community-only')
const communityClear = makeReport(communitySegment.id, 'clear', 2, 'verified')

export const SH15_SCENARIOS: Record<SH15ScenarioKey, SH15Scenario> = {
  fresh: makeScenario('fresh', 'Fresh synthetic report', {
    report: makeReport(freshSegment.id, 'hazard', 1),
    level: 'caution',
    basis: 'single_report',
  }),
  aging: makeScenario('aging', 'Aging synthetic report', {
    report: makeReport(agingSegment.id, 'hazard', 20),
    level: 'caution',
    basis: 'single_report',
  }),
  stale: makeScenario('stale', 'Stale synthetic report', {
    report: makeReport(staleSegment.id, 'hazard', 36),
    level: 'unknown',
    basis: 'stale_only',
    stale: true,
  }),
  unknown: makeScenario('unknown', 'Synthetic report without timestamp', {
    level: 'unknown',
    basis: 'no_evidence',
  }),
  'official-closed': makeScenario('official-closed', 'Synthetic active official closure', {
    restriction: makeRestriction(closedSegment.id, 'not_requested'),
    level: 'do_not_travel',
    basis: 'official',
  }),
  'official-closed-awaiting-clearance': makeScenario(
    'official-closed-awaiting-clearance',
    'Synthetic active official closure awaiting clearance verification',
    {
      restriction: makeRestriction(pendingSegment.id, 'pending'),
      level: 'do_not_travel',
      basis: 'official',
      awaitingClearance: true,
    },
  ),
  'community-only': {
    ...makeScenario('community-only', 'Synthetic community-only clear report', {
      report: communityClear,
      level: 'unknown',
      basis: 'community_clear',
    }),
    untrustedSignals: {
      score: 100,
      reputation: 'synthetic high reputation',
      aiOutput: 'Cleared and verified',
    },
  },
}

export const SH15_SCENARIO_LIST = Object.values(SH15_SCENARIOS)
