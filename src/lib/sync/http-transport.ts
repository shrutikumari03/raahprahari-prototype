import {
  REPORT_SYNC_ENDPOINTS,
  ReportReceiptSchema,
  UploadTargetSchema,
  type AttachmentUploadTransport,
  type ReportMetadataPayload,
  type ReportSyncTransport,
  type SyncError,
  type TransportContext,
  type TransportResult,
  type UploadTarget,
} from "@/lib/sync/contract";

export interface SyncTransport
  extends ReportSyncTransport, AttachmentUploadTransport {}

function failure<T>(error: SyncError): TransportResult<T> {
  return { ok: false, error };
}

function retryAfterMs(value: string | null, now = Date.now()) {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, date - now);
}

function combinedSignal(parent: AbortSignal) {
  const timeoutMs = 20_000;
  if (
    typeof AbortSignal.any === "function" &&
    typeof AbortSignal.timeout === "function"
  ) {
    return {
      signal: AbortSignal.any([parent, AbortSignal.timeout(timeoutMs)]),
      cleanup: () => undefined,
    };
  }
  const controller = new AbortController();
  const abort = () => controller.abort(parent.reason);
  parent.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(
    () =>
      controller.abort(new DOMException("Request timed out", "TimeoutError")),
    timeoutMs,
  );
  if (parent.aborted) abort();
  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      parent.removeEventListener("abort", abort);
    },
  };
}

function requestError(_error: unknown, signal: AbortSignal): SyncError {
  if (signal.aborted) {
    const timedOut =
      signal.reason instanceof DOMException &&
      signal.reason.name === "TimeoutError";
    return {
      kind: timedOut ? "timeout" : "aborted",
      retryable: !timedOut,
      message: timedOut
        ? "The report service took too long to respond."
        : "The sync was cancelled.",
    };
  }
  return {
    kind: "network",
    retryable: true,
    message:
      "Could not reach the report service. Check your connection and retry.",
  };
}

function responseError(response: Response, now = Date.now()): SyncError {
  const retryMs = retryAfterMs(response.headers.get("Retry-After"), now);
  if (response.status === 401 || response.status === 403) {
    return {
      kind: "auth_required",
      retryable: true,
      message: "Sign in again to continue sending reports.",
    };
  }
  if ([400, 404, 413, 422].includes(response.status)) {
    return {
      kind: "rejected",
      retryable: false,
      message: `The report was rejected by the service (${response.status}).`,
    };
  }
  if (
    response.status === 408 ||
    response.status === 429 ||
    response.status >= 500
  ) {
    return {
      kind: "server",
      retryable: true,
      retryAfterMs: retryMs,
      message: `The report service is temporarily unavailable (${response.status}).`,
    };
  }
  return {
    kind: "server",
    retryable: false,
    message: `The report service returned an unexpected response (${response.status}).`,
  };
}

function configuredBaseUrl() {
  const base = import.meta.env.VITE_REPORTS_API_BASE?.trim();
  return base ? base.replace(/\/+$/, "") : null;
}

export function createHttpTransport(baseUrl: string): SyncTransport {
  const base = baseUrl.replace(/\/+$/, "");
  return {
    async sendMetadata(
      payload: ReportMetadataPayload,
      context: TransportContext,
    ) {
      const { signal, cleanup } = combinedSignal(context.signal);
      try {
        const response = await fetch(
          `${base}${REPORT_SYNC_ENDPOINTS.metadata.replace("{reportId}", encodeURIComponent(payload.reportId))}`,
          {
            method: "PUT",
            signal,
            headers: {
              "Content-Type": "application/json",
              "Idempotency-Key": payload.reportId,
              Authorization: `Bearer ${context.accessToken}`,
            },
            body: JSON.stringify(payload),
          },
        );
        if (![200, 201, 409].includes(response.status))
          return failure(responseError(response));
        let body: unknown;
        try {
          body = await response.json();
        } catch {
          return failure({
            kind: "malformed_response",
            retryable: true,
            message:
              "The service returned an invalid receipt. The report is not marked received.",
          });
        }
        const parsed = ReportReceiptSchema.safeParse(body);
        if (!parsed.success || parsed.data.reportId !== payload.reportId) {
          return failure({
            kind: "malformed_response",
            retryable: true,
            message:
              "The service returned an invalid receipt. The report is not marked received.",
          });
        }
        return { ok: true, value: parsed.data } as const;
      } catch (error) {
        return failure(requestError(error, signal));
      } finally {
        cleanup();
      }
    },

    async requestUploadTarget(
      reportId: string,
      attachmentId: string,
      context: TransportContext,
    ) {
      const { signal, cleanup } = combinedSignal(context.signal);
      try {
        const path = REPORT_SYNC_ENDPOINTS.uploadTarget
          .replace("{reportId}", encodeURIComponent(reportId))
          .replace("{attachmentId}", encodeURIComponent(attachmentId));
        const response = await fetch(`${base}${path}`, {
          method: "POST",
          signal,
          headers: { Authorization: `Bearer ${context.accessToken}` },
        });
        if (!response.ok) return failure(responseError(response));
        let body: unknown;
        try {
          body = await response.json();
        } catch {
          return failure({
            kind: "malformed_response",
            retryable: true,
            message: "The service returned an invalid photo upload target.",
          });
        }
        const parsed = UploadTargetSchema.safeParse(body);
        if (!parsed.success)
          return failure({
            kind: "malformed_response",
            retryable: true,
            message: "The service returned an invalid photo upload target.",
          });
        return { ok: true, value: parsed.data } as const;
      } catch (error) {
        return failure(requestError(error, signal));
      } finally {
        cleanup();
      }
    },

    async uploadBlob(target: UploadTarget, blob: Blob, context) {
      const { signal, cleanup } = combinedSignal(context.signal);
      try {
        context.onProgress?.(0);
        const response = await fetch(target.uploadUrl, {
          method: target.method,
          signal,
          headers: {
            ...target.headers,
            "Content-Type": blob.type || "application/octet-stream",
          },
          body: blob,
        });
        if (!response.ok) return failure(responseError(response));
        context.onProgress?.(1);
        return { ok: true, value: undefined } as const;
      } catch (error) {
        return failure(requestError(error, signal));
      } finally {
        cleanup();
      }
    },
  };
}

export function getConfiguredTransport(): SyncTransport | null {
  const base = configuredBaseUrl();
  return base ? createHttpTransport(base) : null;
}
