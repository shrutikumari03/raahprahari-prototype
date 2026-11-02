import { t as Button } from "./button-DxFltwjo.js";
import { r as usePrefs } from "./preferences-fp02ms8_.js";
import { t as MountainBanner } from "./mountain-banner-DoLOO_24.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, BadgeInfo, Database, Route } from "lucide-react";
// src/routes/about.tsx?tsr-split=component
function AboutPage() {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ jsx(MountainBanner, {
			eyebrow: t("hero.eyebrow"),
			title: t("about.title"),
			description: t("about.body")
		}), /* @__PURE__ */ jsxs("div", {
			className: "rp-container max-w-5xl space-y-5 py-6",
			children: [/* @__PURE__ */ jsx("div", {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					{
						icon: Database,
						title: t("about.syntheticTitle"),
						body: t("about.syntheticBody")
					},
					{
						icon: BadgeInfo,
						title: t("about.uncertaintyTitle"),
						body: t("about.uncertaintyBody")
					},
					{
						icon: Route,
						title: t("about.coverageTitle"),
						body: t("about.coverageBody")
					}
				].map(({ icon: Icon, title, body }) => /* @__PURE__ */ jsxs("article", {
					className: "rounded-2xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ jsx(Icon, {
							"aria-hidden": true,
							className: "mb-3 size-5 text-brand-orange"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "font-display text-lg font-semibold",
							children: title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: body
						})
					]
				}, title))
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						className: "min-h-11 rounded-xl",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/traveller",
							children: [
								t("nav.advisories"),
								" ",
								/* @__PURE__ */ jsx(ArrowRight, { "aria-hidden": true })
							]
						})
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						className: "min-h-11 rounded-xl",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/help",
							children: t("nav.help")
						})
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						className: "min-h-11 rounded-xl",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/contact",
							children: t("footer.contact")
						})
					})
				]
			})]
		})]
	});
}
export { AboutPage as component };
