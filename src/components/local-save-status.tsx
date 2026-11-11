import { useCallback, useState } from "react";
import { AlertTriangle, CheckCircle2, Save, TriangleAlert } from "lucide-react";
import { usePrefs } from "@/i18n/preferences";

export type LocalSaveState = "idle" | "saving" | "saved_locally" | "error";
export type LocalSaveErrorCode =
  "quota_exceeded" | "storage_unavailable" | "write_failed";

export function useLocalSaveStatus() {
  const [status, setStatus] = useState<LocalSaveState>("idle");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [errorCode, setErrorCode] = useState<LocalSaveErrorCode | null>(null);

  const setSaving = useCallback(() => {
    setStatus("saving");
    setErrorCode(null);
  }, []);

  const setSaved = useCallback((nextSavedAt: number) => {
    setSavedAt(nextSavedAt);
    setStatus("saved_locally");
    setErrorCode(null);
  }, []);

  const setError = useCallback((code: LocalSaveErrorCode) => {
    setErrorCode(code);
    setStatus("error");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setSavedAt(null);
    setErrorCode(null);
  }, []);

  return { status, savedAt, errorCode, setSaving, setSaved, setError, reset };
}

export function LocalSaveStatus({
  status,
  savedAt,
  errorCode,
  onRetry,
}: {
  status: LocalSaveState;
  savedAt: number | null;
  errorCode: LocalSaveErrorCode | null;
  onRetry?: () => void;
}) {
  const { t } = usePrefs();

  if (status === "idle") return null;

  if (status === "saving") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-status-caution/50 bg-status-caution/10 px-3 py-2 text-sm font-medium text-foreground"
      >
        <Save aria-hidden className="size-4 text-status-caution" />
        <span>{t("saveStatus.saving")}</span>
      </div>
    );
  }

  if (status === "saved_locally") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-3 rounded-xl border border-status-clear/50 bg-status-clear/10 p-3 text-sm"
      >
        <div className="flex flex-wrap items-center gap-2 font-medium text-foreground">
          <CheckCircle2 aria-hidden className="size-4 text-status-clear" />
          <span>{t("saveStatus.savedLocally")}</span>
          {savedAt ? (
            <span className="text-muted-foreground">
              {new Date(savedAt).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-muted-foreground">
          {t("saveStatus.notDelivered")}
        </p>
      </div>
    );
  }

  const errorMessage =
    errorCode === "quota_exceeded"
      ? t("saveStatus.errorQuota")
      : errorCode === "storage_unavailable"
        ? t("saveStatus.errorUnavailable")
        : t("saveStatus.errorGeneric");

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mt-3 rounded-xl border border-status-dnt/60 bg-status-dnt/10 p-3 text-sm"
    >
      <div className="flex items-start gap-2">
        <TriangleAlert aria-hidden className="mt-0.5 size-4 text-status-dnt" />
        <div className="flex-1">
          <p className="font-medium text-foreground">{errorMessage}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 font-medium hover:bg-accent"
            >
              <AlertTriangle aria-hidden className="size-4" />
              {t("saveStatus.retry")}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
