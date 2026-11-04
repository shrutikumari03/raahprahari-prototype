import { t as cn } from "./utils-DWGjSd5x.js";
import { d as SEGMENTS, f as corridorById, m as segmentById, r as usePrefs } from "./preferences-En5FkRWn.js";
import { a as Route$1, s as Logo } from "./router-C2M5jaWW.js";
import { t as AdvisoryCard } from "./advisory-card-CfSLJOkc.js";
import { a as SegmentMap, t as SegmentDetail } from "./segment-detail-j8gCXgnO.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CircleHelp, Crosshair, FileText, House, List, Map, Menu, Minus, Plus, Search, Shield, TriangleAlert, UserRound, X } from "lucide-react";
// src/routes/map.tsx?tsr-split=component
var navigation = [
	{
		label: "Home",
		to: "/",
		icon: House
	},
	{
		label: "Live Map",
		to: "/map",
		icon: Map,
		active: true
	},
	{
		label: "Advisories",
		to: "/advisories",
		icon: TriangleAlert
	},
	{
		label: "Reports",
		to: "/report",
		icon: FileText
	}
];
function MapPage() {
	const { place } = usePrefs();
	const search = Route$1.useSearch();
	const initialSegment = search.seg && segmentById(search.seg) ? search.seg : "nh7-06";
	const [selectedSegmentId, setSelectedSegmentId] = useState(initialSegment);
	const [view, setView] = useState(search.view ?? "map");
	const [query, setQuery] = useState("");
	const [zoom, setZoom] = useState(1.35);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mapFailed, setMapFailed] = useState(false);
	const filteredSegments = useMemo(() => {
		const term = query.trim().toLocaleLowerCase();
		if (!term) return SEGMENTS;
		return SEGMENTS.filter((segment) => {
			const corridor = corridorById(segment.corridorId);
			return [
				segment.code,
				corridor?.name,
				place(segment.from),
				place(segment.to)
			].some((value) => value?.toLocaleLowerCase().includes(term));
		});
	}, [place, query]);
	const selectedSegment = selectedSegmentId ? segmentById(selectedSegmentId) : void 0;
	const selectedCorridor = selectedSegment ? corridorById(selectedSegment.corridorId) : void 0;
	const highlightedSegments = selectedSegment ? SEGMENTS.filter((segment) => segment.corridorId === selectedSegment.corridorId).map((segment) => segment.id) : void 0;
	const routeLabels = selectedCorridor && selectedSegment ? [.../* @__PURE__ */ new Set([
		selectedCorridor.stops[0],
		selectedCorridor.stops[selectedCorridor.stops.length - 1],
		selectedSegment.from,
		selectedSegment.to
	])] : void 0;
	const changeView = (nextView) => {
		if (nextView === "map" && mapFailed) return;
		setView(nextView);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "rp-map-page",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "rp-map-header",
			children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "rp-map-brand",
					"aria-label": "RaahPrahari home",
					children: /* @__PURE__ */ jsx(Logo, {})
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "rp-map-search",
					children: [
						/* @__PURE__ */ jsx(Search, {
							"aria-hidden": true,
							className: "size-4 shrink-0"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "sr-only",
							children: "Search by road, place, or location"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "search",
							value: query,
							onChange: (event) => {
								const nextQuery = event.target.value;
								setQuery(nextQuery);
								const normalized = nextQuery.trim().toLocaleLowerCase();
								if (!normalized) return;
								const matching = SEGMENTS.find((segment) => {
									const corridor = corridorById(segment.corridorId);
									return [
										segment.code,
										corridor?.name,
										place(segment.from),
										place(segment.to)
									].some((value) => value?.toLocaleLowerCase().includes(normalized));
								});
								if (matching) setSelectedSegmentId(matching.id);
							},
							placeholder: "Search by road, place, or location..."
						}),
						query && /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "rp-map-clear",
							onClick: () => setQuery(""),
							"aria-label": "Clear search",
							children: /* @__PURE__ */ jsx(X, {
								"aria-hidden": true,
								className: "size-4"
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rp-map-header-actions",
					children: [/* @__PURE__ */ jsx("div", {
						className: "rp-map-toggle",
						role: "group",
						"aria-label": "Map or list view",
						children: ["map", "list"].map((nextView) => /* @__PURE__ */ jsxs("button", {
							type: "button",
							"aria-pressed": view === nextView,
							disabled: nextView === "map" && mapFailed,
							onClick: () => changeView(nextView),
							children: [nextView === "map" ? /* @__PURE__ */ jsx(Map, { "aria-hidden": true }) : /* @__PURE__ */ jsx(List, { "aria-hidden": true }), nextView === "map" ? "Map" : "List"]
						}, nextView))
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "rp-map-mobile-menu",
						"aria-expanded": mobileMenuOpen,
						"aria-label": mobileMenuOpen ? "Close navigation menu" : "Open navigation menu",
						onClick: () => setMobileMenuOpen((open) => !open),
						children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { "aria-hidden": true }) : /* @__PURE__ */ jsx(Menu, { "aria-hidden": true })
					})]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "rp-map-layout",
			children: [
				/* @__PURE__ */ jsxs("aside", {
					className: "rp-map-sidebar",
					"aria-label": "Main navigation",
					children: [/* @__PURE__ */ jsx(MapNavigation, {}), /* @__PURE__ */ jsx(MapSidebarBanner, {})]
				}),
				mobileMenuOpen && /* @__PURE__ */ jsx("div", {
					className: "rp-map-mobile-navigation",
					children: /* @__PURE__ */ jsx(MapNavigation, { onNavigate: () => setMobileMenuOpen(false) })
				}),
				/* @__PURE__ */ jsxs("main", {
					className: "rp-map-main",
					children: [mapFailed && /* @__PURE__ */ jsx("p", {
						className: "rp-map-fallback-notice",
						role: "status",
						children: "The terrain map could not be loaded. Showing the road list instead."
					}), view === "map" ? /* @__PURE__ */ jsxs("section", {
						className: "rp-map-canvas",
						"aria-label": "Live road map",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "rp-map-canvas-layer",
								style: { transform: `scale(${zoom})` },
								children: [
									/* @__PURE__ */ jsx("img", {
										src: "/img/map-terrain.png",
										alt: "",
										className: "rp-map-terrain",
										onError: () => {
											setMapFailed(true);
											setView("list");
										}
									}),
									/* @__PURE__ */ jsx("div", { className: "rp-map-shade" }),
									/* @__PURE__ */ jsx(SegmentMap, {
										terrain: true,
										highlight: highlightedSegments,
										labelPlaces: routeLabels,
										selectedSegmentId,
										onSelectSegment: setSelectedSegmentId,
										className: "rp-map-route-overlay"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rp-map-compass",
								"aria-label": "North",
								children: [/* @__PURE__ */ jsx("span", {
									"aria-hidden": true,
									children: "N"
								}), /* @__PURE__ */ jsx("span", {
									"aria-hidden": true,
									className: "rp-map-compass-arrow",
									children: "▲"
								})]
							}),
							/* @__PURE__ */ jsx(MapLegend, {}),
							/* @__PURE__ */ jsxs("div", {
								className: "rp-map-controls",
								"aria-label": "Map controls",
								children: [
									/* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-label": "Zoom in",
										onClick: () => setZoom((current) => Math.min(current + .15, 1.75)),
										children: /* @__PURE__ */ jsx(Plus, { "aria-hidden": true })
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-label": "Zoom out",
										onClick: () => setZoom((current) => Math.max(current - .15, 1)),
										children: /* @__PURE__ */ jsx(Minus, { "aria-hidden": true })
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-label": "Recenter map",
										onClick: () => setZoom(1),
										children: /* @__PURE__ */ jsx(Crosshair, { "aria-hidden": true })
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rp-map-scale",
								"aria-label": "Approximate map scale",
								children: [
									/* @__PURE__ */ jsx("span", { children: "0" }),
									/* @__PURE__ */ jsx("span", { children: "10" }),
									/* @__PURE__ */ jsx("span", { children: "20" }),
									/* @__PURE__ */ jsx("span", { children: "30 km" }),
									/* @__PURE__ */ jsx("i", { "aria-hidden": true })
								]
							}),
							/* @__PURE__ */ jsx(SegmentDetail, {
								segmentId: selectedSegmentId,
								variant: "map",
								className: "rp-map-detail",
								onClose: () => setSelectedSegmentId(void 0)
							})
						]
					}) : /* @__PURE__ */ jsxs("section", {
						className: "rp-map-list-view",
						"aria-label": "Road segment list",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "rp-map-list",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "rp-map-list-heading",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "rp-map-kicker",
									children: "ROAD CONDITIONS"
								}), /* @__PURE__ */ jsx("h1", { children: "Road segments" })] }), /* @__PURE__ */ jsxs("span", { children: [filteredSegments.length, " segments"] })]
							}), filteredSegments.length ? /* @__PURE__ */ jsx("div", {
								className: "rp-map-list-cards",
								children: filteredSegments.map((segment) => /* @__PURE__ */ jsxs("article", {
									className: cn("rp-map-list-card", segment.id === selectedSegmentId && "is-selected"),
									children: [/* @__PURE__ */ jsxs("button", {
										type: "button",
										className: "rp-map-list-select",
										"aria-pressed": segment.id === selectedSegmentId,
										onClick: () => setSelectedSegmentId(segment.id),
										children: [/* @__PURE__ */ jsx("span", { children: segment.id === selectedSegmentId ? "Selected segment" : "Select segment" }), segment.id === selectedSegmentId && /* @__PURE__ */ jsx("span", {
											"aria-hidden": true,
											children: "✓"
										})]
									}), /* @__PURE__ */ jsx(AdvisoryCard, { segment })]
								}, segment.id))
							}) : /* @__PURE__ */ jsxs("p", {
								className: "rp-map-no-results",
								children: [
									"No road segments match “",
									query,
									"”."
								]
							})]
						}), /* @__PURE__ */ jsx(SegmentDetail, {
							segmentId: selectedSegmentId,
							variant: "map",
							className: "rp-map-list-detail",
							onClose: () => setSelectedSegmentId(void 0)
						})]
					})]
				})
			]
		})]
	});
}
function MapNavigation({ onNavigate }) {
	return /* @__PURE__ */ jsxs("nav", {
		className: "rp-map-nav",
		children: [navigation.map(({ label, to, icon: Icon, active }) => /* @__PURE__ */ jsxs(Link, {
			to,
			onClick: onNavigate,
			"aria-current": active ? "page" : void 0,
			className: cn("rp-map-nav-link", active && "is-active"),
			children: [/* @__PURE__ */ jsx(Icon, { "aria-hidden": true }), /* @__PURE__ */ jsx("span", { children: label })]
		}, label)), /* @__PURE__ */ jsxs("button", {
			type: "button",
			className: "rp-map-nav-link rp-map-profile",
			disabled: true,
			children: [
				/* @__PURE__ */ jsx(UserRound, { "aria-hidden": true }),
				/* @__PURE__ */ jsx("span", { children: "Profile" }),
				/* @__PURE__ */ jsx("span", {
					className: "sr-only",
					children: "Profile is not available in this prototype."
				})
			]
		})]
	});
}
function MapSidebarBanner() {
	return /* @__PURE__ */ jsxs("div", {
		className: "rp-map-sidebar-banner",
		children: [/* @__PURE__ */ jsx("img", {
			src: "/img/banner-strip.png",
			alt: ""
		}), /* @__PURE__ */ jsxs("p", { children: [
			"Safer roads",
			/* @__PURE__ */ jsx("br", {}),
			"Stronger journeys"
		] })]
	});
}
function MapLegend() {
	return /* @__PURE__ */ jsxs("aside", {
		className: "rp-map-legend",
		"aria-label": "Map legend",
		children: [
			/* @__PURE__ */ jsx("h2", { children: "Map legend" }),
			/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx(TriangleAlert, {
				"aria-hidden": true,
				className: "reported"
			}), " Reported hazard"] }),
			/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx(Shield, {
				"aria-hidden": true,
				className: "official"
			}), " Official restriction"] }),
			/* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx(CircleHelp, {
				"aria-hidden": true,
				className: "unknown"
			}), " Unknown information"] })
		]
	});
}
export { MapPage as component };
