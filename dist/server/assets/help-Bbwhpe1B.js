import { r as usePrefs } from "./preferences-DBvlyYo_.js";
import { r as DemoBadge } from "./advisory-BPMF_APe.js";
import { t as helpTopics } from "./help-topics-DIFwWNW5.js";
import { t as Input } from "./input-n37Y3LiM.js";
import { useMemo, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowRight, Clock3, FileText, Landmark, LockKeyhole, Map, Mountain, Search, ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";
// src/routes/help.tsx?tsr-split=component
var topicIcons = {
	report: TriangleAlert,
	status: ShieldAlert,
	freshness: Clock3,
	"map-offline": Map,
	privacy: LockKeyhole,
	restrictions: Landmark
};
function HelpPage() {
	const { t } = usePrefs();
	const isHelpTopic = useRouterState({ select: (state) => state.location.pathname !== "/help" });
	const [query, setQuery] = useState("");
	const filteredTopics = useMemo(() => {
		const normalized = query.trim().toLocaleLowerCase();
		if (!normalized) return helpTopics;
		return helpTopics.filter(({ titleKey, descriptionKey }) => `${t(titleKey)} ${t(descriptionKey)}`.toLocaleLowerCase().includes(normalized));
	}, [query, t]);
	if (isHelpTopic) return /* @__PURE__ */ jsx(Outlet, {});
	return /* @__PURE__ */ jsxs("div", {
		className: "help-page",
		children: [
			/* @__PURE__ */ jsx("header", {
				className: "help-banner",
				children: /* @__PURE__ */ jsxs("div", {
					className: "help-container help-banner-content",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "help-eyebrow",
							children: [/* @__PURE__ */ jsx("span", { "aria-hidden": true }), t("help.eyebrow")]
						}),
						/* @__PURE__ */ jsx("h1", { children: t("help.title") }),
						/* @__PURE__ */ jsx("p", {
							className: "help-banner-description",
							children: t("help.subtitle")
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "help-container help-content",
				children: [/* @__PURE__ */ jsxs("section", {
					className: "help-topics",
					"aria-label": t("help.topics"),
					children: [/* @__PURE__ */ jsxs("label", {
						className: "help-search",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "sr-only",
								children: t("help.search")
							}),
							/* @__PURE__ */ jsx(Search, {
								"aria-hidden": true,
								className: "help-search-icon"
							}),
							/* @__PURE__ */ jsx(Input, {
								type: "search",
								value: query,
								onChange: (event) => setQuery(event.target.value),
								placeholder: t("help.search"),
								className: "help-search-input"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "help-topic-grid",
						children: [filteredTopics.map(({ slug, titleKey, descriptionKey }) => {
							const Icon = topicIcons[slug];
							return /* @__PURE__ */ jsxs(Link, {
								to: "/help/$topic",
								params: { topic: slug },
								className: "help-topic-card",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: `help-topic-icon help-topic-icon-${slug}`,
										"aria-hidden": true,
										children: /* @__PURE__ */ jsx(Icon, {})
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "help-topic-copy",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "help-topic-title",
											children: [t(titleKey), slug === "map-offline" && /* @__PURE__ */ jsx("span", {
												className: "help-planned",
												children: t("help.planned")
											})]
										}), /* @__PURE__ */ jsx("span", {
											className: "help-topic-description",
											children: t(descriptionKey)
										})]
									}),
									/* @__PURE__ */ jsx(ArrowRight, {
										"aria-hidden": true,
										className: "help-topic-arrow"
									})
								]
							}, slug);
						}), filteredTopics.length === 0 && /* @__PURE__ */ jsx("p", {
							className: "help-empty",
							role: "status",
							children: t("help.empty")
						})]
					})]
				}), /* @__PURE__ */ jsx("aside", {
					className: "help-reminder",
					"aria-labelledby": "help-reminder-title",
					children: /* @__PURE__ */ jsxs("div", {
						className: "help-reminder-content",
						children: [
							/* @__PURE__ */ jsxs("p", {
								className: "help-reminder-label",
								children: [/* @__PURE__ */ jsx(ShieldAlert, { "aria-hidden": true }), t("help.reminderLabel")]
							}),
							/* @__PURE__ */ jsx("h2", {
								id: "help-reminder-title",
								children: t("help.reminderTitle")
							}),
							/* @__PURE__ */ jsx("p", {
								className: "help-reminder-body",
								children: t("help.reminderBody")
							}),
							/* @__PURE__ */ jsx("span", {
								className: "help-reminder-rule",
								"aria-hidden": true
							}),
							/* @__PURE__ */ jsxs("ul", {
								className: "help-reminder-items",
								children: [
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(Mountain, { "aria-hidden": true }), /* @__PURE__ */ jsx("span", { children: t("help.reminderConditions") })] }),
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(FileText, { "aria-hidden": true }), /* @__PURE__ */ jsx("span", { children: t("help.reminderUpdates") })] }),
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(ShieldCheck, { "aria-hidden": true }), /* @__PURE__ */ jsx("span", { children: t("help.reminderResponsibly") })] })
								]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "help-page-footer",
				children: /* @__PURE__ */ jsxs("div", {
					className: "help-container help-footer-content",
					children: [/* @__PURE__ */ jsxs(Link, {
						to: "/",
						className: "help-back-link",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { "aria-hidden": true }), t("help.backHome")]
					}), /* @__PURE__ */ jsx(DemoBadge, { className: "help-demo-badge" })]
				})
			})
		]
	});
}
export { HelpPage as component };
