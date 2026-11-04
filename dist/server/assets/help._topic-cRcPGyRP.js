import { r as usePrefs } from "./preferences-DBvlyYo_.js";
import "./help-topics-DIFwWNW5.js";
import { n as Route$1 } from "./router-CncHJqcZ.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft } from "lucide-react";
// src/routes/help.$topic.tsx?tsr-split=component
function HelpTopicPage() {
	const topic = Route$1.useLoaderData();
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("div", {
		className: "help-detail-page",
		children: [/* @__PURE__ */ jsx("header", {
			className: "help-banner help-detail-banner",
			children: /* @__PURE__ */ jsxs("div", {
				className: "help-container help-banner-content",
				children: [
					/* @__PURE__ */ jsxs(Link, {
						to: "/help",
						className: "help-detail-back",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { "aria-hidden": true }), t("help.backTopics")]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "help-eyebrow",
						children: [/* @__PURE__ */ jsx("span", { "aria-hidden": true }), t("help.eyebrow")]
					}),
					/* @__PURE__ */ jsx("h1", { children: t(topic.titleKey) }),
					topic.slug === "map-offline" && /* @__PURE__ */ jsx("span", {
						className: "help-planned help-planned-detail",
						children: t("help.planned")
					})
				]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "help-container help-detail-content",
			children: [/* @__PURE__ */ jsxs("article", {
				className: "help-detail-card",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "help-detail-intro",
						children: t(topic.descriptionKey)
					}),
					/* @__PURE__ */ jsx("h2", { children: t(topic.detailTitleKey) }),
					/* @__PURE__ */ jsx("p", { children: t(topic.detailBodyKey) }),
					topic.detailExtraKey && /* @__PURE__ */ jsx("p", { children: t(topic.detailExtraKey) }),
					/* @__PURE__ */ jsx("p", {
						className: "help-detail-caution",
						children: t("help.reminderBody")
					})
				]
			}), /* @__PURE__ */ jsxs(Link, {
				to: "/help",
				className: "help-back-link",
				children: [/* @__PURE__ */ jsx(ArrowLeft, { "aria-hidden": true }), t("help.backTopics")]
			})]
		})]
	});
}
export { HelpTopicPage as component };
