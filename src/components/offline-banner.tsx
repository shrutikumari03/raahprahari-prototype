import { AlertTriangle, CheckCircle2, Info, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { usePrefs } from "@/i18n/preferences";
import { getActiveAccountScope } from "@/lib/account-scope";
import { listOutbox } from "@/lib/draft-repository";
import { useSyncState } from "@/lib/sync/sync-state";
import { useOnlineStatus } from "@/lib/use-online-status";
import { cn } from "@/lib/utils";

export const STALE_AFTER_MS = 6 * 60 * 60 * 1000;

export function useOfflineReadiness() {
  const [appCached, setAppCached] = useState<boolean>(() => {
    if (typeof navigator === "undefined") return false;
    const storageIsAvailable = "storage" in navigator && "estimate" in navigator.storage;
    return !storageIsAvailable;
  });

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const storageIsAvailable = "storage" in navigator && "estimate" in navigator.storage;
    if (!storageIsAvailable) return;

    void navigator.storage
      .estimate()
      .then((estimate) => {
        setAppCached(Boolean(estimate.usage && estimate.usage > 0));
      })
      .catch(() => setAppCached(true));
  }, []);
  return { appCached };
}

export function useUnsyncedCounts(scope = getActiveAccountScope()) {
  const [counts, setCounts] = useState({ pending: 0, failed: 0 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    let disposed = false;
    const refresh = async () => {
      try {
        const entries = await listOutbox(scope);
        if (disposed) return;
        const pending = entries.filter(
          (entry) =>
            entry.accountScope === scope &&
            (entry.state === "pending" || entry.state === "failed") &&
            entry.ownerUserId !== null,
        ).length;
        const failed = entries.filter(
          (entry) =>
            entry.accountScope === scope &&
            entry.state === "failed" &&
            entry.ownerUserId !== null,
        ).length;
        setCounts({ pending, failed });
      } catch {
        setCounts({ pending: 0, failed: 0 });
      }
    };
    void refresh();
    const handle = setInterval(() => void refresh(), 30_000);
    return () => {
      disposed = true;
      clearInterval(handle);
    };
  }, [scope]);
  return counts;
}

export function OfflineBannerView({
  online,
  lastSuccessfulSyncAt,
  pendingCount,
  failedCount,
  appCached = false,
  syncResultMessage,
  onDismiss,
}: {
  online: "unknown" | "online" | "offline";
  lastSuccessfulSyncAt: number | null;
  pendingCount: number;
  failedCount: number;
  appCached?: boolean;
  syncResultMessage?: string;
  onDismiss?: () => void;
}) {
  const { t, stamp } = usePrefs();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const totalPending = pendingCount + failedCount;
  const stale =
    lastSuccessfulSyncAt !== null && now - lastSuccessfulSyncAt > STALE_AFTER_MS;

  const tone =
    online === "offline" || stale || totalPending > 0 || online === "unknown"
      ? "warning"
      : "info";

  const networkLabel =
    online === "offline"
      ? "Offline"
      : online === "unknown"
        ? "Checking…"
        : syncResultMessage &&
            /timeout|network|failed to fetch|offline|unreachable/.test(
              syncResultMessage.toLowerCase(),
            )
          ? "Can't reach the server"
          : "Online";

  const lastSyncText =
    lastSuccessfulSyncAt === null
      ? "Not synced on this device yet"
      : `${stamp(lastSuccessfulSyncAt)}`;

  const infoText =
    "Information shown here may be old or incomplete. Always check official sources before travelling.";

  const banner = (
    <div
      className={cn(
        "border-b border-border/80",
        tone === "warning"
          ? "bg-amber-100/60 text-amber-950 dark:bg-amber-500/10 dark:text-amber-100"
          : "bg-blue-100/70 text-blue-950 dark:bg-blue-500/10 dark:text-blue-100",
      )}
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {tone === "warning" ? (
              <AlertTriangle aria-hidden className="size-4" />
            ) : (
              <Info aria-hidden className="size-4" />
            )}
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
              {online === "offline" ? (
                <WifiOff aria-hidden className="size-4" />
              ) : online === "unknown" ? (
                <Wifi aria-hidden className="size-4" />
              ) : (
                <CheckCircle2 aria-hidden className="size-4" />
              )}
              <span>{networkLabel}</span>
              <span className="text-xs font-normal opacity-80">{lastSyncText}</span>
            </div>
            <div className="text-sm opacity-90">
              <span>{t("offline.lastSync")}</span>: {lastSuccessfulSyncAt === null ? t("offline.notSynced") : stamp(lastSuccessfulSyncAt)}
            </div>
            <div className="text-sm opacity-90">
              {t("offline.pending")}: {totalPending}
            </div>
            <p className="text-sm opacity-90">{infoText}</p>
            {!appCached ? <p className="text-xs opacity-80">{t("offline.cachedWarning")}</p> : null}
            {totalPending > 0 ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link to="/reports" className="text-sm font-medium underline underline-offset-4">
                  {t("offline.viewReports")}
                </Link>
                <Button asChild size="sm" variant="secondary" className="h-8 rounded-full">
                  <Link to="/reports">{t("sync.now")}</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
        {onDismiss && tone === "info" ? (
          <button
            type="button"
            className="self-start rounded-md border border-current/20 px-2 py-1 text-xs font-medium"
            onClick={onDismiss}
            aria-label="Dismiss banner"
          >
            Dismiss
          </button>
        ) : null}
      </div>
    </div>
  );

  return banner;
}

export function OfflineBanner() {
  const online = useOnlineStatus();
  const syncState = useSyncState();
  const { appCached } = useOfflineReadiness();
  const { pending, failed } = useUnsyncedCounts();
  const [dismissed, setDismissed] = useState(false);
  const lastSuccessfulSyncAt = syncState.lastSuccessfulSyncAt;

  if (
    dismissed &&
    online === "online" &&
    pending + failed === 0 &&
    !syncState.lastResult
  ) {
    return null;
  }

  const shouldShow =
    online !== "online" ||
    pending + failed > 0 ||
    lastSuccessfulSyncAt === null ||
    (syncState.lastResult !== null &&
      /timeout|network|failed to fetch|offline|unreachable/.test(
        syncState.lastResult.message.toLowerCase(),
      ));

  if (!shouldShow) return null;

  return (
    <OfflineBannerView
      online={online}
      lastSuccessfulSyncAt={lastSuccessfulSyncAt}
      pendingCount={pending}
      failedCount={failed}
      appCached={appCached}
      syncResultMessage={syncState.lastResult?.message}
      onDismiss={
        pending + failed === 0 && syncState.lastResult === null
          ? () => setDismissed(true)
          : undefined
      }
    />
  );
}
