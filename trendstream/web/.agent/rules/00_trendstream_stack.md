# Trendstream™ Workspace Rules (MVP)

## Non-negotiables
- Use Next.js App Router + TypeScript.
- Use Tailwind + shadcn/ui for UI components.
- Use Supabase (Postgres) for auth + DB.
- Enforce multi-tenant isolation (tenant_id everywhere) and prepare RLS policies.
- No scraping that violates platform ToS. Ingestion must start with:
  1) user uploads (CSV/JSON)
  2) user-connected sources via official APIs/OAuth only (stub allowed)

## Architecture
- Follow 4-layer pipeline in code structure:
  ingest -> normalize -> intelligence (pattern extraction) -> serve (cards/remix/preflight)
- Separate raw vs normalized:
  - raw_events table: immutable append-only
  - metrics_normalized table: derived + recomputable
- Store "patterns" as abstract templates + evidence; do NOT store full copyrighted creative payloads as reusable assets.

## Code Quality
- Zod validation for all API inputs.
- Explicit error handling; no silent failures.
- Provide seed script + sample dataset for local testing.
- Provide at least 5 unit tests for normalization + scoring.

## Security
- Add audit_logs for critical actions (ingest, recompute, remix, export).
- Never log secrets. Use env vars.
