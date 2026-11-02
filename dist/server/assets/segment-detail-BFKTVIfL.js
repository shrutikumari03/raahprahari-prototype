import { a as cn } from "./storage-wbzgXpjQ.js";
import { t as Button } from "./button-DxFltwjo.js";
import { c as QUICK_PICKS, d as SEGMENTS, f as corridorById, m as segmentById, p as placeById, r as usePrefs, s as PLACES } from "./preferences-Bu-IUfe0.js";
import { c as OfficialBadge, d as getFreshnessState, i as AdvisoryBadge, l as RoadCode, n as getAdvisories, o as FreshnessChip, r as ActionBadge, s as LEVEL_META, t as advisoryFor, u as getAdvisorySourceTimestamp } from "./data-B3r6UVjM.js";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Camera, CircleQuestionMark, Copy, GitCompare, MapPin, ShieldCheck, TriangleAlert, X } from "lucide-react";
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
function SchematicMap({ highlight, endpoints, labelPlaces, selectedSegmentId, onSelectSegment, onPickPoint, pin, terrain = false, className }) {
	const { t, place } = usePrefs();
	const advisories = getAdvisories();
	const highlightSet = useMemo(() => new Set(highlight ?? []), [highlight]);
	const hasHighlight = highlightSet.size > 0;
	const labelIds = new Set(labelPlaces ?? [...QUICK_PICKS, ...endpoints ?? []]);
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
		className: cn(terrain ? "relative h-full w-full overflow-hidden bg-transparent" : "relative overflow-hidden rounded-2xl border border-border bg-card rp-grid-bg", className),
		children: [/* @__PURE__ */ jsxs("svg", {
			viewBox: `0 0 ${W} ${H}`,
			className: cn(terrain ? "block h-full w-full" : "block h-auto w-full", onPickPoint && "cursor-crosshair"),
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
								stroke: terrain ? "#149bff" : LEVEL_META[level].color,
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
					const unknown = adv.level === "unknown";
					const dim = hasHighlight && !highlightSet.has(s.id);
					return /* @__PURE__ */ jsxs("g", {
						pointerEvents: "none",
						opacity: dim ? .3 : 1,
						children: [
							hazards > 0 && /* @__PURE__ */ jsxs("g", {
								transform: `translate(${mx + (adv.restriction ? 22 : unknown ? 16 : 0)}, ${my - 4})`,
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
							}),
							adv.restriction && /* @__PURE__ */ jsxs("g", {
								transform: `translate(${mx - (hazards ? 22 : unknown ? 16 : 0)}, ${my - 4})`,
								children: [/* @__PURE__ */ jsx("circle", {
									r: 17,
									fill: "var(--status-official)",
									stroke: "var(--card)",
									strokeWidth: 3
								}), /* @__PURE__ */ jsx(ShieldCheck, {
									x: -10,
									y: -10,
									width: 20,
									height: 20,
									color: "#ffffff"
								})]
							}),
							unknown && /* @__PURE__ */ jsxs("g", {
								transform: `translate(${mx - (hazards || adv.restriction ? 16 : 0)}, ${my - 4})`,
								children: [/* @__PURE__ */ jsx("circle", {
									r: 17,
									fill: "var(--card)",
									stroke: LEVEL_META.unknown.color,
									strokeWidth: 3
								}), /* @__PURE__ */ jsx(CircleQuestionMark, {
									x: -10,
									y: -10,
									width: 20,
									height: 20,
									color: LEVEL_META.unknown.color
								})]
							})
						]
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
							className: "inline-flex size-5 items-center justify-center rounded-full bg-status-official",
							children: /* @__PURE__ */ jsx(ShieldCheck, { className: "size-3 text-white" })
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
var SegmentMap = SchematicMap;
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
					/* @__PURE__ */ jsx("dd", { children: t("source.community") }),
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
function SegmentDetail({ segmentId, onClose, className, variant = "default" }) {
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
	if (variant === "map") return /* @__PURE__ */ jsx(MapSegmentDetail, {
		segment: seg,
		advisory: adv,
		corridorName: corridor?.name,
		onClose,
		className
	});
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
					/* @__PURE__ */ jsx(FreshnessChip, { sourceTimestamp: getAdvisorySourceTimestamp(adv) }),
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
						children: [
							/* @__PURE__ */ jsxs("p", { children: [
								t("segment.source"),
								": ",
								r ? t("source.official") : adv.evidence.length > 0 ? t("source.community") : t("source.unknown")
							] }),
							adv.latestObservationAt ? /* @__PURE__ */ jsxs("p", { children: [
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
							] }) : /* @__PURE__ */ jsx("p", { children: t("copy.noRecent") }),
							sources.size > 0 && /* @__PURE__ */ jsxs("p", {
								className: "text-muted-foreground",
								children: [
									[...sources].map((s) => t(`source.${s}`)).join(" · "),
									" — ",
									adv.evidence.length,
									" ",
									t("segment.reportsCount")
								]
							})
						]
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
				children: [/* @__PURE__ */ jsx("div", {
					className: "mb-2 flex flex-wrap items-center justify-between gap-2",
					children: /* @__PURE__ */ jsx("h4", {
						className: "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
						children: t("segment.reports")
					})
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
function MapSegmentDetail({ segment, advisory, corridorName, onClose, className }) {
	const { t, ago, stamp, place } = usePrefs();
	const sourceTimestamp = getAdvisorySourceTimestamp(advisory);
	const condition = advisory.evidence.find((report) => report.kind === "hazard") ?? advisory.evidence[0];
	const source = advisory.evidence.length ? t("source.community") : advisory.restriction ? t("source.official") : t("source.unknown");
	return /* @__PURE__ */ jsxs("section", {
		className: cn("rp-map-detail-panel", className),
		"aria-labelledby": "rp-map-segment-title",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "rp-map-detail-heading",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rp-map-detail-heading-label",
					children: [/* @__PURE__ */ jsx("span", {
						"aria-hidden": true,
						className: "rp-map-mountain-mark",
						children: "⌁"
					}), /* @__PURE__ */ jsx("span", { children: "Selected road segment" })]
				}), onClose && /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "rp-map-detail-close",
					onClick: onClose,
					"aria-label": "Close selected segment",
					children: /* @__PURE__ */ jsx(X, { "aria-hidden": true })
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rp-map-segment-title-row",
				children: [/* @__PURE__ */ jsxs("h2", {
					id: "rp-map-segment-title",
					children: [
						place(segment.from),
						" – ",
						place(segment.to)
					]
				}), /* @__PURE__ */ jsx(ActionBadge, {
					level: advisory.level,
					size: "lg"
				})]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "rp-map-segment-meta",
				children: [
					/* @__PURE__ */ jsx(RoadCode, { children: segment.code }),
					/* @__PURE__ */ jsx("span", {
						"aria-hidden": true,
						children: "·"
					}),
					/* @__PURE__ */ jsxs("span", { children: [segment.distanceKm, " km"] }),
					corridorName && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
						"aria-hidden": true,
						children: "·"
					}), /* @__PURE__ */ jsx("span", { children: corridorName })] })
				]
			}),
			/* @__PURE__ */ jsx(FreshnessChip, {
				sourceTimestamp,
				className: "rp-map-freshness"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rp-map-condition",
				children: [/* @__PURE__ */ jsx(TriangleAlert, { "aria-hidden": true }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: condition ? t(`hazard.${condition.hazardType}`) : "No recent observation" }), /* @__PURE__ */ jsx("p", { children: condition?.description ?? t("copy.noRecent") })] })]
			}),
			/* @__PURE__ */ jsxs("dl", {
				className: "rp-map-observation-grid",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("dt", { children: "Observation time" }),
						/* @__PURE__ */ jsx("dd", { children: advisory.latestObservationAt ? ago(advisory.latestObservationAt) : "Unknown" }),
						advisory.latestObservationAt && /* @__PURE__ */ jsx("small", { children: stamp(advisory.latestObservationAt) })
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("dt", { children: "Source" }),
						/* @__PURE__ */ jsx("dd", { children: source }),
						advisory.evidence.length > 0 && /* @__PURE__ */ jsxs("small", { children: [advisory.evidence.length, " reports"] })
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("dt", { children: "Last updated" }),
						/* @__PURE__ */ jsx("dd", { children: sourceTimestamp ? ago(sourceTimestamp) : "Unknown" }),
						sourceTimestamp && /* @__PURE__ */ jsx("small", { children: stamp(sourceTimestamp) })
					] })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rp-map-official-info",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rp-map-official-heading",
					children: [/* @__PURE__ */ jsx(ShieldCheck, { "aria-hidden": true }), /* @__PURE__ */ jsx("strong", { children: "Official restriction" })]
				}), advisory.restriction ? /* @__PURE__ */ jsxs("div", {
					className: "rp-map-restriction",
					children: [
						/* @__PURE__ */ jsx(OfficialBadge, { label: t(`restriction.${advisory.restriction.type}`) }),
						/* @__PURE__ */ jsx("p", { children: advisory.restriction.title }),
						/* @__PURE__ */ jsx("small", { children: advisory.restriction.issuingAuthority })
					]
				}) : /* @__PURE__ */ jsx("p", {
					className: "rp-map-no-official",
					children: "No current official information"
				})]
			}),
			/* @__PURE__ */ jsxs(Link, {
				to: "/advisories/$segmentId",
				params: { segmentId: segment.id },
				className: "rp-map-details-link",
				children: ["View details ", /* @__PURE__ */ jsx(ArrowRight, { "aria-hidden": true })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rp-map-reports",
				children: [/* @__PURE__ */ jsxs("h3", { children: [
					"Available reports (",
					advisory.evidence.length,
					")"
				] }), advisory.evidence.length ? /* @__PURE__ */ jsx("ul", { children: advisory.evidence.slice(0, 3).map((report) => /* @__PURE__ */ jsx(MapReportRow, {
					report,
					segmentLevel: advisory.level
				}, report.ref)) }) : /* @__PURE__ */ jsx("p", {
					className: "rp-map-no-official",
					children: "No community reports are available for this segment."
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "rp-map-detail-footer",
				children: "Prototype visualization · Synthetic data"
			})
		]
	});
}
function MapReportRow({ report, segmentLevel }) {
	const { t, ago, now } = usePrefs();
	const level = getFreshnessState(report.observedAt, now) === "stale" || report.kind === "clear" ? "unknown" : segmentLevel === "avoid" ? "avoid" : "caution";
	const title = report.kind === "hazard" ? `${t(`hazard.${report.hazardType}`)} reported` : "Community condition report";
	return /* @__PURE__ */ jsxs("li", {
		className: "rp-map-report-row",
		children: [/* @__PURE__ */ jsx("div", {
			className: "rp-map-report-icon",
			children: level === "unknown" ? /* @__PURE__ */ jsx(CircleQuestionMark, { "aria-hidden": true }) : /* @__PURE__ */ jsx(TriangleAlert, { "aria-hidden": true })
		}), /* @__PURE__ */ jsxs("div", {
			className: "rp-map-report-copy",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "rp-map-report-title",
					children: [/* @__PURE__ */ jsx("strong", { children: title }), /* @__PURE__ */ jsx(ActionBadge, { level })]
				}),
				/* @__PURE__ */ jsx("p", { children: report.description }),
				/* @__PURE__ */ jsxs("small", { children: [
					t("source.community"),
					" · ",
					t(`source.${report.source}`),
					" · ",
					ago(report.observedAt)
				] })
			]
		})]
	});
}
export { SegmentMap as i, MapLegend as n, SchematicMap as r, SegmentDetail as t };
