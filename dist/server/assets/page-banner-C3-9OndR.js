import { jsx, jsxs } from "react/jsx-runtime";
// src/components/page-banner.tsx
function PageBanner({ eyebrow, title, description }) {
	return /* @__PURE__ */ jsx("header", {
		className: "rp-info-banner",
		children: /* @__PURE__ */ jsxs("div", {
			className: "rp-info-container rp-info-banner-content",
			children: [
				/* @__PURE__ */ jsxs("p", {
					className: "rp-info-eyebrow",
					children: [/* @__PURE__ */ jsx("span", { "aria-hidden": true }), eyebrow]
				}),
				/* @__PURE__ */ jsx("h1", { children: title }),
				description && /* @__PURE__ */ jsx("p", {
					className: "rp-info-banner-description",
					children: description
				})
			]
		})
	});
}
export { PageBanner as t };
