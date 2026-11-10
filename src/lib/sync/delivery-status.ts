import type { AttachmentRecord, OutboxRecord } from "@/lib/local-db";

export type DeliveryStatus =
  | "server_received"
  | "rejected"
  | "waiting_for_sign_in"
  | "sending"
  | "retrying"
  | "saved_not_delivered";

export function deriveDeliveryStatus(
  outbox: OutboxRecord | null,
): DeliveryStatus {
  if (!outbox) return "saved_not_delivered";
  if (outbox.metadataReceipt && outbox.state === "received")
    return "server_received";
  if (outbox.state === "rejected") return "rejected";
  if (outbox.authBlocked) return "waiting_for_sign_in";
  if (outbox.state === "sending") return "sending";
  if (outbox.state === "failed") return "retrying";
  return "saved_not_delivered";
}

export function deriveAttachmentStatus(attachment: AttachmentRecord) {
  if (attachment.uploadState === "uploaded") return "uploaded" as const;
  if (attachment.uploadState === "uploading") return "uploading" as const;
  if (attachment.uploadState === "failed") return "failed" as const;
  return "pending" as const;
}
