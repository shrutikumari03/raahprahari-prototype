import { d as SEGMENTS, p as placeById } from "./preferences-fp02ms8_.js";
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
export { routeLabel as n, findSeededRoutes as t };
