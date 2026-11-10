import { getActiveAccountScope } from "@/lib/account-scope";
import {
  getAccountSession,
  subscribeAccountSession,
  type AccountSession,
} from "@/lib/account-session";
import type { OutboxRecord } from "@/lib/local-db";

export function canProcess(
  entry: OutboxRecord,
  scope: string,
  session: AccountSession,
) {
  return (
    session.status === "authenticated" &&
    session.userId.length > 0 &&
    scope === `user:${session.userId}` &&
    entry.accountScope === scope &&
    entry.ownerUserId === session.userId &&
    entry.reportId === entry.id &&
    entry.state !== "received" &&
    entry.state !== "rejected"
  );
}

export interface QueueRunResult {
  processed: number;
  skipped: number;
  aborted: boolean;
}

const activeRuns = new Map<string, Promise<QueueRunResult>>();

export function runQueue(options: {
  scope: string;
  entries: OutboxRecord[];
  signal?: AbortSignal;
  processItem: (entry: OutboxRecord, signal: AbortSignal) => Promise<void>;
}): Promise<QueueRunResult> {
  const existing = activeRuns.get(options.scope);
  if (existing) return existing;

  const run = (async () => {
    const controller = new AbortController();
    const abortForScopeChange = () => {
      if (getActiveAccountScope() !== options.scope)
        controller.abort(
          new DOMException("Account scope changed", "AbortError"),
        );
    };
    const abortFromCaller = () => controller.abort(options.signal?.reason);
    const unsubscribe = subscribeAccountSession(abortForScopeChange);
    options.signal?.addEventListener("abort", abortFromCaller, { once: true });
    if (options.signal?.aborted) abortFromCaller();

    let processed = 0;
    let skipped = 0;
    try {
      for (const entry of options.entries) {
        if (controller.signal.aborted) break;
        if (!canProcess(entry, options.scope, getAccountSession())) {
          skipped += 1;
          continue;
        }
        await options.processItem(entry, controller.signal);
        processed += 1;
      }
      return { processed, skipped, aborted: controller.signal.aborted };
    } finally {
      unsubscribe();
      options.signal?.removeEventListener("abort", abortFromCaller);
    }
  })();
  activeRuns.set(options.scope, run);
  void run.finally(() => {
    if (activeRuns.get(options.scope) === run) activeRuns.delete(options.scope);
  });
  return run;
}
