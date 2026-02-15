# Trendstream™ Phase 3 Rules (Automation & Enterprise Ops)

## Automation
- Scheduled jobs must be idempotent (safe to run twice).
- Every job run must write a job_run record with status + duration + error snapshot.
- All cron endpoints must be protected with CRON_SECRET (Bearer token).

## Notifications
- Do not spam: dedupe by (tenant_id, type, subject_id, window).
- Support Slack webhook first; SMTP optional.
- All notifications must be logged.

## PPTX Export
- Export must be deterministic for a given report_run id.
- Export must require permission report.export (or approval if enabled).

## Marketplace
- Rule packs must be versioned and signed with publisher tenant_id.
- Install creates a copy into tenant scope (no shared mutable state).
- Publishing requires approval and audit logs.

## Data hygiene
- Keep raw_events immutable.
- Periodic cleanup for old transient artifacts is allowed (by retention policy).
