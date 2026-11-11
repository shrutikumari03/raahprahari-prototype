import { Fragment, type ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { getActiveAccountScope } from "@/lib/account-scope";
import { subscribeAccountSession } from "@/lib/account-session";

export function AccountScopeBoundary({ children }: { children: ReactNode }) {
  const scope = useSyncExternalStore(
    subscribeAccountSession,
    getActiveAccountScope,
    () => "anonymous",
  );
  return <Fragment key={scope}>{children}</Fragment>;
}
