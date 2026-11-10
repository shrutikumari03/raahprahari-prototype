import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { RaahPrahariLocalDB } from "@/lib/local-db";

const databaseName = "raahprahari-v2-upgrade-test";

afterEach(async () => {
  await Dexie.delete(databaseName);
});

describe("local database migrations", () => {
  it("migrates existing outbox done rows to received and preserves their records", async () => {
    const oldDatabase = new Dexie(databaseName);
    oldDatabase.version(2).stores({
      drafts:
        "&id, accountScope, [accountScope+status], [accountScope+updatedAt], eventTime, createdAt, updatedAt, savedAt",
      attachments: "&id, draftId, accountScope, createdAt",
      outbox:
        "&id, reportId, accountScope, [accountScope+state], nextAttemptAt, updatedAt",
    });
    await oldDatabase.open();
    await oldDatabase.table("outbox").put({
      id: "legacy-report-id",
      reportId: "legacy-report-id",
      accountScope: "user:legacy",
      ownerUserId: "legacy",
      state: "done",
      attempts: 2,
      nextAttemptAt: 0,
      createdAt: 100,
      updatedAt: 200,
    });
    oldDatabase.close();

    const upgraded = new RaahPrahariLocalDB(databaseName);
    await upgraded.open();
    const migrated = await upgraded.outbox.get("legacy-report-id");

    expect(migrated).toMatchObject({
      id: "legacy-report-id",
      reportId: "legacy-report-id",
      accountScope: "user:legacy",
      state: "received",
      attempts: 2,
      createdAt: 100,
      updatedAt: 200,
      authBlocked: false,
      metadataReceipt: null,
    });
    upgraded.close();
  });
});
