import { a as cn } from "./storage-wbzgXpjQ.js";
import { t as Button } from "./button-DxFltwjo.js";
import { m as segmentById, n as themeBootScript, r as usePrefs, t as PreferencesProvider } from "./preferences-Bu-IUfe0.js";
import { useEffect, useState } from "react";
import { HeadContent, Link, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent, notFound, useRouter, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, CircleCheck, CircleCheckIcon, CircleQuestionMark, Clock, FlaskConical, House, InfoIcon, ListChecks, Loader2Icon, Map as Map$1, Menu, Monitor, Moon, OctagonAlert, OctagonX, OctagonXIcon, Search, ShieldCheck, Sun, TriangleAlert, TriangleAlertIcon, UserRound, WifiOff, XIcon } from "lucide-react";
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
// src/components/ui/feedback.tsx
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
				className: "absolute top-2 right-2 grid size-11 place-items-center rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
		className: "inline-flex h-11 rounded-full border border-border p-0.5 text-sm",
		children: ["en", "hi"].map((l) => /* @__PURE__ */ jsx("button", {
			type: "button",
			"aria-pressed": lang === l,
			onClick: () => setLang(l),
			lang: l,
			className: cn("min-h-11 min-w-11 rounded-full px-2.5 font-medium transition-colors", lang === l ? "bg-raised text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
			children: l === "en" ? "EN" : "हिन्दी"
		}, l))
	});
}
function ThemeSwitch() {
	const { theme, setTheme, t } = usePrefs();
	const next = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
	const label = next === "system" ? t("theme.useSystem") : next === "light" ? t("theme.light") : t("theme.dark");
	return /* @__PURE__ */ jsx(Button, {
		variant: "ghost",
		size: "icon-lg",
		className: "rounded-full",
		onClick: () => setTheme(next),
		"aria-label": label,
		title: t("theme.toggle"),
		children: theme === "system" ? /* @__PURE__ */ jsx(Monitor, {}) : theme === "dark" ? /* @__PURE__ */ jsx(Sun, {}) : /* @__PURE__ */ jsx(Moon, {})
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
	const linkClass = (active) => cn("relative inline-flex min-h-11 items-center rounded-none px-3.5 text-sm font-medium transition-colors after:absolute after:right-3 after:bottom-0 after:left-3 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-orange after:transition-transform", active ? "text-foreground after:scale-x-100" : "text-muted-foreground hover:text-foreground");
	const current = (active) => active ? "page" : void 0;
	const isMap = pathname === "/map" || pathname === "/check" && view !== "list";
	const isList = pathname === "/advisories" || pathname === "/advisories/" || pathname.startsWith("/advisories/") || pathname === "/check" && view === "list";
	const isHome = pathname === "/";
	const navLinks = (onClick) => /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Link, {
			to: "/",
			onClick,
			"aria-current": current(pathname === "/"),
			className: linkClass(pathname === "/"),
			children: t("nav.home")
		}),
		/* @__PURE__ */ jsx(Link, {
			to: "/map",
			onClick,
			"aria-current": current(isMap),
			className: linkClass(isMap),
			children: t("nav.map")
		}),
		/* @__PURE__ */ jsx(Link, {
			to: "/advisories",
			onClick,
			"aria-current": current(isList),
			className: linkClass(isList),
			children: t("nav.advisories")
		}),
		isHome ? /* @__PURE__ */ jsx(Link, {
			to: "/about",
			onClick,
			className: linkClass(false),
			children: t("nav.about")
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, {
			to: "/traveller",
			onClick,
			"aria-current": current(pathname === "/traveller"),
			className: linkClass(pathname === "/traveller"),
			children: t("nav.traveller")
		}), /* @__PURE__ */ jsx(Link, {
			to: "/help",
			onClick,
			"aria-current": current(pathname === "/help"),
			className: linkClass(pathname === "/help"),
			children: t("nav.help")
		})] })
	] });
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("header", {
			className: cn("sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md", isHome && "home-header"),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "rp-container flex h-16 items-center gap-3",
				children: [
					/* @__PURE__ */ jsxs(Link, {
						to: "/",
						className: "mr-2 rounded-md",
						"aria-label": "RaahPrahari — home",
						children: [/* @__PURE__ */ jsxs("span", {
							className: cn("home-brand", !isHome && "hidden"),
							children: [/* @__PURE__ */ jsx(Logo, {}), /* @__PURE__ */ jsx("span", {
								lang: "hi",
								children: "सफ़र से पहले सुरक्षा की ख़बर"
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: cn(isHome && "hidden"),
							children: /* @__PURE__ */ jsx(Logo, {})
						})]
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
									isHome ? /* @__PURE__ */ jsx(HomeLanguageSelect, {}) : /* @__PURE__ */ jsx(LangSwitch, {}),
									!isHome && /* @__PURE__ */ jsx(ThemeSwitch, {}),
									/* @__PURE__ */ jsxs(Button, {
										variant: isHome ? "outline" : "ghost",
										className: cn("h-10 rounded-full", isHome && "home-login-button"),
										onClick: () => setLoginOpen(true),
										children: [/* @__PURE__ */ jsx(UserRound, {}), t("nav.login")]
									})
								]
							}),
							!isHome && /* @__PURE__ */ jsx(Button, {
								asChild: true,
								className: "h-10 rounded-full px-4 font-semibold",
								children: /* @__PURE__ */ jsxs(Link, {
									to: "/report",
									search: { segment: void 0 },
									children: [
										/* @__PURE__ */ jsx(TriangleAlert, {}),
										/* @__PURE__ */ jsx("span", {
											className: "hidden sm:inline",
											children: t("nav.report")
										}),
										/* @__PURE__ */ jsx("span", {
											className: "sr-only sm:hidden",
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
												isHome ? /* @__PURE__ */ jsx(HomeLanguageSelect, {}) : /* @__PURE__ */ jsx(LangSwitch, {}),
												!isHome && /* @__PURE__ */ jsx(ThemeSwitch, {}),
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
		}),
		/* @__PURE__ */ jsx("nav", {
			"aria-label": t("nav.primary"),
			className: cn("fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background/95 px-1 pt-1 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-md lg:hidden", isHome && "hidden"),
			children: [
				{
					to: "/",
					label: "nav.home",
					icon: House,
					active: pathname === "/"
				},
				{
					to: "/traveller",
					label: "nav.traveller",
					icon: Search,
					active: pathname === "/traveller"
				},
				{
					to: "/map",
					label: "nav.map",
					icon: Map$1,
					active: isMap
				},
				{
					to: "/advisories",
					label: "nav.advisories",
					icon: ListChecks,
					active: isList
				}
			].map(({ to, label, icon: Icon, active }) => /* @__PURE__ */ jsxs(Link, {
				to,
				"aria-current": current(active),
				className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-medium", active ? "text-link" : "text-muted-foreground"),
				children: [/* @__PURE__ */ jsx(Icon, {
					"aria-hidden": true,
					className: "size-5"
				}), /* @__PURE__ */ jsx("span", { children: t(label) })]
			}, to))
		}),
		/* @__PURE__ */ jsx(LoginDialog, {
			open: loginOpen,
			onOpenChange: setLoginOpen
		})
	] });
}
function HomeLanguageSelect() {
	const { lang, setLang, t } = usePrefs();
	return /* @__PURE__ */ jsxs("label", {
		className: "home-language-control",
		children: [/* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: t("lang.label")
		}), /* @__PURE__ */ jsxs("select", {
			value: lang,
			onChange: (event) => setLang(event.target.value),
			"aria-label": t("lang.label"),
			children: [/* @__PURE__ */ jsx("option", {
				value: "en",
				children: "English"
			}), /* @__PURE__ */ jsx("option", {
				value: "hi",
				children: "हिन्दी"
			})]
		})]
	});
}
function SiteFooter() {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsx("footer", {
		className: "border-t border-border bg-card/40 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0",
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
					["footer.about", "/about"],
					["footer.privacy", "/about"],
					["footer.terms", "/about"],
					["footer.accessibility", "/about"],
					["footer.contact", "/contact"]
				].map(([key, to]) => /* @__PURE__ */ jsx(Link, {
					to,
					className: "inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground",
					children: t(key)
				}, key))
			})]
		})
	});
}
// src/lib/advisory.ts
function getAdvisorySourceTimestamp(advisory) {
	const timestamps = [advisory.latestObservationAt, advisory.restriction?.publishedAt].filter((timestamp) => timestamp !== void 0);
	return timestamps.length ? Math.max(...timestamps) : void 0;
}
function getFreshnessState(sourceTimestamp, now) {
	if (sourceTimestamp === void 0 || !Number.isFinite(sourceTimestamp) || !Number.isFinite(now) || sourceTimestamp <= 0 || sourceTimestamp > now) return "unknown";
	return now - sourceTimestamp <= 864e5 ? "fresh" : "stale";
}
var LEVEL_RANK = {
	clear: 0,
	unknown: 1,
	caution: 2,
	avoid: 3,
	do_not_travel: 4
};
var RESTRICTION_LEVEL = {
	road_closed: "do_not_travel",
	partially_restricted: "avoid",
	vehicle_restricted: "caution",
	time_bound: "caution"
};
var IGNORED = ["rejected", "duplicate"];
function isRestrictionInForce(r) {
	return r.status !== "lifted";
}
function computeSegmentAdvisory(segmentId, reports, restrictions, now) {
	const segReports = reports.filter((r) => r.segmentId === segmentId && !IGNORED.includes(r.status)).sort((a, b) => b.observedAt - a.observedAt);
	const latestObservationAt = segReports[0]?.observedAt;
	const reviewedCount = segReports.filter((r) => r.status === "verified").length;
	const freshHazards = segReports.filter((r) => r.kind === "hazard" && now - r.observedAt <= 864e5);
	const freshClears = segReports.filter((r) => r.kind === "clear" && now - r.observedAt <= 432e5);
	const evidence = [...freshHazards, ...freshClears].sort((a, b) => b.observedAt - a.observedAt);
	const base = {
		segmentId,
		latestObservationAt,
		reviewedCount,
		restrictionPastReview: false,
		awaitingClearance: false,
		stale: false
	};
	const restriction = restrictions.filter((r) => r.segmentId === segmentId && isRestrictionInForce(r)).sort((a, b) => LEVEL_RANK[RESTRICTION_LEVEL[b.type]] - LEVEL_RANK[RESTRICTION_LEVEL[a.type]])[0];
	if (restriction) return {
		...base,
		level: RESTRICTION_LEVEL[restriction.type],
		basis: "official",
		restriction,
		restrictionPastReview: now > restriction.reviewBy,
		awaitingClearance: restriction.clearance === "pending",
		evidence: evidence.length ? evidence : segReports.slice(0, 3)
	};
	if (freshHazards.length) {
		if (freshClears.length > 0 || freshHazards.some((r) => r.status === "conflicting")) return {
			...base,
			level: "caution",
			basis: "conflicting",
			evidence
		};
		const high = freshHazards.filter((r) => r.severity === "high");
		const corroborated = high.length >= 2 && high.some((r) => r.status === "verified");
		return {
			...base,
			level: corroborated ? "avoid" : "caution",
			basis: corroborated ? "corroborated" : "single_report",
			evidence
		};
	}
	if (freshClears.filter((r) => r.status === "verified").length) return {
		...base,
		level: "clear",
		basis: "verified_clear",
		evidence
	};
	if (segReports.length) return {
		...base,
		level: "unknown",
		basis: "stale_only",
		stale: true,
		evidence: segReports.slice(0, 3)
	};
	return {
		...base,
		level: "unknown",
		basis: "no_evidence",
		evidence: []
	};
}
function summariseRoute(segments, advisories) {
	const byId = new Map(advisories.map((a) => [a.segmentId, a]));
	let total = 0;
	let unknownKm = 0;
	let level = "clear";
	let hazardCount = 0;
	let restrictionCount = 0;
	let latest;
	let awaitingClearance = false;
	for (const s of segments) {
		const a = byId.get(s.id);
		total += s.distanceKm;
		if (!a || a.level === "unknown") unknownKm += s.distanceKm;
		const l = a?.level ?? "unknown";
		if (LEVEL_RANK[l] > LEVEL_RANK[level]) level = l;
		if (!a) continue;
		hazardCount += a.evidence.filter((r) => r.kind === "hazard").length;
		if (a.restriction) restrictionCount++;
		if (a.awaitingClearance) awaitingClearance = true;
		if (a.latestObservationAt && (!latest || a.latestObservationAt > latest)) latest = a.latestObservationAt;
	}
	const coverage = total ? (total - unknownKm) / total : 0;
	return {
		level,
		coverage,
		unknownKm,
		hazardCount,
		restrictionCount,
		latestObservationAt: latest,
		poorCoverage: coverage < .5,
		awaitingClearance
	};
}
// src/components/advisory.tsx
var LEVEL_META = {
	clear: {
		icon: CircleCheck,
		color: "var(--status-clear)",
		chip: "bg-status-clear/15 border-status-clear",
		bar: "bg-status-clear"
	},
	caution: {
		icon: TriangleAlert,
		color: "var(--status-caution)",
		chip: "bg-status-caution/15 border-status-caution",
		bar: "bg-status-caution"
	},
	avoid: {
		icon: OctagonAlert,
		color: "var(--status-avoid)",
		chip: "bg-status-avoid/15 border-status-avoid",
		bar: "bg-status-avoid"
	},
	do_not_travel: {
		icon: OctagonX,
		color: "var(--status-dnt)",
		chip: "bg-status-dnt/15 border-status-dnt",
		bar: "bg-status-dnt"
	},
	unknown: {
		icon: CircleQuestionMark,
		color: "var(--status-unknown)",
		chip: "bg-status-unknown/15 border-status-unknown",
		bar: "bg-status-unknown"
	}
};
function AdvisoryBadge({ level, size = "sm", className }) {
	const { t } = usePrefs();
	const meta = LEVEL_META[level];
	const Icon = meta.icon;
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border font-semibold text-foreground", size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs", meta.chip, className),
		children: [/* @__PURE__ */ jsx(Icon, {
			"aria-hidden": true,
			className: size === "lg" ? "size-4" : "size-3.5",
			style: { color: meta.color }
		}), t(`level.${level}`)]
	});
}
function ActionBadge({ level, size = "sm", className }) {
	return /* @__PURE__ */ jsx(AdvisoryBadge, {
		level,
		size,
		className
	});
}
var FRESHNESS_META = {
	fresh: {
		icon: CheckCircle2,
		color: "var(--blue-on-dark)",
		chip: "border-blue-on-dark/50 bg-brand-blue/15"
	},
	stale: {
		icon: Clock,
		color: "var(--status-stale)",
		chip: "border-status-stale/50 bg-status-stale/10"
	},
	unknown: {
		icon: CircleQuestionMark,
		color: "var(--status-unknown)",
		chip: "border-status-unknown/50 bg-status-unknown/10"
	}
};
function FreshnessChip({ sourceTimestamp, className }) {
	const { t, ago, now } = usePrefs();
	const state = getFreshnessState(sourceTimestamp, now);
	const meta = FRESHNESS_META[state];
	const Icon = meta.icon;
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium text-foreground", meta.chip, className),
		children: [
			/* @__PURE__ */ jsx(Icon, {
				"aria-hidden": true,
				className: "size-3.5",
				style: { color: meta.color }
			}),
			t(`freshness.${state}`),
			sourceTimestamp && state !== "unknown" ? ` · ${ago(sourceTimestamp)}` : ""
		]
	});
}
function OfficialBadge({ label, className }) {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border border-status-official bg-status-official/15 px-2.5 py-0.5 text-xs font-semibold text-foreground", className),
		children: [/* @__PURE__ */ jsx(ShieldCheck, {
			"aria-hidden": true,
			className: "size-3.5 text-status-official"
		}), label ?? t("level.official")]
	});
}
function DemoBadge({ className }) {
	const { t } = usePrefs();
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-md border border-border bg-background/70 px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide text-muted-foreground", className),
		children: [/* @__PURE__ */ jsx(FlaskConical, {
			"aria-hidden": true,
			className: "size-3"
		}), t("demo.badge")]
	});
}
function RoadCode({ children, className }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn("font-mono text-xs font-medium tracking-tight text-muted-foreground", className),
		children
	});
}
// src/routes/__root.tsx
var siteName = "RaahPrahari — Know before you go";
var siteDescription = "Check reported road hazards, information freshness, and official restrictions across Uttarakhand before your journey.";
var Route$11 = createRootRoute({
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
	const isHome = useRouterState({ select: (state) => state.location.pathname === "/" });
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		className: "dark",
		style: { colorScheme: "dark" },
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsxs("head", { children: [/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: themeBootScript } }), /* @__PURE__ */ jsx(HeadContent, {})] }), /* @__PURE__ */ jsxs("body", { children: [
			/* @__PURE__ */ jsx(PreferencesProvider, { children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
				/* @__PURE__ */ jsx(SkipLink, { children: "Skip to content" }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex min-h-screen flex-col",
					children: [
						/* @__PURE__ */ jsx(SiteHeader, {}),
						/* @__PURE__ */ jsx("main", {
							id: "main",
							className: isHome ? "flex-1" : "flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0",
							children
						}),
						!isHome && /* @__PURE__ */ jsx(SiteFooter, {})
					]
				}),
				!isHome && /* @__PURE__ */ jsx("div", {
					className: "pointer-events-none fixed right-2 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 lg:bottom-2",
					children: /* @__PURE__ */ jsx(DemoBadge, {})
				})
			] }) }),
			/* @__PURE__ */ jsx(Toaster$1, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
// src/routes/index.tsx
var $$splitComponentImporter$9 = () => import("./routes-B5m_mY35.js");
var Route$10 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
// src/routes/about.tsx
var $$splitComponentImporter$8 = () => import("./about-LH57kE70.js");
var Route$9 = createFileRoute("/about")({
	head: () => ({ meta: [{ title: "About · RaahPrahari" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
// src/routes/check.tsx
var $$splitComponentImporter$7 = () => import("./check-CNJh2Yf8.js");
var Route$8 = createFileRoute("/check")({
	validateSearch: (s) => ({
		from: typeof s.from === "string" ? s.from : void 0,
		to: typeof s.to === "string" ? s.to : void 0,
		view: s.view === "list" ? "list" : s.view === "map" ? "map" : void 0,
		seg: typeof s.seg === "string" ? s.seg : void 0
	}),
	head: () => ({ meta: [{ title: "Check a road · RaahPrahari" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
// src/routes/contact.tsx
var $$splitComponentImporter$6 = () => import("./contact-DAqcwQR5.js");
var Route$7 = createFileRoute("/contact")({
	head: () => ({ meta: [{ title: "Contact · RaahPrahari" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
// src/routes/help.tsx
var $$splitComponentImporter$5 = () => import("./help-kyGGkvis.js");
var Route$6 = createFileRoute("/help")({
	head: () => ({ meta: [{ title: "Help & Safety Centre · RaahPrahari" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
// src/routes/map.tsx
var $$splitComponentImporter$4 = () => import("./map-Cq5LBqdQ.js");
var Route$5 = createFileRoute("/map")({
	validateSearch: (search) => ({
		seg: typeof search.seg === "string" ? search.seg : void 0,
		view: search.view === "list" ? "list" : search.view === "map" ? "map" : void 0
	}),
	head: () => ({ meta: [{ title: "Live map · RaahPrahari" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
// src/routes/report.tsx
var $$splitComponentImporter$3 = () => import("./report-DfR0w1TM.js");
var Route$4 = createFileRoute("/report")({
	validateSearch: (search) => ({ segment: typeof search.segment === "string" ? search.segment : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
// src/routes/traveller.tsx
var $$splitComponentImporter$2 = () => import("./traveller-CnyH9K2z.js");
var Route$3 = createFileRoute("/traveller")({
	validateSearch: (search) => ({
		from: typeof search.from === "string" ? search.from : void 0,
		to: typeof search.to === "string" ? search.to : void 0,
		view: search.view === "list" ? "list" : search.view === "map" ? "map" : void 0,
		seg: typeof search.seg === "string" ? search.seg : void 0
	}),
	head: () => ({ meta: [{ title: "Search roads · RaahPrahari" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
// src/routes/advisories.index.tsx
var $$splitComponentImporter$1 = () => import("./advisories.index-DR1FJ3eO.js");
var Route$2 = createFileRoute("/advisories/")({
	head: () => ({ meta: [{ title: "Road advisories · RaahPrahari" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
// src/routes/advisories.$segmentId.tsx
var $$splitComponentImporter = () => import("./advisories._segmentId-CgHa4E-s.js");
var Route$1 = createFileRoute("/advisories/$segmentId")({
	loader: ({ params }) => {
		const segment = segmentById(params.segmentId);
		if (!segment) throw notFound();
		return { segment };
	},
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.segment.code ?? "Road details"} · RaahPrahari` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
// src/routeTree.gen.ts
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var AboutRoute = Route$9.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$11
});
var CheckRoute = Route$8.update({
	id: "/check",
	path: "/check",
	getParentRoute: () => Route$11
});
var ContactRoute = Route$7.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$11
});
var HelpRoute = Route$6.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => Route$11
});
var MapRoute = Route$5.update({
	id: "/map",
	path: "/map",
	getParentRoute: () => Route$11
});
var ReportRoute = Route$4.update({
	id: "/report",
	path: "/report",
	getParentRoute: () => Route$11
});
var TravellerRoute = Route$3.update({
	id: "/traveller",
	path: "/traveller",
	getParentRoute: () => Route$11
});
var AdvisoriesIndexRoute = Route$2.update({
	id: "/advisories/",
	path: "/advisories/",
	getParentRoute: () => Route$11
});
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	CheckRoute,
	ContactRoute,
	HelpRoute,
	MapRoute,
	ReportRoute,
	TravellerRoute,
	AdvisoriesSegmentIdRoute: Route$1.update({
		id: "/advisories/$segmentId",
		path: "/advisories/$segmentId",
		getParentRoute: () => Route$11
	}),
	AdvisoriesIndexRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
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
export { Route$8 as a, FreshnessChip as c, RoadCode as d, computeSegmentAdvisory as f, getRouter, EmptyState as h, Route$5 as i, LEVEL_META as l, summariseRoute as m, Route$1 as n, ActionBadge as o, getAdvisorySourceTimestamp as p, Route$3 as r, AdvisoryBadge as s, router_exports as t, OfficialBadge as u };
