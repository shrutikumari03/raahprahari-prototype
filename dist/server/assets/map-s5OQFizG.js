import { a as cn } from "./storage-wbzgXpjQ.js";
import { t as Button } from "./button-DxFltwjo.js";
import { d as SEGMENTS, r as usePrefs } from "./preferences-fp02ms8_.js";
import { i as Route$1 } from "./router-Dv_byq0j.js";
import { t as MountainBanner } from "./mountain-banner-DoLOO_24.js";
import { n as MapLegend, r as SchematicMap, t as SegmentDetail } from "./segment-detail-DjWFO08H.js";
import { t as AdvisoryCard } from "./advisory-card-DeQ1FGiX.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { List, Map } from "lucide-react";
// src/routes/map.tsx?tsr-split=component
function MapPage() {
	const { t } = usePrefs();
	const search = Route$1.useSearch();
	const [selectedSegmentId, setSelectedSegmentId] = useState(search.seg);
	const [view, setView] = useState(search.view ?? "map");
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ jsx(MountainBanner, {
			eyebrow: t("hero.eyebrow"),
			title: t("nav.map"),
			description: t("map.description")
		}), /* @__PURE__ */ jsxs("div", {
			className: "rp-container space-y-4 py-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("span", { children: t("map.coverage") }),
						/* @__PURE__ */ jsx("span", {
							"aria-hidden": true,
							children: "·"
						}),
						/* @__PURE__ */ jsx("span", { children: t("map.seededData") })
					]
				}), /* @__PURE__ */ jsx("div", {
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
			}), view === "map" ? /* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(19rem,0.8fr)]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ jsx(SchematicMap, {
						selectedSegmentId,
						onSelectSegment: setSelectedSegmentId,
						className: "max-h-[76vh]"
					}), /* @__PURE__ */ jsx(MapLegend, {})]
				}), /* @__PURE__ */ jsx(SegmentDetail, { segmentId: selectedSegmentId })]
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
				children: SEGMENTS.map((segment) => /* @__PURE__ */ jsx(AdvisoryCard, { segment }, segment.id))
			})]
		})]
	});
}
export { MapPage as component };
