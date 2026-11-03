import { t as cn } from "./utils-DWGjSd5x.js";
import { d as SEGMENTS, l as REPORTS, o as DEMO_NOW, r as usePrefs, u as RESTRICTIONS } from "./preferences-DeZH5r-v.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, CircleCheck, CircleQuestionMark, Clock, FlaskConical, OctagonAlert, OctagonX, ShieldCheck, TriangleAlert } from "lucide-react";
// src/lib/advisory.ts
function getAdvisorySourceTimestamp(advisory) {
	const timestamps = [advisory.latestObservationAt, advisory.restriction?.publishedAt].filter((timestamp) => timestamp !== void 0);
	return timestamps.length ? Math.max(...timestamps) : void 0;
}
function getFreshnessState(sourceTimestamp, now) {
	if (sourceTimestamp === void 0 || !Number.isFinite(sourceTimestamp) || !Number.isFinite(now) || sourceTimestamp <= 0 || sourceTimestamp > now) return "unknown";
	return now - sourceTimestamp <= 864e5 ? "fresh" : "stale";
}
var LEVEL_RANK = {
	clear: 0,
	unknown: 1,
	caution: 2,
	avoid: 3,
	do_not_travel: 4
};
var RESTRICTION_LEVEL = {
	road_closed: "do_not_travel",
	partially_restricted: "avoid",
	vehicle_restricted: "caution",
	time_bound: "caution"
};
var IGNORED = ["rejected", "duplicate"];
function isRestrictionInForce(r) {
	return r.status !== "lifted";
}
function computeSegmentAdvisory(segmentId, reports, restrictions, now) {
	const segReports = reports.filter((r) => r.segmentId === segmentId && !IGNORED.includes(r.status)).sort((a, b) => b.observedAt - a.observedAt);
	const latestObservationAt = segReports[0]?.observedAt;
	const reviewedCount = segReports.filter((r) => r.status === "verified").length;
	const freshHazards = segReports.filter((r) => r.kind === "hazard" && now - r.observedAt <= 864e5);
	const freshClears = segReports.filter((r) => r.kind === "clear" && now - r.observedAt <= 432e5);
	const evidence = [...freshHazards, ...freshClears].sort((a, b) => b.observedAt - a.observedAt);
	const base = {
		segmentId,
		latestObservationAt,
		reviewedCount,
		restrictionPastReview: false,
		awaitingClearance: false,
		stale: false
	};
	const restriction = restrictions.filter((r) => r.segmentId === segmentId && isRestrictionInForce(r)).sort((a, b) => LEVEL_RANK[RESTRICTION_LEVEL[b.type]] - LEVEL_RANK[RESTRICTION_LEVEL[a.type]])[0];
	if (restriction) return {
		...base,
		level: RESTRICTION_LEVEL[restriction.type],
		basis: "official",
		restriction,
		restrictionPastReview: now > restriction.reviewBy,
		awaitingClearance: restriction.clearance === "pending",
		evidence: evidence.length ? evidence : segReports.slice(0, 3)
	};
	if (freshHazards.length) {
		if (freshClears.length > 0 || freshHazards.some((r) => r.status === "conflicting")) return {
			...base,
			level: "caution",
			basis: "conflicting",
			evidence
		};
		const high = freshHazards.filter((r) => r.severity === "high");
		const corroborated = high.length >= 2 && high.some((r) => r.status === "verified");
		return {
			...base,
			level: corroborated ? "avoid" : "caution",
			basis: corroborated ? "corroborated" : "single_report",
			evidence
		};
	}
	if (freshClears.filter((r) => r.status === "verified").length) return {
		...base,
		level: "clear",
		basis: "verified_clear",
		evidence
	};
	if (segReports.length) return {
		...base,
		level: "unknown",
		basis: "stale_only",
		stale: true,
		evidence: segReports.slice(0, 3)
	};
	return {
		...base,
		level: "unknown",
		basis: "no_evidence",
		evidence: []
	};
}
function summariseRoute(segments, advisories) {
	const byId = new Map(advisories.map((a) => [a.segmentId, a]));
	let total = 0;
	let unknownKm = 0;
	let level = "clear";
	let hazardCount = 0;
	let restrictionCount = 0;
	let latest;
	let awaitingClearance = false;
	for (const s of segments) {
		const a = byId.get(s.id);
		total += s.distanceKm;
		if (!a || a.level === "unknown") unknownKm += s.distanceKm;
		const l = a?.level ?? "unknown";
		if (LEVEL_RANK[l] > LEVEL_RANK[level]) level = l;
		if (!a) continue;
		hazardCount += a.evidence.filter((r) => r.kind === "hazard").length;
		if (a.restriction) restrictionCount++;
		if (a.awaitingClearance) awaitingClearance = true;
		if (a.latestObservationAt && (!latest || a.latestObservationAt > latest)) latest = a.latestObservationAt;
	}
	const coverage = total ? (total - unknownKm) / total : 0;
	return {
		level,
		coverage,
		unknownKm,
		hazardCount,
		restrictionCount,
		latestObservationAt: latest,
		poorCoverage: coverage < .5,
		awaitingClearance
	};
}
// src/components/advisory.tsx
var LEVEL_META = {
	clear: {
		icon: CircleCheck,
		color: "var(--status-clear)",
		chip: "bg-status-clear/15 border-status-clear",
		bar: "bg-status-clear"
	},
	caution: {
		icon: TriangleAlert,
		color: "var(--status-caution)",
		chip: "bg-status-caution/15 border-status-caution",
		bar: "bg-status-caution"
	},
	avoid: {
		icon: OctagonAlert,
		color: "var(--status-avoid)",
		chip: "bg-status-avoid/15 border-status-avoid",
		bar: "bg-status-avoid"
	},
	do_not_travel: {
		icon: OctagonX,
		color: "var(--status-dnt)",
		chip: "bg-status-dnt/15 border-status-dnt",
		bar: "bg-status-dnt"
	},
	unknown: {
		icon: CircleQuestionMark,
		color: "var(--status-unknown)",
		chip: "bg-status-unknown/15 border-status-unknown",
		bar: "bg-status-unknown"
	}
};
function AdvisoryBadge({ level, size = "sm", className }) {
	const { t } = usePrefs();
	const meta = LEVEL_META[level];
	const Icon = meta.icon;
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border font-semibold text-foreground", size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs", meta.chip, className),
		children: [/* @__PURE__ */ jsx(Icon, {
			"aria-hidden": true,
			className: size === "lg" ? "size-4" : "size-3.5",
			style: { color: meta.color }
		}), t(`level.${level}`)]
	});
}
function ActionBadge({ level, size = "sm", className }) {
	return /* @__PURE__ */ jsx(AdvisoryBadge, {
		level,
		size,
		className
	});
}
var FRESHNESS_META = {
	fresh: {
		icon: CheckCircle2,
		color: "var(--blue-on-dark)",
		chip: "border-blue-on-dark/50 bg-brand-blue/15"
	},
	stale: {
		icon: Clock,
		color: "var(--status-stale)",
		chip: "border-status-stale/50 bg-status-stale/10"
	},
	unknown: {
		icon: CircleQuestionMark,
		color: "var(--status-unknown)",
		chip: "border-status-unknown/50 bg-status-unknown/10"
	}
};
function FreshnessChip({ sourceTimestamp, className }) {
	const { t, ago, now } = usePrefs();
	const state = getFreshnessState(sourceTimestamp, now);
	const meta = FRESHNESS_META[state];
	const Icon = meta.icon;
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium text-foreground", meta.chip, className),
		children: [
			/* @__PURE__ */ jsx(Icon, {
				"aria-hidden": true,
				className: "size-3.5",
				style: { color: meta.color }
			}),
			t(`freshness.${state}`),
			sourceTimestamp && state !== "unknown" ? ` · ${ago(sourceTimestamp)}` : ""
		]
	});
}
function OfficialBadge({ label, className }) {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border border-status-official bg-status-official/15 px-2.5 py-0.5 text-xs font-semibold text-foreground", className),
		children: [/* @__PURE__ */ jsx(ShieldCheck, {
			"aria-hidden": true,
			className: "size-3.5 text-status-official"
		}), label ?? t("level.official")]
	});
}
function DemoBadge({ className }) {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-md border border-border bg-background/70 px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide text-muted-foreground", className),
		children: [/* @__PURE__ */ jsx(FlaskConical, {
			"aria-hidden": true,
			className: "size-3"
		}), t("demo.badge")]
	});
}
function RoadCode({ children, className }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn("font-mono text-xs font-medium tracking-tight text-muted-foreground", className),
		children
	});
}
// src/lib/data.ts
var cache = null;
var cachedAt;
function getAdvisories(now = DEMO_NOW) {
	if (!cache || cachedAt !== now) {
		cache = new Map(SEGMENTS.map((s) => [s.id, computeSegmentAdvisory(s.id, REPORTS, RESTRICTIONS, now)]));
		cachedAt = now;
	}
	return cache;
}
var advisoryFor = (segmentId, now = DEMO_NOW) => getAdvisories(now).get(segmentId);
var reportByRef = (ref) => REPORTS.find((r) => r.ref === ref);
export { AdvisoryBadge as a, LEVEL_META as c, getAdvisorySourceTimestamp as d, getFreshnessState as f, ActionBadge as i, OfficialBadge as l, getAdvisories as n, DemoBadge as o, summariseRoute as p, reportByRef as r, FreshnessChip as s, advisoryFor as t, RoadCode as u };
