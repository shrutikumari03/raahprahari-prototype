import { useEffect } from "react";
import { liveQuery } from "dexie";
import { getActiveAccountScope } from "@/lib/account-scope";
import { useAccountSession } from "@/lib/account-session";
import { listOutbox } from "@/lib/draft-repository";
import { getLastSyncAt, syncNow } from "@/lib/sync/sync-engine";
import { setSyncState } from "@/lib/sync/sync-state";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const session = useAccountSession();

  useEffect(() => {
    if (session.status !== "authenticated") return;
    const scope = getActiveAccountScope();
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastTriggerAt = 0;
    let disposed = false;

    setSyncState({ lastSuccessfulSyncAt: getLastSyncAt(scope) });

    const scheduleNextAttempt = async () => {
      if (timer) clearTimeout(timer);
      timer = null;
      try {
        const entries = await listOutbox(scope);
        if (disposed || getActiveAccountScope() !== scope) return;
        const times = entries
          .filter(
            (entry) =>
              entry.ownerUserId === session.userId &&
              !entry.authBlocked &&
              (entry.state === "pending" || entry.state === "failed"),
          )
          .map((entry) => entry.nextAttemptAt)
          .filter((at) => at > Date.now());
        const nextAttemptAt = times.length ? Math.min(...times) : null;
        if (!times.length) {
          setSyncState({ nextAttemptAt });
          return;
        }
        setSyncState({ nextAttemptAt });
        timer = setTimeout(
          () => trigger("foreground"),
          Math.max(0, (nextAttemptAt ?? Date.now()) - Date.now()),
        );
      } catch (error) {
        console.error("Unable to schedule the next report sync attempt", error);
      }
    };

    const trigger = (
      reason: "foreground" | "online" | "startup" | "background",
    ) => {
      if (disposed || getActiveAccountScope() !== scope) return;
      if (
        reason !== "startup" &&
        reason !== "background" &&
        document.visibilityState === "hidden"
      )
        return;
      if (Date.now() - lastTriggerAt < 1000) return;
      lastTriggerAt = Date.now();
      void syncNow({ reason }).finally(() => void scheduleNextAttempt());
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") trigger("foreground");
    };
    const onOnline = () => trigger("online");
    const onServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === "rp-sync") trigger("background");
    };
    const serviceWorker =
      "serviceWorker" in navigator ? navigator.serviceWorker : undefined;

    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onVisibilityChange);
    serviceWorker?.addEventListener("message", onServiceWorkerMessage);
    const subscription = liveQuery(() => listOutbox(scope)).subscribe({
      next: () => void scheduleNextAttempt(),
      error: (error) =>
        console.error("Unable to observe the sync queue", error),
    });
    trigger("startup");

    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      subscription.unsubscribe();
      window.removeEventListener("online", onOnline);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      serviceWorker?.removeEventListener("message", onServiceWorkerMessage);
    };
  }, [session.status, session.userId]);

  return children;
}
