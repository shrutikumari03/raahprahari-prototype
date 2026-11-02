import { a as cn } from "./storage-wbzgXpjQ.js";
import { r as usePrefs } from "./preferences-fp02ms8_.js";
import { c as FreshnessChip, d as RoadCode, o as ActionBadge, u as OfficialBadge } from "./router-Dv_byq0j.js";
import { t as advisoryFor } from "./data-F-5sDpLM.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight } from "lucide-react";
// src/components/advisory-card.tsx
function AdvisoryCard({ segment, className }) {
	const { t, place } = usePrefs();
	const advisory = advisoryFor(segment.id);
	if (!advisory) throw new Error(`Missing advisory for segment "${segment.id}"`);
	const report = advisory.evidence[0];
	const source = advisory.restriction ? t("source.official") : report ? t("source.community") : t("source.unknown");
	return /* @__PURE__ */ jsx("article", {
		className: cn("rounded-xl border border-border bg-card transition-colors hover:border-blue-on-dark/60", className),
		children: /* @__PURE__ */ jsxs(Link, {
			to: "/advisories/$segmentId",
			params: { segmentId: segment.id },
			className: "block rounded-[inherit] p-4 focus-visible:outline-offset-[-3px]",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsxs(RoadCode, { children: [
							segment.code,
							" · km ",
							segment.kmStart,
							"–",
							segment.kmEnd
						] }), /* @__PURE__ */ jsxs("h2", {
							className: "mt-1 font-semibold",
							children: [
								place(segment.from),
								" – ",
								place(segment.to)
							]
						})]
					}), /* @__PURE__ */ jsx(ActionBadge, { level: advisory.level })]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: report?.description ?? t("copy.noRecent")
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-3 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ jsx(FreshnessChip, { sourceTimestamp: advisory.latestObservationAt ?? advisory.restriction?.publishedAt }),
						advisory.restriction && /* @__PURE__ */ jsx(OfficialBadge, { label: t("map.restriction") }),
						/* @__PURE__ */ jsx("span", {
							className: "text-xs text-muted-foreground",
							children: source
						}),
						/* @__PURE__ */ jsx(ArrowRight, {
							"aria-hidden": true,
							className: "ml-auto size-4 text-link"
						})
					]
				})
			]
		})
	});
}
export { AdvisoryCard as t };
