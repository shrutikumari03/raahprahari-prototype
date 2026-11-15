import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Glassmorphism redesign (phase 1). jsdom does no compositing, so contrast is
 * computed from the tokens: text over glass over the backdrop overlay over the
 * worst-case photo pixel (white under the dark theme, black under the light
 * one). Every opacity in the design is meant to be the lowest that passes, so
 * these tests fail if anything is made lighter without re-checking AA.
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
type Theme = Record<string, string>;

type RGB = [number, number, number];
const WHITE: RGB = [255, 255, 255];
const BLACK: RGB = [0, 0, 0];

function resolve(theme: Theme, name: string): string {
  let value = theme[name];
  for (let i = 0; i < 6 && value?.startsWith("var("); i++)
    value = theme[value.slice(4, -1).trim()];
  if (value === undefined) throw new Error(`${name} is not defined`);
  return value;
}
function hex(theme: Theme, name: string): RGB {
  const m = /^#([0-9a-f]{6})$/i.exec(resolve(theme, name));
  if (!m) throw new Error(`${name} is not a hex colour: ${resolve(theme, name)}`);
  return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) as RGB;
}
/** `rgb(R G B / A)` => [[R, G, B], A]. */
function rgba(theme: Theme, name: string): [RGB, number] {
  const m = /^rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)$/.exec(resolve(theme, name));
  if (!m) throw new Error(`${name} is not rgb(R G B / A): ${resolve(theme, name)}`);
  return [[Number(m[1]), Number(m[2]), Number(m[3])], Number(m[4])];
}
const over = (top: RGB, alpha: number, under: RGB): RGB =>
  top.map((c, i) => c * alpha + under[i] * (1 - alpha)) as RGB;
const layer = (theme: Theme, name: string, under: RGB) => {
  const [c, a] = rgba(theme, name);
  return over(c, a, under);
};
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

const THEMES = { light, dark } as const;
const WORST = { light: BLACK, dark: WHITE } as const;
const STOPS = ["--backdrop-a", "--backdrop-b", "--backdrop-c"];
/** The overlay at each stop, over the worst-case photo pixel. */
const backdrops = (name: keyof typeof THEMES) =>
  STOPS.map((stop) => layer(THEMES[name], stop, WORST[name]));

describe("contrast: text straight on the backdrop (hero copy, mobile bar)", () => {
  for (const name of ["light", "dark"] as const) {
    it(`${name}: body text passes AA on every overlay stop`, () => {
      const theme = THEMES[name];
      for (const bg of backdrops(name))
        for (const text of ["--photo-text", "--foreground", "--shell-text"])
          expect(contrast(hex(theme, text), bg), text).toBeGreaterThanOrEqual(4.5);
    });
  }

  it("dark: the orange 'you' gradient passes 3:1 as large text", () => {
    for (const bg of backdrops("dark"))
      for (const stop of ["--hero-you-from", "--hero-you-to"])
        expect(contrast(hex(dark, stop), bg), stop).toBeGreaterThanOrEqual(3);
  });

  it("light: 'you' keeps the text colour (no orange passes there)", () => {
    expect(light["--hero-you-from"]).toBe("var(--photo-text)");
    expect(light["--hero-you-to"]).toBe("var(--photo-text)");
  });

  it("uses the lowest overlay that passes (not darker than needed)", () => {
    // One percent less on the binding stop must fail, in each theme.
    for (const name of ["light", "dark"] as const) {
      const theme = THEMES[name];
      const results = STOPS.map((stop) => {
        const [c, a] = rgba(theme, stop);
        const lighter = over(c, a - 0.01, WORST[name]);
        return contrast(hex(theme, "--foreground"), lighter) < 4.5 ||
          contrast(hex(theme, "--photo-text"), lighter) < 4.5;
      });
      expect(results.some(Boolean), name).toBe(true);
    }
  });
});

describe("contrast: text inside glass panels", () => {
  const TEXTS = ["--foreground", "--muted-foreground", "--shell-text", "--shell-muted", "--shell-link", "--link"];
  for (const name of ["light", "dark"] as const) {
    const theme = THEMES[name];

    it(`${name}: .glass and .glass-strong pass for body, muted and link text`, () => {
      for (const panel of ["--glass-panel", "--glass-panel-strong"])
        for (const bg of backdrops(name)) {
          const surface = layer(theme, panel, bg);
          for (const text of TEXTS)
            expect(contrast(hex(theme, text), surface), `${panel} ${text}`).toBeGreaterThanOrEqual(4.5);
        }
    });

    it(`${name}: .glass is the lightest panel tint that passes`, () => {
      const [c, a] = rgba(theme, "--glass-panel");
      const failsLighter = backdrops(name).some((bg) => {
        const surface = over(c, a - 0.01, bg);
        return TEXTS.some((text) => contrast(hex(theme, text), surface) < 4.5);
      });
      expect(failsLighter).toBe(true);
    });

    it(`${name}: .glass-accent passes for body, muted and orange accent text`, () => {
      for (const bg of backdrops(name)) {
        const surface = layer(theme, "--glass-accent-tint", layer(theme, "--glass-accent-base", bg));
        for (const text of ["--foreground", "--muted-foreground", "--glass-accent-text"])
          expect(contrast(hex(theme, text), surface), text).toBeGreaterThanOrEqual(4.5);
        // The status pill on the advisory card: 12% status colour over the panel.
        const pill = over(hex(theme, "--status-avoid"), 0.12, surface);
        expect(contrast(hex(theme, "--foreground"), pill)).toBeGreaterThanOrEqual(4.5);
      }
    });

    it(`${name}: the no-blur fallback surface passes`, () => {
      for (const bg of backdrops(name)) {
        const surface = layer(theme, "--glass-fallback", bg);
        for (const text of ["--foreground", "--muted-foreground", "--shell-text", "--shell-muted"])
          expect(contrast(hex(theme, text), surface), text).toBeGreaterThanOrEqual(4.5);
      }
    });
  }
});

describe("contrast: buttons", () => {
  it("orange gradient button: dark text passes on both ends", () => {
    for (const end of ["--accent-from", "--accent-to"])
      expect(contrast(hex(light, "--accent-ink"), hex(light, end)), end).toBeGreaterThanOrEqual(4.5);
  });

  it("frosted 'Check a road' button: dark text passes over any backdrop", () => {
    for (const under of [BLACK, WHITE]) {
      const surface = layer(light, "--frost-button", under);
      expect(contrast(hex(light, "--frost-button-ink"), surface)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("backdrop and glass structure", () => {
  const root = read("routes/__root.tsx");
  const shell = read("components/app-shell/app-shell.tsx");

  it("puts one fixed photo behind every page, with glows under the overlay", () => {
    expect(root).toContain('<div aria-hidden="true" className="rp-backdrop" />');
    const backdrop = plain.match(/\n\.rp-backdrop \{([^}]*)\}/)?.[1] ?? "";
    expect(backdrop).toMatch(/position: fixed;/);
    expect(backdrop).toMatch(/inset: 0;/);
    expect(backdrop).toMatch(/z-index: -10;/);
    expect(backdrop).toMatch(/url\('\/img\/hero-road\.png'\),\s*linear-gradient\(135deg, var\(--backdrop-fallback-a\)/);
    expect(backdrop).toMatch(/background-size: cover;/);
    // ::before (glows) paints under ::after (overlay).
    expect(plain).toMatch(/\.rp-backdrop::before \{\s*background:\s*radial-gradient/);
    expect(plain).toMatch(/\.rp-backdrop::after \{\s*background: linear-gradient\(135deg, var\(--backdrop-a\), var\(--backdrop-b\) 50%, var\(--backdrop-c\)\);/);
  });

  it("removes the solid layers that hid it", () => {
    expect(shell).not.toMatch(/bg-shell-bg/);
    // Pages not yet redesigned keep a solid main; Home does not.
    expect(shell).toMatch(/!isHome && "bg-background"/);
    // The light theme no longer strips every backdrop-blur.
    expect(plain).not.toMatch(/\[class\*='backdrop-blur'\][^{]*\{[^}]*backdrop-filter:\s*none/);
  });

  it("defines the glass utilities with a solid fallback, Safari prefix and phone blur", () => {
    const layerCss = plain.slice(plain.search(/@layer components \{\s*\.glass,/));
    const base = layerCss.slice(0, layerCss.indexOf("@supports"));
    const supports = layerCss.slice(layerCss.indexOf("@supports"));
    expect(base).toMatch(/background-color: var\(--glass-fallback\);/);
    expect(base).not.toMatch(/backdrop-filter/);
    expect(supports).toMatch(/\.glass,\s*\.glass-pill \{\s*background-color: var\(--glass-panel\);\s*-webkit-backdrop-filter: blur\(24px\) saturate\(150%\);\s*backdrop-filter: blur\(24px\) saturate\(150%\);/);
    expect(supports).toMatch(/\.glass-strong \{\s*background-color: var\(--glass-panel-strong\);\s*-webkit-backdrop-filter: blur\(40px\)/);
    expect(supports).toMatch(/@media \(width < 64rem\) \{[^@]*blur\(16px\)/);
    expect(plain).toMatch(/\.glass-pill \{\s*border-radius: 9999px;/);
  });

  it("turns motion off under reduced motion", () => {
    const at = [...plain.matchAll(/@media \(prefers-reduced-motion: reduce\) \{\s*\.glass,/g)].at(-1)?.index;
    expect(at).toBeDefined();
    const reduced = plain.slice(at);
    expect(reduced).toMatch(/transition: none;/);
    expect(reduced).toMatch(/translate: none;/);
  });

  it("uses Inter for headings, never Oxanium", () => {
    expect(light["--font-heading"]).toBe("'Inter', system-ui, sans-serif");
    expect(root).not.toMatch(/Oxanium/);
    expect(root).toMatch(/family=Inter:wght@400;500;600;700/);
  });
});

describe("shell and home use the glass", () => {
  const rail = read("components/app-shell/rail.tsx");
  const bars = read("components/app-shell/top-bars.tsx");
  const home = read("routes/index.tsx");

  it("floats the rail as a glass panel with an orange active item", () => {
    expect(rail).toMatch(/sticky top-0 hidden h-svh shrink-0 p-4/);
    expect(rail).toMatch(/glass-strong flex min-h-0 w-full flex-col overflow-hidden rounded-3xl/);
    expect(rail).toMatch(/"rp-rail-active text-shell-text"/);
    expect(plain).toMatch(/\.rp-rail-active-bar \{[^}]*box-shadow: 0 0 10px 1px var\(--accent-from\);/);
  });

  it("keeps the desktop top bar clear until content scrolls under it", () => {
    expect(bars).toMatch(/data-scrolled=\{scrolled\}/);
    expect(bars).toMatch(/rp-topbar sticky top-0 z-\(--z-header\) flex h-14/);
    expect(plain).toMatch(/\.rp-topbar\[data-scrolled='true'\] \{\s*background-color: var\(--glass-panel-strong\);/);
    expect(bars).toMatch(/glass h-11 w-full rounded-2xl/);
    expect(bars).toMatch(/glass-strong fixed inset-x-0 bottom-0/);
  });

  it("styles the home hero from the mockup without changing its copy", () => {
    expect(home).toMatch(/home-eyebrow glass-accent/);
    expect(home).toMatch(/home-search glass-strong/);
    expect(home).toMatch(/home-search-field glass/);
    expect(home).toMatch(/className="glass-btn-accent"/);
    expect(home).toMatch(/home-action home-action-check glass-btn-frost/);
    expect(home).toMatch(/highlight=\{lang === 'en' \? 'you' : null\}/);
    expect(home).not.toMatch(/hero-mountain\.png|home-hero-overlay/);
    expect(read("components/ui/button.tsx")).toMatch(/report: 'glass-btn-accent'/);
  });
});
