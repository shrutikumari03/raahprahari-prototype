# Environments

RaahPrahari runs in three isolated environments. Each has its own Supabase project, keys and secrets.

| Environment | `APP_ENV` value | Purpose                             | Data                     |
| ----------- | --------------- | ----------------------------------- | ------------------------ |
| Development | `development`   | Local testing                       | Test data                |
| Demo        | `demo`          | Judges, partners and demonstrations | Synthetic data only      |
| Pilot       | `pilot`         | Authorized partner trial            | Real data after approval |

## Rules

1. Each environment uses a separate Supabase project. Never point two environments at one project.
2. Each environment uses its own keys and secrets. Never reuse a key across environments.
3. Demo uses only synthetic data and isolated demo identities. Do not load real reports or real accounts.
4. Pilot stays inactive until all of these are in place: authorized partners, staffed review, legal and privacy review, and release approval.
5. `VITE_` variables are public. The build copies them into the browser bundle.
6. The `service_role` key (and the newer `sb_secret_` key) is server-only. It never goes in a `VITE_` variable or in frontend code.
7. Real `.env` files are never committed. Only the blank `.env.example` files are tracked.
8. In connected mode, roles come from the backend. Do not switch roles on the client.

## Banner

`EnvBanner` is rendered once in `src/routes/__root.tsx`, below the site header.

- development: "DEVELOPMENT build" warning
- demo: synthetic-data warning
- pilot: no banner

## Frontend variables

Template: `.env.example`. Copy it to `.env.local` (or `.env.demo.local` / `.env.pilot.local` for the other modes) and fill in the values.

| Variable                 | Meaning                                           |
| ------------------------ | ------------------------------------------------- |
| `VITE_APP_ENV`           | `development`, `demo` or `pilot`                  |
| `VITE_SUPABASE_URL`      | Project URL                                       |
| `VITE_SUPABASE_ANON_KEY` | Anon / publishable key (public, protected by RLS) |

`src/config/env.ts` validates these at startup. It fails with a clear error when a value is missing or invalid, when `VITE_APP_ENV` is not one of the three values, or when the anon key is a secret key. The error names the variable and never prints its value.

## Server variables (Edge Functions)

Template: `supabase/functions/.env.example`. Copy it to `supabase/functions/.env` for local runs.

| Variable                    | Required | Source                                               |
| --------------------------- | -------- | ---------------------------------------------------- |
| `APP_ENV`                   | Yes      | You set it. Must match the frontend `VITE_APP_ENV`.  |
| `SUPABASE_URL`              | Yes      | Provided automatically by the Supabase runtime.      |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes      | Provided automatically by the Supabase runtime.      |
| `AI_API_KEY`                | No       | You set it. If absent, AI is treated as unavailable. |

Do not declare `SUPABASE_*` variables in the example file. Custom secrets starting with `SUPABASE_` cannot be set.

`supabase/functions/_shared/env.ts` exports `loadServerEnv()` and `safeEnvSummary()`. Call `loadServerEnv()` when a function starts. It throws one error that lists every problem by variable name. `safeEnvSummary()` returns only booleans and the environment name, so it is safe to log.

## Setup

### Development

1. `cp .env.example .env.local` (Windows: `copy .env.example .env.local`).
2. Create a dedicated development Supabase project. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, and set `VITE_APP_ENV=development`.
3. `cp supabase/functions/.env.example supabase/functions/.env` and set `APP_ENV=development`.
4. Set secrets for the project: `supabase secrets set APP_ENV=development` (add `AI_API_KEY` if needed).
5. `pnpm dev`. The development banner should appear.

### Demo

1. Create a separate demo Supabase project with its own keys. Load synthetic data only.
2. Create `.env.demo.local` with `VITE_APP_ENV=demo` and the demo project's URL and anon key.
3. Set `APP_ENV=demo` as a secret on the demo project.
4. `pnpm exec vite --mode demo`. The synthetic-data banner should appear.

### Pilot (preparation only)

1. Do not create real credentials until rule 4 above is satisfied.
2. Create a separate pilot Supabase project. Enable RLS and review policies before any real data is added.
3. Prepare `.env.pilot.local` with `VITE_APP_ENV=pilot`, and set `APP_ENV=pilot` as a secret on the pilot project.
4. Release approval is a manual step. The pilot build shows no banner, so confirm the environment before announcing it.

## Validation

```bash
pnpm check:env      # example files are blank, no secret names, .gitignore rules are correct
pnpm typecheck
pnpm test
pnpm build
```

`check:env` prints `check:env OK` on success. It fails if an example file has a value, a frontend variable lacks the `VITE_` prefix, a secret-like name appears, a server example declares `VITE_` or `SUPABASE_` variables, or `.gitignore` is missing a rule.

## If a secret leaks

Rotate it in the Supabase dashboard first, then remove it from the file or commit. Removing it from Git history does not make it safe again.
