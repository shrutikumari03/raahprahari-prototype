import { t as PageBanner } from "./page-banner-C3-9OndR.js";
import { t as Button } from "./button-CFj87KzT.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/routes/contact.tsx?tsr-split=component
function ContactPage() {
	const [errors, setErrors] = useState({});
	const [notice, setNotice] = useState(false);
	function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const name = String(formData.get("name") ?? "").trim();
		const email = String(formData.get("email") ?? "").trim();
		const message = String(formData.get("message") ?? "").trim();
		const nextErrors = {};
		if (!name) nextErrors.name = "Enter your name.";
		if (!email) nextErrors.email = "Enter your email address.";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email address.";
		if (!message) nextErrors.message = "Enter a message.";
		setErrors(nextErrors);
		setNotice(Object.keys(nextErrors).length === 0);
	}
	function clearFieldError(field) {
		setErrors((previous) => {
			if (!previous[field]) return previous;
			const next = { ...previous };
			delete next[field];
			return next;
		});
		setNotice(false);
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "rp-info-page",
		children: [/* @__PURE__ */ jsx(PageBanner, {
			eyebrow: "CONTACT",
			title: "Contact",
			description: "This prototype has no message-delivery service. Submissions are not sent."
		}), /* @__PURE__ */ jsx("div", {
			className: "rp-info-container rp-info-content",
			children: /* @__PURE__ */ jsxs("section", {
				className: "rp-info-card mx-auto max-w-2xl",
				"aria-labelledby": "contact-form-title",
				children: [
					/* @__PURE__ */ jsx("h2", {
						id: "contact-form-title",
						children: "Send a message"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mb-5",
						children: "Complete the fields below. The form checks your input locally and does not send or store your message."
					}),
					/* @__PURE__ */ jsxs("form", {
						className: "rp-contact-form",
						onSubmit: handleSubmit,
						noValidate: true,
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "rp-contact-field",
								children: [
									/* @__PURE__ */ jsx("label", {
										htmlFor: "contact-name",
										children: "Name"
									}),
									/* @__PURE__ */ jsx("p", {
										id: "contact-name-help",
										className: "rp-contact-help",
										children: "Enter the name you would like to use."
									}),
									/* @__PURE__ */ jsx("input", {
										id: "contact-name",
										name: "name",
										type: "text",
										autoComplete: "name",
										maxLength: 100,
										required: true,
										"aria-invalid": Boolean(errors.name),
										"aria-describedby": `contact-name-help${errors.name ? " contact-name-error" : ""}`,
										className: "rp-contact-control",
										onChange: () => clearFieldError("name")
									}),
									errors.name && /* @__PURE__ */ jsx("p", {
										id: "contact-name-error",
										className: "rp-contact-error",
										role: "alert",
										children: errors.name
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rp-contact-field",
								children: [
									/* @__PURE__ */ jsx("label", {
										htmlFor: "contact-email",
										children: "Email"
									}),
									/* @__PURE__ */ jsx("p", {
										id: "contact-email-help",
										className: "rp-contact-help",
										children: "Enter a valid email address."
									}),
									/* @__PURE__ */ jsx("input", {
										id: "contact-email",
										name: "email",
										type: "email",
										autoComplete: "email",
										maxLength: 254,
										required: true,
										"aria-invalid": Boolean(errors.email),
										"aria-describedby": `contact-email-help${errors.email ? " contact-email-error" : ""}`,
										className: "rp-contact-control",
										onChange: () => clearFieldError("email")
									}),
									errors.email && /* @__PURE__ */ jsx("p", {
										id: "contact-email-error",
										className: "rp-contact-error",
										role: "alert",
										children: errors.email
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rp-contact-field",
								children: [
									/* @__PURE__ */ jsx("label", {
										htmlFor: "contact-message",
										children: "Message"
									}),
									/* @__PURE__ */ jsx("p", {
										id: "contact-message-help",
										className: "rp-contact-help",
										children: "Do not include sensitive or emergency information."
									}),
									/* @__PURE__ */ jsx("textarea", {
										id: "contact-message",
										name: "message",
										maxLength: 2e3,
										required: true,
										"aria-invalid": Boolean(errors.message),
										"aria-describedby": `contact-message-help${errors.message ? " contact-message-error" : ""}`,
										className: "rp-contact-control rp-contact-message",
										onChange: () => clearFieldError("message")
									}),
									errors.message && /* @__PURE__ */ jsx("p", {
										id: "contact-message-error",
										className: "rp-contact-error",
										role: "alert",
										children: errors.message
									})
								]
							}),
							notice && /* @__PURE__ */ jsx("p", {
								className: "rp-contact-notice",
								role: "status",
								"aria-live": "polite",
								children: "Not connected in this prototype. Your message was not sent."
							}),
							/* @__PURE__ */ jsx(Button, {
								type: "submit",
								className: "min-h-11 w-fit rounded-xl",
								children: "Submit message"
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "rp-contact-emergency",
						children: "In an emergency, contact local emergency services."
					})
				]
			})
		})]
	});
}
export { ContactPage as component };
