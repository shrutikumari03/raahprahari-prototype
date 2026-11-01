import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { HeadContent, Link, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent, useRouter, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { CircleCheckIcon, InfoIcon, Loader2Icon, Menu, Moon, OctagonXIcon, Sun, TriangleAlert, TriangleAlertIcon, UserRound, WifiOff, XIcon } from "lucide-react";
import { Toaster } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
// \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
// src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
// src/components/ui/button.tsx
var buttonVariants = cva("inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
			outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2 has-[>svg]:px-3",
			xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
			lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
			icon: "size-9",
			"icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-8",
			"icon-lg": "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		"data-slot": "button",
		"data-variant": variant,
		"data-size": size,
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
// src/components/error-pages.tsx
function NotFoundPage() {
	return /* @__PURE__ */ jsx("main", {
		className: "grid min-h-svh place-items-center px-6 py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md space-y-6 text-center",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-sm font-medium text-muted-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-muted-foreground",
					children: "This page doesn’t exist. Check the address or return to the home page."
				}),
				/* @__PURE__ */ jsx(Button, {
					asChild: true,
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						children: "Go home"
					})
				})
			]
		})
	});
}
function RouteErrorPage({ reset }) {
	const router = useRouter();
	return /* @__PURE__ */ jsx("main", {
		className: "grid min-h-svh place-items-center px-6 py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md space-y-6 text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "This page couldn’t load"
				}),
				/* @__PURE__ */ jsx("p", {
					role: "alert",
					className: "text-muted-foreground",
					children: "Please try again, or return to the home page."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ jsx(Button, {
						onClick: () => {
							router.invalidate();
							reset();
						},
						children: "Try again"
					}), /* @__PURE__ */ jsx(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ jsx("a", {
							href: "/",
							children: "Go home"
						})
					})]
				})
			]
		})
	});
}
// src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		theme: "light",
		className: "toaster group",
		icons: {
			success: /* @__PURE__ */ jsx(CircleCheckIcon, { className: "size-4" }),
			info: /* @__PURE__ */ jsx(InfoIcon, { className: "size-4" }),
			warning: /* @__PURE__ */ jsx(TriangleAlertIcon, { className: "size-4" }),
			error: /* @__PURE__ */ jsx(OctagonXIcon, { className: "size-4" }),
			loading: /* @__PURE__ */ jsx(Loader2Icon, { className: "size-4 animate-spin" })
		},
		style: {
			"--normal-bg": "var(--popover)",
			"--normal-text": "var(--popover-foreground)",
			"--normal-border": "var(--border)",
			"--border-radius": "var(--radius)"
		},
		...props
	});
};
// src/components/ui/tooltip.tsx
function TooltipProvider({ delayDuration = 0, ...props }) {
	return /* @__PURE__ */ jsx(TooltipPrimitive.Provider, {
		"data-slot": "tooltip-provider",
		delayDuration,
		...props
	});
}
// src/components/ui/dialog.tsx
function Dialog({ ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Root, {
		"data-slot": "dialog",
		...props
	});
}
function DialogPortal({ ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Portal, {
		"data-slot": "dialog-portal",
		...props
	});
}
function DialogClose({ ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Close, {
		"data-slot": "dialog-close",
		...props
	});
}
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
		"data-slot": "dialog-overlay",
		className: cn("fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, showCloseButton = true, ...props }) {
	return /* @__PURE__ */ jsxs(DialogPortal, {
		"data-slot": "dialog-portal",
		children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
			"data-slot": "dialog-content",
			className: cn("fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg", className),
			...props,
			children: [children, showCloseButton && /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
				"data-slot": "dialog-close",
				className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				children: [/* @__PURE__ */ jsx(XIcon, {}), /* @__PURE__ */ jsx("span", {
					className: "sr-only",
					children: "Close"
				})]
			})]
		})]
	});
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "dialog-header",
		className: cn("flex flex-col gap-2 text-center sm:text-left", className),
		...props
	});
}
function DialogFooter({ className, showCloseButton = false, children, ...props }) {
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "dialog-footer",
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props,
		children: [children, showCloseButton && /* @__PURE__ */ jsx(DialogPrimitive.Close, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				children: "Close"
			})
		})]
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Title, {
		"data-slot": "dialog-title",
		className: cn("text-lg leading-none font-semibold", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Description, {
		"data-slot": "dialog-description",
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
// src/components/ui/sheet.tsx
function Sheet({ ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Root, {
		"data-slot": "sheet",
		...props
	});
}
function SheetTrigger({ ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Trigger, {
		"data-slot": "sheet-trigger",
		...props
	});
}
function SheetPortal({ ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Portal, {
		"data-slot": "sheet-portal",
		...props
	});
}
function SheetOverlay({ className, ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
		"data-slot": "sheet-overlay",
		className: cn("fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0", className),
		...props
	});
}
function SheetContent({ className, children, side = "right", showCloseButton = true, ...props }) {
	return /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
		"data-slot": "sheet-content",
		className: cn("fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500", side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm", side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm", side === "top" && "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top", side === "bottom" && "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom", className),
		...props,
		children: [children, showCloseButton && /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
			className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary",
			children: [/* @__PURE__ */ jsx(XIcon, { className: "size-4" }), /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sheet-header",
		className: cn("flex flex-col gap-1.5 p-4", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Title, {
		"data-slot": "sheet-title",
		className: cn("font-semibold text-foreground", className),
		...props
	});
}
function SheetDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx(DialogPrimitive.Description, {
		"data-slot": "sheet-description",
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
// src/i18n/dictionary.ts
var en = {
	"nav.home": "Home",
	"nav.map": "Live Map",
	"nav.advisories": "Advisories",
	"nav.about": "About",
	"nav.login": "Community Login",
	"nav.report": "Report Hazard",
	"nav.menu": "Open menu",
	"nav.primary": "Primary",
	"theme.toggle": "Switch theme",
	"theme.light": "Light theme",
	"theme.dark": "Dark theme",
	"lang.label": "Language",
	"demo.badge": "Prototype mockup — synthetic data",
	"demo.mode": "Local demo mode",
	"offline.banner": "You are offline. Showing information saved on this device.",
	"login.title": "Community login",
	"login.body": "Accounts for travellers, volunteers, moderators and officials are part of the next milestone. In this prototype you can check roads and file reports without signing in — reports stay on this device.",
	"login.close": "Got it",
	"hero.eyebrow": "Uttarakhand road-hazard advisories",
	"hero.title": "Know before you go.",
	"hero.body": "Check reported road hazards, information freshness, and official restrictions before your next journey.",
	"hero.report": "Report a hazard",
	"hero.sample": "Sample advisory",
	"search.title": "Where are you heading?",
	"search.from": "From",
	"search.to": "To",
	"search.fromPh": "Starting place",
	"search.toPh": "Destination",
	"search.swap": "Swap starting place and destination",
	"search.useLocation": "Use my location",
	"search.locating": "Locating…",
	"search.locDenied": "Location permission was denied. Type or pick a place instead.",
	"search.locOutside": "Your location is outside the Uttarakhand coverage area. Choose a place from the list.",
	"search.locUnavailable": "Location is unavailable on this device. Type or pick a place instead.",
	"search.locNearest": "Nearest covered place",
	"search.submit": "Check a road",
	"search.coverage": "Coverage: all 13 districts of Uttarakhand. Choose places from the list.",
	"search.quick": "Quick picks",
	"search.recent": "Recent searches",
	"search.clearRecent": "Clear all",
	"search.noMatch": "No matching place in the Uttarakhand coverage area.",
	"search.same": "Choose two different places.",
	"search.pickFrom": "Set as From",
	"search.pickTo": "Set as To",
	"s1.title": "Check your road",
	"s1.body": "Enter where you are starting and where you are going. RaahPrahari shows the available corridors, how current the information is on each section, and any official restriction in force.",
	"s1.a": "Advisory level per road section",
	"s1.b": "Age of the latest observation",
	"s1.c": "Official restrictions, with source",
	"s1.d": "Distance with no current information",
	"s2.title": "From report to guidance",
	"s2.step1": "Report",
	"s2.step1Body": "Travellers describe what they saw, from a safe place, with photos and a confirmed location.",
	"s2.step2": "Review",
	"s2.step2Body": "Trained moderators check evidence, duplicates and conflicts. Every decision needs a recorded reason.",
	"s2.step3": "Stay informed",
	"s2.step3Body": "Reviewed reports shape advisories. Official restrictions always take precedence.",
	"s3.title": "Local knowledge. Clearer decisions.",
	"s3.body": "Conditions on mountain roads change quickly. People on the road often see a problem first. RaahPrahari puts those observations next to official information, and labels each one by source and age.",
	"s3.a": "Community reports are never shown as official closures.",
	"s3.b": "Missing information is shown as Unknown — never as Clear.",
	"s3.c": "Old information is marked Stale with its age.",
	"final.title": "Travel information, not a guarantee",
	"final.body": "RaahPrahari helps you prepare. It cannot see every stretch of road, and conditions can change after a report. Always follow official instructions, local police and road authorities.",
	"footer.about": "About",
	"footer.privacy": "Privacy",
	"footer.terms": "Terms",
	"footer.accessibility": "Accessibility",
	"footer.contact": "Contact",
	"footer.note": "Prototype for demonstration. All reports, restrictions and routes shown are synthetic.",
	"level.clear": "Clear",
	"level.caution": "Caution",
	"level.avoid": "Avoid",
	"level.do_not_travel": "Do not travel",
	"level.unknown": "Unknown",
	"level.stale": "Stale",
	"level.official": "Official",
	"action.clear": "Recent reviewed observations report the road open. Drive with normal mountain-road care.",
	"action.caution": "Drive slowly and be ready to stop or turn back.",
	"action.avoid": "Avoid non-essential travel on this section.",
	"action.do_not_travel": "Do not travel. Follow official instructions.",
	"action.unknown": "Check locally before travelling.",
	"basis.official": "Official restriction in force",
	"basis.corroborated": "Several reports, at least one reviewed",
	"basis.single_report": "Community report awaiting or after review",
	"basis.conflicting": "Conflicting reports — under review",
	"basis.verified_clear": "Reviewed recent observation",
	"basis.stale_only": "Only old observations",
	"basis.no_evidence": "No recent observation.",
	"copy.noOfficial": "No current official information.",
	"copy.noRecent": "No recent observation.",
	"copy.awaitingClearance": "Awaiting clearance verification.",
	"copy.savedLocal": "Saved on this device, not yet received.",
	"copy.communityUnverified": "This is a community-reported hazard and has not been independently verified.",
	"copy.noReportNotSafe": "No current report does not mean a road is safe.",
	"copy.estimate": "Prototype estimate. Official restrictions override.",
	"copy.notOfficial": "Not an official closure",
	"copy.poorCoverage": "Not enough current information to recommend a safer route. Conditions can change quickly in mountainous regions. Review the latest reports and advisories.",
	"copy.pastReview": "Review time has passed. This restriction remains in force until an authorised update.",
	"results.title": "Route options",
	"results.seeded": "Seeded corridor data — not a live routing service",
	"results.sort": "Sort by",
	"sort.fastest": "Fastest",
	"sort.shortest": "Shortest distance",
	"sort.current": "Most current information",
	"results.via": "Via",
	"results.distance": "Distance",
	"results.duration": "Typical duration",
	"results.coverage": "Information coverage",
	"results.latest": "Latest observation",
	"results.hazards": "Community hazards",
	"results.restrictions": "Official restrictions",
	"results.unknownKm": "No current information",
	"results.compare": "Compare on map",
	"results.details": "View road details",
	"results.hideDetails": "Hide road details",
	"results.save": "Save this road",
	"results.saved": "Saved on this device",
	"results.reportHere": "Report a hazard",
	"results.none": "No seeded corridor connects these places",
	"results.noneBody": "Live routing is not configured in this prototype, so only the 14 seeded corridors can be searched. Try nearby places on the same corridor.",
	"results.typical": "Typical conditions, not a live travel time",
	"results.sections": "Road sections",
	"view.map": "Map",
	"view.list": "List",
	"map.schematic": "Schematic map — positions are approximate, no basemap configured",
	"map.legend": "Legend",
	"map.hazard": "Community report",
	"map.restriction": "Official restriction",
	"map.selected": "Selected route",
	"map.layers": "Terrain, Satellite and Roads layers become available once a basemap is configured.",
	"adv.title": "Road advisories",
	"adv.body": "Every seeded corridor across Uttarakhand, section by section. Select a section to see what was observed, what to do and who said so.",
	"adv.filter": "Show",
	"adv.filterAll": "All sections",
	"adv.filterIssues": "Sections with an advisory",
	"adv.filterOfficial": "Official restrictions",
	"adv.filterUnknown": "Unknown or stale",
	"adv.empty": "No sections match this filter.",
	"adv.searchRoute": "Plan a journey instead",
	"segment.title": "Section details",
	"segment.observed": "Observed condition",
	"segment.action": "Recommended action",
	"segment.official": "Official restriction",
	"segment.source": "Evidence source and freshness",
	"segment.uncertainty": "Uncertainty and review status",
	"segment.reports": "Latest reports",
	"segment.select": "Select a road section to see its advisory.",
	"segment.issuedBy": "Issued by",
	"segment.published": "Published",
	"segment.effective": "Effective from",
	"segment.reviewBy": "Review by",
	"segment.status": "Status",
	"segment.inForce": "In force",
	"segment.ref": "Reference",
	"segment.reviewed": "reviewed",
	"segment.reportsCount": "reports considered",
	"segment.photos": "photos",
	"segment.observedAgo": "Observed",
	"segment.conflict": "Conflicts with",
	"segment.duplicate": "Possible duplicate of",
	"segment.locConf": "Location confidence",
	"segment.close": "Close details",
	"status.under_review": "Under review",
	"status.verified": "Reviewed — verified",
	"status.needs_info": "Needs more information",
	"status.duplicate": "Duplicate",
	"status.rejected": "Rejected",
	"status.conflicting": "Unresolved / conflicting",
	"source.traveller": "Traveller",
	"source.volunteer": "Volunteer",
	"conf.high": "High",
	"conf.medium": "Medium",
	"conf.low": "Low",
	"kind.clear": "Road passable",
	"hazard.landslide": "Landslide",
	"hazard.rockfall": "Rockfall",
	"hazard.flooding": "Flooding",
	"hazard.road_block": "Road block",
	"hazard.fallen_tree": "Fallen tree",
	"hazard.damaged_bridge": "Damaged bridge",
	"hazard.road_damage": "Road damage",
	"hazard.snow_ice": "Snow / ice",
	"hazard.poor_visibility": "Poor visibility",
	"hazard.accident": "Accident",
	"hazard.other": "Other",
	"restriction.road_closed": "Road closed",
	"restriction.partially_restricted": "Partially restricted",
	"restriction.vehicle_restricted": "Vehicle restricted",
	"restriction.time_bound": "Time bound",
	"report.title": "Report a hazard",
	"report.intro": "Four short steps. You can save a draft on this device at any point.",
	"report.step": "Step",
	"report.of": "of",
	"report.step1": "Observation",
	"report.step2": "Evidence",
	"report.step3": "Location",
	"report.step4": "Review & submit",
	"report.safety": "Capture evidence only from a safe location. Do not stop in a dangerous area to take photos or record video.",
	"report.type": "What did you see?",
	"report.typeErr": "Choose a hazard type.",
	"report.desc": "Describe it",
	"report.descPh": "What is blocking or affecting the road? Which lanes? Is it changing?",
	"report.descErr": "Add a short description (at least 10 characters).",
	"report.when": "When did you observe it?",
	"report.whenErr": "Choose a time in the last 72 hours, not in the future.",
	"report.severity": "How severe is it?",
	"report.sevErr": "Choose a severity.",
	"sev.low": "Low",
	"sev.lowHint": "Passable with care",
	"sev.moderate": "Moderate",
	"sev.moderateHint": "Slow or partly blocked",
	"sev.high": "High",
	"sev.highHint": "Blocked or dangerous",
	"report.continue": "Continue",
	"report.back": "Back",
	"report.saveDraft": "Save draft",
	"report.draftSaved": "Draft saved on this device.",
	"report.draftRestored": "Restored your saved draft.",
	"report.discard": "Discard draft",
	"report.photosTitle": "Add photos (optional)",
	"report.photosHint": "Up to 4 images · JPG, PNG or WebP · 10 MB each",
	"report.addPhotos": "Choose photos",
	"report.photosEmpty": "No photos attached. Reports without photos are still reviewed.",
	"report.photoLocal": "Selected on this device — not uploaded",
	"report.photoRemove": "Remove",
	"report.photoTypeErr": "is not a JPG, PNG or WebP image.",
	"report.photoSizeErr": "is larger than 10 MB.",
	"report.photoMaxErr": "You can attach up to 4 photos.",
	"report.photoConsent": "In a connected deployment you will be asked to consent before photos are uploaded. Photos are private evidence and are never published at a public address.",
	"report.photoDraftNote": "Photos are not kept in saved drafts; re-attach them when you continue.",
	"report.locTitle": "Where was it?",
	"report.locSearch": "Nearest town or landmark",
	"report.locPin": "Or tap the road on the map",
	"report.locGps": "Use my current location",
	"report.locAccuracy": "Approximate accuracy",
	"report.locLandmark": "Landmark (optional)",
	"report.locLandmarkPh": "e.g. 2 km after the bridge",
	"report.locSegment": "Suggested road section",
	"report.locAmbiguous": "More than one section is nearby. Choose the one you were on:",
	"report.locConfirm": "Confirm location",
	"report.locConfirmed": "Location confirmed",
	"report.locChange": "Change",
	"report.locErr": "Choose and confirm a location.",
	"report.locConsent": "Your precise location is used only to place this report and is never shown publicly.",
	"report.reviewTitle": "Check your report",
	"report.edit": "Edit",
	"report.reviewNote": "Your report will be subject to review and is not an official road closure.",
	"report.submit": "Submit report",
	"report.simulated": "Simulated submission — local demo mode, no server is connected",
	"report.ref": "Demo reference",
	"report.refNote": "Generated on this device. It is not a server-issued reference.",
	"report.another": "Report another hazard",
	"report.viewRoad": "View road advisory",
	"report.retry": "Retry",
	"report.simulateFail": "Simulate a failed upload",
	"report.noPhotos": "No photos",
	"delivery.saved": "Saved on this device",
	"delivery.queued": "Queued",
	"delivery.uploading": "Uploading",
	"delivery.received": "Received by server",
	"delivery.review": "Under review",
	"delivery.reviewed": "Reviewed",
	"delivery.failed": "Upload failed",
	"delivery.offlineQueued": "You are offline. The report is queued on this device and will not be sent until you are back online.",
	"delivery.demoStop": "In local demo mode there is no server, so the report stops here — saved on this device, not received by anyone. Review happens once a backend is connected.",
	"progress.title": "Report progress",
	"progress.submitted": "Submitted",
	"progress.received": "Received by server",
	"progress.review": "Under review",
	"progress.decision": "Decision recorded",
	"progress.clearance": "Clearance verification",
	"progress.note": "Review does not itself reopen a road or remove an official restriction.",
	"time.justNow": "just now",
	"time.minAgo": "min ago",
	"time.hAgo": "h ago",
	"time.dAgo": "d ago",
	"time.inH": "in",
	"common.km": "km",
	"common.hr": "h",
	"common.min": "min",
	"about.title": "About RaahPrahari"
};
var hi = {
	"nav.home": "होम",
	"nav.map": "लाइव मानचित्र",
	"nav.advisories": "परामर्श",
	"nav.about": "परिचय",
	"nav.login": "समुदाय लॉगिन",
	"nav.report": "ख़तरा बताएँ",
	"nav.menu": "मेनू खोलें",
	"nav.primary": "मुख्य",
	"theme.toggle": "थीम बदलें",
	"theme.light": "हल्की थीम",
	"theme.dark": "गहरी थीम",
	"lang.label": "भाषा",
	"demo.badge": "प्रोटोटाइप मॉकअप — कृत्रिम डेटा",
	"demo.mode": "स्थानीय डेमो मोड",
	"offline.banner": "आप ऑफ़लाइन हैं। इस डिवाइस पर सहेजी गई जानकारी दिखाई जा रही है।",
	"login.title": "समुदाय लॉगिन",
	"login.body": "यात्रियों, स्वयंसेवकों, मॉडरेटरों और अधिकारियों के खाते अगले चरण में आएँगे। इस प्रोटोटाइप में आप बिना साइन इन किए सड़क जाँच सकते हैं और रिपोर्ट भर सकते हैं — रिपोर्ट इसी डिवाइस पर रहती हैं।",
	"login.close": "ठीक है",
	"hero.eyebrow": "उत्तराखंड सड़क-ख़तरा परामर्श",
	"hero.title": "सफ़र से पहले सुरक्षा की ख़बर",
	"hero.body": "अपनी अगली यात्रा से पहले सड़क पर बताए गए ख़तरे, जानकारी कितनी ताज़ा है, और आधिकारिक प्रतिबंध देखें।",
	"hero.report": "ख़तरा बताएँ",
	"hero.sample": "नमूना परामर्श",
	"search.title": "आप कहाँ जा रहे हैं?",
	"search.from": "कहाँ से",
	"search.to": "कहाँ तक",
	"search.fromPh": "शुरुआती स्थान",
	"search.toPh": "गंतव्य",
	"search.swap": "शुरुआत और गंतव्य बदलें",
	"search.useLocation": "मेरा स्थान लें",
	"search.locating": "स्थान ढूँढ रहे हैं…",
	"search.locDenied": "स्थान की अनुमति नहीं मिली। कृपया स्थान लिखें या चुनें।",
	"search.locOutside": "आपका स्थान उत्तराखंड कवरेज क्षेत्र से बाहर है। सूची से कोई स्थान चुनें।",
	"search.locUnavailable": "इस डिवाइस पर स्थान उपलब्ध नहीं है। कृपया स्थान लिखें या चुनें।",
	"search.locNearest": "सबसे नज़दीकी स्थान",
	"search.submit": "सड़क जाँचें",
	"search.coverage": "कवरेज: उत्तराखंड के सभी 13 ज़िले। सूची से स्थान चुनें।",
	"search.quick": "झटपट चुनें",
	"search.recent": "हाल की खोजें",
	"search.clearRecent": "सब हटाएँ",
	"search.noMatch": "उत्तराखंड कवरेज क्षेत्र में कोई मिलता-जुलता स्थान नहीं।",
	"search.same": "दो अलग-अलग स्थान चुनें।",
	"search.pickFrom": "शुरुआत बनाएँ",
	"search.pickTo": "गंतव्य बनाएँ",
	"s1.title": "अपनी सड़क जाँचें",
	"s1.body": "बताइए आप कहाँ से चल रहे हैं और कहाँ जा रहे हैं। राहप्रहरी उपलब्ध मार्ग, हर हिस्से की जानकारी कितनी ताज़ा है, और लागू आधिकारिक प्रतिबंध दिखाता है।",
	"s1.a": "हर सड़क हिस्से का परामर्श स्तर",
	"s1.b": "नवीनतम अवलोकन कितना पुराना है",
	"s1.c": "स्रोत सहित आधिकारिक प्रतिबंध",
	"s1.d": "बिना ताज़ा जानकारी वाली दूरी",
	"s2.title": "रिपोर्ट से मार्गदर्शन तक",
	"s2.step1": "रिपोर्ट",
	"s2.step1Body": "यात्री सुरक्षित जगह से, फ़ोटो और पुष्टि किए गए स्थान के साथ, जो देखा वह बताते हैं।",
	"s2.step2": "समीक्षा",
	"s2.step2Body": "प्रशिक्षित मॉडरेटर साक्ष्य, दोहराव और विरोधाभास जाँचते हैं। हर निर्णय का कारण दर्ज होता है।",
	"s2.step3": "जानकारी पाएँ",
	"s2.step3Body": "समीक्षित रिपोर्ट परामर्श तय करती हैं। आधिकारिक प्रतिबंध हमेशा सर्वोपरि रहते हैं।",
	"s3.title": "स्थानीय जानकारी। स्पष्ट निर्णय।",
	"s3.body": "पहाड़ी सड़कों पर हालात जल्दी बदलते हैं। सड़क पर मौजूद लोग अक्सर समस्या पहले देखते हैं। राहप्रहरी उनके अवलोकनों को आधिकारिक जानकारी के साथ रखता है, और हर एक पर स्रोत और समय दिखाता है।",
	"s3.a": "समुदाय रिपोर्ट को कभी आधिकारिक बंदी नहीं दिखाया जाता।",
	"s3.b": "जानकारी न होने पर \"अज्ञात\" दिखता है — कभी \"साफ़\" नहीं।",
	"s3.c": "पुरानी जानकारी पर उसकी उम्र के साथ \"पुरानी\" लिखा होता है।",
	"final.title": "यात्रा जानकारी, कोई गारंटी नहीं",
	"final.body": "राहप्रहरी तैयारी में मदद करता है। यह हर सड़क नहीं देख सकता, और रिपोर्ट के बाद हालात बदल सकते हैं। हमेशा आधिकारिक निर्देशों, स्थानीय पुलिस और सड़क प्राधिकरणों का पालन करें।",
	"footer.about": "परिचय",
	"footer.privacy": "गोपनीयता",
	"footer.terms": "शर्तें",
	"footer.accessibility": "सुगम्यता",
	"footer.contact": "संपर्क",
	"footer.note": "प्रदर्शन हेतु प्रोटोटाइप। दिखाई गई सभी रिपोर्ट, प्रतिबंध और मार्ग कृत्रिम हैं।",
	"level.clear": "साफ़",
	"level.caution": "सावधानी",
	"level.avoid": "टालें",
	"level.do_not_travel": "यात्रा न करें",
	"level.unknown": "अज्ञात",
	"level.stale": "पुरानी",
	"level.official": "आधिकारिक",
	"action.clear": "हाल के समीक्षित अवलोकन सड़क खुली बताते हैं। पहाड़ी सड़क की सामान्य सावधानी रखें।",
	"action.caution": "धीरे चलाएँ और रुकने या लौटने के लिए तैयार रहें।",
	"action.avoid": "इस हिस्से पर ग़ैर-ज़रूरी यात्रा टालें।",
	"action.do_not_travel": "यात्रा न करें। आधिकारिक निर्देशों का पालन करें।",
	"action.unknown": "यात्रा से पहले स्थानीय रूप से पता करें।",
	"basis.official": "आधिकारिक प्रतिबंध लागू",
	"basis.corroborated": "कई रिपोर्ट, कम से कम एक समीक्षित",
	"basis.single_report": "समुदाय रिपोर्ट, समीक्षा लंबित या पूर्ण",
	"basis.conflicting": "विरोधाभासी रिपोर्ट — समीक्षा जारी",
	"basis.verified_clear": "हाल का समीक्षित अवलोकन",
	"basis.stale_only": "केवल पुराने अवलोकन",
	"basis.no_evidence": "कोई हालिया अवलोकन नहीं।",
	"copy.noOfficial": "कोई वर्तमान आधिकारिक जानकारी नहीं।",
	"copy.noRecent": "कोई हालिया अवलोकन नहीं।",
	"copy.awaitingClearance": "मार्ग खुलने के सत्यापन की प्रतीक्षा।",
	"copy.savedLocal": "इस डिवाइस पर सहेजा गया, अभी प्राप्त नहीं हुआ।",
	"copy.communityUnverified": "यह समुदाय द्वारा बताया गया ख़तरा है और इसकी स्वतंत्र पुष्टि नहीं हुई है।",
	"copy.noReportNotSafe": "कोई वर्तमान रिपोर्ट न होने का अर्थ यह नहीं कि सड़क सुरक्षित है।",
	"copy.estimate": "प्रोटोटाइप अनुमान। आधिकारिक प्रतिबंध सर्वोपरि हैं।",
	"copy.notOfficial": "आधिकारिक बंदी नहीं",
	"copy.poorCoverage": "बेहतर मार्ग सुझाने के लिए पर्याप्त ताज़ा जानकारी नहीं है। पहाड़ी क्षेत्रों में हालात जल्दी बदल सकते हैं। नवीनतम रिपोर्ट और परामर्श देखें।",
	"copy.pastReview": "समीक्षा का समय बीत चुका है। अधिकृत अद्यतन तक यह प्रतिबंध लागू रहेगा।",
	"results.title": "मार्ग विकल्प",
	"results.seeded": "पूर्व-निर्धारित मार्ग डेटा — लाइव रूटिंग सेवा नहीं",
	"results.sort": "क्रम",
	"sort.fastest": "सबसे तेज़",
	"sort.shortest": "सबसे कम दूरी",
	"sort.current": "सबसे ताज़ा जानकारी",
	"results.via": "होकर",
	"results.distance": "दूरी",
	"results.duration": "सामान्य अवधि",
	"results.coverage": "जानकारी कवरेज",
	"results.latest": "नवीनतम अवलोकन",
	"results.hazards": "समुदाय ख़तरे",
	"results.restrictions": "आधिकारिक प्रतिबंध",
	"results.unknownKm": "ताज़ा जानकारी नहीं",
	"results.compare": "मानचित्र पर तुलना",
	"results.details": "सड़क विवरण देखें",
	"results.hideDetails": "सड़क विवरण छिपाएँ",
	"results.save": "यह सड़क सहेजें",
	"results.saved": "इस डिवाइस पर सहेजा गया",
	"results.reportHere": "ख़तरा बताएँ",
	"results.none": "इन स्थानों को जोड़ने वाला कोई पूर्व-निर्धारित मार्ग नहीं",
	"results.noneBody": "इस प्रोटोटाइप में लाइव रूटिंग उपलब्ध नहीं है, इसलिए केवल 14 पूर्व-निर्धारित मार्ग खोजे जा सकते हैं। उसी मार्ग के आस-पास के स्थान आज़माएँ।",
	"results.typical": "सामान्य परिस्थितियाँ, लाइव यात्रा समय नहीं",
	"results.sections": "सड़क के हिस्से",
	"view.map": "मानचित्र",
	"view.list": "सूची",
	"map.schematic": "रेखाचित्र मानचित्र — स्थिति अनुमानित, कोई बेसमैप नहीं",
	"map.legend": "संकेत",
	"map.hazard": "समुदाय रिपोर्ट",
	"map.restriction": "आधिकारिक प्रतिबंध",
	"map.selected": "चुना गया मार्ग",
	"map.layers": "बेसमैप जुड़ने पर भू-भाग, उपग्रह और सड़क परतें उपलब्ध होंगी।",
	"adv.title": "सड़क परामर्श",
	"adv.body": "उत्तराखंड के हर पूर्व-निर्धारित मार्ग का हिस्सा-दर-हिस्सा विवरण। क्या देखा गया, क्या करें और किसने बताया — यह जानने के लिए कोई हिस्सा चुनें।",
	"adv.filter": "दिखाएँ",
	"adv.filterAll": "सभी हिस्से",
	"adv.filterIssues": "परामर्श वाले हिस्से",
	"adv.filterOfficial": "आधिकारिक प्रतिबंध",
	"adv.filterUnknown": "अज्ञात या पुरानी",
	"adv.empty": "इस फ़िल्टर से कोई हिस्सा मेल नहीं खाता।",
	"adv.searchRoute": "इसके बजाय यात्रा योजना बनाएँ",
	"segment.title": "हिस्से का विवरण",
	"segment.observed": "देखी गई स्थिति",
	"segment.action": "सुझाई गई कार्रवाई",
	"segment.official": "आधिकारिक प्रतिबंध",
	"segment.source": "साक्ष्य का स्रोत और ताज़गी",
	"segment.uncertainty": "अनिश्चितता और समीक्षा स्थिति",
	"segment.reports": "नवीनतम रिपोर्ट",
	"segment.select": "परामर्श देखने के लिए सड़क का कोई हिस्सा चुनें।",
	"segment.issuedBy": "जारीकर्ता",
	"segment.published": "प्रकाशित",
	"segment.effective": "से प्रभावी",
	"segment.reviewBy": "समीक्षा तिथि",
	"segment.status": "स्थिति",
	"segment.inForce": "लागू",
	"segment.ref": "संदर्भ",
	"segment.reviewed": "समीक्षित",
	"segment.reportsCount": "रिपोर्ट पर विचार",
	"segment.photos": "फ़ोटो",
	"segment.observedAgo": "देखा गया",
	"segment.conflict": "इससे विरोधाभास",
	"segment.duplicate": "संभावित दोहराव",
	"segment.locConf": "स्थान विश्वसनीयता",
	"segment.close": "विवरण बंद करें",
	"status.under_review": "समीक्षाधीन",
	"status.verified": "समीक्षित — पुष्ट",
	"status.needs_info": "और जानकारी चाहिए",
	"status.duplicate": "दोहराव",
	"status.rejected": "अस्वीकृत",
	"status.conflicting": "अनसुलझा / विरोधाभासी",
	"source.traveller": "यात्री",
	"source.volunteer": "स्वयंसेवक",
	"conf.high": "उच्च",
	"conf.medium": "मध्यम",
	"conf.low": "निम्न",
	"kind.clear": "सड़क चलने योग्य",
	"hazard.landslide": "भूस्खलन",
	"hazard.rockfall": "पत्थर गिरना",
	"hazard.flooding": "जलभराव / बाढ़",
	"hazard.road_block": "सड़क अवरोध",
	"hazard.fallen_tree": "गिरा पेड़",
	"hazard.damaged_bridge": "क्षतिग्रस्त पुल",
	"hazard.road_damage": "सड़क क्षति",
	"hazard.snow_ice": "बर्फ़ / पाला",
	"hazard.poor_visibility": "कम दृश्यता",
	"hazard.accident": "दुर्घटना",
	"hazard.other": "अन्य",
	"restriction.road_closed": "सड़क बंद",
	"restriction.partially_restricted": "आंशिक प्रतिबंध",
	"restriction.vehicle_restricted": "वाहन प्रतिबंध",
	"restriction.time_bound": "समय-सीमित",
	"report.title": "ख़तरा बताएँ",
	"report.intro": "चार छोटे चरण। आप कभी भी इस डिवाइस पर ड्राफ़्ट सहेज सकते हैं।",
	"report.step": "चरण",
	"report.of": "में से",
	"report.step1": "अवलोकन",
	"report.step2": "साक्ष्य",
	"report.step3": "स्थान",
	"report.step4": "जाँचें और भेजें",
	"report.safety": "साक्ष्य केवल सुरक्षित स्थान से लें। फ़ोटो या वीडियो लेने के लिए ख़तरनाक जगह पर न रुकें।",
	"report.type": "आपने क्या देखा?",
	"report.typeErr": "ख़तरे का प्रकार चुनें।",
	"report.desc": "विवरण दें",
	"report.descPh": "सड़क पर क्या रुकावट या असर है? कौन-सी लेन? क्या स्थिति बदल रही है?",
	"report.descErr": "छोटा विवरण जोड़ें (कम से कम 10 अक्षर)।",
	"report.when": "आपने यह कब देखा?",
	"report.whenErr": "पिछले 72 घंटों का समय चुनें, भविष्य का नहीं।",
	"report.severity": "यह कितना गंभीर है?",
	"report.sevErr": "गंभीरता चुनें।",
	"sev.low": "कम",
	"sev.lowHint": "सावधानी से निकल सकते हैं",
	"sev.moderate": "मध्यम",
	"sev.moderateHint": "धीमा या आंशिक रुकावट",
	"sev.high": "अधिक",
	"sev.highHint": "बंद या ख़तरनाक",
	"report.continue": "आगे बढ़ें",
	"report.back": "पीछे",
	"report.saveDraft": "ड्राफ़्ट सहेजें",
	"report.draftSaved": "ड्राफ़्ट इस डिवाइस पर सहेजा गया।",
	"report.draftRestored": "आपका सहेजा ड्राफ़्ट वापस लाया गया।",
	"report.discard": "ड्राफ़्ट हटाएँ",
	"report.photosTitle": "फ़ोटो जोड़ें (वैकल्पिक)",
	"report.photosHint": "अधिकतम 4 चित्र · JPG, PNG या WebP · प्रत्येक 10 MB",
	"report.addPhotos": "फ़ोटो चुनें",
	"report.photosEmpty": "कोई फ़ोटो नहीं। बिना फ़ोटो वाली रिपोर्ट की भी समीक्षा होती है।",
	"report.photoLocal": "इस डिवाइस पर चुनी गई — अपलोड नहीं हुई",
	"report.photoRemove": "हटाएँ",
	"report.photoTypeErr": "JPG, PNG या WebP चित्र नहीं है।",
	"report.photoSizeErr": "10 MB से बड़ी है।",
	"report.photoMaxErr": "आप अधिकतम 4 फ़ोटो जोड़ सकते हैं।",
	"report.photoConsent": "जुड़े हुए संस्करण में फ़ोटो अपलोड से पहले आपकी सहमति ली जाएगी। फ़ोटो निजी साक्ष्य हैं और कभी सार्वजनिक पते पर प्रकाशित नहीं होतीं।",
	"report.photoDraftNote": "सहेजे ड्राफ़्ट में फ़ोटो नहीं रहतीं; आगे बढ़ते समय फिर से जोड़ें।",
	"report.locTitle": "यह कहाँ था?",
	"report.locSearch": "नज़दीकी क़स्बा या पहचान स्थल",
	"report.locPin": "या मानचित्र पर सड़क चुनें",
	"report.locGps": "मेरा वर्तमान स्थान लें",
	"report.locAccuracy": "अनुमानित सटीकता",
	"report.locLandmark": "पहचान स्थल (वैकल्पिक)",
	"report.locLandmarkPh": "जैसे पुल के 2 किमी बाद",
	"report.locSegment": "सुझाया गया सड़क हिस्सा",
	"report.locAmbiguous": "पास में एक से अधिक हिस्से हैं। जिस पर आप थे, वह चुनें:",
	"report.locConfirm": "स्थान की पुष्टि करें",
	"report.locConfirmed": "स्थान की पुष्टि हुई",
	"report.locChange": "बदलें",
	"report.locErr": "स्थान चुनें और पुष्टि करें।",
	"report.locConsent": "आपका सटीक स्थान केवल रिपोर्ट रखने के लिए उपयोग होता है और कभी सार्वजनिक नहीं होता।",
	"report.reviewTitle": "अपनी रिपोर्ट जाँचें",
	"report.edit": "बदलें",
	"report.reviewNote": "आपकी रिपोर्ट की समीक्षा होगी और यह आधिकारिक सड़क बंदी नहीं है।",
	"report.submit": "रिपोर्ट भेजें",
	"report.simulated": "नक़ली जमा — स्थानीय डेमो मोड, कोई सर्वर जुड़ा नहीं",
	"report.ref": "डेमो संदर्भ",
	"report.refNote": "इसी डिवाइस पर बना। यह सर्वर द्वारा जारी संदर्भ नहीं है।",
	"report.another": "एक और ख़तरा बताएँ",
	"report.viewRoad": "सड़क परामर्श देखें",
	"report.retry": "फिर कोशिश करें",
	"report.simulateFail": "विफल अपलोड का अनुकरण करें",
	"report.noPhotos": "कोई फ़ोटो नहीं",
	"delivery.saved": "इस डिवाइस पर सहेजा गया",
	"delivery.queued": "कतार में",
	"delivery.uploading": "अपलोड हो रहा है",
	"delivery.received": "सर्वर को प्राप्त",
	"delivery.review": "समीक्षाधीन",
	"delivery.reviewed": "समीक्षित",
	"delivery.failed": "अपलोड विफल",
	"delivery.offlineQueued": "आप ऑफ़लाइन हैं। रिपोर्ट इस डिवाइस पर कतार में है और ऑनलाइन होने तक नहीं भेजी जाएगी।",
	"delivery.demoStop": "स्थानीय डेमो मोड में कोई सर्वर नहीं है, इसलिए रिपोर्ट यहीं रुकती है — इस डिवाइस पर सहेजी गई, किसी को प्राप्त नहीं हुई। बैकएंड जुड़ने पर समीक्षा होगी।",
	"progress.title": "रिपोर्ट की प्रगति",
	"progress.submitted": "भेजी गई",
	"progress.received": "सर्वर को प्राप्त",
	"progress.review": "समीक्षाधीन",
	"progress.decision": "निर्णय दर्ज",
	"progress.clearance": "मार्ग खुलने का सत्यापन",
	"progress.note": "समीक्षा स्वयं सड़क नहीं खोलती और न ही आधिकारिक प्रतिबंध हटाती है।",
	"time.justNow": "अभी",
	"time.minAgo": "मिनट पहले",
	"time.hAgo": "घंटे पहले",
	"time.dAgo": "दिन पहले",
	"time.inH": "में",
	"common.km": "किमी",
	"common.hr": "घं",
	"common.min": "मि",
	"about.title": "राहप्रहरी के बारे में"
};
// src/data/fixtures.ts
var TEN_MIN = 6e5;
/** Demo clock, rounded so server and browser renders agree. */
var DEMO_NOW = Math.floor(Date.now() / TEN_MIN) * TEN_MIN;
var hoursAgo = (h) => DEMO_NOW - Math.round(h * 36e5);
var COVERAGE_BOUNDS = {
	minLon: 77.5,
	maxLon: 81.1,
	minLat: 28.7,
	maxLat: 31.5
};
var PLACES = [
	{
		id: "dehradun",
		name: "Dehradun",
		nameHi: "देहरादून",
		district: "Dehradun",
		lat: 30.3165,
		lon: 78.0322
	},
	{
		id: "mussoorie",
		name: "Mussoorie",
		nameHi: "मसूरी",
		district: "Dehradun",
		lat: 30.4598,
		lon: 78.0644
	},
	{
		id: "doiwala",
		name: "Doiwala",
		nameHi: "डोईवाला",
		district: "Dehradun",
		lat: 30.1766,
		lon: 78.1153
	},
	{
		id: "rishikesh",
		name: "Rishikesh",
		nameHi: "ऋषिकेश",
		district: "Dehradun",
		lat: 30.0869,
		lon: 78.2676
	},
	{
		id: "haridwar",
		name: "Haridwar",
		nameHi: "हरिद्वार",
		district: "Haridwar",
		lat: 29.9457,
		lon: 78.1642
	},
	{
		id: "devprayag",
		name: "Devprayag",
		nameHi: "देवप्रयाग",
		district: "Tehri Garhwal",
		lat: 30.146,
		lon: 78.598
	},
	{
		id: "srinagar",
		name: "Srinagar (Garhwal)",
		nameHi: "श्रीनगर (गढ़वाल)",
		district: "Pauri Garhwal",
		lat: 30.2235,
		lon: 78.7836
	},
	{
		id: "rudraprayag",
		name: "Rudraprayag",
		nameHi: "रुद्रप्रयाग",
		district: "Rudraprayag",
		lat: 30.2844,
		lon: 78.9811
	},
	{
		id: "karnaprayag",
		name: "Karnaprayag",
		nameHi: "कर्णप्रयाग",
		district: "Chamoli",
		lat: 30.2627,
		lon: 79.2213
	},
	{
		id: "chamoli",
		name: "Chamoli",
		nameHi: "चमोली",
		district: "Chamoli",
		lat: 30.4022,
		lon: 79.326
	},
	{
		id: "joshimath",
		name: "Joshimath",
		nameHi: "जोशीमठ",
		district: "Chamoli",
		lat: 30.555,
		lon: 79.5643
	},
	{
		id: "badrinath",
		name: "Badrinath",
		nameHi: "बद्रीनाथ",
		district: "Chamoli",
		lat: 30.7433,
		lon: 79.4938
	},
	{
		id: "agastyamuni",
		name: "Agastyamuni",
		nameHi: "अगस्त्यमुनि",
		district: "Rudraprayag",
		lat: 30.392,
		lon: 79.026
	},
	{
		id: "guptkashi",
		name: "Guptkashi",
		nameHi: "गुप्तकाशी",
		district: "Rudraprayag",
		lat: 30.526,
		lon: 79.079
	},
	{
		id: "sonprayag",
		name: "Sonprayag",
		nameHi: "सोनप्रयाग",
		district: "Rudraprayag",
		lat: 30.634,
		lon: 78.998
	},
	{
		id: "gaurikund",
		name: "Gaurikund",
		nameHi: "गौरीकुंड",
		district: "Rudraprayag",
		lat: 30.652,
		lon: 79.025
	},
	{
		id: "chamba",
		name: "Chamba",
		nameHi: "चंबा",
		district: "Tehri Garhwal",
		lat: 30.348,
		lon: 78.393
	},
	{
		id: "uttarkashi",
		name: "Uttarkashi",
		nameHi: "उत्तरकाशी",
		district: "Uttarkashi",
		lat: 30.7268,
		lon: 78.4354
	},
	{
		id: "harsil",
		name: "Harsil",
		nameHi: "हर्षिल",
		district: "Uttarkashi",
		lat: 31.038,
		lon: 78.742
	},
	{
		id: "gangotri",
		name: "Gangotri",
		nameHi: "गंगोत्री",
		district: "Uttarkashi",
		lat: 30.9947,
		lon: 78.9398
	},
	{
		id: "rudrapur",
		name: "Rudrapur",
		nameHi: "रुद्रपुर",
		district: "Udham Singh Nagar",
		lat: 28.9845,
		lon: 79.4006
	},
	{
		id: "haldwani",
		name: "Haldwani",
		nameHi: "हल्द्वानी",
		district: "Nainital",
		lat: 29.2183,
		lon: 79.513
	},
	{
		id: "kathgodam",
		name: "Kathgodam",
		nameHi: "काठगोदाम",
		district: "Nainital",
		lat: 29.269,
		lon: 79.539
	},
	{
		id: "bhowali",
		name: "Bhowali",
		nameHi: "भवाली",
		district: "Nainital",
		lat: 29.387,
		lon: 79.513
	},
	{
		id: "nainital",
		name: "Nainital",
		nameHi: "नैनीताल",
		district: "Nainital",
		lat: 29.3803,
		lon: 79.4636
	},
	{
		id: "khairna",
		name: "Khairna",
		nameHi: "खैरना",
		district: "Nainital",
		lat: 29.472,
		lon: 79.556
	},
	{
		id: "almora",
		name: "Almora",
		nameHi: "अल्मोड़ा",
		district: "Almora",
		lat: 29.5971,
		lon: 79.6591
	},
	{
		id: "takula",
		name: "Takula",
		nameHi: "ताकुला",
		district: "Almora",
		lat: 29.675,
		lon: 79.74
	},
	{
		id: "bageshwar",
		name: "Bageshwar",
		nameHi: "बागेश्वर",
		district: "Bageshwar",
		lat: 29.838,
		lon: 79.771
	},
	{
		id: "seraghat",
		name: "Seraghat",
		nameHi: "सेराघाट",
		district: "Almora",
		lat: 29.605,
		lon: 79.92
	},
	{
		id: "gangolihat",
		name: "Gangolihat",
		nameHi: "गंगोलीहाट",
		district: "Pithoragarh",
		lat: 29.656,
		lon: 80.043
	},
	{
		id: "pithoragarh",
		name: "Pithoragarh",
		nameHi: "पिथौरागढ़",
		district: "Pithoragarh",
		lat: 29.5829,
		lon: 80.2182
	},
	{
		id: "tanakpur",
		name: "Tanakpur",
		nameHi: "टनकपुर",
		district: "Champawat",
		lat: 29.074,
		lon: 80.111
	},
	{
		id: "champawat",
		name: "Champawat",
		nameHi: "चंपावत",
		district: "Champawat",
		lat: 29.336,
		lon: 80.091
	},
	{
		id: "lohaghat",
		name: "Lohaghat",
		nameHi: "लोहाघाट",
		district: "Champawat",
		lat: 29.404,
		lon: 80.087
	},
	{
		id: "kotdwar",
		name: "Kotdwar",
		nameHi: "कोटद्वार",
		district: "Pauri Garhwal",
		lat: 29.747,
		lon: 78.523
	},
	{
		id: "satpuli",
		name: "Satpuli",
		nameHi: "सतपुली",
		district: "Pauri Garhwal",
		lat: 29.92,
		lon: 78.71
	},
	{
		id: "pauri",
		name: "Pauri",
		nameHi: "पौड़ी",
		district: "Pauri Garhwal",
		lat: 30.147,
		lon: 78.78
	}
];
var QUICK_PICKS = [
	"dehradun",
	"haridwar",
	"rishikesh",
	"mussoorie",
	"nainital",
	"haldwani",
	"joshimath",
	"badrinath",
	"uttarkashi",
	"pithoragarh",
	"almora",
	"gaurikund"
];
/** The 14 predefined corridors (seeded, simplified geometry). */
var CORRIDORS = [
	{
		id: "nh7",
		code: "NH-7",
		name: "Rishikesh – Badrinath",
		stops: [
			"rishikesh",
			"devprayag",
			"srinagar",
			"rudraprayag",
			"karnaprayag",
			"chamoli",
			"joshimath",
			"badrinath"
		],
		legs: [
			[74, 150],
			[35, 60],
			[33, 60],
			[31, 55],
			[39, 70],
			[47, 90],
			[44, 90]
		]
	},
	{
		id: "nh107",
		code: "NH-107",
		name: "Rudraprayag – Gaurikund",
		stops: [
			"rudraprayag",
			"agastyamuni",
			"guptkashi",
			"sonprayag",
			"gaurikund"
		],
		legs: [
			[18, 35],
			[26, 50],
			[31, 60],
			[5, 15]
		]
	},
	{
		id: "nh34",
		code: "NH-34",
		name: "Rishikesh – Gangotri",
		stops: [
			"rishikesh",
			"chamba",
			"uttarkashi",
			"harsil",
			"gangotri"
		],
		legs: [
			[60, 120],
			[88, 180],
			[73, 150],
			[25, 45]
		]
	},
	{
		id: "msr",
		code: "SH-MSR",
		name: "Dehradun – Mussoorie",
		stops: ["dehradun", "mussoorie"],
		legs: [[34, 75]]
	},
	{
		id: "ddn",
		code: "NH-7D",
		name: "Dehradun – Rishikesh",
		stops: [
			"dehradun",
			"doiwala",
			"rishikesh"
		],
		legs: [[20, 35], [25, 40]]
	},
	{
		id: "hrd",
		code: "NH-7H",
		name: "Haridwar – Rishikesh",
		stops: ["haridwar", "rishikesh"],
		legs: [[24, 45]]
	},
	{
		id: "ntl",
		code: "NH-109",
		name: "Haldwani – Nainital",
		stops: [
			"haldwani",
			"kathgodam",
			"bhowali",
			"nainital"
		],
		legs: [
			[7, 15],
			[30, 60],
			[11, 25]
		]
	},
	{
		id: "alm",
		code: "NH-109A",
		name: "Bhowali – Almora",
		stops: [
			"bhowali",
			"khairna",
			"almora"
		],
		legs: [[22, 40], [42, 80]]
	},
	{
		id: "bgs",
		code: "SH-BGS",
		name: "Almora – Bageshwar",
		stops: [
			"almora",
			"takula",
			"bageshwar"
		],
		legs: [[30, 60], [42, 80]]
	},
	{
		id: "pth",
		code: "SH-PTH",
		name: "Almora – Pithoragarh",
		stops: [
			"almora",
			"seraghat",
			"gangolihat",
			"pithoragarh"
		],
		legs: [
			[45, 90],
			[30, 60],
			[50, 100]
		]
	},
	{
		id: "nh9",
		code: "NH-9",
		name: "Tanakpur – Pithoragarh",
		stops: [
			"tanakpur",
			"champawat",
			"lohaghat",
			"pithoragarh"
		],
		legs: [
			[75, 150],
			[14, 25],
			[62, 120]
		]
	},
	{
		id: "pau",
		code: "NH-534",
		name: "Kotdwar – Pauri",
		stops: [
			"kotdwar",
			"satpuli",
			"pauri"
		],
		legs: [[55, 100], [50, 95]]
	},
	{
		id: "psn",
		code: "SH-PSN",
		name: "Pauri – Srinagar",
		stops: ["pauri", "srinagar"],
		legs: [[30, 60]]
	},
	{
		id: "rud",
		code: "NH-109R",
		name: "Rudrapur – Haldwani",
		stops: ["rudrapur", "haldwani"],
		legs: [[40, 60]]
	}
];
var SEGMENTS = CORRIDORS.flatMap((c) => {
	let km = 0;
	return c.legs.map(([distanceKm, typicalMinutes], i) => {
		const seg = {
			id: `${c.id}-${String(i + 1).padStart(2, "0")}`,
			corridorId: c.id,
			code: `${c.code} · ${String(i + 1).padStart(2, "0")}`,
			from: c.stops[i],
			to: c.stops[i + 1],
			kmStart: km,
			kmEnd: km + distanceKm,
			distanceKm,
			typicalMinutes
		};
		km += distanceKm;
		return seg;
	});
});
var seed = (r) => {
	const { obsH, recvH, ...rest } = r;
	return {
		photoCount: 1,
		source: "traveller",
		locationConfidence: "high",
		...rest,
		observedAt: hoursAgo(obsH),
		receivedAt: hoursAgo(recvH ?? Math.max(obsH - .25, .05)),
		synthetic: true
	};
};
var REPORTS = [
	seed({
		ref: "RP-418203",
		segmentId: "nh7-06",
		kind: "hazard",
		hazardType: "landslide",
		severity: "high",
		description: "Debris across both lanes after overnight rain. Vehicles turning back near the slide.",
		landmark: "Near Pipalkoti bend",
		obsH: 9,
		status: "verified",
		photoCount: 3
	}),
	seed({
		ref: "RP-418377",
		segmentId: "nh7-06",
		kind: "hazard",
		hazardType: "landslide",
		severity: "high",
		description: "Slide still active, small stones falling. Machinery present but not clearing yet.",
		landmark: "Pipalkoti, 2 km ahead",
		obsH: 5,
		status: "verified",
		source: "volunteer",
		photoCount: 2
	}),
	seed({
		ref: "RP-418519",
		segmentId: "nh7-06",
		kind: "clear",
		hazardType: "other",
		severity: "low",
		description: "Light vehicles being let through one at a time.",
		landmark: "Pipalkoti",
		obsH: 2,
		status: "conflicting",
		conflictsWith: "RP-418377",
		locationConfidence: "medium",
		photoCount: 0
	}),
	seed({
		ref: "RP-419002",
		segmentId: "nh7-01",
		kind: "hazard",
		hazardType: "rockfall",
		severity: "moderate",
		description: "Loose rocks on the valley-side lane, one lane usable.",
		landmark: "Byasi",
		obsH: 3,
		status: "under_review"
	}),
	seed({
		ref: "RP-417734",
		segmentId: "nh7-03",
		kind: "hazard",
		hazardType: "road_damage",
		severity: "low",
		description: "Potholes and broken edge on a short stretch. Slow down.",
		landmark: "Near Dhari Devi",
		obsH: 5,
		status: "verified"
	}),
	seed({
		ref: "RP-419110",
		segmentId: "nh7-04",
		kind: "clear",
		hazardType: "other",
		severity: "low",
		description: "Road open, normal movement.",
		landmark: "Gauchar",
		obsH: 2,
		status: "verified",
		source: "volunteer",
		photoCount: 0
	}),
	seed({
		ref: "RP-418842",
		segmentId: "nh7-07",
		kind: "hazard",
		hazardType: "snow_ice",
		severity: "moderate",
		description: "Ice patches on shaded bends in the early morning.",
		landmark: "Hanuman Chatti",
		obsH: 6,
		status: "verified",
		photoCount: 2
	}),
	seed({
		ref: "RP-418851",
		segmentId: "nh7-07",
		kind: "hazard",
		hazardType: "snow_ice",
		severity: "moderate",
		description: "Slippery near Hanuman Chatti.",
		landmark: "Hanuman Chatti",
		obsH: 5.8,
		status: "duplicate",
		duplicateOf: "RP-418842",
		photoCount: 0
	}),
	seed({
		ref: "RP-419215",
		segmentId: "nh107-02",
		kind: "hazard",
		hazardType: "landslide",
		severity: "high",
		description: "Slide blocking most of the road, people walking across.",
		landmark: "Kund",
		obsH: 4,
		status: "verified",
		photoCount: 4
	}),
	seed({
		ref: "RP-419260",
		segmentId: "nh107-02",
		kind: "hazard",
		hazardType: "landslide",
		severity: "high",
		description: "Same slide near Kund, a queue of vehicles on both sides.",
		landmark: "Kund",
		obsH: 3,
		status: "under_review",
		source: "volunteer",
		photoCount: 1
	}),
	seed({
		ref: "RP-418990",
		segmentId: "nh107-03",
		kind: "hazard",
		hazardType: "poor_visibility",
		severity: "moderate",
		description: "Dense fog after sunset, visibility under 20 m.",
		landmark: "Phata",
		obsH: 14,
		status: "verified",
		photoCount: 0
	}),
	seed({
		ref: "RP-419301",
		segmentId: "nh107-04",
		kind: "hazard",
		hazardType: "flooding",
		severity: "high",
		description: "Water flowing over the road at the culvert.",
		landmark: "Sonprayag bridge approach",
		obsH: 2,
		status: "conflicting",
		conflictsWith: "RP-419322",
		locationConfidence: "medium"
	}),
	seed({
		ref: "RP-419322",
		segmentId: "nh107-04",
		kind: "clear",
		hazardType: "other",
		severity: "low",
		description: "Crossed the culvert without trouble, water receding.",
		landmark: "Sonprayag",
		obsH: 1.5,
		status: "conflicting",
		conflictsWith: "RP-419301",
		photoCount: 0
	}),
	seed({
		ref: "RP-416011",
		segmentId: "nh34-02",
		kind: "hazard",
		hazardType: "fallen_tree",
		severity: "low",
		description: "Tree branch on one lane.",
		landmark: "Kandisaur",
		obsH: 31,
		status: "verified",
		photoCount: 1
	}),
	seed({
		ref: "RP-419340",
		segmentId: "nh34-04",
		kind: "hazard",
		hazardType: "poor_visibility",
		severity: "moderate",
		description: "Low cloud on the climb, headlights needed.",
		landmark: "Lanka bridge",
		obsH: 1,
		status: "under_review",
		photoCount: 0
	}),
	seed({
		ref: "RP-419355",
		segmentId: "msr-01",
		kind: "clear",
		hazardType: "other",
		severity: "low",
		description: "Normal traffic, road dry.",
		landmark: "Kolhukhet",
		obsH: 2,
		status: "verified",
		photoCount: 0
	}),
	seed({
		ref: "RP-419101",
		segmentId: "msr-01",
		kind: "hazard",
		hazardType: "accident",
		severity: "low",
		description: "Minor collision, cleared.",
		landmark: "Kimadi turn",
		obsH: 6,
		status: "rejected",
		photoCount: 0,
		locationConfidence: "low"
	}),
	seed({
		ref: "RP-419372",
		segmentId: "ddn-01",
		kind: "clear",
		hazardType: "other",
		severity: "low",
		description: "Smooth movement.",
		landmark: "Harrawala",
		obsH: 1,
		status: "verified",
		photoCount: 0
	}),
	seed({
		ref: "RP-419380",
		segmentId: "ddn-02",
		kind: "clear",
		hazardType: "other",
		severity: "low",
		description: "No issues through the forest stretch.",
		landmark: "Bhaniyawala",
		obsH: 1.2,
		status: "verified",
		source: "volunteer",
		photoCount: 0
	}),
	seed({
		ref: "RP-419390",
		segmentId: "hrd-01",
		kind: "hazard",
		hazardType: "road_block",
		severity: "moderate",
		description: "Diversion in place for road works, single-lane traffic.",
		landmark: "Raiwala",
		obsH: 1,
		status: "under_review"
	}),
	seed({
		ref: "RP-419150",
		segmentId: "ntl-02",
		kind: "hazard",
		hazardType: "rockfall",
		severity: "high",
		description: "Large rock on the hill-side lane.",
		landmark: "Jeolikot",
		obsH: 4,
		status: "under_review",
		photoCount: 1
	}),
	seed({
		ref: "RP-419211",
		segmentId: "ntl-03",
		kind: "clear",
		hazardType: "other",
		severity: "low",
		description: "Open, light traffic.",
		landmark: "Bhowali chowk",
		obsH: 3,
		status: "verified",
		photoCount: 0
	}),
	seed({
		ref: "RP-418770",
		segmentId: "alm-02",
		kind: "hazard",
		hazardType: "landslide",
		severity: "high",
		description: "Partial slide, road narrowed to one lane, loose soil above.",
		landmark: "Kainchi Dham, 4 km ahead",
		obsH: 7,
		status: "verified",
		photoCount: 2
	}),
	seed({
		ref: "RP-418802",
		segmentId: "alm-02",
		kind: "hazard",
		hazardType: "landslide",
		severity: "high",
		description: "Mud and stones across the road, slow one-way movement.",
		landmark: "Near Garampani",
		obsH: 6,
		status: "verified",
		source: "volunteer",
		photoCount: 1
	}),
	seed({
		ref: "RP-418815",
		segmentId: "alm-02",
		kind: "hazard",
		hazardType: "landslide",
		severity: "moderate",
		description: "Slide near Garampani.",
		landmark: "Garampani",
		obsH: 5.5,
		status: "duplicate",
		duplicateOf: "RP-418802",
		locationConfidence: "medium",
		photoCount: 0
	}),
	seed({
		ref: "RP-418655",
		segmentId: "bgs-02",
		kind: "hazard",
		hazardType: "damaged_bridge",
		severity: "moderate",
		description: "Railing broken on the small bridge, surface looks cracked.",
		landmark: "Near Takula market",
		obsH: 6,
		status: "needs_info",
		locationConfidence: "low"
	}),
	seed({
		ref: "RP-418501",
		segmentId: "nh9-01",
		kind: "hazard",
		hazardType: "flooding",
		severity: "moderate",
		description: "Stream crossing the road after rain, passable slowly.",
		landmark: "Chalthi",
		obsH: 8,
		status: "verified"
	}),
	seed({
		ref: "RP-419330",
		segmentId: "nh9-03",
		kind: "hazard",
		hazardType: "road_damage",
		severity: "moderate",
		description: "Test submission.",
		landmark: "Lohaghat",
		obsH: 2,
		status: "rejected",
		photoCount: 0,
		locationConfidence: "low"
	}),
	seed({
		ref: "RP-415440",
		segmentId: "pau-01",
		kind: "clear",
		hazardType: "other",
		severity: "low",
		description: "Road open.",
		landmark: "Dugadda",
		obsH: 40,
		status: "verified",
		photoCount: 0
	}),
	seed({
		ref: "RP-419190",
		segmentId: "psn-01",
		kind: "hazard",
		hazardType: "fallen_tree",
		severity: "moderate",
		description: "Pine tree across half the road, being cut.",
		landmark: "Near Khirsu turn",
		obsH: 2,
		status: "verified",
		photoCount: 1
	}),
	seed({
		ref: "RP-419395",
		segmentId: "rud-01",
		kind: "clear",
		hazardType: "other",
		severity: "low",
		description: "Normal traffic.",
		landmark: "Lalkuan",
		obsH: 1,
		status: "verified",
		photoCount: 0
	})
];
var RESTRICTIONS = [
	{
		id: "OR-2041",
		segmentId: "nh7-06",
		type: "road_closed",
		title: "Road closed for debris clearance",
		issuingAuthority: "District Disaster Management Authority, Chamoli (synthetic)",
		jurisdiction: "Chamoli",
		supportingReference: "DEMO/CHM/0412",
		publishedAt: hoursAgo(10),
		effectiveFrom: hoursAgo(10),
		reviewBy: hoursAgo(2),
		status: "active",
		clearance: "pending",
		synthetic: true
	},
	{
		id: "OR-2044",
		segmentId: "nh107-03",
		type: "time_bound",
		title: "No vehicle movement 20:00 – 06:00",
		issuingAuthority: "District Administration, Rudraprayag (synthetic)",
		jurisdiction: "Rudraprayag",
		supportingReference: "DEMO/RDP/0098",
		publishedAt: hoursAgo(48),
		effectiveFrom: hoursAgo(46),
		reviewBy: DEMO_NOW + 432e6,
		status: "active",
		clearance: "not_requested",
		synthetic: true
	},
	{
		id: "OR-2047",
		segmentId: "nh34-03",
		type: "vehicle_restricted",
		title: "Heavy vehicles above 12 t not permitted",
		issuingAuthority: "Public Works Department, Uttarkashi (synthetic)",
		jurisdiction: "Uttarkashi",
		supportingReference: "DEMO/UKI/0233",
		publishedAt: hoursAgo(72),
		effectiveFrom: hoursAgo(70),
		reviewBy: DEMO_NOW + 1728e5,
		status: "active",
		clearance: "not_requested",
		synthetic: true
	}
];
var placeById = (id) => PLACES.find((p) => p.id === id);
var segmentById = (id) => SEGMENTS.find((s) => s.id === id);
var corridorById = (id) => CORRIDORS.find((c) => c.id === id);
// src/lib/storage.ts
var EVENT = "rp-storage";
function readLocal(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function writeLocal(key, value) {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
		window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
	} catch {}
}
function useLocalState(key, initial) {
	const [value, setValue] = useState(initial);
	useEffect(() => {
		setValue(readLocal(key, initial));
		const sync = (e) => {
			if (e.detail === key) setValue(readLocal(key, initial));
		};
		window.addEventListener(EVENT, sync);
		return () => window.removeEventListener(EVENT, sync);
	}, [key]);
	return [value, useCallback((next) => {
		const resolved = typeof next === "function" ? next(readLocal(key, initial)) : next;
		setValue(resolved);
		writeLocal(key, resolved);
	}, [key])];
}
var STORAGE_KEYS = {
	theme: "rp.theme",
	lang: "rp.lang",
	recentSearches: "rp.recentSearches",
	savedRoads: "rp.savedRoads",
	reportDraft: "rp.reportDraft",
	localReports: "rp.localReports"
};
// src/i18n/preferences.tsx
var PreferencesContext = createContext(null);
function PreferencesProvider({ children }) {
	const [lang, setLangState] = useState("en");
	const [theme, setThemeState] = useState("dark");
	useEffect(() => {
		setLangState(readLocal(STORAGE_KEYS.lang, "en"));
		setThemeState(readLocal(STORAGE_KEYS.theme, "dark"));
	}, []);
	useEffect(() => {
		document.documentElement.lang = lang;
	}, [lang]);
	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		document.documentElement.style.colorScheme = theme;
	}, [theme]);
	const setLang = useCallback((l) => {
		setLangState(l);
		writeLocal(STORAGE_KEYS.lang, l);
	}, []);
	const setTheme = useCallback((t) => {
		setThemeState(t);
		writeLocal(STORAGE_KEYS.theme, t);
	}, []);
	const value = useMemo(() => {
		const dict = lang === "hi" ? hi : en;
		const t = (key) => dict[key] ?? en[key];
		return {
			lang,
			setLang,
			theme,
			setTheme,
			t,
			ago: (ts) => {
				const mins = Math.max(0, Math.round((DEMO_NOW - ts) / 6e4));
				if (mins < 5) return t("time.justNow");
				if (mins < 60) return `${mins} ${t("time.minAgo")}`;
				const h = Math.round(mins / 60);
				if (h < 48) return `${h} ${t("time.hAgo")}`;
				return `${Math.round(h / 24)} ${t("time.dAgo")}`;
			},
			stamp: (ts) => new Date(ts).toLocaleString(lang === "hi" ? "hi-IN" : "en-IN", {
				day: "numeric",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
				timeZone: "Asia/Kolkata"
			}),
			place: (id) => {
				const p = placeById(id);
				return p ? lang === "hi" ? p.nameHi : p.name : id;
			},
			duration: (minutes) => {
				const h = Math.floor(minutes / 60);
				const m = minutes % 60;
				return h ? `${h} ${t("common.hr")} ${m ? `${m} ${t("common.min")}` : ""}`.trim() : `${m} ${t("common.min")}`;
			}
		};
	}, [
		lang,
		theme,
		setLang,
		setTheme
	]);
	return /* @__PURE__ */ jsx(PreferencesContext.Provider, {
		value,
		children
	});
}
function usePrefs() {
	const ctx = useContext(PreferencesContext);
	if (!ctx) throw new Error("usePrefs must be used inside PreferencesProvider");
	return ctx;
}
/** Inline script that applies the saved theme before first paint. */
var themeBootScript = `try{var t=localStorage.getItem('${STORAGE_KEYS.theme}');if(t&&JSON.parse(t)==='light'){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light'}}catch(e){}`;
// src/components/site-chrome.tsx
function Logo({ className }) {
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ jsxs("svg", {
			viewBox: "0 0 32 32",
			"aria-hidden": true,
			className: "size-8 shrink-0",
			children: [
				/* @__PURE__ */ jsx("rect", {
					width: "32",
					height: "32",
					rx: "8",
					fill: "#111719"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M4 23 L12 11 L16 16 L20 9 L28 23 Z",
					fill: "#30363A"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M20 9 L23 13.5 L21 13 L19.5 14.5 L18 12 Z",
					fill: "#E6E4DC"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M10 28 C13 23 19 22 16 17 C14.5 14.5 18 12.5 20 12",
					fill: "none",
					stroke: "#EB5B38",
					strokeWidth: "2.4",
					strokeLinecap: "round"
				})
			]
		}), /* @__PURE__ */ jsxs("span", {
			className: "font-display text-lg font-bold tracking-tight",
			children: ["Raah", /* @__PURE__ */ jsx("span", {
				className: "text-brand-orange",
				children: "Prahari"
			})]
		})]
	});
}
function useOnline() {
	const [online, setOnline] = useState(true);
	useEffect(() => {
		setOnline(navigator.onLine);
		const on = () => setOnline(true);
		const off = () => setOnline(false);
		window.addEventListener("online", on);
		window.addEventListener("offline", off);
		return () => {
			window.removeEventListener("online", on);
			window.removeEventListener("offline", off);
		};
	}, []);
	return online;
}
function LangSwitch() {
	const { lang, setLang, t } = usePrefs();
	return /* @__PURE__ */ jsx("div", {
		role: "group",
		"aria-label": t("lang.label"),
		className: "inline-flex h-10 rounded-full border border-border p-0.5 text-sm",
		children: ["en", "hi"].map((l) => /* @__PURE__ */ jsx("button", {
			type: "button",
			"aria-pressed": lang === l,
			onClick: () => setLang(l),
			lang: l,
			className: cn("min-w-11 rounded-full px-2.5 font-medium transition-colors", lang === l ? "bg-raised text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
			children: l === "en" ? "EN" : "हिन्दी"
		}, l))
	});
}
function ThemeSwitch() {
	const { theme, setTheme, t } = usePrefs();
	const next = theme === "dark" ? "light" : "dark";
	return /* @__PURE__ */ jsx(Button, {
		variant: "ghost",
		size: "icon-lg",
		className: "rounded-full",
		onClick: () => setTheme(next),
		"aria-label": t(next === "light" ? "theme.light" : "theme.dark"),
		title: t("theme.toggle"),
		children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, {}) : /* @__PURE__ */ jsx(Moon, {})
	});
}
function LoginDialog({ open, onOpenChange }) {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, {
			className: "font-display",
			children: t("login.title")
		}), /* @__PURE__ */ jsx(DialogDescription, { children: t("login.body") })] }), /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(DialogClose, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, { children: t("login.close") })
		}) })] })
	});
}
function SiteHeader() {
	const { t } = usePrefs();
	const [loginOpen, setLoginOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const online = useOnline();
	const { pathname, view } = useRouterState({ select: (s) => ({
		pathname: s.location.pathname,
		view: s.location.search.view
	}) });
	const linkClass = (active) => cn("inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-medium transition-colors", active ? "bg-raised text-foreground" : "text-muted-foreground hover:text-foreground");
	const current = (active) => active ? "page" : void 0;
	const isMap = pathname === "/check" && view !== "list";
	const isList = pathname === "/check" && view === "list";
	const navLinks = (onClick) => /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Link, {
			to: "/",
			onClick,
			"aria-current": current(pathname === "/"),
			className: linkClass(pathname === "/"),
			children: t("nav.home")
		}),
		/* @__PURE__ */ jsx(Link, {
			to: "/check",
			search: { view: "map" },
			onClick,
			"aria-current": current(isMap),
			className: linkClass(isMap),
			children: t("nav.map")
		}),
		/* @__PURE__ */ jsx(Link, {
			to: "/check",
			search: { view: "list" },
			onClick,
			"aria-current": current(isList),
			className: linkClass(isList),
			children: t("nav.advisories")
		}),
		/* @__PURE__ */ jsx(Link, {
			to: "/about",
			onClick,
			"aria-current": current(pathname === "/about"),
			className: linkClass(pathname === "/about"),
			children: t("nav.about")
		})
	] });
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("header", {
		className: "sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "rp-container flex h-16 items-center gap-3",
			children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "mr-2 rounded-md",
					"aria-label": "RaahPrahari — home",
					children: /* @__PURE__ */ jsx(Logo, {})
				}),
				/* @__PURE__ */ jsx("nav", {
					"aria-label": t("nav.primary"),
					className: "hidden items-center gap-0.5 lg:flex",
					children: navLinks()
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ml-auto flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "hidden items-center gap-1.5 md:flex",
							children: [
								/* @__PURE__ */ jsx(LangSwitch, {}),
								/* @__PURE__ */ jsx(ThemeSwitch, {}),
								/* @__PURE__ */ jsxs(Button, {
									variant: "ghost",
									className: "h-10 rounded-full",
									onClick: () => setLoginOpen(true),
									children: [/* @__PURE__ */ jsx(UserRound, {}), t("nav.login")]
								})
							]
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							className: "h-10 rounded-full px-4 font-semibold",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/report",
								children: [
									/* @__PURE__ */ jsx(TriangleAlert, {}),
									/* @__PURE__ */ jsx("span", {
										className: "hidden sm:inline",
										children: t("nav.report")
									}),
									/* @__PURE__ */ jsx("span", {
										className: "sm:hidden",
										children: t("hero.report")
									})
								]
							})
						}),
						/* @__PURE__ */ jsxs(Sheet, {
							open: menuOpen,
							onOpenChange: setMenuOpen,
							children: [/* @__PURE__ */ jsx(SheetTrigger, {
								asChild: true,
								children: /* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "icon-lg",
									className: "rounded-full lg:hidden",
									"aria-label": t("nav.menu"),
									children: /* @__PURE__ */ jsx(Menu, {})
								})
							}), /* @__PURE__ */ jsxs(SheetContent, {
								side: "right",
								className: "w-[min(20rem,90vw)]",
								children: [
									/* @__PURE__ */ jsxs(SheetHeader, { children: [/* @__PURE__ */ jsx(SheetTitle, { children: /* @__PURE__ */ jsx(Logo, {}) }), /* @__PURE__ */ jsx(SheetDescription, {
										className: "sr-only",
										children: t("nav.primary")
									})] }),
									/* @__PURE__ */ jsx("nav", {
										"aria-label": t("nav.primary"),
										className: "flex flex-col gap-1 px-4",
										children: navLinks(() => setMenuOpen(false))
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-4 flex flex-wrap items-center gap-2 border-t border-border px-4 pt-4",
										children: [
											/* @__PURE__ */ jsx(LangSwitch, {}),
											/* @__PURE__ */ jsx(ThemeSwitch, {}),
											/* @__PURE__ */ jsxs(Button, {
												variant: "outline",
												className: "h-11 w-full rounded-full",
												onClick: () => {
													setMenuOpen(false);
													setLoginOpen(true);
												},
												children: [/* @__PURE__ */ jsx(UserRound, {}), t("nav.login")]
											})
										]
									})
								]
							})]
						})
					]
				})
			]
		}), !online && /* @__PURE__ */ jsx("div", {
			role: "status",
			className: "border-t border-border bg-raised",
			children: /* @__PURE__ */ jsxs("p", {
				className: "rp-container flex items-center gap-2 py-2 text-sm",
				children: [/* @__PURE__ */ jsx(WifiOff, {
					"aria-hidden": true,
					className: "size-4 text-muted-foreground"
				}), t("offline.banner")]
			})
		})]
	}), /* @__PURE__ */ jsx(LoginDialog, {
		open: loginOpen,
		onOpenChange: setLoginOpen
	})] });
}
function SiteFooter() {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsx("footer", {
		className: "border-t border-border bg-card/40",
		children: /* @__PURE__ */ jsxs("div", {
			className: "rp-container flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "max-w-sm space-y-3",
				children: [
					/* @__PURE__ */ jsx(Logo, {}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-sm text-muted-foreground",
						children: ["Know before you go. · ", /* @__PURE__ */ jsx("span", {
							lang: "hi",
							children: "सफ़र से पहले सुरक्षा की ख़बर"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: t("footer.note")
					})
				]
			}), /* @__PURE__ */ jsx("nav", {
				"aria-label": "Footer",
				className: "flex flex-wrap gap-x-5 gap-y-1",
				children: [
					["footer.about", "about"],
					["footer.privacy", "privacy"],
					["footer.terms", "terms"],
					["footer.accessibility", "accessibility"],
					["footer.contact", "contact"]
				].map(([key, hash]) => /* @__PURE__ */ jsx(Link, {
					to: "/about",
					hash,
					className: "inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground",
					children: t(key)
				}, key))
			})]
		})
	});
}
// src/routes/__root.tsx
var siteName = "RaahPrahari — Know before you go";
var siteDescription = "Check reported road hazards, information freshness, and official restrictions across Uttarakhand before your journey.";
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: siteName },
			{
				name: "description",
				content: siteDescription
			},
			{
				property: "og:title",
				content: siteName
			},
			{
				property: "og:description",
				content: siteDescription
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "theme-color",
				content: "#111719"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&family=Noto+Sans+Devanagari:wght@400;600&family=Oxanium:wght@600;700&display=swap"
			}
		]
	}),
	shellComponent: RootDocument,
	notFoundComponent: NotFoundPage
});
function RootDocument({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		className: "dark",
		style: { colorScheme: "dark" },
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsxs("head", { children: [/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: themeBootScript } }), /* @__PURE__ */ jsx(HeadContent, {})] }), /* @__PURE__ */ jsxs("body", { children: [
			/* @__PURE__ */ jsx(PreferencesProvider, { children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [/* @__PURE__ */ jsx("a", {
				href: "#main",
				className: "sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3",
				children: "Skip to content"
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex min-h-screen flex-col",
				children: [
					/* @__PURE__ */ jsx(SiteHeader, {}),
					/* @__PURE__ */ jsx("main", {
						id: "main",
						className: "flex-1",
						children
					}),
					/* @__PURE__ */ jsx(SiteFooter, {})
				]
			})] }) }),
			/* @__PURE__ */ jsx(Toaster$1, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
// src/routes/index.tsx
var $$splitComponentImporter$1 = () => import("./routes-BnMa5ZOa.js");
var Route$2 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
// src/routes/check.tsx
var $$splitComponentImporter = () => import("./check-DOIBFlRL.js");
var Route$1 = createFileRoute("/check")({
	validateSearch: (s) => ({
		from: typeof s.from === "string" ? s.from : void 0,
		to: typeof s.to === "string" ? s.to : void 0,
		view: s.view === "list" ? "list" : s.view === "map" ? "map" : void 0,
		seg: typeof s.seg === "string" ? s.seg : void 0
	}),
	head: () => ({ meta: [{ title: "Check a road · RaahPrahari" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
// src/routeTree.gen.ts
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	CheckRoute: Route$1.update({
		id: "/check",
		path: "/check",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
// src/router.tsx
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	return createRouter({
		routeTree,
		defaultErrorComponent: RouteErrorPage,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
export { Button as _, useLocalState as a, DEMO_NOW as c, REPORTS as d, RESTRICTIONS as f, segmentById as g, getRouter, placeById as h, STORAGE_KEYS as i, PLACES as l, corridorById as m, Route$1 as n, CORRIDORS as o, SEGMENTS as p, usePrefs as r, COVERAGE_BOUNDS as s, router_exports as t, QUICK_PICKS as u, cn as v };
