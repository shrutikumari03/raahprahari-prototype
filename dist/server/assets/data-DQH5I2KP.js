import { d as SEGMENTS, l as REPORTS, o as DEMO_NOW, u as RESTRICTIONS } from "./preferences-En5FkRWn.js";
import { c as computeSegmentAdvisory } from "./advisory-DwhbdhLm.js";
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
