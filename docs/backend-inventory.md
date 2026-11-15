# RaahPrahari Backend Inventory

Date: 2026-11-15  |  Author: Swapnil Singh  |  Branch: swapnil-development
Method: Repo analysis via PowerShell & VS Code audit. No config/code modified.

## 1. Backend stack
| Item | Mila? | Status | Label | Notes |
|---|---|---|---|---|
| Supabase | Haan | Working | Keep | Primary backend and database platform |
| FastAPI / other backend | Nahi | Missing | Missing | No alternative backend found in repo |

## 2. Schema aur migrations
Migrations folder: `supabase/migrations/`
Migration files: 
- `20261114120000_ai_usage_rate_limit.sql` (Date: 2026-11-14)

| Table | Hai? | RLS on? | Label | Notes |
|---|---|---|---|---|
| segments | Nahi | - | Missing | Pending implementation in future migrations |
| profiles | Nahi | - | Missing | Pending implementation |
| roles/jurisdictions | Nahi | - | Missing | Pending implementation |
| reports | Nahi | - | Missing | Pending implementation |
| media | Nahi | - | Missing | Pending implementation |
| incidents | Nahi | - | Missing | Pending implementation |
| assessments | Nahi | - | Missing | Pending implementation |
| reviews | Nahi | - | Missing | Pending implementation |
| official updates | Nahi | - | Missing | Pending implementation |
| advisories | Nahi | - | Missing | Pending implementation |
| audit | Nahi | - | Missing | Pending implementation |
| follow-up | Nahi | - | Missing | Pending implementation |
| outbox | Nahi | - | Missing | Pending implementation |

PostGIS enabled: Unverified (Needs dashboard check)

## 3. Auth aur Storage
| Item | Provider | Status | Label | Notes |
|---|---|---|---|---|
| Login method | Supabase Auth | Unverified | Keep | Standard auth integration |
| Role source | Database / Token | Unverified | Improve | Needs strict server-side enforcement |
| Storage bucket(s) | Supabase Storage | Missing | Missing | Buckets not explicitly defined in current code |

## 4. Endpoints
| Name | Type (Edge Fn/RPC/REST) | Kaam | Status | Label |
|---|---|---|---|---|
| extract-hazard | Edge Function (`supabase/functions/`) | AI extraction for hazard reports | Working | Keep |
| consume_ai_quota | RPC Function (Database) | Rate limiting per user | Working | Keep |

## 5. Secret handling
| Item | Finding | Label |
|---|---|---|
| .env in .gitignore | Haan | Keep |
| .env.example hai | Unverified | Improve |
| .env kabhi Git me gaya | Nahi (Clean working tree) | Keep |
| Hardcoded keys code me | Nahi | Keep |
| service_role key frontend me | Nahi | Keep |

## 6. Top risks
1. Core application tables (segments, reports, incidents, etc.) are not yet defined in the migration files.
2. Storage buckets and public/private policy setup need verification.
3. Role checks should strictly rely on server-side RLS rather than frontend state.

## 7. Open questions
1. Are core schemas created directly via Supabase dashboard instead of migration files?