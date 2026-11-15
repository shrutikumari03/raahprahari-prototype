import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getAccountSession, useAccountSession } from "@/lib/account-session";
import { readLocal, writeLocal } from "@/lib/storage";
import { RAIL_COLLAPSED_KEY, type ShellPath } from "./nav";

/**
 * Rail collapsed state, remembered in localStorage. Read after mount so the
 * server and first client render match (expanded), like useLocalState.
 */
export function useRailCollapsed() {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCollapsed(readLocal<boolean>(RAIL_COLLAPSED_KEY, false) === true);
  }, []);
  const toggle = useCallback(() => {
    setCollapsed((current) => {
      writeLocal(RAIL_COLLAPSED_KEY, !current);
      return !current;
    });
  }, []);
  return { collapsed, toggle };
}

/**
 * Where a sign-in-only destination goes when the visitor is signed out: the
 * existing sign-in dialog opens and, once a session exists, navigation
 * continues to the original route. A signed-in visitor navigates directly.
 */
export function useGuardedNavigate(openLogin: () => void) {
  const navigate = useNavigate();
  const session = useAccountSession();
  const [returnTo, setReturnTo] = useState<ShellPath | null>(null);

  useEffect(() => {
    if (returnTo && session.status === "authenticated") {
      void navigate({ to: returnTo });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReturnTo(null);
    }
  }, [returnTo, session.status, navigate]);

  /** Returns true when sign-in was requested instead of navigating. */
  const requestSignIn = useCallback(
    (to: ShellPath) => {
      if (session.status === "authenticated") return false;
      setReturnTo(to);
      openLogin();
      return true;
    },
    [session.status, openLogin],
  );

  // Closing sign-in without a session drops the pending return. If sign-in
  // just succeeded, keep it so the effect above can continue to the route.
  const cancelReturn = useCallback(() => {
    if (getAccountSession().status !== "authenticated") setReturnTo(null);
  }, []);
  return { requestSignIn, cancelReturn, pendingReturn: returnTo };
}
