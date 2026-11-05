import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { axe } from "jest-axe";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { NotFoundPage } from "@/components/error-pages";

const pages = [
  { path: "/", heading: /know before you go/i },
  { path: "/traveller", heading: /where are you travelling/i },
  { path: "/map", heading: /live road map/i },
  { path: "/advisories", heading: /road advisories/i },
  { path: "/about", heading: /about raahprahari/i },
  { path: "/contact", heading: /^contact$/i },
  { path: "/no-such-page", heading: /this page could not be found/i },
] as const;

afterEach(cleanup);

describe("page accessibility", () => {
  it.each(pages)(
    "renders $path with one page heading and no serious or critical axe violations",
    async ({ path, heading }) => {
      const history = createMemoryHistory({ initialEntries: [path] });
      const router = createRouter({
        routeTree,
        history,
        defaultNotFoundComponent: NotFoundPage,
        scrollRestoration: false,
      });
      await router.load();

      const { container, unmount } = render(<RouterProvider router={router} />);

      try {
        expect(
          await screen.findByRole("heading", { name: heading }),
        ).toBeVisible();
        expect(container.querySelectorAll("h1")).toHaveLength(1);
        expect(
          screen.getByRole("link", { name: "Skip to content" }),
        ).toHaveAttribute("href", "#main");

        const results = await axe(container);
        expect(
          results.violations
            .filter(
              (violation) =>
                violation.impact === "serious" ||
                violation.impact === "critical",
            )
            .map(({ id, impact, nodes }) => ({
              id,
              impact,
              elements: nodes.map((node) => node.target),
            })),
        ).toEqual([]);
      } finally {
        unmount();
      }
    },
    20_000,
  );

  it("switches the Map/List view with Enter from the keyboard", async () => {
    const user = userEvent.setup();
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ["/map"] }),
      scrollRestoration: false,
    });
    await router.load();

    const { unmount } = render(<RouterProvider router={router} />);

    try {
      const mapButton = await screen.findByRole("button", { name: "Map" });
      const listButton = screen.getByRole("button", { name: "List" });
      expect(mapButton).toHaveAttribute("aria-pressed", "true");

      listButton.focus();
      await user.keyboard("{Enter}");

      expect(listButton).toHaveAttribute("aria-pressed", "true");
      expect(mapButton).toHaveAttribute("aria-pressed", "false");
      expect(
        screen.getByRole("heading", { name: "Road segments" }),
      ).toBeVisible();
    } finally {
      unmount();
    }
  }, 20_000);
});
