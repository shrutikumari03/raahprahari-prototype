import type {
  AttachmentUploadTransport,
  ReportMetadataPayload,
  ReportReceipt,
  ReportSyncTransport,
  SyncErrorKind,
  TransportContext,
  TransportResult,
  UploadTarget,
} from "@/lib/sync/contract";
import {
  setAccessTokenProvider,
  setAccountSession,
} from "@/lib/account-session";

interface StoredReport {
  payload: ReportMetadataPayload;
  receipt: ReportReceipt;
}

interface RequestLogEntry {
  method: string;
  path: string;
  headers: Record<string, string>;
  reportId: string;
  at: number;
}

interface StubControls {
  failNext(count: number, kind: SyncErrorKind): void;
  failAuthNext(count: number): void;
  dropAckNext(count: number): void;
  setLatency(milliseconds: number): void;
  received(): Array<{
    reportId: string;
    receiptId: string;
    receivedAt: string;
  }>;
  failMediaNext(count: number): void;
  requests(): RequestLogEntry[];
  reset(): void;
}

interface DevHelpers {
  signIn(userId: string, options?: { expiresInMs?: number }): void;
  signOut(): void;
}

declare global {
  interface Window {
    __rpDevStub?: StubControls;
    __rpDev?: DevHelpers;
  }
}

const reports = new Map<string, StoredReport>();
let failuresRemaining = 0;
let authFailuresRemaining = 0;
let failureKind: SyncErrorKind = "network";
let droppedAcksRemaining = 0;
let mediaFailuresRemaining = 0;
let latencyMs = 0;
let receiptSequence = 0;
const requestLog: RequestLogEntry[] = [];

const failureMessages: Record<SyncErrorKind, string> = {
  network: "Could not reach the development receipt stub.",
  timeout: "The development receipt stub timed out.",
  auth_required: "Sign in again to continue sending reports.",
  rejected: "The development receipt stub rejected the report.",
  server: "The development receipt stub is unavailable.",
  malformed_response:
    "The development receipt stub returned an invalid receipt.",
  not_configured: "Sending is not configured.",
  aborted: "The sync was cancelled.",
};

function failure<T>(kind: SyncErrorKind): TransportResult<T> {
  return {
    ok: false,
    error: {
      kind,
      retryable: ![
        "auth_required",
        "rejected",
        "not_configured",
        "aborted",
      ].includes(kind),
      message: failureMessages[kind],
    },
  };
}

async function wait(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  if (latencyMs) {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, latencyMs);
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true },
      );
    });
  }
}

function logRequest(
  method: string,
  path: string,
  reportId: string,
  headers: Record<string, string>,
) {
  requestLog.push({
    method,
    path,
    headers: Object.fromEntries(
      Object.entries(headers).map(([key, value]) => [
        key,
        key.toLowerCase() === "authorization" ? "******" : value,
      ]),
    ),
    reportId,
    at: Date.now(),
  });
}

const stub: ReportSyncTransport & AttachmentUploadTransport = {
  async sendMetadata(
    payload: ReportMetadataPayload,
    { signal, accessToken }: TransportContext,
  ) {
    await wait(signal);
    if (signal.aborted) return failure("aborted");
    logRequest("PUT", `/reports/${payload.reportId}`, payload.reportId, {
      Authorization: accessToken ? "******" : "none",
    });
    if (authFailuresRemaining > 0) {
      authFailuresRemaining -= 1;
      return failure("auth_required");
    }
    if (failuresRemaining > 0) {
      failuresRemaining -= 1;
      return failure(failureKind);
    }
    let stored = reports.get(payload.reportId);
    const duplicate = Boolean(stored);
    if (!stored) {
      const receipt: ReportReceipt = {
        reportId: payload.reportId,
        receiptId: `DEV-${++receiptSequence}`,
        receivedAt: new Date().toISOString(),
        duplicate: false,
      };
      stored = { payload, receipt };
      reports.set(payload.reportId, stored);
    }
    if (droppedAcksRemaining > 0) {
      droppedAcksRemaining -= 1;
      return failure("network");
    }
    return {
      ok: true,
      value: {
        ...stored.receipt,
        duplicate,
      },
    };
  },

  async requestUploadTarget(
    reportId: string,
    attachmentId: string,
    { signal, accessToken },
  ) {
    await wait(signal);
    if (signal.aborted) return failure("aborted");
    logRequest(
      "POST",
      `/reports/${reportId}/attachments/${attachmentId}/upload-target`,
      reportId,
      { Authorization: accessToken ? "******" : "none" },
    );
    const target: UploadTarget = {
      uploadUrl: "https://dev.invalid/upload",
      method: "PUT",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    };
    return { ok: true, value: target };
  },

  async uploadBlob(_target: UploadTarget, _blob: Blob, { signal, onProgress }) {
    await wait(signal);
    if (signal.aborted) return failure("aborted");
    if (mediaFailuresRemaining > 0) {
      mediaFailuresRemaining -= 1;
      return failure("network");
    }
    onProgress?.(1);
    return { ok: true, value: undefined };
  },
};

const controls: StubControls = {
  failNext(count, kind) {
    failuresRemaining = Math.max(0, Math.floor(count));
    failureKind = kind;
  },
  failAuthNext(count) {
    authFailuresRemaining = Math.max(0, Math.floor(count));
  },
  dropAckNext(count) {
    droppedAcksRemaining = Math.max(0, Math.floor(count));
  },
  setLatency(milliseconds) {
    latencyMs = Math.max(0, milliseconds);
  },
  received() {
    return [...reports.values()].map(({ receipt }) => ({
      reportId: receipt.reportId,
      receiptId: receipt.receiptId,
      receivedAt: receipt.receivedAt,
    }));
  },
  failMediaNext(count) {
    mediaFailuresRemaining = Math.max(0, Math.floor(count));
  },
  requests() {
    return requestLog.map((entry) => ({ ...entry, headers: { ...entry.headers } }));
  },
  reset() {
    reports.clear();
    requestLog.length = 0;
    failuresRemaining = 0;
    authFailuresRemaining = 0;
    droppedAcksRemaining = 0;
    mediaFailuresRemaining = 0;
    latencyMs = 0;
    receiptSequence = 0;
    setAccessTokenProvider(null);
    setAccountSession({ status: "signed_out", userId: null });
  },
};

if (typeof window !== "undefined") {
  window.__rpDevStub = controls;
  window.__rpDev = {
    signIn(userId: string, options: { expiresInMs?: number } = {}) {
      if (!userId.trim()) {
        throw new Error("A user ID is required to sign in to the dev stub.");
      }
      const expiresAt =
        typeof options.expiresInMs === "number" && options.expiresInMs > 0
          ? Date.now() + options.expiresInMs
          : undefined;
      setAccessTokenProvider(async () => {
        if (
          typeof expiresAt === "number" &&
          expiresAt <= Date.now()
        ) {
          setAccountSession({ status: "signed_out", userId: null });
          return null;
        }
        return "dev-receipt-stub-token";
      });
      const nextSession = { status: "authenticated", userId } as {
        status: "authenticated";
        userId: string;
        expiresAt?: number | null;
      };
      if (typeof expiresAt === "number") {
        nextSession.expiresAt = expiresAt;
      }
      setAccountSession(nextSession);
    },
    signOut() {
      setAccessTokenProvider(null);
      setAccountSession({ status: "signed_out", userId: null });
    },
  };
}

export function getDevReceiptStub() {
  return stub;
}
