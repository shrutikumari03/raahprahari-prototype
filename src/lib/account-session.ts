import { useSyncExternalStore } from "react";

export type AccountSession =
  | { status: "loading"; userId: null; expiresAt?: null }
  | { status: "signed_out"; userId: null; expiresAt?: null }
  | { status: "authenticated"; userId: string; expiresAt?: number | null };

type AccessTokenProvider = () => Promise<string | null>;

const listeners = new Set<() => void>();
let session: AccountSession = { status: "signed_out", userId: null };
let accessTokenProvider: AccessTokenProvider | null = null;

function emitChange() {
  for (const listener of listeners) listener();
}

export function getAccountSession() {
  return session;
}

export function setAccountSession(next: AccountSession) {
  if (
    next.status === "authenticated" &&
    typeof next.expiresAt === "number" &&
    next.expiresAt <= Date.now()
  ) {
    session = { status: "signed_out", userId: null };
  } else {
    session = next;
  }
  emitChange();
}

export function subscribeAccountSession(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAccountSession() {
  return useSyncExternalStore(
    subscribeAccountSession,
    getAccountSession,
    getAccountSession,
  );
}

export function setAccessTokenProvider(provider: AccessTokenProvider | null) {
  accessTokenProvider = provider;
}

export async function getAccessToken() {
  const current = getAccountSession();
  if (current.status !== "authenticated") return null;
  if (
    typeof current.expiresAt === "number" &&
    current.expiresAt <= Date.now()
  ) {
    setAccountSession({ status: "signed_out", userId: null });
    return null;
  }
  return accessTokenProvider ? accessTokenProvider() : null;
}
