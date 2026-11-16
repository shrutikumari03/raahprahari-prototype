import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Shell glass wiring that is not part of the Phase 1 design test: the removal
 * of earlier rounds' classes, the tab and sticky-panel rules, the rail logo.
 * The glass tokens, backdrop and contrast are in glass-redesign.test.ts.
 */
const read = (p: string) => readFileSync(join(process.cwd(), "src", p), "utf8");
const styles = read("styles.css");
const plain = styles.replace(/\/\*[\s\S]*?\*\//g, "");

describe("the glass classes of earlier rounds are gone", () => {
  it("has no bar or overlay variants left: everything uses the six Phase 1 utilities", () => {
    expect(plain).not.toMatch(
      /rp-glass-|--glass-(bar|float|shell-overlay|menu|dialog|overlay-filter|edge)\b/,
    );
  });

  it("no component or page still uses them", () => {
    for (const file of [
      "components/ui/dialog.tsx",
      "components/ui/dropdown-menu.tsx",
      "components/ui/popover.tsx",
      "components/feature-search-modal.tsx",
      "components/app-shell/account-menu.tsx",
      "components/app-shell/shell-status.tsx",
      "components/app-shell/top-bars.tsx",
    ])
      expect(read(file), file).not.toMatch(/rp-glass-/);
  });
});

describe("where glass is used", () => {
  const rail = read("components/app-shell/rail.tsx");
  const bars = read("components/app-shell/top-bars.tsx");

  it("has no solid shell fills left on the bars", () => {
    expect(bars).not.toMatch(/bg-shell-bg|rp-glass-bar|rp-glass-float/);
    expect(rail).not.toMatch(/border-shell-divider bg-shell-bg|rp-glass-bar/);
  });

  it("puts only full-contrast text on the bottom tabs", () => {
    const tabs = bars.slice(bars.indexOf("export function BottomTabs"));
    expect(tabs).not.toMatch(/text-shell-muted/);
    // The current tab is marked by a bar and weight, not by colour alone.
    expect(tabs).toMatch(/isActive \? "font-semibold" : "font-medium"/);
    expect(tabs).toContain('data-testid="tab-active-bar"');
  });

  it("keeps sticky page panels below the sticky top bar", () => {
    for (const file of [
      "routes/advisories.$segmentId.tsx",
      "routes/check.tsx",
      "features/reports/report-step-page.tsx",
    ]) {
      const source = read(file);
      expect(source, file).toMatch(
        /(lg|xl):sticky (lg|xl):top-\[calc\(var\(--shell-bar-height\)\+1rem\)\]/,
      );
      expect(source, file).not.toMatch(/(lg|xl):sticky (lg|xl):top-\d/);
    }
  });

  it("shell menus, the status popover and dialog inherit glass-strong from the shared overlays", () => {
    // They only add shell text colour and width; the glass comes from ui/*.
    expect(read("components/app-shell/account-menu.tsx")).toContain(
      'className="rp-shell w-60 text-shell-text"',
    );
    expect(read("components/app-shell/shell-status.tsx")).toContain(
      'className="rp-shell w-80 text-shell-text"',
    );
    expect(read("components/app-shell/shell-status.tsx")).toContain(
      '<DialogContent className="rp-shell text-shell-text">',
    );
    expect(bars).toContain('className="rp-shell text-shell-text"');
    expect(
      read("components/ui/dropdown-menu.tsx").match(/glass-strong/g),
    ).toHaveLength(2);
    expect(read("components/ui/popover.tsx")).toContain("glass-strong");
    expect(read("components/ui/dialog.tsx")).toContain("glass-strong");
  });

  it("map and report surfaces use the approved glass utilities", () => {
    expect(read("routes/map.tsx")).toMatch(/rp-map-toolbar glass/);
    expect(read("routes/map.tsx")).toMatch(/rp-map-detail glass-strong/);
    expect(read("routes/map.tsx")).toMatch(/rp-map-legend glass-strong/);
    expect(read("features/map/leaflet-segment-map.tsx")).toMatch(
      /rp-lmap-status glass-strong/,
    );
    expect(read("features/reports/report-step-page.tsx")).toMatch(
      /glass-strong rounded-2xl/,
    );

    for (const file of [
      "routes/map.tsx",
      "features/map/leaflet-segment-map.tsx",
      "features/reports/report-step-page.tsx",
    ])
      expect(read(file), file).not.toMatch(/rp-glass-/);
  });
});

describe("rail logo", () => {
  const logo = read("components/logo.tsx");
  const shellLogo = read("components/app-shell/shell-logo.tsx");

  it("uses the existing logo files through <Logo>, not a drawn mark", () => {
    expect(shellLogo).toContain('<Logo variant="crest" decorative />');
    expect(shellLogo).not.toMatch(/<svg|<path/);
    expect(logo).toContain("'/img/logo-on-dark.png'");
    expect(logo).toContain("'/img/logo-on-light.png'");
  });

  it("keeps the wordmark beside it and an accessible name on the link", () => {
    expect(shellLogo).toMatch(/aria-label=\{t\("shell\.homeLabel"\)\}/);
    expect(shellLogo).toMatch(/showWordmark \?/);
    expect(read("components/app-shell/rail.tsx")).toContain(
      "<ShellLogo showWordmark={!collapsed} />",
    );
  });
});
