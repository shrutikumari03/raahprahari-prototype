import { t as Button } from "./button-DxFltwjo.js";
import { r as usePrefs } from "./preferences-Bu-IUfe0.js";
import { t as MountainBanner } from "./mountain-banner-DWXJ4Pvl.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Mail } from "lucide-react";
// src/routes/contact.tsx?tsr-split=component
function ContactPage() {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ jsx(MountainBanner, {
			eyebrow: t("hero.eyebrow"),
			title: t("contact.title"),
			description: t("contact.body")
		}), /* @__PURE__ */ jsx("div", {
			className: "rp-container max-w-3xl py-8",
			children: /* @__PURE__ */ jsxs("section", {
				className: "rounded-2xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ jsx(Mail, {
						"aria-hidden": true,
						className: "mb-3 size-6 text-brand-orange"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "font-display text-xl font-semibold",
						children: t("contact.title")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: t("contact.body")
					}),
					/* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						className: "mt-5 min-h-11 rounded-xl",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/about",
							children: [/* @__PURE__ */ jsx(ArrowLeft, { "aria-hidden": true }), t("about.title")]
						})
					})
				]
			})
		})]
	});
}
export { ContactPage as component };
