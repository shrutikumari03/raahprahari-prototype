import { r as usePrefs } from "./preferences-fp02ms8_.js";
import { t as MountainBanner } from "./mountain-banner-DoLOO_24.js";
import { t as Input } from "./input-Cf23LXr0.js";
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Ban, Clock3, LockKeyhole, Map, Search, ShieldAlert, TriangleAlert } from "lucide-react";
// src/routes/help.tsx?tsr-split=component
var topics = [
	{
		key: "report",
		icon: TriangleAlert
	},
	{
		key: "status",
		icon: ShieldAlert
	},
	{
		key: "freshness",
		icon: Clock3
	},
	{
		key: "map",
		icon: Map
	},
	{
		key: "privacy",
		icon: LockKeyhole
	},
	{
		key: "restrictions",
		icon: Ban
	}
];
function HelpPage() {
	const { t } = usePrefs();
	const [query, setQuery] = useState("");
	const filtered = useMemo(() => {
		const normalized = query.trim().toLocaleLowerCase();
		if (!normalized) return topics;
		return topics.filter((topic) => `${t(`help.${topic.key}`)} ${t(`help.${topic.key}Body`)}`.toLocaleLowerCase().includes(normalized));
	}, [query, t]);
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ jsx(MountainBanner, {
			eyebrow: t("hero.eyebrow"),
			title: t("help.title"),
			description: t("help.subtitle")
		}), /* @__PURE__ */ jsxs("div", {
			className: "rp-container max-w-6xl space-y-6 py-6",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "max-w-3xl text-muted-foreground",
					children: t("help.body")
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "relative block max-w-xl",
					children: [/* @__PURE__ */ jsx(Search, {
						"aria-hidden": true,
						className: "absolute top-3.5 left-3.5 size-4 text-muted-foreground"
					}), /* @__PURE__ */ jsx(Input, {
						type: "search",
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: t("help.search"),
						className: "h-12 rounded-xl pl-10"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
					children: [filtered.map(({ key, icon: Icon }) => /* @__PURE__ */ jsxs("article", {
						className: "rounded-2xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ jsx(Icon, {
								"aria-hidden": true,
								className: "mb-3 size-5 text-brand-orange"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "font-display text-lg font-semibold",
								children: t(`help.${key}`)
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: t(`help.${key}Body`)
							})
						]
					}, key)), filtered.length === 0 && /* @__PURE__ */ jsx("p", {
						className: "rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground",
						children: t("adv.empty")
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "rounded-xl border-l-4 border-brand-orange bg-raised p-4 text-sm font-medium",
					children: t("help.reminder")
				})
			]
		})]
	});
}
export { HelpPage as component };
