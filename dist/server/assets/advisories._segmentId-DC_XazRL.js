import { t as Button } from "./button-CFj87KzT.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CircleHelp } from "lucide-react";
// src/routes/advisories.$segmentId.tsx?tsr-split=notFoundComponent
function DetailNotFound() {
	return /* @__PURE__ */ jsx("main", {
		className: "rp-container grid min-h-[55vh] place-items-center py-12",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md space-y-4 text-center",
			children: [
				/* @__PURE__ */ jsx(CircleHelp, {
					"aria-hidden": true,
					className: "mx-auto size-8 text-status-unknown"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "font-display text-2xl font-bold",
					children: "Road information not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "This segment or community report is not available."
				}),
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					children: /* @__PURE__ */ jsx(Link, {
						to: "/advisories",
						children: "Back to search"
					})
				})
			]
		})
	});
}
export { DetailNotFound as notFoundComponent };
