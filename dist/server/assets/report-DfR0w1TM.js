import { a as cn, r as useLocalState } from "./storage-wbzgXpjQ.js";
import { t as Button } from "./button-DxFltwjo.js";
import { n as useFieldProps, t as Input } from "./input-Cf23LXr0.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { CircleHelp, Construction, Mountain, Snowflake, TreePine, Waves } from "lucide-react";
// src/components/ui/card.tsx
function Card({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card",
		className: cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
		...props
	});
}
// src/components/ui/textarea.tsx
function Textarea({ className, ...props }) {
	const fieldProps = useFieldProps(props);
	return /* @__PURE__ */ jsx("textarea", {
		"data-slot": "textarea",
		className: cn("flex field-sizing-content min-h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40", className),
		...fieldProps
	});
}
// src/routes/report.tsx?tsr-split=component
var draftKey = "rp.reportObservationDraft";
var maxPhotoBytes = 10485760;
var hazardTypes = [
	{
		value: "debris",
		label: "Debris/Landslide",
		icon: Mountain
	},
	{
		value: "road-damage",
		label: "Road damage",
		icon: Construction
	},
	{
		value: "snow-ice",
		label: "Snow/Ice",
		icon: Snowflake
	},
	{
		value: "fallen-tree",
		label: "Fallen tree",
		icon: TreePine
	},
	{
		value: "flooding",
		label: "Flooding",
		icon: Waves
	},
	{
		value: "other",
		label: "Other",
		icon: CircleHelp
	}
];
var emptyDraft = {
	hazardType: "",
	description: "",
	observedAt: "",
	location: ""
};
var steps = [
	"Observation",
	"Location",
	"Review & send"
];
function ReportPage() {
	const [draft, setDraft] = useLocalState(draftKey, emptyDraft);
	const [step, setStep] = useState(1);
	const [photo, setPhoto] = useState(null);
	const [photoError, setPhotoError] = useState("");
	const [formError, setFormError] = useState("");
	const [notice, setNotice] = useState("");
	const updateDraft = (patch) => {
		setDraft((current) => ({
			...current,
			...patch
		}));
		setNotice("");
	};
	const saveDraft = () => {
		try {
			window.localStorage.setItem(draftKey, JSON.stringify(draft));
			setNotice(photo ? "Draft saved locally on this device. The photo is not retained, and the draft has not been sent or received by a server." : "Draft saved locally on this device. It has not been sent or received by a server.");
		} catch {
			setNotice("Could not save this draft on the device. Check available browser storage.");
		}
	};
	const continueFromObservation = (event) => {
		event.preventDefault();
		if (!draft.hazardType || !draft.observedAt) {
			setFormError("Choose a hazard type and enter when you observed it.");
			return;
		}
		setFormError("");
		setStep(2);
		setNotice("");
	};
	const choosePhoto = (file) => {
		setPhotoError("");
		if (!file) {
			setPhoto(null);
			return;
		}
		if (!["image/jpeg", "image/png"].includes(file.type)) {
			setPhoto(null);
			setPhotoError("Choose a JPG or PNG image.");
			return;
		}
		if (file.size > maxPhotoBytes) {
			setPhoto(null);
			setPhotoError("The photo must be 10 MB or smaller.");
			return;
		}
		setPhoto(file);
	};
	const selectedHazard = hazardTypes.find((hazard) => hazard.value === draft.hazardType);
	return /* @__PURE__ */ jsxs("main", {
		className: "grid min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
		children: [/* @__PURE__ */ jsxs("section", {
			"aria-label": "Mountain landscape",
			className: "relative isolate flex min-h-64 items-end overflow-hidden bg-muted sm:min-h-72 lg:min-h-[calc(100svh-4rem)]",
			children: [
				/* @__PURE__ */ jsx("img", {
					src: "/img/hero-road-generated.svg",
					alt: "Illustrative mountain road winding through a Himalayan valley.",
					className: "absolute inset-0 -z-20 size-full object-cover"
				}),
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-background/75" }),
				/* @__PURE__ */ jsxs("div", {
					className: "mx-auto w-full max-w-content px-5 py-7 text-foreground sm:px-8 sm:py-10 lg:px-12 lg:py-14",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium tracking-wide text-foreground/80",
							children: "Uttarakhand road safety"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-2 max-w-lg font-display text-3xl font-semibold leading-tight sm:text-4xl",
							children: "Your local knowledge helps travellers prepare."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-sm text-foreground/80",
							children: "Share a road condition only if you can do so without disrupting traffic."
						})
					]
				})
			]
		}), /* @__PURE__ */ jsx("section", {
			className: "flex min-w-0 items-center justify-center bg-background px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12",
			children: /* @__PURE__ */ jsxs(Card, {
				className: "w-full max-w-2xl gap-0 rounded-2xl border-border bg-card p-5 shadow-sm sm:p-8",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mb-6 flex flex-wrap items-start justify-between gap-3",
						children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold tracking-wide text-primary",
							children: "Prototype mockup, synthetic data"
						}), /* @__PURE__ */ jsx("h1", {
							className: "mt-2 font-display text-2xl font-bold sm:text-3xl",
							children: "Report a road hazard"
						})] })
					}),
					/* @__PURE__ */ jsx("ol", {
						"aria-label": "Report steps",
						className: "mb-7 grid grid-cols-3 gap-2",
						children: steps.map((label, index) => {
							const number = index + 1;
							const current = step === number;
							return /* @__PURE__ */ jsxs("li", {
								"aria-current": current ? "step" : void 0,
								className: "flex min-w-0 items-start gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: `flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${current ? "border-primary bg-primary text-primary-foreground" : step > number ? "border-primary text-primary" : "border-border text-muted-foreground"}`,
									children: number
								}), /* @__PURE__ */ jsx("span", {
									className: `pt-1 text-xs leading-tight sm:text-sm ${current ? "font-semibold text-foreground" : "text-muted-foreground"}`,
									children: label
								})]
							}, label);
						})
					}),
					step === 1 && /* @__PURE__ */ jsxs("form", {
						onSubmit: continueFromObservation,
						noValidate: true,
						children: [
							/* @__PURE__ */ jsxs("fieldset", { children: [/* @__PURE__ */ jsx("legend", {
								className: "mb-3 text-sm font-semibold",
								children: "What did you observe?"
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
								children: hazardTypes.map(({ value, label, icon: Icon }) => /* @__PURE__ */ jsxs("label", {
									className: `flex min-h-14 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring ${draft.hazardType === value ? "border-primary bg-primary/10 font-medium" : "border-border hover:bg-accent"}`,
									children: [
										/* @__PURE__ */ jsx("input", {
											className: "sr-only",
											type: "radio",
											name: "hazardType",
											value,
											required: true,
											checked: draft.hazardType === value,
											onChange: () => updateDraft({ hazardType: value })
										}),
										/* @__PURE__ */ jsx(Icon, {
											"aria-hidden": true,
											className: "size-4 shrink-0 text-primary"
										}),
										/* @__PURE__ */ jsx("span", { children: label })
									]
								}, value))
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "mb-2 flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "description",
										className: "text-sm font-semibold",
										children: "Describe the condition"
									}), /* @__PURE__ */ jsxs("span", {
										"aria-live": "polite",
										className: "shrink-0 text-xs text-muted-foreground",
										children: [draft.description.length, "/500"]
									})]
								}), /* @__PURE__ */ jsx(Textarea, {
									id: "description",
									value: draft.description,
									maxLength: 500,
									rows: 3,
									placeholder: "What should other road users know?",
									onChange: (event) => updateDraft({ description: event.target.value })
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-5",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "observedAt",
									className: "mb-2 block text-sm font-semibold",
									children: "When did you observe it?"
								}), /* @__PURE__ */ jsx(Input, {
									id: "observedAt",
									type: "datetime-local",
									required: true,
									value: draft.observedAt,
									onChange: (event) => updateDraft({ observedAt: event.target.value })
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-5",
								children: [
									/* @__PURE__ */ jsxs("label", {
										htmlFor: "photo",
										className: "mb-2 block text-sm font-semibold",
										children: [
											"Add a photo",
											" ",
											/* @__PURE__ */ jsx("span", {
												className: "font-normal text-muted-foreground",
												children: "(optional)"
											})
										]
									}),
									/* @__PURE__ */ jsx(Input, {
										id: "photo",
										type: "file",
										accept: "image/jpeg,image/png,.jpg,.jpeg,.png",
										"aria-describedby": "photo-help",
										"aria-invalid": Boolean(photoError),
										onChange: (event) => choosePhoto(event.target.files?.[0])
									}),
									/* @__PURE__ */ jsxs("p", {
										id: "photo-help",
										className: "mt-1.5 text-xs text-muted-foreground",
										children: ["JPG or PNG, up to 10 MB", photo ? ` · ${photo.name}` : ""]
									}),
									photoError && /* @__PURE__ */ jsx("p", {
										role: "alert",
										className: "mt-1.5 text-sm text-destructive",
										children: photoError
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-5 rounded-xl border border-border bg-muted/50 p-3.5 text-sm",
								children: /* @__PURE__ */ jsx("p", {
									className: "font-medium",
									children: "Capture evidence only from a location away from traffic. Do not stop in a dangerous area."
								})
							}),
							formError && /* @__PURE__ */ jsx("p", {
								role: "alert",
								className: "mt-4 text-sm text-destructive",
								children: formError
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between",
								children: [/* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "outline",
									className: "min-h-11 rounded-xl",
									onClick: saveDraft,
									children: "Save draft"
								}), /* @__PURE__ */ jsx(Button, {
									type: "submit",
									className: "min-h-11 rounded-xl px-6 font-semibold",
									children: "Continue"
								})]
							})
						]
					}),
					step === 2 && /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("h2", {
							className: "font-display text-xl font-semibold",
							children: "Location"
						}),
						/* @__PURE__ */ jsx("label", {
							htmlFor: "location",
							className: "mb-2 mt-5 block text-sm font-semibold",
							children: "Road or nearby landmark (optional)"
						}),
						/* @__PURE__ */ jsx(Input, {
							id: "location",
							value: draft.location,
							onChange: (event) => updateDraft({ location: event.target.value }),
							placeholder: "For example, a nearby town or milestone"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between",
							children: [/* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "outline",
								className: "min-h-11 rounded-xl",
								onClick: saveDraft,
								children: "Save draft"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col-reverse gap-3 sm:flex-row",
								children: [/* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "ghost",
									className: "min-h-11 rounded-xl",
									onClick: () => setStep(1),
									children: "Back"
								}), /* @__PURE__ */ jsx(Button, {
									type: "button",
									className: "min-h-11 rounded-xl px-6 font-semibold",
									onClick: () => setStep(3),
									children: "Continue"
								})]
							})]
						})
					] }),
					step === 3 && /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("h2", {
							className: "font-display text-xl font-semibold",
							children: "Review & send"
						}),
						/* @__PURE__ */ jsxs("dl", {
							className: "mt-5 space-y-4 rounded-xl border border-border p-4 text-sm",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
									className: "font-semibold",
									children: "Hazard type"
								}), /* @__PURE__ */ jsx("dd", {
									className: "mt-1 text-muted-foreground",
									children: selectedHazard?.label ?? "Not selected"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
									className: "font-semibold",
									children: "Condition"
								}), /* @__PURE__ */ jsx("dd", {
									className: "mt-1 whitespace-pre-wrap text-muted-foreground",
									children: draft.description || "No description provided"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
									className: "font-semibold",
									children: "Observed"
								}), /* @__PURE__ */ jsx("dd", {
									className: "mt-1 text-muted-foreground",
									children: draft.observedAt || "Not specified"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
									className: "font-semibold",
									children: "Location"
								}), /* @__PURE__ */ jsx("dd", {
									className: "mt-1 text-muted-foreground",
									children: draft.location || "Not specified"
								})] }),
								photo && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
									className: "font-semibold",
									children: "Photo"
								}), /* @__PURE__ */ jsx("dd", {
									className: "mt-1 text-muted-foreground",
									children: photo.name
								})] })
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 rounded-xl border border-border bg-muted/50 p-3.5 text-sm",
							children: "Sending is not connected in this prototype. Saving keeps a draft on this device only; no report is sent to or received by a server."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between",
							children: [/* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "outline",
								className: "min-h-11 rounded-xl",
								onClick: saveDraft,
								children: "Save draft"
							}), /* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								className: "min-h-11 rounded-xl",
								onClick: () => setStep(2),
								children: "Back"
							})]
						})
					] }),
					notice && /* @__PURE__ */ jsx("p", {
						role: "status",
						className: "mt-4 text-sm text-muted-foreground",
						children: notice
					})
				]
			})
		})]
	});
}
export { ReportPage as component };
