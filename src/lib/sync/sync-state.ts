import { useSyncExternalStore } from "react";

export interface SyncRunSummary {
  status:
    | "idle"
    | "running"
    | "signed_out"
    | "offline"
    | "not_configured"
    | "nothing_to_send"
    | "complete"
    | "error";
  received: number;
  failed: number;
  message: string;
}

export interface SyncState {
  running: boolean;
  lastResult: SyncRunSummary | null;
  lastSuccessfulSyncAt: number | null;
  nextAttemptAt: number | null;
}

const listeners = new Set<() => void>();
let state: SyncState = {
  running: false,
  lastResult: null,
  lastSuccessfulSyncAt: null,
  nextAttemptAt: null,
};

function emit() {
  for (const listener of listeners) listener();
}

export function getSyncState() {
  return state;
}

export function setSyncState(patch: Partial<SyncState>) {
  state = { ...state, ...patch };
  emit();
}

export function subscribeSyncState(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSyncState() {
  return useSyncExternalStore(subscribeSyncState, getSyncState, getSyncState);
}
