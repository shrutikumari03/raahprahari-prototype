import { t as cn } from "./utils-DWGjSd5x.js";
import { t as Button } from "./button-CFj87KzT.js";
import { c as QUICK_PICKS, d as SEGMENTS, i as CORRIDORS, p as placeById, r as usePrefs, s as PLACES } from "./preferences-DeZH5r-v.js";
import { r as useLocalState, t as STORAGE_KEYS } from "./storage-buUTINin.js";
import { c as LEVEL_META, d as getAdvisorySourceTimestamp, i as ActionBadge, p as summariseRoute, s as FreshnessChip, t as advisoryFor, u as RoadCode } from "./data-B_sSCjD5.js";
import { a as Route$1 } from "./router-AU5llvQE.js";
import { i as SchematicMap, r as MapLegend, t as SegmentDetail } from "./segment-detail-B7Gh0SYm.js";
import { a as nearestPlace, i as inCoverage, n as routeLabel, r as getCurrentPosition, t as findSeededRoutes } from "./routing-BBG-LC3r.js";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, ArrowUpDown, Bookmark, BookmarkCheck, Info, List, LocateFixed, Map, MapPin, RotateCcw, Route, Search, ShieldCheck, TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";
// src/features/routes/place-input.tsx
/** Accessible autocomplete limited to places in the coverage area. */
function PlaceInput({ label, placeholder, value, onChange, invalid, className }) {
	const { place, lang, t } = usePrefs();
	const id = useId();
	const listId = `${id}-list`;
	const [query, setQuery] = useState(null);
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState(0);
	const inputRef = useRef(null);
	const text = query ?? (value ? place(value) : "");
	const matches = useMemo(() => {
		const q = (query ?? "").trim().toLowerCase();
		return (q ? PLACES.filter((p) => p.name.toLowerCase().includes(q) || p.nameHi.includes(q) || p.district.toLowerCase().includes(q)) : PLACES).slice(0, 8);
	}, [query]);
	const choose = (pid) => {
		onChange(pid);
		setQuery(null);
		setOpen(false);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: cn("relative", className),
		children: [
			/* @__PURE__ */ jsx("label", {
				htmlFor: id,
				className: "mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase",
				children: label
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx(MapPin, {
					"aria-hidden": true,
					className: "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
				}), /* @__PURE__ */ jsx("input", {
					ref: inputRef,
					id,
					role: "combobox",
					"aria-expanded": open,
					"aria-controls": listId,
					"aria-autocomplete": "list",
					"aria-invalid": invalid || void 0,
					"aria-activedescendant": open && matches[active] ? `${listId}-${matches[active].id}` : void 0,
					autoComplete: "off",
					placeholder,
					value: text,
					onFocus: () => setOpen(true),
					onBlur: () => {
						setTimeout(() => setOpen(false), 120);
						if (query !== null && query.trim() === "") {
							onChange(null);
							setQuery(null);
						}
					},
					onChange: (e) => {
						setQuery(e.target.value);
						setActive(0);
						setOpen(true);
						if (value) onChange(null);
					},
					onKeyDown: (e) => {
						if (e.key === "ArrowDown") {
							e.preventDefault();
							setOpen(true);
							setActive((a) => Math.min(a + 1, matches.length - 1));
						} else if (e.key === "ArrowUp") {
							e.preventDefault();
							setActive((a) => Math.max(a - 1, 0));
						} else if (e.key === "Enter" && open && matches[active]) {
							e.preventDefault();
							choose(matches[active].id);
						} else if (e.key === "Escape") setOpen(false);
					},
					className: cn("h-12 w-full rounded-xl border border-input bg-raised pr-3 pl-10 text-base text-foreground placeholder:text-muted-foreground", invalid && "border-status-dnt")
				})]
			}),
			open && /* @__PURE__ */ jsx("ul", {
				id: listId,
				role: "listbox",
				"aria-label": label,
				className: "absolute z-30 mt-1.5 max-h-72 w-full overflow-auto rounded-xl border border-border bg-popover p-1 shadow-xl",
				children: matches.length === 0 ? /* @__PURE__ */ jsx("li", {
					className: "px-3 py-3 text-sm text-muted-foreground",
					children: t("search.noMatch")
				}) : matches.map((p, i) => /* @__PURE__ */ jsxs("li", {
					id: `${listId}-${p.id}`,
					role: "option",
					"aria-selected": i === active,
					onMouseDown: (e) => {
						e.preventDefault();
						choose(p.id);
					},
					onMouseEnter: () => setActive(i),
					className: cn("flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-sm", i === active && "bg-accent"),
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-medium",
						children: lang === "hi" ? p.nameHi : p.name
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-muted-foreground",
						children: p.district
					})]
				}, p.id))
			})
		]
	});
}
// src/features/routes/route-search.tsx
function RouteSearchCard({ initialFrom = null, initialTo = null, layout = "stacked", destination = "check", className }) {
	const { t, place } = usePrefs();
	const navigate = useNavigate();
	const [from, setFrom] = useState(initialFrom);
	const [to, setTo] = useState(initialTo);
	const [locMsg, setLocMsg] = useState(null);
	const [locating, setLocating] = useState(false);
	const [recent, setRecent] = useLocalState(STORAGE_KEYS.recentSearches, []);
	useEffect(() => {
		setFrom(initialFrom);
		setTo(initialTo);
	}, [initialFrom, initialTo]);
	const same = !!from && from === to;
	const valid = !!from && !!to && !same;
	const submit = (e) => {
		e?.preventDefault();
		if (!valid) return;
		setRecent((prev) => [{
			from,
			to,
			at: Date.now()
		}, ...prev.filter((r) => !(r.from === from && r.to === to))].slice(0, 5));
		if (destination === "traveller") navigate({
			to: "/traveller",
			search: {
				from,
				to
			}
		});
		else navigate({
			to: "/check",
			search: {
				from,
				to
			}
		});
	};
	const locate = async () => {
		setLocating(true);
		setLocMsg(null);
		const res = await getCurrentPosition();
		setLocating(false);
		if (!res.ok) {
			setLocMsg(t(res.reason === "denied" ? "search.locDenied" : "search.locUnavailable"));
			return;
		}
		if (!inCoverage(res.lat, res.lon)) {
			setLocMsg(t("search.locOutside"));
			return;
		}
		const p = nearestPlace(res.lat, res.lon);
		setFrom(p.id);
		setLocMsg(`${t("search.locNearest")}: ${place(p.id)} (±${Math.round(res.accuracyM)} m)`);
	};
	const pick = (id) => {
		if (!from) setFrom(id);
		else if (!to && id !== from) setTo(id);
		else setTo(id);
	};
	const inline = layout === "inline";
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: submit,
		noValidate: true,
		className: cn("space-y-4", className),
		"aria-label": t("search.title"),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: cn("grid gap-3", inline ? "md:grid-cols-[1fr_auto_1fr_auto] md:items-end" : "grid-cols-1"),
				children: [
					/* @__PURE__ */ jsx(PlaceInput, {
						label: t("search.from"),
						placeholder: t("search.fromPh"),
						value: from,
						onChange: setFrom
					}),
					/* @__PURE__ */ jsx("div", {
						className: cn("flex", inline ? "justify-center md:pb-0.5" : "-my-2 justify-end"),
						children: /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							size: "icon-lg",
							className: "size-11 rounded-full",
							onClick: () => {
								setFrom(to);
								setTo(from);
							},
							"aria-label": t("search.swap"),
							title: t("search.swap"),
							children: /* @__PURE__ */ jsx(ArrowUpDown, { className: cn(inline && "md:rotate-90") })
						})
					}),
					/* @__PURE__ */ jsx(PlaceInput, {
						label: t("search.to"),
						placeholder: t("search.toPh"),
						value: to,
						onChange: setTo,
						invalid: same
					}),
					inline && /* @__PURE__ */ jsxs(Button, {
						type: "submit",
						disabled: !valid,
						className: "h-12 rounded-xl px-6 text-base font-semibold",
						children: [/* @__PURE__ */ jsx(Search, {}), t("search.submit")]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-x-4 gap-y-2",
				children: [/* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "link",
					className: "h-11 px-0 text-link",
					onClick: locate,
					disabled: locating,
					children: [/* @__PURE__ */ jsx(LocateFixed, {}), locating ? t("search.locating") : t("search.useLocation")]
				}), same && /* @__PURE__ */ jsx("p", {
					role: "alert",
					className: "text-sm font-medium text-status-dnt",
					children: t("search.same")
				})]
			}),
			locMsg && /* @__PURE__ */ jsx("p", {
				role: "status",
				className: "-mt-2 text-sm text-muted-foreground",
				children: locMsg
			}),
			!inline && /* @__PURE__ */ jsxs(Button, {
				type: "submit",
				disabled: !valid,
				className: "h-12 w-full rounded-xl text-base font-semibold",
				children: [/* @__PURE__ */ jsx(Search, {}), t("search.submit")]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase",
				children: t("search.quick")
			}), /* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-1.5",
				children: QUICK_PICKS.map((id) => {
					const selected = id === from || id === to;
					return /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => pick(id),
						"aria-pressed": selected,
						className: cn("min-h-11 rounded-full border px-3 text-sm transition-colors", selected ? "border-brand-orange bg-brand-orange/15 text-foreground" : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"),
						children: place(id)
					}, id);
				})
			})] }),
			recent.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-1 flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
					children: t("search.recent")
				}), /* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					className: "h-9 text-muted-foreground",
					onClick: () => setRecent([]),
					children: [/* @__PURE__ */ jsx(X, {}), t("search.clearRecent")]
				})]
			}), /* @__PURE__ */ jsx("ul", {
				className: "flex flex-wrap gap-1.5",
				children: recent.map((r) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => {
						setFrom(r.from);
						setTo(r.to);
					},
					className: "inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-3 text-sm hover:bg-muted",
					children: [
						/* @__PURE__ */ jsx(RotateCcw, {
							"aria-hidden": true,
							className: "size-3.5 text-muted-foreground"
						}),
						place(r.from),
						" → ",
						place(r.to)
					]
				}) }, `${r.from}-${r.to}`))
			})] }),
			/* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: t("search.coverage")
			})
		]
	});
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
	const advisories = route.segments.map((segment) => advisoryFor(segment.id)).filter((advisory) => advisory !== void 0);
	const timestamps = advisories.map(getAdvisorySourceTimestamp).filter((timestamp) => timestamp !== void 0);
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
			/* @__PURE__ */ jsxs("p", {
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
			children: [/* @__PURE__ */ jsx(ActionBadge, { level: a.level }), /* @__PURE__ */ jsx(FreshnessChip, { sourceTimestamp: getAdvisorySourceTimestamp(a) })]
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
