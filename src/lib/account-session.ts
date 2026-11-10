import { useSyncExternalStore } from "react";

export type AccountSession =
  | { status: "loading"; userId: null }
  | { status: "signed_out"; userId: null }
  | { status: "authenticated"; userId: string };

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
  session = next;
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
  return accessTokenProvider ? accessTokenProvider() : null;
}
