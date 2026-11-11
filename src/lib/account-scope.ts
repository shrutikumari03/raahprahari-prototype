import { getAccountSession } from "@/lib/account-session";

export function getActiveAccountScope(): string {
  const session = getAccountSession();
  return session.status === "authenticated"
    ? `user:${session.userId}`
    : "anonymous";
}
