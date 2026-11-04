import { t as cn } from "./utils-DWGjSd5x.js";
import { t as Button } from "./button-CFj87KzT.js";
import { t as EmptyState } from "./feedback-xDcASEeC.js";
import { d as SEGMENTS, r as usePrefs } from "./preferences-En5FkRWn.js";
import { r as DemoBadge } from "./advisory-DwhbdhLm.js";
import { t as advisoryFor } from "./data-DQH5I2KP.js";
import "./router-C2M5jaWW.js";
import { t as AdvisoryCard } from "./advisory-card-CfSLJOkc.js";
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
		className: "advisories-list-page pb-8",
		children: [/* @__PURE__ */ jsx("header", {
			className: "advisories-list-banner",
			children: /* @__PURE__ */ jsxs("div", {
				className: "rp-container py-8 md:py-12",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "mb-2 inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-blue-on-dark uppercase",
						children: [/* @__PURE__ */ jsx("span", {
							"aria-hidden": true,
							className: "h-0.5 w-7 bg-brand-orange"
						}), t("hero.eyebrow")]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "max-w-4xl font-display text-3xl leading-tight font-bold text-text-on-charcoal sm:text-4xl md:text-5xl",
						children: t("adv.title")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base",
						children: t("adv.body")
					}),
					/* @__PURE__ */ jsx(DemoBadge, { className: "mt-4" })
				]
			})
		}), /* @__PURE__ */ jsxs("main", {
			className: "rp-container space-y-5 py-6",
			children: [/* @__PURE__ */ jsx("div", {
				className: "advisories-filter-scroll",
				children: /* @__PURE__ */ jsx("div", {
					className: "flex w-max min-w-full flex-nowrap gap-2 md:w-auto md:min-w-0 md:flex-wrap",
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
						className: cn("advisories-filter-pill min-h-11 shrink-0 rounded-full", filter === value && "text-link"),
						onClick: () => setFilter(value),
						children: t(value === "all" ? "adv.filterAll" : value === "issues" ? "adv.filterIssues" : value === "official" ? "adv.filterOfficial" : "adv.filterUnknown")
					}, value))
				})
			}), segments.length ? /* @__PURE__ */ jsx("div", {
				className: "grid min-w-0 grid-cols-1 items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: segments.map((segment) => /* @__PURE__ */ jsx(AdvisoryCard, {
					segment,
					showRestrictionDetail: true
				}, segment.id))
			}) : /* @__PURE__ */ jsx(EmptyState, {
				title: t("adv.empty"),
				message: t("help.reminder")
			})]
		})]
	});
}
export { AdvisoriesPage as component };
