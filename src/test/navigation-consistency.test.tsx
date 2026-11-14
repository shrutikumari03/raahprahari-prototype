import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { NotFoundPage } from "@/components/error-pages";
import { activeNavTarget } from "@/components/app-shell/nav";
import { setAccountSession } from "@/lib/account-session";

// Keep the root session bridge away from a real Supabase project.
vi.mock("@/lib/supabase", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/supabase")>();
  return {
    ...actual,
    isSupabaseConfigured: () => false,
    getSupabaseClient: () => {
      throw new actual.SupabaseConfigError(["VITE_SUPABASE_URL"]);
    },
  };
});

const RAIL = [
  ["Home", "/"],
  ["Check a road", "/traveller"],
  ["Live map", "/map"],
  ["Advisories", "/advisories"],
  ["My reports", "/reports"],
  ["Help", "/help"],
] as const;

const TABS = [
  ["Home", "/"],
  ["Map", "/map"],
  ["Report a hazard", "/report"],
  ["Reports", "/reports"],
  ["Profile", "/profile"],
] as const;

/** Every route that must show the shared shell, with the item expected to be current. */
const ROUTES: { path: string; rail: string | null; tab: string | null }[] = [
  { path: "/", rail: "/", tab: "/" },
  { path: "/traveller", rail: "/traveller", tab: null },
  { path: "/map", rail: "/map", tab: "/map" },
  { path: "/advisories", rail: "/advisories", tab: null },
  { path: "/advisories/nh7-06", rail: "/advisories", tab: null },
  { path: "/help", rail: "/help", tab: null },
  { path: "/about", rail: null, tab: null },
  { path: "/contact", rail: null, tab: null },
  { path: "/reports", rail: "/reports", tab: "/reports" },
  { path: "/report", rail: null, tab: "/report" },
  { path: "/profile", rail: null, tab: "/profile" },
  { path: "/no-such-page", rail: null, tab: null },
];

afterEach(() => {
  cleanup();
  setAccountSession({ status: "signed_out", userId: null });
});

async function mountAt(path: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    defaultNotFoundComponent: NotFoundPage,
    scrollRestoration: false,
  });
  await router.load();
  const rendered = render(<RouterProvider router={router} />, {
    container: document as unknown as HTMLElement,
  });
  // Wait until the shell is on screen.
  await waitFor(() => screen.getByTestId("shell-rail"));
  return { router, ...rendered };
}

const hrefPath = (link: HTMLElement) =>
  new URL(link.getAttribute("href")!, "http://x").pathname;
const linkPairs = (nav: HTMLElement) =>
  within(nav)
    .getAllByRole("link")
    .map((link) => [
      link.getAttribute("aria-label") ?? link.textContent?.trim(),
      hrefPath(link),
    ]);
const currentHref = (nav: HTMLElement) =>
  within(nav)
    .queryAllByRole("link")
    .filter(
      (link) =>
        link.getAttribute("aria-current") === "page" &&
        link.getAttribute("aria-label") !== "RaahPrahari home",
    )
    .map(hrefPath);

describe("shared app shell on every route", () => {
  it.each(ROUTES)(
    "$path shows the same shell, links and order",
    async ({ path, rail: railActive, tab: tabActive }) => {
      await mountAt(path);

      // One main landmark that the skip link targets.
      const mains = screen.getAllByRole("main");
      expect(mains).toHaveLength(1);
      expect(mains[0]).toHaveAttribute("id", "main");

      // The skip link is the very first focusable element.
      const first = document.body.querySelector<HTMLElement>(
        "a[href], button, input, select, textarea, [tabindex]",
      );
      expect(first).toHaveAttribute("href", "#main");
      expect(first).toHaveTextContent("Skip to main content");

      // Only the shared navigation landmarks exist: rail, mobile tabs and the page footer.
      const navNames = screen
        .getAllByRole("navigation")
        .map((nav) => nav.getAttribute("aria-label"));
      expect(navNames.filter((name) => name !== "Footer")).toEqual([
        "Primary",
        "Primary",
      ]);

      // No page adds a second site header: every header outside <main> is a shell bar.
      const outside = screen
        .getAllByRole("banner")
        .filter((el) => !el.closest("main"));
      expect(
        outside.map((el) => el.getAttribute("data-testid")).sort(),
      ).toEqual(["shell-mobilebar", "shell-topbar"]);

      const rail = screen.getByTestId("shell-rail");
      // The logo link sits first in the rail; the items follow it in order.
      expect(
        linkPairs(rail).filter(([label]) => label !== "RaahPrahari home"),
      ).toEqual(RAIL.map(([label, href]) => [label, href]));
      const tabs = screen.getByTestId("shell-tabs");
      expect(linkPairs(tabs)).toEqual(
        TABS.map(([label, href]) => [label, href]),
      );

      // The current item follows the route.
      expect(currentHref(rail)).toEqual(railActive ? [railActive] : []);
      expect(currentHref(tabs)).toEqual(tabActive ? [tabActive] : []);

      // Report hazard is in the desktop top bar and the centre tab.
      const topBar = screen.getByTestId("shell-topbar");
      expect(
        hrefPath(within(topBar).getByRole("link", { name: "Report hazard" })),
      ).toBe("/report");
      expect(
        hrefPath(within(tabs).getByRole("link", { name: "Report a hazard" })),
      ).toBe("/report");
    },
    30_000,
  );

  it("keeps Review queue and Official updates out of the rail without a role", async () => {
    await mountAt("/");
    const rail = screen.getByTestId("shell-rail");
    expect(
      within(rail).queryByRole("link", { name: "Review queue" }),
    ).toBeNull();
    expect(
      within(rail).queryByRole("link", { name: "Official updates" }),
    ).toBeNull();
  }, 30_000);

  it("maps routes to the current shell item", () => {
    expect(activeNavTarget("/")).toBe("/");
    expect(activeNavTarget("/advisories/")).toBe("/advisories");
    expect(activeNavTarget("/advisories/RP-418203")).toBe("/advisories");
    expect(activeNavTarget("/help/freshness")).toBe("/help");
    expect(activeNavTarget("/report/review")).toBe("/report");
    expect(activeNavTarget("/check", "list")).toBe("/advisories");
    expect(activeNavTarget("/check")).toBe("/map");
    expect(activeNavTarget("/reports")).toBe("/reports");
    expect(activeNavTarget("/profile")).toBe("/profile");
  });

  // Menu keyboard behaviour, sign-in focus return and the breakpoint contract are
  // covered in src/components/app-shell/*.test.tsx.
});
