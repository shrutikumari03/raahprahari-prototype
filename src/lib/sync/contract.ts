import { z } from "zod";

/**
 * Assumed backend contract: PUT /reports/{reportId} accepts idempotent metadata;
 * POST /reports/{reportId}/attachments/{attachmentId}/upload-target returns a
 * short-lived signed PUT URL. The endpoint templates live here for backend changes.
 */
export const REPORT_SYNC_ENDPOINTS = {
  metadata: "/reports/{reportId}",
  uploadTarget: "/reports/{reportId}/attachments/{attachmentId}/upload-target",
} as const;

export const IsoUtcSchema = z.string().datetime({ offset: false });
const uuidV4Schema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    "Expected a UUID v4",
  );

export const ReportMetadataPayloadSchema = z.object({
  schemaVersion: z.number().int().positive(),
  reportId: uuidV4Schema,
  eventTime: IsoUtcSchema,
  clientSavedAt: IsoUtcSchema,
  hazardType: z.enum([
    "landslide",
    "flooding",
    "road_block",
    "fallen_tree",
    "damaged_bridge",
    "accident",
    "poor_visibility",
    "other",
  ]),
  description: z.string().max(500),
  location: z.object({
    lat: z.number().finite().min(-90).max(90),
    lon: z.number().finite().min(-180).max(180),
    accuracyM: z.number().finite().nonnegative().nullable(),
    source: z.enum(["device", "manual"]),
    confirmed: z.literal(true),
    roadSegment: z.string(),
    query: z.string(),
  }),
  attachments: z.array(
    z.object({
      attachmentId: z.string().min(1),
      name: z.string(),
      type: z.string(),
      size: z.number().int().nonnegative(),
    }),
  ),
});

export const ReportReceiptSchema = z.object({
  reportId: uuidV4Schema,
  receiptId: z.string().min(1),
  receivedAt: IsoUtcSchema,
  duplicate: z.boolean(),
  attachmentUploads: z
    .array(
      z.object({
        attachmentId: z.string().min(1),
        uploadUrl: z.string().url(),
        method: z.literal("PUT"),
        headers: z.record(z.string(), z.string()).optional(),
        expiresAt: IsoUtcSchema,
      }),
    )
    .optional(),
});

export const UploadTargetSchema = z.object({
  uploadUrl: z.string().url(),
  method: z.literal("PUT"),
  headers: z.record(z.string(), z.string()).optional(),
  expiresAt: IsoUtcSchema,
});

export type ReportMetadataPayload = z.infer<typeof ReportMetadataPayloadSchema>;
export type ReportReceipt = z.infer<typeof ReportReceiptSchema>;
export type UploadTarget = z.infer<typeof UploadTargetSchema>;
export type SyncErrorKind =
  | "network"
  | "timeout"
  | "auth_required"
  | "rejected"
  | "server"
  | "malformed_response"
  | "not_configured"
  | "aborted";

export interface SyncError {
  kind: SyncErrorKind;
  retryable: boolean;
  retryAfterMs?: number;
  message: string;
}

export type TransportResult<T> =
  { ok: true; value: T } | { ok: false; error: SyncError };
export interface TransportContext {
  signal: AbortSignal;
  accessToken: string;
}
export interface ReportSyncTransport {
  sendMetadata(
    payload: ReportMetadataPayload,
    context: TransportContext,
  ): Promise<TransportResult<ReportReceipt>>;
}
export interface AttachmentUploadTransport {
  requestUploadTarget(
    reportId: string,
    attachmentId: string,
    context: TransportContext,
  ): Promise<TransportResult<UploadTarget>>;
  uploadBlob(
    target: UploadTarget,
    blob: Blob,
    context: { signal: AbortSignal; onProgress?: (progress: number) => void },
  ): Promise<TransportResult<void>>;
}
