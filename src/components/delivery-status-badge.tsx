import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Save,
  ShieldAlert,
} from "lucide-react";
import { usePrefs } from "@/i18n/preferences";
import { deriveDeliveryStatus } from "@/lib/sync/delivery-status";
import type { OutboxRecord } from "@/lib/local-db";

export function DeliveryStatusBadge({
  outbox,
}: {
  outbox: OutboxRecord | null;
}) {
  const { t } = usePrefs();
  const status = deriveDeliveryStatus(outbox);
  const content = {
    server_received: { label: t("sync.received"), Icon: CheckCircle2 },
    rejected: {
      label: t("sync.rejected").replace(
        "{reason}",
        outbox?.lastErrorMessage ?? "",
      ),
      Icon: ShieldAlert,
    },
    waiting_for_sign_in: {
      label: t("sync.signInToContinue"),
      Icon: AlertCircle,
    },
    sending: { label: t("sync.sendingStatus"), Icon: LoaderCircle },
    retrying: {
      label: t("sync.retryingAt").replace(
        "{time}",
        new Date(outbox?.nextAttemptAt ?? 0).toLocaleString(),
      ),
      Icon: Clock3,
    },
    saved_not_delivered: { label: t("sync.savedNotDelivered"), Icon: Save },
  }[status];
  const Icon = content.Icon;
  const receipt = outbox?.metadataReceipt?.receiptId;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-border px-3 py-1 text-sm">
        <Icon aria-hidden className="size-4 shrink-0" />
        <span>{content.label}</span>
      </p>
      {status === "server_received" && receipt ? (
        <p className="max-w-full break-all font-mono text-xs text-muted-foreground">
          {t("sync.receiptId")}: {receipt}
        </p>
      ) : null}
    </div>
  );
}
