import { a as cn } from "./storage-wbzgXpjQ.js";
import { t as Button } from "./button-DxFltwjo.js";
import { d as SEGMENTS, p as placeById, r as usePrefs } from "./preferences-fp02ms8_.js";
import { m as EmptyState, r as Route$1 } from "./router-Dv_byq0j.js";
import { t as MountainBanner } from "./mountain-banner-DoLOO_24.js";
import { t as advisoryFor } from "./data-F-5sDpLM.js";
import { n as MapLegend, r as SchematicMap, t as SegmentDetail } from "./segment-detail-DjWFO08H.js";
import { t as AdvisoryCard } from "./advisory-card-DeQ1FGiX.js";
import { t as RouteSearchCard } from "./route-search-Bdob1mo-.js";
import { t as findSeededRoutes } from "./routing-BBitn4d6.js";
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { List, Map } from "lucide-react";
// src/routes/traveller.tsx?tsr-split=component
function TravellerPage() {
	const { t, place } = usePrefs();
	const search = Route$1.useSearch();
	const [view, setView] = useState(search.view ?? "map");
	const from = search.from && placeById(search.from) ? search.from : void 0;
	const to = search.to && placeById(search.to) ? search.to : void 0;
	const journey = !!from && !!to && from !== to;
	const routes = useMemo(() => from && to && from !== to ? findSeededRoutes(from, to) : [], [from, to]);
	const routeSegmentIds = new Set(routes.flatMap((route) => route.segments.map((segment) => segment.id)));
	const segments = journey ? SEGMENTS.filter((segment) => routeSegmentIds.has(segment.id)) : SEGMENTS;
	const [selectedSegmentId, setSelectedSegmentId] = useState(search.seg);
	const advisories = segments.map((segment) => {
		const advisory = advisoryFor(segment.id);
		if (!advisory) throw new Error(`Missing advisory for segment "${segment.id}"`);
		return advisory;
	});
	const hazards = advisories.reduce((count, advisory) => count + advisory.evidence.filter((evidence) => evidence.kind === "hazard").length, 0);
	const restrictions = advisories.filter((advisory) => advisory.restriction).length;
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ jsx(MountainBanner, {
			eyebrow: t("hero.eyebrow"),
			title: t("traveller.title"),
			description: t("traveller.body")
		}), /* @__PURE__ */ jsxs("div", {
			className: "rp-container grid gap-5 py-6 lg:grid-cols-[minmax(17rem,0.8fr)_minmax(0,1.8fr)]",
			children: [/* @__PURE__ */ jsx("section", {
				"aria-label": t("search.title"),
				className: "rounded-2xl border border-border bg-card p-4 sm:p-5",
				children: /* @__PURE__ */ jsx(RouteSearchCard, {
					initialFrom: from,
					initialTo: to,
					destination: "traveller"
				})
			}), /* @__PURE__ */ jsxs("section", {
				"aria-labelledby": "traveller-results",
				className: "min-w-0 space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							id: "traveller-results",
							className: "font-display text-2xl font-semibold",
							children: journey && from && to ? `${place(from)} – ${place(to)}` : t("adv.title")
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: journey ? `${routes.length} ${t("results.title").toLowerCase()}` : t("adv.body")
						})] }), /* @__PURE__ */ jsx("div", {
							role: "group",
							"aria-label": `${t("view.map")} / ${t("view.list")}`,
							className: "inline-flex rounded-full border border-border p-1",
							children: ["map", "list"].map((nextView) => /* @__PURE__ */ jsxs(Button, {
								type: "button",
								variant: view === nextView ? "secondary" : "ghost",
								"aria-pressed": view === nextView,
								className: cn("h-10 rounded-full px-3", view === nextView && "text-link"),
								onClick: () => setView(nextView),
								children: [nextView === "map" ? /* @__PURE__ */ jsx(Map, { "aria-hidden": true }) : /* @__PURE__ */ jsx(List, { "aria-hidden": true }), t(`view.${nextView}`)]
							}, nextView))
						})]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ jsxs("span", { children: [
								hazards,
								" ",
								t("results.hazards")
							] }),
							/* @__PURE__ */ jsxs("span", { children: [
								restrictions,
								" ",
								t("results.restrictions")
							] }),
							/* @__PURE__ */ jsx("span", { children: t("results.seeded") })
						]
					}),
					journey && routes.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
						title: t("results.none"),
						message: t("results.noneBody")
					}) : view === "map" ? /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ jsx(SchematicMap, {
								endpoints: journey ? [from, to] : void 0,
								highlight: journey ? [...routeSegmentIds] : void 0,
								selectedSegmentId,
								onSelectSegment: setSelectedSegmentId,
								className: "max-h-[70vh]"
							}), /* @__PURE__ */ jsx(MapLegend, {})]
						}), /* @__PURE__ */ jsx(SegmentDetail, { segmentId: selectedSegmentId })]
					}) : /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: segments.map((segment) => /* @__PURE__ */ jsx(AdvisoryCard, { segment }, segment.id))
					})
				]
			})]
		})]
	});
}
export { TravellerPage as component };
