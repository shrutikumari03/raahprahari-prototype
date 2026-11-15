// src/components/EnvBanner.tsx
import { env } from "../config/env";

export function EnvBanner() {
  // Only demo shows a banner (synthetic-data warning). Development and pilot show none.
  if (env.appEnv !== "demo") return null;

  const text = "DEMO: yahan ka saara data synthetic (nakli) hai. Asli advisory nahi hai.";

  return (
    <div
      role="note"
      data-testid="env-banner"
      style={{
        background: "#fff8e1",
        color: "#5c3900",
        border: "1px solid #b26a00",
        padding: "0.5rem 0.75rem",
        textAlign: "center",
        fontWeight: 600,
      }}
    >
      {text}
    </div>
  );
}
