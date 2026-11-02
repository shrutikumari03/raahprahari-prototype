import { a as cn, r as useLocalState, t as STORAGE_KEYS } from "./storage-wbzgXpjQ.js";
import { t as Button } from "./button-DxFltwjo.js";
import { d as SEGMENTS, i as CORRIDORS, p as placeById, r as usePrefs } from "./preferences-fp02ms8_.js";
import { a as Route$1, c as FreshnessChip, d as RoadCode, l as LEVEL_META, o as ActionBadge, p as summariseRoute } from "./router-Dv_byq0j.js";
import { t as advisoryFor } from "./data-F-5sDpLM.js";
import { n as MapLegend, r as SchematicMap, t as SegmentDetail } from "./segment-detail-DjWFO08H.js";
import { t as RouteSearchCard } from "./route-search-Bdob1mo-.js";
import { n as routeLabel, t as findSeededRoutes } from "./routing-BBitn4d6.js";
import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Bookmark, BookmarkCheck, Info, List, Map, Route, ShieldCheck, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
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
	const advisories = route.segments.map((segment) => advisoryFor(segment.id)).filter((advisory) => advisory !== void 0);
	const timestamps = advisories.flatMap((advisory) => [...advisory.latestObservationAt ? [advisory.latestObservationAt] : [], ...advisory.restriction ? [advisory.restriction.publishedAt] : []]);
	const latestSourceAt = timestamps.length ? Math.max(...timestamps) : void 0;
	const sources = [...advisories.some((advisory) => advisory.evidence.length > 0) ? [t("source.community")] : [], ...advisories.some((advisory) => !!advisory.restriction) ? [t("source.official")] : []];
	return /* @__PURE__ */ jsxs("article", {
		className: cn("flex flex-col rounded-2xl border bg-card p-5 transition-colors", selected ? "border-foreground/60 ring-1 ring-foreground/30" : "border-border"),
		"aria-label": `Route ${letter}`,
		children: [
			/* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: onSelect,
				"aria-pressed": selected,
				className: "-m-2 rounded-xl p-2 text-left",
				children: [
					/* @__PURE__ */ jsxs("div", {
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
						})] }), /* @__PURE__ */ jsx(ActionBadge, { level: summary.level })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-2 flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ jsx(FreshnessChip, { sourceTimestamp: latestSourceAt }), /* @__PURE__ */ jsx("span", {
							className: "text-xs text-muted-foreground",
							children: sources.length ? sources.join(" · ") : t("source.unknown")
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-3 flex h-2 overflow-hidden rounded-full bg-muted",
						"aria-hidden": true,
						children: route.segments.map((s) => {
							const l = advisoryFor(s.id)?.level ?? "unknown";
							return /* @__PURE__ */ jsx("span", {
								className: cn("h-full border-r border-card last:border-0", LEVEL_META[l].bar, l === "unknown" && "opacity-50"),
								style: { width: `${s.distanceKm / route.distanceKm * 100}%` }
							}, s.id);
						})
					})
				]
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
						children: [/* @__PURE__ */ jsx(Map, {}), t("results.compare")]
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
				children: [/* @__PURE__ */ jsx("h1", {
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
				}), !journey && /* @__PURE__ */ jsx("p", {
					className: "max-w-2xl text-muted-foreground",
					children: t("adv.body")
				})]
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
								children: [v === "map" ? /* @__PURE__ */ jsx(Map, {
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
	const { t, place } = usePrefs();
	const a = advisoryFor(segment.id);
	if (!a) throw new Error(`Missing advisory for segment "${segment.id}"`);
	const hazards = a.evidence.filter((r) => r.kind === "hazard").length;
	const sources = [...a.evidence.length > 0 ? [t("source.community")] : [], ...a.restriction ? [t("source.official")] : []];
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
				(hazards > 0 || a.restriction) && /* @__PURE__ */ jsxs("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [hazards > 0 && /* @__PURE__ */ jsxs("span", {
						className: "ml-2 inline-flex items-center gap-1",
						children: [
							/* @__PURE__ */ jsx(TriangleAlert, {
								"aria-hidden": true,
								className: "size-3"
							}),
							" ",
							hazards,
							" ",
							t("map.hazard")
						]
					}), a.restriction && /* @__PURE__ */ jsxs("span", {
						className: "ml-2 inline-flex items-center gap-1",
						children: [
							/* @__PURE__ */ jsx(ShieldCheck, {
								"aria-hidden": true,
								className: "size-3 text-status-official"
							}),
							" ",
							t(`restriction.${a.restriction.type}`)
						]
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: sources.length ? sources.join(" · ") : t("source.unknown")
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-1.5 sm:justify-end",
			children: [/* @__PURE__ */ jsx(ActionBadge, { level: a.level }), /* @__PURE__ */ jsx(FreshnessChip, { sourceTimestamp: a.latestObservationAt ?? a.restriction?.publishedAt })]
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
