import { expect, test } from "@playwright/test";

import { signIn } from "./helpers";

test("the app boots and exposes the dev stub for sync flows", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/RaahPrahari/i);
  await expect(page.locator("body")).toContainText(/RaahPrahari/i);

 await page.waitForFunction(() => Boolean(window.__rpDev), { timeout: 10000 });
  const stubAvailable = await page.evaluate(() => Boolean(window.__rpDev));
  expect(stubAvailable).toBeTruthy();

  await signIn(page, "playwright-user");
  const session = await page.evaluate(() => (window.__rpDev ? "signed-in" : "missing"));
  expect(session).toBe("signed-in");
});
