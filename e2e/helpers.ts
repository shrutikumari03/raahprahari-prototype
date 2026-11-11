import type { Page } from "@playwright/test";

export type SignInOptions = {
  expiresInMs?: number;
};

export async function signIn(
  page: Page,
  userId: string,
  options: SignInOptions = {},
) {
  await page.evaluate(
    ({ nextUserId, expiresInMs }) => {
      const dev = window.__rpDev;
      if (!dev) {
        throw new Error("Development receipt stub is not available.");
      }
      dev.signIn(nextUserId, {
        expiresInMs,
      });
    },
    { nextUserId: userId, expiresInMs: options.expiresInMs },
  );
}

export async function signOut(page: Page) {
  await page.evaluate(() => {
    window.__rpDev?.signOut();
  });
}

export type CreateReportOptions = {
  hazard?: string;
  description?: string;
  eventTimeOffsetMs?: number;
  withPhoto?: boolean;
  confirmLocation?: "manual" | "device";
};

export async function createReport(
  page: Page,
  options: CreateReportOptions = {},
) {
  await page.goto("/");
  const hazard = options.hazard ?? "landslide";
  const description = options.description ?? "Loose debris on the road.";
  const eventTimeOffsetMs = options.eventTimeOffsetMs ?? 0;
  const withPhoto = options.withPhoto ?? false;
  const confirmLocation = options.confirmLocation ?? "manual";

  await page.evaluate(
    ({ nextHazard, nextDescription, nextOffset, nextWithPhoto, nextConfirmLocation }) => {
      const payload = {
        hazardType: nextHazard,
        description: nextDescription,
        eventTimeOffsetMs: nextOffset,
        withPhoto: nextWithPhoto,
        confirmLocation: nextConfirmLocation,
      };
      window.localStorage.setItem("rp.e2e.reportDraft", JSON.stringify(payload));
    },
    {
      nextHazard: hazard,
      nextDescription: description,
      nextOffset: eventTimeOffsetMs,
      nextWithPhoto: withPhoto,
      nextConfirmLocation: confirmLocation,
    },
  );

  return {
    hazard,
    description,
    eventTimeOffsetMs,
    withPhoto,
    confirmLocation,
  };
}

export async function stubReceived(page: Page) {
  await page.evaluate(() => {
    window.__rpDevStub?.reset();
  });
}

export async function stubRequests(page: Page) {
  return await page.evaluate(() => {
    return window.__rpDevStub?.requests() ?? [];
  });
}

export async function waitForStatus(page: Page, label: string) {
  await page.getByText(label).waitFor({ state: "visible" });
}
