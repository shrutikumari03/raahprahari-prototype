import { r as usePrefs } from "./preferences-DeZH5r-v.js";
import { jsx, jsxs } from "react/jsx-runtime";
// src/components/mountain-banner.tsx
function MountainBanner({ eyebrow, title, description, children, className = "" }) {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("section", {
		className: `relative isolate overflow-hidden border-b border-border ${className}`,
		children: [
			/* @__PURE__ */ jsx("img", {
				src: "/img/hero-road-generated.svg",
				alt: t("hero.imageAlt"),
				className: "absolute inset-0 -z-20 size-full object-cover object-[60%_center]"
			}),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-to-r from-[#07151f]/95 via-[#07151f]/85 to-[#07151f]/55" }),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-[#07151f]/75 to-transparent" }),
			/* @__PURE__ */ jsxs("div", {
				className: "rp-container py-8 md:py-12",
				children: [
					eyebrow && /* @__PURE__ */ jsxs("p", {
						className: "mb-2 inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-blue-on-dark uppercase",
						children: [/* @__PURE__ */ jsx("span", {
							"aria-hidden": true,
							className: "h-0.5 w-7 bg-brand-orange"
						}), eyebrow]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "max-w-4xl font-display text-3xl leading-tight font-bold text-text-on-charcoal sm:text-4xl md:text-5xl",
						children: title
					}),
					description && /* @__PURE__ */ jsx("p", {
						className: "mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base",
						children: description
					}),
					children
				]
			})
		]
	});
}
export { MountainBanner as t };
