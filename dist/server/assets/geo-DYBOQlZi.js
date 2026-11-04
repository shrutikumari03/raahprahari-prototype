import { c as PLACES, f as SEGMENTS, m as placeById, o as COVERAGE_BOUNDS } from "./storage-_UOyJnYK.js";
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
/** Approximate distance (km) from a point to a straight segment between two places. */
function pointToSegmentKm(lat, lon, s) {
	const a = placeById(s.from);
	const b = placeById(s.to);
	const k = Math.cos(lat * Math.PI / 180);
	const ax = a.lon * k, ay = a.lat, bx = b.lon * k, by = b.lat, px = lon * k, py = lat;
	const dx = bx - ax, dy = by - ay;
	const tt = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
	const cx = ax + tt * dx, cy = ay + tt * dy;
	return Math.hypot(px - cx, py - cy) * 111;
}
/** Road sections near a point, nearest first. */
function nearbySegments(lat, lon, withinKm = 12) {
	return SEGMENTS.map((segment) => ({
		segment,
		km: pointToSegmentKm(lat, lon, segment)
	})).filter((x) => x.km <= withinKm).sort((a, b) => a.km - b.km);
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
export { nearestPlace as i, inCoverage as n, nearbySegments as r, getCurrentPosition as t };
