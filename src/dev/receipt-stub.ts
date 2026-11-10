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

interface StubControls {
  failNext(count: number, kind: SyncErrorKind): void;
  dropAckNext(count: number): void;
  setLatency(milliseconds: number): void;
  received(): Array<{
    reportId: string;
    receiptId: string;
    receivedAt: string;
  }>;
  failMediaNext(count: number): void;
}

interface DevHelpers {
  signIn(userId: string): void;
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
let failureKind: SyncErrorKind = "network";
let droppedAcksRemaining = 0;
let mediaFailuresRemaining = 0;
let latencyMs = 0;
let receiptSequence = 0;

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

const stub: ReportSyncTransport & AttachmentUploadTransport = {
  async sendMetadata(
    payload: ReportMetadataPayload,
    { signal }: TransportContext,
  ) {
    await wait(signal);
    if (signal.aborted) return failure("aborted");
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
    _reportId: string,
    _attachmentId: string,
    { signal },
  ) {
    await wait(signal);
    if (signal.aborted) return failure("aborted");
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
};

if (typeof window !== "undefined") {
  window.__rpDevStub = controls;
  window.__rpDev = {
    signIn(userId: string) {
      if (!userId.trim()) {
        throw new Error("A user ID is required to sign in to the dev stub.");
      }
      setAccessTokenProvider(async () => "dev-receipt-stub-token");
      setAccountSession({ status: "authenticated", userId });
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
