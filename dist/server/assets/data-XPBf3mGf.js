import { d as SEGMENTS, l as REPORTS, o as DEMO_NOW, u as RESTRICTIONS } from "./preferences-Bu-IUfe0.js";
import { f as computeSegmentAdvisory } from "./router-BQGkn71w.js";
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
export { getAdvisories as n, advisoryFor as t };
