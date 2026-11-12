import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: React.ComponentProps<"a"> & { to?: string }) => (
    <a href={to} {...props} />
  ),
}));

import { Logo, LOGO_FULL_ALT } from "./logo";

describe("Logo", () => {
  it("header variant links to / with an accessible name", () => {
    render(<Logo />);
    const link = screen.getByRole("link", { name: "RaahPrahari home" });
    expect(link.getAttribute("href")).toBe("/");
  });

  it("full variant has descriptive alt text and explicit dimensions", () => {
    render(<Logo variant="full" />);
    const img = screen.getByRole("img", { name: LOGO_FULL_ALT });
    expect(img.getAttribute("width")).toBe("1269");
    expect(img.getAttribute("height")).toBe("1239");
  });
});
