---
description: Trendstream Phase 0 - Database Implementation
---

# Database Implementation (MVP)

## Deliverables
- `supabase/migrations/0001_trendstream.sql` containing:
  - `raw_inputs` table (url, platform, json_dump).
  - `processed_patterns` table (title, score, abstract).
  - Basic RLS policies (tenant isolation).

## Steps
1. Create `0001_trendstream.sql`.
2. Write SQL for `raw_inputs`:
   ```sql
   create table raw_inputs (
     id uuid primary key default gen_random_uuid(),
     tenant_id uuid not null,
     url text,
     platform text,
     metadata jsonb,
     created_at timestamptz default now()
   );
   ```
3. Write SQL for `processed_patterns`.
4. Run `npx supabase migration up` (or manual apply if local only).
5. Generate types: `npx supabase gen types typescript --local > src/types/supabase.ts`.

## Verification
- Inspect `src/types/supabase.ts` to ensure tables exist.
