import { a as cn } from "./storage-wbzgXpjQ.js";
import { r as usePrefs } from "./preferences-Bu-IUfe0.js";
import { c as OfficialBadge, l as RoadCode, o as FreshnessChip, r as ActionBadge, t as advisoryFor, u as getAdvisorySourceTimestamp } from "./data-B3r6UVjM.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Clock3, ShieldCheck, TriangleAlert, UsersRound } from "lucide-react";
// src/components/advisory-card.tsx
function AdvisoryCard({ segment, className, variant = "default" }) {
	const { t, place } = usePrefs();
	const advisory = advisoryFor(segment.id);
	if (!advisory) throw new Error(`Missing advisory for segment "${segment.id}"`);
	const report = advisory.evidence[0];
	const sources = [...advisory.evidence.length > 0 ? [t("source.community")] : [], ...advisory.restriction ? [t("source.official")] : []];
	if (variant === "home-featured") {
		const sourceTimestamp = getAdvisorySourceTimestamp(advisory);
		if (sourceTimestamp === void 0) throw new Error(`Missing source timestamp for sample segment "${segment.id}"`);
		const lastUpdated = new Intl.DateTimeFormat("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		}).format(sourceTimestamp);
		return /* @__PURE__ */ jsx("article", {
			className: cn("home-advisory", className),
			children: /* @__PURE__ */ jsxs(Link, {
				to: "/advisories/$segmentId",
				params: { segmentId: segment.id },
				className: "home-advisory-link",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "home-advisory-kicker",
						children: [/* @__PURE__ */ jsx(TriangleAlert, { "aria-hidden": true }), "ROAD ADVISORY"]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "home-advisory-status",
						children: [/* @__PURE__ */ jsx(ActionBadge, {
							level: advisory.level,
							size: "lg",
							className: "home-avoid-badge"
						}), /* @__PURE__ */ jsx(RoadCode, {
							className: "home-advisory-road",
							children: "B-12 · Km 42–48"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "home-advisory-description",
						children: "Reported debris on the road"
					}),
					/* @__PURE__ */ jsxs("dl", {
						className: "home-advisory-details",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx(ShieldCheck, { "aria-hidden": true }),
								/* @__PURE__ */ jsx("dt", { children: "Official restriction:" }),
								/* @__PURE__ */ jsx("dd", { children: "No current official information" })
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx(UsersRound, { "aria-hidden": true }),
								/* @__PURE__ */ jsx("dt", { children: "Evidence:" }),
								/* @__PURE__ */ jsx("dd", { children: "Community corroborated" })
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx(Clock3, { "aria-hidden": true }),
								/* @__PURE__ */ jsx("dt", { children: "Last updated:" }),
								/* @__PURE__ */ jsx("dd", { children: lastUpdated })
							] })
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "home-advisory-footer",
						children: "Illustrative synthetic information"
					})
				]
			})
		});
	}
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
						/* @__PURE__ */ jsx(FreshnessChip, { sourceTimestamp: getAdvisorySourceTimestamp(advisory) }),
						advisory.restriction && /* @__PURE__ */ jsx(OfficialBadge, { label: t("map.restriction") }),
						/* @__PURE__ */ jsx("span", {
							className: "text-xs text-muted-foreground",
							children: sources.length ? sources.join(" · ") : t("source.unknown")
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
