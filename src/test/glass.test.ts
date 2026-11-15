import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Floating overlays (menus, popovers, dialogs) and the shell's supporting
 * glass rules. The app-wide .glass design and the backdrop are covered in
 * glass-redesign.test.ts. jsdom does no compositing, so contrast is computed
 * from the tokens: the overlay colour blended over its worst backdrop.
 */
const read = (p: string) => readFileSync(join(process.cwd(), "src", p), "utf8");
const styles = read("styles.css");
const plain = styles.replace(/\/\*[\s\S]*?\*\//g, "");

function tokens(selector: RegExp) {
  const out: Record<string, string> = {};
  for (const m of plain.matchAll(selector))
    for (const d of m[2].matchAll(/(--[\w-]+):\s*([^;]+);/g)) out[d[1]] = d[2].trim();
  return out;
}
const light = tokens(/(^|\n):root\s*\{([^{}]*)\}/g);
const dark = { ...light, ...tokens(/(^|\n)\.dark\s*\{([^{}]*)\}/g) };

type RGB = [number, number, number];
const WHITE: RGB = [255, 255, 255];
const BLACK: RGB = [0, 0, 0];

function hex(theme: Record<string, string>, name: string): RGB {
  let value = theme[name];
  for (let i = 0; i < 5 && value?.startsWith("var("); i++)
    value = theme[value.slice(4, -1).trim()];
  const m = /^#([0-9a-f]{6})$/i.exec(value ?? "");
  if (!m) throw new Error(`${name} is not a hex colour: ${value}`);
  return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) as RGB;
}

/** `color-mix(in srgb, var(--x) N%, transparent)` => [--x, N / 100]. */
function glass(name: string): [string, number] {
  const m = /color-mix\(in srgb, var\((--[\w-]+)\) (\d+)%, transparent\)/.exec(light[name] ?? "");
  if (!m) throw new Error(`${name} is not a translucent token mix`);
  return [m[1], Number(m[2]) / 100];
}

const over = (top: RGB, alpha: number, under: RGB): RGB =>
  top.map((c, i) => c * alpha + under[i] * (1 - alpha)) as RGB;

function luminance([r, g, b]: RGB) {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
const contrast = (a: RGB, b: RGB) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe("overlay glass tokens and classes", () => {
  it("define translucent overlays from existing tokens and a theme-aware 1px edge", () => {
    expect(glass("--glass-shell-overlay")).toEqual(["--shell-surface", 0.85]);
    expect(glass("--glass-menu")).toEqual(["--popover", 0.85]);
    expect(glass("--glass-dialog")).toEqual(["--background", 0.85]);
    expect(light["--glass-overlay-filter"]).toBe("blur(18px) saturate(180%)");
    expect(light["--glass-edge"]).toBe("color-mix(in srgb, var(--shell-text) 14%, transparent)");
  });

  it("are solid without backdrop-filter support and frosted only inside @supports", () => {
    const start = plain.search(/@layer components \{\s*\.rp-glass-menu/);
    expect(start).toBeGreaterThan(-1);
    const layer = plain.slice(start);
    const supports = layer.slice(layer.indexOf("@supports"));
    const base = layer.slice(0, layer.indexOf("@supports"));
    expect(base).toMatch(/\.rp-glass-menu \{\s*background-color: var\(--popover\);/);
    expect(base).toMatch(/\.rp-glass-dialog \{\s*background-color: var\(--background\);/);
    expect(base).not.toMatch(/backdrop-filter/);
    expect(supports).toMatch(/^@supports \(\(backdrop-filter: blur\(1px\)\) or \(-webkit-backdrop-filter: blur\(1px\)\)\)/);
    expect(supports).toMatch(/-webkit-backdrop-filter: var\(--glass-overlay-filter\);\s*backdrop-filter: var\(--glass-overlay-filter\);/);
  });

  it("the bar classes of the previous round are gone", () => {
    expect(plain).not.toMatch(/rp-glass-bar|rp-glass-float|--glass-float|--glass-bar/);
  });
});

describe("overlay contrast stays at WCAG AA in both themes", () => {
  const themes = { light, dark } as const;
  for (const [themeName, theme] of Object.entries(themes)) {
    it(`${themeName}: overlays over any page content (black or white behind)`, () => {
      const cases: [string, string[]][] = [
        ["--glass-shell-overlay", ["--shell-text", "--shell-muted"]],
        ["--glass-menu", ["--popover-foreground", "--muted-foreground"]],
        ["--glass-dialog", ["--foreground", "--muted-foreground"]],
      ];
      for (const [token, texts] of cases) {
        const [base, alpha] = glass(token);
        for (const backdrop of [BLACK, WHITE]) {
          const surface = over(hex(theme, base), alpha, backdrop);
          for (const text of texts)
            expect(contrast(hex(theme, text), surface), `${token} ${text}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    });
  }
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
      expect(source, file).toMatch(/(lg|xl):sticky (lg|xl):top-\[calc\(var\(--shell-bar-height\)\+1rem\)\]/);
      expect(source, file).not.toMatch(/(lg|xl):sticky (lg|xl):top-\d/);
    }
  });

  it("on shell menus, the status popover and dialog, and the shared overlays", () => {
    expect(read("components/app-shell/account-menu.tsx")).toContain("rp-glass-shell-overlay");
    expect(read("components/app-shell/shell-status.tsx").match(/rp-glass-shell-overlay/g)).toHaveLength(2);
    expect(bars).toContain('className="rp-shell rp-glass-shell-overlay text-shell-text"');
    expect(read("components/ui/dropdown-menu.tsx").match(/rp-glass-menu/g)).toHaveLength(2);
    expect(read("components/ui/popover.tsx")).toContain("rp-glass-menu");
    expect(read("components/ui/dialog.tsx")).toContain("rp-glass-dialog");
  });

  it("not on inputs, the map or the report wizard (their own surfaces stay as they are)", () => {
    for (const file of [
      "components/ui/input.tsx",
      "components/ui/textarea.tsx",
      "components/ui/select.tsx",
      "routes/map.css",
      "features/map/leaflet-segment-map.css",
      "features/reports/report-step-page.tsx",
    ])
      expect(read(file), file).not.toMatch(/rp-glass|\bglass(-strong|-accent|-pill)?\b/);
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
    expect(read("components/app-shell/rail.tsx")).toContain("<ShellLogo showWordmark={!collapsed} />");
  });
});
