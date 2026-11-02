import { r as usePrefs } from "./preferences-fp02ms8_.js";
import { n as Route } from "./router-Dv_byq0j.js";
import { t as MountainBanner } from "./mountain-banner-DoLOO_24.js";
import { n as MapLegend, r as SchematicMap, t as SegmentDetail } from "./segment-detail-DjWFO08H.js";
import { jsx, jsxs } from "react/jsx-runtime";
// src/routes/advisories.$segmentId.tsx?tsr-split=component
function SegmentPage() {
	const { t, place } = usePrefs();
	const { segment } = Route.useLoaderData();
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ jsx(MountainBanner, {
			eyebrow: segment.code,
			title: `${place(segment.from)} – ${place(segment.to)}`,
			description: t("segment.title")
		}), /* @__PURE__ */ jsxs("div", {
			className: "rp-container grid gap-5 py-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.8fr)]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsx(SchematicMap, {
					highlight: [segment.id],
					selectedSegmentId: segment.id,
					className: "max-h-[70vh]"
				}), /* @__PURE__ */ jsx(MapLegend, {})]
			}), /* @__PURE__ */ jsx(SegmentDetail, { segmentId: segment.id })]
		})]
	});
}
export { SegmentPage as component };
