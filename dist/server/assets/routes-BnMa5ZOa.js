import { _ as Button, g as segmentById, p as SEGMENTS, r as usePrefs } from "./router-BPRhBg53.js";
import { a as AdvisoryBadge, c as OfficialBadge, i as RouteSearchCard, l as RoadCode, o as DemoBadge, t as advisoryFor, u as StaleBadge } from "./data-BsUs-u2H.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, ClipboardCheck, Clock, Eye, MessageSquareWarning, Radio, Ruler, ShieldCheck, TriangleAlert } from "lucide-react";
// src/routes/index.tsx?tsr-split=component
var heroSrc = (w) => `/.netlify/images?url=/img/hero-road.png&w=${w}&fm=webp&q=70`;
function Home() {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Hero, {}),
		/* @__PURE__ */ jsx(CheckYourRoad, {}),
		/* @__PURE__ */ jsx("section", {
			"aria-labelledby": "flow-title",
			className: "border-y border-border bg-card/50",
			children: /* @__PURE__ */ jsxs("div", {
				className: "rp-container py-16 md:py-20",
				children: [/* @__PURE__ */ jsx("h2", {
					id: "flow-title",
					className: "font-display text-3xl font-bold md:text-4xl",
					children: t("s2.title")
				}), /* @__PURE__ */ jsx("ol", {
					className: "mt-10 grid gap-4 md:grid-cols-3",
					children: [
						{
							icon: MessageSquareWarning,
							title: t("s2.step1"),
							body: t("s2.step1Body")
						},
						{
							icon: ClipboardCheck,
							title: t("s2.step2"),
							body: t("s2.step2Body")
						},
						{
							icon: Radio,
							title: t("s2.step3"),
							body: t("s2.step3Body")
						}
					].map((s, i) => /* @__PURE__ */ jsxs("li", {
						className: "relative rounded-2xl border border-border bg-card p-6",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "font-mono text-xs text-muted-foreground",
								children: ["0", i + 1]
							}),
							/* @__PURE__ */ jsx(s.icon, {
								"aria-hidden": true,
								className: "mt-4 size-7 text-brand-orange"
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "mt-4 font-display text-xl font-semibold",
								children: s.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-muted-foreground",
								children: s.body
							}),
							i < 2 && /* @__PURE__ */ jsx(ArrowRight, {
								"aria-hidden": true,
								className: "absolute top-1/2 -right-5 z-10 hidden size-6 -translate-y-1/2 text-muted-foreground md:block"
							})
						]
					}, s.title))
				})]
			})
		}),
		/* @__PURE__ */ jsx(LocalKnowledge, {}),
		/* @__PURE__ */ jsx("section", {
			"aria-labelledby": "final-title",
			className: "rp-container py-16 md:py-20",
			children: /* @__PURE__ */ jsxs("div", {
				className: "rounded-3xl border border-border bg-card p-8 md:p-12",
				children: [
					/* @__PURE__ */ jsx("h2", {
						id: "final-title",
						className: "font-display text-3xl font-bold",
						children: t("final.title")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-4 max-w-2xl text-lg text-muted-foreground",
						children: t("final.body")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-sm font-medium",
						children: t("copy.noReportNotSafe")
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ jsx(Button, {
							asChild: true,
							className: "h-12 rounded-xl px-6 text-base font-semibold",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/check",
								search: { view: "map" },
								children: [t("search.submit"), /* @__PURE__ */ jsx(ArrowRight, {})]
							})
						}), /* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							className: "h-12 rounded-xl px-6 text-base",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/report",
								children: [/* @__PURE__ */ jsx(TriangleAlert, {}), t("hero.report")]
							})
						})]
					})
				]
			})
		})
	] });
}
function Hero() {
	const { t, lang } = usePrefs();
	return /* @__PURE__ */ jsxs("section", {
		"aria-labelledby": "hero-title",
		className: "relative isolate overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("img", {
				src: heroSrc(1600),
				srcSet: `${heroSrc(800)} 800w, ${heroSrc(1280)} 1280w, ${heroSrc(1920)} 1920w`,
				sizes: "100vw",
				alt: "",
				fetchPriority: "high",
				className: "absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center]"
			}),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-to-r from-[#111719] via-[#111719]/85 to-[#111719]/35" }),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent" }),
			/* @__PURE__ */ jsxs("div", {
				className: "rp-container grid gap-10 pt-12 pb-16 md:pt-20 md:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-start",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-[#E6E4DC]",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "inline-flex items-center gap-2 rounded-full border border-[#E6E4DC]/25 bg-[#111719]/50 px-3 py-1 text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								"aria-hidden": true,
								className: "size-1.5 rounded-full bg-brand-orange"
							}), t("hero.eyebrow")]
						}),
						/* @__PURE__ */ jsx("h1", {
							id: "hero-title",
							className: "mt-6 font-display text-5xl leading-[1.02] font-bold sm:text-6xl xl:text-7xl",
							children: t("hero.title")
						}),
						lang === "en" && /* @__PURE__ */ jsx("p", {
							lang: "hi",
							className: "mt-3 text-xl font-semibold text-[#F4D6A6] sm:text-2xl",
							style: { fontFamily: "'Noto Sans Devanagari', sans-serif" },
							children: "सफ़र से पहले सुरक्षा की ख़बर"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-5 max-w-xl text-lg text-[#E6E4DC]/85",
							children: t("hero.body")
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-7 flex flex-wrap gap-3",
							children: /* @__PURE__ */ jsx(Button, {
								asChild: true,
								variant: "outline",
								className: "h-12 rounded-xl border-[#E6E4DC]/40 bg-[#111719]/40 px-5 text-base text-[#E6E4DC] hover:bg-[#111719]/70 hover:text-[#E6E4DC]",
								children: /* @__PURE__ */ jsxs(Link, {
									to: "/report",
									children: [/* @__PURE__ */ jsx(TriangleAlert, {}), t("hero.report")]
								})
							})
						}),
						/* @__PURE__ */ jsx(SampleAdvisory, {})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-3xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-sm sm:p-7",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-5 flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display text-xl font-semibold",
							children: t("search.title")
						}), /* @__PURE__ */ jsx(DemoBadge, {})]
					}), /* @__PURE__ */ jsx(RouteSearchCard, {})]
				})]
			})
		]
	});
}
function SampleAdvisory() {
	const { t, place, ago } = usePrefs();
	const seg = segmentById("nh7-06");
	const a = advisoryFor(seg.id);
	return /* @__PURE__ */ jsxs(Link, {
		to: "/check",
		search: {
			view: "map",
			seg: seg.id
		},
		className: "mt-10 block max-w-md rounded-2xl border border-[#465056] bg-[#272A2D]/90 p-4 text-[#E6E4DC] transition-colors hover:border-[#B7BCB9]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-xs font-semibold tracking-wider text-[#B7BCB9] uppercase",
					children: t("hero.sample")
				}), /* @__PURE__ */ jsx("span", {
					className: "font-mono text-[10px] text-[#B7BCB9] uppercase",
					children: t("demo.badge")
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-2 flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
					className: "font-mono text-xs text-[#B7BCB9]",
					children: [
						seg.code,
						" · km ",
						seg.kmStart,
						"–",
						seg.kmEnd
					]
				}), /* @__PURE__ */ jsxs("p", {
					className: "font-semibold",
					children: [
						place(seg.from),
						" – ",
						place(seg.to)
					]
				})] }), /* @__PURE__ */ jsx("span", {
					className: "dark",
					children: /* @__PURE__ */ jsx(AdvisoryBadge, { level: a.level })
				})]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 flex items-center gap-1.5 text-sm text-[#B7BCB9]",
				children: [
					/* @__PURE__ */ jsx(ShieldCheck, {
						"aria-hidden": true,
						className: "size-4 text-[#92C5FF]"
					}),
					a.restriction && t(`restriction.${a.restriction.type}`),
					" · ",
					a.latestObservationAt && ago(a.latestObservationAt)
				]
			}),
			a.awaitingClearance && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs text-[#B7BCB9]",
				children: t("copy.awaitingClearance")
			})
		]
	});
}
function CheckYourRoad() {
	const { t, place } = usePrefs();
	const nh7 = SEGMENTS.filter((s) => s.corridorId === "nh7");
	const points = [
		{
			icon: TriangleAlert,
			label: t("s1.a")
		},
		{
			icon: Clock,
			label: t("s1.b")
		},
		{
			icon: ShieldCheck,
			label: t("s1.c")
		},
		{
			icon: Ruler,
			label: t("s1.d")
		}
	];
	return /* @__PURE__ */ jsxs("section", {
		"aria-labelledby": "check-title",
		className: "rp-container grid gap-10 py-16 md:py-20 lg:grid-cols-2 lg:items-center",
		children: [/* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx("h2", {
				id: "check-title",
				className: "font-display text-3xl font-bold md:text-4xl",
				children: t("s1.title")
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-4 text-lg text-muted-foreground",
				children: t("s1.body")
			}),
			/* @__PURE__ */ jsx("ul", {
				className: "mt-8 grid gap-3 sm:grid-cols-2",
				children: points.map((p) => /* @__PURE__ */ jsxs("li", {
					className: "flex items-start gap-3 rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ jsx(p.icon, {
						"aria-hidden": true,
						className: "mt-0.5 size-5 shrink-0 text-brand-orange"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-sm font-medium",
						children: p.label
					})]
				}, p.label))
			})
		] }), /* @__PURE__ */ jsxs("div", {
			className: "rounded-2xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-4 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ jsxs("p", {
						className: "flex items-baseline gap-2",
						children: [/* @__PURE__ */ jsx(RoadCode, {
							className: "text-sm",
							children: "NH-7"
						}), /* @__PURE__ */ jsxs("span", {
							className: "font-semibold",
							children: [
								place("rishikesh"),
								" – ",
								place("badrinath")
							]
						})]
					}), /* @__PURE__ */ jsx(DemoBadge, {})]
				}),
				/* @__PURE__ */ jsx("ol", {
					className: "space-y-1.5",
					children: nh7.map((s) => {
						const a = advisoryFor(s.id);
						return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
							to: "/check",
							search: {
								from: "rishikesh",
								to: "badrinath",
								view: "list",
								seg: s.id
							},
							className: "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-accent",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "block font-mono text-[11px] text-muted-foreground",
									children: [
										"km ",
										s.kmStart,
										"–",
										s.kmEnd
									]
								}), /* @__PURE__ */ jsxs("span", {
									className: "block truncate text-sm font-medium",
									children: [
										place(s.from),
										" – ",
										place(s.to)
									]
								})]
							}), /* @__PURE__ */ jsxs("span", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [
									a.restriction && /* @__PURE__ */ jsx(ShieldCheck, {
										"aria-label": t("level.official"),
										className: "size-4 text-status-official"
									}),
									a.stale && /* @__PURE__ */ jsx(StaleBadge, {}),
									/* @__PURE__ */ jsx(AdvisoryBadge, { level: a.level })
								]
							})]
						}) }, s.id);
					})
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 border-t border-border pt-3 text-xs text-muted-foreground",
					children: t("copy.estimate")
				})
			]
		})]
	});
}
function LocalKnowledge() {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("section", {
		"aria-labelledby": "local-title",
		className: "rp-container grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_1fr] lg:items-center",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "order-2 grid gap-3 sm:grid-cols-2 lg:order-1",
			children: [
				/* @__PURE__ */ jsx(StateCard, {
					badge: /* @__PURE__ */ jsx(OfficialBadge, { label: t("restriction.road_closed") }),
					text: t("copy.awaitingClearance")
				}),
				/* @__PURE__ */ jsx(StateCard, {
					badge: /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs font-medium",
						children: [/* @__PURE__ */ jsx(Eye, {
							"aria-hidden": true,
							className: "size-3.5"
						}), t("copy.notOfficial")]
					}),
					text: t("copy.communityUnverified")
				}),
				/* @__PURE__ */ jsx(StateCard, {
					badge: /* @__PURE__ */ jsx(AdvisoryBadge, { level: "unknown" }),
					text: t("copy.noRecent")
				}),
				/* @__PURE__ */ jsx(StateCard, {
					badge: /* @__PURE__ */ jsx(StaleBadge, { age: "40 h" }),
					text: t("s3.c")
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "order-1 lg:order-2",
			children: [
				/* @__PURE__ */ jsx("h2", {
					id: "local-title",
					className: "font-display text-3xl font-bold md:text-4xl",
					children: t("s3.title")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-4 text-lg text-muted-foreground",
					children: t("s3.body")
				}),
				/* @__PURE__ */ jsx("ul", {
					className: "mt-6 space-y-3",
					children: [
						t("s3.a"),
						t("s3.b"),
						t("s3.c")
					].map((p) => /* @__PURE__ */ jsxs("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ jsx("span", {
							"aria-hidden": true,
							className: "mt-2 size-1.5 shrink-0 rounded-full bg-brand-orange"
						}), p]
					}, p))
				})
			]
		})]
	});
}
function StateCard({ badge, text }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl border border-border bg-card p-5",
		children: [badge, /* @__PURE__ */ jsx("p", {
			className: "mt-3 text-sm text-muted-foreground",
			children: text
		})]
	});
}
export { Home as component };
