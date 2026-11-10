import { expect, test } from "@playwright/test";

test("the page still renders with the dev stub and no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() => Boolean(window.__rpDev), { timeout: 10000 });
  const isDevStubReady = await page.evaluate(() => Boolean(window.__rpDev));
  expect(isDevStubReady).toBeTruthy();

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth;
  });

  expect(overflow).toBeFalsy();
  await expect(page.locator("body")).toBeVisible();
});
