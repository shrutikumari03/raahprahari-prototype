import { a as cn } from "./storage-wbzgXpjQ.js";
import { t as Button } from "./button-DxFltwjo.js";
import { d as SEGMENTS, r as usePrefs } from "./preferences-Bu-IUfe0.js";
import { h as EmptyState } from "./router-BV9_Jy_b.js";
import { t as MountainBanner } from "./mountain-banner-DWXJ4Pvl.js";
import { t as advisoryFor } from "./data-DcVb_IFo.js";
import { t as AdvisoryCard } from "./advisory-card-BvGHbWIS.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/routes/advisories.index.tsx?tsr-split=component
function AdvisoriesPage() {
	const { t } = usePrefs();
	const [filter, setFilter] = useState("all");
	const segments = SEGMENTS.filter((segment) => {
		const advisory = advisoryFor(segment.id);
		if (!advisory) throw new Error(`Missing advisory for segment "${segment.id}"`);
		if (filter === "issues") return advisory.level === "caution" || advisory.level === "avoid" || advisory.level === "do_not_travel";
		if (filter === "official") return !!advisory.restriction;
		if (filter === "unknown") return advisory.level === "unknown" || advisory.stale;
		return true;
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ jsx(MountainBanner, {
			eyebrow: t("hero.eyebrow"),
			title: t("adv.title"),
			description: t("adv.body")
		}), /* @__PURE__ */ jsxs("div", {
			className: "rp-container space-y-5 py-6",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-2",
				role: "group",
				"aria-label": t("adv.filter"),
				children: [
					"all",
					"issues",
					"official",
					"unknown"
				].map((value) => /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: filter === value ? "secondary" : "outline",
					"aria-pressed": filter === value,
					className: cn("min-h-11 rounded-full", filter === value && "text-link"),
					onClick: () => setFilter(value),
					children: t(value === "all" ? "adv.filterAll" : value === "issues" ? "adv.filterIssues" : value === "official" ? "adv.filterOfficial" : "adv.filterUnknown")
				}, value))
			}), segments.length ? /* @__PURE__ */ jsx("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: segments.map((segment) => /* @__PURE__ */ jsx(AdvisoryCard, { segment }, segment.id))
			}) : /* @__PURE__ */ jsx(EmptyState, {
				title: t("adv.empty"),
				message: t("help.reminder")
			})]
		})]
	});
}
export { AdvisoriesPage as component };
