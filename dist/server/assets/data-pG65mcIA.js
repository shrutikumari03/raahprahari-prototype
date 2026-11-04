import { d as RESTRICTIONS, f as SEGMENTS, s as DEMO_NOW, u as REPORTS } from "./storage-_UOyJnYK.js";
import { c as computeSegmentAdvisory } from "./advisory-BPMF_APe.js";
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
export { getAdvisories as n, reportByRef as r, advisoryFor as t };
