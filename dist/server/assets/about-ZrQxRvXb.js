import { t as PageBanner } from "./page-banner-C3-9OndR.js";
import { t as Button } from "./button-CFj87KzT.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, BadgeInfo, Database, Route } from "lucide-react";
// src/routes/about.tsx?tsr-split=component
function AboutPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "rp-info-page",
		children: [/* @__PURE__ */ jsx(PageBanner, {
			eyebrow: "ABOUT",
			title: "About RaahPrahari",
			description: "RaahPrahari shows reported road hazards, information freshness and official restrictions together so travellers can decide with more context."
		}), /* @__PURE__ */ jsxs("div", {
			className: "rp-info-container rp-info-content",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "grid gap-3 min-[600px]:grid-cols-2 min-[1050px]:grid-cols-3",
				children: [
					/* @__PURE__ */ jsxs("article", {
						className: "rp-info-card",
						children: [
							/* @__PURE__ */ jsx(Database, {
								"aria-hidden": true,
								className: "mb-3 size-5 text-brand-orange"
							}),
							/* @__PURE__ */ jsx("h2", { children: "What this prototype is" }),
							/* @__PURE__ */ jsx("p", { children: "RaahPrahari is a prototype with synthetic demo data. It is not a live service, and its displayed reports and road information should not be treated as current real-world conditions." })
						]
					}),
					/* @__PURE__ */ jsxs("article", {
						className: "rp-info-card",
						children: [
							/* @__PURE__ */ jsx(BadgeInfo, {
								"aria-hidden": true,
								className: "mb-3 size-5 text-brand-orange"
							}),
							/* @__PURE__ */ jsx("h2", { children: "How to read an advisory" }),
							/* @__PURE__ */ jsx("p", { children: "An observed condition, advisory action, official restriction, supporting evidence and information freshness are shown separately." }),
							/* @__PURE__ */ jsxs("ul", {
								className: "mt-3 space-y-2 pl-5",
								children: [
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "CAUTION:" }), " use added care for the reported condition."] }),
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "AVOID:" }), " avoid the route as advised."] }),
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "UNKNOWN:" }), " the current status is not known."] })
								]
							}),
							/* @__PURE__ */ jsx("p", { children: "Unknown or stale information is never shown as safe and is not a safety clearance." })
						]
					}),
					/* @__PURE__ */ jsxs("article", {
						className: "rp-info-card",
						children: [
							/* @__PURE__ */ jsx(Route, {
								"aria-hidden": true,
								className: "mb-3 size-5 text-brand-orange"
							}),
							/* @__PURE__ */ jsx("h2", { children: "What reports can and cannot do" }),
							/* @__PURE__ */ jsxs("p", { children: [
								"A report, score, reputation or AI output cannot create or remove an official road closure. Any clearance remains",
								" ",
								/* @__PURE__ */ jsx("strong", { children: "Awaiting verification" }),
								" until the approved process resolves it."
							] })
						]
					})
				]
			}), /* @__PURE__ */ jsxs("nav", {
				className: "rp-info-actions",
				"aria-label": "Explore RaahPrahari",
				children: [
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						className: "min-h-11 rounded-xl",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/traveller",
							children: ["Check a road ", /* @__PURE__ */ jsx(ArrowRight, { "aria-hidden": true })]
						})
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						className: "min-h-11 rounded-xl",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/advisories",
							children: "View advisories"
						})
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						className: "min-h-11 rounded-xl",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/help",
							children: "Help"
						})
					})
				]
			})]
		})]
	});
}
export { AboutPage as component };
