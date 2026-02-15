---
description: Trendstream Phase 0 - Bootstrap (MVP Vertical Slice)
---

# MVP Bootstrap Plan

This workflow sets up the initial "Vertical Slice" of Trendstream:
- Database Schema (Base)
- Basic UI Shell (Sidebar, Layout)
- Simple "Ingest -> List" flow.

## Steps

1. **Database Setup**
   - Run the initial migration.
   - [ ] Generate `supabase/migrations/0001_trendstream.sql` (Base Schema)
   - [ ] Tables: `tenants`, `raw_inputs` (videos/posts), `users` (stub).
   - [ ] Apply migration locally.

2. **Project Structure**
   - [ ] Verify `src/app`, `src/components`, `src/lib`.
   - [ ] Install dependencies: `lucide-react`, `clsx`, `tailwind-merge` (standard utils).
   - [ ] Create `src/lib/supabase/client.ts`.

3. **UI Shell**
   - [ ] Create `src/components/layout/sidebar.tsx`.
   - [ ] Create `src/app/layout.tsx` wrapper.
   - [ ] Create Dashboard Page `src/app/page.tsx`.

4. **Verify**
   - [ ] Run `npm run dev`.
   - [ ] Check http://localhost:3000 loads the shell.

## Dependencies
- None. This is the root workflow.
