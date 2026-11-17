import { expect, test, type Page } from "@playwright/test";

async function expectTranslucentGlass(page: Page, selector: string) {
  const surfaces = await page.locator(selector).evaluateAll((elements) =>
    elements.map((element) => {
      const style = getComputedStyle(element);
      const background = style.backgroundColor;
      const slashAlpha = background.match(/\/\s*([\d.]+)\s*\)$/);
      const rgbaAlpha = background.match(/^rgba\([^)]*,\s*([\d.]+)\s*\)$/i);
      const gradientAlphas = [
        ...style.backgroundImage.matchAll(/\/\s*([\d.]+)\s*\)/g),
        ...style.backgroundImage.matchAll(/rgba\([^)]*,\s*([\d.]+)\s*\)/gi),
      ].map((match) => Number(match[1]));
      const backgroundAlpha = Number(slashAlpha?.[1] ?? rgbaAlpha?.[1] ?? 1);
      return {
        background,
        alpha:
          backgroundAlpha +
          (1 - backgroundAlpha) * Math.max(0, ...gradientAlphas),
        backdropFilter: style.backdropFilter,
      };
    }),
  );

  expect(surfaces.length, selector).toBeGreaterThan(0);
  for (const surface of surfaces) {
    expect(surface.backdropFilter, selector).not.toBe("none");
    expect(surface.alpha, `${selector}: ${surface.background}`).toBeLessThan(
      0.9,
    );
  }
}

async function sampleScreenshot(
  page: Page,
  image: Buffer,
  points: Array<{ x: number; y: number }>,
) {
  return page.evaluate(
    async ({ screenshot, samplePoints }) => {
      const bytes = Uint8Array.from(atob(screenshot), (character) =>
        character.charCodeAt(0),
      );
      const bitmap = await createImageBitmap(
        new Blob([bytes], { type: "image/png" }),
      );
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas 2D context is unavailable");
      context.drawImage(bitmap, 0, 0);
      const scaleX = bitmap.width / window.innerWidth;
      const scaleY = bitmap.height / window.innerHeight;

      return samplePoints.map(({ x, y }) => ({
        x,
        y,
        rgb: Array.from(
          context
            .getImageData(Math.round(x * scaleX), Math.round(y * scaleY), 1, 1)
            .data.slice(0, 3),
        ),
      }));
    },
    { screenshot: image.toString("base64"), samplePoints: points },
  );
}

async function openMap(
  page: Page,
  theme: "light" | "dark",
  viewport: { width: number; height: number },
) {
  await page.addInitScript((selectedTheme) => {
    localStorage.setItem("rp.theme", JSON.stringify(selectedTheme));
  }, theme);
  await page.setViewportSize(viewport);
  await page.goto("/map");
  await expect(page.locator(".rp-map-detail")).toBeVisible();
  await expect(page.locator(".rp-map-legend")).toBeVisible();
  await expect(page.locator(".rp-lmap-note")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator("html")
        .evaluate((element) => element.classList.contains("dark")),
    )
    .toBe(theme === "dark");
  await expect(page.locator(".rp-map-page")).not.toHaveClass(/\bdark\b/);
}

async function expectLightBackground(page: Page, selector: string) {
  const surfaces = await page.locator(selector).evaluateAll((elements) =>
    elements.map((element) => {
      const background = getComputedStyle(element).backgroundColor;
      const srgb = background.match(
        /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/,
      );
      const oklab = background.match(
        /oklab\(([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)/,
      );
      let sourceChannels: number[] | undefined;
      if (srgb) {
        sourceChannels = srgb.slice(1, 4).map((value) => Number(value) * 255);
      } else if (oklab) {
        const [lightness, a, b] = oklab.slice(1, 4).map(Number);
        const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
        const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
        const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
        sourceChannels = [
          4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
          -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
          -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
        ].map((value) => {
          const channel = Math.min(1, Math.max(0, value));
          return (
            255 *
            (channel <= 0.0031308
              ? 12.92 * channel
              : 1.055 * channel ** (1 / 2.4) - 0.055)
          );
        });
      } else {
        sourceChannels = background
          .match(/rgba?\(([^)]+)\)/)?.[1]
          .split(/[,/ ]+/)
          .filter(Boolean)
          .slice(0, 3)
          .map(Number);
      }
      if (!sourceChannels || sourceChannels.length !== 3)
        throw new Error(`Cannot parse background color: ${background}`);
      const alpha =
        Number(
          background.match(/\/\s*([\d.]+)\s*\)$/)?.[1] ??
            background.match(/^rgba\([^)]*,\s*([\d.]+)\s*\)$/i)?.[1] ??
            1,
        ) || 0;
      const channels = sourceChannels.map(
        (value, index) => value * alpha + [248, 246, 239][index] * (1 - alpha),
      );
      const linear = channels.map((value) => {
        const channel = value / 255;
        return channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return {
        background,
        luminance: linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722,
      };
    }),
  );

  expect(surfaces.length, selector).toBeGreaterThan(0);
  for (const surface of surfaces) {
    expect(
      surface.luminance,
      `${selector}: ${surface.background}`,
    ).toBeGreaterThan(0.12);
  }
}

function colorDistance(first: readonly number[], second: readonly number[]) {
  return Math.sqrt(
    first.reduce(
      (sum, channel, index) => sum + (channel - second[index]) ** 2,
      0,
    ),
  );
}

test("traveller glass surfaces are rendered translucent over the photo", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/traveller");
  await expect(
    page.getByRole("heading", { name: "Where are you travelling?" }),
  ).toBeVisible();
  await expect(page.locator(".rp-lmap-note")).toBeVisible();

  for (const selector of [
    ".traveller-search-panel",
    ".traveller-map-toggle",
    ".rp-lmap-note",
    ".rp-lmap-tools button",
    ".traveller-selected-hint",
    ".traveller-map-legend",
    ".traveller-route-summary",
  ]) {
    await expectTranslucentGlass(page, selector);
  }

  const searchButton = page.getByRole("button", { name: "Search road" });
  await expect(searchButton).toHaveClass(/glass-btn-accent/);
  const accentStyles = await searchButton.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      backgroundImage: style.backgroundImage,
      boxShadow: style.boxShadow,
    };
  });
  expect(accentStyles.backgroundImage).toContain("linear-gradient");
  expect(accentStyles.boxShadow).not.toBe("none");

  const panel = page.locator(".traveller-search-panel");
  const bounds = await panel.boundingBox();
  expect(bounds).not.toBeNull();
  const points = [
    {
      x: Math.round(bounds!.x + bounds!.width * 0.52),
      y: Math.round(bounds!.y + bounds!.height * 0.04),
    },
    {
      x: Math.round(bounds!.x + bounds!.width * 0.03),
      y: Math.round(bounds!.y + bounds!.height * 0.5),
    },
    {
      x: Math.round(bounds!.x + bounds!.width * 0.52),
      y: Math.round(bounds!.y + bounds!.height - 12),
    },
  ];
  const screenshot = await page.screenshot({
    path: testInfo.outputPath("traveller-dark-1280x900.png"),
  });
  const samples = await sampleScreenshot(page, screenshot, points);
  console.log("Traveller panel screenshot RGB samples:", samples);

  for (let first = 0; first < samples.length; first += 1) {
    for (let second = first + 1; second < samples.length; second += 1) {
      expect(
        colorDistance(samples[first].rgb, samples[second].rgb),
        `Backdrop samples ${first + 1} and ${second + 1} should differ: ${JSON.stringify(samples)}`,
      ).toBeGreaterThan(18);
    }
  }
});

test("map page uses light glass over tiles and the photo", async ({
  page,
}, testInfo) => {
  await openMap(page, "light", { width: 1280, height: 900 });

  for (const selector of [
    ".rp-map-toolbar",
    ".rp-map-search",
    ".rp-map-toggle",
    ".rp-map-legend",
    ".rp-map-detail",
    ".rp-map-leaflet .rp-lmap-note",
    ".rp-map-leaflet .rp-lmap-labels .glass-pill",
    ".rp-map-leaflet .rp-lmap-tools button",
    ".rp-map-detail .glass",
    ".rp-map-detail .glass-pill",
    ".rp-map-details-link",
  ]) {
    await expectTranslucentGlass(page, selector);
  }

  for (const selector of [
    ".rp-map-main",
    ".rp-map-canvas",
    ".rp-map-leaflet",
    ".rp-map-toolbar",
    ".rp-map-search",
    ".rp-map-toggle",
    ".rp-map-legend",
    ".rp-map-detail",
    ".rp-map-detail .glass",
    ".rp-map-detail .glass-pill",
    ".rp-map-condition",
    ".rp-map-details-link",
  ]) {
    await expectLightBackground(page, selector);
  }

  await expect(page.locator(".rp-map-details-link")).toHaveClass(
    /glass-btn-frost/,
  );
  await expect(page.getByText("Selected road segment")).toBeVisible();
  await expect(page.getByText("Landslide", { exact: true })).toBeVisible();
  await expect(page.locator(".rp-map-official-heading")).toContainText(
    "Official restriction",
  );

  const rightPanel = await page.locator(".rp-map-detail").boundingBox();
  const toolbar = await page.locator(".rp-map-toolbar").boundingBox();
  const legend = await page.locator(".rp-map-legend").boundingBox();
  expect(rightPanel).not.toBeNull();
  expect(toolbar).not.toBeNull();
  expect(legend).not.toBeNull();
  const points = [
    ...[0.04, 0.5, 0.96].map((fraction) => ({
      x: Math.round(rightPanel!.x + rightPanel!.width - 8),
      y: Math.round(rightPanel!.y + rightPanel!.height * fraction),
    })),
    ...[0.02, 0.5, 0.98].map((fraction) => ({
      x: Math.round(toolbar!.x + toolbar!.width * fraction),
      y: Math.round(toolbar!.y + 5),
    })),
    ...[0.04, 0.5, 0.96].map((fraction) => ({
      x: Math.round(legend!.x + legend!.width - 8),
      y: Math.round(legend!.y + legend!.height * fraction),
    })),
  ];
  const screenshot = await page.screenshot({
    path: testInfo.outputPath("map-light-1280x900.png"),
  });
  const samples = await sampleScreenshot(page, screenshot, points);
  console.log("Light map rendered RGB samples:", samples);

  for (const group of [
    samples.slice(0, 3),
    samples.slice(3, 6),
    samples.slice(6, 9),
  ]) {
    for (let first = 0; first < group.length; first += 1) {
      for (let second = first + 1; second < group.length; second += 1) {
        expect(
          colorDistance(group[first].rgb, group[second].rgb),
          `Backdrop samples should differ: ${JSON.stringify(group)}`,
        ).toBeGreaterThan(18);
      }
    }
  }
});

test("map page stays light and translucent at 375px", async ({
  page,
}, testInfo) => {
  await openMap(page, "light", { width: 375, height: 812 });

  for (const selector of [
    ".rp-map-toolbar",
    ".rp-map-search",
    ".rp-map-toggle",
    ".rp-map-legend",
    ".rp-map-detail",
    ".rp-map-leaflet .rp-lmap-note",
    ".rp-map-leaflet .rp-lmap-tools button",
    ".rp-map-detail .glass",
    ".rp-map-detail .glass-pill",
    ".rp-map-details-link",
  ]) {
    await expectTranslucentGlass(page, selector);
  }

  for (const selector of [
    ".rp-map-main",
    ".rp-map-canvas",
    ".rp-map-toolbar",
    ".rp-map-legend",
    ".rp-map-detail",
    ".rp-map-condition",
    ".rp-map-details-link",
  ]) {
    await expectLightBackground(page, selector);
  }

  await page.screenshot({
    path: testInfo.outputPath("map-light-375x812.png"),
  });
});

test("map page keeps its dark glass treatment", async ({ page }, testInfo) => {
  await openMap(page, "dark", { width: 1280, height: 900 });

  const darkStyles = await page.evaluate(() => {
    const read = (selector: string) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing ${selector}`);
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        backdropFilter: style.backdropFilter,
      };
    };
    return {
      main: read(".rp-map-main"),
      canvas: read(".rp-map-canvas"),
      toolbar: read(".rp-map-toolbar"),
      detail: read(".rp-map-detail"),
      detailsLink: read(".rp-map-details-link"),
    };
  });
  expect(darkStyles.main.background).toBe("rgb(7, 21, 31)");
  expect(darkStyles.canvas.background).toBe("rgb(9, 32, 43)");
  expect(darkStyles.toolbar.background).toBe("rgba(15, 27, 51, 0.36)");
  expect(darkStyles.toolbar.backdropFilter).toBe("blur(24px) saturate(1.5)");
  expect(darkStyles.detail.background).toContain("/ 0.874)");
  expect(darkStyles.detail.backdropFilter).toBe("blur(40px) saturate(1.5)");
  expect(darkStyles.detailsLink.background).toBe("rgb(0, 105, 166)");
  expect(darkStyles.detailsLink.backdropFilter).toBe("none");

  await page.screenshot({
    path: testInfo.outputPath("map-dark-1280x900.png"),
  });
});

test("map page keeps its dark treatment at 375px", async ({
  page,
}, testInfo) => {
  await openMap(page, "dark", { width: 375, height: 812 });

  for (const selector of [
    ".rp-map-toolbar",
    ".rp-map-search",
    ".rp-map-toggle",
    ".rp-map-legend",
    ".rp-map-detail",
    ".rp-map-leaflet .rp-lmap-note",
    ".rp-map-leaflet .rp-lmap-tools button",
  ]) {
    await expectTranslucentGlass(page, selector);
  }

  await page.screenshot({
    path: testInfo.outputPath("map-dark-375x812.png"),
  });
});

test("advisory detail map and information cards use glass surfaces", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/advisories/nh107-02");
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await expect(
    page.getByRole("heading", {
      name: "NH-107 — Agastyamuni to Guptkashi",
    }),
  ).toBeVisible();

  for (const selector of [
    ".advisory-detail-page .glass",
    ".advisory-detail-page .glass-strong",
    ".advisory-terrain-map .rp-lmap-note",
    ".advisory-terrain-map .rp-lmap-tools button",
    ".advisory-terrain-map .glass-strong",
    ".advisory-detail-page .rp-lmap-legend.glass-strong",
  ]) {
    await expectTranslucentGlass(page, selector);
  }
});
