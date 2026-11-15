// src/components/EnvBanner.tsx
import { env } from "../config/env";

export function EnvBanner() {
  if (env.appEnv === "pilot") return null; // pilot me banner nahi

  const text =
    env.appEnv === "demo"
      ? "DEMO: yahan ka saara data synthetic (nakli) hai. Asli advisory nahi hai."
      : "DEVELOPMENT build: sirf testing ke liye.";

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
