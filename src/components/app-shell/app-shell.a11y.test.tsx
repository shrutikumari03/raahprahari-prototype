import { forwardRef } from "react";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider } from "@/i18n/preferences";
import { setAccountSession, type AccountSession } from "@/lib/account-session";
import { AppShell } from "./app-shell";

const route = vi.hoisted(() => ({
  pathname: "/",
  search: {} as Record<string, unknown>,
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  const MockLink = forwardRef<
    HTMLAnchorElement,
    React.ComponentProps<"a"> & { to?: string; search?: unknown; hash?: string }
  >((props, ref) => {
    const { to = "#", search, hash, ...anchor } = props;
    void search;
    void hash;
    return <a ref={ref} href={to} {...anchor} />;
  });
  MockLink.displayName = "MockLink";
  return {
    ...actual,
    Link: MockLink,
    useNavigate: () => vi.fn(),
    useRouterState: ({ select }: { select: (s: unknown) => unknown }) =>
      select({ location: { ...route } }),
  };
});

const SIGNED_OUT: AccountSession = { status: "signed_out", userId: null };
const SIGNED_IN: AccountSession = {
  status: "authenticated",
  userId: "u1",
  email: "asha@example.com",
  role: null,
};

function mount() {
  return render(
    <PreferencesProvider>
      <TooltipProvider>
        <AppShell>
          <p>page body</p>
        </AppShell>
      </TooltipProvider>
    </PreferencesProvider>,
  );
}

const rail = () => screen.getAllByRole("navigation", { name: "Primary" })[0];

beforeEach(() => {
  route.pathname = "/";
  setAccountSession(SIGNED_OUT);
  window.localStorage.clear();
  window.sessionStorage.clear();
  document.documentElement.classList.remove("dark");
});

afterEach(() => {
  cleanup();
  setAccountSession(SIGNED_OUT);
});

describe("account menu keyboard use", () => {
  it("opens from the keyboard, lists the settings, closes on Escape and returns focus", async () => {
    setAccountSession(SIGNED_IN);
    const user = userEvent.setup();
    mount();
    const trigger = within(screen.getByTestId("shell-rail")).getByRole(
      "button",
      {
        name: "Account menu",
      },
    );
    trigger.focus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{Enter}");

    const menu = await screen.findByRole("menu");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      within(menu).getByRole("menuitem", { name: "Settings" }),
    ).toHaveAttribute("href", "/profile");
    for (const name of ["Light", "Dark", "System", "English", "हिन्दी"]) {
      expect(
        within(menu).getByRole("menuitemradio", { name }),
      ).toBeInTheDocument();
    }
    for (const name of ["Status details", "About", "Contact", "Log out"]) {
      expect(within(menu).getByRole("menuitem", { name })).toBeInTheDocument();
    }

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("applies the theme to the whole document with a three-state, text-labelled choice", async () => {
    setAccountSession(SIGNED_IN);
    const user = userEvent.setup();
    mount();
    const open = async () => {
      await user.click(
        within(screen.getByTestId("shell-rail")).getByRole("button", {
          name: "Account menu",
        }),
      );
      return screen.findByRole("menu");
    };

    let menu = await open();
    await user.click(
      within(menu).getByRole("menuitemradio", { name: "Light" }),
    );
    await waitFor(() =>
      expect(document.documentElement).not.toHaveClass("dark"),
    );
    expect(document.documentElement.style.colorScheme).toBe("light");

    menu = await open();
    expect(
      within(menu).getByRole("menuitemradio", { name: "Light" }),
    ).toBeChecked();
    await user.click(within(menu).getByRole("menuitemradio", { name: "Dark" }));
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(document.documentElement.style.colorScheme).toBe("dark");

    menu = await open();
    await user.click(
      within(menu).getByRole("menuitemradio", { name: "System" }),
    );
    await waitFor(() =>
      expect(
        JSON.parse(window.localStorage.getItem("rp.theme") ?? "null"),
      ).toBe("system"),
    );
  });

  it("keeps theme and language reachable when signed out", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(
      within(screen.getByTestId("shell-rail")).getByRole("button", {
        name: "Settings",
      }),
    );
    const menu = await screen.findByRole("menu");
    expect(
      within(menu).getByRole("menuitemradio", { name: "Dark" }),
    ).toBeInTheDocument();
    expect(
      within(menu).queryByRole("menuitem", { name: "Log out" }),
    ).toBeNull();
  });

  it("mobile account menu lists Advisories, Help and Contributions first, and closes on Escape", async () => {
    setAccountSession(SIGNED_IN);
    const user = userEvent.setup();
    mount();
    const trigger = within(screen.getByTestId("shell-mobilebar")).getByRole(
      "button",
      { name: "Account menu" },
    );
    trigger.focus();
    await user.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    const links = within(menu)
      .getAllByRole("menuitem")
      .slice(0, 3)
      .map((item) => [item.textContent, item.getAttribute("href")]);
    expect(links).toEqual([
      ["Advisories", "/advisories"],
      ["Help", "/help"],
      ["Contributions", "/contributions"],
    ]);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(trigger).toHaveFocus();
  });
});

describe("sign-in dialog focus", () => {
  it("opens from Community Login, labels its fields, closes and returns focus", async () => {
    const user = userEvent.setup();
    mount();
    const trigger = within(screen.getByTestId("shell-rail")).getByRole(
      "button",
      {
        name: "Community Login",
      },
    );
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Community login");
    expect(within(dialog).getByLabelText("Email")).toHaveAttribute(
      "type",
      "email",
    );
    expect(within(dialog).getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
    expect(
      within(dialog).getByRole("button", { name: "Sign in" }),
    ).toHaveAttribute("type", "submit");
    // Nothing claims a signed-in state before a real session exists.
    expect(dialog).not.toHaveTextContent("You are signed in.");
    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(trigger).toHaveFocus();
  });
});

describe("labels and landmarks", () => {
  it("names the rail, top bars and tabs, and keeps decorative icons out of the tree", () => {
    mount();
    expect(screen.getAllByRole("navigation", { name: "Primary" })).toHaveLength(
      2,
    );
    expect(
      screen.getByRole("link", { name: "Report a hazard" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Report hazard" })).toHaveLength(
      1,
    );
    for (const svg of document.querySelectorAll("svg")) {
      // Every shell icon is decorative; names come from text or aria-label.
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    }
    // Page content sits in a single main landmark with the skip-link target id.
    const mains = screen.getAllByRole("main");
    expect(mains).toHaveLength(1);
    expect(mains[0]).toHaveAttribute("id", "main");
    expect(within(mains[0]).getByText("page body")).toBeInTheDocument();
    expect(rail()).toBeInTheDocument();
  });

  it("offers the page palette from the menu so it stays reachable", async () => {
    setAccountSession(SIGNED_IN);
    const user = userEvent.setup();
    mount();
    await user.click(
      within(screen.getByTestId("shell-rail")).getByRole("button", {
        name: "Account menu",
      }),
    );
    await user.click(
      await screen.findByRole("menuitem", { name: "Search features" }),
    );
    expect(await screen.findByRole("dialog")).toHaveAccessibleName(
      "Search features",
    );
  });
});
