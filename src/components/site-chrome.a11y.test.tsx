import { forwardRef } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PreferencesProvider } from "@/i18n/preferences";
import { SiteHeader } from "./site-chrome";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  const MockLink = forwardRef<
    HTMLAnchorElement,
    React.ComponentProps<"a"> & {
      to?: string;
      search?: Record<string, unknown>;
      params?: Record<string, string>;
    }
  >((props, ref) => {
    const { to = "#", search, params, ...anchorProps } = props;
    void search;
    void params;
    return <a ref={ref} href={to} {...anchorProps} />;
  });
  MockLink.displayName = "MockLink";
  return {
    ...actual,
    Link: MockLink,
    useRouterState: ({
      select,
    }: {
      select: (state: {
        location: { pathname: string; search: Record<string, unknown> };
      }) => unknown;
    }) => select({ location: { pathname: "/", search: {} } }),
  };
});

describe("mobile navigation keyboard accessibility", () => {
  it("opens from the keyboard, traps focus, closes with Escape, and restores focus", async () => {
    const user = userEvent.setup();
    render(
      <PreferencesProvider>
        <SiteHeader />
      </PreferencesProvider>,
    );

    const trigger = screen.getByRole("button", { name: /menu/i });
    trigger.focus();
    await user.keyboard("{Enter}");

    const dialog = await screen.findByRole("dialog");
    const firstLink = within(dialog).getByRole("link", { name: "Home" });
    const closeButton = within(dialog).getByRole("button", { name: "Close" });
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement),
    );

    firstLink.focus();
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(closeButton).toHaveFocus();
    await user.tab();
    expect(firstLink).toHaveFocus();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });
});
