---
description: Trendstream Phase 3 - Scheduler (Jobs)
---

# Scheduler V1

## Goal
Run recurring jobs like data sync or report generation.

## Steps
1. **API Route**:
   - `POST /api/cron` (protected by Bearer token).
   - Validates `CRON_SECRET`.
   - Dispatches job based on query param `?job=sync_youtube`.
2. **Job Logic**:
   - `src/jobs/sync_youtube.ts`.
   - Update `job_runs` table (status='running').
   - Do work.
   - Update `job_runs` (status='completed').

## Verification
- Use Postman to call `/api/cron?job=test_job` with header.
- Check DB for `job_run` record.
