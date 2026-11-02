import { a as cn, r as useLocalState, t as STORAGE_KEYS } from "./storage-wbzgXpjQ.js";
import { t as Button } from "./button-DxFltwjo.js";
import { d as SEGMENTS, p as placeById, r as usePrefs, s as PLACES } from "./preferences-Bu-IUfe0.js";
import { c as FreshnessChip, o as ActionBadge, p as getAdvisorySourceTimestamp, r as Route$1 } from "./router-BV9_Jy_b.js";
import { t as advisoryFor } from "./data-DcVb_IFo.js";
import { a as nearestPlace, i as inCoverage, r as getCurrentPosition, t as findSeededRoutes } from "./routing-BVsNYcwm.js";
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowRight, Clock3, Compass, Crosshair, List, LocateFixed, Map as Map$1, MapPin, Minus, Plus, RotateCcw, Search, ShieldCheck, TriangleAlert, UsersRound, X } from "lucide-react";
// src/routes/traveller.tsx?tsr-split=component
var RECENT_TRAVELLER_SEARCHES = `${STORAGE_KEYS.recentSearches}.traveller`;
function TravellerPage() {
	const { place, ago } = usePrefs();
	const navigate = useNavigate();
	const search = Route$1.useSearch();
	const inputRef = useRef(null);
	const [recent, setRecent] = useLocalState(RECENT_TRAVELLER_SEARCHES, []);
	const from = search.from && placeById(search.from) ? search.from : void 0;
	const to = search.to && placeById(search.to) ? search.to : void 0;
	const journey = !!from && !!to && from !== to;
	const [query, setQuery] = useState(search.q ?? (journey && from && to ? `${place(from)} to ${place(to)}` : ""));
	const [searchStatus, setSearchStatus] = useState("idle");
	const [filter, setFilter] = useState("all");
	const [locationMessage, setLocationMessage] = useState(null);
	const [locating, setLocating] = useState(false);
	const [manualEntry, setManualEntry] = useState(false);
	const activeQuery = search.q?.trim() ?? "";
	const hasSearch = !!activeQuery || journey;
	const routeOptions = useMemo(() => {
		if (journey && from && to) return findSeededRoutes(from, to);
		const endpoints = routePlaceIds(activeQuery);
		return endpoints ? findSeededRoutes(...endpoints) : [];
	}, [
		activeQuery,
		from,
		to,
		journey
	]);
	const filteredResults = useMemo(() => {
		if (journey && from && to) return [...new Map(routeOptions.flatMap((route) => route.segments).map((segment) => [segment.id, segment])).values()];
		return activeQuery ? segmentsForQuery(activeQuery) : [];
	}, [
		activeQuery,
		from,
		journey,
		routeOptions,
		to
	]).map((segment) => {
		const advisory = advisoryFor(segment.id);
		if (!advisory) throw new Error(`Missing advisory for segment "${segment.id}"`);
		return {
			segment,
			advisory
		};
	}).filter(({ advisory }) => {
		if (filter === "hazards") return advisory.evidence.some((report) => report.kind === "hazard") || !!advisory.restriction;
		if (filter === "roads") return true;
		return true;
	});
	const routeSummary = routeOptions[0];
	const runSearch = (rawQuery = query) => {
		const value = rawQuery.trim();
		if (!value) {
			inputRef.current?.focus();
			return;
		}
		setQuery(value);
		setLocationMessage(null);
		setSearchStatus("loading");
		window.setTimeout(() => {
			navigate({
				to: "/traveller",
				search: {
					q: value,
					from: void 0,
					to: void 0,
					view: void 0,
					seg: void 0
				}
			}).then(() => {
				setSearchStatus("idle");
				setRecent((previous) => [{
					query: value,
					at: Date.now()
				}, ...previous.filter((item) => item.query.toLowerCase() !== value.toLowerCase())].slice(0, 5));
			}).catch((error) => {
				console.error("Road search navigation failed", error);
				setSearchStatus("failure");
			});
		}, 100);
	};
	const clearSearch = () => {
		setQuery("");
		setSearchStatus("idle");
		setLocationMessage(null);
		navigate({
			to: "/traveller",
			search: {
				q: void 0,
				from: void 0,
				to: void 0,
				view: void 0,
				seg: void 0
			}
		});
	};
	const requestCurrentLocation = async () => {
		setLocating(true);
		setLocationMessage(null);
		const result = await getCurrentPosition();
		setLocating(false);
		if (!result.ok) {
			setLocationMessage(result.reason === "denied" ? "Location permission denied. Search manually instead." : "Location is unavailable. You can still search manually.");
			setManualEntry(true);
			return;
		}
		if (!inCoverage(result.lat, result.lon)) {
			setLocationMessage("Your location is outside the current coverage area. Enter a place or road manually.");
			setManualEntry(true);
			return;
		}
		const nearest = nearestPlace(result.lat, result.lon);
		setQuery(place(nearest.id));
		setLocationMessage(`Nearest covered place: ${place(nearest.id)}. Review or edit the search before continuing.`);
	};
	const chooseRecent = (value) => {
		setQuery(value);
		runSearch(value);
	};
	const searchForm = /* @__PURE__ */ jsxs("form", {
		className: "traveller-search-form",
		onSubmit: (event) => {
			event.preventDefault();
			runSearch();
		},
		children: [
			/* @__PURE__ */ jsx("label", {
				className: "traveller-search-label",
				htmlFor: "traveller-query",
				children: "Search a place or road"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "traveller-query-wrap",
				children: [
					/* @__PURE__ */ jsx(Search, {
						"aria-hidden": true,
						className: "traveller-query-icon"
					}),
					/* @__PURE__ */ jsx("input", {
						ref: inputRef,
						id: "traveller-query",
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "e.g. Dehradun to Mussoorie",
						autoComplete: "off"
					}),
					query && /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "traveller-clear-query",
						"aria-label": "Clear search",
						onClick: clearSearch,
						children: /* @__PURE__ */ jsx(X, { "aria-hidden": true })
					})
				]
			}),
			/* @__PURE__ */ jsxs(Button, {
				type: "submit",
				className: "traveller-search-submit",
				disabled: !query.trim() || searchStatus === "loading",
				children: [/* @__PURE__ */ jsx(Search, { "aria-hidden": true }), searchStatus === "loading" ? "Searching…" : "Search road"]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "traveller-location-actions",
				children: [/* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "outline",
					onClick: () => void requestCurrentLocation(),
					disabled: locating,
					children: [/* @__PURE__ */ jsx(LocateFixed, { "aria-hidden": true }), locating ? "Getting location…" : "Use current location"]
				}), /* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "ghost",
					onClick: () => {
						setManualEntry(true);
						inputRef.current?.focus();
					},
					children: [/* @__PURE__ */ jsx(MapPin, { "aria-hidden": true }), "Enter location manually"]
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "traveller-location-note",
				role: locationMessage ? "status" : void 0,
				children: locationMessage ?? (manualEntry ? "Manual search is active. Location access is optional." : "Location access is optional. Search manually at any time.")
			})
		]
	});
	if (!hasSearch && searchStatus !== "failure") return /* @__PURE__ */ jsxs("div", {
		className: "traveller-page traveller-landing",
		children: [
			/* @__PURE__ */ jsx("section", {
				className: "traveller-search-panel",
				"aria-labelledby": "traveller-title",
				children: /* @__PURE__ */ jsxs("div", {
					className: "traveller-panel-content",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "traveller-eyebrow",
							children: "ROAD ADVISORIES · UTTARAKHAND"
						}),
						/* @__PURE__ */ jsx("h1", {
							id: "traveller-title",
							children: "Where are you travelling?"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "traveller-panel-description",
							children: "Search reported road conditions, evidence freshness, and official restrictions."
						}),
						searchForm,
						/* @__PURE__ */ jsx(RecentSearches, {
							recent,
							onChoose: chooseRecent,
							onClear: () => setRecent([])
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(IllustrativeMap, {
				results: [],
				routeFrom: "Dehradun",
				routeTo: "Mussoorie",
				summary: "Illustrative example · approx."
			}),
			/* @__PURE__ */ jsx(TravellerFooter, {})
		]
	});
	const resultTitle = "Search results";
	const routeFrom = journey && from ? place(from) : routeSummary ? place(routeSummary.segments[0]?.from ?? "") : void 0;
	const routeTo = journey && to ? place(to) : routeSummary ? place(routeSummary.segments.at(-1)?.to ?? "") : void 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "traveller-page traveller-results-page",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "traveller-results-banner",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "traveller-results-heading",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							className: "traveller-back-link",
							onClick: clearSearch,
							children: [/* @__PURE__ */ jsx(ArrowLeft, { "aria-hidden": true }), "Back to search"]
						}),
						/* @__PURE__ */ jsx("h1", { children: resultTitle }),
						/* @__PURE__ */ jsx("p", { children: "Here are the latest reports and advisories for your search." })
					] }), /* @__PURE__ */ jsx("div", {
						className: "traveller-results-search",
						children: searchForm
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "traveller-filter-row",
					role: "group",
					"aria-label": "Filter results",
					children: [
						["all", "All"],
						["roads", "Roads"],
						["hazards", "Hazards"]
					].map(([key, label]) => /* @__PURE__ */ jsxs("button", {
						type: "button",
						"aria-pressed": filter === key,
						className: cn("traveller-filter-chip", filter === key && "is-active"),
						onClick: () => setFilter(key),
						children: [
							key === "roads" && /* @__PURE__ */ jsx(Map$1, { "aria-hidden": true }),
							key === "hazards" && /* @__PURE__ */ jsx(TriangleAlert, { "aria-hidden": true }),
							label
						]
					}, key))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "traveller-results-layout",
				children: [/* @__PURE__ */ jsx("section", {
					className: "traveller-result-list",
					"aria-label": "Search results",
					children: searchStatus === "loading" ? /* @__PURE__ */ jsxs("div", {
						className: "traveller-state-card",
						role: "status",
						children: [/* @__PURE__ */ jsx("span", {
							className: "traveller-loading-mark",
							"aria-hidden": true
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", { children: "Searching road information…" }), /* @__PURE__ */ jsx("p", { children: "Checking available synthetic reports and advisories." })] })]
					}) : searchStatus === "failure" ? /* @__PURE__ */ jsxs("div", {
						className: "traveller-state-card",
						role: "alert",
						children: [/* @__PURE__ */ jsx(TriangleAlert, { "aria-hidden": true }), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("h2", { children: "Search could not be completed." }),
							/* @__PURE__ */ jsx("p", { children: "Try again or enter a place or road manually." }),
							/* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "outline",
								onClick: () => runSearch(),
								children: "Try again"
							})
						] })]
					}) : filteredResults.length ? filteredResults.map(({ segment, advisory }) => /* @__PURE__ */ jsx(ResultRow, {
						segment,
						observedAt: getAdvisorySourceTimestamp(advisory),
						source: advisory.restriction ? "Official source" : advisory.evidence.length ? "Community report" : "No reported source",
						reason: advisory.evidence[0]?.description ?? advisory.restriction?.title ?? "No recent observation is available for this road section.",
						observedLabel: advisory.latestObservationAt ? ago(advisory.latestObservationAt) : void 0
					}, segment.id)) : /* @__PURE__ */ jsxs("div", {
						className: "traveller-empty-state",
						children: [
							/* @__PURE__ */ jsx(MapPin, { "aria-hidden": true }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", { children: "No matching reports found." }), /* @__PURE__ */ jsx("p", { children: "This does not confirm current road conditions." })] }),
							/* @__PURE__ */ jsxs(Button, {
								type: "button",
								variant: "ghost",
								onClick: clearSearch,
								children: [/* @__PURE__ */ jsx(RotateCcw, { "aria-hidden": true }), "Try a different search"]
							})
						]
					})
				}), /* @__PURE__ */ jsx(IllustrativeMap, {
					results: filteredResults,
					routeFrom,
					routeTo,
					summary: routeSummary ? "Route summary · approx." : "Illustrative route · approx."
				})]
			}),
			/* @__PURE__ */ jsx(TravellerFooter, {})
		]
	});
}
function ResultRow({ segment, observedAt, observedLabel, source, reason }) {
	const { place } = usePrefs();
	const advisory = advisoryFor(segment.id);
	if (!advisory) throw new Error(`Missing advisory for segment "${segment.id}"`);
	return /* @__PURE__ */ jsxs("article", {
		className: cn("traveller-result-row", `status-${advisory.level}`, advisory.stale && "is-stale"),
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "traveller-result-badge",
				children: /* @__PURE__ */ jsx(ActionBadge, { level: advisory.level })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "traveller-result-main",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "traveller-road-code",
						children: [
							segment.code,
							" · km ",
							segment.kmStart,
							"–",
							segment.kmEnd
						]
					}),
					/* @__PURE__ */ jsxs("h2", { children: [
						place(segment.from),
						" – ",
						place(segment.to)
					] }),
					/* @__PURE__ */ jsx("p", {
						className: "traveller-result-reason",
						children: reason
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "traveller-result-metadata",
						children: [/* @__PURE__ */ jsxs("span", { children: [
							/* @__PURE__ */ jsx(Clock3, { "aria-hidden": true }),
							"Observed ",
							observedLabel ?? "time unavailable"
						] }), /* @__PURE__ */ jsxs("span", { children: [advisory.restriction ? /* @__PURE__ */ jsx(ShieldCheck, { "aria-hidden": true }) : /* @__PURE__ */ jsx(UsersRound, { "aria-hidden": true }), source] })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "traveller-row-trailing",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "traveller-freshness-chip",
					children: ["Freshness: ", /* @__PURE__ */ jsx(FreshnessChip, { sourceTimestamp: observedAt })]
				}), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					type: "button",
					variant: "outline",
					className: "traveller-view-details",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/advisories/$segmentId",
						params: { segmentId: segment.id },
						children: ["View details", /* @__PURE__ */ jsx(ArrowRight, { "aria-hidden": true })]
					})
				})]
			})
		]
	});
}
function RecentSearches({ recent, onChoose, onClear }) {
	const [showExample, setShowExample] = useState(true);
	const example = "Dehradun to Mussoorie";
	return /* @__PURE__ */ jsxs("section", {
		className: "traveller-recent",
		"aria-labelledby": "traveller-recent-title",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "traveller-recent-heading",
			children: [/* @__PURE__ */ jsx("h2", {
				id: "traveller-recent-title",
				children: "Recent searches"
			}), /* @__PURE__ */ jsxs(Button, {
				type: "button",
				variant: "ghost",
				onClick: () => {
					onClear();
					setShowExample(false);
				},
				children: [/* @__PURE__ */ jsx(X, { "aria-hidden": true }), "Clear"]
			})]
		}), /* @__PURE__ */ jsxs("ul", { children: [recent.map(({ query }) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => onChoose(query),
			children: [/* @__PURE__ */ jsx(RotateCcw, { "aria-hidden": true }), query]
		}) }, query)), !recent.length && showExample && /* @__PURE__ */ jsxs("li", {
			className: "traveller-example-search",
			children: [/* @__PURE__ */ jsx("span", { children: "Illustrative example" }), /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => onChoose(example),
				children: [/* @__PURE__ */ jsx(RotateCcw, { "aria-hidden": true }), example]
			})]
		})] })]
	});
}
function IllustrativeMap({ results, routeFrom, routeTo, summary }) {
	const [mode, setMode] = useState("map");
	const [zoom, setZoom] = useState(1);
	return /* @__PURE__ */ jsxs("section", {
		className: "traveller-map-panel",
		"aria-label": "Illustrative route map",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "traveller-map-surface",
			style: { "--map-zoom": zoom },
			children: [mode === "map" ? /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx("p", {
					className: "traveller-map-disclaimer",
					children: "ILLUSTRATIVE · NOT FOR NAVIGATION"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "traveller-map-route",
					"aria-hidden": true,
					children: [
						/* @__PURE__ */ jsx("span", { className: "route-piece route-piece-one" }),
						/* @__PURE__ */ jsx("span", { className: "route-piece route-piece-two" }),
						/* @__PURE__ */ jsx("span", { className: "route-piece route-piece-three" }),
						/* @__PURE__ */ jsx("span", { className: "route-piece route-piece-four" }),
						/* @__PURE__ */ jsx("span", { className: "route-piece route-piece-five" }),
						/* @__PURE__ */ jsx(MapPin, { className: "route-pin route-pin-start" }),
						/* @__PURE__ */ jsx(MapPin, { className: "route-pin route-pin-end" }),
						/* @__PURE__ */ jsx(TriangleAlert, { className: "route-hazard route-hazard-one" }),
						/* @__PURE__ */ jsx(TriangleAlert, { className: "route-hazard route-hazard-two" })
					]
				}),
				routeFrom && /* @__PURE__ */ jsx("span", {
					className: "traveller-map-place map-place-start",
					children: routeFrom
				}),
				routeTo && /* @__PURE__ */ jsx("span", {
					className: "traveller-map-place map-place-end",
					children: routeTo
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "traveller-compass",
					"aria-label": "North",
					children: [/* @__PURE__ */ jsx(Compass, { "aria-hidden": true }), /* @__PURE__ */ jsx("span", { children: "N" })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "traveller-map-tools",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": "Zoom in",
							onClick: () => setZoom((value) => Math.min(value + .1, 1.5)),
							children: /* @__PURE__ */ jsx(Plus, { "aria-hidden": true })
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": "Zoom out",
							onClick: () => setZoom((value) => Math.max(value - .1, .8)),
							children: /* @__PURE__ */ jsx(Minus, { "aria-hidden": true })
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": "Reset map orientation",
							onClick: () => setZoom(1),
							children: /* @__PURE__ */ jsx(Crosshair, { "aria-hidden": true })
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "traveller-map-scale",
					"aria-label": "Illustrative scale",
					children: [
						/* @__PURE__ */ jsx("span", { children: "0" }),
						/* @__PURE__ */ jsx("span", { children: "25" }),
						/* @__PURE__ */ jsx("span", { children: "50" }),
						/* @__PURE__ */ jsx("span", { children: "100 km" })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "traveller-map-legend",
					"aria-label": "Map legend",
					children: [
						/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx(TriangleAlert, { "aria-hidden": true }), " Reported hazard"] }),
						/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx(ShieldCheck, { "aria-hidden": true }), " Official restriction"] }),
						/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
							className: "unknown-dot",
							children: "?"
						}), " Unknown"] })
					]
				})
			] }) : /* @__PURE__ */ jsxs("div", {
				className: "traveller-map-list",
				children: [/* @__PURE__ */ jsx("h2", { children: "Road sections" }), results.length ? results.slice(0, 6).map(({ segment }) => /* @__PURE__ */ jsxs("p", { children: [
					placeById(segment.from)?.name,
					" – ",
					placeById(segment.to)?.name
				] }, segment.id)) : /* @__PURE__ */ jsx("p", { children: "Illustrative map view" })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "traveller-map-toggle",
				role: "group",
				"aria-label": "Map view",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					"aria-pressed": mode === "map",
					onClick: () => setMode("map"),
					children: [/* @__PURE__ */ jsx(Map$1, { "aria-hidden": true }), " Map"]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					"aria-pressed": mode === "list",
					onClick: () => setMode("list"),
					children: [/* @__PURE__ */ jsx(List, { "aria-hidden": true }), " List"]
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "traveller-route-summary",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "traveller-summary-icon",
					children: /* @__PURE__ */ jsx(ArrowRight, { "aria-hidden": true })
				}),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: routeFrom && routeTo ? `${routeFrom} → ${routeTo}` : "Route summary" }), /* @__PURE__ */ jsx("span", { children: summary })] }),
				/* @__PURE__ */ jsx("span", {
					className: "traveller-summary-approx",
					children: "approx."
				})
			]
		})]
	});
}
function TravellerFooter() {
	return /* @__PURE__ */ jsxs("footer", {
		className: "traveller-page-footer",
		children: [/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx(TriangleAlert, { "aria-hidden": true }), " Synthetic demo data, not current road conditions."] }), /* @__PURE__ */ jsx("span", { children: "PROTOTYPE · SYNTHETIC DEMO DATA" })]
	});
}
function segmentsForQuery(query) {
	const normalized = normalizeQuery(query);
	const endpoints = routePlaceIds(query);
	if (endpoints) return [...new Map(findSeededRoutes(...endpoints).flatMap((route) => route.segments).map((segment) => [segment.id, segment])).values()];
	const words = normalized.split(/\s+/).filter((word) => word && word !== "to");
	return SEGMENTS.filter((segment) => {
		const advisory = advisoryFor(segment.id);
		const from = placeById(segment.from);
		const to = placeById(segment.to);
		const haystack = normalizeQuery([
			segment.code,
			from?.name,
			from?.nameHi,
			to?.name,
			to?.nameHi,
			...advisory?.evidence.map((report) => report.description) ?? [],
			...advisory?.evidence.map((report) => report.landmark) ?? [],
			advisory?.restriction?.title
		].filter(Boolean).join(" "));
		return haystack.includes(normalized) || words.every((word) => haystack.includes(word));
	});
}
function routePlaceIds(query) {
	const parts = query.split(/\s+(?:to|→|–)\s+/i).map((part) => part.trim()).filter(Boolean);
	if (parts.length !== 2) return void 0;
	const start = findPlaceId(parts[0]);
	const end = findPlaceId(parts[1]);
	return start && end ? [start, end] : void 0;
}
function findPlaceId(value) {
	const needle = normalizeQuery(value);
	return PLACES.find((place) => [
		place.id,
		place.name,
		place.nameHi
	].some((candidate) => normalizeQuery(candidate) === needle))?.id;
}
function normalizeQuery(value) {
	return value.toLocaleLowerCase().replace(/[.,]/g, " ").replace(/\s+/g, " ").trim();
}
export { TravellerPage as component };
