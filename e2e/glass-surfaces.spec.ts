import { expect, test, type Page } from "@playwright/test";

async function expectTranslucentGlass(page: Page, selector: string) {
  const surfaces = await page.locator(selector).evaluateAll((elements) =>
    elements.map((element) => {
      const style = getComputedStyle(element);
      const background = style.backgroundColor;
      const slashAlpha = background.match(/\/\s*([\d.]+)\s*\)$/);
      const rgbaAlpha = background.match(/^rgba\([^)]*,\s*([\d.]+)\s*\)$/i);
      return {
        background,
        alpha: Number(slashAlpha?.[1] ?? rgbaAlpha?.[1] ?? 1),
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

      return samplePoints.map(({ x, y }) => ({
        x,
        y,
        rgb: Array.from(context.getImageData(x, y, 1, 1).data.slice(0, 3)),
      }));
    },
    { screenshot: image.toString("base64"), samplePoints: points },
  );
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

test("map overlays use translucent glass on bright tiles", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/map");
  await expect(page.locator(".rp-map-legend")).toBeVisible();

  for (const selector of [
    ".rp-map-toolbar",
    ".rp-map-toggle",
    ".rp-map-legend",
    ".rp-map-detail",
    ".rp-lmap-note",
    ".rp-lmap-tools button",
  ]) {
    await expectTranslucentGlass(page, selector);
  }
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
