# Trendstream™ Phase 3.2 Rules (Auto Delivery)

## Delivery pipeline
- Report run -> export artifact -> delivery
- Delivery must be idempotent:
  - dedupe by (tenant_id, report_run_id, channel, format)
- Log every attempt to delivery_runs and notifications_log.

## Destinations
- Slack: send link + highlights
- Email: send link (preferred) + attachment optionally (pdf/pptx) if configured

## Security
- Never store raw secrets in DB.
- DB stores env-key references only (e.g. webhook_env_key, smtp_profile_env_key).
