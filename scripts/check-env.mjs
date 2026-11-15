// Checks that env example files are blank and safe, and that .gitignore protects real env files.
// Usage: node scripts/check-env.mjs
/* global console, process */
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

/** Returns [{ line, name, value }] for every KEY=VALUE line. Values are never printed. */
function parseEnvFile(relPath) {
  const full = resolve(root, relPath);
  if (!existsSync(full)) {
    errors.push(`${relPath}: file is missing.`);
    return null;
  }
  const entries = [];
  readFileSync(full, "utf8")
    .split(/\r?\n/)
    .forEach((raw, i) => {
      const text = raw.trim();
      if (!text || text.startsWith("#")) return;
      const eq = text.indexOf("=");
      if (eq === -1) {
        errors.push(`${relPath}:${i + 1}: line is not KEY=VALUE.`);
        return;
      }
      entries.push({
        line: i + 1,
        name: text.slice(0, eq).trim(),
        value: text.slice(eq + 1).trim(),
      });
    });
  return entries;
}

function checkBlank(relPath, entries) {
  for (const e of entries) {
    if (e.value !== "" && e.value !== '""' && e.value !== "''") {
      errors.push(
        `${relPath}:${e.line}: ${e.name} has a non-empty value. Examples must be blank.`,
      );
    }
  }
}

// A. Frontend example
const frontend = parseEnvFile(".env.example");
if (frontend) {
  checkBlank(".env.example", frontend);
  for (const e of frontend) {
    if (!e.name.startsWith("VITE_")) {
      errors.push(`.env.example:${e.line}: ${e.name} must start with VITE_.`);
    }
    if (/SECRET|SERVICE_ROLE|PRIVATE|PASSWORD/i.test(e.name)) {
      errors.push(
        `.env.example:${e.line}: ${e.name} looks like a secret and must not be a frontend variable.`,
      );
    }
  }
}

// B. Server example
const serverPath = "supabase/functions/.env.example";
const server = parseEnvFile(serverPath);
if (server) {
  checkBlank(serverPath, server);
  for (const e of server) {
    if (e.name.startsWith("VITE_")) {
      errors.push(
        `${serverPath}:${e.line}: ${e.name} must not use the VITE_ prefix.`,
      );
    }
    if (e.name.startsWith("SUPABASE_")) {
      errors.push(
        `${serverPath}:${e.line}: ${e.name} must not be declared; Supabase provides SUPABASE_* automatically.`,
      );
    }
  }
}

// C. .gitignore rules, in an order where the negations take effect
const gitignorePath = resolve(root, ".gitignore");
if (!existsSync(gitignorePath)) {
  errors.push(".gitignore: file is missing.");
} else {
  const rules = readFileSync(gitignorePath, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  const idx = (rule) => rules.lastIndexOf(rule);
  const required = [
    ".env",
    ".env.*",
    "!.env.example",
    "*.local",
    "supabase/functions/.env",
    "supabase/functions/.env.*",
    "!supabase/functions/.env.example",
  ];
  for (const rule of required) {
    if (idx(rule) === -1) errors.push(`.gitignore: missing rule "${rule}".`);
  }
  const ordered = [
    [".env.*", "!.env.example"],
    ["supabase/functions/.env.*", "!supabase/functions/.env.example"],
  ];
  for (const [ignore, keep] of ordered) {
    if (idx(ignore) !== -1 && idx(keep) !== -1 && idx(keep) < idx(ignore)) {
      errors.push(
        `.gitignore: "${keep}" must come after "${ignore}" or it has no effect.`,
      );
    }
  }

  // Ask git itself (skipped silently when git is unavailable).
  try {
    const ignored = (p) => {
      try {
        execFileSync("git", ["check-ignore", "-q", p], {
          cwd: root,
          stdio: "ignore",
        });
        return true;
      } catch (err) {
        if (err.status === 1) return false;
        throw err;
      }
    };
    for (const p of [".env", ".env.production", "supabase/functions/.env"]) {
      if (!ignored(p)) errors.push(`git does not ignore ${p}.`);
    }
    for (const p of [".env.example", "supabase/functions/.env.example"]) {
      if (ignored(p)) errors.push(`git ignores ${p}, but it must be tracked.`);
    }
  } catch {
    console.warn(
      "check:env: git not available, skipped git check-ignore verification.",
    );
  }
}

if (errors.length > 0) {
  console.error("check:env FAILED");
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log("check:env OK");
