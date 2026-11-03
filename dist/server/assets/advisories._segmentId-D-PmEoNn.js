import { t as cn } from "./utils-DWGjSd5x.js";
import { t as Button } from "./button-CFj87KzT.js";
import { l as REPORTS, r as usePrefs } from "./preferences-DeZH5r-v.js";
import { d as getAdvisorySourceTimestamp, i as ActionBadge, s as FreshnessChip, t as advisoryFor } from "./data-B_sSCjD5.js";
import { n as Route$1 } from "./router-AU5llvQE.js";
import { t as AdvisoryCard } from "./advisory-card-ClomHqnB.js";
import { a as SegmentMap, n as StatusTimeline, t as SegmentDetail } from "./segment-detail-B7Gh0SYm.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { ArrowLeft, ArrowUpRight, Camera, CircleHelp, Clock3, FileText, ImageOff, Info, Link2, List, Map, MapPin, Route, Shield, TriangleAlert, UsersRound } from "lucide-react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
// src/components/ui/tabs.tsx
function Tabs({ className, orientation = "horizontal", ...props }) {
	return /* @__PURE__ */ jsx(TabsPrimitive.Root, {
		"data-slot": "tabs",
		"data-orientation": orientation,
		orientation,
		className: cn("group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", className),
		...props
	});
}
var tabsListVariants = cva("group/tabs-list inline-flex min-h-11 w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:min-h-11 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none", {
	variants: { variant: {
		default: "bg-muted",
		line: "gap-1 bg-transparent"
	} },
	defaultVariants: { variant: "default" }
});
function TabsList({ className, variant = "default", ...props }) {
	return /* @__PURE__ */ jsx(TabsPrimitive.List, {
		"data-slot": "tabs-list",
		"data-variant": variant,
		className: cn(tabsListVariants({ variant }), className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ jsx(TabsPrimitive.Trigger, {
		"data-slot": "tabs-trigger",
		className: cn("relative inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent", "data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground", "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ jsx(TabsPrimitive.Content, {
		"data-slot": "tabs-content",
		className: cn("flex-1 outline-none", className),
		...props
	});
}
// src/routes/advisories.$segmentId.tsx?tsr-split=component
function SegmentPage() {
	const data = Route$1.useLoaderData();
	if (data.kind === "report") return /* @__PURE__ */ jsx(HazardDetail, {
		report: data.report,
		segment: data.segment
	});
	return /* @__PURE__ */ jsx(SegmentOverview, { segment: data.segment });
}
function Banner({ segment, title, reportRef }) {
	const { place } = usePrefs();
	return /* @__PURE__ */ jsx("header", {
		className: "relative isolate overflow-hidden border-b border-border bg-[#07151f] text-text-on-charcoal",
		style: {
			backgroundImage: "linear-gradient(90deg, rgb(5 18 27 / 88%), rgb(5 18 27 / 44%)), url('/img/banner-strip.png')",
			backgroundPosition: "center",
			backgroundSize: "cover"
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "rp-container py-5 sm:py-7",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/advisories",
					className: "mb-3 inline-flex min-h-11 w-fit items-center gap-2 text-sm text-blue-on-dark hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring sm:mb-4",
					children: [/* @__PURE__ */ jsx(ArrowLeft, {
						"aria-hidden": true,
						className: "size-4"
					}), "Back to search"]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mb-1.5 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-blue-on-dark",
					children: [
						/* @__PURE__ */ jsx(Route, {
							"aria-hidden": true,
							className: "size-4"
						}),
						"MOUNTAIN ROAD",
						reportRef && /* @__PURE__ */ jsxs("span", {
							className: "font-mono tracking-normal",
							children: ["· ", reportRef]
						})
					]
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "max-w-4xl font-display text-3xl leading-tight font-bold sm:text-4xl md:text-5xl",
					children: title
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-2 text-sm text-text-on-charcoal/85 sm:text-base",
					children: [
						place(segment.from),
						" → ",
						place(segment.to)
					]
				}),
				!reportRef && /* @__PURE__ */ jsx(RouteSummary, { segment })
			]
		})
	});
}
function RouteSummary({ segment }) {
	const { duration } = usePrefs();
	return /* @__PURE__ */ jsxs("dl", {
		className: "mt-5 grid grid-cols-1 gap-y-2 border-t border-white/15 pt-3 text-xs sm:grid-cols-3 sm:text-sm",
		children: [
			/* @__PURE__ */ jsx(SummaryItem, {
				icon: Route,
				label: `${segment.distanceKm} km`
			}),
			/* @__PURE__ */ jsx(SummaryItem, {
				icon: Clock3,
				label: `~ ${duration(segment.typicalMinutes)}`
			}),
			/* @__PURE__ */ jsx(SummaryItem, {
				icon: MapPin,
				label: "Elevation unavailable"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "basis-full text-[11px] text-text-on-charcoal/70",
				children: "All route estimates are illustrative."
			})
		]
	});
}
function SummaryItem({ icon: Icon, label }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-w-0 items-center gap-2 sm:border-r sm:border-white/20 sm:px-3 sm:first:pl-0 sm:last:border-0 sm:last:pr-0",
		children: [
			/* @__PURE__ */ jsx(Icon, {
				"aria-hidden": true,
				className: "size-4 shrink-0 text-blue-on-dark"
			}),
			/* @__PURE__ */ jsx("dt", {
				className: "sr-only",
				children: "Illustrative route estimate"
			}),
			/* @__PURE__ */ jsxs("dd", { children: [
				label,
				" ",
				/* @__PURE__ */ jsx("span", {
					className: "text-text-on-charcoal/65",
					children: "(illustrative)"
				})
			] })
		]
	});
}
function SegmentOverview({ segment }) {
	const { place, stamp } = usePrefs();
	const [tab, setTab] = useState("overview");
	const advisory = advisoryFor(segment.id);
	if (!advisory) throw new Error(`Missing advisory for segment "${segment.id}"`);
	const reports = REPORTS.filter((report) => report.segmentId === segment.id && report.status !== "duplicate" && report.status !== "rejected");
	const hazards = reports.filter((report) => report.kind === "hazard");
	const sourceTimestamp = getAdvisorySourceTimestamp(advisory);
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ jsx(Banner, {
			segment,
			title: `${segment.code.split(" · ")[0]} — ${place(segment.from)} to ${place(segment.to)}`
		}), /* @__PURE__ */ jsxs("main", {
			className: "rp-container grid gap-5 py-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(19rem,0.8fr)] lg:py-6",
			children: [/* @__PURE__ */ jsx("div", {
				className: "min-w-0",
				children: /* @__PURE__ */ jsxs(Tabs, {
					value: tab,
					onValueChange: setTab,
					className: "min-w-0",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "overflow-x-auto border-b border-border",
							children: /* @__PURE__ */ jsxs(TabsList, {
								"aria-label": "Road information",
								variant: "line",
								className: "min-w-max gap-2 rounded-none p-0",
								children: [
									/* @__PURE__ */ jsx(TabsTrigger, {
										value: "overview",
										className: "min-w-28 rounded-none px-4 data-[state=active]:text-blue-on-dark",
										children: "Overview"
									}),
									/* @__PURE__ */ jsx(TabsTrigger, {
										value: "hazards",
										className: "min-w-28 rounded-none px-4 data-[state=active]:text-blue-on-dark",
										children: "Hazards"
									}),
									/* @__PURE__ */ jsx(TabsTrigger, {
										value: "conditions",
										className: "min-w-28 rounded-none px-4 data-[state=active]:text-blue-on-dark",
										children: "Conditions"
									})
								]
							})
						}),
						/* @__PURE__ */ jsxs(TabsContent, {
							value: "overview",
							className: "pt-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 sm:grid-cols-5",
								children: [
									/* @__PURE__ */ jsx(SegmentDetail, {
										segmentId: segment.id,
										variant: "overview",
										className: "sm:col-span-3"
									}),
									/* @__PURE__ */ jsxs(InfoCard, {
										title: "Information freshness",
										icon: Clock3,
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ jsx(FreshnessChip, { sourceTimestamp }), /* @__PURE__ */ jsxs("dl", {
											className: "mt-3 space-y-2 text-xs",
											children: [/* @__PURE__ */ jsx(Fact, {
												label: "Last updated",
												value: sourceTimestamp ? stamp(sourceTimestamp) : "Unknown",
												icon: Link2
											}), /* @__PURE__ */ jsx(Fact, {
												label: "Source",
												value: "Community reports and official sources",
												icon: UsersRound
											})]
										})]
									}),
									/* @__PURE__ */ jsx(InfoCard, {
										title: "Available community reports",
										icon: UsersRound,
										className: "sm:col-span-3",
										children: /* @__PURE__ */ jsxs("div", {
											className: "grid gap-2 min-[430px]:grid-cols-2",
											children: [/* @__PURE__ */ jsx(CountLink, {
												count: hazards.length,
												label: "Hazards reported",
												icon: TriangleAlert,
												onClick: () => setTab("hazards")
											}), /* @__PURE__ */ jsx(CountLink, {
												count: reports.length,
												label: "Total reports",
												icon: FileText,
												onClick: () => setTab("hazards")
											})]
										})
									}),
									/* @__PURE__ */ jsx(OfficialRestrictionCard, {
										segmentId: segment.id,
										className: "sm:col-span-2"
									}),
									/* @__PURE__ */ jsx(InfoCard, {
										title: "Source information",
										icon: Link2,
										className: "sm:col-span-5",
										children: /* @__PURE__ */ jsxs("dl", {
											className: "grid gap-3 text-xs sm:grid-cols-3",
											children: [
												/* @__PURE__ */ jsx(Fact, {
													label: "Source",
													value: "Submitted by community contributors",
													icon: UsersRound
												}),
												/* @__PURE__ */ jsx(Fact, {
													label: "Last updated",
													value: sourceTimestamp ? stamp(sourceTimestamp) : "Unknown",
													icon: Clock3
												}),
												/* @__PURE__ */ jsx(Fact, {
													label: "Information note",
													value: "Community reports are not official restrictions.",
													icon: Info
												})
											]
										})
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ jsx(Button, {
									asChild: true,
									className: "bg-brand-blue text-white hover:bg-brand-blue/90",
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/map",
										search: { seg: segment.id },
										children: [
											/* @__PURE__ */ jsx(Map, { "aria-hidden": true }),
											"View on map",
											/* @__PURE__ */ jsx(ArrowUpRight, { "aria-hidden": true })
										]
									})
								}), /* @__PURE__ */ jsx(Button, {
									asChild: true,
									className: "bg-brand-orange text-white hover:bg-brand-orange/90",
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/report",
										search: { segment: segment.id },
										children: [/* @__PURE__ */ jsx(TriangleAlert, { "aria-hidden": true }), "Report a hazard"]
									})
								})]
							})]
						}),
						/* @__PURE__ */ jsx(TabsContent, {
							value: "hazards",
							className: "space-y-3 pt-4",
							children: hazards.length ? hazards.map((report) => /* @__PURE__ */ jsx(AdvisoryCard, {
								segment,
								communityReport: report,
								variant: "community-report"
							}, report.ref)) : /* @__PURE__ */ jsx(EmptyPanel, {
								title: "No community hazard reports",
								message: "This means no report is available here; it does not establish road conditions."
							})
						}),
						/* @__PURE__ */ jsxs(TabsContent, {
							value: "conditions",
							className: "space-y-3 pt-4",
							children: [
								/* @__PURE__ */ jsxs(InfoCard, {
									title: "Information freshness",
									icon: Clock3,
									children: [/* @__PURE__ */ jsx(FreshnessChip, { sourceTimestamp }), /* @__PURE__ */ jsx("p", {
										className: "mt-3 text-sm text-muted-foreground",
										children: "Freshness reflects the age of the most recent available source timestamp, not a road-safety assessment."
									})]
								}),
								/* @__PURE__ */ jsx(OfficialRestrictionCard, { segmentId: segment.id }),
								/* @__PURE__ */ jsx(InfoCard, {
									title: "Community information",
									icon: UsersRound,
									children: /* @__PURE__ */ jsx("p", {
										className: "text-sm",
										children: "Submitted by community contributors. Community reports do not establish an official restriction."
									})
								})
							]
						})
					]
				})
			}), /* @__PURE__ */ jsx(TerrainPanel, {
				segment,
				reports: hazards
			})]
		})]
	});
}
function InfoCard({ title, icon: Icon, className, children }) {
	return /* @__PURE__ */ jsxs("section", {
		className: cn("rounded-lg border border-border bg-card p-3 sm:p-4", className),
		children: [/* @__PURE__ */ jsxs("h2", {
			className: "mb-3 flex items-center gap-2 text-sm font-semibold",
			children: [/* @__PURE__ */ jsx(Icon, {
				"aria-hidden": true,
				className: "size-5 shrink-0 text-blue-on-dark"
			}), title]
		}), children]
	});
}
function Fact({ label, value, icon: Icon }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-w-0 items-start gap-2",
		children: [/* @__PURE__ */ jsx(Icon, {
			"aria-hidden": true,
			className: "mt-0.5 size-4 shrink-0 text-muted-foreground"
		}), /* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ jsx("dt", {
				className: "text-[11px] text-muted-foreground",
				children: label
			}), /* @__PURE__ */ jsx("dd", {
				className: "break-words text-xs font-medium",
				children: value
			})]
		})]
	});
}
function CountLink({ count, label, icon: Icon, onClick }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick,
		className: "flex min-h-16 items-center gap-3 rounded-lg border border-border bg-background/50 px-3 text-left hover:border-blue-on-dark/60 focus-visible:outline-2 focus-visible:outline-ring",
		children: [
			/* @__PURE__ */ jsx(Icon, {
				"aria-hidden": true,
				className: "size-5 shrink-0 text-orange-on-dark"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-lg font-semibold tabular-nums",
				children: count
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-xs text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ jsx(ArrowUpRight, {
				"aria-hidden": true,
				className: "ml-auto size-4 text-muted-foreground"
			})
		]
	});
}
function OfficialRestrictionCard({ segmentId, className }) {
	const advisory = advisoryFor(segmentId);
	if (!advisory) throw new Error(`Missing advisory for segment "${segmentId}"`);
	return /* @__PURE__ */ jsxs("section", {
		className: cn("rounded-lg border border-border bg-card p-3 sm:p-4", className),
		children: [/* @__PURE__ */ jsxs("h2", {
			className: "mb-3 flex items-center gap-2 text-sm font-semibold",
			children: [/* @__PURE__ */ jsx(Shield, {
				"aria-hidden": true,
				className: "size-5 text-status-official"
			}), "Official restrictions"]
		}), advisory.restriction ? /* @__PURE__ */ jsxs("div", {
			className: "rounded-md border border-status-official/50 bg-status-official/10 p-3",
			children: [/* @__PURE__ */ jsx("p", {
				className: "font-semibold",
				children: advisory.restriction.title
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: advisory.restriction.issuingAuthority
			})]
		}) : /* @__PURE__ */ jsxs("p", {
			className: "flex items-center gap-2 rounded-md border border-status-unknown/40 bg-status-unknown/10 p-3 text-sm",
			children: [
				/* @__PURE__ */ jsx(CircleHelp, {
					"aria-hidden": true,
					className: "size-4 shrink-0 text-status-unknown"
				}),
				"No current official information",
				/* @__PURE__ */ jsx("span", {
					className: "ml-auto text-[11px] text-status-unknown",
					children: "UNKNOWN"
				})
			]
		})]
	});
}
function TerrainPanel({ segment, reports }) {
	const { t, place } = usePrefs();
	const [view, setView] = useState("map");
	return /* @__PURE__ */ jsx("aside", {
		className: "min-w-0 lg:sticky lg:top-20 lg:self-start",
		"aria-label": "Route map and community reports",
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative min-h-[360px] overflow-hidden rounded-xl border border-border bg-[#0b2531] sm:min-h-[440px] lg:min-h-[510px]",
			children: [
				view === "map" ? /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsx("img", {
						src: "/img/map-terrain.png",
						alt: "",
						className: "absolute inset-0 size-full object-cover opacity-70"
					}),
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#07151f]/20" }),
					/* @__PURE__ */ jsx(SegmentMap, {
						terrain: true,
						highlight: [segment.id],
						selectedSegmentId: segment.id,
						endpoints: [segment.from, segment.to],
						labelPlaces: [segment.from, segment.to],
						className: "absolute inset-0"
					})
				] }) : /* @__PURE__ */ jsxs("div", {
					className: "relative z-10 h-full min-h-[360px] overflow-y-auto bg-background/95 p-4 sm:min-h-[440px] lg:min-h-[510px]",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "mb-3 font-semibold",
						children: "Community hazard reports"
					}), reports.length ? /* @__PURE__ */ jsx("ul", {
						className: "space-y-2",
						children: reports.map((report) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
							to: "/advisories/$segmentId",
							params: { segmentId: report.ref },
							className: "block rounded-lg border border-border bg-card p-3 hover:border-blue-on-dark/60 focus-visible:outline-2 focus-visible:outline-ring",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-2 text-sm font-semibold",
								children: [/* @__PURE__ */ jsx(TriangleAlert, {
									"aria-hidden": true,
									className: "size-4 text-orange-on-dark"
								}), t(`hazard.${report.hazardType}`)]
							}), /* @__PURE__ */ jsxs("span", {
								className: "mt-1 block text-xs text-muted-foreground",
								children: [
									report.landmark,
									" · ",
									place(segment.from),
									"–",
									place(segment.to)
								]
							})]
						}) }, report.ref))
					}) : /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: "No community hazard reports are available."
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute top-3 right-3 z-20 inline-flex rounded-lg border border-white/20 bg-[#07151f]/85 p-1",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						"aria-pressed": view === "map",
						onClick: () => setView("map"),
						className: cn("inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-xs", view === "map" ? "bg-brand-blue text-white" : "text-white/75 hover:text-white"),
						children: [/* @__PURE__ */ jsx(Map, {
							"aria-hidden": true,
							className: "size-3.5"
						}), " Map"]
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						"aria-pressed": view === "list",
						onClick: () => setView("list"),
						className: cn("inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-xs", view === "list" ? "bg-brand-blue text-white" : "text-white/75 hover:text-white"),
						children: [/* @__PURE__ */ jsx(List, {
							"aria-hidden": true,
							className: "size-3.5"
						}), " List"]
					})]
				}),
				/* @__PURE__ */ jsxs("ul", {
					className: "absolute inset-x-2 bottom-2 z-20 grid grid-cols-3 gap-1 rounded-lg border border-white/15 bg-[#07151f]/90 p-2 text-[10px] text-white sm:inset-x-3 sm:bottom-3 sm:gap-2 sm:p-3 sm:text-xs",
					children: [
						/* @__PURE__ */ jsx(LegendItem, {
							icon: TriangleAlert,
							label: "Reported hazard"
						}),
						/* @__PURE__ */ jsx(LegendItem, {
							icon: Shield,
							label: "Official restriction"
						}),
						/* @__PURE__ */ jsx(LegendItem, {
							icon: CircleHelp,
							label: "Unknown information"
						})
					]
				})
			]
		})
	});
}
function LegendItem({ icon: Icon, label }) {
	return /* @__PURE__ */ jsxs("li", {
		className: "flex min-w-0 items-center justify-center gap-1 border-r border-white/15 px-1 last:border-0 sm:gap-2",
		children: [/* @__PURE__ */ jsx(Icon, {
			"aria-hidden": true,
			className: "size-4 shrink-0 text-blue-on-dark"
		}), /* @__PURE__ */ jsx("span", {
			className: "text-center",
			children: label
		})]
	});
}
function HazardDetail({ report, segment }) {
	const { t, place, stamp, ago } = usePrefs();
	const level = report.severity === "high" ? "avoid" : "caution";
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-8",
		children: [/* @__PURE__ */ jsx(Banner, {
			segment,
			title: `${t(`hazard.${report.hazardType}`)} report`,
			reportRef: report.ref
		}), /* @__PURE__ */ jsxs("main", {
			className: "rp-container grid gap-5 py-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:py-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("section", {
						className: "rounded-xl border border-border bg-card p-4 sm:p-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-start justify-between gap-3",
								children: [/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("p", {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Community report, not an official closure"
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "mt-1 font-display text-2xl font-bold",
										children: t(`hazard.${report.hazardType}`)
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-2 text-sm text-muted-foreground",
										children: report.description
									})
								] }), /* @__PURE__ */ jsx(ActionBadge, {
									level,
									size: "lg"
								})]
							}),
							/* @__PURE__ */ jsx(ReportGallery, { report }),
							/* @__PURE__ */ jsx("h3", {
								className: "mb-2 mt-4 text-sm font-semibold",
								children: "Report facts"
							}),
							/* @__PURE__ */ jsxs("dl", {
								className: "grid gap-x-5 gap-y-3 text-sm sm:grid-cols-2",
								children: [
									/* @__PURE__ */ jsx(Fact, {
										label: "Hazard type",
										value: t(`hazard.${report.hazardType}`),
										icon: TriangleAlert
									}),
									/* @__PURE__ */ jsx(Fact, {
										label: "Road segment",
										value: `${segment.code} · ${place(segment.from)} to ${place(segment.to)}`,
										icon: Route
									}),
									/* @__PURE__ */ jsx(Fact, {
										label: "Observation time",
										value: `${ago(report.observedAt)} · ${stamp(report.observedAt)}`,
										icon: Clock3
									}),
									/* @__PURE__ */ jsx(Fact, {
										label: "Report submission time",
										value: `${ago(report.receivedAt)} · ${stamp(report.receivedAt)}`,
										icon: FileText
									}),
									/* @__PURE__ */ jsx(Fact, {
										label: "Source",
										value: "Submitted by community contributors",
										icon: UsersRound
									}),
									/* @__PURE__ */ jsx(Fact, {
										label: "Location accuracy",
										value: `${report.locationConfidence} confidence`,
										icon: MapPin
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ jsx("dt", {
											className: "mb-1 text-xs text-muted-foreground",
											children: "Information freshness"
										}), /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx(FreshnessChip, { sourceTimestamp: report.observedAt }) })]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsx(StatusTimeline, {
						report,
						level
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ jsx(Button, {
							asChild: true,
							className: "bg-brand-blue text-white hover:bg-brand-blue/90",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/map",
								search: { seg: segment.id },
								children: [/* @__PURE__ */ jsx(Map, { "aria-hidden": true }), " View on map"]
							})
						}), /* @__PURE__ */ jsx(Button, {
							asChild: true,
							className: "bg-brand-orange text-white hover:bg-brand-orange/90",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/report",
								search: { segment: segment.id },
								children: [/* @__PURE__ */ jsx(TriangleAlert, { "aria-hidden": true }), " Report an update"]
							})
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "border-t border-border pt-3 text-xs text-muted-foreground",
						children: "This is a community-reported hazard and has not been independently confirmed."
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-4 lg:sticky lg:top-20 lg:self-start",
				children: [
					/* @__PURE__ */ jsx(OfficialRestrictionCard, { segmentId: segment.id }),
					/* @__PURE__ */ jsxs("section", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ jsxs("h2", {
								className: "mb-3 flex items-center gap-2 text-sm font-semibold",
								children: [
									/* @__PURE__ */ jsx(MapPin, {
										"aria-hidden": true,
										className: "size-5 text-blue-on-dark"
									}),
									" ",
									"Location"
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: report.landmark
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									place(segment.from),
									" to ",
									place(segment.to)
								]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									"Location accuracy: ",
									report.locationConfidence,
									" confidence"
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative mt-3 h-44 overflow-hidden rounded-lg border border-border",
								children: [/* @__PURE__ */ jsx("img", {
									src: "/img/map-terrain.png",
									alt: "",
									className: "size-full object-cover"
								}), /* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 grid place-items-center bg-[#07151f]/55 text-center",
									children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CircleHelp, {
										"aria-hidden": true,
										className: "mx-auto size-7 text-status-unknown"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-xs text-white",
										children: "Coordinates unavailable"
									})] })
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "rounded-lg border border-status-unknown/40 bg-status-unknown/10 p-3 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ jsx(Info, {
							"aria-hidden": true,
							className: "mr-1 inline size-4 align-text-bottom"
						}), "The community report and any official restriction are shown as separate information."]
					})
				]
			})]
		})]
	});
}
function ReportGallery({ report }) {
	const imageCount = Math.min(report.photoCount, 4);
	return /* @__PURE__ */ jsx("section", {
		"aria-label": "Community report image gallery",
		className: "mt-4",
		children: imageCount > 0 ? /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
			children: Array.from({ length: imageCount }, (_, index) => /* @__PURE__ */ jsx("div", {
				className: "grid min-h-24 place-items-center rounded-lg border border-dashed border-border bg-background/70 p-3 text-center",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(ImageOff, {
					"aria-hidden": true,
					className: "mx-auto size-5 text-muted-foreground"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-[10px] text-muted-foreground",
					children: "Community image unavailable in demo"
				})] })
			}, index))
		}) : /* @__PURE__ */ jsxs("p", {
			className: "rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ jsx(Camera, {
				"aria-hidden": true,
				className: "mr-1 inline size-4 align-text-bottom"
			}), "No images were submitted with this report."]
		})
	});
}
function EmptyPanel({ title, message }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-dashed border-border p-5 text-center",
		children: [
			/* @__PURE__ */ jsx(CircleHelp, {
				"aria-hidden": true,
				className: "mx-auto size-6 text-status-unknown"
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-2 font-semibold",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: message
			})
		]
	});
}
export { SegmentPage as component };
