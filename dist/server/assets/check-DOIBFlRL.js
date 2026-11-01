import { _ as Button, a as useLocalState, g as segmentById, h as placeById, i as STORAGE_KEYS, l as PLACES, m as corridorById, n as Route$1, o as CORRIDORS, p as SEGMENTS, r as usePrefs, u as QUICK_PICKS, v as cn } from "./router-BPRhBg53.js";
import { a as AdvisoryBadge, c as OfficialBadge, i as RouteSearchCard, l as RoadCode, n as getAdvisories, o as DemoBadge, r as summariseRoute, s as LEVEL_META, t as advisoryFor, u as StaleBadge } from "./data-BsUs-u2H.js";
import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Bookmark, BookmarkCheck, Camera, Copy, GitCompare, Info, List, Map as Map$1, MapPin, Route, ShieldCheck, TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";
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
// src/features/routes/route-card.tsx
function Metric({ label, value, mono }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
		className: "text-xs text-muted-foreground",
		children: label
	}), /* @__PURE__ */ jsx("dd", {
		className: cn("mt-0.5 font-semibold", mono && "font-mono text-sm"),
		children: value
	})] });
}
function RouteCard({ route, summary, index, selected, saved, onSelect, onCompare, onDetails, onToggleSave }) {
	const { t, lang, ago, duration } = usePrefs();
	const letter = String.fromCharCode(65 + index);
	return /* @__PURE__ */ jsxs("article", {
		className: cn("flex flex-col rounded-2xl border bg-card p-5 transition-colors", selected ? "border-foreground/60 ring-1 ring-foreground/30" : "border-border"),
		"aria-label": `Route ${letter}`,
		children: [
			/* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: onSelect,
				"aria-pressed": selected,
				className: "-m-2 rounded-xl p-2 text-left",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
						className: "font-mono text-xs text-muted-foreground",
						children: ["ROUTE ", letter]
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-0.5 font-display text-lg leading-snug font-semibold",
						children: [
							t("results.via"),
							" ",
							routeLabel(route, lang)
						]
					})] }), /* @__PURE__ */ jsx(AdvisoryBadge, { level: summary.level })]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-3 flex h-2 overflow-hidden rounded-full bg-muted",
					"aria-hidden": true,
					children: route.segments.map((s) => {
						const l = advisoryFor(s.id)?.level ?? "unknown";
						return /* @__PURE__ */ jsx("span", {
							className: cn("h-full border-r border-card last:border-0", LEVEL_META[l].bar, l === "unknown" && "opacity-50"),
							style: { width: `${s.distanceKm / route.distanceKm * 100}%` }
						}, s.id);
					})
				})]
			}),
			/* @__PURE__ */ jsxs("dl", {
				className: "mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ jsx(Metric, {
						label: t("results.distance"),
						value: `${route.distanceKm} ${t("common.km")}`
					}),
					/* @__PURE__ */ jsx(Metric, {
						label: t("results.duration"),
						value: duration(route.typicalMinutes)
					}),
					/* @__PURE__ */ jsx(Metric, {
						label: t("results.coverage"),
						value: `${Math.round(summary.coverage * 100)}%`
					}),
					/* @__PURE__ */ jsx(Metric, {
						label: t("results.latest"),
						value: summary.latestObservationAt ? ago(summary.latestObservationAt) : "—"
					}),
					/* @__PURE__ */ jsx(Metric, {
						label: t("results.hazards"),
						value: summary.hazardCount
					}),
					/* @__PURE__ */ jsx(Metric, {
						label: t("results.restrictions"),
						value: summary.restrictionCount
					}),
					/* @__PURE__ */ jsx(Metric, {
						label: t("results.unknownKm"),
						value: `${summary.unknownKm} ${t("common.km")}`
					})
				]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: t("results.typical")
			}),
			summary.awaitingClearance && /* @__PURE__ */ jsx("p", {
				className: "mt-3 rounded-lg border border-dashed border-status-official px-3 py-2 text-sm",
				children: t("copy.awaitingClearance")
			}),
			summary.poorCoverage && /* @__PURE__ */ jsxs("p", {
				className: "mt-3 flex gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm",
				children: [/* @__PURE__ */ jsx(Info, {
					"aria-hidden": true,
					className: "mt-0.5 size-4 shrink-0 text-muted-foreground"
				}), t("copy.poorCoverage")]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-auto grid grid-cols-2 gap-2 pt-5",
				children: [
					/* @__PURE__ */ jsxs(Button, {
						variant: "secondary",
						className: "h-auto min-h-11 rounded-xl py-2 whitespace-normal",
						onClick: onCompare,
						children: [/* @__PURE__ */ jsx(Map$1, {}), t("results.compare")]
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "secondary",
						className: "h-auto min-h-11 rounded-xl py-2 whitespace-normal",
						onClick: onDetails,
						children: [/* @__PURE__ */ jsx(List, {}), t("results.details")]
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						className: "h-auto min-h-11 rounded-xl py-2 whitespace-normal",
						onClick: onToggleSave,
						"aria-pressed": saved,
						children: [saved ? /* @__PURE__ */ jsx(BookmarkCheck, {}) : /* @__PURE__ */ jsx(Bookmark, {}), saved ? t("results.saved") : t("results.save")]
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						className: "h-auto min-h-11 rounded-xl py-2 whitespace-normal",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/report",
							search: { segment: route.segments[0]?.id },
							children: [/* @__PURE__ */ jsx(TriangleAlert, {}), t("results.reportHere")]
						})
					})
				]
			})
		]
	});
}
// src/features/routes/schematic-map.tsx
var VIEW = {
	minLon: 77.75,
	maxLon: 80.55,
	minLat: 28.85,
	maxLat: 31.2
};
var W = 1e3;
var H = 970;
var project = (lat, lon) => ({
	x: (lon - VIEW.minLon) / (VIEW.maxLon - VIEW.minLon) * W,
	y: (VIEW.maxLat - lat) / (VIEW.maxLat - VIEW.minLat) * H
});
var unproject = (x, y) => ({
	lon: VIEW.minLon + x / W * (VIEW.maxLon - VIEW.minLon),
	lat: VIEW.maxLat - y / H * (VIEW.maxLat - VIEW.minLat)
});
function SchematicMap({ highlight, endpoints, selectedSegmentId, onSelectSegment, onPickPoint, pin, className }) {
	const { t, place } = usePrefs();
	const advisories = getAdvisories();
	const highlightSet = useMemo(() => new Set(highlight ?? []), [highlight]);
	const hasHighlight = highlightSet.size > 0;
	const labelIds = /* @__PURE__ */ new Set([...QUICK_PICKS, ...endpoints ?? []]);
	const stopIds = new Set(SEGMENTS.flatMap((s) => [s.from, s.to]));
	const handleSvgClick = (e) => {
		if (!onPickPoint) return;
		const svg = e.currentTarget;
		const pt = svg.createSVGPoint();
		pt.x = e.clientX;
		pt.y = e.clientY;
		const ctm = svg.getScreenCTM();
		if (!ctm) return;
		const p = pt.matrixTransform(ctm.inverse());
		const { lat, lon } = unproject(p.x, p.y);
		onPickPoint(lat, lon);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: cn("relative overflow-hidden rounded-2xl border border-border bg-card rp-grid-bg", className),
		children: [/* @__PURE__ */ jsxs("svg", {
			viewBox: `0 0 ${W} ${H}`,
			className: cn("block h-auto w-full", onPickPoint && "cursor-crosshair"),
			role: "group",
			"aria-label": t("map.schematic"),
			onClick: handleSvgClick,
			children: [
				SEGMENTS.map((s) => {
					const a = placeById(s.from);
					const b = placeById(s.to);
					const pa = project(a.lat, a.lon);
					const pb = project(b.lat, b.lon);
					const adv = advisories.get(s.id);
					const level = adv?.level ?? "unknown";
					const inRoute = highlightSet.has(s.id);
					const dim = hasHighlight && !inRoute;
					const selected = s.id === selectedSegmentId;
					const dashed = level === "unknown";
					const label = `${s.code}, ${place(s.from)} – ${place(s.to)}: ${t(`level.${level}`)}${adv?.stale ? `, ${t("level.stale")}` : ""}`;
					const interactive = !!onSelectSegment;
					return /* @__PURE__ */ jsxs("g", {
						role: interactive ? "button" : void 0,
						tabIndex: interactive ? 0 : void 0,
						"aria-label": interactive ? label : void 0,
						"aria-pressed": interactive ? selected : void 0,
						onClick: (e) => {
							if (!interactive) return;
							e.stopPropagation();
							onSelectSegment(s.id);
						},
						onKeyDown: (e) => {
							if (interactive && (e.key === "Enter" || e.key === " ")) {
								e.preventDefault();
								onSelectSegment(s.id);
							}
						},
						className: cn(interactive && "cursor-pointer outline-none [&:focus-visible>line.focus]:opacity-100"),
						opacity: dim ? .28 : 1,
						children: [
							/* @__PURE__ */ jsx("title", { children: label }),
							/* @__PURE__ */ jsx("line", {
								x1: pa.x,
								y1: pa.y,
								x2: pb.x,
								y2: pb.y,
								stroke: "transparent",
								strokeWidth: 30
							}),
							/* @__PURE__ */ jsx("line", {
								className: "focus opacity-0",
								x1: pa.x,
								y1: pa.y,
								x2: pb.x,
								y2: pb.y,
								stroke: "var(--ring)",
								strokeWidth: 22,
								strokeLinecap: "round"
							}),
							selected && /* @__PURE__ */ jsx("line", {
								x1: pa.x,
								y1: pa.y,
								x2: pb.x,
								y2: pb.y,
								stroke: "var(--foreground)",
								strokeWidth: 18,
								strokeLinecap: "round",
								opacity: .9
							}),
							/* @__PURE__ */ jsx("line", {
								x1: pa.x,
								y1: pa.y,
								x2: pb.x,
								y2: pb.y,
								stroke: LEVEL_META[level].color,
								strokeWidth: inRoute || selected ? 11 : 7,
								strokeLinecap: "round",
								strokeDasharray: dashed ? "4 14" : void 0
							})
						]
					}, s.id);
				}),
				SEGMENTS.map((s) => {
					const adv = advisories.get(s.id);
					if (!adv) return null;
					const a = placeById(s.from);
					const b = placeById(s.to);
					const pa = project(a.lat, a.lon);
					const pb = project(b.lat, b.lon);
					const mx = (pa.x + pb.x) / 2;
					const my = (pa.y + pb.y) / 2;
					const hazards = adv.evidence.filter((r) => r.kind === "hazard").length;
					const dim = hasHighlight && !highlightSet.has(s.id);
					return /* @__PURE__ */ jsxs("g", {
						pointerEvents: "none",
						opacity: dim ? .3 : 1,
						children: [hazards > 0 && /* @__PURE__ */ jsxs("g", {
							transform: `translate(${mx + (adv.restriction ? 20 : 0)}, ${my - 4})`,
							children: [/* @__PURE__ */ jsx("circle", {
								r: 17,
								fill: "var(--card)",
								stroke: LEVEL_META[adv.level].color,
								strokeWidth: 3
							}), /* @__PURE__ */ jsx(TriangleAlert, {
								x: -10,
								y: -11,
								width: 20,
								height: 20,
								color: "var(--foreground)"
							})]
						}), adv.restriction && /* @__PURE__ */ jsxs("g", {
							transform: `translate(${mx - (hazards ? 20 : 0)}, ${my - 4})`,
							children: [/* @__PURE__ */ jsx("circle", {
								r: 17,
								fill: "var(--action-blue)",
								stroke: "var(--card)",
								strokeWidth: 3
							}), /* @__PURE__ */ jsx(ShieldCheck, {
								x: -10,
								y: -10,
								width: 20,
								height: 20,
								color: "#ffffff"
							})]
						})]
					}, `m-${s.id}`);
				}),
				PLACES.filter((p) => stopIds.has(p.id)).map((p) => {
					const { x, y } = project(p.lat, p.lon);
					const isEnd = endpoints?.includes(p.id);
					const showLabel = labelIds.has(p.id);
					return /* @__PURE__ */ jsxs("g", {
						pointerEvents: "none",
						children: [/* @__PURE__ */ jsx("circle", {
							cx: x,
							cy: y,
							r: isEnd ? 11 : showLabel ? 7 : 4.5,
							fill: isEnd ? "var(--brand-orange)" : "var(--foreground)",
							stroke: "var(--card)",
							strokeWidth: 3
						}), showLabel && /* @__PURE__ */ jsx("text", {
							x: x + 14,
							y: y + 8,
							fontSize: isEnd ? 28 : 24,
							fontWeight: isEnd ? 700 : 500,
							fill: "var(--foreground)",
							stroke: "var(--card)",
							strokeWidth: 6,
							paintOrder: "stroke",
							style: { fontFamily: "var(--font-body)" },
							children: place(p.id)
						})]
					}, p.id);
				}),
				pin && /* @__PURE__ */ jsxs("g", {
					transform: `translate(${project(pin.lat, pin.lon).x}, ${project(pin.lat, pin.lon).y})`,
					pointerEvents: "none",
					children: [/* @__PURE__ */ jsx("circle", {
						r: 22,
						fill: "var(--brand-orange)",
						opacity: .25
					}), /* @__PURE__ */ jsx("circle", {
						r: 9,
						fill: "var(--brand-orange)",
						stroke: "#111719",
						strokeWidth: 3
					})]
				})
			]
		}), /* @__PURE__ */ jsx("p", {
			className: "pointer-events-none absolute right-3 bottom-2 font-mono text-[10px] text-muted-foreground",
			children: t("map.schematic")
		})]
	});
}
function MapLegend({ className }) {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("div", {
		className: cn("rounded-2xl border border-border bg-card p-4", className),
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase",
				children: t("map.legend")
			}),
			/* @__PURE__ */ jsxs("ul", {
				className: "grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3 xl:grid-cols-2",
				children: [
					[
						"clear",
						"caution",
						"avoid",
						"do_not_travel",
						"unknown"
					].map((l) => {
						const Icon = LEVEL_META[l].icon;
						return /* @__PURE__ */ jsxs("li", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("svg", {
									width: "28",
									height: "8",
									"aria-hidden": true,
									children: /* @__PURE__ */ jsx("line", {
										x1: "4",
										y1: "4",
										x2: "24",
										y2: "4",
										stroke: LEVEL_META[l].color,
										strokeWidth: "5",
										strokeLinecap: "round",
										strokeDasharray: l === "unknown" ? "2 5" : void 0
									})
								}),
								/* @__PURE__ */ jsx(Icon, {
									"aria-hidden": true,
									className: "size-3.5",
									style: { color: LEVEL_META[l].color }
								}),
								t(`level.${l}`)
							]
						}, l);
					}),
					/* @__PURE__ */ jsxs("li", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							"aria-hidden": true,
							className: "inline-flex size-5 items-center justify-center rounded-full border-2 border-status-caution bg-card",
							children: /* @__PURE__ */ jsx(TriangleAlert, { className: "size-3" })
						}), t("map.hazard")]
					}),
					/* @__PURE__ */ jsxs("li", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							"aria-hidden": true,
							className: "inline-flex size-5 items-center justify-center rounded-full bg-action-blue text-white",
							children: /* @__PURE__ */ jsx(ShieldCheck, { className: "size-3" })
						}), t("map.restriction")]
					})
				]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-3 border-t border-border pt-3 text-xs text-muted-foreground",
				children: t("map.layers")
			})
		]
	});
}
// src/features/routes/segment-detail.tsx
function Block({ title, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "border-t border-border py-3.5",
		children: [/* @__PURE__ */ jsx("h4", {
			className: "mb-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase",
			children: title
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-1.5 text-sm",
			children
		})]
	});
}
function ReportCard({ report }) {
	const { t, ago, stamp } = usePrefs();
	const isHazard = report.kind === "hazard";
	return /* @__PURE__ */ jsxs("li", {
		className: "rounded-xl border border-border bg-raised/60 p-3.5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "flex items-center gap-2 font-semibold",
					children: [isHazard ? /* @__PURE__ */ jsx(TriangleAlert, {
						"aria-hidden": true,
						className: "size-4 text-status-caution"
					}) : /* @__PURE__ */ jsx(MapPin, {
						"aria-hidden": true,
						className: "size-4 text-muted-foreground"
					}), isHazard ? `${t(`hazard.${report.hazardType}`)} · ${t(`sev.${report.severity}`)}` : t("kind.clear")]
				}), /* @__PURE__ */ jsx(RoadCode, { children: report.ref })]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1.5 text-sm text-muted-foreground",
				children: report.description
			}),
			/* @__PURE__ */ jsxs("dl", {
				className: "mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 text-xs",
				children: [
					/* @__PURE__ */ jsx("dt", {
						className: "text-muted-foreground",
						children: t("segment.observedAgo")
					}),
					/* @__PURE__ */ jsx("dd", {
						title: stamp(report.observedAt),
						children: ago(report.observedAt)
					}),
					/* @__PURE__ */ jsx("dt", {
						className: "text-muted-foreground",
						children: t("segment.status")
					}),
					/* @__PURE__ */ jsx("dd", { children: t(`status.${report.status}`) }),
					/* @__PURE__ */ jsx("dt", {
						className: "text-muted-foreground",
						children: t("segment.source")
					}),
					/* @__PURE__ */ jsx("dd", { children: t(`source.${report.source}`) }),
					/* @__PURE__ */ jsx("dt", {
						className: "text-muted-foreground",
						children: t("segment.locConf")
					}),
					/* @__PURE__ */ jsx("dd", { children: t(`conf.${report.locationConfidence}`) })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-2.5 flex flex-wrap gap-1.5 text-xs",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "rounded-full border border-border px-2 py-0.5",
						children: t("copy.notOfficial")
					}),
					report.landmark && /* @__PURE__ */ jsx("span", {
						className: "rounded-full bg-accent px-2 py-0.5",
						children: report.landmark
					}),
					report.photoCount > 0 && /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5",
						children: [
							/* @__PURE__ */ jsx(Camera, {
								"aria-hidden": true,
								className: "size-3"
							}),
							" ",
							report.photoCount,
							" ",
							t("segment.photos")
						]
					}),
					report.conflictsWith && /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1 rounded-full border border-status-caution/70 px-2 py-0.5",
						children: [
							/* @__PURE__ */ jsx(GitCompare, {
								"aria-hidden": true,
								className: "size-3"
							}),
							" ",
							t("segment.conflict"),
							" ",
							report.conflictsWith
						]
					}),
					report.duplicateOf && /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5",
						children: [
							/* @__PURE__ */ jsx(Copy, {
								"aria-hidden": true,
								className: "size-3"
							}),
							" ",
							t("segment.duplicate"),
							" ",
							report.duplicateOf
						]
					})
				]
			})
		]
	});
}
function SegmentDetail({ segmentId, onClose, className }) {
	const { t, ago, stamp, place } = usePrefs();
	const seg = segmentId ? segmentById(segmentId) : void 0;
	const adv = segmentId ? advisoryFor(segmentId) : void 0;
	if (!seg || !adv) return /* @__PURE__ */ jsxs("div", {
		className: cn("flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center", className),
		children: [/* @__PURE__ */ jsx(MapPin, {
			"aria-hidden": true,
			className: "mb-2 size-6 text-muted-foreground"
		}), /* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: t("segment.select")
		})]
	});
	const corridor = corridorById(seg.corridorId);
	const latestHazard = adv.evidence.filter((r) => r.kind === "hazard")[0];
	const unverified = adv.evidence.some((r) => r.kind === "hazard" && r.status !== "verified");
	const sources = new Set(adv.evidence.map((r) => r.source));
	const r = adv.restriction;
	return /* @__PURE__ */ jsxs("section", {
		"aria-labelledby": "seg-title",
		className: cn("rounded-2xl border border-border bg-card p-5", className),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs(RoadCode, { children: [
						seg.code,
						" · km ",
						seg.kmStart,
						"–",
						seg.kmEnd
					] }),
					/* @__PURE__ */ jsxs("h3", {
						id: "seg-title",
						className: "mt-1 font-display text-xl font-semibold",
						children: [
							place(seg.from),
							" – ",
							place(seg.to)
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: corridor?.name
					})
				] }), onClose && /* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					size: "icon-lg",
					className: "-mt-1 -mr-2 rounded-full",
					onClick: onClose,
					"aria-label": t("segment.close"),
					children: /* @__PURE__ */ jsx(X, {})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ jsx(AdvisoryBadge, {
						level: adv.level,
						size: "lg"
					}),
					adv.stale && /* @__PURE__ */ jsx(StaleBadge, { age: adv.latestObservationAt ? ago(adv.latestObservationAt) : void 0 }),
					r && /* @__PURE__ */ jsx(OfficialBadge, { label: t(`restriction.${r.type}`) }),
					adv.awaitingClearance && /* @__PURE__ */ jsx("span", {
						className: "rounded-full border border-dashed border-status-official px-2.5 py-0.5 text-xs font-medium",
						children: t("copy.awaitingClearance")
					})
				]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-xs font-medium text-muted-foreground",
				children: t("copy.estimate")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3",
				children: [
					/* @__PURE__ */ jsx(Block, {
						title: t("segment.observed"),
						children: latestHazard ? /* @__PURE__ */ jsxs("p", { children: [
							t(`hazard.${latestHazard.hazardType}`),
							" · ",
							t(`sev.${latestHazard.severity}`),
							" — ",
							latestHazard.description
						] }) : adv.basis === "verified_clear" ? /* @__PURE__ */ jsx("p", { children: t("kind.clear") }) : /* @__PURE__ */ jsx("p", { children: t("copy.noRecent") })
					}),
					/* @__PURE__ */ jsxs(Block, {
						title: t("segment.action"),
						children: [/* @__PURE__ */ jsx("p", {
							className: "font-medium",
							children: t(`action.${adv.level}`)
						}), (adv.level === "unknown" || adv.level === "clear") && /* @__PURE__ */ jsx("p", {
							className: "text-muted-foreground",
							children: t("copy.noReportNotSafe")
						})]
					}),
					/* @__PURE__ */ jsx(Block, {
						title: t("segment.official"),
						children: r ? /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-status-official/50 bg-status-official/10 p-3",
							children: [
								/* @__PURE__ */ jsxs("p", {
									className: "flex items-center gap-2 font-semibold",
									children: [
										/* @__PURE__ */ jsx(ShieldCheck, {
											"aria-hidden": true,
											className: "size-4 text-status-official"
										}),
										t(`restriction.${r.type}`),
										" — ",
										r.title
									]
								}),
								/* @__PURE__ */ jsxs("dl", {
									className: "mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs",
									children: [
										/* @__PURE__ */ jsx("dt", {
											className: "text-muted-foreground",
											children: t("segment.issuedBy")
										}),
										/* @__PURE__ */ jsx("dd", { children: r.issuingAuthority }),
										/* @__PURE__ */ jsx("dt", {
											className: "text-muted-foreground",
											children: t("segment.published")
										}),
										/* @__PURE__ */ jsx("dd", { children: stamp(r.publishedAt) }),
										/* @__PURE__ */ jsx("dt", {
											className: "text-muted-foreground",
											children: t("segment.effective")
										}),
										/* @__PURE__ */ jsx("dd", { children: stamp(r.effectiveFrom) }),
										/* @__PURE__ */ jsx("dt", {
											className: "text-muted-foreground",
											children: t("segment.reviewBy")
										}),
										/* @__PURE__ */ jsx("dd", { children: stamp(r.reviewBy) }),
										/* @__PURE__ */ jsx("dt", {
											className: "text-muted-foreground",
											children: t("segment.status")
										}),
										/* @__PURE__ */ jsx("dd", {
											className: "font-semibold",
											children: t("segment.inForce")
										}),
										/* @__PURE__ */ jsx("dt", {
											className: "text-muted-foreground",
											children: t("segment.ref")
										}),
										/* @__PURE__ */ jsx("dd", {
											className: "font-mono",
											children: r.supportingReference
										})
									]
								}),
								adv.restrictionPastReview && /* @__PURE__ */ jsx("p", {
									className: "mt-2 text-xs font-medium",
									children: t("copy.pastReview")
								})
							]
						}) : /* @__PURE__ */ jsx("p", { children: t("copy.noOfficial") })
					}),
					/* @__PURE__ */ jsxs(Block, {
						title: t("segment.source"),
						children: [adv.latestObservationAt ? /* @__PURE__ */ jsxs("p", { children: [
							t("results.latest"),
							": ",
							/* @__PURE__ */ jsx("span", {
								className: "font-medium",
								children: ago(adv.latestObservationAt)
							}),
							" ",
							/* @__PURE__ */ jsxs("span", {
								className: "text-muted-foreground",
								children: [
									"(",
									stamp(adv.latestObservationAt),
									")"
								]
							})
						] }) : /* @__PURE__ */ jsx("p", { children: t("copy.noRecent") }), sources.size > 0 && /* @__PURE__ */ jsxs("p", {
							className: "text-muted-foreground",
							children: [
								[...sources].map((s) => t(`source.${s}`)).join(" · "),
								" — ",
								adv.evidence.length,
								" ",
								t("segment.reportsCount")
							]
						})]
					}),
					/* @__PURE__ */ jsxs(Block, {
						title: t("segment.uncertainty"),
						children: [
							/* @__PURE__ */ jsx("p", { children: t(`basis.${adv.basis}`) }),
							adv.evidence.length > 0 && /* @__PURE__ */ jsxs("p", {
								className: "text-muted-foreground",
								children: [
									adv.reviewedCount,
									" ",
									t("segment.reviewed"),
									" / ",
									adv.evidence.length
								]
							}),
							unverified && /* @__PURE__ */ jsx("p", {
								className: "text-muted-foreground",
								children: t("copy.communityUnverified")
							})
						]
					})
				]
			}),
			adv.evidence.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "border-t border-border pt-3.5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-2 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ jsx("h4", {
						className: "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
						children: t("segment.reports")
					}), /* @__PURE__ */ jsx(DemoBadge, {})]
				}), /* @__PURE__ */ jsx("ul", {
					className: "space-y-2",
					children: adv.evidence.slice(0, 3).map((rep) => /* @__PURE__ */ jsx(ReportCard, { report: rep }, rep.ref))
				})]
			}),
			/* @__PURE__ */ jsx(Button, {
				asChild: true,
				variant: "outline",
				className: "mt-4 h-11 w-full rounded-xl",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/report",
					search: { segment: seg.id },
					children: [/* @__PURE__ */ jsx(TriangleAlert, {}), t("results.reportHere")]
				})
			})
		]
	});
}
// src/routes/check.tsx?tsr-split=component
function CheckPage() {
	const { t, place } = usePrefs();
	const search = Route$1.useSearch();
	const navigate = Route$1.useNavigate();
	const view = search.view ?? "map";
	const from = search.from && placeById(search.from) ? search.from : null;
	const to = search.to && placeById(search.to) ? search.to : null;
	const journey = !!from && !!to && from !== to;
	const [sort, setSort] = useState("fastest");
	const [selectedRouteId, setSelectedRouteId] = useState(null);
	const [filter, setFilter] = useState("all");
	const [saved, setSaved] = useLocalState(STORAGE_KEYS.savedRoads, []);
	const explorerRef = useRef(null);
	const detailRef = useRef(null);
	const routes = useMemo(() => {
		if (!journey) return [];
		return findSeededRoutes(from, to).map((r) => ({
			route: r,
			summary: summariseRoute(r.segments, r.segments.map((s) => advisoryFor(s.id)))
		})).sort((a, b) => {
			if (sort === "shortest") return a.route.distanceKm - b.route.distanceKm;
			if (sort === "current") return (b.summary.latestObservationAt ?? 0) - (a.summary.latestObservationAt ?? 0) || b.summary.coverage - a.summary.coverage;
			return a.route.typicalMinutes - b.route.typicalMinutes;
		});
	}, [
		journey,
		from,
		to,
		sort
	]);
	const selected = routes.find((r) => r.route.id === selectedRouteId) ?? routes[0];
	const segments = useMemo(() => {
		if (journey) return selected?.route.segments ?? [];
		return SEGMENTS.filter((s) => {
			const a = advisoryFor(s.id);
			if (!a) return false;
			if (filter === "issues") return a.level !== "clear" && a.level !== "unknown";
			if (filter === "official") return !!a.restriction;
			if (filter === "unknown") return a.level === "unknown";
			return true;
		});
	}, [
		journey,
		selected,
		filter
	]);
	const setView = (v) => void navigate({
		search: (prev) => ({
			...prev,
			view: v
		}),
		replace: true,
		resetScroll: false
	});
	const selectSeg = (id) => {
		navigate({
			search: (prev) => ({
				...prev,
				seg: id
			}),
			replace: true,
			resetScroll: false
		});
		if (id && window.matchMedia("(max-width: 1279px)").matches) requestAnimationFrame(() => detailRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		}));
	};
	const goExplorer = (routeId, v) => {
		setSelectedRouteId(routeId);
		setView(v);
		requestAnimationFrame(() => explorerRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		}));
	};
	const toggleSave = (routeId) => {
		if (!from || !to) return;
		const exists = saved.some((s) => s.id === routeId);
		setSaved((prev) => exists ? prev.filter((s) => s.id !== routeId) : [...prev, {
			id: routeId,
			from,
			to,
			savedAt: Date.now()
		}]);
		toast(exists ? t("results.save") : t("results.saved"));
	};
	const highlight = journey ? selected?.route.segments.map((s) => s.id) : void 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "rp-container space-y-8 py-8 md:py-10",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ jsx(DemoBadge, {}),
					/* @__PURE__ */ jsx("h1", {
						className: "font-display text-3xl font-bold md:text-4xl",
						children: journey ? /* @__PURE__ */ jsxs("span", {
							className: "inline-flex flex-wrap items-center gap-x-3",
							children: [
								place(from),
								" ",
								/* @__PURE__ */ jsx(ArrowRight, {
									"aria-hidden": true,
									className: "size-7 text-brand-orange"
								}),
								" ",
								place(to)
							]
						}) : t("adv.title")
					}),
					!journey && /* @__PURE__ */ jsx("p", {
						className: "max-w-2xl text-muted-foreground",
						children: t("adv.body")
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "rounded-2xl border border-border bg-card p-5 md:p-6",
				children: /* @__PURE__ */ jsx(RouteSearchCard, {
					initialFrom: from,
					initialTo: to,
					layout: "inline"
				})
			}),
			journey && /* @__PURE__ */ jsxs("section", {
				"aria-labelledby": "results-title",
				className: "space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						id: "results-title",
						className: "font-display text-2xl font-semibold",
						children: t("results.title")
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ jsx(Route, {
							"aria-hidden": true,
							className: "size-4"
						}), t("results.seeded")]
					})] }), routes.length > 1 && /* @__PURE__ */ jsxs("div", {
						role: "group",
						"aria-label": t("results.sort"),
						className: "flex flex-wrap items-center gap-1.5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mr-1 text-sm text-muted-foreground",
							children: t("results.sort")
						}), [
							"fastest",
							"shortest",
							"current"
						].map((k) => /* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-pressed": sort === k,
							onClick: () => setSort(k),
							className: cn("min-h-10 rounded-full border px-3.5 text-sm", sort === k ? "border-foreground/60 bg-raised font-medium" : "border-border text-muted-foreground hover:text-foreground"),
							children: t(`sort.${k}`)
						}, k))]
					})]
				}), routes.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-dashed border-border p-8 text-center",
					children: [
						/* @__PURE__ */ jsx(Route, {
							"aria-hidden": true,
							className: "mx-auto mb-3 size-8 text-muted-foreground"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "font-display text-lg font-semibold",
							children: t("results.none")
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mx-auto mt-2 max-w-lg text-sm text-muted-foreground",
							children: t("results.noneBody")
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							className: "mt-5 h-11 rounded-xl",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/check",
								search: { view: "list" },
								children: t("nav.advisories")
							})
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: cn("grid gap-4", routes.length > 1 && "lg:grid-cols-2", routes.length > 2 && "xl:grid-cols-3"),
					children: routes.map(({ route, summary }, i) => /* @__PURE__ */ jsx(RouteCard, {
						route,
						summary,
						index: i,
						selected: route.id === selected?.route.id,
						saved: saved.some((s) => s.id === route.id),
						onSelect: () => setSelectedRouteId(route.id),
						onCompare: () => goExplorer(route.id, "map"),
						onDetails: () => goExplorer(route.id, "list"),
						onToggleSave: () => toggleSave(route.id)
					}, route.id))
				})]
			}),
			(!journey || routes.length > 0) && /* @__PURE__ */ jsxs("section", {
				ref: explorerRef,
				"aria-labelledby": "explorer-title",
				className: "scroll-mt-24 space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsx("h2", {
							id: "explorer-title",
							className: "font-display text-2xl font-semibold",
							children: journey ? t("results.sections") : view === "map" ? t("nav.map") : t("nav.advisories")
						}), /* @__PURE__ */ jsx("div", {
							role: "group",
							"aria-label": `${t("view.map")} / ${t("view.list")}`,
							className: "inline-flex rounded-full border border-border p-1",
							children: ["map", "list"].map((v) => /* @__PURE__ */ jsxs("button", {
								type: "button",
								"aria-pressed": view === v,
								onClick: () => setView(v),
								className: cn("inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium", view === v ? "bg-raised text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
								children: [v === "map" ? /* @__PURE__ */ jsx(Map$1, {
									"aria-hidden": true,
									className: "size-4"
								}) : /* @__PURE__ */ jsx(List, {
									"aria-hidden": true,
									className: "size-4"
								}), t(`view.${v}`)]
							}, v))
						})]
					}),
					!journey && view === "list" && /* @__PURE__ */ jsx("div", {
						role: "group",
						"aria-label": t("adv.filter"),
						className: "flex flex-wrap gap-1.5",
						children: [
							"all",
							"issues",
							"official",
							"unknown"
						].map((f) => /* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-pressed": filter === f,
							onClick: () => setFilter(f),
							className: cn("min-h-10 rounded-full border px-3.5 text-sm", filter === f ? "border-foreground/60 bg-raised font-medium" : "border-border text-muted-foreground hover:text-foreground"),
							children: t(`adv.filter${f[0].toUpperCase()}${f.slice(1)}`)
						}, f))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]",
						children: [/* @__PURE__ */ jsx("div", {
							className: "min-w-0 space-y-4",
							children: view === "map" ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SchematicMap, {
								highlight,
								endpoints: journey ? [from, to] : void 0,
								selectedSegmentId: search.seg,
								onSelectSegment: selectSeg
							}), /* @__PURE__ */ jsx(MapLegend, {})] }) : /* @__PURE__ */ jsx(SegmentList, {
								segments,
								grouped: !journey,
								selectedId: search.seg,
								onSelect: selectSeg
							})
						}), /* @__PURE__ */ jsx("div", {
							ref: detailRef,
							className: "scroll-mt-24 xl:sticky xl:top-24 xl:self-start",
							children: /* @__PURE__ */ jsx(SegmentDetail, {
								segmentId: search.seg,
								onClose: search.seg ? () => selectSeg(void 0) : void 0
							})
						})]
					})
				]
			})
		]
	});
}
function SegmentRow({ segment, selected, onSelect }) {
	const { t, place, ago } = usePrefs();
	const a = advisoryFor(segment.id);
	if (!a) return null;
	const hazards = a.evidence.filter((r) => r.kind === "hazard").length;
	return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: onSelect,
		"aria-pressed": selected,
		className: cn("grid w-full gap-2 rounded-xl border p-4 text-left transition-colors sm:grid-cols-[1fr_auto] sm:items-center", selected ? "border-foreground/60 bg-raised" : "border-border bg-card hover:bg-accent"),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ jsxs(RoadCode, { children: [
					segment.code,
					" · km ",
					segment.kmStart,
					"–",
					segment.kmEnd,
					" · ",
					segment.distanceKm,
					" ",
					t("common.km")
				] }),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-0.5 font-semibold",
					children: [
						place(segment.from),
						" – ",
						place(segment.to)
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						a.latestObservationAt ? `${t("results.latest")}: ${ago(a.latestObservationAt)}` : t("copy.noRecent"),
						hazards > 0 && /* @__PURE__ */ jsxs("span", {
							className: "ml-2 inline-flex items-center gap-1",
							children: [
								"· ",
								/* @__PURE__ */ jsx(TriangleAlert, {
									"aria-hidden": true,
									className: "size-3"
								}),
								" ",
								hazards
							]
						}),
						a.restriction && /* @__PURE__ */ jsxs("span", {
							className: "ml-2 inline-flex items-center gap-1",
							children: [
								"· ",
								/* @__PURE__ */ jsx(ShieldCheck, {
									"aria-hidden": true,
									className: "size-3 text-status-official"
								}),
								" ",
								t(`restriction.${a.restriction.type}`)
							]
						})
					]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-1.5 sm:justify-end",
			children: [a.stale && /* @__PURE__ */ jsx(StaleBadge, {}), /* @__PURE__ */ jsx(AdvisoryBadge, { level: a.level })]
		})]
	}) });
}
function SegmentList({ segments, grouped, selectedId, onSelect }) {
	const { t } = usePrefs();
	if (segments.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground",
		children: t("adv.empty")
	});
	if (!grouped) return /* @__PURE__ */ jsx("ol", {
		className: "space-y-2",
		children: segments.map((s) => /* @__PURE__ */ jsx(SegmentRow, {
			segment: s,
			selected: s.id === selectedId,
			onSelect: () => onSelect(s.id)
		}, s.id))
	});
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-6",
		children: CORRIDORS.map((c) => {
			const segs = segments.filter((s) => s.corridorId === c.id);
			if (!segs.length) return null;
			return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
				className: "mb-2 flex items-baseline gap-2",
				children: [/* @__PURE__ */ jsx(RoadCode, {
					className: "text-sm",
					children: c.code
				}), /* @__PURE__ */ jsx("span", {
					className: "font-semibold",
					children: c.name
				})]
			}), /* @__PURE__ */ jsx("ul", {
				className: "space-y-2",
				children: segs.map((s) => /* @__PURE__ */ jsx(SegmentRow, {
					segment: s,
					selected: s.id === selectedId,
					onSelect: () => onSelect(s.id)
				}, s.id))
			})] }, c.id);
		})
	});
}
export { CheckPage as component };
