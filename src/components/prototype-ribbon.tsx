import { FlaskConical } from "lucide-react";
import { en, hi } from "@/i18n/dictionary";
import { useAppStore } from "@/lib/app-store";

/**
 * The one prototype label. It has no variants and takes no props: every page
 * shows the same text ("Prototype mockup, synthetic data") in the same style.
 * Place it in a wrapper if a page needs to position it.
 */
export function PrototypeRibbon() {
  // Reads the language from the store so it also works on pages rendered without the full preference layer.
  const { lang } = useAppStore();
  return (
    <span
      data-testid="prototype-ribbon"
      className="glass-pill inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground"
    >
      <FlaskConical aria-hidden className="size-3" />
      {(lang === "hi" ? hi : en)["demo.badge"]}
    </span>
  );
}
