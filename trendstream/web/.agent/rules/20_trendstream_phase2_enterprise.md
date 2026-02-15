# Trendstream™ Phase 2 (Enterprise) Rules

## Compliance-first
- Compliance engine must run BEFORE remix/export by default (fail-closed option).
- Must support per-industry + per-channel rule packs (medical/beauty/finance/etc).
- Rules must be editable by tenant admins and versioned.

## Reporting
- Reports must be reproducible: store report_config + pipeline_version + dataset window.
- Must support weekly/monthly auto generation and export artifacts (PDF/HTML first; PPT later optional).

## Security / Audit / Approvals
- Multi-tenant isolation is mandatory (tenant_id).
- Add role-based access controls (RBAC) + approval workflow for:
  - publishing templates
  - exporting reports
  - changing compliance rules
- Audit log for all critical actions:
  - rule changes, approvals, report export, SSO config edits

## Implementation constraints
- No hard dependency on paid services.
- All API inputs validated with Zod.
- Provide deterministic fallback where possible.
