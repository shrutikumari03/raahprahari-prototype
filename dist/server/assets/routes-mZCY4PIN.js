import { m as segmentById, r as usePrefs } from "./preferences-DeZH5r-v.js";
import "./router-AU5llvQE.js";
import { t as AdvisoryCard } from "./advisory-card-ClomHqnB.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, CloudDownload, MapPin, Search, ShieldCheck, TriangleAlert, UsersRound } from "lucide-react";
// src/routes/index.tsx?tsr-split=component
function Home() {
	const { t } = usePrefs();
	const sampleSegment = segmentById("nh107-02");
	if (!sampleSegment) throw new Error("Missing sample segment \"nh107-02\"");
	return /* @__PURE__ */ jsx("div", {
		className: "home-page",
		children: /* @__PURE__ */ jsxs("section", {
			"aria-labelledby": "hero-title",
			className: "home-hero",
			children: [
				/* @__PURE__ */ jsx("img", {
					src: "/img/hero-mountain.png",
					alt: "",
					fetchPriority: "high",
					className: "home-hero-image"
				}),
				/* @__PURE__ */ jsx("div", {
					"aria-hidden": true,
					className: "home-hero-overlay"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "home-content",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "home-copy",
							children: [
								/* @__PURE__ */ jsx("h1", {
									id: "hero-title",
									children: t("hero.title")
								}),
								/* @__PURE__ */ jsx("p", { children: t("hero.body") }),
								/* @__PURE__ */ jsxs("div", {
									className: "home-actions",
									children: [/* @__PURE__ */ jsxs(Link, {
										to: "/traveller",
										className: "home-action home-action-check",
										children: [
											/* @__PURE__ */ jsx(Search, { "aria-hidden": true }),
											/* @__PURE__ */ jsx("span", { children: "Check a road" }),
											/* @__PURE__ */ jsx(ArrowRight, { "aria-hidden": true })
										]
									}), /* @__PURE__ */ jsxs(Link, {
										to: "/report",
										search: { segment: void 0 },
										className: "home-action home-action-report",
										children: [
											/* @__PURE__ */ jsx(TriangleAlert, { "aria-hidden": true }),
											/* @__PURE__ */ jsx("span", { children: "Report a hazard" }),
											/* @__PURE__ */ jsx(ArrowRight, { "aria-hidden": true })
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ jsx(IllustrativeRoute, {}),
						/* @__PURE__ */ jsx(AdvisoryCard, {
							segment: sampleSegment,
							variant: "home-featured"
						})
					]
				}),
				/* @__PURE__ */ jsxs("ul", {
					"aria-label": "RaahPrahari features",
					className: "home-features",
					children: [
						/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(UsersRound, { "aria-hidden": true }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Community Reporting" }), /* @__PURE__ */ jsx("small", { children: "Real people. Real observations." })] })] }),
						/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(ShieldCheck, { "aria-hidden": true }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Evidence & Freshness" }), /* @__PURE__ */ jsx("small", { children: "See what’s current. Know what’s real." })] })] }),
						/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx(CloudDownload, { "aria-hidden": true }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Offline-Aware Access" }), /* @__PURE__ */ jsx("small", { children: "Stay informed, even off the network." })] })] })
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "home-prototype-label",
					children: "PROTOTYPE · SYNTHETIC DEMO DATA"
				})
			]
		})
	});
}
function IllustrativeRoute() {
	return /* @__PURE__ */ jsxs("div", {
		role: "img",
		"aria-label": "Illustrative route only with three synthetic coordinate pins",
		className: "home-route",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "home-route-label",
				children: "ILLUSTRATIVE ROUTE ONLY"
			}),
			/* @__PURE__ */ jsx("div", {
				"aria-hidden": true,
				className: "home-route-line home-route-line-one"
			}),
			/* @__PURE__ */ jsx("div", {
				"aria-hidden": true,
				className: "home-route-line home-route-line-two"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "home-route-pin home-route-pin-one",
				children: [/* @__PURE__ */ jsx(MapPin, { "aria-hidden": true }), /* @__PURE__ */ jsxs("span", { children: [
					"32.2435° N",
					/* @__PURE__ */ jsx("br", {}),
					"77.1890° E"
				] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "home-route-pin home-route-pin-two",
				children: [/* @__PURE__ */ jsx(MapPin, { "aria-hidden": true }), /* @__PURE__ */ jsxs("span", { children: [
					"32.1876° N",
					/* @__PURE__ */ jsx("br", {}),
					"77.1420° E"
				] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "home-route-pin home-route-pin-three",
				children: [/* @__PURE__ */ jsx(MapPin, { "aria-hidden": true }), /* @__PURE__ */ jsxs("span", { children: [
					"32.1042° N",
					/* @__PURE__ */ jsx("br", {}),
					"77.0931° E"
				] })]
			})
		]
	});
}
export { Home as component };
