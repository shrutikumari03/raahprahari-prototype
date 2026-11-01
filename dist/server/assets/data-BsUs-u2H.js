import { _ as Button, a as useLocalState, c as DEMO_NOW, d as REPORTS, f as RESTRICTIONS, i as STORAGE_KEYS, l as PLACES, p as SEGMENTS, r as usePrefs, s as COVERAGE_BOUNDS, u as QUICK_PICKS, v as cn } from "./router-BPRhBg53.js";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowUpDown, CircleCheck, CircleQuestionMark, Clock, FlaskConical, LocateFixed, MapPin, OctagonAlert, OctagonX, RotateCcw, Search, ShieldCheck, TriangleAlert, X } from "lucide-react";
// src/components/advisory.tsx
var LEVEL_META = {
	clear: {
		icon: CircleCheck,
		color: "var(--status-clear)",
		chip: "bg-status-clear/15 border-status-clear/60",
		bar: "bg-status-clear"
	},
	caution: {
		icon: TriangleAlert,
		color: "var(--status-caution)",
		chip: "bg-status-caution/15 border-status-caution/70",
		bar: "bg-status-caution"
	},
	avoid: {
		icon: OctagonAlert,
		color: "var(--status-avoid)",
		chip: "bg-status-avoid/15 border-status-avoid/70",
		bar: "bg-status-avoid"
	},
	do_not_travel: {
		icon: OctagonX,
		color: "var(--status-dnt)",
		chip: "bg-status-dnt/15 border-status-dnt/70",
		bar: "bg-status-dnt"
	},
	unknown: {
		icon: CircleQuestionMark,
		color: "var(--status-unknown)",
		chip: "bg-status-unknown/15 border-status-unknown/60",
		bar: "bg-status-unknown"
	}
};
function AdvisoryBadge({ level, size = "sm", className }) {
	const { t } = usePrefs();
	const meta = LEVEL_META[level];
	const Icon = meta.icon;
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border font-semibold text-foreground", size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs", meta.chip, className),
		children: [/* @__PURE__ */ jsx(Icon, {
			"aria-hidden": true,
			className: size === "lg" ? "size-4" : "size-3.5",
			style: { color: meta.color }
		}), t(`level.${level}`)]
	});
}
function StaleBadge({ age, className }) {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border border-dashed border-muted-foreground/70 px-2.5 py-0.5 text-xs font-medium text-muted-foreground", className),
		children: [
			/* @__PURE__ */ jsx(Clock, {
				"aria-hidden": true,
				className: "size-3.5"
			}),
			t("level.stale"),
			age ? ` · ${age}` : ""
		]
	});
}
function OfficialBadge({ label, className }) {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border border-status-official/70 bg-status-official/15 px-2.5 py-0.5 text-xs font-semibold text-foreground", className),
		children: [/* @__PURE__ */ jsx(ShieldCheck, {
			"aria-hidden": true,
			className: "size-3.5 text-status-official"
		}), label ?? t("level.official")]
	});
}
function DemoBadge({ className }) {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-md border border-border bg-background/70 px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide text-muted-foreground uppercase", className),
		children: [/* @__PURE__ */ jsx(FlaskConical, {
			"aria-hidden": true,
			className: "size-3"
		}), t("demo.badge")]
	});
}
function RoadCode({ children, className }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn("font-mono text-xs font-medium tracking-tight text-muted-foreground", className),
		children
	});
}
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
function RouteSearchCard({ initialFrom = null, initialTo = null, layout = "stacked", className }) {
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
		navigate({
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
						className: cn("min-h-9 rounded-full border px-3 text-sm transition-colors", selected ? "border-brand-orange bg-brand-orange/15 text-foreground" : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"),
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
					className: "inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent px-3 text-sm hover:bg-muted",
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
var LEVEL_RANK = {
	clear: 0,
	unknown: 1,
	caution: 2,
	avoid: 3,
	do_not_travel: 4
};
var RESTRICTION_LEVEL = {
	road_closed: "do_not_travel",
	partially_restricted: "avoid",
	vehicle_restricted: "caution",
	time_bound: "caution"
};
var IGNORED = ["rejected", "duplicate"];
function isRestrictionInForce(r) {
	return r.status !== "lifted";
}
function computeSegmentAdvisory(segmentId, reports, restrictions, now) {
	const segReports = reports.filter((r) => r.segmentId === segmentId && !IGNORED.includes(r.status)).sort((a, b) => b.observedAt - a.observedAt);
	const latestObservationAt = segReports[0]?.observedAt;
	const reviewedCount = segReports.filter((r) => r.status === "verified").length;
	const freshHazards = segReports.filter((r) => r.kind === "hazard" && now - r.observedAt <= 864e5);
	const freshClears = segReports.filter((r) => r.kind === "clear" && now - r.observedAt <= 432e5);
	const evidence = [...freshHazards, ...freshClears].sort((a, b) => b.observedAt - a.observedAt);
	const base = {
		segmentId,
		latestObservationAt,
		reviewedCount,
		restrictionPastReview: false,
		awaitingClearance: false,
		stale: false
	};
	const restriction = restrictions.filter((r) => r.segmentId === segmentId && isRestrictionInForce(r)).sort((a, b) => LEVEL_RANK[RESTRICTION_LEVEL[b.type]] - LEVEL_RANK[RESTRICTION_LEVEL[a.type]])[0];
	if (restriction) return {
		...base,
		level: RESTRICTION_LEVEL[restriction.type],
		basis: "official",
		restriction,
		restrictionPastReview: now > restriction.reviewBy,
		awaitingClearance: restriction.clearance === "pending",
		evidence: evidence.length ? evidence : segReports.slice(0, 3)
	};
	if (freshHazards.length) {
		if (freshClears.length > 0 || freshHazards.some((r) => r.status === "conflicting")) return {
			...base,
			level: "caution",
			basis: "conflicting",
			evidence
		};
		const high = freshHazards.filter((r) => r.severity === "high");
		const corroborated = high.length >= 2 && high.some((r) => r.status === "verified");
		return {
			...base,
			level: corroborated ? "avoid" : "caution",
			basis: corroborated ? "corroborated" : "single_report",
			evidence
		};
	}
	if (freshClears.filter((r) => r.status === "verified").length) return {
		...base,
		level: "clear",
		basis: "verified_clear",
		evidence
	};
	if (segReports.length) return {
		...base,
		level: "unknown",
		basis: "stale_only",
		stale: true,
		evidence: segReports.slice(0, 3)
	};
	return {
		...base,
		level: "unknown",
		basis: "no_evidence",
		evidence: []
	};
}
function summariseRoute(segments, advisories) {
	const byId = new Map(advisories.map((a) => [a.segmentId, a]));
	let total = 0;
	let unknownKm = 0;
	let level = "clear";
	let hazardCount = 0;
	let restrictionCount = 0;
	let latest;
	let awaitingClearance = false;
	for (const s of segments) {
		const a = byId.get(s.id);
		total += s.distanceKm;
		if (!a || a.level === "unknown") unknownKm += s.distanceKm;
		const l = a?.level ?? "unknown";
		if (LEVEL_RANK[l] > LEVEL_RANK[level]) level = l;
		if (!a) continue;
		hazardCount += a.evidence.filter((r) => r.kind === "hazard").length;
		if (a.restriction) restrictionCount++;
		if (a.awaitingClearance) awaitingClearance = true;
		if (a.latestObservationAt && (!latest || a.latestObservationAt > latest)) latest = a.latestObservationAt;
	}
	const coverage = total ? (total - unknownKm) / total : 0;
	return {
		level,
		coverage,
		unknownKm,
		hazardCount,
		restrictionCount,
		latestObservationAt: latest,
		poorCoverage: coverage < .5,
		awaitingClearance
	};
}
// src/lib/data.ts
var cache = null;
function getAdvisories() {
	if (!cache) cache = new Map(SEGMENTS.map((s) => [s.id, computeSegmentAdvisory(s.id, REPORTS, RESTRICTIONS, DEMO_NOW)]));
	return cache;
}
var advisoryFor = (segmentId) => getAdvisories().get(segmentId);
export { AdvisoryBadge as a, OfficialBadge as c, RouteSearchCard as i, RoadCode as l, getAdvisories as n, DemoBadge as o, summariseRoute as r, LEVEL_META as s, advisoryFor as t, StaleBadge as u };
