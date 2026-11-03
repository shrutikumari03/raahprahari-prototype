import { t as cn } from "./utils-DWGjSd5x.js";
import "./button-CFj87KzT.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { LoaderCircle } from "lucide-react";
// src/components/ui/feedback.tsx
function LoadingState({ label = "Loading", className }) {
	return /* @__PURE__ */ jsxs("div", {
		role: "status",
		"aria-live": "polite",
		"aria-busy": "true",
		className: cn("flex min-h-24 items-center justify-center gap-2 text-sm text-muted-foreground", className),
		children: [/* @__PURE__ */ jsx(LoaderCircle, {
			"aria-hidden": "true",
			className: "size-4 motion-safe:animate-spin"
		}), /* @__PURE__ */ jsx("span", { children: label })]
	});
}
function EmptyState({ title, message, action, className }) {
	return /* @__PURE__ */ jsxs("section", {
		className: cn("grid min-h-24 justify-items-center gap-3 rounded-xl border border-dashed border-border p-6 text-center", className),
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-base font-semibold",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "max-w-prose text-sm text-muted-foreground",
				children: message
			}),
			action
		]
	});
}
function SkipLink({ className, href = "#main", ...props }) {
	return /* @__PURE__ */ jsx("a", {
		href,
		className: cn("sr-only z-[var(--z-dialog)] rounded-md bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3", className),
		...props
	});
}
export { LoadingState as n, SkipLink as r, EmptyState as t };
