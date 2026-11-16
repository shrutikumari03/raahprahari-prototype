import { readFileSync } from "node:fs";
import { join } from "node:path";
import { act, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: React.ComponentProps<"a"> & { to?: string }) => (
    <a href={to} {...props} />
  ),
  useRouterState: () => false,
}));
import {
  BOOT_FADE_MS,
  BOOT_MAX_MS,
  BOOT_REVEAL_MS,
  BOOT_SESSION_KEY,
  BootGate,
  BootScreen,
  bootGuardScript,
} from "./boot-screen";

const css = readFileSync(join(process.cwd(), "src", "styles.css"), "utf8");
const root = readFileSync(
  join(process.cwd(), "src", "routes", "__root.tsx"),
  "utf8",
);

/**
 * A page load as the browser sees it: the server-rendered start screen, then
 * the inline guard script. Window listeners added by earlier loads are
 * removed so every test is one fresh page.
 */
const added: [
  string,
  EventListenerOrEventListenerObject,
  boolean | AddEventListenerOptions | undefined,
][] = [];
const realAdd = window.addEventListener.bind(window);
function pageLoad() {
  document.body.innerHTML = `<main id="main" aria-busy="true"></main>${renderToStaticMarkup(<BootScreen />)}`;
  new Function(bootGuardScript)();
  return document.getElementById("rp-boot")!;
}
const phase = () =>
  document.getElementById("rp-boot")?.getAttribute("data-phase");
const ready = () => window.dispatchEvent(new Event("rp-boot-ready"));

function setReducedMotion(matches: boolean) {
  window.matchMedia = vi
    .fn()
    .mockReturnValue({ matches }) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  vi.useFakeTimers();
  sessionStorage.clear();
  setReducedMotion(false);
  window.addEventListener = ((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => {
    added.push([type, listener, options]);
    realAdd(type, listener, options);
  }) as typeof window.addEventListener;
});

afterEach(() => {
  for (const [type, listener, options] of added.splice(0))
    window.removeEventListener(type, listener, options);
  window.addEventListener = realAdd;
  vi.restoreAllMocks();
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("start screen: once per session, short, fades out", () => {
  it("shows on the first open, after 300ms, and fades out by 800ms", () => {
    pageLoad();
    expect(sessionStorage.getItem(BOOT_SESSION_KEY)).toBe("1");
    expect(phase()).toBe("pending");
    vi.advanceTimersByTime(BOOT_REVEAL_MS);
    expect(phase()).toBe("shown");
    vi.advanceTimersByTime(BOOT_MAX_MS - BOOT_REVEAL_MS - 1);
    expect(phase()).toBe("shown");
    vi.advanceTimersByTime(1);
    expect(phase()).toBe("leaving");
    vi.advanceTimersByTime(BOOT_FADE_MS);
    expect(phase()).toBe("gone");
    expect(BOOT_MAX_MS).toBe(800);
    expect(BOOT_FADE_MS).toBeGreaterThanOrEqual(200);
    expect(BOOT_FADE_MS).toBeLessThanOrEqual(300);
  });

  it("does not show again on a later load in the same session", () => {
    pageLoad();
    vi.runAllTimers();
    const done = vi.fn();
    realAdd("rp-boot-done", done);
    pageLoad();
    expect(phase()).toBe("gone");
    expect(done).toHaveBeenCalled();
    window.removeEventListener("rp-boot-done", done);
  });

  it("shows again in a new session", () => {
    pageLoad();
    vi.runAllTimers();
    sessionStorage.clear();
    pageLoad();
    vi.advanceTimersByTime(BOOT_REVEAL_MS);
    expect(phase()).toBe("shown");
  });

  it("never appears when the app is ready within 300ms", () => {
    pageLoad();
    vi.advanceTimersByTime(100);
    ready();
    expect(phase()).toBe("gone");
    vi.runAllTimers();
    expect(phase()).toBe("gone");
  });

  it("fades out as soon as the app is ready", () => {
    pageLoad();
    vi.advanceTimersByTime(BOOT_REVEAL_MS + 50);
    ready();
    expect(phase()).toBe("leaving");
    ready(); // a second signal does not cut the fade short
    expect(phase()).toBe("leaving");
    vi.advanceTimersByTime(BOOT_FADE_MS);
    expect(phase()).toBe("gone");
  });

  it("hides at once, without a fade, under reduced motion", () => {
    setReducedMotion(true);
    pageLoad();
    vi.advanceTimersByTime(BOOT_REVEAL_MS);
    expect(phase()).toBe("shown");
    ready();
    expect(phase()).toBe("gone");
  });

  it("still works when sessionStorage is unavailable", () => {
    const spy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("blocked");
      });
    expect(() => pageLoad()).not.toThrow();
    vi.advanceTimersByTime(BOOT_MAX_MS + BOOT_FADE_MS);
    expect(phase()).toBe("gone");
    spy.mockRestore();
  });

  it("shows the error card if the app never hydrates, whatever the session flag", () => {
    sessionStorage.setItem(BOOT_SESSION_KEY, "1");
    const boot = pageLoad();
    expect(phase()).toBe("gone");
    vi.advanceTimersByTime(15000);
    expect(boot.getAttribute("data-state")).toBe("error");
    expect(boot.hasAttribute("data-phase")).toBe(false);
    expect(document.getElementById("main")?.hasAttribute("aria-busy")).toBe(
      false,
    );
  });

  it("does not show the error card once the app is ready", () => {
    const boot = pageLoad();
    ready();
    vi.advanceTimersByTime(15000);
    expect(boot.getAttribute("data-state")).toBe("loading");
  });
});

describe("BootGate", () => {
  it("is removed once the screen has gone and does not come back on route changes", () => {
    document.body.innerHTML =
      '<main id="main" aria-busy="true"></main><div id="rp-boot" data-phase="shown"></div><div id="root"></div>';
    const { rerender } = render(<BootGate />, {
      container: document.getElementById("root")!,
    });
    expect(document.getElementById("main")?.hasAttribute("aria-busy")).toBe(
      false,
    );
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    act(() => {
      document
        .querySelectorAll("#rp-boot")
        .forEach((el) => el.setAttribute("data-phase", "gone"));
      window.dispatchEvent(new Event("rp-boot-done"));
    });
    expect(screen.queryByRole("status")).toBeNull();
    // A navigation re-renders the root; the gate stays empty.
    rerender(<BootGate />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("renders nothing when there is no start screen to show", () => {
    document.body.innerHTML =
      '<main id="main" aria-busy="true"></main><div id="root"></div>';
    render(<BootGate />, { container: document.getElementById("root")! });
    expect(screen.queryByRole("status")).toBeNull();
    expect(document.getElementById("main")?.hasAttribute("aria-busy")).toBe(
      false,
    );
  });
});

describe("BootScreen", () => {
  it("has a status role with a hidden loading label", () => {
    render(<BootScreen />);
    const status = screen.getByRole("status");
    expect(status.textContent).toContain("Loading RaahPrahari");
    expect(status.querySelector(".sr-only")).not.toBeNull();
  });

  it("shows a Reload button in the error state", () => {
    render(<BootScreen state="error" />);
    const reload = screen.getByRole("button", { name: /reload/i });
    expect(reload.closest("[data-boot-error]")?.hasAttribute("hidden")).toBe(
      false,
    );
    expect(document.body.textContent).not.toMatch(/checking live road data/i);
  });

  it("falls back after a bounded wait and keeps error content visible behind the notice", () => {
    expect(bootGuardScript).toContain("},15000)");
    expect(bootGuardScript).toContain("m.removeAttribute('aria-busy')");
    expect(css).toMatch(
      /\.rp-boot\[data-state=["']error["']\]\s*\{[^}]*inset:\s*5rem 1rem auto auto;[^}]*width:\s*min\(24rem, calc\(100% - 2rem\)\)/s,
    );
  });
});

describe("start screen CSS", () => {
  it("is hidden and click-through unless shown, so it never blocks the page", () => {
    expect(css).toMatch(
      /\.rp-boot \{[^}]*opacity: 0;[^}]*visibility: hidden;[^}]*pointer-events: none;/,
    );
    expect(css).toMatch(
      /\.rp-boot\[data-phase=["']gone["']\] \{\s*display: none;/,
    );
    expect(css).toMatch(
      /\.rp-boot\[data-phase=["']leaving["']\] \{[^}]*transition: opacity 250ms var\(--ease-out\);/,
    );
    // No pulse and no reveal animation.
    expect(css).not.toMatch(/rp-boot-pulse|rp-boot-reveal/);
  });

  it("drops the fade under reduced motion and is hidden without JavaScript", () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{[^@]*\.rp-boot\[data-phase=["']leaving["']\] \{\s*transition: none;/,
    );
    expect(root).toContain("#rp-boot{display:none!important}");
  });
});
