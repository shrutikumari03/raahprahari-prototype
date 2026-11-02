import { a as COVERAGE_BOUNDS, d as SEGMENTS, p as placeById, s as PLACES } from "./preferences-Bu-IUfe0.js";
// src/lib/geo.ts
var inCoverage = (lat, lon) => lat >= COVERAGE_BOUNDS.minLat && lat <= COVERAGE_BOUNDS.maxLat && lon >= COVERAGE_BOUNDS.minLon && lon <= COVERAGE_BOUNDS.maxLon;
function haversineKm(aLat, aLon, bLat, bLon) {
	const R = 6371;
	const dLat = (bLat - aLat) * Math.PI / 180;
	const dLon = (bLon - aLon) * Math.PI / 180;
	const x = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * Math.PI / 180) * Math.cos(bLat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(x));
}
function nearestPlace(lat, lon) {
	return PLACES.reduce((best, p) => haversineKm(lat, lon, p.lat, p.lon) < haversineKm(lat, lon, best.lat, best.lon) ? p : best);
}
function getCurrentPosition() {
	return new Promise((resolve) => {
		if (typeof navigator === "undefined" || !navigator.geolocation) {
			resolve({
				ok: false,
				reason: "unavailable"
			});
			return;
		}
		navigator.geolocation.getCurrentPosition((pos) => resolve({
			ok: true,
			lat: pos.coords.latitude,
			lon: pos.coords.longitude,
			accuracyM: pos.coords.accuracy
		}), (err) => resolve({
			ok: false,
			reason: err.code === err.PERMISSION_DENIED ? "denied" : "unavailable"
		}), {
			enableHighAccuracy: false,
			timeout: 1e4,
			maximumAge: 6e4
		});
	});
}
// src/features/routes/routing.ts
var MAX_ROUTES = 3;
var graph = /* @__PURE__ */ new Map();
for (const s of SEGMENTS) {
	graph.set(s.from, [...graph.get(s.from) ?? [], {
		to: s.to,
		segment: s
	}]);
	graph.set(s.to, [...graph.get(s.to) ?? [], {
		to: s.from,
		segment: s
	}]);
}
function findSeededRoutes(fromId, toId) {
	if (fromId === toId || !graph.has(fromId) || !graph.has(toId)) return [];
	const found = [];
	const visit = (node, nodes, segs) => {
		if (found.length > 50 || segs.length > 16) return;
		if (node === toId) {
			found.push({
				nodes,
				segs
			});
			return;
		}
		for (const e of graph.get(node) ?? []) {
			if (nodes.includes(e.to)) continue;
			visit(e.to, [...nodes, e.to], [...segs, e.segment]);
		}
	};
	visit(fromId, [fromId], []);
	return found.map(({ nodes, segs }) => ({
		id: nodes.join(">"),
		segments: segs,
		distanceKm: segs.reduce((n, s) => n + s.distanceKm, 0),
		typicalMinutes: segs.reduce((n, s) => n + s.typicalMinutes, 0),
		via: nodes.slice(1, -1),
		corridorIds: [...new Set(segs.map((s) => s.corridorId))]
	})).sort((a, b) => a.typicalMinutes - b.typicalMinutes).slice(0, MAX_ROUTES);
}
function routeLabel(r, lang) {
	const names = r.via.filter((_, i, arr) => arr.length <= 3 || i % Math.ceil(arr.length / 3) === 0).map((id) => lang === "hi" ? placeById(id)?.nameHi : placeById(id)?.name);
	return names.length ? names.join(" · ") : "—";
}
export { nearestPlace as a, inCoverage as i, routeLabel as n, getCurrentPosition as r, findSeededRoutes as t };
