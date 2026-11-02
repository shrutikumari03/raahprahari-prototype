import { a as cn, r as useLocalState, t as STORAGE_KEYS } from "./storage-wbzgXpjQ.js";
import { t as Button } from "./button-DxFltwjo.js";
import { a as COVERAGE_BOUNDS, c as QUICK_PICKS, d as SEGMENTS, p as placeById, r as usePrefs, s as PLACES } from "./preferences-Bu-IUfe0.js";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowUpDown, LocateFixed, MapPin, RotateCcw, Search, X } from "lucide-react";
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
export { routeLabel as n, RouteSearchCard as r, findSeededRoutes as t };
