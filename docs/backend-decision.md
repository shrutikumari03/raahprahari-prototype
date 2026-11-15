# Backend Decision (BE1-02)

Date: 2026-11-15  |  Author: Swapnil Singh  |  Status: PROPOSED

## 1. Canonical backend
Ek hi backend: Supabase Auth + PostgreSQL/PostGIS + private Storage + TypeScript Edge Functions + restricted SQL/RPC.
Frontend: React PWA.

## 2. Repo me kya hai (BE1-01 se)
Scenario: A (Only Supabase is present)
Summary: The repository exclusively uses Supabase as its core backend stack, containing database migrations for rate limiting (`ai_usage`) and an Edge Function (`extract-hazard`). No conflicting alternative backends (like FastAPI) exist.

## 3. Doosre backends/providers ka kya hoga
| Item | Faisla (Keep/Migrate/Retire/Isolate) | Kab | Approval chahiye? |
|---|---|---|---|
| Supabase Core Stack | Keep | Immediate | No |

## 4. Python inference
Abhi: Nahi jodna. Tab jodenge jab kisi evaluated model ki zaroorat ho.

## 5. Kyun ye faisla
- Ek hi security model (RLS/roles ek jagah centralized hain).
- Ek hi migration sequence maintain hoti hai.
- Duplicate business logic code se bacha ja sakta hai.

## 6. Approval-needed actions (Destructive Rules)
Inme se koi bhi kaam karne se pehle team review aur explicit approval zaroori hai:
1. Koi bhi table, column ya data DROP / DELETE / TRUNCATE karna.
2. Kisi existing migration file ko edit ya delete karna (hamesha nayi migration jodo).
3. Auth provider badalna.
4. Storage provider ya bucket ki public/private setting badalna.
5. Naya backend/framework jodna (jaise FastAPI).
6. Production ya shared staging par migration chalana.
7. RLS policy hatana ya dheela karna.
8. Secret rotate ya delete karna.
9. `supabase db reset` jaise reset commands shared environment par chalana.

## 7. Open questions
1. Are all core schema tables (segments, reports, incidents) going to be added in a single comprehensive migration next?