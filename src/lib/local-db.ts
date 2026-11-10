import Dexie, { type Table } from "dexie";
import type { ReportDraft } from "@/lib/report-store";

export type DraftStatus = "draft" | "ready_to_send";
export type OutboxState =
  "pending" | "sending" | "failed" | "rejected" | "received";
export type AttachmentUploadState =
  "not_started" | "uploading" | "uploaded" | "failed";

export interface DraftAttachmentReference {
  id: string;
  name: string;
  type: string;
  size: number;
  timestamp: number;
  locationTag: string;
}

export interface DraftRecord {
  id: string;
  accountScope: string;
  ownerUserId: string | null;
  status: DraftStatus;
  eventTime: string;
  observedAtLocal: string;
  payload: ReportDraft;
  attachments: DraftAttachmentReference[];
  localReference: string | null;
  createdAt: number;
  updatedAt: number;
  savedAt: number | null;
  schemaVersion: number;
}

export interface UploadTarget {
  uploadUrl: string;
  method: "PUT";
  headers?: Record<string, string>;
  expiresAt: string;
}

export interface AttachmentRecord {
  id: string;
  draftId: string;
  accountScope: string;
  blob: Blob;
  name: string;
  type: string;
  size: number;
  createdAt: number;
  uploadState: AttachmentUploadState;
  uploadError: string | null;
  uploadedAt: number | null;
  uploadAttempts: number;
  uploadTarget?: UploadTarget | null;
}

export interface MetadataReceiptRecord {
  receiptId: string;
  receivedAt: string;
  duplicate: boolean;
}

export interface OutboxRecord {
  id: string;
  reportId: string;
  accountScope: string;
  ownerUserId: string | null;
  state: OutboxState;
  attempts: number;
  nextAttemptAt: number;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  retryAfterAt: number | null;
  metadataReceipt: MetadataReceiptRecord | null;
  deliveredAt: number | null;
  authBlocked: boolean;
  createdAt: number;
  updatedAt: number;
}

export class RaahPrahariLocalDB extends Dexie {
  drafts!: Table<DraftRecord, string>;
  attachments!: Table<AttachmentRecord, string>;
  outbox!: Table<OutboxRecord, string>;

  constructor(databaseName = "raahprahari-local") {
    super(databaseName);
    this.version(1).stores({
      drafts:
        "&id, accountScope, [accountScope+status], [accountScope+updatedAt], eventTime, createdAt, updatedAt, savedAt",
      attachments: "&id, draftId, accountScope, createdAt",
    });
    this.version(2).stores({
      drafts:
        "&id, accountScope, [accountScope+status], [accountScope+updatedAt], eventTime, createdAt, updatedAt, savedAt",
      attachments: "&id, draftId, accountScope, createdAt",
      outbox:
        "&id, reportId, accountScope, [accountScope+state], nextAttemptAt, updatedAt",
    });
    this.version(3)
      .stores({
        drafts:
          "&id, accountScope, [accountScope+status], [accountScope+updatedAt], eventTime, createdAt, updatedAt, savedAt",
        attachments:
          "&id, draftId, accountScope, [accountScope+uploadState], createdAt",
        outbox:
          "&id, reportId, accountScope, [accountScope+state], [accountScope+nextAttemptAt], nextAttemptAt, updatedAt",
      })
      .upgrade(async (transaction) => {
        await transaction
          .table("drafts")
          .toCollection()
          .modify((draft: Partial<DraftRecord>) => {
            if (draft.ownerUserId === undefined) draft.ownerUserId = null;
          });
        await transaction
          .table("attachments")
          .toCollection()
          .modify((attachment: Partial<AttachmentRecord>) => {
            attachment.uploadState ??= "not_started";
            attachment.uploadError ??= null;
            attachment.uploadedAt ??= null;
            attachment.uploadAttempts ??= 0;
            attachment.uploadTarget ??= null;
          });
        await transaction
          .table("outbox")
          .toCollection()
          .modify((entry: Partial<OutboxRecord>) => {
            if (entry.state === ("done" as OutboxState))
              entry.state = "received";
            entry.lastErrorCode ??= null;
            entry.lastErrorMessage ??= null;
            entry.retryAfterAt ??= null;
            entry.metadataReceipt ??= null;
            entry.deliveredAt ??= null;
            entry.authBlocked ??= false;
            entry.ownerUserId ??= null;
            entry.attempts ??= 0;
            entry.nextAttemptAt ??= 0;
          });
      });
  }
}

export const localDb = new RaahPrahariLocalDB();
